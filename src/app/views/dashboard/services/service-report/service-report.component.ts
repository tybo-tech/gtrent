import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { User, Order, Email } from 'src/models';
import { Images } from 'src/models/images.model';
import { Item } from 'src/models/item.model';
import { AccountService, EmailService, OrderService, UserService } from 'src/services';
import { ITEM_TYPES, NOTIFY_EMAILS, SERVICE_STATUS } from 'src/shared/constants';

@Component({
    selector: 'app-service-report',
    templateUrl: 'service-report.component.html',
    styleUrls: ['service-report.component.scss']
})
export class ServiceReportComponent {
    @Input() user: User;
    editing: boolean;
    viewing: boolean;
    selectingParts: boolean;
    service: Order;
    SERVICE_STATUS = SERVICE_STATUS;
    serviceLabourItems: Item[];
    serviceConsumables: Item[];
    errors: string[];

    constructor(
        private orderService: OrderService,
        private accountService: AccountService,
        private router: Router,
        private userService: UserService,
        private emailService: EmailService,
        private messageService: MessageService,

    ) { }

    ngOnInit() {
        this.accountService.user.subscribe(data => {
            this.user = data;
        })
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;
            if (this.service && this.user) {
                this.service.TechnicainName = this.service.TechnicainName || this.user.Name
                this.service.TechnicainSigniture = this.service.TechnicainSigniture || this.user.AddressLineWork
            }
            if (this.service && this.service.Items) {
                this.serviceLabourItems = this.service.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_LABOUR.Name)
                this.serviceConsumables = this.service.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_CONSUMABLES.Name)
            }
        });
    }
    orederChanged() {
        this.orderService.updateOrderState(this.service);
        this.orderService.saveServiceVoid(this.service);

        console.log(this.service)
    }

    next() {
        this.errors = [];
        // this.router.navigate([`/admin/dashboard/fsr/${this.service.OrdersId}/report`])ser
        this.service.Status = SERVICE_STATUS.PENDING_INVOICE.Name;
        this.service.StatusId = SERVICE_STATUS.PENDING_INVOICE.Id;
        if (!this.service.CustomerSigniture) {
            this.errors.push('Please let the customer sign the report before you publish');
        }
        if (this.errors.length)
            return false
        this.orderService.saveService(this.service).subscribe(data => {
            this.orderService.updateOrderState(this.service);
            this.showMessage('SFR published, Email sent to the customer and the admim')
            this.resend();
        })
    }
    invoiced() {
        // this.router.navigate([`/admin/dashboard/fsr/${this.service.OrdersId}/report`])ser
        this.service.Status = SERVICE_STATUS.INVOICED.Name;
        this.service.StatusId = SERVICE_STATUS.INVOICED.Id;
        this.orderService.saveService(this.service).subscribe(data => {
            this.orderService.updateOrderState(this.service);
            this.showMessage('FSR was invoiced.')
        })
    }

    onUploadFinished(image: Images, userRole: string) {
        console.log(image);
        if (userRole === 'Technician') {
            this.service.TechnicainSigniture = image.Url;
            this.service.TechnicainName = image.SigName;
            this.orderService.saveServiceVoid(this.service);
            this.user.AddressLineWork = image.Url;
            this.userService.updateUserSync(this.user).subscribe(data => {
                if (data && data.UserId) {
                    this.user.AddressLineWork = data.AddressLineWork;
                    this.accountService.updateUserState(this.user);
                }
            });
            this.showMessage('Signiture applied')

        }

        if (userRole === 'Customer') {
            this.service.CustomerSigniture = image.Url;
            this.service.CustomerSignitureName = image.SigName;
            this.orderService.saveServiceVoid(this.service);
            this.showMessage('Signiture applied')
        }
        // this.showSign = false;
        // this.orderService.updateOrderState(this.order);
    }





    sendEmailAdmin(userName: string, order: Order) {
        let parts = '';
        order.Orderproducts.forEach(item => {
            parts += `
            <b> ${item.Quantity}</b> X <b> ${item.ProductType} </b> ( ${item.ProductName} )<br>
           
            `
        });

        let consumables = '<h5>Consumables</h5>';
        order.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_CONSUMABLES.Name).forEach(item => {
            consumables += `
            <b> ${item.Name}</b> ..... <b> R${item.Price} </b><br>
           
            `
        });


        let labour = '<h5>Labour</h5> ';
        order.Items.filter(x => x.ItemType === ITEM_TYPES.SERVICE_LABOUR.Name).forEach(item => {
            labour += `
            <b> ${item.Name}</b> ..... <b> ${item.LimitValue} hours </b><br>
           
            `
        });



        const emailBody = `
        <div *ngIf="service" style="width: 100%;  background: #F2F2F2; padding: 3%;">
        <div style="text-align: center;  max-width: 35em;">
            <img src="https://gtrent.tybo.co.za/assets/images/common/logoblack2.png"
                style="width: 10em; border-radius: 1em;" alt=""> <br>
        </div>
        <div style="padding: 3%; border-radius: .5em; background: #fff; max-width: 35em; margin:4em 0;">
            Hi Admin <br><br>

            Below is the summary of the service report done for ${this.service.Customer.Name}.
    
            <br><br>
            Customer Name: <b>${this.service.Customer.Name || '----'}</b> <br>
            Contact person : <b>${this.service.Customer.Surname || '----'}</b> <br>
            Phone No: <b>${this.service.Customer.PhoneNumber || '----'}</b> <br>
            Email address : <b>${this.service.Customer.Email || '----'}</b> <br>
            Customer address: <b>${this.service.Customer.AddressLineHome || '----'}</b> <br>
            <hr>
    
            Model :
            <b>${this.service.Machine.Model || '----'}</b>
            <br>
    
            Serial :
            <b>${this.service.Machine.Serial || '----'}</b>
            <br>
    
            Hours :
            <b>${this.service.Machine.Hours || '----'}</b><br>
            <hr>
            Work done: <br>
            <b>
                ${this.service.Notes}
            </b>
            <hr>
    
    
            <h5 class="__heading">Parts used</h5>
    
          ${parts}
            <br>
            <hr>

    ${consumables}

    <br>
    <hr>
${labour}
<br>
<hr>
            <div>
                Customer signiture <br>
                <img src="${this.service.CustomerSigniture}" style="width:12em" alt="">
                <br><br>
                Customer Name: <br>
                <b>${this.service.CustomerSignitureName}</b>
            </div>
    
    
            <br>
            <hr>
            <div>
                Technicain signiture <br>
                <img src="${this.service.TechnicainSigniture}" style="width:12em" alt="">
                <br><br>
                Technicain Name: <br>
                <b>${this.service.TechnicainName}</b>
            </div>
    
            <br><br>
    
            Thank you. <br>
            Gtrent compressors
    
        </div>
    </div>
        `
        const email = order.Customer.Email || NOTIFY_EMAILS;
        const emailToSend: Email = {
            Email: NOTIFY_EMAILS,
            Subject: 'New Service Report completed',
            Message: `${emailBody}`,
            UserFullName: userName,
            // Link: `${environment.BASE_URL}`,
            // LinkLabel: 'Login to system'
        };
        this.emailService.sendGeneralTextEmail(emailToSend)
            .subscribe(response => {
                if (response > 0) {

                }
            });
    }

    sendEmailToCustomer(userName: string, order: Order) {
        let parts = '';
        order.Orderproducts.forEach(item => {
            parts += `
            <b> ${item.Quantity}</b> X <b> ${item.ProductType} </b><br>
            <!-- ${item.ProductName} -->
            `
        })



        const emailBody = `
        <div *ngIf="service" style="width: 100%;  background: #F2F2F2; padding: 3%;">
        <div style="text-align: center;  max-width: 35em;">
            <img src="https://gtrent.tybo.co.za/assets/images/common/logoblack2.png"
                style="width: 10em; border-radius: 1em;" alt=""> <br>
        </div>
        <div style="padding: 3%; border-radius: .5em; background: #fff; max-width: 35em; margin:4em 0;">
            Hi ${this.service.Customer.Name} <br><br>
    
            Thank you for working with us. We appreciate your business,
            and we’ll do our best to continue to give you the kind of service you deserve.
            Below is the summary of the service report.
    
            <br><br>
            Customer Name: <b>${this.service.Customer.Name || '----'}</b> <br>
            Contact person : <b>${this.service.Customer.Surname || '----'}</b> <br>
            Phone No: <b>${this.service.Customer.PhoneNumber || '----'}</b> <br>
            Email address : <b>${this.service.Customer.Email || '----'}</b> <br>
            Customer address: <b>${this.service.Customer.AddressLineHome || '----'}</b> <br>
            <hr>
    
            Model :
            <b>${this.service.Machine.Model || '----'}</b>
            <br>
    
            Serial :
            <b>${this.service.Machine.Serial || '----'}</b>
            <br>
    
            Hours :
            <b>${this.service.Machine.Hours || '----'}</b><br>
            <hr>
            Work done: <br>
            <b>
                ${this.service.Notes}
            </b>
            <hr>
    
   
            <br>
            <hr>
    
            <div>
                Customer signiture <br>
                <img src="${this.service.CustomerSigniture}" style="width:12em" alt="">
                <br><br>
                Customer Name: <br>
                <b>${this.service.CustomerSignitureName}</b>
            </div>
    
    
            <br>
            <hr>
    
            <div>
                Technicain signiture <br>
                <img src="${this.service.TechnicainSigniture}" style="width:12em" alt="">
                <br><br>
                Technicain Name: <br>
                <b>${this.service.TechnicainName}</b>
            </div>
    
            <br><br>
    
            Thank you. <br>
            Gtrent compressors
    
        </div>
    </div>
        `
        const emailToSend: Email = {
            Email: `${NOTIFY_EMAILS}, ${this.service.Customer.Email}`,
            Subject: 'New Service Report  | Customer copy',
            Message: `${emailBody}`,
            UserFullName: userName,
            // Link: `${environment.BASE_URL}`,
            // LinkLabel: 'Login to system'
        };
        this.emailService.sendGeneralTextEmail(emailToSend)
            .subscribe(response => {
                if (response > 0) {

                }
            });
    }

    resend() {
        this.sendEmailToCustomer(this.service.Customer.Name, this.service);
        this.sendEmailAdmin(this.service.Customer.Name, this.service);
        this.showMessage('Email sent to the customer and the admim')

    }

    showMessage(detail, summary = 'Success', severity = 'success') {
        this.messageService.add({ severity: severity, summary: summary, detail: detail });
    }
}
