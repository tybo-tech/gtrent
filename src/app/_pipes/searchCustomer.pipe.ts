import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from 'src/models/customer.model';

@Pipe({
  name: 'searchCustomer'
})
export class SearchCustomerPipe implements PipeTransform {

  transform(customers: Customer[], val: string): any {

    if (!val) { return customers; }
    if (!customers) { return []; }
    return customers.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
  }

}
