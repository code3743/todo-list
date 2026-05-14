import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  IonCheckbox,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

import { Category } from '../../../../core/models/category';
import { Task } from '../../../../core/models/task';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonItemSliding,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonItemOptions,
    IonItemOption,
    IonIcon,
  ],
})
export class TaskItemComponent {
  task = input.required<Task>();
  category = input<Category | undefined>(undefined);

  toggled = output<string>();
  deleted = output<string>();

  constructor() {
    addIcons({ trashOutline });
  }
}
