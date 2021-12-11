import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { User, Order, Product, Orderproduct, Category } from 'src/models';
import { MachineParts } from 'src/models/machineparts.model';
import { CompanyCategoryService, OrderService, ProductService } from 'src/services';
import { MachinePartsService } from 'src/services/machineparts.service';
import { OrderProductsService } from 'src/services/order.products.service';
import { PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING } from 'src/shared/constants';

@Component({
    selector: 'app-service-parts',
    templateUrl: 'service-parts.component.html',
    styleUrls: ['service-parts.component.scss']
})
export class ServicePartsComponent {
    @Input() user: User;
    editing: boolean;
    viewing: boolean;
    selectingParts: boolean;
    service: Order;
    searchString: string;
    products: Product[];
    showAdd: boolean;
    newProduct: Product;
    loading: boolean;
    categories: Category[];

    constructor(
        private orderService: OrderService,
        private productService: ProductService,
        private machinePartsService: MachinePartsService,
        private messageService: MessageService,
        private companyCategoryService: CompanyCategoryService,
        private orderProductsService: OrderProductsService,

    ) { }

    ngOnInit() {
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;
            if (this.service && this.service.Orderproducts && this.service.Machine && this.service.Machine.Parts) {
                this.service.Machine.Parts.forEach(item => {
                    if (this.service.Orderproducts.find(x => x.ProductId === item.MachinePartId))
                        item.Selected = true;
                    else
                        item.Selected = false;
                })
            }
        });

        this.loadAllProducts();
        this.loadPartyTypesList();
    }
    orederChanged() {
        this.orderService.updateOrderState(this.service);
        console.log(this.service)
    }



    loadAllProducts() {
        this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
            if (data && data.length) {
                this.products = data.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);
            }

        })
    }

    addPartsUsedToService(machinepart: MachineParts) {
        if (this.service && !this.service.Orderproducts) {
            this.service.Orderproducts = [];
        }
        if (machinepart) {
            const product = this.service.Orderproducts.find(x => x.ProductId === machinepart.MachinePartId);

            if (!product) {
                this.orderProductsService.add(this.mapOrderproduct(machinepart)).subscribe(data => {
                    if (data && data.OrdersId) {
                        this.service = data;
                        this.orderService.updateOrderState(this.service);
                    }
                })
            }

            if (product) {
                this.service.Orderproducts.find(x => x.ProductId === machinepart.MachinePartId).Selected = machinepart.Selected;
                this.service.Orderproducts.find(x => x.ProductId === machinepart.MachinePartId).Quantity = machinepart.Qty;
            }

        }

    }


    removePartsUsedToService(machinepart: MachineParts) {
        if (this.service && !this.service.Orderproducts) {
            return;
        }
        if (machinepart) {
            const orderproduct = this.service.Orderproducts.find(x => x.ProductId === machinepart.MachinePartId);
            if (!orderproduct)
                return;

            // const index = this.service.Orderproducts.indexOf(orderproduct);
            orderproduct.StatusId = 99;
            this.orderProductsService.update(orderproduct).subscribe(data => {
                if (data && data.OrdersId) {
                    this.service = data;
                    this.orderService.updateOrderState(this.service);
                }
            })

            // if (index >= 0) {
            //     this.service.Orderproducts.splice(index, 1);
            //     this.orderService.updateOrderState(this.service);
            // }

        }

    }



    mapOrderproduct(machinepart: MachineParts): Orderproduct {
        return {
            Id: ``,
            OrderId: this.service.OrdersId,
            ProductId: machinepart.MachinePartId,
            CompanyId: this.user.CompanyId,
            ProductName: machinepart.ProductName,
            ProductType: machinepart.ProductType,
            UnitPrice: 0,
            FeaturedImageUrl: ``,
            Colour: ``,
            Size: ``,
            Quantity: 1,
            SubTotal: 0,
            CreateUserId: '',
            ModifyUserId: '',
            StatusId: 1,
            Selected: machinepart.Selected
        };
    }

    changeQty(qty: number, orderproduct: Orderproduct) {
        if (qty < 0 && Number(orderproduct.Quantity) <= 1)
            return;

        orderproduct.Quantity = Number(orderproduct.Quantity) + qty;
        this.orderProductsService.update(orderproduct).subscribe(data => {
            if (data && data.OrdersId) {
                this.service = data;
                this.orderService.updateOrderState(this.service);
            }
        })
    }

    deletePart(orderproduct: Orderproduct, index) {
        // this.service.Orderproducts.splice(index, 1);
        orderproduct.StatusId = 99;
        this.orderProductsService.update(orderproduct).subscribe(data => {
            if (data && data.OrdersId) {
                this.service = data;
                this.orderService.updateOrderState(this.service);
            }
        })
    }
    linkPart(product: Product) {
        const item: MachineParts = {
            MachinePartId: '',
            MachineId: this.service.Machine.MachineId,
            ProductId: product.ProductId,
            CustomerId: this.service.Customer.CustomerId,
            MachineName: this.service.Machine.Name,
            ProductName: product.Name,
            CustomerName: this.service.Customer.Name,
            RegularPrice: product.RegularPrice,
            ProductType: product.ProductType,
            CreateUserId: this.user.UserId,
            ModifyUserId: this.user.UserId,
            StatusId: 1
        }
        this.machinePartsService.add(item).subscribe(data => {
            this.showMessage('Part Linked a Compressor.');

            if (data && data.ProductId) {
                data.Qty = 0;
                this.service.Machine.Parts.push(data);
                this.orderService.updateOrderState(this.service);
            }
        })
    }

    addProduct() {
        this.productService.updateProductState(null);
        this.showAdd = true;
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


        if (this.newProduct.CreateDate && this.newProduct.ProductId.length) {
            this.loading = true;
            this.productService.update(this.newProduct).subscribe(data => {
                if (data && data.ProductId) {
                    this.showMessage('Part updated successfully');
                    this.loading = false;
                }
            });
        } else {
            this.loading = true;
            this.productService.add(this.newProduct).subscribe(data => {
                if (data && data.ProductId) {
                    this.showMessage('Part created successfully');
                    this.newProduct = null;
                    this.linkPart(data);
                }
            });
        }


    }

    showMessage(detail, summary = 'Success', severity = 'success') {
        this.messageService.add({ severity: severity, summary: summary, detail: detail });
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
