import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UploadService } from 'src/services/upload.service';
import { IMAGE_CROP_SIZE } from 'src/shared/constants';

@Component({
  selector: 'app-image-widget',
  templateUrl: './image-widget.component.html',
  styleUrls: ['./image-widget.component.scss']
})
export class ImageWidgetComponent implements OnInit {
  @Input() image: string;
  @Input() type: string;
  @Output() imageChangedEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() maxSize: number;
  loading: boolean;
  showCanvas: boolean;
  constructor(private uploadService: UploadService) { }

  ngOnInit() {
  }

  uploadOriginal(file) {
    const formData = new FormData();
    formData.append('file', file);
    this.loading = true;
    formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
    this.uploadService.uploadFile(formData).subscribe(response => {
      this.loading = false;
      if (response && response.length > 15) {
        this.imageChangedEvent.emit(`${environment.API_URL}/api/upload/${response}`);
      }
    });

  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }
    this.loading = true;
    Array.from(files).forEach(file => {
      if (file.size < 200000000)
        this.uploadOriginal(file)
      else
        this.resizeImage(file);
    });
  }
  remove() {
    this.imageChangedEvent.emit(``);
  }
  resizeImage(file) {
    if (file.type.match(/image.*/) && file.type !== 'image/gif') {
      console.log('An image has been loaded');

      const reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        const image = new Image();
        image.onload = (imageEvent) => {

          // Resize the image
          const canvas = document.createElement('canvas');
          const maxSize = this.maxSize || IMAGE_CROP_SIZE;
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          const resizedImage = this.dataURLToBlob(dataUrl);
          let extention = 'iio.jpg';
          if (file.type === 'image/gif') {
            extention = 'iio.gif';
          }
          let fileOfBlob = new File([resizedImage], extention);
          // upload
          let formData = new FormData();
          formData.append('file', fileOfBlob);
          formData.append('name', 'iio');
          this.uploadService.uploadFile(formData).subscribe(response => {
            this.loading = false;

            if (response && response.length > 15) {
              this.imageChangedEvent.emit(`${environment.API_URL}/api/upload/${response}`);
            }
          });

        };
        image.src = readerEvent.target.result.toString();
      };
      reader.readAsDataURL(file);
    }

  }
  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      // tslint:disable-next-line: no-shadowed-variable
      const parts = dataURL.split(',');
      // tslint:disable-next-line: no-shadowed-variable
      const contentType = parts[0].split(':')[1];
      // tslint:disable-next-line: no-shadowed-variable
      const raw = parts[1];

      return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
editImage(){
  this.showCanvas = true;
  console.log(this.image);
  
}
onDoneEditing(url: string){
  this.showCanvas = false;
  if(url){
    this.image= url;
    this.imageChangedEvent.emit(url)
  }
}
}
