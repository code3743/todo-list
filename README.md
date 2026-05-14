# Todo List — Ionic + Angular + Firebase

Aplicación móvil de lista de tareas construida con Ionic, Angular y Cordova. Permite gestionar tareas y categorías con almacenamiento local o Firebase Firestore, e incluye un feature flag con Firebase Remote Config.

## Stack

- **Ionic** 8 + **Angular** 20 (standalone components)
- **Cordova** — compilación nativa Android e iOS
- **Firebase** 12 (Firestore + Remote Config)
- **Angular Signals** — gestión de estado reactivo

---

## Funcionalidades

- Agregar, completar y eliminar tareas
- Crear, editar y eliminar categorías con color
- Asignar una categoría a cada tarea
- Filtrar tareas por categoría
- **Feature flag** vía Firebase Remote Config: activa/desactiva la sección de categorías en tiempo real sin redesplegar la app
- Datasource intercambiable: `local` (localStorage) o `firebase` (Firestore) con un solo cambio en `environment.ts`

---

## Requisitos previos

- Node.js ≥ 18
- npm ≥ 9
- Ionic CLI: `npm install -g @ionic/cli`
- Cordova CLI: `npm install -g cordova`
- **Android:** Android Studio con un AVD configurado
- **iOS:** Xcode 15+ (solo macOS)

---

## Instalación

```bash
git clone https://github.com/code3743/todo-list.git
cd todo-list
npm install
```

---

## Ejecutar en web

```bash
ionic serve
```

Abre `http://localhost:8100` en el navegador.

---

## Compilar y ejecutar en iOS

```bash
ionic build
cordova run ios --emulator
```

O para abrir en Xcode y seleccionar el simulador manualmente:

```bash
ionic build
cordova prepare ios
open platforms/ios/*.xcworkspace
```

---

## Compilar y ejecutar en Android

```bash
ionic build
cordova run android --emulator
```

O para abrir en Android Studio:

```bash
ionic build
cordova prepare android
# Abre la carpeta platforms/android en Android Studio
```

---

## Configuración de Firebase

Las credenciales de Firebase están en `src/environments/environment.ts` y `environment.prod.ts`. Para usar tu propio proyecto:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Registra una app Web
3. Copia el `firebaseConfig` en ambos archivos de environment
4. En Firestore, crea las colecciones `tasks` y `categories`
5. En Remote Config, crea el parámetro `enable_categories` (tipo Boolean)

### Cambiar datasource

En `src/environments/environment.ts`:

```ts
datasource: 'local'    // usa localStorage (default en desarrollo)
datasource: 'firebase' // usa Firestore
```

`environment.prod.ts` usa `firebase` por defecto.

### Feature flag — demostración

1. Ve a Firebase Console → **Remote Config**
2. Cambia `enable_categories` a `true` y publica
3. Recarga la app — aparece el botón de categorías y los filtros
4. Cambia a `false` y publica — la funcionalidad desaparece sin recompilar

---

## Arquitectura

```
src/app/
├── core/
│   ├── constants/       # Todas las claves y constantes centralizadas
│   ├── datasources/     # Abstracción del origen de datos
│   │   ├── tasks-datasource.ts        # Contrato abstracto
│   │   ├── categories-datasource.ts
│   │   ├── local/       # Implementación localStorage
│   │   └── firebase/    # Implementación Firestore
│   ├── models/          # Interfaces Task y Category
│   └── services/        # Firebase, RemoteConfig, Storage
├── features/
│   ├── tasks/           # Componentes, servicio y pipes de tareas
│   └── categories/      # Componentes, servicio y pipes de categorías
└── shared/              # Componentes y pipes reutilizables
```

El datasource activo se inyecta en `main.ts` según `environment.datasource`, sin que los servicios de negocio (`Tasks`, `Categories`) conozcan el origen de los datos.

---

## Respuestas técnicas

### ¿Cuáles fueron los principales desafíos?

**Datasource intercambiable con Firebase y localStorage:** el reto principal fue diseñar una abstracción que soportara las operaciones síncronas del localStorage y las asíncronas de Firestore con la misma interfaz. Se resolvió con clases abstractas como tokens de inyección de Angular y métodos `Promise`-based en ambas implementaciones.

**Sincronía entre signals y operaciones async:** Angular Signals son síncronos, pero las operaciones de Firebase no. Se adoptó el patrón de *optimistic update*: la señal se actualiza inmediatamente en memoria y la operación de persistencia ocurre en paralelo, logrando una UI sin latencia percibida.

**Firebase Remote Config en WebView Android:** Remote Config funcionaba en iOS y en web pero no en el emulador Android de Cordova. La causa fue que Cordova usa el scheme `http` por defecto en Android, lo que provoca que algunas peticiones de Firebase sean rechazadas. Se resolvió cambiando el scheme a `https` en `config.xml`.

---

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

**`ChangeDetectionStrategy.OnPush` en todos los componentes** — Angular solo recalcula la vista cuando cambia una referencia de input, reduciendo los ciclos de detección de cambios en listas largas.

**Angular Signals** — reemplazan `BehaviorSubject` y `async pipe`. Las señales actualizan solo el nodo del DOM que depende de ese valor, sin recorrer el árbol de componentes.

**`computed()` para el filtrado de tareas** — la lista filtrada se recalcula solo cuando cambia `tasks` o `selectedCategoryId`, no en cada render. Equivale a memoización automática.

**`PreloadAllModules`** — precarga los módulos lazy en segundo plano tras el arranque inicial, eliminando el delay de navegación entre rutas.

**Optimistic updates** — la UI responde de forma inmediata sin esperar la confirmación de Firebase, haciendo la app sentir nativa.

---

### ¿Cómo aseguraste la calidad y mantenibilidad del código?

**Patrón datasource con clases abstractas** — los servicios de negocio (`Tasks`, `Categories`) dependen de contratos, no de implementaciones concretas. Agregar un nuevo backend (ej. SQLite) no requiere tocar la lógica de negocio.

**Constantes centralizadas** — todas las claves de Firestore, localStorage y Remote Config viven en `app.constants.ts`. Un cambio de nombre se hace en un solo lugar.

**Componentes de responsabilidad única** — `TaskItemComponent` solo renderiza, `Tasks` service solo gestiona estado, `LocalTasksDataSource` solo persiste. Cada pieza es testeable de forma aislada.

**TypeScript estricto** — sin `any` explícito, tipado de modelos con interfaces, `as const` para objetos de configuración. El compilador detecta errores de contrato antes de tiempo de ejecución.

**Estructura por features** — `tasks/` y `categories/` son módulos autocontenidos con sus componentes, servicios y pipes. Escalar o eliminar una feature no afecta el resto de la app.
