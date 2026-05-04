import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paid-accounts-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paid-accounts-table.component.html',
  styleUrls: ['./paid-accounts-table.component.scss']
})
export class PaidAccountsTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
