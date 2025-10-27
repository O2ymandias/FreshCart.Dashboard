import { Component, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { ChangePassword } from './change-password/change-password';

@Component({
  selector: 'app-update-profile',
  imports: [DialogModule, ButtonModule, TabsModule, ChangePassword],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.scss',
})
export class UpdateProfile {
  visible = signal(false);

  onPasswordChange() {
    this.visible.set(false);
  }
}
