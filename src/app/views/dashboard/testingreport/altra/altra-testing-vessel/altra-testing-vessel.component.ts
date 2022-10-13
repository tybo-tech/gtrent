import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Images } from 'src/models/images.model';
import { Testingreport } from 'src/models/testingreport.model';
import { BreadModel } from 'src/models/UxModel.model';
import { ImagesService } from 'src/services/images.service';
import { TestingreportService } from 'src/services/testingreport.service';
import { TEST_REPORT_PAGES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-testing-vessel',
  templateUrl: './altra-testing-vessel.component.html',
  styleUrls: ['./altra-testing-vessel.component.scss']
})
export class AltraTestingVesselComponent implements OnInit {

  @Input() testingreport: Testingreport;
  items: BreadModel[];
  manufacturers = [
    `TERRUGGIA`,
    `CSC SRL TERRUGGIA`,
    `COMPAIR HOLMAN LIMITED`,
    `AIRCOM`,
    `ROTAL STEEL PRODUCTS`,
    `DALGAKIRAN`,
    `VANTEL ENGINEERING`,
    `LONGHAI POWER `,
    `SHWE`,
    `SEBATOI AUOCLAVI`,
    `FUJIAN PUMA INDUSTRIAL`,
    `SCHULZ`,
    `CIS SRLVERGATO -BO`,
    `S. PIETRO MOSEZZO`,
    `METROPOLITAN WELDERS & ENG`,
    `G.B.M SIRONE`,
    `COINOX`,
    `VIOLA SA`,
    `HIROSS`,
    `SIAP`,
    `VAN LEER S.A.`,
    `OKS`,


  ]

  constructor(private router: Router, private testingreportService: TestingreportService, private imagesService: ImagesService) { }

  ngOnInit(): void {
    this.loadBread();
  }

  pushImage(image: Images = null) {
    if (image)
      this.testingreport.Images.push(image);


    this.testingreport.Images.push({
      ImageId: '',
      OtherId: '',
      SigName: '',
      OptionId: 0,
      Url: ``,
      IsMain: 0,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    })
  }
  nextPage() {
    this.testingreportService.saveTest(this.testingreport);
    this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.TEST_INFO.Name}`]);
  }
  previousPage() {
    this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.CUSTOMER.Name}`]);

  }

  loadBread() {


    this.items = [
      {
        Name: 'Basic Info',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.CUSTOMER.Name}`,
        Class: ['']
      },
      {
        Name: 'Nameplate',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.VESSEL.Name}`,
        Class: ['active']
      },
      {
        Name: 'Testing info',
        Link: `admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.TEST_INFO.Name}`,
        Class: ['']
      }
    ];
  }

  onImageChangedEvent(url, image: Images) {
    image.Url = url;
    image.OtherId = this.testingreport.TestingReportId;
    if (image.CreateDate) {
      image.StatusId = 99;
      this.imagesService.update(image).subscribe(data => {
        this.testingreportService.getTestingReport(this.testingreport.TestingReportId).subscribe(test => {
          this.testingreport = test;
          this.pushImage();
        })
      });
    } else {
      this.imagesService.add(image).subscribe(data => {
        this.testingreportService.getTestingReport(this.testingreport.TestingReportId).subscribe(test => {
          this.testingreport = test;
          this.pushImage();
        })
      });
    }

  }

}
