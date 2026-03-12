# Configuración de Permisos en Android

Para que la aplicación funcione correctamente y pueda guardar/compartir archivos Excel en Android, asegúrate de seguir los siguientes pasos una vez que agregues la plataforma Android con `npx cap add android`.

## 1. Modificar `AndroidManifest.xml`
El archivo se encuentra en `android/app/src/main/AndroidManifest.xml`.
Debes asegurarte de tener los siguientes permisos declarados dentro de la etiqueta `<manifest>` (antes de `<application>`):

```xml
    <!-- Permisos para leer y escribir en el almacenamiento (importante para versiones < Android 10) -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

    <!-- Opcional si la app compartirá archivos localmente con otras apps usando FileProvider -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Permisos para Geolocation (GPS) -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-feature android:name="android.hardware.location.gps" />

    <!-- Permisos para Cámara (Módulo OCR) -->
    <uses-permission android:name="android.permission.CAMERA" />
```

## 2. Notas para Android 10+ (API 29+)
Al usar `Directory.Cache` o `Directory.Documents` mediante Capacitor Filesystem, las versiones modernas de Android ya incluyenScoped Storage. Capacitor gestiona la escritura en los directorios internos de la aplicación sin requerir que pidas estos permisos en tiempo de ejecución (runtime) si solo guardas ahí para compartir.
Sin embargo, para compatibilidad con dispositivos más antiguos, es bueno dejarlos en el `AndroidManifest.xml`.

## 3. Configurar Android FileProvider (Para `@capacitor/share`)
El plugin de compartir usa el FileProvider de Android. Asegúrate de que en `android/app/src/main/res/xml/file_paths.xml` existan las rutas de caché. (Capacitor usualmente configura esto automáticamente).

Si todo esto está en su lugar, la app podrá generar el archivo Excel y abrir WhatsApp o Gmail sin problemas.
