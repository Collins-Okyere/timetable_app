import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  
  private modalState = new BehaviorSubject<any>({ isOpen: false });
  modalState$ = this.modalState.asObservable();

  private fullPageSource = new BehaviorSubject<any>({ isFullPage: true});
  isFullPageSource$ = this.fullPageSource.asObservable();

  openModal(config: any) {
    if(config?.isFullPage){
      this.setFullPage({ isFullPage: false, obj: config.obj });
    };
    this.modalState.next({ isOpen: true, ...config });
  }

  closeModal() {
    this.modalState.next({ isOpen: false });
    this.setFullPage({ isFullPage: true });
  }

  setFullPage(val: any) {
    this.fullPageSource.next(val);
  }
  
}
