import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MONTHS } from 'src/shared/constants';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, OnChanges {

  @Input() fullDate: string;
  @Input() name: string;
  @Output() dateEvent: EventEmitter<any> = new EventEmitter<any>();
  days = [];
  years: any[];
  months: string[];

  day: string = '';
  month: string = '';
  year: string = '';
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.populateDates();
  }

  ngOnInit(): void {
    this.loadMetadata();
    this.populateDates();
  }
  populateDates() {
    if (!this.fullDate)
      return;

    const split = this.fullDate.split(' ');
    if (split.length === 3) {
      this.day = split[0];
      this.month = split[1];
      this.year = split[2];
    }
  }

  selectChanged() {
    if (this.day && this.month && this.year) {
      this.fullDate = `${this.day} ${this.month} ${this.year}`;
      this.dateEvent.emit(this.fullDate);
    }
  }
  loadMetadata() {
    let year = new Date().getFullYear();
    this.years = [];
    for (let i = 0; i < 11; i++) {
      this.years.push(year + i);
    }
    if (this.name === 'PREVIOUS_INSPECTION __DATE') {
      this.years = [];
      year = year - 20
      for (let i = 0; i < 21; i++) {
        this.years.push(year + i);
      }
    }

    for (let i = 1; i < 32; i++) {
      this.days.push(i);
    }



    this.months = MONTHS;
  }
}
