import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Email } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Machine } from 'src/models/machine.model';
import { MachineParts } from 'src/models/machineparts.model';
import { ModalModel } from 'src/models/modal.model';
import { Order } from 'src/models/order.model';
import { Orderproduct } from 'src/models/order.product.model';
import { Product } from 'src/models/product.model';
import { Shipping, systemShippings } from 'src/models/shipping.model';
import { User } from 'src/models/user.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { EmailService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { CustomerService } from 'src/services/customer.service';
import { OrderService } from 'src/services/order.service';
import { ShippingService } from 'src/services/shipping.service';
import { UserService } from 'src/services/user.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, CUSTOMER, IMAGE_DONE, NOTIFY_EMAILS, ORDER_TYPE_QOUTE, ORDER_TYPE_SALES, TECHNICIAN } from 'src/shared/constants';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  primaryAction = 'Create a new customer';
  compressorListWidget: SliderWidgetModel[];
  customerItem: SliderWidgetModel

  user: User;
  customerId: string;
  showLoader;
  productNameSearch: string;
  notes = '';
  orderFor: string;
  Quantity = 1;
  Price;
  Total = 0;
  productsToChooseFrom: Product[];
  modalHeading: string;
  showChooseProduct: boolean;
  currentItemIndex: number;
  customer: User;
  customerName = '';
  invoiceDate = new Date();
  invoiceDueDate;
  order: Order;
  chooseCustomerLabel = 'Choose existing customer';
  primaryActionSelection = 'Change selection'
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'View Service',
    routeTo: 'dashboard',
    img: undefined
  };
  shippings: Shipping[];
  compressorItem: SliderWidgetModel;
  machineparts: Orderproduct[] = [];
  orderId: string;
  aditMode: boolean;
  showSelectCompressor: boolean;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    // private userService: UserService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private uxService: UxService,
    private shippingService: ShippingService,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.accountService.user.subscribe(data => {
        this.user = data;
      });
      this.orderId = r.id;
      if (this.orderId === 'add') {
        this.aditMode = false;
        this.order = this.orderService.currentOrderValue;

      } else {
        this.aditMode = true;

        this.orderService.getOrderSync(this.orderId).subscribe(data => {
          this.order = data;
          this.orderService.updateOrderState(this.order);
          this.isCustomerSelected(this.order.Customer);
        })
      }

    });
  }

  ngOnInit() {


    // this.orderService.OrderObservable.subscribe(data => {
    //   this.order = data;
    //   if (this.order && this.order.Customer) {

    //   }

    // })

  }



  back() {
    if (this.user && this.user.UserType === ADMIN) {
      this.router.navigate([`/admin/dashboard/invoices/1`]);
    }
    if (this.user && this.user.UserType === TECHNICIAN) {
      this.router.navigate([`/admin/dashboard`]);
    }
  }
  customerChanged(customer: User) {
    console.log(customer);
    this.customerId = customer.UserId;
    this.orderFor = `for ${customer.Name}`;

  }

  calculateTotal(orderproduct: Orderproduct) {
    orderproduct.SubTotal = Number(orderproduct.UnitPrice) *
      Number(orderproduct.Quantity);
    this.calculateTotalOverdue();
  }
  calculateTotalOverdue() {
    this.Total = 0;
    if (this.order && this.order.Orderproducts) {
      this.Total = 0;
      this.order.Orderproducts.forEach(line => {
        this.Total += Number(line.Quantity) * Number(line.UnitPrice);
      });
      return;
    }


  }



  doneSelectingCustomer(customer: Customer) {

    if (customer && this.order) {
      this.customer = customer;
      this.order.Customer = customer;
      this.order.CustomerId = customer.CustomerId;
      this.order.Shipping = customer.Name;
      this.order.Machine = undefined;
      this.compressorItem = undefined;
      this.orderService.updateOrderState(this.order);

      this.customerItem = {
        Id: `${customer.CustomerId}`,
        Name: `${customer.Name}`,
        Description: `${customer.Machines && customer.Machines.length || 0} compressors`,
        Link: `event`,
        Icon: `assets/images/icon-check.svg`
      }
      this.showSelectCompressor = true;
      this.isMachineSelected();
    }

  }

  isCustomerSelected(customer: Customer) {

    if (customer && this.order) {
      this.customer = customer;
      this.order.Customer = customer;
      this.order.CustomerId = customer.CustomerId;


      this.customerItem = {
        Id: `${customer.CustomerId}`,
        Name: `${customer.Name}`,
        Description: `${customer.Machines && customer.Machines.length || 0} compressors`,
        Link: `event`,
        Icon: `assets/images/icon-check.svg`
      }
      this.isMachineSelected();
    }

  }






  abort() {
    this.orderService.updateOrderState({
      OrdersId: '',
      OrderNo: '',
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
    this.back();
  }

  saveInvoice() {

    this.uxService.showLoader();
    this.order.Orderproducts = this.order.Orderproducts.filter(x => x.Selected);
    if (!this.order.Orderproducts.length) {
      // alert();
    }
    this.orderService.create(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.hideLoader();
        this.sendEmailToCustomer(this.order.Customer.Name, data);
        this.sendEmailAdmin('', data);

        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.routeTo = `admin/dashboard/service/${data.OrdersId}`;
        this.modalModel.body.push(`The service was created successfully`);
        this.order = {
          OrdersId: '',
          OrderNo: 'Shop',
          CompanyId: this.user.CompanyId,
          Company: this.user.Company,
          CustomerId: '',
          AddressId: '',
          Notes: '',
          OrderType: ORDER_TYPE_SALES,
          Total: 0,
          Paid: 0,
          Due: 0,
          InvoiceDate: new Date(),
          DueDate: '',
          CreateUserId: 'shop',
          ModifyUserId: 'shop',
          Status: 'Active',
          StatusId: 1,
          ShippingPrice: 0,
          Orderproducts: []
        }
        this.orderService.updateOrderState(this.order);
      }
    });

  }

  isMachineSelected() {
    if (this.order && this.order.AddressId && this.order.OrderType) {
      this.compressorItem = {
        Id: `${this.order.OrderType}`,
        Name: `${this.order.AddressId}`,
        Description: ` ${this.order.OrderSource}`,
        Link: `event`,
        Icon: `assets/images/icon-check.svg`
      }
    }
  }

  onItemSelectedMachineEvent(selectMachine: Machine) {
    if (selectMachine) {

      this.compressorItem = {
        Id: `${selectMachine.MachineId}`,
        Name: `${selectMachine.Model}`,
        Description: `${selectMachine.Serial}`,
        Link: `event`,
        Icon: `assets/images/icon-check.svg`
      }

      this.order.Machine = selectMachine;
      this.order.OrderType = selectMachine.MachineId;
      this.order.AddressId = `${selectMachine.Model}`;
      this.order.OrderSource = `${selectMachine.Serial}`;
      this.orderService.updateOrderState(this.order);
    }
    this.showSelectCompressor = false;


  }


  itemSelectedEventChangeCustomer(event: SliderWidgetModel) {
    this.order.Customer = undefined;
    this.order.CustomerId = undefined;
    this.compressorItem = undefined;
    this.order.Machine = undefined
    this.order.OrderType = undefined
    this.order.AddressId = undefined
    this.order.OrderSource = undefined
    this.orderService.updateOrderState(this.order);

  }

  itemSelectedEventMachine(event: SliderWidgetModel) {
    this.order.Machine = undefined;
    this.compressorItem = undefined;
    this.orderService.updateOrderState(this.order);
  }


  // parts
  onItemPartsEvent(machinepart: MachineParts) {
    if (this.order && !this.order.Orderproducts) {
      this.order.Orderproducts = [];
    }
    if (machinepart) {
      const product = this.order.Orderproducts.find(x => x.ProductId === machinepart.MachinePartId);

      if (!product) {
        this.order.Orderproducts.push(this.mapOrderproduct(machinepart));
      }

      if (product) {
        this.order.Orderproducts.find(x => x.ProductId === machinepart.MachinePartId).Selected = machinepart.Selected;
        this.order.Orderproducts.find(x => x.ProductId === machinepart.MachinePartId).Quantity = machinepart.Qty;
      }

    }
  }
  mapOrderproduct(machinepart: MachineParts): Orderproduct {
    return {
      Id: ``,
      OrderId: ``,
      ProductId: machinepart.MachinePartId,
      CompanyId: this.user.CompanyId,
      ProductName: machinepart.ProductName,
      ProductType: machinepart.ProductType,
      UnitPrice: 0,
      FeaturedImageUrl: ``,
      Colour: ``,
      Size: ``,
      Quantity: machinepart.Qty || 1,
      SubTotal: 0,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1,
      Selected: machinepart.Selected
    };
  }


  updateOrder() {
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.ctaLabel = 'Done';
        this.modalModel.routeTo = `admin/dashboard/invoices/1`;
        this.modalModel.body = ['Service updated'];
        this.order = data;
        this.orderService.updateOrderState(this.order);
      }
    });
  }


  sendEmailAdmin(userName: string, order: Order) {
    let parts = '';
    order.Orderproducts.forEach(item => {
      parts += `${item.Quantity} <a style="font-size: .75em">✖️</a> ${item.ProductType} <b>${item.ProductName}</b> <br>`
      // parts += `<b>${item.ProductName}</b> <br>`
    })
    const data = `
    
    <div style="width: 90%; margin: 1em; padding: 2em; background: #fff; border-radius: 0.5em; text-align: left;">

  <img src="https://gtrent.tybo.co.za/assets/images/common/logoblack2.png" style="width: 10em;" alt=""> <br>
  <h2 style="padding: 1em 0; border-top: 1px solid #CED6E0;">
    Service report
    <span style="display: block; font-size: .75em; font-weight: 400;">
      20 July 2021
    </span>
  </h2>

  <p>
    Hi ${userName},
    <br>  <br>
    Below is the summary of the service report.

    <br><br>

    Customer Name: <b>${order.Customer.Name}</b> <br>
    Compressor: <b>${order.AddressId} ${order.OrderSource}</b> <br>

    <br>

    <b><u>
        Parts Used
      </u></b> <br><br>

    ${parts}
      <br><br>
  </p>

  <p style="border:1px dotted rgb(175, 175, 175); padding: 1em; margin: 1em 0;   white-space: pre-wrap;">
${order.Notes}
</p>
  <p>
  <br>
    Thank you.

    <br>

    <a href="https://www.gtrentcompressors.co.za/">www.gtrentcompressors.co.za/</a>
    <br> <br>
    
    Unit 4, Ruan Access Park, Old Cape Road, Greenbushes, Port Elizabeth <br>
    
    P O BOX 7366, Newton Park, Port Elizabeth, 6055 <br>
    
    Phone 041 451 3701 <br>
    
    <br><br>
  </p>
</div>

    
    `;
    const email = NOTIFY_EMAILS;
    const emailToSend: Email = {
      Email: email,
      Subject: 'New Service Report | Admin copy',
      Message: `${data}`,
      UserFullName: userName,
      Link: `${environment.BASE_URL}`,
      LinkLabel: 'Login to system'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }


  sendEmailToCustomer(userName: string, order: Order) {
    let parts = '';
    order.Orderproducts.forEach(item => {
      // parts += `${item.Quantity} <a style="font-size: .75em">✖️</a> ${item.ProductType} <b>${item.ProductName}</b> <br>`
      parts += `<b>${item.ProductType}</b> <br>`
    })
    const data = `
    
    <div style="width: 90%; margin: 1em; padding: 2em; background: #fff; border-radius: 0.5em; text-align: left;">

  <img src="https://gtrent.tybo.co.za/assets/images/common/logoblack2.png" style="width: 10em;" alt=""> <br>
  <h2 style="padding: 1em 0; border-top: 1px solid #CED6E0;">
    Service report
    <span style="display: block; font-size: .75em; font-weight: 400;">
      20 July 2021
    </span>
  </h2>

  <p>
    Hi ${userName},
    <br>  <br>
    Below is the summary of the service report.

    <br><br>

    Customer Name: <b>${order.Customer.Name}</b> <br>
    Compressor: <b>${order.AddressId} ${order.OrderSource}</b> <br>

    <br>

    <b><u>
        Parts Used
      </u></b> <br><br>

    ${parts}
      <br><br>
  </p>

  <p style="border:1px dotted rgb(175, 175, 175); padding: 1em; margin: 1em 0;   white-space: pre-wrap;">
${order.Notes}
</p>
  <p>
  <br>
    Thank you.

    <br>

    <a href="https://www.gtrentcompressors.co.za/">www.gtrentcompressors.co.za/</a>
    <br> <br>
    
    Unit 4, Ruan Access Park, Old Cape Road, Greenbushes, Port Elizabeth <br>
    
    P O BOX 7366, Newton Park, Port Elizabeth, 6055 <br>
    
    Phone 041 451 3701 <br>
    
    <br><br>
  </p>
</div>

    
    `;
    const email = order.Customer.Email || NOTIFY_EMAILS;
    const emailToSend: Email = {
      Email: email,
      Subject: 'New Service Report  | Customer copy',
      Message: `${data}`,
      UserFullName: userName,
      // Link: `${environment.BASE_URL}`,
      // LinkLabel: 'Login to system'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }


}

