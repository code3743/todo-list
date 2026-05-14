import { Injectable } from '@angular/core';

import { STORAGE_KEYS } from '../../constants/app.constants';
import { Category } from '../../models/category';
import { Storage } from '../../services/storage';
import { CategoriesDataSource } from '../categories-datasource';

const KEY = STORAGE_KEYS.CATEGORIES;

@Injectable()
export class LocalCategoriesDataSource implements CategoriesDataSource {
  constructor(private readonly storage: Storage) {}

  async getAll(): Promise<Category[]> {
    return this.storage.get<Category[]>(KEY) ?? [];
  }

  async add(category: Category): Promise<void> {
    const all = await this.getAll();
    this.storage.set(KEY, [...all, category]);
  }

  async update(id: string, changes: Partial<Category>): Promise<void> {
    const all = await this.getAll();
    this.storage.set(KEY, all.map(c => (c.id === id ? { ...c, ...changes } : c)));
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    this.storage.set(KEY, all.filter(c => c.id !== id));
  }
}
