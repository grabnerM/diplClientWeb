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
/*
  Autor: Jakob Hocheneder
  Titel: HTTP Service
  Beschreibung: Service für die Requests an den Server
*/
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Request an den Service, welcher alle aktuellen Standorte der Aufträge des Auftraggebers zurück sendet.
   */
  public getLocations() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<LivePosition[]>(baseUrl + 'receiver/getAllPositions', {headers})
  }

  /**
   * Request an den Server, welcher alle Positionen einer Route liefert
   * @param id Id der Route
   */
  public getRoute(id) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<Routeposition[]>(baseUrl + 'receiver/getRouteById/'+id, {headers})
  }

  /**
   * Request an den Server, welcher die Route eines Auftrags liefert
   * @param id Id eines Auftrags
   */
  public getRouteByTask(id) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<Routeposition[]>(baseUrl + 'receiver/getRouteByTask/'+id, {headers})
  }

  /**
   * Request an den Server, der eine Historie an Routen des Auftraggebers liefert
   * @param id Id des Auftraggebers
   */
  public findOldRoutes(id){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<Senderroute[]>(baseUrl+'receiver/findOldRoutes/', {headers});
  }

  /**
   * Request an den Server zum Erstellen eines Auftrags
   * @param task 
   */
  public createTask(task: Task){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post(baseUrl + 'receiver/createTask', task, {headers})
  }

  /**
   * Request an OpenStreetMap zum Konvertieren einer Adresse in Latitude und Longitude
   * @param address Eingegebene Adresse
   */
  public getLatLngFromAddress(address: string){
    return this.http.get<AddressLatLng[]>("https://nominatim.openstreetmap.org/search?q="+address+"&format=json&countrycodes=at");
  }

  /**
   * Request an OpenStreetMap zum Konvertieren von Latitude und Longitude in eine Adresse
   * @param lat 
   * @param lng 
   */
  public getAddressFromLatLng(lat: number, lng: number){
    return this.http.get<Address>("https://nominatim.openstreetmap.org/reverse?lat="+lat+"&lon="+lng+"&format=json")
  }

  /**
   * Request an den Server, welcher alle offenen Aufträge des Auftraggebers liefert
   */
  public getOpenTasks(){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<Task[]>(baseUrl + 'receiver/getOpenTasksByReceiver', {headers})
  }
}
