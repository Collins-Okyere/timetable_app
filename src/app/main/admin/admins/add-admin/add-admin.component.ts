import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MediaUploadService } from '../../../../shared/reusable-components/media-upload/media-upload.service';
import { ApiService } from '../../../../shared/services/api.service';
import { SelectInputComponent } from '../../../../shared/reusable-components/select-input/select-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectInputComponent],
  providers: [DatePipe],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {

  lastAdminId: string = ''
  admin: any = {
    photo: 'assets/user.png',
    gender: 'Male'
  };
  fetchedData:any
  displayImage:any
  refreshSelect = true;
  formValid = false
  
  constructor(private datePipe: DatePipe, private readonly api: ApiService, private mediaService: MediaUploadService, private router: Router) {}

  async ngOnInit() {
    this.setAdmin();
  }
  
  async setAdmin() {
    // const neededData:any = ['']
    this.refreshSelect = false
    this.displayImage = 'assets/user.png';
    // await this.api.makeRequest('GET', 'admins/init', {}).then(async (data: any) => {
    //   if (data && data.newadminId) {
    //     this.lastAdminId = data.lastAdminId;
    //     this.admin.admin_id = data.newadminId;
    //   } else {
    //     this.admin.admin_id = ''; 
    //   }
    // }).then(() => {
      this.admin.photo = 'assets/user.png';
      this.admin.user_role = 'admin';
      this.admin.gender = 'Male';
      setTimeout(() => {
        // this.admin.onboarding_date = this.datePipe.transform(this.admin.onboarding_date, 'yyyy-MM-dd');
        // this.admin.date_of_birth = this.datePipe.transform(this.admin.date_of_birth, 'yyyy-MM-dd');
        this.refreshSelect = true
      })
    // });
  }

  onSelectionChanged(field: string, value: any) {
    this.admin[field] = value.id ?? value;
  }
  
  async saveAdmin() {
    if(this.admin.first_name && this.admin.gender && this.admin.user_role && this.admin.user_id){
      this.formValid = true
    }
    if(!this.formValid){
      this.api.toast.showToast('Please check all required fields.', 'error');
      return
    }
    const formData = new FormData();
    const isBlob = this.admin.photo instanceof Blob;
    if (!isBlob) {
      const fallback = 'assets/user.png';
      const photoUrl = this.admin.photo || fallback;
      this.admin.photo = await this.api.getBlob(photoUrl);
    }
    formData.append('photo', this.admin.photo, 'admin-photo.jpg');
    const adminPayload = { ...this.admin };
    delete adminPayload.photo;
    formData.append('admin', JSON.stringify(adminPayload));
    const userRole:any = this.api.safeJSONParse('currUser').user_role;
    // this.api.makeRequest('POST', 'admins/create/', formData, true).then(async (data: any) => {
    //   if (data.admin) {
    //     this.api.addLocalStorage('tempData', data.admin);
    //     this.router.navigate([`${userRole}/manage_admins`]);
    //   }
    // }).catch((error: any) => {
    //   this.api.toast.showToast('Please check all required fields.', 'error');
    // });
    this.reset()
  }
  
  reset() {
    this.refreshSelect = false;
    setTimeout(() =>  {
      this.admin = {
        photo: 'assets/user.png',
        gender: 'Male',
        user_role: 'admin'
      };
      this.setAdmin();
      this.refreshSelect = true
    }, 0);
  }
  

  openUploadModal() {
    this.mediaService.openModal({
      title: 'Upload Avatar',
      image: this.admin.photo,
      okAction: (croppedImage: any) => this.saveImage(croppedImage)
    });
  }  
  
  saveImage(event: any) {
    this.displayImage = event.url
    this.admin.photo = event.blob
  }


}
