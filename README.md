# OpenCore Docs

Documentación oficial para el ecosistema OpenCore, construida con [Docusaurus](https://docusaurus.io/).

## Requisitos previos

- **Node.js**: v20.0 o superior.
- **pnpm**: Recomendado para la gestión de dependencias.

## Instalación

```bash
pnpm install
```

## Desarrollo Local

```bash
pnpm start
```

Este comando inicia un servidor de desarrollo local y abre una ventana en el navegador. La mayoría de los cambios se reflejan en tiempo real sin necesidad de reiniciar el servidor.

## Construcción (Build)

```bash
pnpm build
```

Genera contenido estático en el directorio `build/` que puede ser servido por cualquier servicio de hosting estático.

## Otros comandos

- `pnpm serve`: Sirve localmente la versión de producción generada en `build/`.
- `pnpm typecheck`: Ejecuta la comprobación de tipos de TypeScript.
- `pnpm clear`: Limpia la caché de Docusaurus.

## Despliegue

El despliegue se puede realizar configurando el script `deploy` en el entorno correspondiente.

```bash
pnpm deploy
```
