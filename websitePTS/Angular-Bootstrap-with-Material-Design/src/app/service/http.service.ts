import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Sender } from '../class/sender';
import { Senderroute } from '../class/senderroute';
=======
<<<<<<< Updated upstream
=======
import { Routeposition } from '../class/routeposition';
import { Sender } from '../class/sender';
import { Senderroute } from '../class/senderroute';
>>>>>>> Stashed changes
>>>>>>> b652ca6... History of Routes now has only 2 Markers and a make map big Funktion

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

    return this.http.get<Routeposition[]>(baseUrl + 'receiver/getRouteById/' + id, {headers})
  }

  public getSenderForReceiver(id){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<Sender[]>(baseUrl+'receiver/getSenderForReceiver/'+id, {headers})
  }

  public findOldRoutes(id){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<Senderroute[]>(baseUrl+'receiver/findOldRoutes/'+id, {headers});
  }
}
