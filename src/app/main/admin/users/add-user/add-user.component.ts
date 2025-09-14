import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { MediaUploadService } from '../../../../shared/reusable-components/media-upload/media-upload.service';
import { SelectInputComponent } from '../../../../shared/reusable-components/select-input/select-input.component';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectInputComponent],
  providers: [DatePipe],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  userDetails:any
  lastUserId: string = ''
  user: any = {
    photo: 'assets/user.png',
    gender: 'Male'
  };
  initData:any
  displayImage:any
  refreshSelect = true;
  formSubmitted = false
  neededData:any = []
  branch:any
  
  constructor(private datePipe: DatePipe, private readonly api: ApiService, private mediaService: MediaUploadService, private router: Router) {}

  async ngOnInit() {
    this.setUser();
  }
  
  async setUser() {
    const neededData:any = ['organisations']
    this.refreshSelect = false
    this.initData = await this.api.fetchData([...neededData])
    this.displayImage = 'assets/user.png';
    // await this.api.makeRequest('GET', 'users/init', {}).then(async (data: any) => {
    //   if (data && data.newUserId) {
    //     this.lastUserId = data.lastUserId;
    //     this.user.user_id = data.newUserId;
    //   } else {
    //     this.user.user_id = ''; 
    //   }
    // }).then(() => {
    //   this.user.photo = 'assets/user.png';
    setTimeout(() => {
      this.user.onboarding_date = this.datePipe.transform(this.user.onboarding_date, 'yyyy-MM-dd');
      this.user.date_of_birth = this.datePipe.transform(this.user.date_of_birth, 'yyyy-MM-dd');
      this.refreshSelect = true

    })
    // });
  }

  onSelectionChanged(field: string, value: any) {
    this.user[field] = value.id ?? value;
  }
  
  async saveUser() {
    if(this.user.first_name && this.user.last_name && this.user.user_id && this.user.gender){
      this.formSubmitted = true
      const formData = new FormData();
      const isBlob = this.user.photo instanceof Blob;
      if (!isBlob) {
        const fallback = 'assets/user.png';
        const photoUrl = this.user.photo || fallback;
        this.user.photo = await this.api.getBlob(photoUrl);
      }
      formData.append('photo', this.user.photo, 'user-photo.jpg');
      const userPayload = { ...this.user };
      delete userPayload.photo;
      formData.append('user', JSON.stringify(userPayload));
      const userRole:any = this.api.safeJSONParse('currUser').user_role;
      this.api.makeRequest('POST', 'users/create/', formData, true).then(async (data: any) => {
        if (data.user) {
          this.api.addLocalStorage('tempData', data.user);
          this.router.navigate([`${userRole}/manage_users`]);
        }
      }).catch((error: any) => {
        this.api.toast.showToast('Please check all required fields.', 'error');
      });
    }else{
      this.formSubmitted = true
      this.api.toast.showToast('Please check all required fields.', 'error');
    }
  }
  
  reset() {
    this.refreshSelect = false;
    setTimeout(() => 
      {
      this.user = {
        photo: 'assets/user.png',
        gender: 'Male',
        relations: [],
        groups: [],
        date_of_birth: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        onboarding_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      };
      this.setUser();
      this.refreshSelect = true
    }, 0);
  }
  

  openUploadModal() {
    this.mediaService.openModal({
      title: 'Upload Avatar',
      image: this.user.photo,
      okAction: (croppedImage: any) => this.saveImage(croppedImage)
    });
  }  
  
  saveImage(event: any) {
    this.displayImage = event.url
    this.user.photo = event.blob
  }

}
