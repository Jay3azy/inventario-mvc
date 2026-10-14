# Inventario MVC

Aplicación web para gestionar un inventario de productos, desarrollada con **AdonisJS** aplicando el patrón **Modelo-Vista-Controlador (MVC)**. Incluye operaciones CRUD completas y un sistema de autenticación que protege la sección de gestión.

> Proyecto de la materia **Ingeniería Web**: CRUD y Login con MVC.

##  Demo en línea

**Aplicación desplegada:** (https://inventario-mvc.onrender.com)

> Desplegada en Render (plan gratuito) con PostgreSQL en Neon. Si el servicio estuvo inactivo, la primera carga puede tardar hasta un minuto.

##  Videos

- Funcionamiento de la aplicación: [Ver en YouTube](https://youtu.be/TAJ-WkePg9c)
- Despliegue y explicación del código: [Ver en YouTube](https://youtu.be/UeuQq_GrP_M)

##  Funcionalidades

- **Autenticación**: registro, inicio y cierre de sesión con correo y contraseña.
- **Rutas protegidas**: la sección de productos no es accesible sin iniciar sesión, aunque se escriba la URL directamente.
- **CRUD de productos**: crear, listar, editar y eliminar productos (nombre, descripción, precio y stock).
- **Validación en el servidor** con mensajes en español mostrados debajo de cada campo.
- **Contraseñas cifradas** con el algoritmo **scrypt**.
- Mensajes de confirmación, modo claro/oscuro y diseño responsive.

##  Tecnologías

| Tecnología | Uso |
|---|---|
| [AdonisJS](https://adonisjs.com/) | Framework MVC para Node.js |
| TypeScript | Lenguaje principal |
| Lucid ORM | Modelos y acceso a la base de datos |
| Edge | Motor de plantillas para las vistas |
| VineJS | Validación de formularios |
| SQLite | Base de datos en desarrollo |
| PostgreSQL ([Neon](https://neon.com/)) | Base de datos en producción |
| [Render](https://render.com/) | Hosting de la aplicación |
| Vite | Empaquetado de estilos y scripts |

##  Arquitectura MVC

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| **Modelo** | `app/models/` | Representa las tablas `users` y `products` e interactúa con la base de datos mediante Lucid ORM. |
| **Vista** | `resources/views/` | Plantillas Edge que el servidor renderiza en HTML. |
| **Controlador** | `app/controllers/` | Recibe las peticiones, valida los datos, usa los modelos y decide qué vista mostrar. |

Flujo de una petición:

```
Navegador → Ruta (start/routes.ts) → Middleware (auth) → Controlador → Modelo → Base de datos
                                                              ↓
Navegador ←──────────────── HTML ←──────────────── Vista (Edge)
```

### Estructura principal

```
inventario-mvc/
├── app/
│   ├── controllers/
│   │   ├── products_controller.ts    # CRUD de productos
│   │   ├── session_controller.ts     # Login y logout
│   │   └── new_account_controller.ts # Registro
│   ├── models/
│   │   ├── product.ts
│   │   └── user.ts
│   └── validators/
│       ├── product.ts                # Reglas y mensajes en español
│       └── user.ts
├── config/
│   └── database.ts                   # Conexiones SQLite y PostgreSQL
├── database/
│   └── migrations/                   # Definición de las tablas
├── resources/
│   └── views/
│       ├── pages/
│       │   ├── auth/                 # login.edge, signup.edge
│       │   └── products/             # index, create, edit
│       ├── partials/                 # product_form.edge, flash_alerts.edge
│       └── components/layouts/       # Layouts de la app
└── start/
    ├── env.ts                        # Validación de variables de entorno
    └── routes.ts                     # Rutas públicas y protegidas
```

##  Base de datos

- Los datos **no están escritos en el código**: los productos y usuarios se consultan y guardan en la base de datos mediante los modelos.
- Las tablas se definen con **migraciones** y se crean con `node ace migration:run`, tanto en SQLite como en PostgreSQL.
- La aplicación elige la base de datos con la variable `DB_CONNECTION`:
  - `sqlite` (por defecto): archivo local en `tmp/db.sqlite3`, para desarrollo.
  - `pg`: PostgreSQL usando la cadena de conexión `DATABASE_URL`, para producción.
- Las credenciales se leen de **variables de entorno** y nunca se suben al repositorio.

## Seguridad

### Rutas protegidas

Las rutas del CRUD están dentro de un grupo con el middleware `auth`. Si un usuario sin sesión intenta entrar, es redirigido al login:

```ts
router
  .group(() => {
    router.on('/dashboard').render('pages/dashboard').as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])
    router.resource('products', controllers.Products).except(['show'])
  })
  .use(middleware.auth())
```

### Cifrado de contraseñas

Las contraseñas no se guardan en texto plano. AdonisJS las cifra automáticamente con **scrypt** antes de guardarlas. En la base de datos se almacena un hash como este:

```
$scrypt$n=16384,r=8,p=1$eidpLU0FSgpOmN/7zLSQWA$6jycXjs0afuQ...
```

**¿Por qué scrypt y no MD5?** MD5 ya no se considera seguro para contraseñas: es muy rápido de calcular y no usa *salt* por defecto, lo que permite romperlo con fuerza bruta o tablas precalculadas. Scrypt es un algoritmo diseñado específicamente para contraseñas: incluye *salt* aleatorio y es costoso en tiempo y memoria a propósito, lo que hace mucho más difícil descifrarlo.

Además, todos los formularios están protegidos contra ataques **CSRF**.

## 🗺️ Rutas

| Método | Ruta | Acción | Protegida |
|---|---|---|---|
| GET | `/login` | Formulario de inicio de sesión | No (solo invitados) |
| POST | `/login` | Iniciar sesión | No (solo invitados) |
| GET | `/signup` | Formulario de registro | No (solo invitados) |
| POST | `/signup` | Crear cuenta | No (solo invitados) |
| POST | `/logout` | Cerrar sesión | 
| GET | `/products` | Listar productos | 
| GET | `/products/create` | Formulario de creación | 
| POST | `/products` | Guardar producto | 
| GET | `/products/:id/edit` | Formulario de edición | 
| PUT | `/products/:id` | Actualizar producto | 
| DELETE | `/products/:id` | Eliminar producto | 

##  Instalación local

### Requisitos

- [Node.js](https://nodejs.org/) 24 o superior
- npm
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jay3azy/inventario-mvc.git
cd inventario-mvc

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno
cp .env.example .env          # Linux / macOS
copy .env.example .env        # Windows (CMD/PowerShell)

# 4. Generar la clave de la aplicación
node ace generate:key

# 5. Crear las tablas en la base de datos
node ace migration:run

# 6. Iniciar el servidor de desarrollo
npm run dev
```

Abrir en el navegador: **http://localhost:3333**

Por defecto se usa SQLite. Para trabajar con PostgreSQL, en el `.env` define `DB_CONNECTION=pg` y la `DATABASE_URL` correspondiente.

### Uso

1. Ir a **Crear cuenta** y registrar un usuario.
2. Iniciar sesión con el correo y la contraseña.
3. Gestionar los productos desde la sección **Productos**.

##  Despliegue

La aplicación está desplegada con esta arquitectura:

```
Navegador ──HTTPS──▶ Render (AdonisJS) ──SSL──▶ Neon (PostgreSQL)
```

Se separó la base de datos porque el disco del plan gratuito de Render no es persistente: un archivo SQLite se perdería en cada reinicio o nuevo despliegue.

### Base de datos en Neon

1. Crear un proyecto en [Neon](https://neon.com/) (región US East).
2. Copiar la **connection string** del proyecto.
3. Las tablas se crean automáticamente con las migraciones al iniciar la aplicación en Render.

### Web Service en Render

Servicio conectado al repositorio de GitHub, rama `main`, con despliegue automático en cada push.

| Configuración | Valor |
|---|---|
| Runtime | Node |
| Build Command | `npm ci --include=dev && npm run build && cd build && npm ci --omit=dev` |
| Start Command | `cd build && node ace migration:run --force && node bin/server.js` |

- El **build** instala las dependencias, compila TypeScript a JavaScript en la carpeta `build/` e instala ahí solo las dependencias de producción.
- El **start** aplica las migraciones pendientes (`--force` es obligatorio en producción) y arranca el servidor.

### Variables de entorno en producción

| Variable | Valor |
|---|---|
| `NODE_VERSION` | `24` |
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `TZ` | `UTC` |
| `LOG_LEVEL` | `info` |
| `APP_KEY` | Clave aleatoria exclusiva de producción |
| `APP_URL` | URL pública del servicio en Render |
| `SESSION_DRIVER` | `cookie` |
| `DB_CONNECTION` | `pg` |
| `DATABASE_URL` | Connection string de Neon |

`PORT` no se define: Render la asigna automáticamente. Los valores de `APP_KEY` y `DATABASE_URL` son secretos y solo se configuran en el panel de Render.

##  Autor

**José Esteban Ortiz Trujillo**
Ingeniería de Software, Universidad de las Américas (UDLA)
