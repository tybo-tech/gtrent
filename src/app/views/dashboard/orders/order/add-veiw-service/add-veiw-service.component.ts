import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User, Order, Orderproduct, Email } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Images } from 'src/models/images.model';
import { Machine } from 'src/models/machine.model';
import { MachineParts } from 'src/models/machineparts.model';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, EmailService, OrderService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { ShippingService } from 'src/services/shipping.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, DRAFT, IMAGE_DONE, NOTIFY_EMAILS, ORDER_TYPE_SALES, TECHNICIAN } from 'src/shared/constants';

@Component({
  selector: 'app-add-veiw-service',
  templateUrl: './add-veiw-service.component.html',
  styleUrls: ['./add-veiw-service.component.scss']
})
export class AddVeiwServiceComponent implements OnInit {
  user: User;
  orderId: string;
  order: Order;
  customer: Customer;
  changeCustomer: boolean;
  selectMachine: boolean;
  selectParts: boolean;
  heading = 'Customer Signature';
  showSign: boolean;
  editingCustomer: boolean;
  DRAFT = DRAFT;

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'View Service',
    routeTo: 'dashboard',
    img: undefined
  };
  activeState: boolean[] = [true, false, false, false];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private emailService: EmailService,
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
        this.order = this.orderService.currentOrderValue;

      } else {
        this.orderService.getOrderSync(this.orderId).subscribe(data => {
          this.order = data;
          this.orderService.updateOrderState(this.order);
        })
      }

    });
  }


  ngOnInit() {
  }
  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }
  back() {
    if (this.user && this.user.UserType === ADMIN) {
      this.router.navigate([`/admin/dashboard/invoices/1`]);
    }
    if (this.user && this.user.UserType === TECHNICIAN) {
      this.router.navigate([`/admin/dashboard`]);
    }
  }

  saveCustomer() {
    if (this.order.Customer) {
      this.customerService.updateCustomerSync(this.order.Customer).subscribe(data => {
        if (data && data.CustomerId) {
        }
      })
    }

  }

  doneSelectingCustomer(customer: Customer) {

    if (customer && this.order) {
      this.customer = customer;
      this.order.Customer = customer;
      this.order.CustomerId = customer.CustomerId;
      this.order.Shipping = customer.Name;
      this.orderService.updateOrderState(this.order);
      this.changeCustomer = false;
      this.selectMachine = true;
    }


  }

  onItemSelectedMachineEvent(selectMachine: Machine) {
    if (selectMachine) {
      this.order.Machine = selectMachine;
      this.order.MachineId = selectMachine.MachineId;
      this.order.Model = `${selectMachine.Model}`;
      this.order.Serial = `${selectMachine.Serial}`;
      this.order.Hours = `${selectMachine.Hours}`;
      this.orderService.updateOrderState(this.order);
      this.selectMachine = false;
    }
    this.selectMachine = false;

  }
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

    this.orderService.updateOrderState(this.order);
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
  onUploadFinished(image: Images) {
    console.log(image);
    if (this.heading === 'Technician Signature') {
      this.order.TechnicainSigniture = image.Url;
      this.order.TechnicainName = image.SigName;
    }

    if (this.heading === 'Customer Signature') {
      this.order.CustomerSigniture = image.Url;
      this.order.CustomerSignitureName = image.SigName;
    }
    this.showSign = false;
    this.orderService.updateOrderState(this.order);
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

  saveInvoice() {

    this.order.Orderproducts = this.order.Orderproducts.filter(x => Number(x.Quantity) > 0);
    if (!this.order.Orderproducts.length && !confirm("Please note, There are no selected parts for this service, continue save ?")) {
      return;
    }
    if (!this.order.CustomerSigniture) {
      this.uxService.updateMessagePopState("", { Message: 'Customer sign the services', Class: 'error' });
      return;
    }

    if (!this.order.TechnicainName) {
      this.uxService.updateMessagePopState("", { Message: 'Technicain must  sign the services', Class: 'error' });
      return;
    }

    if (!this.order.Customer.Email) {
      this.uxService.updateMessagePopState("", { Message: 'Please fill in customer email address.', Class: 'error' });
      return;
    }

    if (this.order.Customer.Email.split("@").length != 2) {
      this.uxService.updateMessagePopState("", { Message: 'Customer email address is invalid.', Class: 'error' });
      return;
    }
    this.uxService.showLoader();
    if (this.order.CreateDate) {
      this.orderService.update(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.uxService.hideLoader();
          this.sendEmailToCustomer(this.order.Customer.Name, data);
          this.sendEmailAdmin('', data);

          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.routeTo = `admin/dashboard/service/${data.OrdersId}`;
          this.modalModel.body.push(`The service was updated successfully`);
        }
      });
    } else {
      this.orderService.create(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.uxService.hideLoader();
          this.sendEmailToCustomer(this.order.Customer.Name, data);
          this.sendEmailAdmin('', data);

          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.routeTo = `admin/dashboard/service/${data.OrdersId}`;
          this.modalModel.body.push(`The service was created successfully`);
        }
      });
    }


  }

  saveDaft() {

    this.uxService.showLoader();
    this.order.StatusId = DRAFT;
    this.order.Status = `DRAFT`;

    if (this.order.CreateDate) {
      this.orderService.update(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.uxService.hideLoader();


          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.routeTo = `admin/dashboard/service/${data.OrdersId}`;
          this.modalModel.body.push(`The service was updated as a draft`);
        }
      });
    } else {
      this.orderService.create(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.uxService.hideLoader();


          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.routeTo = `admin/dashboard/service/${data.OrdersId}`;
          this.modalModel.body.push(`The service was created as a draft`);
        }
      });
    }


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
    Technicain: <b>${order.TechnicainName}</b> <br>

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
    Thank you for working with us. We appreciate your business, 
    and we’ll do our best to continue to give you the kind of service you deserve.
    Below is the summary of the service report for the compressor:  <b>${order.AddressId} ${order.OrderSource}</b> .

    <br><br>

    
  <p style="border:1px dotted rgb(175, 175, 175); padding: 1em; margin: 1em 0;   white-space: pre-wrap;">
  ${order.Notes}
  </p>

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
  onCloseSelectingParts(e) {
    this.selectParts = !e;
  }
  deletePart(orderproduct: Orderproduct, index) {
    this.order.Orderproducts.splice(index, 1);
  }
}
