import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../class/address';
import { AddressLatLng } from '../class/addresslatlng';
import { LivePosition } from '../class/livePosition';
import { Routeposition } from '../class/routeposition';
import { Sender } from '../class/sender';
import { Senderroute } from '../class/senderroute';
import { Task } from '../class/task';

const baseUrl = 'https://v2202010130694129625.goodsrv.de/'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  public getLocations() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<LivePosition[]>(baseUrl + 'receiver/getAllPositions', {headers})
  }

  public getRoute(id) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<Routeposition[]>(baseUrl + 'receiver/getRouteById/'+id, {headers})
  }

  public getRouteByTask(id) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<Routeposition[]>(baseUrl + 'receiver/getRouteByTask/'+id, {headers})
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

  public getLatLngFromAddress(address: string){
    return this.http.get<AddressLatLng[]>("https://nominatim.openstreetmap.org/search?q="+address+"&format=json&countrycodes=at");
  }

  public getAddressFromLatLng(lat: number, lng: number){
    return this.http.get<Address>("https://nominatim.openstreetmap.org/reverse?lat="+lat+"&lon="+lng+"&format=json")
  }

  public getOpenTasks(){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<Task[]>(baseUrl + 'receiver/getOpenTasksByReceiver', {headers})
  }
}
