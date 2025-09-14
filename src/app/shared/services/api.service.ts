import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment/environment.dev';

import { LocalDbService } from './local-db.service';
import { ToastService } from '../reusable-components/toast/toast.service';
import { CapitalizeWordsPipe } from '../utils/pipes/capitalize-words.pipe';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl: string = environment.apiUrl
  authToken:any;
  isLoggedIn: any;
  userRole: any;
  roleSegment: any;
  toastData: any = {};
  status = new BehaviorSubject<string>('info');
  
  constructor( private http: HttpClient, private location: Location, private readonly router: Router, public readonly toast: ToastService, 
    private db: LocalDbService
  ) {}

  initData() {
    const currentUrl = this.location.path();
    const segments = currentUrl.split('/');
    this.roleSegment = segments[1] || ''
    const user_role = localStorage.getItem('userRole')
    this.userRole = user_role === 'super_admin' ? 'admin' : user_role;
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.authToken = localStorage.getItem('authToken');
    const alreadyVisited = localStorage.getItem('alreadyVisited') || localStorage.getItem('alreadyVisited') === 'true';

    if (this.authToken){
      if(this.isLoggedIn && this.roleSegment !== this.userRole){
       this.router.navigate([`${this.userRole}/dashboard`]);
      }
      if(!this.isLoggedIn){
        this.router.navigate(['auth/lock_screen'])
      }
    }else{        
      this.signOut();
    }

    if (!alreadyVisited || alreadyVisited === 'false') {
      localStorage.removeItem('alreadyVisited');
      this.router.navigate(['sign_in']);
      return
    }

  }  
  
  async makeRequest(verb: string, path: string, params: any, isFormData?: boolean, unique_url?:string) {
    const headers = isFormData ? undefined : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    });
    params = { ...params, user_type: this.userRole };
    let req: any;
    const baseUrl = ( unique_url ?? this.apiUrl ) + path
    if (verb === 'GET') {
      req = this.http.get(baseUrl, { params, headers });
    }else if(verb === 'POST') {
      req = this.http.post(baseUrl, params, { headers });
    }else {
      return
      // console.error('Invalid HTTP method:', verb);
    }
    return req.toPromise().then((data: any) => {
      try {
        let message = data.message
        if (data.reload) {
          window.location.reload() 
        };
        if (data.message) {
          message = data.message;
          this.toast.showToast(message.msg, message.status);
          this.status.next(message.status);
        }
        if (data.haltAction) {
          return data.signUserOut ? this.signOut() : {};
        }
        return data;
      } catch (error) {
        this.toast.showToast('An error occurred', 'error');
        return {};
      }
    })
  }

  async signIn(user: any) {
    let message: any;
    if (!user.username || !user.password) {
      const emptyParam = !user.username && !user.password ? 'Username and Password' : !user.username ? 'Username' : 'Password';
      message = { msg: `${emptyParam} cannot be empty.`, status: 'warning' };
      this.toast.showToast(message.msg, message.status);
      this.status.next(message.status);
      return;
    }
    this.makeRequest('POST', 'users/sign_in', { ...user }).then(async (data: any) => {
      if (data?.authToken) { 
        localStorage.setItem('authToken', data.authToken); 
        if (data?.user && data.userData) {
          this.addLocalStorage('userRole', data.user.user_role);
          this.addLocalStorage('currUser', data.user);
          this.addLocalStorage('currUserDetails', data.userData);
        };
        if (data?.user?.user_role) {
          localStorage.setItem('userRole', data.user.user_role);
          const path: string = data.user.user_role === 'super_admin' ? 'admin' : data.user.user_role;
          this.router.navigate([`${path}/dashboard`]);
          localStorage.setItem('isLoggedIn', String(true));
          localStorage.setItem('alreadyVisited', String(true))
        }
      } else {
        message = { msg: 'Invalid username or password.', status: 'error' };
        this.toast.showToast(message.msg, message.status);
        this.status.next(message.status);
      }
    }).catch((error: any) => {
      message = { msg: 'An error occurred. Please try again.', status: 'error' };
      this.toast.showToast(message.msg, message.status);
      this.status.next(message.status);
    });
  }

  async fakeSignIn(user: any) {
    let message: any;
    if (!user.username || !user.password) {
      const emptyParam = !user.username && !user.password ? 'Username and Password' : !user.username ? 'Username' : 'Password';
      message = { msg: `${emptyParam} cannot be empty.`, status: 'warning' };
      this.toast.showToast(message.msg, message.status);
      this.status.next(message.status);
      return;
    }
    const usr:any = this.db.users.find((usr:any) => usr.username === user.username && usr.password === user.password);
    if(!usr){
      message = { msg: 'Invalid username or password.', status: 'error' };
      this.toast.showToast(message.msg, message.status);
      this.status.next(message.status);
      return;
    }
    localStorage.setItem('authToken', '12345');
    localStorage.setItem('currUser', JSON.stringify(usr));
    const user_role:any = usr.user_role; 
    const path: string = user_role === 'super_admin' ? 'admin' : user_role;
    this.router.navigate([`${path}/dashboard`]);
    localStorage.setItem('userRole', user_role);
    localStorage.setItem('isLoggedIn', String(true));
    localStorage.setItem('alreadyVisited', String(true))
    this.toast.showToast(`Welcome ${usr.first_name}! 👋😄`, 'success');
  }

  signOut() {
    this.reset();
  }
  
  lockScreen(){
    if( this.isLoggedIn && this.authToken){
      this.addLocalStorage('isLoggedIn', String(false));
      this.router.navigate(['auth/lock_screen']);
      setTimeout(() => {
        let message:any = { status: 'warning', msg: 'Screen Locked. Unlock to continue.' }
        this.toast.showToast(message.msg, message.status)
        this.status.next(message.status)
      }, 100);
    }
  }

  private reset(){
    this.resetLocalStorage();
    this.addLocalStorage('isLoggedIn', String(false));
    this.addLocalStorage('alreadyVisited', String(true));
    this.router.navigate(['auth/sign_in']);
  }

  private resetLocalStorage(){
    const rememberUser = localStorage.getItem('rememberUser') === 'true'
    const keysToKeep = rememberUser ? [ 'rememberUser', 'currUser' ] : [ 'rememberUser' ];
    Object.keys(localStorage).forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  public addLocalStorage(key: string, value: any) {
    const valStr = JSON.stringify(value)
    localStorage.setItem(key, valStr);
  }

  public getLocalStorage(key: string) {
    let data: any = localStorage.getItem(key)|| "";
    data = data === 'true' ? data = true : data === 'false' ? data = false : data;
    return JSON.parse(localStorage.getItem(data) || '{}');
  }

  public safeJSONParse(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch {
      return {};
    }
  }

  async fetchData(objs?: string[]) {
    if (!Array.isArray(objs)) return {};
      // return this.makeRequest('POST', 'users/init_data', { objs })

    const result: Record<string, any> = {};
    const currUser: any = this.safeJSONParse('currUser');

    for (const key of objs) {
      if (!this.db.hasOwnProperty(key)) continue;

      let data = this.db[key];

      if (key === 'reports' && currUser?.user_role === 'donor') {
        data = data.filter((report: any) => report?.donor?.username === currUser.username);
      }

      result[key] = data;
    }

    return result;
  }

  public async getBlob(url: string): Promise<Blob> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      return await response.blob();
    } catch (error) {
      return new Blob([], { type: 'image/png' });
    }
  }

  public formatPersonData(data: any): any {
    const extractId = (obj: any) => obj?.id ?? obj;
    return {
      ...data,
      photo: data.photo && data.photo instanceof File ? data.photo : this.getBlob(data.photo) ?? null
    };
  }

  saveItem(db: string, obj: any) {
    this.db[db].push(obj);
  }

}
