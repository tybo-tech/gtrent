import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Item } from 'src/models/item.model';
import { AccountService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ADMIN, CUSTOMER, ITEM_TYPES } from 'src/shared/constants';

@Component({
    selector: 'app-charges',
    templateUrl: 'charges.component.html',
    styleUrls: ['charges.component.scss']
})
export class ChargesComponent {

    ITEM_TYPES = ITEM_TYPES;
    labourItems: Item[] = [];
    allItmes: Item[] = [];
    consumables: Item[] = [];
    ADMIN = ADMIN;
    CUSTOMER = CUSTOMER;
    user: User;
    searchString: string;
    item: Item;
    message: string;
    heading: string;
    constructor(private itemService: ItemService,
        private accountService: AccountService,
        private router: Router,
    ) {

    }

    ngOnInit() {
        this.accountService.user.subscribe(data => {
            this.user = data;
            this.getItems();

        });
    }
    add(_itemType = ITEM_TYPES.LABOUR.Name) {
        this.item = {
            ItemId: '',
            RelatedId: '',
            RelatedParentId: '',
            Name: '',
            ParentId: '',
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
        this.heading = `Add New ${this.item.ItemType}`;
    }
    view(item: Item) {
        this.item = item;
        this.heading = `Update ${this.item.ItemType}`;
    }
    delete(item: Item) {
        this.item = item;
        this.item.StatusId = 99;
        this.save();

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
}
