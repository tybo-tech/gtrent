import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraTestingCustomerComponent } from './altra-testing-customer.component';

describe('AltraTestingCustomerComponent', () => {
  let component: AltraTestingCustomerComponent;
  let fixture: ComponentFixture<AltraTestingCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraTestingCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraTestingCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
