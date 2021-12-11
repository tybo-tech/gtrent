import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Order, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { OrderService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER } from 'src/shared/constants';

@Component({
    selector: 'app-service-customer',
    templateUrl: 'service-customer.component.html',
    styleUrls: ['service-customer.component.scss']
})
export class ServiceCustomerComponent {

    @Input() user: User;
    @Output() doneSelectingCustomer: EventEmitter<any> = new EventEmitter<any>();
    customers: Customer[];
    customer: Customer;
    searchString: string;
    heading: string;
    editing: boolean;
    viewing: boolean;
    service: Order;
    constructor(
        private router: Router,
        private orderService: OrderService,
        private customerService: CustomerService,
        private uxService: UxService,
        private messageService: MessageService,

    ) { }

    ngOnInit() {
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;

            if (this.service && this.service.Customer && this.service.CompanyId) {
                this.selectItem(this.service.Customer);
            }
        })
        this.customerService.customersListObservable.subscribe(data => {
            this.customers = data || [];
            this.customers.forEach(item => {
                const nameArray = item.Name.trim().split(' ');
                if (nameArray.length === 1 && item.Name.length > 1)
                    item.Dp = `${item.Name[0]}${item.Name[1]}`.toLocaleUpperCase();

                if (nameArray.length > 1 && item.Name.length > 1)
                    item.Dp = `${item.Name[0]}${nameArray[1][0]}`.toLocaleUpperCase();

            });

        });
        this.customerService.getCustomers(this.user.CompanyId, CUSTOMER);

    }
    selectItem(item: Customer, saveService = false) {
        this.uxService.showLoader();
        this.customerService.getCustomerSync(item.CustomerId).subscribe(data => {
            this.uxService.hideLoader();
            if (data && data.CustomerId) {
                this.customer = data;
                this.editing = false;
                this.viewing = true;
                this.heading = 'Selected Customer';

                // this.doneSelectingCustomer.emit(this.customer);
            }


            if (this.customer && this.service) {
                this.customer = this.customer;
                this.service.Customer = this.customer;
                this.service.CustomerId = this.customer.CustomerId;
                this.service.Shipping = this.customer.Name;
                if (saveService) {
                    this.orderService.saveService(this.service).subscribe(data => {
                        if (data && data.OrdersId) {
                            this.service.OrdersId = data.OrdersId;
                            this.orderService.updateOrderState(this.service);
                            this.router.navigate([`/admin/dashboard/fsr/${this.service.OrdersId}/basic`])
                        }
                    });
                }
            }
        });
    }


    addNewCustomer() {
        // this.router.navigate(['admin/dashboard/customer', 'add']);
        this.customer = {
            CustomerId: '',
            CompanyId: this.user.CompanyId,
            CustomerType: 'Customer',
            Name: '',
            Surname: '',
            Email: '',
            PhoneNumber: '',
            Password: 'notset',
            Dp: '',
            AddressLineHome: '',
            AddressUrlHome: '',
            AddressLineWork: '',
            AddressUrlWork: '',
            CreateUserId: this.user.UserId,
            ModifyUserId: this.user.UserId,
            StatusId: '1',
            UserToken: ''
        };
        this.heading = 'Add new customer';
        this.viewing = false;
        this.editing = true;
    }

    edit() {
        this.heading = 'Edit customer';
        this.editing = true;
        this.viewing = false;
    }

    save() {
        if (this.customer.CustomerId && this.customer.CustomerId.length > 5) {
            this.customerService.updateCustomerSync(this.customer).subscribe(data => {
                if (data && data.CustomerId) {
                    this.editing = false;
                    this.viewing = true;
                    this.showSuccess(`Customer updated`)
                }
            })
        }
        else {
            this.customerService.add(this.customer).subscribe(data => {
                if (data && data.CustomerId) {
                    this.customers.push(data)
                    this.editing = false;
                    this.viewing = true;
                    this.selectItem(data);
                    this.showSuccess(`Customer created`)
                }
            });
        }
    }

    showSuccess(detail, summary = 'Success', severity = 'success') {
        this.messageService.add({ severity: severity, summary: summary, detail: detail });
    }
    back() {
        const order = this.orderService.currentOrderValue;
        if (order && order.Customer) {
            this.doneSelectingCustomer.emit(order.Customer);
        } else {
            this.router.navigate(['/admin/dashboard'])

        }
    }
    next() {
        this.router.navigate([`/admin/dashboard/fsr/${this.service.OrdersId}/work`])
    }
}
