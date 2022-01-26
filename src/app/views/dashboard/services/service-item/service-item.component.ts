import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order, User } from 'src/models';
import { item, Item } from 'src/models/item.model';
import { OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
    selector: 'app-service-item',
    templateUrl: 'service-item.component.html',
    styleUrls: ['service-item.component.scss']
})
export class ServiceItemComponent {
    @Input() user: User;
    editing = false;
    viewing = false
    selectingItems: boolean;
    service: Order;
    allItmes: Item[];
    labourItems: Item[];
    consumables: Item[];
    selectedList: Item[];
    item: Item;
    message: string;
    ITEM_TYPES = ITEM_TYPES;
    heading: string;
    selectedItems: Item[];
    serviceLabourItems: Item[];
    serviceConsumables: Item[];

    constructor(
        private orderService: OrderService,
        private messageService: MessageService,
        private itemService: ItemService,

    ) { }

    ngOnInit() {
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;
            this.serviceLabourItems = this.service.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_LABOUR.Name)
            this.serviceConsumables = this.service.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_CONSUMABLES.Name)
        });
        this.getItems();
    }



    getItems() {

        this.itemService.getItems(this.user.CompanyId, ITEM_TYPES.SETTINGS.Name).subscribe(data => {
            this.allItmes = data || [];
            if (this.allItmes && this.service.Items) {
                this.allItmes.forEach(item => {
                    if (this.service.Items.find(x => x.ItemId === item.ItemId))
                        item.Selected = true;
                    else
                        item.Selected = false;
                })
            }
            this.labourItems = this.allItmes.filter(x => x.ItemType === ITEM_TYPES.LABOUR.Name);
            this.consumables = this.allItmes.filter(x => x.ItemType === ITEM_TYPES.CONSUMABLES.Name);
        });
    }


    addItemsUsedToService(e) { }
    removeItemsUsedToService(e) { }
    selectItems(e) { }
    addItem(_itemType: string = ITEM_TYPES.LABOUR.Name) {
        this.heading = `Add  ${_itemType}(s)`;
        this.selectingItems = true;



        if (_itemType === ITEM_TYPES.CONSUMABLES.Name)
            this.selectedItems = this.consumables;


        this.item = {
            ItemId: '',
            RelatedId: '',
            RelatedParentId: '',
            Name: '',
            ParentId: this.service.OrdersId,
            ItemType: _itemType,
            CompanyId: this.user.CompanyId,
            Description: '',
            OrderingNo: 1,
            Price: 0,
            LimitValue: 0,
            OffLimitPrice: 0,
            ItemStatus: 'Active',
            ItemCode: '',
            ImageUrl: '',
            ItemPin: '',
            ItemCategory: ITEM_TYPES.SETTINGS.Name,
            ItemSubCategory: '',
            CreateUserId: '',
            ModifyUserId: '',
            StatusId: 1
        }

        if (_itemType === ITEM_TYPES.LABOUR.Name) {
            this.selectedItems = this.labourItems;
            item.Name = 'Labour'
        }
    }

    getOrder() {
        this.orderService.getOrder(this.service.OrdersId);
    }

    saveItem() {
        if (this.item.CreateDate) {
            this.itemService.update(this.item).subscribe(data => {
                if (data && data.ItemId) {
                    this.message = 'Item updated successfully.';
                    this.getOrder();
                    this.selectingItems = false;
                }
            })
        } else {
            if (this.item.ItemType === ITEM_TYPES.CONSUMABLES.Name)
                this.item.ItemType = ITEM_TYPES.SERVICE_CONSUMABLES.Name

            if (this.item.ItemType === ITEM_TYPES.LABOUR.Name)
                this.item.ItemType = ITEM_TYPES.SERVICE_LABOUR.Name

            this.itemService.add(this.item).subscribe(data => {
                if (data && data.ItemId) {
                    this.message = 'Item created successfully.';
                    this.getOrder();
                    this.selectingItems = false;
                }
            })
        }

    }

    useItem(_item: Item) {
        this.item.Name = _item.Name;
        this.item.ItemCategory = _item.ItemCategory;
        this.item.ItemSubCategory = _item.ItemSubCategory;
        this.item.Price = _item.Price || 0;
        this.item.LimitValue = _item.LimitValue || 0;
    }

    removeItem(item: Item) {
        item.StatusId = 99;
        this.itemService.update(item).subscribe(data => {
            if (data && data.ItemId) {
                this.message = 'Item updated successfully.';
                this.getOrder();
                this.selectingItems = false;
            }
        })
    }
}
