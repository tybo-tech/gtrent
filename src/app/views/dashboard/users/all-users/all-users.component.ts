import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, UserService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  users: User[];
  searchString;
  user: User;
  heading: string;
  loggedInUSer: User;
  usersItems: SliderWidgetModel[]
  showFilter = true;
  constructor(
    private userService: UserService,
    private router: Router,
    private accountService: AccountService,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.loggedInUSer = this.accountService.currentUserValue;
    this.getUsers();

  }
  getUsers() {
    this.userService.getAllUsersStync().subscribe(data => {
      if (data) {
        this.users = data;
        this.usersItems = [];
        this.users.forEach(item => {
          this.usersItems.push({
            Id: item.UserId,
            Name: `${item.Name} - ${item.UserType}`,
            Description: `${item.Email}`,
            Link: `event`,
            Icon: `assets/images/icon-customer.svg`
          })


        })
      }
    });
  }
  view(w) { }
  back() {
    this.router.navigate(['admin/dashboard']);
  }
  add() {
    this.user = {
      UserId: '',
      CompanyId: this.loggedInUSer.CompanyId,
      UserType: 'Admin',
      Name: '',
      Surname: '',
      Email: '',
      PhoneNumber: '',
      Password: `G${Math.floor(Math.random() * 100000)}`,
      Dp: environment.DF_USER_LOGO,
      AddressLineHome: '',
      AddressUrlHome: '',
      AddressLineWork: '',
      AddressUrlWork: '',
      CreateUserId: 'sign-up-shop',
      ModifyUserId: 'sign-up-shop',
      StatusId: '1',
      UserToken: ''
    };
    console.log(this.user);

    this.heading = 'Add user'
  }


  onitemSelected(item: SliderWidgetModel) {
    this.user = this.users.find(x => x.UserId === item.Id);
  }

  doneEvent(user: User) {
    this.uxService.updateMessagePopState("User saved.");
    this.user = null;
    this.getUsers();
  }
}
