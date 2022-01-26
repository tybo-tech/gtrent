import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Order } from 'src/models/order.model';
import { User } from 'src/models/user.model';
import { BreadModel, SliderWidgetModel, TabsUxModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { UserService } from 'src/services/user.service';
import { ORDER_TYPE_SALES, SERVICE_STATUS } from 'src/shared/constants';

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
  SERVICE_STATUS = SERVICE_STATUS;
  items: BreadModel[];


  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,

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
      this.allOrders = data || [];
      this.loadBread();
      this.custmersItems = [];
      this.allOrders.forEach(item => {
        this.custmersItems.push({
          Id: item.OrdersId,
          Name: `${item.OrderType}${item.OrderNo} | ${item?.Customer?.Name} - ${item.Model}`,
          Description: `${item.Orderproducts && item.Orderproducts.length || 0} Parts used`,
          Link: `admin/dashboard/fsr/${item.OrdersId}/report/${this.orderStatus}`,
          Icon: `assets/images/icon-parts.svg`,
          CanDelete: item.Status === SERVICE_STATUS.DRAFT_SAVED.Name
        })


      })
    });

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
  itemDeleteEvent(item: SliderWidgetModel) {
    const order = this.allOrders.find(x => x.OrdersId === item.Id);
    if (!order)
      return;

    order.StatusId = 99;
    this.orderService.update(order).subscribe(data => {
      this.getOrders();
      this.messageService.add({ severity: 'error', summary: 'Order deleted', detail: '' });
    })
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

  goto(url) {
    this.router.navigate([url]);
  }

  loadBread() {


    this.items = [
      {
        Name: SERVICE_STATUS.PENDING_INVOICE.Name,
        Link: `admin/dashboard/services/${SERVICE_STATUS.PENDING_INVOICE.Id}`,
        Class: Number(this.orderStatus) === SERVICE_STATUS.PENDING_INVOICE.Id ? ['active'] : []
      },
      {
        Name: SERVICE_STATUS.DRAFT_SAVED.Name,
        Link: `admin/dashboard/services/${SERVICE_STATUS.DRAFT_SAVED.Id}`,
        Class: Number(this.orderStatus) === SERVICE_STATUS.DRAFT_SAVED.Id ? ['active'] : []
      },
      {
        Name: SERVICE_STATUS.INVOICED.Name,
        Link: `admin/dashboard/services/${SERVICE_STATUS.INVOICED.Id}`,
        Class: Number(this.orderStatus) === SERVICE_STATUS.INVOICED.Id ? ['active'] : []
      }
    ];
  }
}
