import {
  Component,
  effect,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { IBrandResult } from '../../../../../shared/brands-model';
@Component({
  selector: 'app-edit-brands',
  imports: [DialogModule, ButtonModule],
  templateUrl: './edit-brands.html',
  styleUrl: './edit-brands.scss',
})
export class EditBrands implements OnInit {
  constructor() {
    effect(() => {
      this.showDialog.set(this.visible());
    });
  }

  brand = input.required<IBrandResult>();
  visible = input.required<boolean>();
  visibleChange = output<boolean>();

  showDialog = signal(false);

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
