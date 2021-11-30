import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Machine } from 'src/models/machine.model';
import { MachineParts } from 'src/models/machineparts.model';


@Injectable({
  providedIn: 'root'
})
export class MachineService {


  private MachinesListBehaviorSubject: BehaviorSubject<Machine[]>;
  public MachinesListObservable: Observable<Machine[]>;

  private userBehaviorSubject: BehaviorSubject<Machine>;
  public userObservable: Observable<Machine>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.MachinesListBehaviorSubject = new BehaviorSubject<Machine[]>(JSON.parse(localStorage.getItem('MachinesList')) || []);
    this.userBehaviorSubject = new BehaviorSubject<Machine>(JSON.parse(localStorage.getItem('currentMachine')));
    this.MachinesListObservable = this.MachinesListBehaviorSubject.asObservable();
    this.userObservable = this.userBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentMachineValue(): Machine {
    return this.userBehaviorSubject.value;
  }

  updateMachinesListState(grades: Machine[]) {
    this.MachinesListBehaviorSubject.next(grades);
    localStorage.setItem('MachinesList', JSON.stringify(grades));
  }
  updateMachineState(Machine: Machine) {
    this.userBehaviorSubject.next(Machine);
    localStorage.setItem('currentMachine', JSON.stringify(Machine));
  }

  getMachines(companyId: string, userType: string) {
    this.http.get<Machine[]>(`${this.url}/api/machine?CompanyId=${companyId}&UserType=${userType}`).subscribe(data => {
      if (data) {
        this.updateMachinesListState(data);
      }
    });
  }
  getMachinesStync(companyId: string, userType: string) {
    return this.http.get<Machine[]>(`${this.url}/api/machine/get-machines.php?CompanyId=${companyId}&UserType=${userType}`)
  }

  getMachine(machineId: string) {
    this.http.get<Machine>(`${this.url}/api/machine?MachineId=${machineId}`).subscribe(data => {
      if (data) {
        this.updateMachineState(data);
      }
    });
  }

  getMachineSync(machineId: string) {
    return this.http.get<Machine>(`${this.url}/api/machine/get-machine.php?MachineId=${machineId}`);
  }

  getMachineByEmailandCompanyIdSync(email: string, companyId: string) {
    return this.http.get<Machine>(`${this.url}/api/machine?Email=${email}&CompanyId=${companyId}`);
  }
  updateMachine(Machine: Machine) {
    this.http.post<Machine>(`${this.url}/api/machine`, Machine).subscribe(data => {
      if (data) {
        this.updateMachineState(data);
      }
    });
  }
  updateMachineSync(machine: Machine): Observable<Machine> {
    return this.http.post<Machine>(`${this.url}/api/machine/update-machine.php`, machine);
  }

  add(machine: Machine) {
    return this.http.post<Machine>(`${this.url}/api/machine/add-machine.php`, machine);
  }
  addMachinepartsRange(machineparts: MachineParts[]) {
    return this.http.post<MachineParts[]>(`${this.url}/api/machineparts/add-machineparts-range.php`, machineparts);
  }

}
