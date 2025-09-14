import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CapitalizeWordsPipe } from '../../utils/pipes/capitalize-words.pipe';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizeWordsPipe],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  @Input() selectInputData:any = {
    items: [],
    fetchApi: { route: '', param: '' },
    placeholder: 'Select items',
    displayProperty: 'name',
    searchProperty: 'name',
    multiple: false,
    autoClose: true,
    toastData: null,
    defaultValue: null,
    disabled: false,
    searchable: false,
    noOutline: false
  }
  @Output() selectionChanged = new EventEmitter<any[]>();
  selectedItems: any[] = [];
  selectedItem: any = null;
  filteredItems: any[] = [];
  searchQuery: string = '';
  dropdownOpen: boolean = false;

  constructor(
    private elementRef: ElementRef,
  ){}

  ngOnInit() {
    const items = this.selectInputData?.items || [];
    if (this.selectInputData?.displayProperty === 'full_name') {
      items.forEach((item: any) => {
        let id = item.member_id ?? item.staff_id ?? item.employee_id ?? item.student_id;
        item.name = `${item.last_name ?? ''} ${item.other_names ?? ''} ${item.first_name ?? ''}`.trim() + (id ? ` (${id})` : '');
      });
      // if (this.selectInputData?.defaultValue) {
      //   let d = this.selectInputData.defaultValue;
      //   let id = d.member_id ?? d.staff_id ?? d.employee_id ?? d.student_id;
      //   d.name = `${d.last_name ?? ''} ${d.other_names ?? ''} ${d.first_name ?? ''}`.trim() + (id ? ` (${id})` : '');
      // }
    }
    if (this.selectInputData?.defaultValue) {
      if (this.selectInputData?.multiple) {
        this.selectedItems = items.filter((item: any) =>
          this.selectInputData?.defaultValue?.some((def: any) => this.matchItems(def, item))
        );
      } else {
        this.selectedItem = items.find((item: any) =>
          this.matchItems(this.selectInputData?.defaultValue, item)
        ) || this.selectInputData?.defaultValue;
      }
    }
    this.filteredItems = [...items];
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  matchItems(a: any, b: any): boolean {
    if (typeof a === 'string' && typeof b === 'string') return a === b;
    if (a?.id && b?.id) return a.id === b.id;
    const keysToCheck = ['member_id', 'staff_id', 'employee_id', 'student_id'];
    for (const key of keysToCheck) {
      if (a?.[key] && b?.[key] && a[key] === b[key]) return true;
    }
    return JSON.stringify(a) === JSON.stringify(b);
  }

  getDisplayText(item: any): string {
    if (typeof item === 'string') {
      return item;
    }
    const prop = this.selectInputData.displayProperty;
    return item[prop] ?? item.full_name ?? item.name ?? '';
  }

  filterItems(): void {
    const items = this.selectInputData?.items || [];
    const search = (this.searchQuery || '').toLowerCase();
    const searchField = this.selectInputData?.searchProperty;
    const displayField = this.selectInputData?.displayProperty;
    if (!search) {
      this.filteredItems = [...items];
      return;
    }
    this.filteredItems = items.filter((item: any) => {
      if (typeof item === 'string') {
        return item.toLowerCase().includes(search);
      }
      let displayValue = '';
      if (displayField === 'full_name') {
        displayValue = `${item.last_name || ''} ${item.other_names || ''} ${item.first_name || ''}`.trim();
      } else {
        displayValue = item[displayField] || '';
      }
      const searchableField = searchField ? (item[searchField] || '').toLowerCase() : '';
      const displayMatch = displayValue.toLowerCase();
      return searchableField.includes(search) || displayMatch.includes(search);
    });
  }
  
  toggleItemSelection(item: any): void {
    if (this.selectInputData?.multiple) {
      const index = this.selectedItems.indexOf(item);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(item);
      }
      this.selectionChanged.emit(this.selectedItems);
    } else {
      this.selectedItem = item;
      this.selectionChanged.emit(this.selectedItem);
      this.dropdownOpen = true;
    }  
    if (this.selectInputData?.autoClose) {
      this.dropdownOpen = false;
    }
    this.searchQuery = '';
    this.filteredItems = [...this.selectInputData.items];
  }  

  removeItem(item: any): void {
    this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    this.selectionChanged.emit(this.selectedItems); 
    if (this.selectedItems?.length === 0 || this.selectInputData?.autoClose) {
      this.toggleDropdown()
    }
  }

  clearSelection(): void {
    this.selectedItems = [];
    this.selectionChanged.emit([]);
    this.dropdownOpen = false;
  }

  getSelectedItemsText(): string {
    return this.selectedItems.map(item => item[this.selectInputData?.displayProperty]).join(', ');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

}
