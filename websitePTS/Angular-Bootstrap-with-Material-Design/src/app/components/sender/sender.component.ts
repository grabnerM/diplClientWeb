import { Component, Input, OnInit } from '@angular/core';
import { Sender } from '../../class/sender';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.scss']
})
export class SenderComponent implements OnInit {

  @Input()
  private sender: Sender

  private visibility: boolean

  constructor(
    public http: HttpService
  ) { }

  ngOnInit(): void {
  }

}
