import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { effect, Inject, Injectable, makeStateKey, OnDestroy, PLATFORM_ID, signal, TransferState } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, finalize, map, Observable, ObservableInput, of, Subject, take, takeUntil, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
const USER_KEY = makeStateKey<any>('user');
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {


  sendMessage(data: { message: String; email: any; }) {
    return of(true)
  }

  private destroy$ = new Subject<void>();
  currentUserSnl = signal<User | null>(null);
  private userSubject = new BehaviorSubject<any>(null);
  authState$ = new BehaviorSubject<boolean | null>(null);
  private isLoading = false;
  constructor(private http: HttpClient, private transferState: TransferState, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    /* if (isPlatformBrowser(this.platformId))
      this.loadUser(); */



    // 🔥 Effect: keep localStorage in sync
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const user = this.currentUserSnl();

      /*    if (user) {
           localStorage.setItem('user', JSON.stringify(user));
         } else {
           localStorage.removeItem('user');
         } */
    });


  }



  get currentUser(): any | null {
    return this.userSubject.value;
  }


  login(password: string, mobile: string) {
    return this.http.post("/api/user/login", { password, phoneNumber: mobile });
  }



  logUserData() {
    return this.http.get("/api/user/getloggeduser", { withCredentials: true });
  }

  /* let headers = new HttpHeaders().set('header1', headerValue1); // create header object
headers = headers.append('header2', headerValue2); // add a new header, creating a new object
headers = headers.append('header3', headerValue3); // add another header

let params = new HttpParams().set('param1', value1); // create params object
params = params.append('param2', value2); // add a new param, creating a new object
params = params.append('param3', value3); // add another param

return this._http.get<any[]>('someUrl', { headers: headers, params: params })
 */
  sendOtp(phoneNumber: string, email: string) {
    return this.http.post("/api/user/register/sendotp?phoneNumber=" + phoneNumber, { email });
  }

  resendOtp(phoneNumber: string, userData: any) {
    return this.http.post("/api/user/resentotp?phoneNumber=" + phoneNumber, { userData });
  }

  register(phoneNumber: string, verificationCode: string, userData: any) {
    return this.http.post("/api/user/verify/register?phoneNumber=" + phoneNumber + "&verificationCode=" + verificationCode, userData);
  }


  authStatus$() {
    return this.authState$.asObservable();
  }

  userStatus$() {
    return this.userSubject.asObservable();
  }


  reloadData() {
    this.logUserData().pipe(
      takeUntil(this.destroy$), take(1),
      map((user: any) => user.userData),
      tap((user: any) => {
        this.setuserSubjectSub(user);
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(() => {
        this.setuserSubjectSub(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    );
  }


  /* loadUser() {
    if (isPlatformBrowser(this.platformId)) {

      const cached = this.transferState.get(USER_KEY, null);
      console.log('Browser cached:', cached);
      if (!!cached) {
        this.setuserSubjectSub(cached)
        this.transferState.remove(USER_KEY);
        return of(cached);
      }

    }
    return this.logUserData().pipe(
      map((user: any) => user.userData),
      take(1),
      tap((data) => {
        console.log('inside loguserdata', data)
        this.setuserSubjectSub(data)
        if (isPlatformServer(this.platformId)) {
          console.log('SSR: setting TransferState', data);
          this.transferState.set(USER_KEY, data);
        }
      }),

    );

  } */

  loadUser() {
    if (!isPlatformBrowser(this.platformId))
      return of(false);
    else {
      let cached: any = localStorage.getItem("user");
      /*   console.log('Browser cached:', cached); */
      if (!!cached) {
        cached = JSON.parse(cached);
        this.setuserSubjectSub(cached)
        return of(cached);
      }
      else {
        return this.logUserData().pipe(
          map((user: any) => user.userData),
          take(1),
          tap((data) => {
            console.log('inside loguserdata', data)
            this.setuserSubjectSub(data);
            localStorage.setItem('isLoggedIn', JSON.stringify(true));
            localStorage.setItem('user', JSON.stringify(data));

          }),
        );
      }


    }
  }

  get user() {
    return this.userSubject.value;
  }

  get userSubjectSub() {
    return this.userSubject;
  }

  setuserSubjectSub(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (!!user) {
        this.userRoles.push(user.role)
        this.userSubject.next(user);
        this.currentUserSnl.set(user);
        this.authState$.next(true);

      }
      else {
        this.userRoles = [];
        this.userSubject.next(null);
        this.currentUserSnl.set(null);
        this.authState$.next(false);

      }
    }


  }

  logout() {
    return this.http.get("/api/user/logout");
  }



  clearSession() {
    this.setuserSubjectSub(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(["/"]);
  }
  getoLoaction(): any {
    return this.http.get("https://ipinfo.io/json");
  }



  saveAddress(payload: any): Observable<any> {
    return this.http.post(`/user/addUpdateAddress`, payload);
  }


  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`/user/address/${addressId}`);
  }

  loading() {
    return this.isLoading;
  }
  /* ['USER', 'ADMIN'] */
  private userRoles: string[] = [];

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {

    return roles.some(r => this.userRoles.includes(r));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every(r => this.userRoles.includes(r));
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
  }


}
