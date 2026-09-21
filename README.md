![logop5](https://i.imgur.com/Ub5CYpa.jpg)


# 26 - TMDB

### Objetivos

👉 En este proyecto **crearás una aplicación que muestre películas y programas de televisión**. Para eso, consumirás la información de la API de [The Movie Database (TMDB)](https://www.themoviedb.org/).

🔍 Para acceder a la documentación de la API, hacé click [acá](https://developers.themoviedb.org/3/getting-started/introduction).

- Para armar el _front-end_, aplicarás lo aprendido hasta ahora.

- Para el _back-end_, deberás configurar una base de datos y construir las funcionalidades detalladas a continuación.

- **Importante**: La información de los usuarios deberá **persistir** en el _back-end_.

## 🎯 Requisitos

####  Prioridad Alta (***Must Have***)

- Buscar y listar películas.
- Ver los detalles de una película o programa de televisión.
- Crear usuarios.
- Loguear y desloguear usuarios.
- Agregar/eliminar una película o programa a una lista de favoritos.
- Ver tu lista de favoritos.
- Mantener sesión abierta ante un cierre del browser o refresh.

####  **Prioridad Media** (***Nice To Have***)

- Buscar usuarios.
- Ver el perfil de un usuario específico (con sus películas o programas favoritos).
- Diferenciar las rutas de front-end para películas y programas de televisión.
- Full responsive.
- Loguear usuarios a través de su cuenta en Google.

### Pledu

Hacé [_click_ acá](https://pledu.plataforma5.la/bootcamp/omdb/solo%20week-581874b7) para acceder al módulo correspondiente en Pledu.

---

## 🚀 Despliegue en Render

### ⚠️ La base de datos free expira cada 30 días

Las bases de datos **PostgreSQL free de Render expiran 30 días después de creadas** (luego hay 14 días de gracia antes de que los datos se borren definitivamente). Por eso, periódicamente puede aparecer este error al desplegar:

```
HostNotFoundError [SequelizeHostNotFoundError]: getaddrinfo ENOTFOUND dpg-xxxxxxxx-a
```

Ese `dpg-xxxxxxxx-a` es el hostname interno de la base en Render. El error `ENOTFOUND` significa que la base ya no existe (expiró) y por eso el hostname no resuelve.

### Cómo solucionarlo con el `render.yaml` (Blueprint)

El `render.yaml` **no revive una base expirada automáticamente**: hay que recrearla, pero se puede hacer de forma que el Blueprint reconecte todo solo.

1. **Borrá la base vieja/expirada** desde el dashboard de Render, para que el Blueprint no quede apuntando a un recurso muerto.

2. **Verificá que el `render.yaml` vincule la base por nombre.** El `name` de la base y el `name` dentro de `fromDatabase` deben coincidir exactamente:

   ```yaml
   databases:
     - name: tmdb-db          # Render recrea la base con este nombre
       databaseName: tmdb
       user: tmdb_user
       plan: free

   services:
     - type: web
       name: tmdb-app
       envVars:
         - key: DATABASE_URL
           fromDatabase:
             name: tmdb-db     # debe coincidir con el name de arriba
             property: connectionString
   ```

3. **Resincronizá el Blueprint:** en Render → tu Blueprint → **Manual Sync** (o hacé un `git push`). Render detecta que la base no existe, la recrea e **inyecta automáticamente el `DATABASE_URL` nuevo** (con la contraseña nueva) en el servicio web.

4. **Redeploy del servicio web:** suele dispararse solo tras el sync. Si no, **Manual Deploy → Deploy latest commit**.

### Notas importantes

- **No mezcles métodos:** si seteás `DATABASE_URL` manualmente en la sección *Environment*, ese valor pisa lo que define el `render.yaml`. Para que el flujo automático del Blueprint funcione, dejá que **solo** el `fromDatabase` gestione la variable (borrá el override manual si lo hubiera).
- **Internal vs External URL:** como el servicio web y la base están ambos en Render, corresponde la **Internal Database URL** (más rápida y segura). La External solo se usa para conectarse desde fuera de Render (ej. pgAdmin local).
- **Los datos se pierden** en cada expiración (usuarios, favoritos). Si el proyecto lo requiere, la base de pago más barata de Render (~7 USD/mes) no expira, o podés exportar un backup antes del vencimiento.
- **Emails:** en producción se usa **Resend** (API HTTP, puerto 443), porque Render bloquea los puertos SMTP (465, 587).
