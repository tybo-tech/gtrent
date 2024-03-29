import { Component, HostListener, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';
import { LoaderUx, PopUx } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedIndex = 3;
  user: User;
  message: PopUx;
  loading: boolean
  loadingUx: LoaderUx;
  showMenu: boolean;
  showScrollUp: boolean;
  constructor(
    private accountService: AccountService,
    private uxService: UxService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.uxMessagePopObservable.subscribe(data => {
      const id1 = setTimeout(() => {
        this.message = data;
      }, 0);
      const id = setTimeout(() => {
        this.message = null;
      }, 3000);
    });


    this.uxService.uxLoadingPopObservable.subscribe(data => {
      const id = setTimeout(() => {
        this.loadingUx = data;
      }, 0);
    });


  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  totop() {
    window.scroll(0, 0);
  }
  goto(item) {
    this.router.navigate([`admin/dashboard/${item}`]);
  }

  logout() {
    this.accountService.logout();
  }
  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.uxService.updatePageYPositionState(window.pageYOffset);
    if (window.pageYOffset > 500) {
      this.showScrollUp = true;
    } else {
      this.showScrollUp = false;
    }
  }
}


