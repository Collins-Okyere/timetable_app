import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectInputComponent } from '../../select-input/select-input.component';
import { MediaUploadService } from '../../media-upload/media-upload.service';
import { NonDbService } from '../../../services/nondb.service';
import { ApiService } from '../../../services/api.service';
import { CapitalizeWordsPipe } from '../../../utils/pipes/capitalize-words.pipe';

@Component({
  selector: 'app-table-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SelectInputComponent,
    CapitalizeWordsPipe,
  ],
  templateUrl: './table-form-modal.component.html',
  styleUrl: './table-form-modal.component.scss'
})
export class TableFormModalComponent implements OnInit {
  
  activityListItem:any = {}
  activityList:any = [
    {}
  ]
  Array = Array
  @Input() formData: any = {};
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  formModel: any = {};
  currField: any = null;
  mediaUploadOpen: boolean = false;
  upload: boolean = false;
  imageChangedEvent: Event | null = null;
  defaultImage: any = null;
  selectionData:any
  originalItem: any;
  currentTime: string = new Date().toTimeString().split(":").slice(0, 2).join(":");
  firstPage:boolean = true
  initData:any
  refreshSelect:boolean = true

  constructor(
    private readonly mediaService: MediaUploadService,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.refreshSelect = false
    setTimeout(() => {

      if (this.formData.selectedItem) {
        this.formModel = { ...this.formData.selectedItem };
      }
      this.defaultImage = this.formData?.defaultImage ?? 'assets/user.png';
      this.originalItem = { ...this.formModel };
      if (Array.isArray(this.formData.formFields)) {
        this.formData.formFields.forEach((field: any) => {
          const key = field.field;
          if ((this.formModel[key] === undefined || this.formModel[key] === null) && field.defaultValue !== undefined) {
            this.formModel[key] = field.defaultValue;
          }

          if(this.formModel.activities){
            this.activityList = this.formModel.activities;
            if(this.activityList.length === 0){
              this.activityList = [
                {
                  // activity: '',
                  // start_date: new Date().toISOString().split('T')[0],
                  // end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                  // groups: [],
                  // departments: [],
                  // is_holiday: false

                  // day: '',
                  // start_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5),
                  // end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5),
                  // course: '',
                  // lecturer: '',
                  // course_rep: ''
                  
                }
              ]
            }
          }

        });
      }
      this.refreshSelect = true
    }, 300);
    if(this.formData.tag === 'Timetable'){
      this.getData()
    }
  }

  async getData(){
    // this.initData = await this.api.safeJSONParse('initData');
    this.initData = await this.api.fetchData(this.formData.neededData);
  }

  get formKeys(): string[] {
    return Object.keys(this.formModel);
  }

  onSubmit() {
    if(this.formModel.take_attendance ){
      if (this.formModel.take_attendance === 'Yes') {
        this.formModel.take_attendance = true;
      } else if (this.formModel.take_attendance === 'No') {
        this.formModel.take_attendance = false;
      }
    }
    let item:any = {...this.formModel,  }
    if(this.formModel.activities){
      item = {...this.formModel, activities: this.activityList}
    }
    this.save.emit(item);
  }

  closeModal() {
    this.close.emit();
    this.formData.selectedItem = null;
  }

  cancelModal() {
    const changed = this.formData?.formFields?.some((fld: any) => this.formModel[fld.field] !== this.originalItem[fld.field] );
    if (this.formData.selectedItem !== null && changed || changed) {
      this.cancel.emit();
    } else {
      this.closeModal();
    }
  }

  editForm(){
    this.formData.isEditable = !this.formData.isEditable
  }

  getDisplayValue(value: any, displayProp: string) {
          if(!this.formData.isEditable){

    if (!value) return '';
    if (value.first_name || value.last_name || value.other_name) {
        return [value.first_name, value.other_name, value.last_name].filter(Boolean).join(' ');
     }
    if (typeof value === 'object' && displayProp in value) {
      return value[displayProp];
    }
    return typeof value === 'string' || typeof value === 'number' ? String(value) : '[Unknown]';
  }
    }



  onOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('bg-black')) {
      this.closeModal();
    }
  }

  onSelectionChanged(fld: any, event: any) {
    this.refreshSelect = false
    setTimeout(() => {
      this.formModel[fld.field] = event;
      this.refreshSelect = true
    })
    // if(fld.field === 'take_attendance'){
    //   if(event === 'Yes'){
    //     this.formModel.take_attendance = true
    //   }else{
    //     this.formModel.take_attendance = false
    //   }
    // }
  }
  

  openUploadModal(field: string) {
    this.currField = field;
    this.mediaService.openModal({
      title: 'Upload Image',
      image: this.formModel[this.currField] ?? this.defaultImage,
      okAction: (croppedImage: any) => this.saveImage(croppedImage)
    });
  }

  saveImage(event: any): void {
    this.formModel[this.currField] = event;
  }

  nextStep() {
    this.firstPage = !this.firstPage;
    // if(this.formModel.activities){
      this.formModel = {...this.formModel, activities: this.activityList}
    // }
  }

  get visibleFields(): any[] {
    return this.formData?.formFields?.filter((field: any) =>
      this.firstPage ? !field.page2 : field.page2
    );
  }

  onSelectionChanged2(field: string, value: any, eventItem?: any) {
  this.refreshSelect = false;
  setTimeout(() => {
    if (eventItem) {
      eventItem[field] = value; // ✅ updates the actual row object
    } else {
      this.activityListItem[field] = value; // fallback if no event passed
    }
    this.refreshSelect = true;
  });
}


  addEvent() {
    if (!Array.isArray(this.activityList)) {
      this.activityList = []
    }
    this.activityList.push({
      // activity: '',
      // start_date: new Date().toISOString().split('T')[0],
      // end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      // groups: [],
      // departments: [],
      // is_holiday: false

      // day: '',
      // course: '',
      // start_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5),
      // end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5),
      // lecturer: '',
      // course_rep: ''
      
    });
  }

  removeEvent(event: any) {
    if(this.activityList.length === 1){
      this.resetEvents()
    }else{
      this.activityList = this.activityList.filter((e:any) => e !== event);
    }
  }

  resetEvents(){
    this.activityList = [
      {
        start_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5),
        end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5),
        day: '',
        course: null,
        lecturer: null,
        course_rep: null

        // start_date: new Date().toISOString().split('T')[0],
        // end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      }
    ]
  }

  saveEvents() {
    // this.calendars.calendarList.push({...this.calendar});
    // console.log(this.calendar)
    // this.api.makeRequest('POST', 'calendars', this.calendar).then(async (res: any) => {
    //   console.log(res)
    // })
    // this.resetEvents()
    this.formModel.activities = this.activityList.push({...this.activityListItem});
    // console.log(this.event)
    // this.api.makeRequest('POST', 'calendars', this.e).then(async (res: any) => {
    //   console.log(res)
    // })
  }

  clear(){
    this.resetEvents()
  }



  
}
