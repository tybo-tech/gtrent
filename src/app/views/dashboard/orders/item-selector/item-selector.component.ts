import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Machine } from 'src/models/machine.model';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { CustomerService } from 'src/services/customer.service';
import { OrderService } from 'src/services/order.service';
import { CUSTOMER } from 'src/shared/constants';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;
  @Output() doneSelectingMachine: EventEmitter<Machine> = new EventEmitter<Machine>();
  showFilter = true;
  primaryAction = 'Create a new compressor';
  customerItem: SliderWidgetModel[];
  machine: Machine;
  compressor: Machine;
  heading: string;
  showSuccess: boolean;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,

  ) { }

  ngOnInit() {
    if (this.customer) {
    }
  }
  selectItem(item) {
    this.doneSelectingMachine.emit(item);
  }
  add() {
    const order = this.orderService.currentOrderValue;
    if (order) {
      order.GoBackToCreateOrder = true;
      this.orderService.updateOrderState(order);
    }
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }



  onItemSelectedEvent(item: SliderWidgetModel) {
    this.machine = this.customer.Machines.find(x => x.MachineId === item.Id);
    this.doneSelectingMachine.emit(this.machine);
  }


  addMachine() {
    this.compressor = {
      MachineId: "",
      CompanyId: this.customer.CustomerId,
      MachineType: "",
      Name: "",
      Make: "",
      Model: "",
      Size: "",
      Serial: "",
      Hours: "",
      Motor: "",
      Moreinfo1: "",
      Moreinfo2: "",
      Moreinfo3: "",
      Moreinfo4: "",
      MachineStatus: "Active",
      CreateUserId: "",
      ModifyUserId: "",
      StatusId: 1,
    };
    this.heading = `Adding new compressor`;
    // this.customerService.updateCustomerState(this.customer);
    // this.router.navigate([`admin/dashboard/add-machine/add/${this.customer.CustomerId}`]);
  }


  onDoneEvent(m: Machine, s = 'Your compressor details have been saved.') {
    this.heading = s;
    this.showSuccess = true;
    this.compressor = null;

    if (m && m.MachineId) {
      m.Parts = [];
      this.customer.Machines.push(m);
    }
    const order = this.orderService.currentOrderValue;
    order.Customer = this.customer;
    this.orderService.updateOrderState(order);

  }
}
