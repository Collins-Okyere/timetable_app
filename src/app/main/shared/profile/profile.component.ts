import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { FormsModule } from '@angular/forms';
import { CapitalizeWordsPipe } from '../../../shared/utils/pipes/capitalize-words.pipe';
import { SelectInputComponent } from '../../../shared/reusable-components/select-input/select-input.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizeWordsPipe, SelectInputComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  fetchedData:any = {}
  isEditing = false;
  refreshSelect:boolean = true
  user:any = {}
  newUser:any = {}
  password = {
    current: '',
    new: '',
    confirm: ''
  };
  changePassword: boolean = false
  showPassword:any = {
    old: false,
    new: false,
    confirm: false
  }

  constructor(private api: ApiService) { }

  async ngOnInit() {
    const neededData:any = ['countries', 'languages'];
    this.refreshSelect = false
    this.fetchedData = await this.api.fetchData([...neededData]);
    setTimeout(() => {
      this.user = this.api.safeJSONParse('currUser');
      this.newUser = {...this.user};
      this.refreshSelect = true
    }, 0)
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  onSelectionChanged(field: string, value: any) {
    this.user[field] = value.id ?? value;
  }

  changePass(){
    if(this.isEditing){
      this.changePassword = !this.changePassword;
    }else{
      this.isEditing = !this.isEditing
      this.changePassword = !this.changePassword;
    }
  }

  cancel(){
    this.closePass();
    this.isEditing = !this.isEditing;
    this.changePassword = false;
    this.newUser = this.user
  }

  saveChanges() {
    this.closePass();
    this.changePassword = false
    this.isEditing = false;
    this.user = this.newUser
  }

  closePass(){
    this.showPassword = {
      old: false,
      new: false,
      confirm: false
    }
  }

}
