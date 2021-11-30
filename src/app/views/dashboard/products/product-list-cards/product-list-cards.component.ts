import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product, User } from 'src/models';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { ProductService, AccountService, CompanyCategoryService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { PRODUCT_ORDER_LIMIT_MAX, PRODUCT_TYPE_JIT, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, STATUS_TRASHED_STRING } from 'src/shared/constants';
import { OLD_DATA } from 'src/shared/old-data';

@Component({
  selector: 'app-product-list-cards',
  templateUrl: './product-list-cards.component.html',
  styleUrls: ['./product-list-cards.component.scss']
})
export class ProductListCardsComponent implements OnInit {

  products: Product[];
  allProducts: Product[];
  user: User;
  showAdd: boolean;
  newProduct: Product;
  searchString: string;
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;
  STATUS_TRASHED_STRING = STATUS_TRASHED_STRING;
  trasheddProducts: Product[];
  activeProducts: Product[];
  productItems: SliderWidgetModel[]
  heading = ' Add new part.';
  showSuccess: boolean;
  showFilter = true;
  categories: Category[];
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading parts, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
      this.allProducts = data || [];
      console.log(this.allProducts);

      this.initProductItems();


    })
    // this.proccessOldData();
  }

  

  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }

  initProductItems() {
    this.productItems = [];
    this.products = this.allProducts.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);
    this.loadPartyTypesList();
    this.products.forEach(item => {
      this.productItems.push({
        Id: item.ProductId,
        Name: `${item.Name}`,
        Description: `${item.ProductType}`,
        Description2: `${item.Customers.map(x => x.CustomerName).toString()}`,
        Link: `event`,
        Icon: `assets/images/icon.svg`,
        RegularPrice: item.RegularPrice,
      })
    })
  }

  addProduct() {
    this.productService.updateProductState(null);
    this.showAdd = true;
    this.showSuccess = false;
    this.heading = ' Add new part.';

    this.newProduct = {
      ProductId: undefined,
      ShowRemainingItems: 6,
      Name: '',
      RegularPrice: 0,
      PriceFrom: 0,
      TotalStock: 0,
      PriceTo: 0,
      Description: '',
      ProductSlug: '',
      CatergoryId: 0,
      ParentCategoryId: 0,
      CategoryName: '',
      ParentCategoryName: '',
      ParentCategoryGuid: '',
      CategoryGuid: '',
      TertiaryCategoryGuid: '',
      TertiaryCategoryName: '',
      ReturnPolicy: '',
      FeaturedImageUrl: '',
      IsJustInTime: PRODUCT_TYPE_STOCK,
      ShowOnline: true,
      EstimatedDeliveryDays: 0,
      OrderLimit: 0,
      SupplierId: '',
      ProductType: 'Air Filter',
      ProductStatus: STATUS_ACTIIVE_STRING,
      Code: '',
      CompanyId: this.user.CompanyId,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
    };
    if (!this.products) {
      this.products = [];
    }
    this.newProduct.Code =
      this.newProduct.Code = `P00${this.products.length + 1}`;
  }
  saveProduct() {
    this.newProduct.ProductSlug = this.productService.generateSlug(this.user.Company.Name, this.newProduct.Name, this.newProduct.Code);
    if (this.newProduct.IsJustInTime === PRODUCT_TYPE_JIT) {
      this.newProduct.TotalStock = this.newProduct.OrderLimit;
    }

    if (this.newProduct.CreateDate && this.newProduct.ProductId.length) {
      this.uxService.updateLoadingState({ Loading: true, Message: 'Updating product..., please wait.' })
      this.productService.update(this.newProduct).subscribe(data => {
        if (data && data.ProductId) {
          this.uxService.hideLoader();
          this.showSuccess = true;
          this.heading = 'Part updated successfully';
          this.initProductItems();

        }
      });
    } else {
      this.uxService.updateLoadingState({ Loading: true, Message: 'Adding product..., please wait.' })
      this.productService.add(this.newProduct).subscribe(data => {
        if (data && data.ProductId) {
          this.uxService.hideLoader();
          this.showSuccess = true;
          this.heading = 'Part created successfully';
          this.initProductItems();

        }
      });
    }


  }


  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.allProducts.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);
  }

  filterWith(status: string) {
    if (status === this.STATUS_TRASHED_STRING) {
      this.products = this.trasheddProducts;
    }
  }
  proccessOldData() {
    this.products = [];
    let customers: string[] = OLD_DATA.split(/\r?\n/g);
    customers = customers.filter(x => x && x.length);

    customers.forEach(x => {
      const compressor = x.split(';');
      if (compressor && compressor.length) {
        const productName = compressor[21];
        const machineModel = compressor[1];
        const machinSerial = compressor[2];
        const notes = compressor[22];
        if (productName && !this.products.find(x => x.Name === productName)) {
          this.products.push({
            ProductId: productName + '-6437',
            ShowRemainingItems: 6,
            Name: productName,
            RegularPrice: 0,
            PriceFrom: 0,
            TotalStock: 0,
            PriceTo: 0,
            Description: '',
            ProductSlug: this.productService.generateSlug('gt', productName, '0'),
            CatergoryId: 0,
            ParentCategoryId: 0,
            CategoryName: '',
            ParentCategoryName: '',
            ParentCategoryGuid: '',
            CategoryGuid: '',
            TertiaryCategoryGuid: '',
            TertiaryCategoryName: '',
            ReturnPolicy: '',
            FeaturedImageUrl: '',
            IsJustInTime: PRODUCT_TYPE_STOCK,
            ShowOnline: true,
            EstimatedDeliveryDays: 0,
            OrderLimit: 0,
            SupplierId: '',
            ProductType: 'Equivalent Engine Air Filter',
            ProductStatus: STATUS_ACTIIVE_STRING,
            Code: '',
            CompanyId: this.user.CompanyId,
            CreateUserId: this.user.UserId,
            ModifyUserId: this.user.UserId,
            StatusId: 1,
          });

        }
      }

    });

    if (this.products && this.products.length) {
      this.productService.addRange(this.products).subscribe(data => {
        // console.log(data);

      })
    }

  }

  back() {
    this.router.navigate(['admin/dashboard']);
  }

  onitemSelected(item: SliderWidgetModel) {
    console.log(this.allProducts);

    this.newProduct = this.allProducts.find(x => x.ProductId === item.Id);
    if (this.newProduct) {
      this.showAdd = true;
      this.heading = 'Veiw/Upate part.';

      console.log(this.newProduct);
    }
  }
  loadPartyTypesList() {

    this.companyCategoryService.getSystemCategories('All', 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length)
        this.categories = data.filter(x => Number(x.StatusId) === 1);
      else
        this.categories = [];

      
    });
 
  }
}
