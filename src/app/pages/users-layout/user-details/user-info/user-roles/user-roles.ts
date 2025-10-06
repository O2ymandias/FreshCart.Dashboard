import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../../../../shared/models/users-model';

@Component({
  selector: 'app-user-roles',
  imports: [ButtonModule, TagModule, DialogModule],
  templateUrl: './user-roles.html',
  styleUrl: './user-roles.scss',
})
export class UserRoles {
  user = input.required<User>();
}
