<<<<<<< HEAD
# 📦 InventarioAI — Sistema de Gestión de Inventario de Contenedores

Sistema web desarrollado para la gestión y seguimiento de inventario de contenedores. Permite registrar, consultar y administrar contenedores en tiempo real, con control de acceso por usuarios y generación de reportes.

---

## 👥 Equipo de Desarrollo
- JOSE ALBERTO RODRIGUEZ PANAMEÑO
- ERIN KAMILA GARCES REYES
- JENNIFER GRAIN RAMIREZ

---

## 🌐 Despliegue en Producción (VPS)

El sistema se encuentra totalmente operativo y desplegado en la siguiente infraestructura:

* **Frontend (Interfaz de Usuario):** `https://sgp.seminario1.eleueleo.com/`
* **Backend (API PHP):** `C:\xampp\htdocs\angular-backend`

### 🔑 Credenciales de Acceso para Pruebas (Fase 2)
Para la evaluación de las restricciones de enrutamiento y control de acceso, utilizar los siguientes usuarios preconfigurados:

| Rol | Usuario / Correo | Contraseña | Descripción |
|---|---|---|---|
| **Administrador Principal** | `jsoe@inventario.com` | `admin123` | Acceso total al panel de auditoría y reportes logísticos. |
| **Administrador Secundario 1** | `jgrainr@inventario.com` | `admin123` | Control operativo limitado de movimientos de patio. |
| **Administrador Secundario 2** | `kmilagare@inventario.com` | `admin123` | Control operativo limitado de movimientos de patio. |

---

## 🚀 Características Principales

- **Gestión de contenedores:** Crear, editar y eliminar registros de contenedores con sus respectivos atributos.
- **Inventario en tiempo real:** Visualización actualizada del estado y disponibilidad de los contenedores.
- **Reportes y estadísticas:** Generación de reportes para análisis y toma de decisiones.
- **Autenticación y usuarios (JWT):** Sistema de login con control de acceso por roles y protección de rutas mediante Guards.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
|---|---|
| [Angular](https://angular.dev) v21 | Framework frontend |
| [PHP](https://www.php.net/) | Lenguaje backend para servicios API |
| MySQL / phpMyAdmin | Base de datos relacional transaccional |
| TypeScript | Lenguaje principal del frontend |
| CSS | Estilos de la aplicación |
| GitHub Actions | CI/CD para despliegue automático |

---

## 📁 Estructura del Proyecto
=======
# InventarioAi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
>>>>>>> d041a0d029502f074eb7e199e42f0afe106b454b
