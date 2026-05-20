import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderConfig } from '../../interfaces/header.interface';
import { SharedDollarBoxComponent } from '../shared-dollar-box/shared-dollar-box.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [CommonModule, SharedDollarBoxComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

   @Input() headerConfig: HeaderConfig = {
    title: 'aqui va el titulo'
  }


  constructor() { }

  ngOnInit(): void {
  }

}
