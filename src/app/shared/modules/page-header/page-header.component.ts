import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.sass']
})
export class PageHeaderComponent implements OnInit {

  @Input() heading: string;
  @Input() icon: string;
  @Input() help: string;

  constructor() { }

  ngOnInit() {
  }

}
