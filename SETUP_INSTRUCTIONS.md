# Instrucciones para configurar las variables de entorno

Después de arreglar los archivos, sigue estos pasos:

## 1. Generar una clave NEXTAUTH_SECRET válida

Ejecuta este comando en PowerShell o terminal:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y pégalo en el archivo `.env.local` reemplazando la línea de `NEXTAUTH_SECRET`.

## 2. Actualizar el archivo .env.local

El archivo `.env.local` debe quedar así:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-your-generated-secret-here>
```

## 3. Limpiar la base de datos (si tienes errores)

Si tienes problemas con la base de datos, puedes resetearla:

```
npx prisma migrate reset
```

## 4. Generar el cliente Prisma

```
npm run db:gen
```

## 5. Iniciar el servidor

```
npm run dev
```

## Cambios realizados:

1. ✅ Arreglado error de NextAuth (CLIENT_FETCH_ERROR)
2. ✅ Mejorada la configuración de autenticación en `src/lib/auth.ts`
3. ✅ Mejorado el componente de login con manejo de errores
4. ✅ Mejorado el componente de registro con validaciones
5. ✅ Mejorado el endpoint `/api/register` con mejor validación
6. ✅ Añadidas variables de entorno necesarias en `.env.local`

## Lo que arreglé:

- El error "Unexpected token '<'" ocurría porque NextAuth no estaba configurado correctamente
- Las credenciales ahora se validan correctamente
- El flujo de registro ahora funciona correctamente
- Se añadió validación de contraseña (mínimo 6 caracteres)
- Se normalizan los emails a minúsculas para evitar duplicados
