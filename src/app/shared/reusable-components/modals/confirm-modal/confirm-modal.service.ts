import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  
  private confirmModalState = new BehaviorSubject<any>({ isOpen: false });
  confirmModalState$ = this.confirmModalState.asObservable();

  openModal(config: any) {
    this.confirmModalState.next({ isOpen: true, ...config, closeStatus: config.closeStatus ?? 'default', hideAction: config.hideAction ?? false });
  }

  closeModal() {
    this.confirmModalState.next({ isOpen: false });
  }
  
}
