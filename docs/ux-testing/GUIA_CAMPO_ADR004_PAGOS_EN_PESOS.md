# Guía de campo: registro por el grupo y cobro en pesos (ADR-004)

**Para:** el equipo que visita a un grupo de artesanas o productoras.
**Duración:** 60 minutos con un grupo.
**Relación:** [ADR-004](../adr/ADR-004-PAGOS-EN-PESOS-SIN-BILLETERA.md) (fase 1 aceptada, fase 2 en investigación) y las issues #91, #92, #93, #97 y #103.

> **Privacidad ([`docs/research/PRIVACIDAD.md`](../research/PRIVACIDAD.md)):** no se graba audio ni video y no se toman fotos de personas. No se anotan nombres, teléfonos, CURP ni domicilios. Nada de esto se sube al repositorio ni a issues o PR.

---

## 1. Qué queremos saber

**Fase 1 (lo que se construye ahora)**
1. Si las responsables del grupo pueden registrar un lote escaneando la tarjeta QR de una socia, y en cuánto tiempo.
2. Quiénes del grupo firmarían entre dos o tres, y cómo lo decide la asamblea.
3. Si la artesana entiende "Te van a pagar $X el día Y" sin palabras técnicas.

**Fase 2 (en investigación)**
4. Cuántas socias tienen cuenta bancaria, RFC y celular propio. Etherfuse pide CURP, RFC y una cuenta a nombre de la persona.
5. Si confían en un QR como forma de cobrar en efectivo. En MicoPay, el QR **solo sirve en la tienda elegida y dura poco**.
6. Qué tiendas de la cabecera podrían entregar efectivo.
7. Qué les preocupa de cobrar así.

## 2. Equipo y material

* **Equipo:** una persona que facilita, una que toma notas y una que conduce la prueba.
* **Material:**
  * Tarjetas QR de prueba, sin nombres, con un número de socia ficticio (S1, S2…).
  * Billetes de juguete y un letrero de "Tienda de prueba".
  * Un celular del equipo con el prototipo.
  * La hoja de registro en papel (sección 5).

## 3. Guion

**0–5 min · Apertura y consentimiento**
* Explicar que es un ensayo con dinero de juguete y que no se graba ni se toman fotos de personas.
* Pedir consentimiento verbal para tomar notas sin nombres. Si alguien no quiere, no se anota nada suyo.

**5–20 min · Conversación en grupo**

Se cuenta con la mano levantada y sin nombres.
1. ¿Cuántas tienen cuenta de banco o tarjeta? ¿Cuántas tienen RFC? ¿Y la CURP a la mano?
2. ¿El celular es suyo o lo comparten? ¿Con quién? ¿Quién lee sus mensajes de WhatsApp?
3. Si les llega un QR que vale $500 y solo sirve un rato en una tienda, ¿lo cuidarían como un billete? ¿Quién más podría usarlo?
4. ¿En qué tienda de la cabecera confían y suele tener efectivo? Se anota el giro del negocio, no el nombre de la persona.
5. ¿Quiénes del grupo podrían autorizar los registros y los pagos entre dos o tres? ¿Lo decidiría la asamblea? ¿Conviene que sean de familias distintas?
6. ¿Qué les preocupa? Por ejemplo: robo, que el grupo retenga el dinero o que la tienda no tenga efectivo.

**20–45 min · Prueba con el prototipo (3 o 4 voluntarias, una por una)**

| Tarea | Quién | Qué hace | Qué se mide |
|---|---|---|---|
| **A. Registrar un lote** | Responsable | Escanea la tarjeta QR de una socia, llena el lote y confirma con un PIN de 4 dígitos | Tiempo y si necesitó ayuda |
| **B. Entender su pago** | Artesana | Lee "Te van a pagar $480 el viernes" y dice en voz alta cuánto, cuándo y cómo cobra | Si responde las tres cosas |
| **C. Esperar a la compañera** | Responsable | Ve "Esperando a 1 compañera más" y explica qué tiene que pasar | Si entiende que falta otra firma |
| **D. Cobrar con QR** (fase 2) | Artesana | Recibe un QR de prueba, va a la "tienda" y dice la palabra clave | Tiempo y si lo logra |
| **E. Celular compartido** | Artesana | "Su nieto ve el mensaje del QR, ¿qué pasa?" | Su reacción y qué protección prefiere: palabra clave, aviso a una persona de confianza o límite por cobro |

**45–55 min · Cierre**
* ¿Preferirían esto o seguir como hoy? ¿Por qué?
* ¿Cómo sabrían que el grupo les pagó lo justo? (¿Les sirve revisar un libro por socia en la asamblea?)

**55–60 min** · Agradecer y explicar qué sigue.

## 4. Criterios de éxito

| Indicador | Meta | Si no se cumple |
|---|---|---|
| Tarea A en 90 segundos o menos | 2 de 3 responsables | Simplificar el registro antes de #93 |
| Tarea B correcta sin ayuda | 3 de 4 | Revisar textos con #108 |
| Tarea C entendida | 2 de 3 responsables | Rediseñar el estado de espera en #97 |
| Responsables que aceptan firmar | 2 de 3 nombradas por el grupo | Replantear la multifirma (ADR-004, D3) |
| Socias que confían en el QR como efectivo | 50 % o más | Replantear el efectivo con QR en la fase 2 |
| Socias con celular propio y RFC | Se reporta el número | Decide si el plan B de la fase 2 es viable |
| Tiendas candidatas | Al menos 1 | Sin tienda no hay efectivo en la fase 2 |
| Palabras técnicas que causen preguntas (billetera, cripto, hash) | 0 | Revisar textos con #108 |

## 5. Hoja de registro (papel)

| Participante | Rol | Oficio | Banco (sí/no) | RFC (sí/no/no sabe) | Celular propio (sí/no) | Tiempo A | B correcta | C entendida | Tiempo D | Protección preferida (E) | ¿Necesitó ayuda? | Cita textual anónima |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | | | | | | | | | | | | |
| P2 | | | | | | | | | | | | |

* No anotar la edad si la persona prefiere no ser identificada.
* La hoja en papel se guarda con el equipo (carpeta privada), nunca en el repositorio.

## 6. Cómo se reporta

* Un resumen en Markdown en `docs/ux-testing/TEST_06_PAGOS_PESOS_<oficio>.md`, por rol y comunidad, sin datos personales.
* Los resultados que cambien el diseño se comentan en #104 (ADR-004) y en la issue afectada.
* Sin fotos de personas, audio, video, CURP ni teléfonos en el repositorio, issues o PR.
