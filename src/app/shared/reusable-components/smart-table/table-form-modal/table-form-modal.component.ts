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
  fetchedData:any
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
                {}
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
    this.fetchedData = await this.api.fetchData(this.formData.neededData);
  }

  get formKeys(): string[] {
    return Object.keys(this.formModel);
  }

  onSubmit() {
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
    this.formModel = {...this.formModel, activities: this.activityList ?? null}
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
      eventItem[field] = value;
    } else {
      this.activityListItem[field] = value;
    }
    this.refreshSelect = true;
  });
}


  addEvent() {
    if (!Array.isArray(this.activityList)) {
      this.activityList = []
    }
    this.activityList.push({});
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
      {}
    ]
  }

  saveEvents() {
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
