@echo off
echo Deteniendo procesos de Node.js para liberar archivos...
taskkill /F /IM node.exe

echo.
echo Actualizando base de datos...
call npx prisma db push

echo.
echo Iniciando servidor...
npm run dev
