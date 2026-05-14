import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskList'
})
export class TaskListPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
