import { Component, Input, OnInit } from '@angular/core';
import { SliderWidgetModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-slider-widget',
  templateUrl: './slider-widget.component.html',
  styleUrls: ['./slider-widget.component.scss']
})
export class SliderWidgetComponent implements OnInit {
  @Input() items: SliderWidgetModel[];
  constructor() { }

  ngOnInit() {
  }

}
