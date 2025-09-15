import { Component, HostListener } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectInputComponent } from '../../../../shared/reusable-components/select-input/select-input.component';

@Component({
  selector: 'app-manage-admins',
  standalone: true,
  imports: [CommonModule, SelectInputComponent, FormsModule],
  providers: [DatePipe],
  templateUrl: './manage-admins.component.html',
  styleUrl: './manage-admins.component.css'
})
export class ManageAdminsComponent {
  
  Math = Math
  users: any[] = [];
  search: string = '';
  selectedUser: any;
  showModal: boolean = false;
  modalMode: 'view' | 'edit' | 'add' | null = null;
  fetchedData: any;
  showDeleteModal: boolean = false;
  refreshSelect:boolean = true;
  page:number = 1;
  pageSize: number = 15
  hideStats:any = true

  constructor(private api: ApiService) {}

  async ngOnInit() {
    this.refreshSelect = false;
    const neededData: any = ['users', 'countries'];
    this.fetchedData = await this.api.fetchData([...neededData]);
    setTimeout(() => {
      this.users = this.fetchedData.users;
      this.refreshSelect = true
    }, 0)
  }

  get getStats() {
    const totalUsers = this.users.length;
    const newUsers = this.users.filter((u: any) => u.is_new).length;
    const activeUsers = this.users.filter((u: any) => u.is_active).length;
    const maleUsers = this.users.filter((u: any) => u.gender === 'Male').length;
    const femaleUsers = this.users.filter((u: any) => u.gender === 'Female').length;
    return { totalUsers, newUsers, activeUsers, maleUsers, femaleUsers };
  }

  get filteredUsers(): any[] {
    if (!this.search) return this.users;
    const term = this.search.toLowerCase();
    return this.users.filter((u: any) =>
      Object.values(u).some((val: any) =>
        val && val.toString().toLowerCase().includes(term)
      )
    );
  }

  openAddUser() {
    this.selectedUser = {
      id: null,
      username: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      gender: 'Male',
      user_role: 'lecturer',
      is_active: true,
      is_new: true,
      country: this.fetchedData.countries[0],
      created: new Date().toISOString().split('T')[0],
      photo: 'assets/user.png',
    };
    this.modalMode = 'add';
    this.showModal = true;
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.modalMode = 'edit';
    this.showModal = true;
  }

  viewUser(user: any) {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.showModal = true;
  }

  saveUser() {
    let action: string = ''
    if (this.modalMode === 'add') {
      action = 'saved'
      this.selectedUser.id = Date.now();
      this.users.push({ ...this.selectedUser });
    } else if (this.modalMode === 'edit') {
      action = 'updated'
      const idx = this.users.findIndex((u: any) => u.id === this.selectedUser.id);
      if (idx !== -1) {
        this.users[idx] = { ...this.selectedUser };
      }
    }
    this.closeModal();
    this.api.toast.showToast(`User ${action} sucessfully!`, 'success');
  }

  confirmDelete(user: any) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  deleteUserConfirmed() {
    if (this.selectedUser) {
      this.users = this.users.filter((u: any) => u.id !== this.selectedUser.id);
      this.selectedUser = null;
    }
    this.showDeleteModal = false;
        this.api.toast.showToast('User deleted successfully', 'success')
  }

  cancelDelete() {
    this.selectedUser = null;
    this.showDeleteModal = false;
  }

  closeModal() {
    this.showModal = false;
    this.modalMode = null;
    this.selectedUser = null;
  }

  toggleMenu(user: any) {
    this.users.forEach((u) => {
      if (u !== user) u.showMenu = false;
    });
    user.showMenu = !user.showMenu;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.users.forEach((u) => (u.showMenu = false));
    }
  }

  onSelectionChanged(key: string, value: any){
    this.selectedUser[key] = value
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
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

}
