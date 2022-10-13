import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Html2CanvasOptions } from 'jspdf';
import { environment } from 'src/environments/environment';
import { UploadService } from 'src/services';

@Component({
  selector: 'app-sketch',
  templateUrl: './sketch.component.html',
  styleUrls: ['./sketch.component.scss']
})
export class SketchComponent implements OnInit, AfterViewInit {
  drawing: boolean;
  @Input() src: string;
  @Output() onDone: EventEmitter<any> = new EventEmitter<any>();
  // canvas: HTMLElement;
  // @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  // @ViewChild('canvas', {static: false}) canvas: ElementRef;
  @ViewChild('myCanvas')
  private canvas: ElementRef = {} as ElementRef;

  context: CanvasRenderingContext2D;
  image: HTMLImageElement;
  extention: string;


  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.image = document.getElementById("editing") as HTMLImageElement;
    this.context = this.canvas.nativeElement.getContext('2d');
    // this.context.canvas.width = window.innerWidth;
    // this.context.canvas.height = window.innerHeight;
    this.context.canvas.width = 400;
    this.context.canvas.height = 400;
    if (this.image) {
      // this.image.crossOrigin = 'Anonymous'
      const src = this.image.src;
      if (src && src.length) {
        const stringSplit = src.split(".");
        if (stringSplit.length)
          this.extention = stringSplit[stringSplit.length - 1];
      }

      this.context.drawImage(this.image, 0, 0, 500, 300);
    }
    this.canvas.nativeElement.addEventListener('mousedown', () => this.startDraw());
    this.canvas.nativeElement.addEventListener('touchstart', () => this.startDraw());
    this.canvas.nativeElement.addEventListener('mouseup', () => this.endDraw());
    this.canvas.nativeElement.addEventListener('touchend', () => this.endDraw());
    this.canvas.nativeElement.addEventListener('mousemove', (e) => this.drawn(e));
    this.canvas.nativeElement.addEventListener('touchmove', (e) => this.drawnPhone(e));
  }
  drawn(e: MouseEvent): any {
    // debugger
    if (!this.drawing) return;
    // debugger
    this.context.lineWidth = 1;
    this.context.lineCap = "round";
    this.context.strokeStyle = "black";
    this.context.lineTo(e.clientX, e.clientY)
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(e.clientX, e.clientY);
  }
  drawnPhone(e: TouchEvent): any {
    // debugger
    if (!this.drawing) return;
    // debugger
    this.context.lineWidth = 1;
    this.context.lineCap = "round";
    this.context.strokeStyle = "red";
    this.context.lineTo(e.touches[0].clientX, e.touches[0].clientY)
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(e.touches[0].clientX, e.touches[0].clientY);
  }
  startDraw() {
    this.drawing = true;
    // console.log('start');

  }
  endDraw() {
    this.drawing = false;
    // console.log('end');
    this.context.beginPath();


  }

  done() {
    var canvas1 = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (canvas1.getContext) {
      var ctx = canvas1.getContext("2d");
      let type = "image/png";
      if(this.extention.toLocaleLowerCase() === 'jpg' || this.extention.toLocaleLowerCase() === 'jpeg')
      type = 'image/jpeg'
      var myImage = canvas1.toDataURL(type);
      const resizedImage = this.dataURLToBlob(myImage);
      let fileOfBlob = new File([resizedImage], `.${this.extention}`);
      // upload
      let formData = new FormData();
      formData.append('file', fileOfBlob);
      formData.append('name', 'iio');
      this.uploadService.uploadFile(formData).subscribe(response => {
        if (response && response.length > 15) {
          this.onDone.emit(`${environment.API_URL}/api/upload/${response}`);
        }
      });
    }
    // var imageElement = document.getElementById("MyPix") ;  
    // imageElement.src = myImage;   


    // this.onDone.emit(false);
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
}
