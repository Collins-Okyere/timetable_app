import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',  // Makes the service globally available
})
export class SidebarService {

  private isSidebarOpenSubject = new BehaviorSubject<boolean>(true);  // Default to open
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();

  toggleSidebar() {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }

  setSidebarState(isOpen: boolean) {
    this.isSidebarOpenSubject.next(isOpen);
  }

  getSidebarState(): boolean {
    return this.isSidebarOpenSubject.value;
  }
  
}
