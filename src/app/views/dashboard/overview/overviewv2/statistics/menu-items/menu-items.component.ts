import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { User } from 'src/models/user.model';
import { AccountService, ProductService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { CUSTOMER } from 'src/shared/constants';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit {

  orders: any[];
  customerList: Customer[] = [];
  processingPaidOrders: any[] = [];
  inTransitOrders: any[] = [];
  user: User;
  users: User[];
   products: Product[];
  
  constructor(
    // private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private customerService: CustomerService,
    private productService: ProductService,
    private userService: UserService,



  ) { }


  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.customerService.customersListObservable.subscribe(data => {
      this.customerList = data;
    });
    this.customerService.getCustomers(this.user.CompanyId, CUSTOMER);
    this.productService.getProducts(this.user.CompanyId);
    this.productService.productListObservable.subscribe(data => {
      this.products = data || [];
    });


    this.userService.getAllUsersStync().subscribe(data => {
      if (data) {
        this.users = data;
      }
    })
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }
}
