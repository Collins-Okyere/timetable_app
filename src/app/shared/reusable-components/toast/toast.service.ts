import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  private toastSubject = new BehaviorSubject<any>(null);
  toast$ = this.toastSubject.asObservable();

  showToast(message: string, status: 'success' | 'error' | 'warning', link?: { title: string; url: string }) {
    this.toastSubject.next({ message, status, link, isVisible: true });
    setTimeout(() => this.hideToast(), 3000);
  }

  hideToast() {
    this.toastSubject.next(null);
  }

}
