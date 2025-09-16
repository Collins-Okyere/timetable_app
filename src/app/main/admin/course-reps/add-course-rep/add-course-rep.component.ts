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
  templateUrl: './add-course-rep.component.html',
  styleUrl: './add-course-rep.component.css'
})
export class AddCourseRepComponent {

  userDetails:any
  lastCourseRepId: string = ''
  courseRep: any = {
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
    this.setCourseRep();
  }
  
  async setCourseRep() {
    const neededData:any = ['faculties','courses','lecturers','departments']
    this.refreshSelect = false
    this.fetchedData = await this.api.fetchData([...neededData])
    this.displayImage = 'assets/user.png';
    this.courseRep.user_role = 'lecturer'
    this.courseRep.user_id = 'lecturer'
    // await this.api.makeRequest('GET', 'add_lecturers/init', {}).then(async (data: any) => {
    //   if (data && data.newCourseRepId) {
    //     this.lastCourseRepId = data.lastCourseRepId;
    //     this.courseRep.lecturer_id = data.newCourseRepId;
    //   } else {
    //     this.courseRep.lecturer_id = ''; 
    //   }
    // }).then(() => {
    //   this.courseRep.photo = 'assets/user.png';
      setTimeout(() => {
        this.refreshSelect = true

      })
    // });
  }

  onSelectionChanged(field: string, value: any) {
    this.courseRep[field] = value.id ?? value;
  }
  
  async saveCourseRep() {
    if(this.courseRep.first_name && this.courseRep.gender && this.courseRep.user_role && this.courseRep.faculties && this.courseRep.courses && this.courseRep.departments && this.courseRep.user_id){
      this.formValid = true
    }
    if(!this.formValid){
      this.api.toast.showToast('Please check all required fields.', 'error');
      return
    }
    const formData = new FormData();
    const isBlob = this.courseRep.photo instanceof Blob;
    if (!isBlob) {
      const fallback = 'assets/user.png';
      const photoUrl = this.courseRep.photo || fallback;
      this.courseRep.photo = await this.api.getBlob(photoUrl);
    }
    formData.append('photo', this.courseRep.photo, 'lecturer-photo.jpg');
    const lecturerPayload = { ...this.courseRep };
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
      this.courseRep = {
        photo: 'assets/user.png',
        gender: 'Male',
        departments: [],
        courses: [],
        faculties: []
      };
      this.setCourseRep();
      this.refreshSelect = true
    }, 0);
  }
  

  openUploadModal() {
    this.mediaService.openModal({
      title: 'Upload Avatar',
      image: this.courseRep.photo,
      okAction: (croppedImage: any) => this.saveImage(croppedImage)
    });
  }  
  
  saveImage(event: any) {
    this.displayImage = event.url
    this.courseRep.photo = event.blob
  }

}
