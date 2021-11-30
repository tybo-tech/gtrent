import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, User } from 'src/models';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-super-categories',
  templateUrl: './super-categories.component.html',
  styleUrls: ['./super-categories.component.scss']
})
export class SuperCategoriesComponent implements OnInit {
  categories: Category[] = [];
  category: Category;
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  index = 0;
  ctaCreate: string;
  showModal: boolean;
  showActive = true;
  modalHeading = 'Add new parent category';
  categoryTertiaryList: Category[] = [];
  productItems: SliderWidgetModel[]
  showFilter = true
  showAdd: boolean;
  showSuccess: boolean;
  constructor(
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    this.companyCategoryService.getSystemCategories('All', 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length)
        this.categories = data.filter(x => Number(x.StatusId) === 1);
      else
        this.categories = [];
    });
  }



  onitemSelected(item: Category) {
    if (item) {
      this.category = item;
      this.showAdd = true;
      this.heading = 'Veiw/Upate part.';
    }
  }

  delete(category: Category) {
    this.companyCategoryService.delete(category.CategoryId).subscribe(data => {
      this.ngOnInit();
    });
  }
  edit(category: Category) {
    this.companyCategoryService.getCategory(category.CategoryId).subscribe(data => {
      if (data && data.CategoryId) {
        this.companyCategoryService.updateCategoryState(data);
        this.router.navigate(['admin/dashboard/super-category', category.CategoryId]);
      }
    });
  }
  add() {
    this.category = {
      CategoryId: '',
      Name: '',
      ParentId: '',
      Description: '',
      DisplayOrder: 0,
      CategoryType: 'Parent',
      CompanyType: 'All',
      ImageUrl: '',
      PhoneBanner: '',
      IsDeleted: false,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Children: []
    };
    this.showAdd = true;
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }



  closeModal() {
    this.showModal = false;
  }



  save() {
    if (this.category.CategoryId && this.category.CategoryId.length > 5) {
      this.companyCategoryService.update(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.showAdd = false;
        }
      });

    }
    else {
      this.companyCategoryService.add(this.category).subscribe(data => {
        if (data && data.CategoryId) {
          this.categories.push(data);
          this.showAdd = false;
        }
      });
    }
  }

}
