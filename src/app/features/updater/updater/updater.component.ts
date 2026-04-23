import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updater',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './updater.component.html',
  styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
