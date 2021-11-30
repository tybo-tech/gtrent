import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MachineParts } from 'src/models/machineparts.model';


@Injectable({
  providedIn: 'root'
})
export class MachinePartsService {


  private MachinePartssListBehaviorSubject: BehaviorSubject<MachineParts[]>;
  public MachinePartssListObservable: Observable<MachineParts[]>;

  private userBehaviorSubject: BehaviorSubject<MachineParts>;
  public userObservable: Observable<MachineParts>;
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.MachinePartssListBehaviorSubject = new BehaviorSubject<MachineParts[]>(JSON.parse(localStorage.getItem('MachinePartssList')) || []);
    this.userBehaviorSubject = new BehaviorSubject<MachineParts>(JSON.parse(localStorage.getItem('currentMachineParts')));
    this.MachinePartssListObservable = this.MachinePartssListBehaviorSubject.asObservable();
    this.userObservable = this.userBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentMachinePartsValue(): MachineParts {
    return this.userBehaviorSubject.value;
  }

  updateMachinePartssListState(grades: MachineParts[]) {
    this.MachinePartssListBehaviorSubject.next(grades);
    localStorage.setItem('MachinePartssList', JSON.stringify(grades));
  }
  updateMachinePartsState(MachineParts: MachineParts) {
    this.userBehaviorSubject.next(MachineParts);
    localStorage.setItem('currentMachineParts', JSON.stringify(MachineParts));
  }

  getMachinePartss(companyId: string, userType: string) {
    this.http.get<MachineParts[]>(`${this.url}/api/MachineParts?CompanyId=${companyId}&UserType=${userType}`).subscribe(data => {
      if (data) {
        this.updateMachinePartssListState(data);
      }
    });
  }
  getMachinePartssStync(companyId: string, userType: string) {
    return this.http.get<MachineParts[]>(`${this.url}/api/machineparts/get-MachinePartss.php?CompanyId=${companyId}&UserType=${userType}`)
  }

  getMachineParts(MachinePartsId: string) {
    this.http.get<MachineParts>(`${this.url}/api/MachineParts?MachinePartsId=${MachinePartsId}`).subscribe(data => {
      if (data) {
        this.updateMachinePartsState(data);
      }
    });
  }

  getMachinePartsSync(MachinePartsId: string) {
    return this.http.get<MachineParts>(`${this.url}/api/machineparts/get-machineparts.php?MachinePartsId=${MachinePartsId}`);
  }

  getMachinePartsByEmailandCompanyIdSync(email: string, companyId: string) {
    return this.http.get<MachineParts>(`${this.url}/api/MachineParts?Email=${email}&CompanyId=${companyId}`);
  }
  updateMachineParts(MachineParts: MachineParts) {
    this.http.post<MachineParts>(`${this.url}/api/MachineParts`, MachineParts).subscribe(data => {
      if (data) {
        this.updateMachinePartsState(data);
      }
    });
  }
  updateMachinePartsSync(MachineParts: MachineParts): Observable<MachineParts> {
    return this.http.post<MachineParts>(`${this.url}/api/machineparts/update-machineparts.php`, MachineParts);
  }

  add(MachineParts: MachineParts) {
    return this.http.post<MachineParts>(`${this.url}/api/machineparts/add-machinepart.php`, MachineParts);
  }


}
