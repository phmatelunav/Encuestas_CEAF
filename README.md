# App Encuestas CEAF (Offline)

Esta es una aplicación móvil nativa diseñada y desarrollada exclusivamente para el **Centro de Estudios Avanzados en Fruticultura (CEAF)**. Su propósito principal es permitir la creación dinámica y toma de encuestas en terreno en modalidad **100% Offline**.

## Características Principales

* **Desarrollo Offline-First**: Todo el almacenamiento de plantillas, configuración y respuestas recolectadas opera internamente de manera local (`localStorage`), permitiendo utilizar la herramienta en zonas rurales sin cobertura de internet.
* **Componentes Dinámicos**: Permite al encuestador crear encuestas personalizadas asignando títulos, y preguntas de diferentes tipos (Texto Libre, Números, Opción Múltiple).
* **Gestión Drag & Drop**: Ordenamiento interactivo de las preguntas dentro de las plantillas utilizando herramientas arrastrables nativas (`IonReorder`).
* **Captura de Coordenadas GPS**: Extrae la posición (Latitud y Longitud) de manera invisible y silenciosa en el momento exacto en que se toma la respuesta de la encuesta.
* **Adjunto de Fotografías (Universal)**: Integración segura con cámara del dispositivo para añadir ilimitadas evidencias fotográficas a cualquier ficha llenada.
* **Procesamiento Óptico OCR (Inteligente)**: Para las plantillas denominadas "Programa de Riego", se activa un motor de Inteligencia Artificial on-device mediante **Google ML-Kit**, capaz de escanear hojas físicas mediante la cámara y llenar automáticamente todas las respuestas interpretando marcas en las casillas.
* **Exportación Consolidada**: Genera instantáneamente un archivo `.zip` comprimido conteniendo un Excel `.xlsx` estructurado por filas (encuestas) y columnas (campos/GPS), además de una carpeta anexada con todas las `.jpg` tomadas.
* **Tutorial Inicial**: Flujo amigable on-boarding que utiliza `@capacitor/preferences` para recordar a los nuevos usuarios cómo manejar los tres pilares del aplicativo la primera vez que se abre en el dispositivo.

## Tecnologías Utilizadas

* **Frontend Framework**: [React.js](https://reactjs.org/) + [Ionic Framework](https://ionicframework.com/docs/react) (Web Components optimizados para UI Mobile).
* **Compilador Nativos**: [Capacitor](https://capacitorjs.com/) (Convierte el flujo Web en un paquete `.AAB` / `.APK` nativo para Android).
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
