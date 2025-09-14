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

  eventList:any = [
    {
      activity: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      groups: [],
      departments: [],
      is_holiday: false
    }
  ]
  event:any = {}
  
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

  constructor(
    private readonly nonDB: NonDbService,
    private readonly mediaService: MediaUploadService,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
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

          if(this.formModel.events){
            this.eventList = this.formModel.events;
            if(this.eventList.length === 0){
              this.eventList = [
                {
                  activity: '',
                  start_date: new Date().toISOString().split('T')[0],
                  end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                  groups: [],
                  departments: [],
                  is_holiday: false
                }
              ]
            }
          }

        });
      }
    }, 300);
    if(this.formData.tag === 'calendar'){
      this.getData()
    }
  }

  async getData(){
    this.initData = await this.api.safeJSONParse('initData');
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
    if(this.formModel.events){
      item = {...this.formModel, events: this.eventList}
    }
    console.log(item)
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
    this.formModel[fld.field] = event;
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
    // if(this.formModel.events){
      this.formModel = {...this.formModel, events: this.eventList}
    // }
  }

  get visibleFields(): any[] {
    return this.formData?.formFields?.filter((field: any) =>
      this.firstPage ? !field.page2 : field.page2
    );
  }

  onSelectionChanged2(field: string, value: any) {
    // this.event[field] = value;
    // this.event[field] = [...this.event[field], ...value];
    this.event[field] = value
    console.log(this.formModel)
  }

  addEvent() {
    if (!Array.isArray(this.eventList)) {
      this.eventList = []
    }
    this.eventList.push({
      activity: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      groups: [],
      departments: [],
      is_holiday: false
    });
  }

  removeEvent(event: any) {
    if(this.eventList.length === 1){
      this.resetEvents()
    }else{
      this.eventList = this.eventList.filter((e:any) => e !== event);
    }
  }

  resetEvents(){
    this.eventList = [
      {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      }
    ]
  }

  // saveEvents() {
    // this.calendars.calendarList.push({...this.calendar});
    // console.log(this.calendar)
    // this.api.makeRequest('POST', 'calendars', this.calendar).then(async (res: any) => {
    //   console.log(res)
    // })
  //   this.resetEvents()
  // }

  // clear(){
  //   this.resetEvents()
  // }



  
}
