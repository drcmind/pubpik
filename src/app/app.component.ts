import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private uts: UtilitiesService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
