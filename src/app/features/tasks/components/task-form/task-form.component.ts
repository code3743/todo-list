import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

import { Category } from '../../../../core/models/category';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class TaskFormComponent {
  @Input() categories: Category[] = [];
  @Input() showCategorySelector = false;

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    categoryId: new FormControl<string | null>(null),
  });

  constructor(private readonly modalCtrl: ModalController) {}

  submit(): void {
    if (this.form.invalid) return;
    const { title, categoryId } = this.form.getRawValue();
    this.modalCtrl.dismiss({ title: title.trim(), categoryId });
  }

  cancel(): void {
    this.modalCtrl.dismiss(null);
  }
}
