import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/services/api.service';
import { MediaUploadComponent } from './shared/reusable-components/media-upload/media-upload.component';
import { ConfirmModalComponent } from './shared/reusable-components/modals/confirm-modal/confirm-modal.component';
import { ModalComponent } from './shared/reusable-components/modals/modal/modal.component';
import { ToastComponent } from './shared/reusable-components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ModalComponent, MediaUploadComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

  title = 'campus_flow';


}
