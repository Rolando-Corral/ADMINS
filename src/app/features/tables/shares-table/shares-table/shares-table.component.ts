import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shares-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shares-table.component.html',
  styleUrls: ['./shares-table.component.scss']
})
export class SharesTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
