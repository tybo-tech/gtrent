import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
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
  @Output() itemDeleteEvent: EventEmitter<SliderWidgetModel> = new EventEmitter<SliderWidgetModel>();
  @Output() primaryActionEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  searchString: string;
  constructor(private router: Router, private confirmationService: ConfirmationService) { }

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
  confirm(event: Event, item) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Item will be deleted, Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
      this.itemDeleteEvent.emit(item)

      },
      reject: () => {
        //reject action
      }
    });
  }

  primaryActionClicked(){
    this.primaryActionEvent.emit(true)
  }
}
