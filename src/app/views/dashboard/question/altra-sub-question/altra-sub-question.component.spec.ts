import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraSubQuestionComponent } from './altra-sub-question.component';

describe('AltraSubQuestionComponent', () => {
  let component: AltraSubQuestionComponent;
  let fixture: ComponentFixture<AltraSubQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraSubQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraSubQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
