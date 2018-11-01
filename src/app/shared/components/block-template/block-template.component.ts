import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-block-template',
  templateUrl: './block-template.component.html',
  styleUrls: ['./block-template.component.sass']
})
export class BlockTemplateComponent implements OnInit {

  message = '';

  constructor() { }

  ngOnInit() {
  }

}
