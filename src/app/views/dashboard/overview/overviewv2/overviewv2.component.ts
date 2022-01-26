import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, Product, User } from 'src/models';
import { AdminStatModel, SliderWidgetModel } from 'src/models/UxModel.model';
import { ProductService, AccountService, CompanyCategoryService, OrderService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, ORDER_TYPE_SALES, SUPER, TECHNICIAN } from 'src/shared/constants';

@Component({
  selector: 'app-overviewv2',
  templateUrl: './overviewv2.component.html',
  styleUrls: ['./overviewv2.component.scss']
})
export class Overviewv2Component implements OnInit {
  products: Product[];
  allProducts: Product[];
  user: User;
  showAdd: boolean;
  companyLink = '';
  ADMIN = ADMIN;
  SUPER = SUPER;
  showMenu;
  actions: SliderWidgetModel[]
  adminStat: AdminStatModel;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyService: CompanyService,
    private orderService: OrderService,
    private router: Router,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (!this.user || !this.user.Company) {
        this.router.navigate(['home/sign-in'])
        return
      }
      this.companyService.getAdminStat().subscribe(data => {
        if (data && data.Customers) {
          this.adminStat = data;
          this.buidleActions();
        }

      })
    });


  }

  buidleActions() {
    this.actions = [];
    if (this.user && this.user.UserType === ADMIN) {
      this.actions.push(
        {
          Name: `Services waiting for you`,
          Description: `${this.adminStat.ActiveOrders} items`,
          Link: `admin/dashboard/services/1`,
          Icon: `assets/images/icon-waiting.svg`
        },
        {
          Name: `Services history`,
          Description: `${this.adminStat.HistoryOrders}  items`,
          Link: `admin/dashboard/services/2`,
          Icon: `assets/images/icon.svg`
        },
        {
          Name: `Draft Services`,
          Description: `${this.adminStat.DraftOrders} items`,
          Link: `admin/dashboard/services/55`,
          Icon: `assets/images/icon-waiting.svg`
        },
        {
          Name: `Manage Customers`,
          Description: `${this.adminStat.Customers}  Customers`,
          Link: `admin/dashboard/customers`,
          Icon: `assets/images/icon-customer.svg`
        },
        {
          Name: `Parts`,
          Description: `${this.adminStat.Products}  items`,
          Link: `admin/dashboard/products`,
          Icon: `assets/images/icon.svg`
        }, {
        Name: `System users`,
        Description: `${this.adminStat.Users}  items`,
        Link: `admin/dashboard/all-users`,
        Icon: `assets/images/icon-customer.svg`
      }
        , {
          Name: `Testing report questions`,
          Description: `${this.adminStat.Questions}  questions`,
          Link: `admin/dashboard/questions`,
          Icon: `assets/images/icon.svg`
        }
        , {
          Name: `Test reports`,
          Description: `${this.adminStat.Testingreports}  questions`,
          Link: `admin/dashboard/testing-reports`,
          Icon: `assets/images/icon.svg`
        }

      )

      this.actions.push(  {
        Id: 'add-service',
        Name: `Add New  Services`,
        Description: `Click here to log a new service`,
        Link: `event`,
        Icon: `assets/images/icon-add-service.svg`
      }
      ,
      {
        Name: `Draft Services`,
        Description: `${this.adminStat.DraftOrders} items`,
        Link: `admin/dashboard/services/55`,
        Icon: `assets/images/icon-waiting.svg`
      })
    }
    if (this.user && this.user.UserType === TECHNICIAN) {
      this.actions.push(
        {
          Id: 'add-service',
          Name: `Add New  Services`,
          Description: `Click here to log a new service`,
          Link: `event`,
          Icon: `assets/images/icon-add-service.svg`
        }
        ,
        {
          Name: `Draft Services`,
          Description: `${this.adminStat.DraftOrders} items`,
          Link: `admin/dashboard/services/55`,
          Icon: `assets/images/icon-waiting.svg`
        }
       
        ,

        {
          Name: `Manage Customers`,
          Description: `${this.adminStat.Customers}  Customers`,
          Link: `admin/dashboard/customers`,
          Icon: `assets/images/icon-customer.svg`
        },
        {
          Name: `Parts`,
          Description: `${this.adminStat.Products}  items`,
          Link: `admin/dashboard/products`,
          Icon: `assets/images/icon.svg`
        }
        , {
          Name: `Testing report questions`,
          Description: `${this.adminStat.Questions}  questions`,
          Link: `admin/dashboard/questions`,
          Icon: `assets/images/icon.svg`
        }
        , {
          Name: `Test reports`,
          Description: `${this.adminStat.Testingreports}  questions`,
          Link: `admin/dashboard/testing-reports`,
          Icon: `assets/images/icon.svg`
        },
        // {
        //   Name: `Services History`,
        //   Description: `${this.adminStat.HistoryOrders}  items`,
        //   Link: `admin/dashboard/invoices/eeeee`,
        //   Icon: `assets/images/icon.svg`
        // }
      )
    }

  }



  onItemSelectedEvent(event: SliderWidgetModel) {
    console.log(event);
    if (event.Id === 'add-service') {
      this.goto(`fsr/add/basic`);
    }


  }
  loadCategories() {
    throw new Error('Method not implemented.');
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }

  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }
  gotoShop() {
    this.router.navigate([this.user.Company.Slug || this.user.Company.CompanyId]);
  }

  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello!',
        text: 'Check out our shop.',
        url: this.companyLink,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Shop LinkCopied to clipboard.');
    }
  }

  menu() {
    this.showMenu = !this.showMenu;
  }
}
