# 🔒 Privacidad de las personas entrevistadas

Este repositorio es **público**: todo lo que se sube aquí lo puede leer, copiar y archivar cualquier persona, y queda en el historial de git aunque después se borre. Las artesanas, productores y hablantes que nos dan su tiempo no aceptaron aparecer en internet por el solo hecho de conversar con nosotros.

## Reglas

1. **Consentimiento por escrito antes de publicar nombre, voz o imagen.** Sin un consentimiento firmado que diga explícitamente "acepto que se publique en internet", no se publica. Un permiso verbal para grabar **no** es permiso para publicar.
2. **Se publica por rol y comunidad, nunca por nombre.** Escribe *"artesana de rebozo, Amoltepec"* o *"productor de jitomate, San Antonio Nduaxico"*, no *"Doña Rosa"*. Tampoco pongas nombre en los nombres de archivo ni de rama.
3. **Si alguien pide no ser identificada, tampoco se publica su edad** ni ningún dato que, junto con la comunidad y el oficio, permita reconocerla.
4. **Las evidencias van en la carpeta privada.** Audios, videos, fotos de personas, fichas firmadas y PDF de entrega se guardan en `.investigacion_privada/` (está en `.gitignore`) o en la carpeta compartida del equipo. En el repo solo va el resumen en Markdown, ya sin datos personales.
5. **Nada de números de control, CURP, teléfonos ni direcciones** de estudiantes o participantes en documentos públicos. Para dar crédito a un estudiante basta su nombre o su usuario de GitHub.
6. **Tampoco uses adjuntos de GitHub** (arrastrar un archivo a una issue o PR): generan un enlace público `github.com/user-attachments/...` que no se puede borrar desde el repo.

## Antes de abrir tu PR

- [ ] Mi documento no tiene nombres de personas entrevistadas, solo rol y comunidad.
- [ ] No subí audio, video, fotos de personas ni PDF con datos personales.
- [ ] No hay números de control ni datos de contacto.
- [ ] Tengo el consentimiento por escrito de cualquier dato personal que sí publico.

El CI rechaza automáticamente los PR que agregan audio, video, imágenes o PDF dentro de `docs/research/`, `docs/ux-testing/` o `public/videos/`.

## ¿Ya se publicó algo por error?

Avisa de inmediato a los responsables del repositorio. Quitar el archivo en un commit nuevo **no basta**: sigue en el historial. Para borrarlo de verdad hay que reescribir el historial (`git filter-repo`) y coordinarlo con todo el equipo, porque cada quien debe volver a clonar el repositorio.
