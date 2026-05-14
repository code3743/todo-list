import { Injectable, signal } from '@angular/core';
import {
  RemoteConfig as FirebaseRemoteConfig,
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  onConfigUpdate,
} from 'firebase/remote-config';

import { REMOTE_CONFIG_KEYS } from '../constants/app.constants';
import { environment } from '../../../environments/environment';
import { Firebase } from './firebase';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfig {
  private readonly rc: FirebaseRemoteConfig;
  private readonly _enableCategories = signal<boolean>(false);

  readonly enableCategories = this._enableCategories.asReadonly();

  constructor(private readonly firebase: Firebase) {
    this.rc = getRemoteConfig(this.firebase.app);
    this.rc.defaultConfig = { [REMOTE_CONFIG_KEYS.ENABLE_CATEGORIES]: false };
    this.rc.settings.minimumFetchIntervalMillis = environment.production
      ? 3_600_000
      : 0;
  }

  async init(): Promise<void> {
    try {
      await fetchAndActivate(this.rc);
    } catch (error) {
      console.error('[RemoteConfig] fetchAndActivate failed:', error);
    }
    this.applyValues();
    this.listenForUpdates();
  }

  private applyValues(): void {
    this._enableCategories.set(
      getValue(this.rc, REMOTE_CONFIG_KEYS.ENABLE_CATEGORIES).asBoolean()
    );
  }

  private listenForUpdates(): void {
    onConfigUpdate(this.rc, {
      next: async () => {
        try {
          await fetchAndActivate(this.rc);
        } catch (error) {
          console.error('[RemoteConfig] real-time update failed:', error);
        }
        this.applyValues();
      },
      error: (error) => console.error('[RemoteConfig] stream error:', error),
      complete: () => {},
    });
  }
}
