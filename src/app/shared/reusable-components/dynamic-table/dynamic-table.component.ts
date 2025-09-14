import { Component, EventEmitter, inject, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFormModalComponent } from './table-form-modal/table-form-modal.component';
import { FormsModule } from '@angular/forms';
import { ConfirmModalService } from '../modals/confirm-modal/confirm-modal.service';
import { ApiService } from '../../services/api.service';
import { SelectInputComponent } from '../select-input/select-input.component';
import { NgxCsvParser } from 'ngx-csv-parser';
import { CapitalizeWordsPipe } from '../../utils/pipes/capitalize-words.pipe';
// import { DownloadButtonComponent } from '../download-button/download-button.component';
// import { LoaderService } from '../loader/loader.service';

@Component({
  selector: "app-dynamic-table",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableFormModalComponent,
    CapitalizeWordsPipe,
    SelectInputComponent,
    // DownloadButtonComponent,
  ],
  templateUrl: "./dynamic-table.component.html",
  styleUrl: "./dynamic-table.component.scss",
})

export class DynamicTableComponent implements OnInit {
  showTable = true;
  @Input() tableData: any = {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canSearch: true,
    edit: false,
  };
  modalOpen = false;
  formData: any = null;
  Array = Array;
  searchValue: string = "";
  originalData: any = [];
  currChurch: any;
  currBranch: any;
  path: string = "";
  objs: any = null;
  selectedBranch: any;
  groups: any;
  filteredGroups: any = [];
  members: any;
  groupPersons: any;
  selectedAction: any;
  selectedGroup: any;
  receipientGroup: any;
  refresh: boolean = false;
  refreshToggles: boolean = true;
  refresh2: boolean = false;
  checkedItems: any = [];
  checkedAll: boolean = false;
  currentTime: string = new Date().toTimeString().split(":").slice(0, 2).join(":");
  attendanceRecords: any = [];
  toggles: any = {
    addTime: false,
    addReason: false,
  };
  csvRecords: any;
  ngxCsvParser:any = inject(NgxCsvParser)
  fileInputChange: boolean = true
  headers:any = []
  header: boolean = true;
  downloadData: any
  @Output() sendData = new EventEmitter<any>();
  sortBy: { field: string, order: 'asc' | 'desc' } = { field: '', order: 'asc' };
  allTableFields: any[] = [];
  initFields: any[] = [];
  selectedFields: any[] = [];

  constructor(private readonly api: ApiService,private readonly confirm: ConfirmModalService, 
    // private readonly loader: LoaderService
  ) {}

  ngOnInit() {
    // this.loader.show();
    if(this.tableData.type){
    this.getData();
    this.setPath();
    this.setInputs();
    this.setTable();
    this.presetUploadsAndDownloads();
    // this.loader.hide();
    }
  }

  get keys(): string[] {
    if (!this.tableData?.data?.length || this.tableData.advancedFilters && !this.initFields?.length) return [];
    return this.tableData.tableFields?.length ? this.tableData.tableFields : Object.keys(this.tableData?.data[0]);
  }

  get tableHeaders(): string[] {
    switch (this.tableData?.type) {
      case "user_list":
      case "manage_groups":
        return ["Name", "Contact Details", "Branch Details"];
      case "mark_attendance":
        return ["Name"];
      default:
        return this.keys;
    }
  }

  isImageUrl(url: string): boolean {
    return /\.(jpeg|jpg|png|JPG|JPEG|PNG)$/.test(url);
  }

  getData() {
    this.currChurch = this.api.safeJSONParse("churchInfo");
    this.currBranch = this.api.safeJSONParse("branchInfo");
    this.originalData = [...(this.tableData?.data ?? [])];
    if (this.tableData.type === "manage_groups") {
      this.showTable = false;
      this.setTable();
    }
  }

  setPath() {
    this.path = this.tableData?.path ?? this.tableData?.title?.toLowerCase();
    this.objs = this.tableData?.objs ?? null;
  }

  setInputs(){
    if(this.tableData.advancedFilters){
      this.initFields = [...this.tableData?.tableFields];
      this.selectedFields = [...this.initFields];
      const fields:any = this.tableData?.formFields?.map((fm:any) => fm.field);
      this.allTableFields = fields ?? []
      if(this.tableData?.data?.sortData){
        this.sortData(this.tableData?.tableFields[0] ?? []);
      }
    }
  }

  async setTable() {
    if (this.tableData.type === "mark_attendance") {
      if(!this.tableData.attendance.exists || this.tableData.attendance.exists && this.tableData.attendance.records.length === 0){
        const newData: any = this.tableData?.data?.map((td: any) => ({
          member_id: td.member_id,
          name: `${td.last_name ?? ""} ${td.other_names ?? ""} ${td.first_name ?? "" }`.trim(),
          photo: td.photo,
          is_present: !!td.is_present,
          absence_reason: this.toggles.addReason ? td.absence_reason : null,
          check_in_time: this.currentTime ?? null,
        }));
        this.tableData.data = newData;
      }else{
        this.showTable = false;
        this.refreshToggles = false;
        setTimeout(() => {
          this.toggles = {
            addTime: this.tableData.attendance.has_check_in_time,
            addReason: this.tableData.attendance.has_absence_reason 
          }
          this.checkedAll = this.tableData.attendance.checked_all
          this.checkedItems = this.tableData.attendance.records
          this.refreshToggles = true;
          this.showTable = true;
        }, 500);
      }
      this.originalData = [...this.tableData?.data];
    }
    // else{
    //   const data_type: string = this.tableData?.tag?.includes('staff') ? "staff_members" : "members";
    //   if(data_type){
    //     await this.api.fetchData([data_type, "groups"]).then((data: any) => {
    //       this.groups = data?.groups ?? [];
    //       this.members = data[data_type] ?? [];
    //     });
    //   }
    // }
  }

  presetUploadsAndDownloads(){
    const uploadFields:any = this.tableData?.formFields?.map((fm:any) => fm.field);
    this.headers = uploadFields
    this.downloadData =  { 
      data: this.tableData.data, 
      light: true, title: 'Download',
      options: this.tableData?.downloadOptions ?? ['word','excel','pdf-port-a4','pdf-land-a4'],
    }
  }

  singleDownload(item:any){
    
  }

  bulkUpload() {

  }

  toggleFnx(field: string) {
    this.toggles[field] = !this.toggles[field];
    this.refreshToggles = false;
    let newData:any
    setTimeout(() => {

      if (this.toggles.addReason) {
        const valid:boolean = this.checkedItems.some((itm: any) => itm.checked === false || itm.is_present === false);
        if (!valid) {
          this.toggles.addReason = false;
          this.api.toast.showToast(`No ${this.tableData.tag ?? 'member'} marked absent.`, 'warning');
        } else {
          newData = this.tableData.data.map((td: any) => ({
            ...td,
            absence_reason: td.absence_reason ?? null
          }));
        }
      }else{
        newData = this.tableData.data.map((td: any) => ({
          ...td,
          absence_reason: null
        }));
      }

      if (this.toggles.addTime) {
        const valid:boolean = this.checkedItems.some((itm: any) => (itm.checked === true || itm.is_present === true))
        if (!valid) {
          this.toggles.addTime = false;
          this.api.toast.showToast(`No ${this.tableData.tag ?? 'member'} marked present.`, 'warning');
        } 
        else {
          newData = this.tableData.data.map((td: any) => ({
            ...td,
            check_in_time: td.check_in_time ?? this.currentTime
          }));
        }
      }else{
        newData = this.tableData.data.map((td: any) => ({
          ...td,
          check_in_time: null
        }));
      }

      this.checkedItems = [...newData]
      this.refreshToggles = true;
      
    }, 0);
  }

  onSearch() {
    if (!this.searchValue?.trim()) {
      this.tableData.data = [...this.originalData];
      return;
    }
    const searchTerm = this.searchValue.toLowerCase();
    this.tableData.data = this.tableData?.data.filter((item: any) => {
      return this.keys.some((key) => {
        const value = item[key];
        // const value = item[key]?.first_name ?? item[key]?.last_name ?? item[key]?.other_names ?? item[key]?.name ?? item[key];
        if (Array.isArray(value)) {
          return value.some((sub) => (sub?.name ?? sub)?.toString().toLowerCase().includes(searchTerm) );
        }
        const displayValue = value?.name ?? value;
        return displayValue?.toString().toLowerCase().includes(searchTerm);
      });
    });

  }

  sortData(field: string): void {
    if (this.sortBy.field === field) {
      this.sortBy.order = this.sortBy.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy.field = field;
      this.sortBy.order = 'asc';
    }
    this.filterAndSortData();
  }

  filterAndSortData(): void {
    this.tableData.data.sort((a: any, b: any) => {
      const aValue = a[this.sortBy.field.toLowerCase()];
      const bValue = b[this.sortBy.field.toLowerCase()];
      const aString = aValue.toString().toLowerCase();
      const bString = bValue.toString().toLowerCase();
      if (this.sortBy.order === 'asc') {
        return aString > bString ? 1 : -1;
      } else {
        return aString < bString ? 1 : -1;
      }
    });
  }

  openModal(item?: any, edit?: boolean) {
    if (item) {
      this.tableData.selectedItem = item;
    } else {
      delete this.tableData.selectedItem;
    }
    this.formData = { ...this.tableData, isMultiPart: this.tableData?.isMultiPart ?? false, formFields: this.tableData.formFields, canDownload: this.tableData?.canDownload ?? false, downloadData: this.downloadData ?? null, isEditable: edit ?? true };
    this.modalOpen = true;
  }


  closeModal() {
    if(this.tableData.type !== 'mark_attendance'){
      // this.formData.selectedItem = null;
      this.formData = null;
    }else{
      this.sendData.emit()
    }
    this.modalOpen = false;
  }

  async saveItem(item: any) {
    
    // this.loader.show();

    if (this.formData.selectedItem || item) {

      if (!this.tableData?.tableFields?.includes("logo")) delete item.logo;
      if (!this.tableData?.tableFields?.includes("splash_image")) delete item.splash_image;
      if (this.tableData?.tableFields?.includes("country") || item.country) {
        item.country = item.country?.id;
      } else {
        delete item.country;
      }

      if ( this.tableData?.tableFields?.includes("supervisor") || item.supervisor ) item.supervisor = item.supervisor?.id ?? null;
      if (this.tableData.list_type) item.type = this.tableData.list_type;
      item.branch = item.branch ? item.branch.id : this.currBranch.id;
      item.church = this.currChurch.id;
      
      if (this.tableData.user && this.tableData.title.toLowerCase().includes('relations')) {
        this.formData.selectedItem = { ...this.tableData.user };
        const added: any[] = [];
        item = { member_id: this.formData.selectedItem.member_id, relations: [ ...new Set([ ...this.tableData.user.relations.map((rel: any) => rel.id), ...item.relations.map((rel: any) => rel.id) ]) ] };
        added.push(...item.relations);
        const filts: any = this.tableData.formFields[0].list.filter((itm: any) => {
          return !added.includes(itm);
        });
        this.tableData.formFields[0].list = filts;
      }

      try {   

        if(item.start_time && item.end_time || item.start_date && item.end_date){
          if(item.start_time > item.end_time){
            this.api.toast.showToast("Start time cannot be greater than end time", "error");
            return;
          }else if(item.start_date > item.end_date){
            this.api.toast.showToast("Start date cannot be greater than end date", "error");
            return;
          }
        }

        const url = !this.formData.selectedItem ? `${this.path}/create/` : `${this.path}/${ item.member_id ?? item.id }/update/`;
        let newData:any
        await this.api.makeRequest("POST", url, item).then((res: any) => {
          
          const reponseData:any = res

          if (this.tableData.user && this.tableData.title.toLowerCase().includes('relations')) {
            const user = reponseData[this.objs ?? this.path].find((d: any) => d.member_id === this.tableData.user.member_id);
            if (user) {
              const userRelations = user?.relations ?? [];
              newData = [...userRelations];
            }
          } else {
            newData =  this.tableData.list_type && this.objs ? reponseData[this.objs].filter( (d: any) => d.type === this.tableData.list_type ) : reponseData[this.objs ?? this.path];
            newData.forEach((d: any) => {
              if ('take_attendance' in d) {
                d.take_attendance = d.take_attendance === true ? 'Yes' : 'No';
              }
            });
          }
          
          this.tableData = {...this.tableData, data: [...newData]}
        });

      } catch (error) {
        // this.api.toast.showToast("An error occured. Try again.", "error");
        this.api.toast.showToast( `Issues:<br>Item with same details may already exist.<br>Please check all requirements and try again.`, "error" );
      }
    } else {
      this.api.toast.showToast("An error occured. Try again.", "error");
    }

    // this.loader.hide();
    this.closeModal();

  }

  async deleteItem(item: any) {

    // this.loader.show();

    if (this.path === "branches" && item.id === this.currBranch.id) {
      this.api.toast.showToast(`You cannot delete the current branch.<br>Switch to another branch to be able to do so.`, "error" );
      return
    }
    
    if (item) {
      try {
        let freshData:any
        if (this.tableData.user && this.tableData.title.toLowerCase().includes('relations')) {
          const filtered = this.tableData.data.filter( (rel: any) => rel.id !== item.id);
          const relationIds = [ ...new Set([...filtered.map((rel: any) => rel.id)]) ];
          const payload: any = { member_id: this.tableData.user.member_id, relations: relationIds };
          await this.api.makeRequest( "POST", `${this.path}/${payload.member_id}/update/`, payload).then((data: any) => {
            freshData = data[this.path ?? this.objs].find( (d: any) => d.member_id === this.tableData.user.member_id);
            this.tableData = { ...data, user: freshData, data: freshData.relations ?? [] };
          });
        } else {
          await this.api.makeRequest( "POST", `${this.path}/${item.id}/delete/`, {}).then((data: any) => {
            freshData = this.objs ? data[this.objs].filter( (d: any) => d.type === this.tableData.list_type ) : freshData[this.objs ?? this.path];
            this.tableData = { ...this.tableData, data: freshData };
          })
        }

      } catch (error) {
        if(error){
          this.api.toast.showToast("An error occured. Try again.", "error");
        }
      }
    }

    // this.loader.hide();
    
  }

  openConfirmModal(item?: any) {

    let message: any;

    if (this.tableData.checkbox) {
      
      if (this.checkedItems?.length > 0) {

        if (this.tableData.type === "mark_attendance") {
          message = { msg: `Checked ${ this.tableData.tag ?? "members" } will be marked present.<br>Unchecked members will be marked absent.`, status: "success", title: "Mark Attendance", };
        }

        if (this.tableData.title.includes("Restore")) {
          message = { msg: `Selected ${this.tableData.tag ?? "members"} will be restored as active ${this.tableData.tag ?? "members"}.`, status: "success", title: "Restore Selected Persons", };
        }

        if (this.tableData.title.includes("Archive")) {
          message = { msg: `Selected ${this.tableData.tag ?? "members"} will be removed from active  ${this.tableData.tag ?? "members"}.`, status: "error", title: "Archive Selected Persons", };
        }

        if (this.tableData.title.includes("Transfer")) {
          if (this.selectedBranch) {
            message = { msg: `Selected ${this.tableData.tag ?? "members"} will be transfered <span class="font-semibold">from</span> <span class="text-red-700 font-semibold"> ${this.currBranch.name}</span> <span class="font-semibold">to</span> <span class="text-indigo-700 font-semibold"> ${this.selectedBranch.name}</span>.`, status: "error", title: "Transfer Persons" };
          } else {
            this.api.toast.showToast("Select a branch to transfer to.", "warning" );
            return;
          }
        }

        if (this.selectedAction === "Assign To Group") {
          message = { msg: `Selected ${this.tableData.tag ?? "members"} will be assigned to <span class="font-semibold">${this.selectedGroup.name}</span>.`, status: "success", title: "Assign To Group", };
        }

        if (this.selectedAction === "Remove From Group") {
          message = { msg: `Selected ${this.tableData.tag ?? "members"} will be removed from <span class="font-semibold">${this.selectedGroup.name}</span>.`, status: "error", title: "Remove From Group", };
        }

        if (this.selectedAction === "Move From Group") {
          if (this.selectedGroup && this.receipientGroup) {
            message = { msg: `Selected ${this.tableData.tag ?? "members"} will be moved to <span class="font-semibold">${this.receipientGroup.name}</span>.`, status: "success", title: "Move From Group" };
          } else {
            this.api.toast.showToast("Select a Group to move to.", "warning");
            return;
          }
        }

      } else {

        if (this.tableData.type !== "mark_attendance") {
          let msg = `No ${this.tableData.tag ?? "members"} selected`;
          this.api.toast.showToast(msg, "warning");
          return;
        }else{
          message = { msg: `Checked ${ this.tableData.tag ?? "members" } will be marked present.<br>Unchecked members will be marked absent.`, status: "success", title: "Mark Attendance", };
        }

      }

    } else {
      message = { msg: "Are you sure?", status: "error", title: "Delete Item" };
      if (this.tableData.tag) {
        message.msg = `Are you sure you want to delete ${ item.name ? `"${item.name}"` : `this ${this.tableData.tag.toLowerCase() ?? "item" }?` }`;
        if(this.tableData.type.includes("manage") || this.tableData.tag.toLowerCase() === "branch") message.msg += `<br>This will unassign this ${this.tableData.tag.toLowerCase() ?? "item" } from all members and staff.` 
      }
    }

    this.confirm.openModal({
      title: message.title,
      status: message.status,
      msg: message.msg,
      okAction: () => this.tableData.checkbox ? this.saveCheckedItems() : this.deleteItem(item),
    });

  }

  saveCheckedItems() {
    if (this.checkedItems.length > 0 || this.tableData.type === "mark_attendance") {
      
      let payload: any = { selected: this.checkedItems.map((m: any) => m.member_id), church: this.currChurch.id, branch: this.currBranch.id };

      if (this.tableData.type === "manage_groups") {
        payload = { ...payload, action: this.selectedAction, selectedGroup: this.selectedGroup.id };
        if (this.selectedAction === "Move From Group") {
          payload = { ...payload, receipientGroup: this.receipientGroup.id };
        }
      }

      if (this.tableData.type === "mark_attendance") {
        let records:any
        if(this.checkedItems.length > 0){
          records = this.checkedItems;
        }else{
          records =  this.tableData.data.map((d: any) => ({
            member_id: d.member_id,
            is_present: !!d.checked,
            check_in_time: this.toggles.addTime === true && d.checked ? d.check_in_time ?? this.currentTime : null,
            absence_reason: this.toggles.addReason && !d.checked ? d.absence_reason ?? null  : null,
          }));
        }
        payload = { ...this.tableData.attendance,  time: this.currentTime, records, marked_by: this.api.safeJSONParse('currUserDetails').id, church: this.currChurch.id, branch: this.currBranch.id };
      }

      if (this.tableData.transfer) {
        payload = { ...payload, receipientBranch: this.selectedBranch.id };
      }

      if (this.tableData.action === "bulk_restore") {
        payload = { ...payload, action: "restore" };
      }

      if (this.tableData.action === "bulk_archived") {
        payload = { ...payload, action: "archive" };
      }

      this.api.makeRequest("POST", `${this.path}/`, payload).then((data: any) => {
        if (data) {
          this.showTable = false;
          this.refresh = false;
          this.refresh2 = false;
          setTimeout(() => {
            this.selectedGroup = null;
            this.receipientGroup = null;
            this.members = data.members ?? [];
            this.tableData.data = this.members;
            if (this.tableData.action === "bulk_restore") { this.tableData.data = this.members.filter( (m: any) => m.is_deleted );}
            if (this.tableData.action === "bulk_archived") { this.tableData.data = this.members.filter( (m: any) => !m.is_deleted );}
            this.refresh = true;
            this.refresh2 = true;
          }, 0);
          this.sendData.emit()
        }
      });

    }
  }

  toggleEdit() {
    this.tableData.edit = !this.tableData.edit;
    this.closeModal();
  }

  cancelEdit() {
    this.confirm.openModal({
      title: "Cancel Changes",
      msg: `Changes made will not be saved.<br>Are you sure you want to cancel?`,
      closeLabel: "Save first",
      okLabel: "Yes, cancel",
      status: "warning",
      okAction: () => this.closeModal(),
    });
  }

  onCheckboxChange(item: any, event?: any) {
    const isChecked = event?.target?.checked;

    const isSelectAll = !item || Object.keys(item).length === 0;
    const isAttendanceMode:boolean = this.tableData.type === "mark_attendance"

    if (!isAttendanceMode) {

      if (isSelectAll) {
        this.checkedItems = [];
        this.tableData.data.forEach((d: any) => {
          d.checked = isChecked;
          if (isChecked) this.checkedItems.push(d);
        });
        this.checkedAll = isChecked;
      } else {
        item.checked = isChecked;
        if (isChecked) {
          if (!this.checkedItems.some((i: any) => i.id === item.id)) {
            this.checkedItems.push(item);
          }
        } else {
          this.checkedItems = this.checkedItems.filter( (i: any) => i.id !== item.id );
        }
        this.checkedAll = this.tableData.data.every((d: any) => d.checked);
      }
      
    } else {
      
      if (isSelectAll) {
        this.tableData.data.forEach((d: any) => {
          d.checked = isChecked;
          d.absence_reason = null;
        });
        this.toggles.addReason = false;
      }
      if (event && event.target?.type === 'checkbox') {
        item.checked = isChecked;
        if(item.checked === true){
          item.absence_reason = null
        }
        if(this.toggles.addTime && item.checked){
          item.check_in_time = this.currentTime ?? null
        }
      }

      this.checkedItems = this.tableData.data.map((d: any) => ({
        member_id: d.member_id,
        is_present: !!d.checked,
        check_in_time: this.toggles.addTime && d.checked ? d.check_in_time ?? this.currentTime : null,
        absence_reason: this.toggles.addReason && !d.checked ? d.absence_reason ?? null  : null
      }));

      this.checkedAll = this.tableData.data.every((d: any) => d.checked);
      
      if(!this.checkedAll){
        this.refreshToggles = false;
        setTimeout(() => {
          this.toggles.addTime = false
          this.refreshToggles = true;
        }, 0);
      }else{
        this.tableData.data.forEach((d: any) => d.absence_reason = null );
        this.refreshToggles = false
        setTimeout(() => {
          this.toggles.addReason = false
          this.refreshToggles = true
        }, 0); 
      }
  
    }
    
  }

  updateAttendance(){
    this.checkedItems = this.tableData.data.map((d: any) => ({
      member_id: d.member_id,
      is_present: !!d.checked,
      check_in_time: this.toggles.addTime && d.checked ? d.check_in_time ?? this.currentTime : null,
      absence_reason: this.toggles.addReason && !d.checked ? d.absence_reason ?? null  : null,
    }));
  }

  onSelectionChanged(field: string, value: any) {
    
    if(field === 'group_by'){
      const newLsit:any = this.initFields.filter((t:any) => t !== value)
      this.tableData.tableFields = [value, ...newLsit]
      if(this.tableData?.data?.sortData){
        this.sortData(this.tableData?.tableFields[0]);
      }    
      return
    }

    if (field === 'selected_fields') {
      if (Array.isArray(value)) {
        this.selectedFields = [...value];
      } else {
        this.selectedFields = [...this.selectedFields, value];
      }
      this.tableData.tableFields = [...this.selectedFields];
      this.refresh = true;
      setTimeout(() => {
        this.initFields = [...this.selectedFields];
        this.refresh = false;
      })
      if (this.tableData?.data?.sortData) {
        this.sortData(this.tableData?.tableFields[0] ?? '');
      }return;
    }

    if (field === "selected_branch") {
      this.selectedBranch = value;
      return;
    }

    if (this.tableData.type === "manage_groups") {
      if (field === "group_action") {
        this.refresh = false;
        this.showTable = false;
        setTimeout(() => {
          this.selectedAction = value;
          this.selectedGroup = null;
          this.receipientGroup = null;
          this.refresh = true;
        }, 0);
        return;
      }

      if (field === "selected_group") {
        this.selectedGroup = value;
        this.receipientGroup = null;
        this.refresh2 = false;
        if (this.selectedGroup) {
          setTimeout(() => {
            if (this.selectedAction === "Assign To Group") {
              this.groupPersons = this.members?.filter((m: any) => !m.groups.some((g: any) => g.id === this.selectedGroup?.id)) ?? [];
            } else {
              this.groupPersons = this.members?.filter((m: any) => m.groups.some((g: any) => g.id === this.selectedGroup?.id)) ?? [];
            }
            this.tableData.data = [...this.groupPersons]
            this.originalData = [...(this.tableData?.data ?? [])];
            this.filteredGroups = this.groups.filter((g: any) => g.id !== this.selectedGroup.id) ?? [];
            this.refresh2 = true;
          }, 0);
        }
        this.showTable = true;
      } else {
        this.filteredGroups = this.groups ?? [];
      }

      if (field === "receipient_group") {
        this.receipientGroup = value;
      }
    }

  }

  fileChangeListener(event: any): void {
    
    const file = event.target.files?.[0];

    if (!file) {
      this.api.toast.showToast('No file selected.', 'warning');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      this.api.toast.showToast('Please upload a valid CSV file.', 'error');
      return;
    }

    this.ngxCsvParser .parse(file, { header: true, delimiter: ',' }) .subscribe({
      next: (records: any[]) => {
        if (!records.length) {
          this.api.toast.showToast('CSV file is empty.', 'error');
          return;
        }
        const requiredFields = this.headers; // Set in ngOnInit
        const headers = Object.keys(records[0]);
        
        // Check if any required field is missing
        const missing = requiredFields.filter((field:any) => !headers.includes(field));
        if (missing.length) {
          this.api.toast.showToast(`Missing column(s): ${missing.join(', ')}`, 'error');
          return;
        }

        // Remove duplicates
        const newRecords = records.filter(row => !this.tableData.data.some((existing:any) => JSON.stringify(existing) === JSON.stringify(row) ) );
        const skipped = records.length - newRecords.length;

        if (!newRecords.length) {
          this.api.toast.showToast('All items already exist. Nothing was added.', 'warning');
          return;
        }

        this.tableData.data = [...this.tableData.data, ...newRecords];
        let msg = `${newRecords.length} new record(s) added.`;
        if (skipped > 0) {
          msg += ` ${skipped} existing record(s) were skipped.`;
        }
        this.api.toast.showToast(msg, 'success');
      },
      error: () => { this.api.toast.showToast('Error reading CSV file.', 'error'); }
    });

  }

}
