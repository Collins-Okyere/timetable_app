import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;

  config: any = { isOpen: false };
  currentComponent: any = null;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe((conf: any) => {
      this.config = conf || { isOpen: false };
      this.currentComponent = this.config.component || null;
    });
  }
  

  closeModal() {
    this.config.isOpen = false;
    this.currentComponent = null;
    this.modalService.closeModal();
  }

  onOutsideClick(event: Event) {
    if (!this.modalContainer.nativeElement.contains(event.target as Node)) {
      this.closeModal();
    }
  }
}
