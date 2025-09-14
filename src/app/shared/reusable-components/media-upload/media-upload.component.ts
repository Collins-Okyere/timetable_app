import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MediaUploadService } from './media-upload.service';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss'],
})
export class MediaUploadComponent {

  config:any = { isOpen: false};
  imageChangedEvent: Event | null = null;
  // defaultImage:any = this.config.image
  croppedImage!: SafeUrl;
  croppedBlob!: Blob
  upload = false    


  constructor(private sanitizer: DomSanitizer, private mediaService: MediaUploadService) {}

  ngOnInit(): void {
    this.mediaService.modalState$.subscribe((conf: any) => {
      this.config = conf || { isOpen: false };
      this.croppedImage = this.config.image
    });
  }

  cancelEvent() {
    this.config = {};
    this.closeModal()
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.upload = true
  }

  // imageCropped(event: ImageCroppedEvent): void {
  //   if (event.objectUrl) {
  //     this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
  //   } else {
  //     this.croppedImage = '';
  //   }
  // }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    } else {
      this.croppedImage = '';
    }
    if (event.blob) {
      this.croppedBlob = event.blob;
    } else if (event.base64) {
      fetch(event.base64).then(res => res.blob()).then(blob => {
        this.croppedBlob = blob;
      });
    }
  }

  imageLoaded(image: LoadedImage): void {
    // Show cropper
  }

  cropperReady(): void {
    // Cropper ready
  }

  loadImageFailed(): void {
    // Show message
  }
  
  // saveItem(): void {
  //   this.upload = false;
  //   if (this.config.okAction) {
  //     this.config.okAction(this.croppedImage ?? this.defaultImage);
  //   }
  //   this.closeModal();
  // }  

  saveItem(): void {
    this.upload = false;
    if (this.config.okAction && this.croppedBlob) {
      const file = new File([this.croppedBlob], 'image.jpg', { type: this.croppedBlob.type });
      this.config.okAction( { blob: file, url: this.croppedImage } ) 
      //this.config.okAction(file);
    } else {
      let message:any = { msg: 'Image not changed.', status: 'error'}
      return message
    }
    this.closeModal();
  }
  

  closeModal() {
    this.config = { isOpen: false};
    this.mediaService.closeModal();
  }

}
