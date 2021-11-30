import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { Images } from 'src/models/images.model';
import { UploadService } from 'src/services';

@Component({
  selector: 'app-signiture-widget',
  templateUrl: './signiture-widget.component.html',
  styleUrls: ['./signiture-widget.component.scss']
})
export class SignitureWidgetComponent implements AfterViewInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @Input() user: User;
  @Input() useBase64: boolean;
  @Output() onUploadFinished: EventEmitter<Images> = new EventEmitter();

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 300,
    'canvasHeight': 150
  };
  sigName: string;
  dataUrl: string;

  constructor(private uploadService: UploadService) {
    // no-op
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    this.dataUrl = this.signaturePad.toDataURL();
  }

  drawStart() {
  }



  saveImage() {
    const resizedImage = this.dataURLToBlob(this.dataUrl);
    let fileOfBlob = new File([resizedImage], 'sig.png');
    console.log(this.dataUrl);
   

    if (this.useBase64) {
      const image: Images = {
        ImageId: '',
        OtherId: '',
        SigName: this.sigName,
        OptionId: 0,
        Url: this.dataUrl,
        IsMain: 0,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      };
      this.onUploadFinished.emit(image);
    } else {
      let formData = new FormData();
      formData.append('file', fileOfBlob);
      formData.append('name', 'sig');
      this.uploadService.uploadFile(formData).subscribe(response => {
        if (response) {
          const image: Images = {
            ImageId: '',
            OtherId: '',
            SigName: this.sigName,
            OptionId: 0,
            Url: `${environment.API_URL}/api/upload/${response}`,
            IsMain: 0,
            CreateUserId: this.user.UserId,
            ModifyUserId: this.user.UserId,
            StatusId: 1
          };
          this.onUploadFinished.emit(image);
        }
      });
    }



  }
  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
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

}
