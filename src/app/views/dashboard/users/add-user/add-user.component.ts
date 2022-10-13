import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { EmailService, UserService } from 'src/services';
import { REPORT_MANAGER } from 'src/shared/constants';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @Input() user: User;
  @Input() heading: string;
  @Output() doneEvent: EventEmitter<User> = new EventEmitter<User>();
  REPORT_MANAGER = REPORT_MANAGER;
  constructor(private userService: UserService, private emailService: EmailService) {

  }

  ngOnInit() {
  }
  save() {
    if (this.user && this.user.UserId && this.user.UserId.length > 5) {
      this.userService.updateUserSync(this.user).subscribe(data => {
        console.log(data);
        if (data && data.UserId) {
          this.doneEvent.emit(data);
        }
      })
    } else {
      this.userService.add(this.user).subscribe(data => {
        console.log(data);
        if (data && data.UserId) {
          const msg = `
          <hr>
          Please use these details to login. <br> 
          Email : ${data.Email}  <br> 
          Password : ${data.Password}
          `;
          this.sendEmailLogToShop(msg, data.Name, data.Email);
          this.doneEvent.emit(data);
        }
      })
    }
  }

  sendEmailLogToShop(data, userName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'Welcome to Gtrent Service System',
      Message: `${data}`,
      UserFullName: userName,
      Link: `${environment.BASE_URL}`,
      LinkLabel: 'Login to system'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }
}
