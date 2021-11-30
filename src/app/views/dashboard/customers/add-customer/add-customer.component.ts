import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, EmailService, OrderService, UploadService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { JobService } from 'src/services/job.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER, IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  @Input() customer: Customer;
  @Input() heading: string;
  @ViewChild('places') places: GooglePlaceDirective;
  showAdd = true;
  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  }

  showLoader;
  x: AddressComponent;
  address: Address;

  emailToSend: Email;
  users: Customer[];
  user: any;
  showGotoCustomer: boolean;
  existingCustomer: Customer;
  userId: string;
  constructor(
    private uploadService: UploadService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private uxService: UxService,
    private router: Router,
    private emailService: EmailService,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private jobService: JobService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.userId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.customerService.customersListObservable.subscribe(data => {
      this.users = data;
    });

  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, this.customer);
    });
  }

  save() {
    if (this.address && this.address.formatted_address) {
      this.customer.AddressLineHome = this.address.formatted_address;
    }

    if (this.customer.CustomerId && this.customer.CustomerId.length > 5) {
      this.customerService.updateCustomerSync(this.customer).subscribe(data => {
        if (data && data.CustomerId) {
          this.addingUserFinished(data);
        }
      })
    }
    else {
      if (this.checkIfCustomerExist()) {
        this.uxService.updateMessagePopState('Customer already exist.');
        this.showGotoCustomer = true;
        return false
      }
      this.customerService.add(this.customer).subscribe(data => {
        if (data && data.CustomerId) {
          this.addingUserFinished(data);
          // this.sendEmail(data, 'Add-New-Customer');
        }
      });
    }
  }

  sendEmail(user: Customer, type: string) {
    this.emailService.getCustomerEmails().subscribe(emailData => {
      this.emailToSend = emailData.find(x => x.Type === type)
      this.emailToSend.UserFullName = user.Name;
      this.emailToSend.Email = user.Email;
      this.emailService.sendGeneralTextEmail(this.emailToSend).subscribe(data => {
        if (data > 0) {
          this.addingUserFinished(user);
        } else {
          alert('Something went wrong');
        }
      })

    });
  }


  handleAddressChange(address: Address) {
    if (address && address.formatted_address) {
      this.address = address;
    }
    this.x = this.getComponentByType(address, "street_number");
  }


  public getComponentByType(address: Address, type: string): AddressComponent {
    if (!type)
      return null;

    if (!address || !address.address_components || address.address_components.length == 0)
      return null;

    type = type.toLowerCase();

    for (let comp of address.address_components) {
      if (!comp.types || comp.types.length == 0)
        continue;

      if (comp.types.findIndex(x => x.toLowerCase() == type) > -1)
        return comp;
    }
    return null;
  }


  getCustomerEmailType(type: string) {
    this.emailToSend = null;
    return this.emailToSend;
  }

  checkIfCustomerExist() {
    const customer = this.users && this.users.find(x => x.Email && x.Email.length > 4 && x.Email.includes('@') && x.Email === this.customer.Email);
    if (customer) {
      this.existingCustomer = customer;
    }
    return customer;
  }

  view(user: Customer) {
    this.customerService.updateCustomerState(user);
    this.router.navigate(['admin/dashboard/customer', user.CustomerId]);
    location.reload();

  }

  back() {
    const order = this.orderService.currentOrderValue;
    if (order && order.GoBackToCreateOrder) {
      order.GoBackToCreateOrder = false;
      this.orderService.updateOrderState(order);
      this.router.navigate([`admin//dashboard/create-order`]);
      return;
    }
    this.router.navigate([`admin//dashboard/customers`]);
  }


  addingUserFinished(user: Customer) {
    if (user && user.CustomerId) {
      if (this.userId === 'add') {
        this.userId = user.CustomerId;
      }
      const order = this.orderService.currentOrderValue;
      if (order && order.GoBackToCreateOrder) {
        order.GoBackToCreateOrder = false;
        order.Customer = user;
        order.CustomerId = user.CustomerId;
        this.orderService.updateOrderState(order);
      }
      // this.customerService.getCustomerSync(user.CustomerId).subscribe(data => {
      //   if (data) {
        
      //   }
      // });

    }
  }
}
