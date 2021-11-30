import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AccountService } from 'src/services/account.service';
import { ModalModel } from 'src/models/modal.model';
import { UxService } from 'src/services/ux.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
 
  email = environment.ACCOUNT_TEST_EMAIL;
  password = environment.ACCOUNT_TEST_PASSWORD;
  hidePassword = true;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to login',
    routeTo: 'home/sign-in',
    img: undefined
  };
  error: string;
  loading: boolean;



  constructor(
    private routeTo: Router,
    private accountService: AccountService,
    private location: LocationStrategy,
    private uxService: UxService,
    private _location: Location,


  ) {
  }


  ngOnInit() {

  }

  goto(url) {
    this.routeTo.navigate(['home/sign-in']);
    this.routeTo.navigate([url]);
  }

  back() {

    this.routeTo.navigate(['']);
  }




  Login() {
    this.error = undefined;
    if (!this.email) {
      this.error = 'Please enter your username.'
      return
    }
    if (!this.password) {
      this.error = 'Please enter your password.'
      return
    }
    this.loading = true;
    this.accountService.login({ email: this.email, password: this.password }).subscribe(user => {
      this.loading = false;
      if (user && user.UserId) {
        this.error = '';
        this.accountService.updateUserState(user);
        this.routeTo.navigate(['admin/dashboard']);
      }
      else {
        let err: any = user;
        this.error = 'Username or password is incorrect';
      }
    });
  }


}
