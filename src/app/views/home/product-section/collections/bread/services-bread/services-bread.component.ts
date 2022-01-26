import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BreadModel } from 'src/models/UxModel.model';

@Component({
    selector: 'app-services-bread',
    templateUrl: 'services-bread.component.html',
    styleUrls: ['services-bread.component.scss']
})
export class ServicesBreadComponent {
    @Input() items: BreadModel[]
    @Input() heading: string;
    @Input() back: string;
    @Input() status: string;
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
