# Student ID Keeper

## 📖 Descripción

**Student ID Keeper** es una plataforma web multiplataforma (PC, tabletas, smartphones) diseñada para modernizar y agilizar todo el ciclo de vida del carnet estudiantil en la Universidad Americana. Sustituye los procesos manuales basados en formularios y hojas de cálculo por un flujo digital centralizado que permite:

* Registro y autenticación segura de estudiantes y personal administrativo.
* Solicitud de carnet con captura de datos personales, foto y comprobante de pago.
* Programación de cita para fotografía y entrega.
* Seguimiento en tiempo real del estado de emisión y entrega.
* Gestión de roles (Estudiante, Administrador, Superadministrador) con control de acceso.
* Reportes filtrados por facultad, carrera, fecha y estado del carnet.

---

## ✨ Características principales

1. **Control de acceso basado en roles (RBAC)**
2. **Solicitud y seguimiento de carnets**
3. **Gestión de fotografía y requisitos**
4. **Notificaciones y trazabilidad**
5. **Interfaz responsive**

---

## 🛠️ Arquitectura y Tecnologías

### Backend

* **Lenguaje:** Java
* **Framework:** Spring Boot
* **Persistencia:** JPA (Hibernate)
* **Base de datos:** PostgreSQL
* **Gestión de dependencias:** Maven

### Frontend

* **Librería:** ReactJS
* **Estilos:** TailwindCSS
* **Routing:** React Router
* **HTTP Client:** Axios

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/student-id-keeper.git
```

### 2. Backend

```bash
cd student-id-keeper/backend
# Ajustar src/main/resources/application.properties con credenciales PostgreSQL
mvn clean install
mvn spring-boot:run
```

### 3. Frontend

```bash
cd ../frontend
npm install
npm start
```

> La API correrá en `http://localhost:8087` y el frontend en `http://localhost:3000`.

---

## 👩‍💻 Equipo de Desarrollo

* **Backend**

  * Silvio Alejandro Mora Mendoza
  * Karen Mariza Fonseca Vega

* **Frontend**

  * Silvio Alejandro Mora Mendoza
  * Karen Mariza Fonseca Vega
  * Andrés Miguel Martínez Somarriba

---

## 📂 Estructura del Proyecto

```
student-id-keeper/
├─ backend/               # API REST con Spring Boot
│  ├─ src/
│  ├─ pom.xml
│  └─ …
└─ frontend/              # SPA con React + TailwindCSS
   ├─ src/
   ├─ package.json
   └─ …
```

---

## 🌐 Uso

1. Registrar usuario o iniciar sesión con credenciales UAM.
2. **Estudiante**: solicitar carnet, subir foto y comprobante, revisar estado.
3. **Administrador**: aprobar/rechazar solicitudes, editar datos, generar reportes.
4. **Superadministrador**: gestionar facultades, carreras y usuarios.

---

## 📄 Licencia

Este proyecto está disponible bajo la [Licencia MIT](LICENSE).
