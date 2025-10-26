import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-logo',
  imports: [RouterLink, ButtonModule],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {}
