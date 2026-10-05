#  Inventario MVC

Aplicación web para gestionar un inventario de productos, desarrollada con **AdonisJS** aplicando el patrón **Modelo-Vista-Controlador (MVC)**. Incluye operaciones CRUD completas y un sistema de autenticación que protege la sección de gestión.

> Proyecto de la materia **Ingeniería Web**: CRUD y Login con MVC.

##  Demostración

Video de funcionamiento: [Ver en YouTube/Loom](ENLACE_AQUI)

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
| SQLite | Base de datos |
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
    └── routes.ts                     # Rutas públicas y protegidas
```

##  Seguridad

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

##  Rutas

| Método | Ruta | Acción | Protegida |
|---|---|---|---|
| GET | `/login` | Formulario de inicio de sesión | No (solo invitados) |
| POST | `/login` | Iniciar sesión | No (solo invitados) |
| GET | `/signup` | Formulario de registro | No (solo invitados) |
| POST | `/signup` | Crear cuenta | No (solo invitados) |
| POST | `/logout` | Cerrar sesión | ✅ |
| GET | `/products` | Listar productos | ✅ |
| GET | `/products/create` | Formulario de creación | ✅ |
| POST | `/products` | Guardar producto | ✅ |
| GET | `/products/:id/edit` | Formulario de edición | ✅ |
| PUT | `/products/:id` | Actualizar producto | ✅ |
| DELETE | `/products/:id` | Eliminar producto | ✅ |

##  Instalación y ejecución

### Requisitos

- [Node.js](https://nodejs.org/) 24 o superior (probado con v24.18)
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

### Uso

1. Ir a **Crear cuenta** y registrar un usuario.
2. Iniciar sesión con el correo y la contraseña.
3. Gestionar los productos desde la sección **Productos**.



##  Autor

**José Esteban Ortiz Trujillo**
Ingeniería de Software, Universidad de las Américas (UDLA)