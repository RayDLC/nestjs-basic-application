<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar proyecto
2. Instalacion de modulos de node ```pnpm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
docker-compose up -d
```

6. Levantar el proyecto en modo desarrollo (watch-mode) : ```pnpm start:dev```

7. Ejecutar SEED (conjunto de informacion para desarrollo)
```
http://localhost:3000/api/seed
```


# Stack utilizado

- Nest
- Postgres (database)