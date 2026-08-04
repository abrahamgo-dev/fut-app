# Checklist de Remediacion de Seguridad y SEO

Ultima actualizacion: 2026-08-04
Objetivo: cerrar alerta de "Sitio peligroso" y estabilizar indexacion en Google.

## 1) Contencion inmediata

- [x] Congelar cambios no urgentes y deploys paralelos.
- [ ] Confirmar que el fix de callbackUrl en login ya esta en produccion. (Bloqueado temporalmente por advertencia de Safe Browsing en produccion)
- [ ] Mantener una sola version canonica del sitio: https://www.once-fc.com.
- [ ] Verificar que https://once-fc.com redirige a https://www.once-fc.com sin bucles.

## 2) Rotacion de credenciales (prioridad alta)

- [x] Rotar AUTH_SECRET.
- [ ] Rotar GOOGLE_CLIENT_SECRET.
- [ ] Rotar STRIPE_SECRET_KEY.
- [ ] Rotar STRIPE_PUBLISHABLE_KEY.
- [ ] Rotar STRIPE_WEBHOOK_SECRET.
- [ ] Rotar RESEND_API_KEY.
- [ ] Rotar META_ACCESS_TOKEN.
- [ ] Rotar WHATSAPP_WEBHOOK_VERIFY_TOKEN.
- [ ] Rotar credenciales de DATABASE_URL.
- [ ] Rotar credenciales de DIRECT_DATABASE_URL.
- [ ] Revocar credenciales antiguas en cada proveedor.

## 3) Variables de entorno de produccion

- [x] AUTH_URL configurado a https://www.once-fc.com.
- [ ] Revisar NEXT_PUBLIC_PRELAUNCH_MODE segun estrategia actual.
- [x] Revisar GOOGLE redirect URI de produccion.
- [ ] Confirmar variables de Stripe en entorno correcto (test/live).

## 4) Deploy limpio y validaciones funcionales

- [ ] Hacer redeploy completo con secretos nuevos.
- [ ] Probar login con Google end-to-end.
- [ ] Probar checkout y confirmacion de pago en Stripe.
- [ ] Verificar webhook de Stripe en estado OK.
- [ ] Probar formulario de contacto y envio de notificaciones (Resend).
- [ ] Probar webhook de WhatsApp (GET verificacion y POST mensaje).

## 5) SEO tecnico (dominio y rastreo)

- [ ] Confirmar canonical en version www en paginas publicas.
- [ ] Confirmar robots.txt publicado en https://www.once-fc.com/robots.txt.
- [ ] Confirmar sitemap en https://www.once-fc.com/sitemap.xml.
- [ ] Retirar/ignorar sitemap del dominio sin www en Search Console.

## 6) Search Console

- [ ] Inspeccionar URL: https://www.once-fc.com/
- [ ] Inspeccionar URL: https://www.once-fc.com/ciudades
- [ ] Inspeccionar URL: https://www.once-fc.com/preguntas-frecuentes
- [ ] Solicitar indexacion para las URLs anteriores.
- [x] Enviar solicitud de revision en "Problemas de seguridad".

## 7) Evidencia para revision (anotar aqui)

- [ ] Fecha/hora de rotacion de secretos:
- [ ] Fecha/hora de deploy limpio:
- [ ] Captura o nota de validacion de redirects:
- [ ] Captura o nota de estado de sitemap:
- [ ] Texto enviado en solicitud de revision:
- [x] 2026-08-04: Google confirma revision aprobada y retiro de advertencias en proceso (puede tardar algunas horas).

## 8) Cierre

- [ ] Confirmar que Chrome ya no muestra advertencia de sitio peligroso.
- [ ] Confirmar que la pagina /ciudades ya no muestra "Error de redireccion" en Search Console.
- [ ] Registrar post-mortem breve (causa, impacto, acciones, prevencion).
- [ ] Definir politica de rotacion periodica (60-90 dias).

---

## Bitacora rapida

- [ ] 2026-**-** **:** Inicio del plan
- [ ] 2026-**-** **:** Rotacion completada
- [x] 2026-08-02 **:** Revision solicitada en Search Console
- [x] 2026-08-04 **:** Google aprueba la revision de seguridad (pendiente propagacion)
- [ ] 2026-**-** **:** Alerta removida
