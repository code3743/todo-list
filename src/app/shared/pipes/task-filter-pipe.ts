import { Pipe, PipeTransform } from '@angular/core';

import { Task } from '../../core/models/task';

@Pipe({
  name: 'taskFilter',
  pure: true,
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], categoryId: string | null): Task[] {
    if (!categoryId) return tasks;
    return tasks.filter(t => t.categoryId === categoryId);
  }
}
