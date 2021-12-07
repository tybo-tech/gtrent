import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-bread',
  templateUrl: './bread.component.html',
  styleUrls: ['./bread.component.scss']
})
export class BreadComponent implements OnInit {
  @Input() items: BreadModel[]
  @Input() heading: string;
  @Input() back: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goBack() {
    this.router.navigate([this.back])
  }

  tab(item: BreadModel) {
    if (!item)
      return
    this.items.map(x => x.Class = []);
    item.Class = ['active']
    this.router.navigate([item.Link]);
  }
}
