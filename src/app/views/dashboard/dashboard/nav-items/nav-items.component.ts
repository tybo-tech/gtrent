import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/services';

@Component({
  selector: 'app-nav-items',
  templateUrl: './nav-items.component.html',
  styleUrls: ['./nav-items.component.scss']
})
export class NavItemsComponent implements OnInit {
  @Output() doneSelectingItem: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }
  logout() {
    this.accountService.logout();
  }

  navClicked() {
    this.doneSelectingItem.emit(true);
  }
}
