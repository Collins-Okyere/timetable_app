import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/services/api.service';
import { NonDbService } from '../shared/services/nondb.service';
import { ModalService } from '../shared/reusable-components/modals/modal/modal.service';
import { SidebarService } from './side-bar.service';

@Component({
  selector: 'app-main-app',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainAppComponent implements OnInit {

  currUser: any;
  userRole: any = '';
  menu: any = [];
  userMenu: any = [
    {
      page: 'profile',
      pageName: 'Profile',
    },
    {
      page: 'logout',
      pageName: 'Logout',
    },
  ];
  pageName: string = '';
  nonDB:any
  isSidebarOpen:any = true;
  largeSidebar = true
  activeIndex: number = 0;

  constructor(
    private readonly api: ApiService,
    private readonly router: Router,
    private readonly noDB: NonDbService,
    private modalService: ModalService,
    private sidebarService: SidebarService
  ) {}


  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe((isOpen: boolean) => {
      this.isSidebarOpen = isOpen;
    });
    
    this.initData();
  }

  private initData() {
    setTimeout(() => {
    this.currUser = this.noDB.currUser
    this.userRole = this.noDB.currUser?.user_role; 
    if (this.userRole && this.noDB?.menu) {
      this.getMenu()
    } else {
      this.api.signOut();
      this.api.toast.showToast("An error occured. Please try again.", 'error');
    }   
      
    }, 500) 
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }

  private getMenu(){
    this.menu = this.noDB.menu.map((m: any) => ({ 
    ...m,subPages: m.subPages?.filter((sub: any) => sub.roles?.includes(this.userRole)) || [] 
    })).filter((m: any) => m.roles?.includes(this.userRole));
    const url = this.router.url.split('/');
    const page = url[url.length - 1];
    this.getPage(page);
  }

  openModal(item: any) {
    if (!item.isModal || !item.component) return;

    this.modalService.openModal({
      isOpen: true,
      title: item.pageName,
      component: item.component,
      width: 'lg',
    });
  }

  getPage(page: string) {
    if(page == 'logout'){
      this.api.signOut();
      return;
    }
    const allMenu = [...this.menu, ...this.userMenu];
    allMenu.forEach((item: any) => {
      item.is_active = item.page === page;
      item.subPages?.forEach((subPage: any) => {
        subPage.is_active = subPage.page === page;
        if (subPage.is_active && !item.is_active) {
          item.is_active = true;
        }
      }); 
    });
    if(page === allMenu[0]){
      this.activeIndex = 0
    }else{
    this.activeIndex = allMenu.findIndex(item => item.is_active);
    }
    let currentPage = allMenu.find((item: any) => item.is_active);
    if (currentPage) {
      this.pageName = currentPage.pageName;
      let role = this.userRole == 'super_admin' ? 'admin' : this.userRole;
      let openPage = `/${role}/${currentPage.page}`;
      if (currentPage.subPages?.length > 0 && page !== currentPage.page) {
        openPage += `/${page}`;
      }
      this.router.navigate([openPage]);
    }
    this.isSidebarOpen = window.innerWidth >= 1024;  
  }  

  
}
