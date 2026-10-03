# Imagen base de Nginx para servir el cliente de pagos
FROM nginx:alpine

# Copia los archivos estáticos del proyecto al directorio web de Nginx
COPY . /usr/share/nginx/html

# Exposición del puerto HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
