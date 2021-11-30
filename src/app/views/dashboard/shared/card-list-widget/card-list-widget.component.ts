import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SliderWidgetModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-card-list-widget',
  templateUrl: './card-list-widget.component.html',
  styleUrls: ['./card-list-widget.component.scss']
})
export class CardListWidgetComponent implements OnInit {
  @Input() items: SliderWidgetModel[];
  @Input() showFilter: boolean;
  @Input() showQty: boolean;
  @Input() primaryAction: string;
  @Output() itemSelectedEvent: EventEmitter<SliderWidgetModel> = new EventEmitter<SliderWidgetModel>();
  searchString: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goto(id: string, item: SliderWidgetModel = undefined) {
    if (id !== 'event') {
      this.router.navigate([id]);
    }

    if (item && id === 'event') {
      this.itemSelectedEvent.emit(item)
    }
  }

  qty(q: number, item: SliderWidgetModel) {
    if (item.Qty + q > 0) {
      item.Qty += q;
      item.Selected = false;
      this.itemSelectedEvent.emit(item)
    }
  }

}
