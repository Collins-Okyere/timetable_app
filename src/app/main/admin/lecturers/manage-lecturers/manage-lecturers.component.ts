import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { SelectInputComponent } from '../../../../shared/reusable-components/select-input/select-input.component';

@Component({
  selector: 'app-manage-lecturers',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectInputComponent],
  templateUrl: './manage-lecturers.component.html',
  styleUrl: './manage-lecturers.component.css'
})
export class ManageLecturersComponent implements OnInit {
  
  Math = Math
  lecturers: any[] = [];
  search: string = '';
  selectedlecturer: any;
  showModal: boolean = false;
  modalMode: 'view' | 'edit' | 'add' | null = null;
  fetchedData: any;
  showDeleteModal: boolean = false;
  refreshSelect:boolean = true;
  page:number = 1;
  pageSize: number = 15
  hideStats:any = true
  user:any

  constructor(private api: ApiService) {}

  async ngOnInit() {
    this.user = this.api.safeJSONParse('currUser')
    this.refreshSelect = false;
    const neededData: any = ['lecturers', 'countries', 'organisations'];
    this.fetchedData = await this.api.fetchData([...neededData]);
    setTimeout(() => {
      this.lecturers = this.fetchedData.lecturers;
      this.refreshSelect = true
    }, 0)
  }

  get getStats() {
    const totalLecturers = this.lecturers.length;
    const newLecturers = this.lecturers.filter((u: any) => u.is_new).length;
    const activeLecturers = this.lecturers.filter((u: any) => u.is_active).length;
    const maleLecturers = this.lecturers.filter((u: any) => u.gender === 'Male').length;
    const femaleLecturers = this.lecturers.filter((u: any) => u.gender === 'Female').length;
    return { totalLecturers, newLecturers, activeLecturers, maleLecturers, femaleLecturers };
  }

  get filteredLecturers(): any[] {
    if (!this.search) return this.lecturers;
    const term = this.search.toLowerCase();
    return this.lecturers.filter((u: any) =>
      Object.values(u).some((val: any) =>
        val && val.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddlecturer() {
    this.selectedlecturer = {
      id: null,
      lecturername: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      gender: 'Male',
      lecturer_role: 'lecturer',
      is_active: true,
      is_new: true,
      country: this.fetchedData.countries[0],
      created: new Date().toISOString().split('T')[0],
      photo: 'assets/user.png',
    };
    this.modalMode = 'add';
    this.showModal = true;
  }

  editlecturer(lecturer: any) {
    this.selectedlecturer = { ...lecturer};
    this.modalMode = 'edit';
    this.showModal = true;
  }

  viewlecturer(lecturer: any) {
    this.selectedlecturer = { ...lecturer};
    this.modalMode = 'view';
    this.showModal = true;
  }

  savelecturer() {
    let action: string = ''
    if (this.modalMode === 'add') {
      action = 'saved'
      this.selectedlecturer.id = Date.now();
      this.lecturers.push({ ...this.selectedlecturer });
    } else if (this.modalMode === 'edit') {
      action = 'updated'
      const idx = this.lecturers.findIndex((u: any) => u.id === this.selectedlecturer.id);
      if (idx !== -1) {
        this.lecturers[idx] = { ...this.selectedlecturer };
      }
    }
    this.closeModal();
    this.api.toast.showToast(`lecturer ${action} sucessfully!`, 'success');
  }

  confirmDelete(lecturer: any) {
    this.selectedlecturer = lecturer;
    this.showDeleteModal = true;
  }

  deletelecturerConfirmed() {
    if (this.selectedlecturer) {
      this.lecturers = this.lecturers.filter((u: any) => u.id !== this.selectedlecturer.id);
      this.selectedlecturer = null;
    }
    this.showDeleteModal = false;
    this.api.toast.showToast('lecturer deleted successfully', 'success')
  }

  cancelDelete() {
    this.selectedlecturer = null;
    this.showDeleteModal = false;
  }

  closeModal() {
    this.showModal = false;
    this.modalMode = null;
    this.selectedlecturer = null;
  }

  toggleMenu(lecturer: any) {
    this.lecturers.forEach((u) => {
      if (u !== lecturer) u.showMenu = false;
    });
    lecturer.showMenu = !lecturer.showMenu;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.lecturers.forEach((u) => (u.showMenu = false));
    }
  }

  onSelectionChanged(key: string, value: any){
    this.selectedlecturer[key] = value
  }

  resetPage() {
    this.page = 1;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredLecturers.length / this.pageSize));
  }


}
