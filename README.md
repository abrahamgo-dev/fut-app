# Once FC — sitio web

Sitio para un club de entrenamiento de fútbol para adultos en México. Hecho
con **Next.js 14 (App Router)**, **TypeScript** y **Tailwind CSS**, pensado
para SEO desde el día uno.

"Once FC" es el nombre de trabajo del proyecto — pensado para un club de
entrenamiento serio para adultos, no una escuelita infantil. Cámbialo por el
nombre real de tu club cuando quieras (ver abajo).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000

Para producción:

```bash
npm run build
npm start
```

## Qué incluye

- **App Router** de Next.js con componentes de servidor (rápido, buen SEO).
- **Metadata completa**: title, description, Open Graph, Twitter Card, y
  datos estructurados (JSON-LD `SportsActivityLocation`) para que Google
  entienda que es un club deportivo.
- **`sitemap.xml`** y **`robots.txt`** generados automáticamente
  (`app/sitemap.ts`, `app/robots.ts`).
- Diseño responsivo, con foco visible en teclado y respeto a
  `prefers-reduced-motion`.
- Secciones: hero, niveles de entrenamiento, método, testimonios,
  formulario de sesión gratuita, footer.

## Lo primero que deberías cambiar

Todo el contenido es un punto de partida — está escrito para lucir bien,
pero con datos de ejemplo:

| Qué | Dónde |
|---|---|
| Nombre del club / dominio | `app/layout.tsx` (`siteUrl`, título, JSON-LD) y `components/Nav.tsx`, `Footer.tsx` |
| Teléfono, correo, dirección real | `components/Footer.tsx` |
| Niveles, horarios y grupos reales | `components/Categories.tsx` |
| Testimonios reales (con permiso de los jugadores) | `components/Testimonials.tsx` |
| El formulario de "Sesión gratuita" | `components/Prueba.tsx` — hoy solo simula el envío; conéctalo a un servicio de correo (Resend, Formspree) o a tu CRM |

Cuando el club crezca y tenga instalaciones propias, considera agregar de
nuevo una sección de "Instalaciones" con fotos reales (se quitó por ahora
para no mostrar canchas que no son del club).

## Paleta y tipografía

- **Negro** `#0A0B0A` / **Negro profundo** `#000000` — fondo principal
- **Bone** `#F3F3EF` — blanco cálido, para fondos y texto claro
- **Volt** `#B6FF3B` — verde fósforo, acento principal (úsalo con medida:
  CTAs, cifras clave, un solo bloque fuerte de color, no todo el sitio)
- **Volt dim** `#83B82A` — variante apagada del verde, para acentos
  secundarios (números, nombres de testimonios)
- **Graphite** `#8C8C86` — gris neutro para etiquetas discretas sobre fondo
  claro
- Tipografía: **Anton** (títulos, estilo cartel de estadio), **Work Sans**
  (texto), **IBM Plex Mono** (números tipo marcador electrónico)

Todo vive en `tailwind.config.ts` si quieres ajustar colores o fuentes.

## Siguientes pasos recomendados

1. Compra el dominio y actualiza `siteUrl` en `app/layout.tsx`.
2. Da de alta el sitio en **Google Search Console** una vez publicado.
3. Sustituye las imágenes de stock por fotos reales de tus entrenamientos
   (con autorización).
4. Conecta el formulario de sesión gratuita a un servicio real.
5. Agrega Google Analytics o Plausible cuando tengas tráfico que medir.
6. Considera páginas adicionales (por nivel, blog de resultados, página de
   "Nosotros") para reforzar el SEO con más contenido indexable.

## Deploy

El camino más simple es [Vercel](https://vercel.com) (los creadores de
Next.js): conecta el repositorio y cada `git push` genera un deploy.
También funciona en cualquier hosting que soporte Node.js.
