import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();

  @Input() title: string = '';
  @Input() showMenu: boolean = false;
  @Input() backButton: string | null = null; // Added backButton property

  constructor() {}

  ngOnInit() {}

  onMenuButtonClick() {
    this.menuToggle.emit();
  }
}