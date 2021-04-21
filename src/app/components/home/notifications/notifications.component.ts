import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  constructor(private uts: UtilitiesService) {}

  ngOnInit(): void {}

  refreshPage = () => this.uts.refreshPage('');
}
