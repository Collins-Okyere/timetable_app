import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment/environment.dev';
import { LocalDbService } from './local-db.service';
import { ToastService } from '../reusable-components/toast/toast.service';
import { NonDbService } from './nondb.service';

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
  
  constructor( 
    private http: HttpClient, 
    private location: Location, 
    private readonly router: Router, public readonly toast: ToastService, private db: LocalDbService, private nonDB: NonDbService) {
      this.initData();
    }

  async initData() {
    this.makeRequest('GET', 'users', { action_type: 'init_data' }).then(async (data: any) => {
      this.nonDB.currUser = data.user
      const currentUrl = this.location.path();
      const segments = currentUrl.split('/');
      this.roleSegment = segments[1] || ''
      this.userRole = this.nonDB.currUser?.user_role
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (this.nonDB.currUser){
        if(this.isLoggedIn && this.roleSegment !== this.userRole){
        this.router.navigate([`${this.userRole}/dashboard`]);
        }
        if(!this.isLoggedIn){
          this.router.navigate(['auth/lock_screen'])
        }
      }else{        
        this.signOut();
      }
    })
  }  
  
  async makeRequest(verb: string, path: string, params: any, isFormData?: boolean, unique_url?:string) {
    this.authToken = localStorage.getItem('authToken');
    const headers = isFormData ? undefined : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    });
    params = { ...params };
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
      // try {
        let messages = data?.flash_messages
        if (data.reload) {
          window.location.reload() 
        };
        if (messages?.length > 0) {
          // messages = data.flash_messages;
          for (const message of messages) {
            this.toast.showToast(message.msg, message.type);
            this.status.next(message.type);
          }
        }
        if (data.haltAction) {
          return data.signUserOut ? this.signOut() : {};
        }
        return data;
      // } catch (error) {
      //   this.toast.showToast('An error occurred', 'error');
      //   return {};
      // }
    })
  }

  async signIn(user: any) {
    let message: any;
    if (!user.username || !user.password) {
      const emptyParam = !user.username && !user.password ? 'Username and Password' : !user.username ? 'Username' : 'Password';
      message = { msg: `${emptyParam} cannot be empty.`, status: 'warning' };
      this.toast.showToast(message.msg, message.type);
      this.status.next(message.type);
      return;
    }
    this.makeRequest('POST', 'users', { ...user, action_type: 'sign_in' }).then(async (data: any) => {
      if (data?.auth_token) { 
        localStorage.setItem('authToken', data.auth_token); 
        if (data?.user) {
          this.nonDB.currUser = data.user
          const path: string = this.nonDB.currUser.user_role;
          this.router.navigate([`${path}/dashboard`]);
          localStorage.setItem('isLoggedIn', String(true));
        }
      } else {
        message = { msg: 'Invalid username or password.', status: 'error' };
        this.toast.showToast(message.msg, message.type);
        this.status.next(message.type);
      }
    })
    // .catch((error: any) => {
    //   message = { msg: 'An error occurred. Please try again.', status: 'error' };
    //   this.toast.showToast(message.msg, message.type);
    //   this.status.next(message.type);
    // });
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
        this.toast.showToast(message.msg, message.type)
        this.status.next(message.type)
      }, 100);
    }
  }

  private reset(){
    this.resetLocalStorage();
    this.addLocalStorage('isLoggedIn', String(false));
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

      if (key === 'reports' && currUser?.userRole === 'donor') {
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

  public blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }


}
