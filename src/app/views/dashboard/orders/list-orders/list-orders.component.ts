import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from 'src/models/order.model';
import { User } from 'src/models/user.model';
import { SliderWidgetModel, TabsUxModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { UserService } from 'src/services/user.service';
import { ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {
  orders: Order[];
  allOrders: Order[];
  user: User;
  modalHeading = 'Add Order';
  showModal: boolean;
  showAddCustomer: boolean;
  orderStatus: any;
  custmersItems: SliderWidgetModel[]
  showFilter = true;
  tabs: TabsUxModel[] = [
    {
      Id: 1,
      Name: 'Active',
      Url: 'admin/dashboard/services/1',
      Class: []
    },
    {
      Id: 55,
      Name: 'Draft',
      Url: 'admin/dashboard/services/55',
      Class: []
    },
    {
      Id: 2,
      Name: 'History',
      Url: 'admin/dashboard/services/2',
      Class: []
    }
  ];;
  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.orderStatus = r.status;
      this.user = this.accountService.currentUserValue;
      this.getOrders();
    });
  }

  ngOnInit() {
  }


  getOrders() {
    this.orderService.OrderListObservable.subscribe(data => {
      this.allOrders = data;
      this.custmersItems = [];
      this.allOrders.forEach(item => {
        this.custmersItems.push({
          Name: `${item.Shipping} - ${item.AddressId}  ${item.OrderSource}`,
          Description: `${item.Orderproducts && item.Orderproducts.length || 0} Parts used`,
          Link: `admin/dashboard/service/${item.OrdersId}`,
          Icon: `assets/images/icon-parts.svg`
        })


      })
    });
    const tab = this.tabs.find(x=>x.Id ===  Number(this.orderStatus));
    this.tabClicked(tab);
    this.orderService.getOrders(this.user.CompanyId, Number(this.orderStatus));
  }
  view(order: Order) {
    this.orderService.updateOrderState(order);
    this.router.navigate(['admin/dashboard/service', order.OrdersId]);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  add() {
    this.orderService.updateOrderState({
      OrdersId: '',
      OrderNo: 'Shop',
      CompanyId: this.user.CompanyId,
      CustomerId: '',
      Customer: undefined,
      AddressId: '',
      Notes: '',
      OrderType: ORDER_TYPE_SALES,
      Total: 0,
      Paid: 0,
      Due: 0,
      InvoiceDate: new Date(),
      DueDate: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'Not paid',
      StatusId: 1,
      Orderproducts: []
    });
    this.router.navigate(['admin/dashboard/create-order']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }
  tabClicked(tab: TabsUxModel) {
    this.tabs.map(x => x.Class = []);
    tab.Class = ['active']
    this.goto(tab.Url);
  }
  goto(url) {
    this.router.navigate([url]);
  }
}
