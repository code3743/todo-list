import { Injectable, signal } from '@angular/core';

import { CategoriesDataSource } from '../../../core/datasources/categories-datasource';
import { Category } from '../../../core/models/category';

@Injectable({
  providedIn: 'root',
})
export class Categories {
  private readonly _categories = signal<Category[]>([]);

  readonly categories = this._categories.asReadonly();

  constructor(private readonly datasource: CategoriesDataSource) {
    this.init();
  }

  private  init(): void{
   this.datasource.getAll().then(
      (c) => this._categories.set(c)
    )
  }

  async add(name: string, color: string): Promise<void> {
    const category: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
    };
    await this.datasource.add(category);
    this._categories.update(list => [...list, category]);
  }

  async update(id: string, changes: Partial<Pick<Category, 'name' | 'color'>>): Promise<void> {
    await this.datasource.update(id, changes);
    this._categories.update(list =>
      list.map(c => (c.id === id ? { ...c, ...changes } : c))
    );
  }

  async delete(id: string): Promise<void> {
    await this.datasource.delete(id);
    this._categories.update(list => list.filter(c => c.id !== id));
  }

  getById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }
}
