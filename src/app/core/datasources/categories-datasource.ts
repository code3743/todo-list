import { Category } from '../models/category';

export abstract class CategoriesDataSource {
  abstract getAll(): Promise<Category[]>;
  abstract add(category: Category): Promise<void>;
  abstract update(id: string, changes: Partial<Category>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
