#JOSE ALBERTO RODRIGUEZ PANAMEÑO
#ERIN KAMILA GARCES REYES
#JENNIFER GRAIN RAMIREZ

# 📦 InventarioAI — Sistema de Gestión de Inventario de Contenedores

Sistema web desarrollado con **Angular** para la gestión y seguimiento de inventario de contenedores. Permite registrar, consultar y administrar contenedores en tiempo real, con control de acceso por usuarios y generación de reportes.

---

## 🚀 Características principales

- **Gestión de contenedores:** Crear, editar y eliminar registros de contenedores con sus respectivos atributos.
- **Inventario en tiempo real:** Visualización actualizada del estado y disponibilidad de los contenedores.
- **Reportes y estadísticas:** Generación de reportes para análisis y toma de decisiones.
- **Autenticación y usuarios:** Sistema de login con control de acceso por roles.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| [Angular](https://angular.dev) v21 | Framework frontend |
| TypeScript | Lenguaje principal |
| CSS | Estilos de la aplicación |
| GitHub Actions | CI/CD para despliegue automático |

---

## 📁 Estructura del proyecto

```
Inventario-ai/
├── src/
│   ├── app/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Vistas principales
│   │   ├── services/       # Servicios y lógica de negocio
│   │   └── models/         # Interfaces y modelos
│   ├── assets/             # Recursos estáticos
│   └── styles.css          # Estilos globales
├── public/                 # Archivos públicos
├── .github/workflows/      # Pipeline CI/CD
├── angular.json            # Configuración Angular
└── package.json            # Dependencias
```

---

## ⚙️ Instalación y uso local

### Prerrequisitos

- Node.js v20 o superior
- npm v9 o superior
- Angular CLI v21

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Ironman2201-max/Inventario-ai.git
cd Inventario-ai

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
ng serve
```

Abre el navegador en `http://localhost:4200`

---

## 🏗️ Build para producción

```bash
ng build --configuration=production
```

Los archivos compilados se generan en `dist/Inventario-ai/browser/`.

---

## 🚢 Despliegue

El proyecto utiliza **GitHub Actions** para el despliegue automático en el VPS cada vez que se hace push a la rama `main`.

### Secrets requeridos en GitHub

| Secret | Descripción |
|---|---|
| `SERVER_IP` | Dirección IP del servidor |
| `SERVER_USER` | Usuario SSH del servidor |
| `SSH_PRIVATE_KEY` | Llave privada SSH |

---

## 👥 Equipo de desarrollo

Proyecto desarrollado como parte del **Seminario 1**.

---

## 📄 Licencia

Este proyecto es de uso académico.
