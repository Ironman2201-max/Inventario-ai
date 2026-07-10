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

* **Frontend (Interfaz de Usuario):** `http://200.58.107.100`
* **Backend (API PHP):** `http://200.58.107.100/api/`

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