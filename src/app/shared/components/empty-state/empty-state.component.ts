import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline, pricetagsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
})
export class EmptyStateComponent {
  message = input<string>('No items yet');
  icon = input<string>('checkmark-done-outline');

  constructor() {
    addIcons({ checkmarkDoneOutline, pricetagsOutline });
  }
}
