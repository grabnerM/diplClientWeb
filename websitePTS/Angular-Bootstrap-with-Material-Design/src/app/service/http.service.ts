import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Routeposition } from '../class/routeposition';
import { Sender } from '../class/sender';
import { Senderroute } from '../class/senderroute';
import { Task } from '../class/task';

const baseUrl = 'http://localhost:8080/'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  public getLocations() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get(baseUrl + 'webAppController/getLocations', {headers})
  }

  public getRoute(id) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<Routeposition[]>(baseUrl + 'receiver/getRouteById/', {headers})
  }

  public getSenderForReceiver(id){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<Sender[]>(baseUrl+'receiver/getSenderForReceiver/', {headers})
  }

  public findOldRoutes(id){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<Senderroute[]>(baseUrl+'receiver/findOldRoutes/', {headers});
  }

  public createTask(task: Task){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post(baseUrl + 'receiver/createTask', task, {headers})
  }
}
