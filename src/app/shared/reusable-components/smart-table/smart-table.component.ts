import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FabBtnComponent } from '../../../shared/reusable-components/fab-btn/fab-btncomponent';
import { SelectInputComponent } from '../../../shared/reusable-components/select-input/select-input.component';
import { CapitalizeWordsPipe } from '../../utils/pipes/capitalize-words.pipe';
import { TableFormModalComponent } from './table-form-modal/table-form-modal.component';
import { ConfirmModalService } from '../modals/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-smart-table',
  standalone: true,
  imports: [CommonModule, FormsModule, FabBtnComponent, SelectInputComponent, CapitalizeWordsPipe, TableFormModalComponent],
  templateUrl: './smart-table.component.html',
  styleUrl: './smart-table.component.css',
})
export class SmartTableComponent implements OnInit {
  
  // @Input() tableData:any = {
  //       title: 'Departments',
        // subTitle: 'Departments',
        // tag: 'Department',
        // description: 'List of departments',
        // allowAdd: true,
        // allowFilters: true,
        // filters: {
        //   neededData: ['organisations', 'beneficiaries', 'projects'],
        //   filterBy: ['date','organisation','project','donationType']
        // },
        // sortBy: 'date',
        // allowStatCards: true,
        // pageSize: 15,
        // stats: {
          // defaults: ['count','gender', 'active', 'new', 'approved', 'pending', 'paid', 'rejected', 'pending', 'totalCash', 'totalInKind'],
          // defaults: ['count', 'active', 'new'],
          // special: []
        // },
        // allowGlobalSearch: true,
        // allowColumnSearch: true,
        // allowDownload: true,
        // allowEdit: true,
        // allowApprove: true,
        // allowDelete: true,
        // allowSorting: true,
        // dataSet: this.fetchedData?.departments,
        // formFields: [
        //   { field: 'name', type: 'input', required: true },
        //   { field: 'code', type: 'input', required: true },
          // { field: 'supervisor', type: 'select', placeholder: 'Select Supervisor', displayProperty: 'full_name', list: this.fetchedData?.staff_members }
      //   ],
      //   tableFields: ['name', 'code'
      //     // , 'supervisor'
      //   ],
      //   path: 'groups',
      //   objs: 'groups',
      //   type: 'general',        
  // }

  @Input() tableData:any
  Math  = Math
  filter: any = {
    start_date: '',
    end_date: '',
    organisation: null,
    project: null,
    beneficiary: null,
    type: 'All Types',
    search: '',
    tableData: 'All Donations',
  };
  Array = Array;
  selectedItem:any
  menuOpen: boolean = false;
  refreshSelect: boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  showFiltersModal: boolean = false;
  showAddModal:boolean = false
  fetchedData:any
  fabData: any = {
    icon: {
      color: 'text-white',
      path: 'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z',
    },
    bgColor: 'bg-emerald-800',
  };
  page = 1;
  user: any;
  formData:any
  columnFilters: any = {};
  initFields:any[] = []
  showStats:any = true

  constructor(private api: ApiService, private confirm: ConfirmModalService) {}

  async ngOnInit() {
    this.menuOpen = false
    this.user = await this.api.safeJSONParse('currUser');
    this.initData();
    console.log(this.tableData?.dataSet)
  }

  async initData() {
    try {
      if(this.tableData !== null || this.tableData !== undefined) {
        const neededData:any = this.tableData?.neededData ?? []
        this.fetchedData = await this.api.fetchData([...neededData]);
        this.refreshSelect = false         
        this.updateDateRangeFromdataSet();
        setTimeout(() => {
          this.setSort(this.tableData?.sortBy);
          this.refreshSelect = true
        },0) 
      }
    } catch (err) {

    }
  }

  get keys(): string[] {
    if (!this.tableData?.dataSet?.length || this.tableData.advancedFilters && !this.initFields?.length) return [];
    return this.tableData.tableFields?.length ? this.tableData.tableFields : Object.keys(this.tableData?.dataSet[0]);
  }

  get tableHeaders(): string[] {
    return this.keys;
  }

  updateDateRangeFromdataSet() {
    if (!this.tableData?.dataSet || this.tableData?.dataSet.length === 0) return;
    const sorteddataSet = [...this.tableData?.dataSet].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    this.filter.start_date = sorteddataSet[0].date;
    this.filter.end_date = new Date().toISOString().slice(0, 10);
  }
  
  get filtered(): any[] {

    if (!this.tableData?.dataSet) {
      return [];
    }

    let out = [...this.tableData?.dataSet];

    // if (this.filter?.start_date) {
    //   out = out.filter((d) => new Date(d?.start_date) >= new Date(this.filter?.start_date));
    // }
    // if (this.filter?.end_date) {
    //   out = out.filter((d) => new Date(d?.end_date) <= new Date(this.filter?.end_date));
    // }

    
    // search filter
    if (this.filter?.search) {
      const q = this.filter?.search.toLowerCase();
      out = out.filter((d) =>
        this.keys.some((key) =>
          String(this.getFieldValue(d, key)).toLowerCase().includes(q)
        )
      );
    }

    // sorting
    if (this.sortField) {
      out.sort((a, b) => {
        let valA = this.getFieldValue(a, this.sortField);
        let valB = this.getFieldValue(b, this.sortField);

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === "string") {
          return this.sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return this.sortDirection === "asc" ? valA - valB : valB - valA;
      });
    }

    // column filters
    Object.entries(this.columnFilters).forEach(([key, val]: any) => {
      const filterVal = val.toLowerCase();
      if (!filterVal) return;

      out = out.filter((d: any) => {
        const fieldValue = this.getFieldValue(d, key);
        return fieldValue?.toString().toLowerCase().includes(filterVal);
      });
    });

    return out;
  }


  reset(){
    this.refreshSelect = false
    setTimeout(() => {
      this.refreshSelect = true
    }, 0)
  }

  get pageItems(): any[] {
    const start = (this.page - 1) * this.tableData?.pageSize;
    return this.filtered?.slice(start, start + this.tableData?.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered?.length / this.tableData?.pageSize));
  }

  formatCurrency(val: number | undefined): string {
    if (!val) return '₵0.00';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(val);
  }
  
  onStartDateChange(date: string) {
    if (this.filter?.end_date && new Date(date) > new Date(this.filter?.end_date)) {
      this.api.toast.showToast('Start date cannot be later than End date', 'warning');
      return;
    }
    this.filter.start_date = date;
    this.resetPage();
  }

  onEndDateChange(date: string) {
    if (this.filter?.start_date && new Date(date) < new Date(this.filter?.start_date)) {
      this.api.toast.showToast('End date cannot be earlier than Start date', 'warning');
      return;
    }
    this.filter.end_date = date;
    this.resetPage();
  }


  onFilter(key: string, value: any) {
    if(key === 'tableData'){
      this.reset()
    }
    this.filter[key] = value;
    this.resetPage();
  }

  handleFilters() {
    this.resetPage();
    this.showFiltersModal = false;
  }

  resetPage() {
    this.page = 1;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  setSort(field: any, nestedField?: string): void {
    const fullField = nestedField ? `${field}.${nestedField}` : field;
    if (this.sortField === fullField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = fullField;
      this.sortDirection = 'asc';
    }
  }

  private getFieldValue(obj: any, path: string): any {
    const value = path.split('.').reduce((o, key) => (o ? o[key] : null), obj);
    if (typeof value === 'object' && value !== null) {
      return value.name ?? '';
    }
    return value ?? '';
  }

  toggleFilters() {
    this.showFiltersModal = !this.showFiltersModal;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  exportCSV() {
    const pipe = new CapitalizeWordsPipe();
    const headers = this.keys.map((k) => pipe.transform(k));
    const rows = [
      headers,
      ...this.filtered.map((d) => this.keys.map((k) => this.getFieldValue(d, k)))
    ];

    const csvContent = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.tableData?.title}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.text(`${this.tableData?.title} Report`, 14, 15);
    const pipe = new CapitalizeWordsPipe();
    const headers = this.keys.map((k) => pipe.transform(k));

    autoTable(doc, {
      head: [headers],
      body: this.filtered?.map((d) =>
        this.keys.map((k) => this.getFieldValue(d, k))
      ),
      startY: 20,
    });

    doc.save(`${this.tableData?.title}-report.pdf`);
  }


  openAddModal(item?: any, edit?: boolean) {
    if (item) {
      this.tableData.selectedItem = item;
    } else {
      delete this.tableData.selectedItem;
    }
    this.formData = { ...this.tableData, isMultiPart: this.tableData?.isMultiPart ?? false, formFields: this.tableData.formFields, allowDownload: this.tableData?.allowownload ?? false, isEditable: edit ?? true };
    this.showAddModal = true;
  }

  editItem(Item: any) {
    this.openAddModal(Item, true);
  }

  viewItem(Item: any) {
    this.openAddModal(Item, false);
  }

  saveItem(item:any, fnx?:string) {
    let action: string = ''
    const idx = this.tableData?.dataSet.findIndex((u: any) => u.id === item.id);
      if (idx !== -1) {
        action = 'updated'
        if(!fnx){
          this.tableData.dataSet[idx] = { ...item };
        }else{
          action = fnx
          this.tableData.dataSet[idx] = { ...item, is_active: true, is_approved: true };
        }
      }else{
        action = 'saved'
        if(!fnx){
          this.tableData?.dataSet.push({ ...item, is_new: true});
        }else{
          this.tableData?.dataSet.push({ ...item, is_new: true, is_active: true });
        }
      }
      this.filtered
    this.closeModal();
    this.api.toast.showToast(`${this.tableData?.tag ?? 'Item'} ${action} sucessfully!`, 'success');
  }

  closeModal() {
    this.showAddModal = false;
    this.selectedItem = null;
  }

  onSelectionChanged(key: string, value: any){
    this.selectedItem[key] = value
  }
  
  openConfirmModal(item?: any) {

    let message: any;
    
    message = { msg: "Are you sure?", status: "error", title: `Delete ${this.tableData?.tag ?? "Item"}` };
      if (this.tableData.tag) {
        message.msg = `Are you sure you want to delete ${ item.name ? `\"${item.name}\"` : `this ${this.tableData.tag.toLowerCase() ?? "item" }?` }`;
        if(this.tableData.type.includes("manage") || this.tableData.tag.toLowerCase() === "branch") message.msg += `<br>This will unassign this ${this.tableData.tag.toLowerCase() ?? "item" } from all members and staff.` 
      }

    this.confirm.openModal({
      title: message.title,
      status: message.status,
      msg: message.msg,
      okAction: () => this.deleteItem(item),
    });

  }

  deleteItem(item:any) {
    if (item) {
      this.tableData.dataSet = this.tableData?.dataSet.filter((u: any) => u.id !== item.id);
      this.selectedItem = null;
    }
    this.api.toast.showToast(`${this.tableData?.tag ?? "Item"} deleted successfully!`, 'success')
  }

  get getStats() {
    const totalCount = this.tableData?.dataSet?.length;
    const newCount = this.tableData?.dataSet?.filter((d: any) => d?.is_new).length;
    const activeCount = this.tableData?.dataSet?.filter((d: any) => d?.is_active).length;
    const maleCount= this.tableData?.dataSet?.filter((d: any) => d?.gender === 'Male').length;
    const femaleCount= this.tableData?.dataSet?.filter((d: any) => d?.gender === 'Female').length;
    const totalCash = this.filtered?.filter((d) => d?.donationType === 'Cash').reduce((sum, d) => sum + (d?.amount || 0), 0);
    const totalInKindCount = this.filtered?.filter((d) => d?.donationType === 'In-Kind').length;
    const totalPendingCount = this.filtered?.filter((d) => d?.status === 'Pending').length;
    const totalRejectedCount = this.filtered?.filter((d) => d?.status === 'Rejected').length;
    const totalApprovedCount = this.filtered?.filter((d) => d?.status === 'Approved').length;
    const totalPaidCount = this.filtered?.filter((d) => d?.status === 'Approved').length;
    return { totalCount, newCount, activeCount, maleCount, femaleCount, totalCash, totalInKindCount, totalPendingCount, totalRejectedCount, totalApprovedCount, totalPaidCount};
 }

  isImageUrl(url: string): boolean {
    return /\.(jpeg|jpg|png|JPG|JPEG|PNG)$/.test(url);
  } 
  
  // async saveItem(item: any) {
    
  //   this.loader.show();

  //   if (this.formData.selectedItem || item) {
  //     try {   

  //       if(item.start_time && item.end_time || item.start_date && item.end_date){
  //         if(item.start_time > item.end_time){
  //           this.api.toast.showToast("Start time cannot be greater than end time", "error");
  //           return;
  //         }else if(item.start_date > item.end_date){
      //       this.api.toast.showToast("Start date cannot be greater than end date", "error");
      //       return;
      //     }
      //   }

      //   const url = !this.formData.selectedItem ? `${this.tableData?.path}/create/` : `${this.tableData?.path}/${ item.member_id ?? item.id }/update/`;
      //   let newData:any
      //   await this.api.makeRequest("POST", url, item).then((res: any) => {
          
      //     const reponseData:any = res

      //     if (this.tableData.user && this.tableData.title.toLowerCase().includes('relations')) {
      //       const user = reponseData[this.tableData?.objs ?? this.tableData?.path].find((d: any) => d.member_id === this.tableData.user.member_id);
      //       if (user) {
      //         const userRelations = user?.relations ?? [];
      //         newData = [...userRelations];
      //       }
      //     } else {
      //       newData =  this.tableData.list_type && this.tableData?.objs ? reponseData[this.tableData?.objs].filter( (d: any) => d.type === this.tableData.list_type ) : reponseData[this.tableData?.objs ?? this.tableData?.path];
      //       newData.forEach((d: any) => {
      //         if ('take_attendance' in d) {
      //           d.take_attendance = d.take_attendance === true ? 'Yes' : 'No';
      //         }
      //       });
      //     }
          
      //     this.tableData = {...this.tableData, data: [...newData]}
      //   })

      // } catch (error) {
        // this.api.toast.showToast("An error occured. Try again.", "error");
    //     this.api.toast.showToast( `Issues:<br>Item with same details may already exist.<br>Please check all requirements and try again.`, "error" );
    //   }
    // } else {
    //   this.api.toast.showToast("An error occured. Try again.", "error");
    // }

    // this.loader.hide();
    // this.closeModal();

  // }

  // async deleteItem(item: any) {

    // this.loader.show();
    
    // if (item) {
    //   try {
    //     let freshData:any
    //     await this.api.makeRequest( "POST", `${this.tableData?.path}/${item.id}/delete/`, {}).then((data: any) => {
    //         freshData = this.tableData?.objs ? data[this.tableData?.objs].filter( (d: any) => d.type === this.tableData.list_type ) : freshData[this.tableData?.objs ?? this.tableData?.path];
    //         this.tableData = { ...this.tableData, data: freshData };
    //       })
        

    //   } catch (error) {
    //     if(error){
    //       this.api.toast.showToast("An error occured. Try again.", "error");
    //     }
    //   }
    // }

    // this.loader.hide();
    
  // }

  cancelEdit() {
    this.confirm.openModal({
      title: "Cancel Changes",
      msg: `Changes made will not be saved.<br>Are you sure you want to cancel?`,
      closeLabel: "No, wait",
      okLabel: "Yes, cancel",
      status: "warning",
      okAction: () => this.closeModal(),
    });
  }


}
