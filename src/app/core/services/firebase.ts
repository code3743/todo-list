import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Firebase {
  readonly app: FirebaseApp =
    getApps().length === 0
      ? initializeApp(environment.firebaseConfig)
      : getApp();
}
