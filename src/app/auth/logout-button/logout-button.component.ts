import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent {
  constructor(public auth: AuthService, public dataService: DataService) {}
}
