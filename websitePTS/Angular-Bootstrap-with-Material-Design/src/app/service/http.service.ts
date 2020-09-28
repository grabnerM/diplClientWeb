import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

    return this.http.get(baseUrl + 'webAppController', {headers}).subscribe()
  }
}
