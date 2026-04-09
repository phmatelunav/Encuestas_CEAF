# App Encuestas CEAF (Versión 13 - Final)

Esta es una aplicación móvil nativa diseñada y desarrollada exclusivamente para el **Centro de Estudios Avanzados en Fruticultura (CEAF)**. Su propósito principal es permitir la creación dinámica, gestión de usuarios y toma de encuestas en terreno en modalidad **100% Offline**.

## Características Principales

* **Desarrollo Offline-First**: Todo el almacenamiento de plantillas, usuarios y respuestas recolectadas opera internamente de manera local (`localStorage`), permitiendo utilizar la herramienta en zonas rurales sin cobertura de internet.
* **Precarga de Datos (CSV Integrado)**: La App incluye de fábrica toda la base de datos de usuarios (`DB_Usuarios.csv`) y el cuestionario técnico base CEAF (`Cuestionario.csv`), permitiendo operar desde el primer segundo sin configuraciones manuales.
* **Gestión de Usuarios / Entrevistados**: Nueva pestaña dedicada para Administrar (Crear, Editar, Eliminar) el directorio sociodemográfico de las personas a encuestar, manteniendo un orden alfabético para una búsqueda ágil.
* **Toma de Datos con Auto-Carga**: Al seleccionar un usuario que ya ha sido encuestado anteriormente, la App detecta el registro y **autocompleta** automáticamente todas las respuestas y fotografías previas, permitiendo corregir o actualizar la información sobre la marcha sin duplicar datos.
* **Componentes Dinámicos & Drag-Drop**: Permite crear encuestas personalizadas y ordenar preguntas arrastrándolas mediante interfaz nativa (`IonReorder`).
* **Captura de Coordenadas GPS**: Extrae la posición (Latitud y Longitud) de manera invisible y silenciosa al guardar cada ficha.
* **Adjunto & Visualización de Fotos**: Integración con cámara para añadir fotografías. Incluye un sistema de **previsualización en miniatura** dentro del formulario con opción de eliminar imágenes individuales (X).
* **Procesamiento OCR Inteligente**: Motor de IA on-device mediante **Google ML-Kit**, capaz de escanear hojas físicas de "Programa de Riego" y rellenar respuestas interpretando marcas en casillas.
* **Exportación Avanzada & Renombrado Inteligente**: Genera un archivo `.zip` que contiene:
    - **Excel (.xlsx)**: Con columnas sociodemográficas completas (Nombre, RUT, Comuna, Sector, etc.) vinculadas a cada respuesta técnica.
    - **Fotos (.jpg)**: Organizadas con un sistema de nombres inteligente: `nombre_persona_fecha_indice.jpg`, facilitando el procesamiento administrativo posterior.
* **Botón de Cierre Nativo**: Acceso rápido para salir de la aplicación en todas las pestañas.

## Tecnologías Utilizadas

* **Frontend Framework**: [React.js](https://reactjs.org/) + [Ionic Framework](https://ionicframework.com/docs/react).
* **Compilador Nativos**: [Capacitor](https://capacitorjs.com/) (Para paquetes `.APK` / `.AAB` Android).
* **Exportador Archivos**: [SheetJS](https://sheetjs.com/) (`xlsx`) y [JSZip](https://stuk.github.io/jszip/).
* **ML-Kit Plugin**: `@pantrist/capacitor-plugin-ml-kit-text-recognition`.
* **Lenguaje Base**: TypeScript / React TSX.

## Instalación y Modificación

Para abrir y compilar en un entorno de desarrollo local:

1. Clonar el Repositorio
```bash
git clone https://github.com/phmatelunav/Encuestas_CEAF.git
```

2. Instalar Node Modules
```bash
npm install
```

3. Correr Servidor Desarrollo (Web)
```bash
npm run dev
```

4. Compilar e Integrar (Android)
```bash
npm run build
npx cap sync android
npx cap open android
```
> Requiere Android Studio previamente configurado en el ordenador.

---

**Herramienta desarrollada por Patricio Mateluna V. Centro de Estudios Avanzados en Fruticultura. 2026**
