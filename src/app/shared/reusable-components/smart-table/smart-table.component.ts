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
  
  @Input() tableData:any
  Math  = Math
  filter: any = {};
  Array = Array;
  selectedItem:any
  menuOpen: boolean = false;
  refreshSelect: boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
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
  }

  async initData() {
    try {
      if(this.tableData !== null || this.tableData !== undefined) {
        if(Object.keys(this.tableData?.dataSet[0]).includes('first_name')){
          this.tableData.dataSet = this.tableData?.dataSet?.map((u:any) => {
            u = {...u, user: {photo: u.photo ?? u.photo_url, firstName: u.first_name ?? '', lastName: u.last_name ?? '', otherNames: u.other_names ?? '', email: u.email ?? '', userId: u.userId ?? u.admission_no }};
            return u
          });
        }
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
    const sortedDataSet = [...this.tableData?.dataSet].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    this.filter.startDate = sortedDataSet[0].date;
    this.filter.endDate = new Date().toISOString().slice(0, 10);
  }
  
get filtered(): any[] {
  if (!this.tableData?.dataSet) return [];

  let out = [...this.tableData?.dataSet];

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
    const filterVal = val?.toLowerCase();
    if (!filterVal) return;
    out = out.filter((d: any) =>
      this.getFieldValue(d, key)?.toString().toLowerCase().includes(filterVal)
    );
  });

  return out;
}

get pageItems(): any[] {
  const start = (this.page - 1) * this.tableData?.pageSize;
  return this.filtered.slice(start, start + this.tableData?.pageSize);
}

get totalPages(): number {
  return Math.max(1, Math.ceil(this.filtered.length / this.tableData?.pageSize));
}



  reset(){
    this.refreshSelect = false
    setTimeout(() => {
      this.refreshSelect = true
    }, 0)
  }

  // get pageItems(): any[] {
  //   const start = (this.page - 1) * this.tableData?.pageSize;
  //   return this.filtered?.slice(start, start + this.tableData?.pageSize);
  // }

  // get totalPages(): number {
  //   return Math.max(1, Math.ceil(this.filtered?.length / this.tableData?.pageSize));
  // }

  formatCurrency(val: number | undefined): string {
    if (!val) return '₵0.00';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(val);
  }
  
  onStartDateChange(date: string) {
    if (this.filter?.endDate && new Date(date) > new Date(this.filter?.endDate)) {
      this.api.toast.showToast('Start date cannot be later than End date', 'warning');
      return;
    }
    this.filter.startDate = date;
    this.resetPage();
  }

  onEndDateChange(date: string) {
    if (this.filter?.startDate && new Date(date) < new Date(this.filter?.startDate)) {
      this.api.toast.showToast('End date cannot be earlier than Start date', 'warning');
      return;
    }
    this.filter.endDate = date;
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
    this.formData = { ...this.tableData, isMultiPart: this.tableData?.isMultiPart ?? false, formFields: this.tableData.formFields, allowDownload: this.tableData?.allowDownload ?? false, isEditable: item ? edit : true, isEditing: item && edit ? true : false };
    this.showAddModal = true;
  }

  editItem(item: any) {
    this.openAddModal(item, true);
  }

  viewItem(item: any) {
    this.openAddModal(item, false);
  }
  
  saveItem(item:any, fnx?: string) {
    const action: string = item.action === 'update' ? 'update_' : 'create_'
    delete item.action
      this.api.makeRequest('POST', this.tableData?.path ?? '', {...item, action_type: `${action+this.tableData?.tag.toLowerCase()}`}).then(async (data: any) => {       
        if(!data){
          this.tableData.dataSet = data[this.tableData?.tag?.toLowerCase()]

            if(!this.formData.isEditing){
              this.tableData.dataSet.push(data[this.tableData?.tag?.toLowerCase()]);
            }else{
              const idx = this.tableData?.dataSet?.findIndex((u: any) => u.id === data[this.tableData?.tag?.toLowerCase()].id);
              if (idx !== -1) {
                this.tableData.dataSet[idx] = { ...item };
              }
            };
        }else{
          this.api.toast.showToast(data?.message, 'error');
        }
    })
    this.filtered
    this.closeModal();
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
        message.msg = `Are you sure you want to delete ${ item.name ? `\"${item.name }\"` : `this ${this.tableData.tag.toLowerCase() ?? "item" }?` }`;
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
      this.api.makeRequest('GET', this.tableData?.path ?? '', {id: item.id, action_type: 'delete_item', model: this.tableData?.tag ?? ''}).then(async (data: any) => {
          this.tableData.dataSet = this.tableData?.dataSet.filter((u: any) => u.id !== item.id);
          this.selectedItem = null;
      })
    }
  }

  get getStats() {
    const totalCount = this.tableData?.dataSet?.length;
    const newCount = this.tableData?.dataSet?.filter((d: any) => d?.isNew).length;
    const activeCount = this.tableData?.dataSet?.filter((d: any) => d?.isActive).length;
    const maleCount= this.tableData?.dataSet?.filter((d: any) => d?.gender === 'Male').length;
    const femaleCount= this.tableData?.dataSet?.filter((d: any) => d?.gender === 'Female').length;
    const totalCash = this.filtered?.filter((d) => d?.donationType === 'Cash').reduce((sum, d) => sum + (d?.amount || 0), 0);
    const totalInKindCount = this.filtered?.filter((d) => d?.donationType === 'In-Kind').length;
    const totalPendingCount = this.filtered?.filter((d) => d?.status === 'Pending').length;
    const totalMissedCount = this.filtered?.filter((d) => d?.status === 'Missed').length;
    const totalSwappedCount = this.filtered?.filter((d) => d?.status === 'Swapped').length;
    const totalCompletedCount = this.filtered?.filter((d) => d?.status === 'Completed').length;
    const totalPaidCount = this.filtered?.filter((d) => d?.status === 'Completed').length;
    return { totalCount, newCount, activeCount, maleCount, femaleCount, totalCash, totalInKindCount, totalPendingCount, totalMissedCount, totalCompletedCount, totalPaidCount, totalSwappedCount};
 }

  isImageUrl(url: string): boolean {
    return /\.(jpeg|jpg|png|JPG|JPEG|PNG)$/.test(url);
  } 

  requestSwap(item: any) {
    
  }

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
