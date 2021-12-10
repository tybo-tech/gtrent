import { Component, Input } from '@angular/core';
import { User, Order, Orderproduct } from 'src/models';
import { OrderService } from 'src/services';

@Component({
    selector: 'app-service-work',
    templateUrl: 'service-work.component.html',
    styleUrls: ['service-work.component.scss']
})
export class ServiceWorkComponent {
    @Input() user: User;
    editing: boolean;
    viewing: boolean;
    selectingParts: boolean;
    service: Order;
    constructor(
        private orderService: OrderService,
    ) { }

    ngOnInit() {
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;
        });
    }
    orederChanged() {
        this.orderService.updateOrderState(this.service);
        console.log(this.service)
    }


}
