import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pencilOutline, pricetagsOutline, trashOutline } from 'ionicons/icons';

import { Category } from '../core/models/category';
import { RemoteConfig } from '../core/services/remote-config';
import { CategoryFormComponent } from '../features/categories/components/category-form/category-form.component';
import { Categories } from '../features/categories/services/categories';
import { TaskFormComponent } from '../features/tasks/components/task-form/task-form.component';
import { TaskItemComponent } from '../features/tasks/components/task-item/task-item.component';
import { Tasks } from '../features/tasks/services/tasks';
import { EmptyStateComponent } from '../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonChip,
    IonList,
    IonFab,
    IonFabButton,
    IonModal,
    IonFooter,
    IonItem,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    TaskItemComponent,
    EmptyStateComponent,
  ],
})
export class HomePage {
  @ViewChild('categoriesModal') private readonly categoriesModal!: IonModal;

  readonly remoteConfig = inject(RemoteConfig);
  readonly tasks = inject(Tasks);
  readonly categories = inject(Categories);

  private readonly modalCtrl = inject(ModalController);

  readonly selectedCategoryId = signal<string | null>(null);

  readonly filteredTasks = computed(() => {
    const catId = this.selectedCategoryId();
    if (!catId) return this.tasks.tasks();
    return this.tasks.tasks().filter(t => t.categoryId === catId);
  });

  constructor() {
    addIcons({ add, pricetagsOutline, pencilOutline, trashOutline });
  }

  getCategory(categoryId: string | null): Category | undefined {
    if (!categoryId) return undefined;
    return this.categories.getById(categoryId);
  }

  async openAddTask(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskFormComponent,
      componentProps: {
        categories: this.categories.categories(),
        showCategorySelector: this.remoteConfig.enableCategories(),
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<{ title: string; categoryId: string | null }>();
    if (data) this.tasks.add(data.title, data.categoryId);
  }

  openCategoriesModal(): void {
    this.categoriesModal.present();
  }

  closeCategoriesModal(): void {
    this.categoriesModal.dismiss();
  }

  async openAddCategory(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryFormComponent });
    await modal.present();
    const { data } = await modal.onWillDismiss<{ name: string; color: string }>();
    if (data) this.categories.add(data.name, data.color);
  }

  async openEditCategory(category: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryFormComponent,
      componentProps: { category },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<{ name: string; color: string }>();
    if (data) this.categories.update(category.id, data);
  }

  deleteCategory(id: string): void {
    this.categories.delete(id);
    this.tasks
      .tasks()
      .filter(t => t.categoryId === id)
      .forEach(t => this.tasks.updateCategory(t.id, null));
    if (this.selectedCategoryId() === id) this.selectedCategoryId.set(null);
  }
}
