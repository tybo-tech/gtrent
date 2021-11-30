import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Email } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Machine } from 'src/models/machine.model';
import { ModalModel } from 'src/models/modal.model';
import { UploadService, AccountService, EmailService, OrderService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { JobService } from 'src/services/job.service';
import { MachineService } from 'src/services/machine.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER, IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.scss']
})
export class AddMachineComponent implements OnInit {
  @Output() doneEvent: EventEmitter<Machine> = new EventEmitter<Machine>();

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go back to customers',
    routeTo: 'admin/dashboard/customers',
    img: undefined
  };


  showLoader;

  emailToSend: Email;
  users: Customer[];
  user: any;
  showGotoCustomer: boolean;
  existingCustomer: Customer;
  @Input() heading: string;
  compressorId: string;
  customerId: string;
  @Input() compressor: Machine;
  constructor(
    private uploadService: UploadService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private uxService: UxService,
    private router: Router,
    private emailService: EmailService,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private machineService: MachineService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.compressorId = r.id;
      this.customerId = r.customerId;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, null, null, null, this.compressor);

      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      // this.uploadService.uploadFile(formData).subscribe(url => {
      //   this.customer.Dp = `${environment.API_URL}/api/upload/${url}`;
      // });

    });
  }

  save() {

    if (this.compressor.MachineId && this.compressor.MachineId.length > 5) {
      this.machineService.updateMachineSync(this.compressor).subscribe(data => {
        if (data && data.MachineId) {
         this.doneEvent.emit(data);
        }
      })
    }
    else {

      this.machineService.add(this.compressor).subscribe(data => {
        if (data && data.MachineId) {
          this.doneEvent.emit(data);
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







  getCustomerEmailType(type: string) {
    this.emailToSend = null;
    return this.emailToSend;
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
      this.customerService.getCustomerSync(user.CustomerId).subscribe(data => {
        if (data) {
          if (this.compressorId === 'add') {
            this.compressorId = data.CustomerId;
            // this.selectedIndex = 1;
          }
          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.body.push('Customer details saved.');
          const order = this.orderService.currentOrderValue;
          if (order && order.GoBackToCreateOrder) {
            this.modalModel.routeTo = 'admin/dashboard/create-order';
            this.modalModel.ctaLabel = 'Go back to create order';
            order.GoBackToCreateOrder = false;
            order.Customer = data;
            order.CustomerId = data.CustomerId;
            this.orderService.updateOrderState(order);
          }

        }
      });

    }
  }
close(){
  this.doneEvent.emit(null);
}
}
