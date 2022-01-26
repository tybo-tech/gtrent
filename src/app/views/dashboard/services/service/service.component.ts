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
  backid: any;
  backTo: string = '/admin/dashboard';

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.user = this.accountService.currentUserValue;
      this.orderId = r.id;
      this.step = r.step;
      this.backid = r.backid;
      if (this.backid && !isNaN(this.backid))
        this.backTo = `/admin/dashboard/services/${this.backid}`
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
      if (this.service)
        this.service.Heading = `${this.service.OrderType}${this.service.OrderNo}`
      this.orderService.updateOrderState(this.service);
    })
  }
  initNewService() {
    this.orderService.getMax().subscribe(data => {
      this.service = {
        OrdersId: this.orderId,
        OrderNo: '',
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
      if (data && data.LargestOrderNumber && !this.service.OrderNo) {
        this.service.OrderNo = `${Number(data.LargestOrderNumber) + 1}`
      }
      this.service.Heading = `${this.service.OrderType}${this.service.OrderNo}`
      this.orderService.updateOrderState(this.service);
    })



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
