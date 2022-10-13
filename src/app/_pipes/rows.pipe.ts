import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/models';
import { RowModel } from '../views/dashboard/testingreport/_v2/models/RowModel';

@Pipe({
  name: 'rowspipe'
})
export class RowsPipe implements PipeTransform {

  transform(rows: RowModel[]): any {

    if (!rows) { return []; }
    return rows.filter(x => x.DisplayMode === "All" || x.DisplayMode === "Report");
  }

}
