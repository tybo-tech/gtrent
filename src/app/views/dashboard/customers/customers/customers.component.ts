import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Machine } from 'src/models/machine.model';
import { MachineParts } from 'src/models/machineparts.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { ProductService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { CustomerService } from 'src/services/customer.service';
import { MachineService } from 'src/services/machine.service';
import { CUSTOMER, PART_TYPES } from 'src/shared/constants';
import { CUSTOMERS, CUSTOMERS_COMPRESSORS, OLD_DATA, PARTS } from 'src/shared/old-data';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  showModal: boolean;
  showAddCustomer: boolean;
  showLoader: boolean;
  users: Customer[] = [];
  modalHeading = 'Add customer';
  primaryAction = 'Add customer';
  user: User;
  oldCustomers: Customer[];
  CUSTOMERS = CUSTOMERS;
  searchString: string;
  customerCompressors: Machine[] = [];
  CUSTOMERS_COMPRESSORS = CUSTOMERS_COMPRESSORS;
  parts: any[];
  machineparts: MachineParts[];
  index: number = 3;
  showFilter = true;
  products: Product[];
  customer: Customer;
  heading = 'Adding a new customer';
  custmersItems: SliderWidgetModel[]
  items = [];
  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private machineService: MachineService,
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.customerService.customersListObservable.subscribe(data => {
      this.users = data;
      this.custmersItems = [];
      this.users.forEach(item => {
        this.custmersItems.push({
          Id: item.CustomerId,
          Name: `${item.Name}`,
          Description: `${item.Machines} Compressors`,
          Link: `admin/dashboard/view-customer/${item.CustomerId}`,
          Icon: `assets/images/icon-customer.svg`,
          CanDelete: true
        })


      })
    });
    this.customerService.getCustomers(this.user.CompanyId, CUSTOMER);


    // this.proccessOldData();
    // this.proceessParts();

    // this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
    //   if (data && data.length) {
    //    this.products = data;
    //   }
    // })
  }




  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  view(customer: Customer) {
    this.router.navigate(['admin/dashboard/view-customer', customer.CustomerId]);
  }
  doneEddingCustomer(customer: Customer) {
    if (customer && customer.CustomerId) {
      this.messageService.add({ severity: 'success', summary: 'Order deleted', detail: '' });
      this.view(customer);
    }
  }
  add(e= true) {
    // this.router.navigate(['admin/dashboard/customer', 'add']);
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
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }

  proccessOldData() {


    this.machineparts = [];
    let customers: string[] = OLD_DATA.split(/\r?\n/g);
    customers = customers.filter(x => x && x.length);

    customers.forEach(x => {
      const compressor = x.split(';');
      if (compressor && compressor.length > 19) {
        const customerName = compressor[0];
        const machineModel = compressor[1];
        const machinSerial = compressor[2];
        const part1 = compressor[this.index];
        const part2 = compressor[4];
        const part3 = compressor[5];
        const notes = compressor[22];
        const customer = this.users.find(x => x.Name === customerName);
        if (customer && customer.Machines) {
          const machine = customer.Machines.find(x => x.Model && x.Model === machineModel && x.Serial === machinSerial);
          // const part = this.products.find(x => x.Name && x.Name === part1);

          if (machine && notes) {
            // console.log(customer.Name, machine, part1, part2, part3);
            const machinepart: MachineParts = {
              MachinePartId: '',
              MachineId: machine.MachineId,
              ProductId: 'Notes',
              CustomerId: customer.CustomerId,
              MachineName: machine.Model,
              ProductName: notes,
              CustomerName: customer.Name,
              ProductType: PART_TYPES[this.index - 3],
              CreateUserId: this.user.UserId,
              ModifyUserId: this.user.UserId,
              StatusId: 1
            }
            this.machineparts.push(machinepart);
          }
        }


      }

    });

    console.log(this.machineparts);
    if (this.machineparts && this.machineparts.length) {
      this.machineService.addMachinepartsRange(this.machineparts).subscribe(res => {
        console.log(res);

      })
    }

  }

  itemDeleteEvent(item: SliderWidgetModel) {
    const customer = this.users.find(x => x.CustomerId === item.Id);
    if (!customer)
      return;

      this.customerService.getCustomerSync(customer.CustomerId).subscribe(data=>{
        if(data && data.CustomerId){
          data.StatusId = 99;
          this.customerService.updateCustomerSync(data).subscribe(data_ => {
            this.ngOnInit();
            this.messageService.add({ severity: 'error', summary: 'Customer deleted', detail: '' });
          })
        }
      })

  
  }
}


