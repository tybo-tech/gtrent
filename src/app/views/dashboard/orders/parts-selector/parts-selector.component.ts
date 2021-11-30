import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Orderproduct, Product, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Machine } from 'src/models/machine.model';
import { MachineParts } from 'src/models/machineparts.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { OrderService, ProductService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { MachinePartsService } from 'src/services/machineparts.service';
import { UxService } from 'src/services/ux.service';
import { PRODUCT_TYPE_JIT, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, STATUS_DELETED } from 'src/shared/constants';

@Component({
  selector: 'app-parts-selector',
  templateUrl: './parts-selector.component.html',
  styleUrls: ['./parts-selector.component.scss']
})
export class PartsSelectorComponent implements OnInit {

  @Input() user: User;
  @Input() customer: Customer;
  @Input() machine: Machine;
  @Output() doneSelectingParts: EventEmitter<MachineParts> = new EventEmitter<MachineParts>();
  @Output() closeSelectingParts: EventEmitter<boolean> = new EventEmitter<boolean>();
  items: SliderWidgetModel[];
  showFilter = true;
  showQty = true;
  primaryAction = 'Create a new part';
  customerItem: SliderWidgetModel[];
  selectIMachine: Machine;
  selectedPart: MachineParts;
  heading: string;
  searchString: string;
  products: Product[];
  showSuccess: boolean;
  newProduct: Product; showAdd: boolean;
  productTypes: string[];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    private uxService: UxService,
    private productService: ProductService,
    private machinePartsService: MachinePartsService,

  ) { }

  ngOnInit() {
    console.log("machine", this.machine);
    if (this.machine && this.machine.Parts && this.machine.Parts.length) {
      this.machine.Parts.map(x => x.Qty = 0);
    }


  }

  add() {
    const order = this.orderService.currentOrderValue;
    if (order) {
      order.GoBackToCreateOrder = true;
      this.orderService.updateOrderState(order);
    }
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }


  onItemSelectedEvent(item: SliderWidgetModel) {
    this.selectedPart = this.selectIMachine.Parts.find(x => x.MachinePartId === item.Id);
    item.Selected = !item.Selected;
    this.selectedPart.Selected = item.Selected;
    this.selectedPart.Qty = item.Qty;
    this.doneSelectingParts.emit(this.selectedPart);
    if (item.Selected) {
      item.Icon = 'assets/images/icon-check.svg'
    } else {
      item.Icon = 'assets/images/icon-parts.svg'

    }
  }

  qty(q: number, item: MachineParts) {
    if (item.Qty + q >= 0) {
      item.Qty += q;
      item.Selected = false;
      this.doneSelectingParts.emit(item);
    }
  }
  onCloseSelectingParts() {
    this.closeSelectingParts.emit(true)
  }


  addParts() {
    this.heading = 'Or choose from existing parts.'
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading parts, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      if (data && data.length) {
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });
        this.products = data.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);
        this.products.map(x => x.IsSelected = this.machine.Parts.find(mp => mp.ProductId === x.ProductId) != null);
        this.loadPartyTypesList();
      }

    })
  }

  savePart(product: Product) {
    const item: MachineParts = {
      MachinePartId: '',
      MachineId: this.machine.MachineId,
      ProductId: product.ProductId,
      CustomerId: this.customer.CustomerId,
      MachineName: this.machine.Name,
      ProductName: product.Name,
      CustomerName: this.customer.Name,
      RegularPrice: product.RegularPrice,
      ProductType: product.ProductType,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    this.machinePartsService.add(item).subscribe(data => {
      this.onDoneEvent(null, 'Part Linked a Compressor.');
      if (data && data.ProductId) {
        data.Qty = 0;
        this.machine.Parts.push(data);
        const order = this.orderService.currentOrderValue;
        order.Machine = this.machine;
        this.orderService.updateOrderState(order);
      }
    })
  }


  onDoneEvent(m: Machine, s = 'Your compressor details have been saved.') {
    this.heading = s;
    this.showSuccess = true;
    window.scroll(0, 0)
    // this.load();


  }

  selectPart(part: Product) {
    part.IsSelected = !part.IsSelected;
    if (part.IsSelected) {
      this.savePart(part);
    } else {
      const item = this.machine.Parts.find(x => x.ProductId === part.ProductId);
      if (item) {
        this.removeParts(item);
      }
    }
  }

  removeParts(machineparts: MachineParts) {
    machineparts.StatusId = STATUS_DELETED;
    this.machinePartsService.updateMachinePartsSync(machineparts).subscribe(data => {
      this.onDoneEvent(null, 'Part Un-Linked a Compressor.')
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
          this.heading = 'Part updated successfully'
        }
      });
    } else {
      this.uxService.updateLoadingState({ Loading: true, Message: 'Adding product..., please wait.' })
      this.productService.add(this.newProduct).subscribe(data => {
        if (data && data.ProductId) {
          this.uxService.hideLoader();
          this.showSuccess = true;
          this.heading = 'Part created successfully';
          this.newProduct = null;
          this.selectPart(data);
          this.products = [];
        }
      });
    }


  }

  loadPartyTypesList() {
    const productTypes = this.products.map(x => x.ProductType);
    this.productTypes = [];
    productTypes.forEach(item => {
      if (!this.productTypes.find(x => x === item)) {
        this.productTypes.push(item);
      }
    })
  }
}
