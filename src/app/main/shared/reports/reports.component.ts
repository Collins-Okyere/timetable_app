import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FabBtnComponent } from '../../../shared/reusable-components/fab-btn/fab-btncomponent';
import { SelectInputComponent } from '../../../shared/reusable-components/select-input/select-input.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, FabBtnComponent, SelectInputComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {

  Math  = Math
  reports: any[] = [];
  filter: any = {
    startDate: '',
    endDate: '',
    organisation: null,
    project: null,
    beneficiary: null,
    type: 'All Types',
    search: '',
    tableData: 'All Donations',
  };
  menuOpen: boolean = false;
  refreshSelect: boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  showFilters: boolean = false;
  organisations: any[] = [];
  projects: any[] = [];
  beneficiaries: any[] = [];
  fabData: any = {
    icon: {
      color: 'text-white',
      path: 'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z',
    },
    bgColor: 'bg-emerald-800',
  };
  pageSize = 20;
  page = 1;
  user: any;
  showStats:boolean = true
  columnFilters: any = {
    id: '',
    date: '',
    organisation: '',
    project: '',
    beneficiary: '',
    donationType: '',
    amount: '',
    description: '',
    status: ''
  };


  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.user = this.api.safeJSONParse('currUser');
    this.initData();
    this.setSort('date')
  }

  async initData() {
    try {
      const neededData: any = ['organisations', 'projects', 'beneficiaries', 'reports'];
      const data: any = await this.api.fetchData([...neededData]);
      this.reports = data?.reports;
      this.organisations = [{name: 'All Organisations'}, ...data?.organisations];
      this.projects = [{name: 'All Projects'}, ...data.projects];
      this.beneficiaries = [{name: 'All Beneficiaries'}, ...data?.beneficiaries];
      this.refreshSelect = false
      setTimeout(() => {
        // this.filter.organisation = this.organisations[0]
        // this.filter.project = this.projects[0]
        // this.filter.beneficiary = this.beneficiaries[0]
        this.refreshSelect = true
      },0)
      this.updateDateRangeFromReports();
    } catch (err) {

    }
  }

  updateDateRangeFromReports() {
    if (!this.reports || this.reports.length === 0) return;
    const sortedReports = [...this.reports].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    this.filter.startDate = sortedReports[0].date;
    this.filter.endDate = new Date().toISOString().slice(0, 10);
  }

  get filtered(): any[] {
    let out = [...this.reports];

    // date filter
    if (this.filter.startDate) {
      out = out.filter((d) => new Date(d.date) >= new Date(this.filter.startDate));
    }
    if (this.filter.endDate) {
      out = out.filter((d) => new Date(d.date) <= new Date(this.filter.endDate));
    }

      if (this.filter.tableData === 'Projects') {
        out = out.filter((d) => d.target === 'project');
      }
      if (this.filter.tableData === 'Beneficiaries') {
        out = out.filter((d) => d.target === 'beneficiary');
      }
      if (this.filter.tableData === 'Organisations') {
        out = out.filter((d) => d.target === 'organisation');
      }

    // dropdown filters
    if (this.filter.organisation) {
      out = out.filter((d) => d.organisation?.id === this.filter.organisation);
    }
    if (this.filter.project) {
      out = out.filter((d) => d.project?.id === this.filter.project);
    }
    if (this.filter.beneficiary) {
      out = out.filter((d) => d.beneficiary === this.filter.beneficiary);
    }

    // type filter
    if (this.filter.type && this.filter.type !== 'All Types') {
      out = out.filter((d) => d.donationType === this.filter.type);
    }

    // search
    if (this.filter.search) {
      const q = this.filter.search.toLowerCase();
      out = out.filter(
        (d) =>
          String(d.id ?? '').toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.organisation?.name?.toLowerCase().includes(q) ||
          d.project?.name?.toLowerCase().includes(q) ||
          d.beneficiary?.toLowerCase().includes(q)
      );
    }

    // sorting
    if (this.sortField) {
      out.sort((a, b) => {
        const valA = this.getFieldValue(a, this.sortField);
        const valB = this.getFieldValue(b, this.sortField);

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === 'string') {
          return this.sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      });
    }

    Object.keys(this.columnFilters).forEach((key) => {
      const filterVal = this.columnFilters[key].toLowerCase();
      if (filterVal) {
        out = out.filter((d: any) => {
          const fieldValue =
            key === 'organisation' ? d.organisation?.name :
            key === 'project' ? d.project?.name :
            d[key];

          return fieldValue &&
            fieldValue.toString().toLowerCase().includes(filterVal);
        });
      }
    });


    return out;
  }

  reset(){
    this.refreshSelect = false
    setTimeout(() => {
      // this.filter.organisation = this.organisations[0];
      // this.filter.project = this.projects[0];
      // this.filter.beneficiary = this.beneficiaries[0]
      this.refreshSelect = true
    }, 0)
  }

  get pageItems(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }
  
  get totalDonationsCount(): number {
    return this.filtered.length;
  }

  get totalCash(): number {
    return this.filtered
      .filter((d) => d.donationType === 'Cash')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
  }

  get totalInKindCount(): number {
    return this.filtered.filter((d) => d.donationType === 'In-Kind').length;
  }

  formatCurrency(val: number | undefined): string {
    if (!val) return '₵0.00';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(val);
  }
  
  onStartDateChange(date: string) {
    if (this.filter.endDate && new Date(date) > new Date(this.filter.endDate)) {
      this.api.toast.showToast('Start date cannot be later than End date', 'warning');
      return;
    }
    this.filter.startDate = date;
    this.resetPage();
  }

  onEndDateChange(date: string) {
    if (this.filter.startDate && new Date(date) < new Date(this.filter.startDate)) {
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
    this.showFilters = false;
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

  setSort(field: string, nestedField?: string): void {
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
    this.showFilters = !this.showFilters;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  exportCSV() {
    const rows = [
      ['ID', 'Date', 'Organisation', 'Project', 'Beneficiary', 'Type', 'Amount', 'Description', 'Status'],
    ];

    for (const d of this.filtered) {
      rows.push([
        d.id,
        d.date,
        d.organisation?.name ?? '',
        d.project?.name ?? '',
        d.beneficiary ?? '',
        d.donationType,
        d.donationType === 'Cash' ? d.amount : '',
        d.description ?? '',
        d.status ?? '',
      ]);
    }

    const csvContent = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.text('Donations Report', 14, 15);

    autoTable(doc, {
      head: [
        ['ID', 'Date', 'Organisation', 'Project', 'Beneficiary', 'Type', 'Amount', 'Description', 'Status'],
      ],
      body: this.filtered.map((d) => [
        d.id,
        d.date,
        d.organisation?.name ?? '',
        d.project?.name ?? '',
        d.beneficiary ?? '',
        d.donationType,
        d.donationType === 'Cash' ? d.amount : '',
        d.description ?? '',
        d.status ?? '',
      ]),
      startY: 20,
    });

    doc.save('donations-report.pdf');
  }
}
