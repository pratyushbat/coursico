import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { map, Subject, take, takeUntil } from 'rxjs';


import { AuthService } from 'src/app/services/auth.service';


const validatePassword = (password: any) => {
  const regexForPassword = /[A-Za-z\d]{5,}/;
  const isValid = regexForPassword.test(password);
  return isValid;
};



const validateEmail = (email: any) => {
  const regexForEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const isValid = regexForEmail.test(email);
  return isValid;
};

const validateName = (value: any) => {
  const nameRegex = /^[^\s]+$/;
  const isValid = nameRegex.test(value);
  return isValid;
};

const validatePhoneNumber = (phoneNumber: any) => {
  const phoneRegex = /^\d{10}$/;
  const isValid = phoneRegex.test(phoneNumber);
  return isValid;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


  countryCode = "91";
  phoneNumber = "";
  isPasswordHidden = false;
  loading = false;
  password = "";
  private destroy$ = new Subject<void>();

  constructor(private _authService: AuthService, private router: Router,) {

  }
  ngOnInit(): void {

  }



  setCounterCode(arg: any) {
    console.log('arg', arg)
  }

  submitLogin() {

    const isPasswordValid = validatePassword(this.password);
    const isValidPhoneNumber = validatePhoneNumber(this.phoneNumber);

    if (!isPasswordValid) {
      console.error('Password At Least 5 Character Avoid Speacial Symbol..!!');
    } else if (!isValidPhoneNumber) {

    console.error('Invalid Phone Number');
    } else {
      this._authService.login(this.password, this.countryCode + "" + this.phoneNumber)
        .pipe(takeUntil(this.destroy$), take(1))
        .subscribe(data => {
          this._authService.logUserData()
            .pipe(map((user: any) => user.userData),
              takeUntil(this.destroy$), take(1))
            .subscribe((data: any) => {
              this._authService.setuserSubjectSub(data);
              localStorage.setItem('isLoggedIn', JSON.stringify(true));
              localStorage.setItem('user', JSON.stringify(data));
              // this.close();
              this.router.navigate(["/home"]);
            },
              error => {
                this._authService.setuserSubjectSub(null);

                // this.close();
              });
        },
          error => {
            console.log(error);
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
          });
    }
  }

  ngOnDestroy() {
    this.destroy$?.next();
    this.destroy$?.complete();

  }

}
