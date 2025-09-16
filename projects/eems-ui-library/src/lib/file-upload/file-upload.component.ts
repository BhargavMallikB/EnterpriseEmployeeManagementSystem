import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, HostBinding } from '@angular/core';

@Component({
  selector: 'lib-file-upload',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() accept = '';
  @Input() multiple = false;
  @Input() showPreview = false;
  @Input() customClass = '';
  @Input() dragDrop = false;
  @Input() dropAreaClass = 'drop-area';

  // Button customization inputs
  @Input() buttonLabel: string = 'Upload';
  @Input() buttonVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'plain' | 'custom' = 'primary';
  @Input() buttonSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() buttonDisabled: boolean = false;

  @Output() filesSelected = new EventEmitter<File[]>();

  previewUrls: string[] = [];
  isDragOver = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput?.nativeElement.click();
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  private handleFiles(files: File[]) {
    this.filesSelected.emit(files);
    if (this.showPreview) {
      this.previewUrls = files.map(f => URL.createObjectURL(f));
    }
  }
}
