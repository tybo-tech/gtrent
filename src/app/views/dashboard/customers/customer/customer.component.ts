import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { IMAGE_DONE, STATUS_ACTIIVE_STRING, STATUS_DELETED } from 'src/shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalModel } from 'src/models/modal.model';
import { OrderService, ProductService } from 'src/services';
import { Customer } from 'src/models/customer.model';
import { CustomerService } from 'src/services/customer.service';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { UxService } from 'src/services/ux.service';
import { JobService } from 'src/services/job.service';
import { Job } from 'src/models/job.model';
import { Machine } from 'src/models/machine.model';
import { MachineParts } from 'src/models/machineparts.model';
import { MachineService } from 'src/services/machine.service';
import { MachinePartsService } from 'src/services/machineparts.service';
import { Product } from 'src/models';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customer: Customer;
  userId: string;
  showModal: boolean;
  modalHeading: string;
  user: any;
  selectedIndex = 0;
  heading: string;
  navHistory: NavHistoryUX;

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go back to customers',
    routeTo: 'admin/dashboard/customers',
    img: undefined
  };
  job: Job;
  compressor: { MachineId: string; CompanyId: any; MachineType: string; Name: string; Make: string; Model: string; Size: string; Serial: string; Hours: string; Motor: string; Moreinfo1: string; Moreinfo2: string; Moreinfo3: string; Moreinfo4: string; MachineStatus: string; CreateUserId: string; ModifyUserId: string; StatusId: number; };
  showSuccess: boolean;
  products: Product[];
  selectedMachine: Machine;
  searchString
  doneEdingParts: boolean;
  editingCustomer: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private accountService: AccountService,
    private orderService: OrderService,
    private jobService: JobService,
    private uxService: UxService,
    private machineService: MachineService,
    private machinePartsService: MachinePartsService,
    private productService: ProductService,
    private _snackBar: MatSnackBar

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.userId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.load();
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })
  }

  load() {

    if (this.userId !== 'add') {
      this.customer = this.customerService.currentCustomerValue;
      this.customerService.getCustomer(this.userId);
      this.customerService.userObservable.subscribe(user => {
        if (user) {
          this.customer = user;
          this.customer.Machines = this.customer.Machines.filter(x => Number(x.StatusId) === 1);
        }
      });
    } else {
      this.customer = {
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
      this.heading = `Adding new customer`;
    }
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
  add() {
    this.showModal = true;
    this.modalHeading = `Assign Subjects to  ${this.customer && this.customer.Name}`;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    const snackBarRef = this._snackBar.open(message, heading, {
      duration: 3000
    });

  }
  saveAll() { }

  addingUserFinished(user: Customer) {
    if (user && user.CustomerId) {
      this.customerService.getCustomerSync(user.CustomerId).subscribe(data => {
        if (data) {
          if (this.userId === 'add') {
            this.userId = data.CustomerId;
            this.selectedIndex = 1;
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

          if (this.navHistory && this.navHistory.BackToAfterLogin) {
            this.job = this.jobService.currentjobValue;
            if (this.job) {
              this.job.Customer = data;
              this.job.CustomerId = data.CustomerId;
              this.jobService.update(this.job).subscribe(data => {
                this.uxService.updateMessagePopState('Customer Selected.');
                this.router.navigate([this.navHistory.BackToAfterLogin]);
                return;
              });
            }

          }
        }
      });

    }
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
  viewMachine(machine: Machine) {
    this.customerService.updateCustomerState(this.customer);
    this.router.navigate([`admin/dashboard/add-machine/${machine.MachineId}/${this.customer.CustomerId}`]);
  }
  editCompressor(m: Machine) {
    m.StatusId = 1;
    m.CompanyId = this.customer.CustomerId
    this.compressor = m;
    this.heading = 'Edit compressor'
  }

  onDoneEvent(m: Machine, s = 'Your compressor details have been saved.') {
    if (!m) {
      this.compressor = m;
      return
    }
    // this.heading = s;
    // this.showSuccess = true;
    this.uxService.updateMessagePopState(undefined,{Message: 'Your compressor details have been saved.',  Class:'_success'})

    this.compressor = null;
    window.scroll(0, 0)
    this.load();


  }

  removeMachine(item: Machine) {
    item.StatusId = STATUS_DELETED;
    this.machineService.updateMachineSync(item).subscribe(data => {
      if (data && data.MachineId) {
        this.onDoneEvent(data, 'Compressor have been deleted.')
      }
    })
  }
  addParts(machine: Machine) {
    this.selectedMachine = machine;
    this.doneEdingParts = false;
    this.heading = 'Add parts to a compressor'
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading parts, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      if (data && data.length) {
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });
        this.products = data.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);
        this.products.map(x => x.Selected = true);
      }

    })
  }
  savePart(product: Product) {
    const machine: Machine = this.selectedMachine;
    const item: MachineParts = {
      MachinePartId: '',
      MachineId: machine.MachineId,
      ProductId: product.ProductId,
      CustomerId: this.customer.CustomerId,
      MachineName: machine.Name,
      ProductName: product.Name,
      CustomerName: this.customer.Name,
      ProductType: product.ProductType,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    this.machinePartsService.add(item).subscribe(data => {
      this.onDoneEvent(null, 'Part Linked a Compressor.');
      this.selectedMachine.Parts.push(data);
      this.doneEdingParts = true;
      this.uxService.updateMessagePopState(undefined,{Message: 'Part added to a compressor.',  Class:'_success'})
    })
  }
  selectPart(part: Product) {
    part.IsSelected = !part.IsSelected
  }
  removeParts(machineparts: MachineParts, machine: Machine) {
    machineparts.StatusId = STATUS_DELETED;
    this.machinePartsService.updateMachinePartsSync(machineparts).subscribe(data => {
      this.onDoneEvent(null, 'Part Un-Linked a Compressor.');
      if (machine)
        machine.Parts = machine.Parts.filter(x => +x.StatusId != STATUS_DELETED);
        this.uxService.updateMessagePopState(undefined,{Message: 'Part removed.',  Class:'_danger'})

    })
  }
}
