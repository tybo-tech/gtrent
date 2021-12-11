import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User, Order } from 'src/models';
import { Images } from 'src/models/images.model';
import { Item } from 'src/models/item.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { ITEM_TYPES, SERVICE_STATUS } from 'src/shared/constants';

@Component({
    selector: 'app-service-report',
    templateUrl: 'service-report.component.html',
    styleUrls: ['service-report.component.scss']
})
export class ServiceReportComponent {
    @Input() user: User;
    editing: boolean;
    viewing: boolean;
    selectingParts: boolean;
    service: Order;
    SERVICE_STATUS = SERVICE_STATUS;
    serviceLabourItems: Item[];
    serviceConsumables: Item[];

    constructor(
        private orderService: OrderService,
        private accountService: AccountService,
        private router: Router,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.accountService.user.subscribe(data => {
            this.user = data;
        })
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;
            if (this.service && this.user) {
                this.service.TechnicainName = this.service.TechnicainName || this.user.Name
                this.service.TechnicainSigniture = this.service.TechnicainSigniture || this.user.AddressLineWork
            }
            if (this.service && this.service.Items) {
                this.serviceLabourItems = this.service.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_LABOUR.Name)
                this.serviceConsumables = this.service.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_CONSUMABLES.Name)
            }
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

    onUploadFinished(image: Images, userRole: string) {
        console.log(image);
        if (userRole === 'Technician') {
            this.service.TechnicainSigniture = image.Url;
            this.service.TechnicainName = image.SigName;
            this.orderService.saveServiceVoid(this.service);
            this.user.AddressLineWork = image.Url;
            this.userService.updateUserSync(this.user).subscribe(data => {
                if (data && data.UserId) {
                    this.user.AddressLineWork = data.AddressLineWork;
                    this.accountService.updateUserState(this.user);
                }
            });

        }

        if (userRole === 'Customer') {
            this.service.CustomerSigniture = image.Url;
            this.service.CustomerSignitureName = image.SigName;
            this.orderService.saveServiceVoid(this.service);

        }
        // this.showSign = false;
        // this.orderService.updateOrderState(this.order);
    }
}
