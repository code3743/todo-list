import { inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { CategoriesDataSource } from './app/core/datasources/categories-datasource';
import { FirebaseCategoriesDataSource } from './app/core/datasources/firebase/firebase-categories-datasource';
import { FirebaseTasksDataSource } from './app/core/datasources/firebase/firebase-tasks-datasource';
import { LocalCategoriesDataSource } from './app/core/datasources/local/local-categories-datasource';
import { LocalTasksDataSource } from './app/core/datasources/local/local-tasks-datasource';
import { TasksDataSource } from './app/core/datasources/tasks-datasource';
import { RemoteConfig } from './app/core/services/remote-config';
import { environment } from './environments/environment';

const isFirebase = environment.datasource === 'firebase';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAppInitializer(() => inject(RemoteConfig).init()),
    {
      provide: TasksDataSource,
      useClass: isFirebase ? FirebaseTasksDataSource : LocalTasksDataSource,
    },
    {
      provide: CategoriesDataSource,
      useClass: isFirebase ? FirebaseCategoriesDataSource : LocalCategoriesDataSource,
    },
  ],
});
