import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
<<<<<<< Updated upstream
=======
import { Routeposition } from '../class/routeposition';
import { Sender } from '../class/sender';
import { Senderroute } from '../class/senderroute';
>>>>>>> Stashed changes

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
}
