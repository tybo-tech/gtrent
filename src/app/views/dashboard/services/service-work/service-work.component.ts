import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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
        private router: Router,
    ) { }

    ngOnInit() {
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;
        });
    }
    orederChanged() {
        this.orderService.updateOrderState(this.service);
        this.orderService.saveServiceVoid(this.service);

        console.log(this.service)
    }

    next() {
        this.router.navigate([`/admin/dashboard/fsr/${this.service.OrdersId}/report`])
    }
}
