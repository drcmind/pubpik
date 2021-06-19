import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  title: string;

  constructor(private uts: UtilitiesService) {
    this.title = this.uts.title;
  }

  ngOnInit(): void {}
}
