import { Pipe, PipeTransform } from '@angular/core';
import { SliderWidgetModel } from 'src/models/UxModel.model';

@Pipe({
  name: 'sliderwidgetpipe'
})
export class SearchSliderWidgetPipe implements PipeTransform {

  transform(items: SliderWidgetModel[], val: string): any {

    if (!val) { return items; }
    if (!items) { return []; }
    return items.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase())
      || (x.Description || '').toLocaleLowerCase().includes(val.toLocaleLowerCase())
      || (x.Description2 || '').toLocaleLowerCase().includes(val.toLocaleLowerCase())
      || (x.Id || '') === val

    );
  }

}
