import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { OrderService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER } from 'src/shared/constants';

@Component({
  selector: 'app-customer-selector',
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss']
})
export class CustomerSelectorComponent implements OnInit {

  @Input() user: User;
  @Output() doneSelectingCustomer: EventEmitter<any> = new EventEmitter<any>();
  customers: Customer[];
  customer: Customer;
  newCustomer: Customer;
  searchString
  constructor(
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    private uxService: UxService

  ) { }

  ngOnInit() {
    this.customerService.customersListObservable.subscribe(data => {
      this.customers = data;
    });
    this.customerService.getCustomers(this.user.CompanyId, CUSTOMER);

  }
  selectItem(item: Customer) {
    this.uxService.showLoader();
    this.customerService.getCustomerSync(item.CustomerId).subscribe(data => {
      this.uxService.hideLoader();
      if (data && data.CustomerId) {
        this.customer = data
        this.doneSelectingCustomer.emit(this.customer);
      }
    });
  }
  add() {
    const order = this.orderService.currentOrderValue;
    if (order) {
      order.GoBackToCreateOrder = true;
      this.orderService.updateOrderState(order);
    }
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }
  addNewCustomer() {
    // this.router.navigate(['admin/dashboard/customer', 'add']);
    this.newCustomer = {
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
  }



  save() {

    if (this.newCustomer.CustomerId && this.newCustomer.CustomerId.length > 5) {
      this.customerService.updateCustomerSync(this.newCustomer).subscribe(data => {
        if (data && data.CustomerId) {
        }
      })
    }
    else {
      this.customerService.add(this.newCustomer).subscribe(data => {
        if (data && data.CustomerId) {
          this.customers.push(data)
          this.newCustomer = null;
          this.selectItem(data);
        }
      });
    }
  }
  back() {
    const order = this.orderService.currentOrderValue;
    if (order && order.Customer) {
      this.doneSelectingCustomer.emit(order.Customer);
    } else {
      this.router.navigate(['/admin/dashboard'])

    }
  }
}
