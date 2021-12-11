import { Component, OnInit } from '@angular/core';
import { AccountService, OrderService } from 'src/services';
import { Order, User } from 'src/models';
import { ActivatedRoute } from '@angular/router';
import { BreadModel } from 'src/models/UxModel.model';
import { SERVICE_STATUS } from '../../../../../shared/constants';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  user: User;
  service: Order;
  orderId: any;
  step = 'customer';
  items: BreadModel[];

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.user = this.accountService.currentUserValue;
      this.orderId = r.id;
      this.step = r.step;
      this.loadBread();
      

      if (this.orderId === 'add')
        this.initNewService();
      else
        this.getOrder();
    });
  }

  ngOnInit() {
  }
  getOrder() {
    this.orderService.getOrderSync(this.orderId).subscribe(data => {
      this.service = data;
      this.orderService.updateOrderState(this.service);
    })
  }
  initNewService() {
    const service = this.orderService.currentOrderValue;
    if (!service) {
      this.service = {
        OrdersId: this.orderId,
        OrderNo: 'Shop',
        CompanyId: this.user.CompanyId,
        Company: this.user.Company,
        CustomerId: '',
        AddressId: '',
        Notes: '',
        OrderType: 'FSR',
        Total: 0,
        Paid: 0,
        Due: 0,
        InvoiceDate: new Date(),
        DueDate: '',
        CreateUserId: 'shop',
        ModifyUserId: 'shop',
        Status: SERVICE_STATUS.DRAFT_NOT_SAVED.Name,
        StatusId: 1,
        ShippingPrice: 0
      };
      this.orderService.updateOrderState(this.service);
    }

  }
  loadBread() {


    this.items = [
      {
        Name: 'Basic',
        Link: `admin/dashboard/fsr/${this.orderId}/basic`,
        Class: this.step === 'basic' ? ['active'] : []
      },
      {
        Name: 'Work',
        Link: `admin/dashboard/fsr/${this.orderId}/work`,
        Class: this.step === 'work' ? ['active'] : []
      },
      {
        Name: 'Report',
        Link: `admin/dashboard/fsr/${this.orderId}/report`,
        Class: this.step === 'report' ? ['active'] : []
      }
    ];
  }
}
