# Guía para Conectar Frontend con Backend

## Para el Programador Junior

Esta guía explica cómo funciona la conexión entre Angular (frontend) y PHP (backend).

---

## Estructura del Proyecto

```
ProyectoMio/
├── backend/                    # API PHP
│   ├── config.php             # Conexión a la BD
│   ├── login.php              # Iniciar sesión
│   ├── registro.php           # Crear cuenta
│   ├── obtener_productos.php  # Ver productos
│   ├── crear_producto.php     # Añadir producto
│   ├── editar_producto.php    # Modificar producto
│   ├── eliminar_producto.php  # Borrar producto
│   ├── realizar_compra.php    # Comprar producto
│   └── database.sql           # Script de la BD
│
└── src/app/components/         # Componentes Angular
    ├── login/                  # Pantalla login
    ├── registro/               # Pantalla registro
    ├── home/                   # Catálogo productos
    └── admin/                  # Panel administrador
```

---

## Cómo Funciona la Comunicación

### 1. Angular hace una petición HTTP

```javascript
// Ejemplo: obtener productos
const response = await fetch(
  'http://localhost/DWEC/Angular/ProyectoMio/backend/obtener_productos.php',
);
const data = await response.json();
```

### 2. PHP procesa y responde en JSON

```php
// Ejemplo respuesta de obtener_productos.php
{
    "exito": true,
    "productos": [
        { "id": 1, "nombre": "Laptop", "precio": 599.99, "stock": 15 },
        { "id": 2, "nombre": "Mouse", "precio": 89.99, "stock": 50 }
    ]
}
```

---

## Endpoints del Backend

### Login

| Campo         | Valor                                   |
| ------------- | --------------------------------------- |
| **URL**       | `backend/login.php`                     |
| **Método**    | POST                                    |
| **Body**      | `{ "email": "...", "password": "..." }` |
| **Respuesta** | `{ "exito": true, "usuario": {...} }`   |

### Registro

| Campo      | Valor                                                    |
| ---------- | -------------------------------------------------------- |
| **URL**    | `backend/registro.php`                                   |
| **Método** | POST                                                     |
| **Body**   | `{ "nombre": "...", "email": "...", "password": "..." }` |

### Obtener Productos

| Campo           | Valor                           |
| --------------- | ------------------------------- |
| **URL**         | `backend/obtener_productos.php` |
| **Método**      | GET                             |
| **Un producto** | `?id=1`                         |

### Crear Producto

| Campo      | Valor                                               |
| ---------- | --------------------------------------------------- |
| **URL**    | `backend/crear_producto.php`                        |
| **Método** | POST                                                |
| **Body**   | `{ "nombre": "...", "precio": 99.99, "stock": 10 }` |

### Editar Producto

| Campo      | Valor                                                        |
| ---------- | ------------------------------------------------------------ |
| **URL**    | `backend/editar_producto.php`                                |
| **Método** | POST                                                         |
| **Body**   | `{ "id": 1, "nombre": "...", "precio": 99.99, "stock": 10 }` |

### Eliminar Producto

| Campo      | Valor                                |
| ---------- | ------------------------------------ |
| **URL**    | `backend/eliminar_producto.php?id=1` |
| **Método** | GET                                  |

### Realizar Compra

| Campo      | Valor                                                  |
| ---------- | ------------------------------------------------------ |
| **URL**    | `backend/realizar_compra.php`                          |
| **Método** | POST                                                   |
| **Body**   | `{ "usuario_id": 1, "producto_id": 2, "cantidad": 1 }` |

---

## Configuración Inicial

### Paso 1: Importar Base de Datos

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Crea base de datos: `tienda_online`
3. Importa: `backend/database.sql`

### Paso 2: Credenciales de Prueba

| Rol     | Email               | Contraseña |
| ------- | ------------------- | ---------- |
| Admin   | admin@tienda.com    | admin123   |
| Usuario | empleado@tienda.com | admin123   |

### Paso 3: Iniciar Angular

```bash
cd c:\xampp\htdocs\DWEC\Angular\ProyectoMio
npm install
ng serve
```

Abrir: `http://localhost:4200`

---

## Flujo de Autenticación

```
1. Usuario entra a /login
2. Rellena email y password
3. Angular envía POST a login.php
4. Si exito=true:
   - Guardar usuario en localStorage
   - Redirigir según rol:
     - jefe -> /admin
     - empleado -> /home
5. Si exito=false:
   - Mostrar mensaje de error
```

### Código de ejemplo:

```javascript
// Guardar usuario
localStorage.setItem('user', JSON.stringify(data.usuario));

// Obtener usuario
const user = JSON.parse(localStorage.getItem('user'));

// Verificar si es admin
if (user && user.rol === 'jefe') {
  // Es administrador
}

// Cerrar sesión
localStorage.removeItem('user');
```

---

## Errores Comunes

### Error CORS

Si ves error de CORS, verifica que `config.php` tiene:

```php
header('Access-Control-Allow-Origin: *');
```

### Error de conexión

Verifica que:

1. XAMPP está corriendo (Apache y MySQL)
2. La base de datos `tienda_online` existe
3. La URL del backend es correcta

### Error "fetch is not defined"

En Angular, usa `fetch` dentro de métodos `async`:

```javascript
async cargarDatos() {
    const response = await fetch('...');
}
```
