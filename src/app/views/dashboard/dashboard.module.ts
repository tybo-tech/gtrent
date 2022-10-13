import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule, declarations } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { QuillModule } from 'ngx-quill';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavItemsComponent } from './dashboard/nav-items/nav-items.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AltraTestingCustomerComponent } from './testingreport/altra/altra-testing-customer/altra-testing-customer.component';
import { AltraTestingVesselComponent } from './testingreport/altra/altra-testing-vessel/altra-testing-vessel.component';
import { AltraTestingTestingProccessComponent } from './testingreport/altra/altra-testing-testing-proccess/altra-testing-testing-proccess.component';
import { AltraSubQuestionComponent } from './question/altra-sub-question/altra-sub-question.component';
import { AltraServiceReportSammaryComponent } from './testingreport/altra/altra-service-report-sammary/altra-service-report-sammary.component';
import { ReportV2Component } from './testingreport/_v2/report-v2/report-v2.component';
import { TestReportTemplateComponent } from './testingreport/_v2/test-report-template/test-report-template.component';
import { SketchComponent } from './testingreport/_v2/report-v2/sketch/sketch.component';
import * as $ from "jquery";
import { DatePickerComponent } from './testingreport/_v2/report-v2/date-picker/date-picker.component';



@NgModule({
  imports: [
    CommonModule,
    MatNativeDateModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    // MaterialModule,
    MatSnackBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GooglePlaceModule,
    ClipboardModule,
    MatSlideToggleModule,
    ImageCropperModule,
    SignaturePadModule,
    AccordionModule,
    QuillModule.forRoot(),
    ToastModule,
    ConfirmPopupModule
  ],
  declarations: [...declarations, NavItemsComponent, AltraTestingCustomerComponent, AltraTestingVesselComponent, AltraTestingTestingProccessComponent, AltraSubQuestionComponent, AltraServiceReportSammaryComponent, ReportV2Component, TestReportTemplateComponent, SketchComponent, DatePickerComponent],
  providers: [MessageService, ConfirmationService]
})
export class DashboardModule { }
