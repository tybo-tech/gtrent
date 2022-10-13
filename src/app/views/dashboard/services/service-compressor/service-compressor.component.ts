import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Order, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { Machine } from 'src/models/machine.model';
import { OrderService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { MachineService } from 'src/services/machine.service';

@Component({
    selector: 'app-service-compressor',
    templateUrl: 'service-compressor.component.html',
    styleUrls: ['service-compressor.component.scss']
})
export class ServiceCompressorComponent {
    @Input() user: User;
    @Input() customer: Customer;
    viewing: boolean;
    editing: boolean;

    showFilter = true;
    primaryAction = 'Create a new compressor';
    machine: Machine;
    heading: string;
    showSuccess: boolean;
    service: Order;
    adding: boolean;
    constructor(
        private router: Router,
        private orderService: OrderService,
        private customerService: CustomerService,
        private machineService: MachineService,

    ) {

    }

    ngOnInit() {
        this.orderService.OrderObservable.subscribe(data => {
            this.service = data;
            if (data) {
                if (this.service.Machine) {
                    this.editing = false;
                    this.viewing = true;
                    this.machine = this.service.Machine;
                }
            }
        })
        if (this.customer && (!this.customer.Machines || !this.customer.Machines.length))
            this.customer.Machines = [];

    }
    selectItemMachine(item, saveService = true) {
        this.machine = item;
        if (this.machine && this.service) {
            this.service.Machine = this.machine;
            this.service.MachineId = this.machine.MachineId;
            this.service.Model = `${this.machine.Model}`;
            this.service.Serial = `${this.machine.Serial}`;
            this.service.Hours = `${this.machine.Hours}`;
            this.viewing = true;
            this.editing = false;
            this.heading = 'Selected compressor';
            if (saveService)
                this.orderService.update(this.service).subscribe(data => {
                    this.orderService.updateOrderState(data);
                })
        }
    }



    onItemSelectedEvent(item: Machine) {
        this.machine = item;
    }


    addMachine() {
        this.machine = {
            MachineId: "",
            CompanyId: this.customer.CustomerId,
            MachineType: "",
            Name: "",
            Make: "",
            Model: "",
            Size: "",
            Serial: "",
            Hours: "",
            Motor: "",
            Moreinfo1: "",
            Moreinfo2: "",
            Moreinfo3: "",
            Moreinfo4: "",
            MachineStatus: "Active",
            CreateUserId: "",
            ModifyUserId: "",
            StatusId: 1,
        };
        this.heading = `Adding new compressor`;
        this.adding = true;
        // this.customerService.updateCustomerState(this.customer);
        // this.router.navigate([`admin/dashboard/add-machine/add/${this.customer.CustomerId}`]);
    }


    save() {

        if (this.machine.MachineId && this.machine.MachineId.length > 5) {
            this.machineService.updateMachineSync(this.machine).subscribe(data => {
                if (data && data.MachineId) {
                    this.editing = false;
                    this.viewing = true
                }
            })
        }
        else {

            this.machineService.add(this.machine).subscribe(data => {
                if (data && data.MachineId) {
                    this.editing = false;
                    this.viewing = true
                }
            });
        }
    }

    onDoneEvent(m: Machine, s = 'Your compressor details have been saved.') {
        if (!m) {
            this.machine = m;
            this.adding = false;
            return
        }
        this.adding = false;
        this.customer.Machines.push(m);
        this.selectItemMachine(m);
        this.heading = s;
        this.showSuccess = true;
        this.machine = null;



    }
}
