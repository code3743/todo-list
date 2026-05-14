import { Injectable } from '@angular/core';

import { STORAGE_KEYS } from '../../constants/app.constants';
import { Task } from '../../models/task';
import { Storage } from '../../services/storage';
import { TasksDataSource } from '../tasks-datasource';

const KEY = STORAGE_KEYS.TASKS;

@Injectable()
export class LocalTasksDataSource implements TasksDataSource {
  constructor(private readonly storage: Storage) {}

  async getAll(): Promise<Task[]> {
    return this.storage.get<Task[]>(KEY) ?? [];
  }

  async add(task: Task): Promise<void> {
    const all = await this.getAll();
    this.storage.set(KEY, [...all, task]);
  }

  async update(id: string, changes: Partial<Task>): Promise<void> {
    const all = await this.getAll();
    this.storage.set(KEY, all.map(t => (t.id === id ? { ...t, ...changes } : t)));
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    this.storage.set(KEY, all.filter(t => t.id !== id));
  }
}
