import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmModalService } from './confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {

  config: any = { isOpen: false, status: 'info', closeStatus: 'default', hideAction: false };

  constructor(private confirmService: ConfirmModalService) {}

  ngOnInit(): void {
    this.confirmService.confirmModalState$.subscribe((conf: any) => {
      this.config = conf || { isOpen: false, status: 'info'};
    });
  }

  closeModal() {
    this.config.isOpen = false;
    this.confirmService.closeModal();
  }

}
