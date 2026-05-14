import { Injectable, signal } from '@angular/core';

import { TasksDataSource } from '../../../core/datasources/tasks-datasource';
import { Task } from '../../../core/models/task';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  private readonly _tasks = signal<Task[]>([]);

  readonly tasks = this._tasks.asReadonly();

  constructor(private readonly datasource: TasksDataSource) {
    this.init();
  }

  private  init(): void{
   this.datasource.getAll().then(
      (t) => this._tasks.set(t)
    )
  }

  async add(title: string, categoryId: string | null = null): Promise<void> {
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      categoryId,
      createdAt: Date.now(),
    };
    await this.datasource.add(task);
    this._tasks.update(list => [...list, task]);
  }

  async toggle(id: string): Promise<void> {
    const task = this._tasks().find(t => t.id === id);
    if (!task) return;
    const changes = { completed: !task.completed };
    await this.datasource.update(id, changes);
    this._tasks.update(list =>
      list.map(t => (t.id === id ? { ...t, ...changes } : t))
    );
  }

  async delete(id: string): Promise<void> {
    await this.datasource.delete(id);
    this._tasks.update(list => list.filter(t => t.id !== id));
  }

  async updateCategory(taskId: string, categoryId: string | null): Promise<void> {
    const changes = { categoryId };
    await this.datasource.update(taskId, changes);
    this._tasks.update(list =>
      list.map(t => (t.id === taskId ? { ...t, ...changes } : t))
    );
  }
}
