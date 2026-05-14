import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

import { CATEGORY_COLORS } from '../../../../core/constants/app.constants';
import { Category } from '../../../../core/models/category';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
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
    IonInput,
  ],
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null;

  readonly colors = CATEGORY_COLORS;

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    color: new FormControl(CATEGORY_COLORS[0], { nonNullable: true }),
  });

  constructor(private readonly modalCtrl: ModalController) {}

  ngOnInit(): void {
    if (this.category) {
      this.form.patchValue({ name: this.category.name, color: this.category.color });
    }
  }

  get title(): string {
    return this.category ? 'Edit Category' : 'New Category';
  }

  selectColor(color: string): void {
    this.form.patchValue({ color });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.modalCtrl.dismiss(this.form.getRawValue());
  }

  cancel(): void {
    this.modalCtrl.dismiss(null);
  }
}
