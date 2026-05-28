# Victory Nexus

Prueba técnica — abrir enlace fuera de Gmail (Android)

Web: https://victory-nexus.vercel.app/ · Repo: https://github.com/AntonioQuijanoGit/victory-nexus

## Resumen

En la solución utilizo la **Web Share API** (`navigator.share()`): al pulsar el botón se abre el menú de compartir, eliges Chrome y la URL se abre fuera de Gmail. Como respaldo, hay un botón para copiar el enlace.

Más tarde añadí una lógica en cascada porque me pareció una opción más completa: en Android, si el navegador parece un in-app browser (Instagram/Facebook, etc.) se intenta primero `intent://`; si no, se usa Share; y si Share no está disponible o falla, se puede copiar el enlace.

## Contexto

Lo primero que probé fue `intent://` hacia Chrome y alguna variante más como `googlechrome://`. En Gmail no conseguía sacar la página del cliente: solo un parpadeo, como si la página se estuviera actualizando, y seguía dentro.

Al revisarlo vi que Gmail abre los enlaces en **Chrome Custom Tabs**: Chrome por debajo, pero integrado en la app de correo, no en la app Chrome independiente. Por eso acabé usando la **Web Share API**: el usuario elige Chrome en el menú del sistema y la URL se abre fuera de Gmail, que era el objetivo.

Para comparar, probé el mismo enfoque abriendo la web desde Instagram y ahí el `intent://` sí me funcionaba (se notaba más el salto). Por eso concluí que el bloqueo/limitación venía del contexto de Gmail, no del enlace en sí.

En la práctica, estando dentro de Custom Tabs no siempre puedes forzar desde JavaScript que se abra la app de Chrome. Por eso en vez de seguir con el intent, preferí una solución que sí que me estaba sacando la URL de Gmail.

Mi criterio ha sido que la URL se abriese fuera de la UI de Gmail (Chrome a pantalla completa / navegador externo).

## Comprobaciones

- `intent://` (con `package=com.android.chrome`, sin package y con flags como `NEW_TASK`): en mi móvil solo vi un parpadeo y seguía dentro de Gmail.
- `window.open(...)`: no saca la página del cliente.
- `googlechrome://`: no me dio el comportamiento esperado desde Gmail.
- Menú de Gmail (“Abrir en Chrome”): funciona, pero no es controlable desde la web (solo referencia).

## Reproducción

Correo con el enlace → Gmail (Android) → botón → Chrome en compartir.

## Notas

- Si `navigator.share` no está disponible (por ejemplo en PC), el botón principal se desactiva. Esta prueba tiene sentido sobre todo en Android.
- Si Share falla o el usuario no quiere usarlo, puede copiar el enlace y abrirlo en el navegador que quiera.
- Alternativa manual en Gmail: menú ⋮ → “Abrir en Chrome”.

## Archivos

`index.html`, `app.js`, `styles.css`
