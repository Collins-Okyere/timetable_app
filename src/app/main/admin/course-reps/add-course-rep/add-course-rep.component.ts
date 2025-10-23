import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaUploadService } from '../../../../shared/reusable-components/media-upload/media-upload.service';
import { SelectInputComponent } from '../../../../shared/reusable-components/select-input/select-input.component';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectInputComponent],
  providers: [DatePipe],
  templateUrl: './add-course-rep.component.html',
  styleUrl: './add-course-rep.component.css'
})
export class AddCourseRepComponent {

  lastStudentId: string = ''
  student: any = {
    admission_no: null,
    photo: 'assets/user.png',
    first_name: null,
    last_name: null,
    middle_name: null,
    gender: 'Male',
    program_id: null,
    level_id: null,
    email: null,
    mobile_no: null
  };
  fetchedData:any
  displayImage:any
  refreshSelect = true;
  formValid = false

  constructor(private readonly api: ApiService, private mediaService: MediaUploadService, private router: Router) {}

  ngOnInit() {
    this.setStudent();
  }

  async setStudent() {
    await this.api.makeRequest('GET', 'students', { action_type: 'get_admission_data' }).then(async (data: any) => {
      if (data) {
        this.fetchedData = data
        this.lastStudentId = this.fetchedData.last_student_admission_no;
        this.student.admission_no = this.fetchedData.next_student_admission_no;
      } else {
        this.student.admission_no = ''; 
      }
    })
    this.refreshSelect = false
    this.displayImage = 'assets/user.png';
    setTimeout(() => {
      this.refreshSelect = true
    })
  }

  onSelectionChanged(field: string, value: any) {
    if(field === 'gender'){
    this.student[field] = value;
      return
    }
    this.student[field] = value.id ?? value;
  }
  
  async saveCourseRep() {
    if( this.student.admission_no && this.student.first_name && this.student.gender && this.student.program_id && this.student.level_id){
      this.formValid = true
    }
    if(!this.formValid){
      this.api.toast.showToast('Please check all required fields.', 'error');
      return
    }
    const isBlob = this.student.photo instanceof Blob;
    if (!isBlob) {
      const fallback = 'assets/user.png';
      const photoUrl = this.student.photo || fallback;
      const blob = await this.api.getBlob(photoUrl);
      this.student.photo = await this.api.blobToBase64(blob);
    }
    const studentPayload = { ...this.student };
    console.log(studentPayload)
    await this.api.makeRequest('POST', 'students', {...studentPayload, action_type: 'create_student'}).then(async (data: any) => {
      console.log(data)
    }).catch((error: any) => {
      this.api.toast.showToast('Please check all required fields.', 'error');
    });
    this.reset()
  }
  
  reset() {
    this.refreshSelect = false;
    setTimeout(() => 
      {
      this.student = {
        admission_no: null,
        photo: 'assets/user.png',
        first_name: null,
        last_name: null,
        middle_name: null,
        gender: 'Male',
        program_id: null,
        level_id: null,
        email: null,
        mobile_no: null
      };
      this.setStudent();
      this.refreshSelect = true
    }, 0);
  }
  

  openUploadModal() {
    this.mediaService.openModal({
      title: 'Upload Avatar',
      image: this.student.photo,
      okAction: (croppedImage: any) => this.saveImage(croppedImage)
    });
  }  
  
  saveImage(event: any) {
    this.displayImage = event.url
    this.student.photo = event.blob
  }

}
