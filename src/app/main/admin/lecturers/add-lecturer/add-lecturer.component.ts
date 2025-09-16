import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaUploadService } from '../../../../shared/reusable-components/media-upload/media-upload.service';
import { SelectInputComponent } from '../../../../shared/reusable-components/select-input/select-input.component';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-add-lecturer',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectInputComponent],
  providers: [DatePipe],
  templateUrl: './add-lecturer.component.html',
  styleUrl: './add-lecturer.component.css'
})
export class AddLecturerComponent {

  user:any
  userDetails:any
  lastLecturerId: string = ''
  lecturer: any = {
    photo: 'assets/user.png',
    gender: 'Male',
    faculties: [],
    courses: [],
    departments: []
  };
  fetchedData:any
  displayImage:any
  refreshSelect = true;
  formValid = false

  constructor(private datePipe: DatePipe, private readonly api: ApiService, private mediaService: MediaUploadService, private router: Router) {}

  async ngOnInit() {
    this.setLecturer();
  }
  
  async setLecturer() {
    const neededData:any = ['faculties','courses','lecturers','departments']
    this.refreshSelect = false
    this.fetchedData = await this.api.fetchData([...neededData])
    this.displayImage = 'assets/user.png';
    this.lecturer.user_role = 'lecturer'
    this.lecturer.user_id = 'lecturer'
    // await this.api.makeRequest('GET', 'add_lecturers/init', {}).then(async (data: any) => {
    //   if (data && data.newLecturerId) {
    //     this.lastLecturerId = data.lastLecturerId;
    //     this.lecturer.lecturer_id = data.newLecturerId;
    //   } else {
    //     this.lecturer.lecturer_id = ''; 
    //   }
    // }).then(() => {
    //   this.lecturer.photo = 'assets/user.png';
      setTimeout(() => {
        this.refreshSelect = true

      })
    // });
  }

  onSelectionChanged(field: string, value: any) {
    this.lecturer[field] = value.id ?? value;
  }
  
  async saveLecturer() {
    if(this.lecturer.first_name && this.lecturer.gender && this.lecturer.user_role && this.lecturer.faculties && this.lecturer.courses && this.lecturer.departments && this.lecturer.user_id){
      this.formValid = true
    }
    if(!this.formValid){
      this.api.toast.showToast('Please check all required fields.', 'error');
      return
    }
    const formData = new FormData();
    const isBlob = this.lecturer.photo instanceof Blob;
    if (!isBlob) {
      const fallback = 'assets/user.png';
      const photoUrl = this.lecturer.photo || fallback;
      this.lecturer.photo = await this.api.getBlob(photoUrl);
    }
    formData.append('photo', this.lecturer.photo, 'lecturer-photo.jpg');
    const lecturerPayload = { ...this.lecturer };
    delete lecturerPayload.photo;
    formData.append('lecturer', JSON.stringify(lecturerPayload));
    const userRole:any = this.api.safeJSONParse('currUser').user_role;
    // this.api.makeRequest('POST', 'add_lecturers/create/', formData, true).then(async (data: any) => {
      // if (data.lecturer) {
      //   this.api.addLocalStorage('tempData', data.lecturer);
      //   this.router.navigate([`${userRole}/manage_lecturers`]);
      // }
    // }).catch((error: any) => {
    //   this.api.toast.showToast('Please check all required fields.', 'error');
    // });
    this.reset()
  }
  
  reset() {
    this.refreshSelect = false;
    setTimeout(() => 
      {
      this.lecturer = {
        photo: 'assets/user.png',
        gender: 'Male',
        departments: [],
        courses: [],
        faculties: []
      };
      this.setLecturer();
      this.refreshSelect = true
    }, 0);
  }
  

  openUploadModal() {
    this.mediaService.openModal({
      title: 'Upload Avatar',
      image: this.lecturer.photo,
      okAction: (croppedImage: any) => this.saveImage(croppedImage)
    });
  }  
  
  saveImage(event: any) {
    this.displayImage = event.url
    this.lecturer.photo = event.blob
  }

}
