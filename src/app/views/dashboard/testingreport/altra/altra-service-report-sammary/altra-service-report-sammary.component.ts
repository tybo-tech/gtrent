import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Testingreport } from 'src/models/testingreport.model';
import { BreadModel } from 'src/models/UxModel.model';
import { TestingreportService } from 'src/services/testingreport.service';
import { TEST_REPORT_PAGES } from 'src/shared/constants';
// import jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-altra-service-report-sammary',
  templateUrl: './altra-service-report-sammary.component.html',
  styleUrls: ['./altra-service-report-sammary.component.scss']
})
export class AltraServiceReportSammaryComponent implements OnInit {


  @Input() testingreport: Testingreport;
  items: BreadModel[];
  imageUrl: string
  constructor(private router: Router, private testingreportService: TestingreportService) { }

  ngOnInit(): void {
    this.loadBread();
  }

  nextPage() {
    this.makePdf()
    // this.testingreportService.saveTest(this.testingreport);
    // this.router.navigate([`admin/dashboard/test-report/${this.testingreport.TestingReportId || 'add'}/${TEST_REPORT_PAGES.TEST_INFO.Name}`]);
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
  makePdf() {
    // Default export is a4 paper, portrait, using millimeters for units
    // const doc = new jsPDF();

    // doc.text("Hello world!", 10, 10);
    // doc.save("a4.pdf");

    var options = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'webp' },
      html2canvas: {},
      // html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    var content: Element = document.getElementById('element-to-print');
    html2pdf()
      .from(content)
      .set(options)
      .save();

  }
}
