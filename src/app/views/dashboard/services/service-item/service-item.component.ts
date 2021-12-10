import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order, User } from 'src/models';
import { Item } from 'src/models/item.model';
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


    constructor(
        private orderService: OrderService,
        private messageService: MessageService,
        private itemService: ItemService,

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
        this.getItems();
    }



    getItems() {
        this.itemService.getItems(this.user.CompanyId, ITEM_TYPES.SETTINGS.Name).subscribe(data => {
            this.allItmes = data || [];
            this.labourItems = this.allItmes.filter(x => x.ItemType === ITEM_TYPES.LABOUR.Name);
            this.consumables = this.allItmes.filter(x => x.ItemType === ITEM_TYPES.CONSUMABLES.Name);
        });
    }
    save() {
        if (this.item.CreateDate) {
            this.itemService.update(this.item).subscribe(data => {
                if (data && data.ItemId) {
                    this.message = 'Item updated successfully.';
                    this.getItems();
                    this.item = null;

                }
            })
        } else {
            this.itemService.add(this.item).subscribe(data => {
                if (data && data.ItemId) {
                    this.message = 'Item created successfully.';
                    this.getItems();
                    this.item = null;
                }
            })
        }

    }

    addItemsUsedToService(e) { }
    removeItemsUsedToService(e) { }
    selectItems(e) { }
}
