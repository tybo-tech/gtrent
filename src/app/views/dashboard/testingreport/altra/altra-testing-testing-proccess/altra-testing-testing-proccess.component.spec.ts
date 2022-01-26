import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraTestingTestingProccessComponent } from './altra-testing-testing-proccess.component';

describe('AltraTestingTestingProccessComponent', () => {
  let component: AltraTestingTestingProccessComponent;
  let fixture: ComponentFixture<AltraTestingTestingProccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraTestingTestingProccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraTestingTestingProccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
