import { Task } from '../models/task';

export abstract class TasksDataSource {
  abstract getAll(): Promise<Task[]>;
  abstract add(task: Task): Promise<void>;
  abstract update(id: string, changes: Partial<Task>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
