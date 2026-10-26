# Guía de campo: la artesana firma con su PIN y cobra en pesos (ADR-004)

**Para:** el equipo que visita a un grupo de artesanas o productoras.
**Duración:** 60 minutos con un grupo.
**Relación:** [ADR-004](../adr/ADR-004-PAGOS-EN-PESOS-SIN-BILLETERA.md) (fase 1 aceptada; fase 2 solo en testnet). Responde a las preguntas de campo de su sección 5. Issues relacionadas: #91, #93, #97, #103, #108 y #114.

> **Privacidad ([`docs/research/PRIVACIDAD.md`](../research/PRIVACIDAD.md)):** no se graba audio ni video y no se toman fotos de personas. No se anotan nombres, teléfonos, CURP ni domicilios. Nada de esto se sube al repositorio ni a issues o PR.

---

## 1. Qué queremos saber

**Fase 1 (lo que se construye ahora)**
1. Si la artesana puede registrar su lote y confirmarlo **ella misma con un PIN de 4 dígitos**, y en cuánto tiempo.
2. Si recuerda su PIN después de un rato, y dónde guardaría su tarjeta de recuperación.
3. Si las que no tienen celular pueden firmar con **su tarjeta QR y un PIN de 6 dígitos** en el celular de la promotora, y quién guardaría esa tarjeta.
4. Si la artesana entiende "Te van a pagar $X el día Y" sin palabras técnicas.

**Fase 2 (se construye en testnet)**
5. Cuántas socias tienen celular propio, cuenta bancaria y RFC. Etherfuse pide CURP, RFC y una cuenta a nombre de la persona.
6. Si confían en un QR como forma de cobrar en efectivo. En MicoPay, el QR se crea **cuando ya está en la tienda** y **dura 15 minutos**.
7. Qué tienda de la cabecera podría ser la primera en entregar efectivo.
8. Qué protección prefieren con un celular compartido: límite por cobro o aviso a una persona de confianza.

## 2. Equipo y material

* **Equipo:** una persona que facilita, una que toma notas y una que conduce la prueba.
* **Material:**
  * Tarjetas QR de prueba, sin nombres, con un número de socia ficticio (S1, S2…). Cada una con su PIN de prueba de 6 dígitos escrito en un papel aparte.
  * Tarjetas de recuperación de prueba, también sin nombres.
  * Billetes de juguete y un letrero de "Tienda de prueba".
  * Un celular del equipo con el prototipo.
  * La hoja de registro en papel (sección 5).

## 3. Guion

**0–5 min · Apertura y consentimiento**
* Explicar que es un ensayo con dinero de juguete y que no se graba ni se toman fotos de personas.
* Pedir consentimiento verbal para tomar notas sin nombres. Si alguien no quiere, no se anota nada suyo.

**5–20 min · Conversación en grupo**

Se cuenta con la mano levantada y sin nombres.
1. ¿Cuántas tienen celular propio? ¿Quién más lo usa? ¿Quién lee sus mensajes de WhatsApp?
2. ¿Usan algún PIN o contraseña hoy, por ejemplo en el banco o en el celular? ¿Cómo lo recuerdan?
3. Si les damos un papel para recuperar su cuenta, ¿dónde lo guardarían? ¿Y una tarjeta para firmar si no tienen celular?
4. ¿Cuántas tienen cuenta de banco o tarjeta? ¿Cuántas tienen RFC? ¿Y la CURP a la mano?
5. Si les llega un QR que vale $500 y solo sirve 15 minutos en una tienda, ¿lo cuidarían como un billete?
6. ¿En qué tienda de la cabecera confían y suele tener efectivo? Se anota el giro del negocio, no el nombre de la persona.
7. ¿Qué les preocupa? Por ejemplo: olvidar el PIN, que alguien de la familia lo vea, robo o que la tienda no tenga efectivo.

**20–45 min · Prueba con el prototipo (3 o 4 voluntarias, una por una)**

| Tarea | Quién | Qué hace | Qué se mide |
|---|---|---|---|
| **A. Registrar su lote** | Artesana con celular | Llena su lote y lo confirma con su PIN de 4 dígitos | Tiempo y si necesitó ayuda |
| **B. Firmar con su tarjeta** | Artesana sin celular, con la promotora | La promotora escanea la tarjeta en su celular y la artesana escribe su PIN de 6 dígitos | Tiempo, si necesitó ayuda y si la promotora vio el PIN |
| **C. Entender su pago** | Artesana | Lee "Te van a pagar $480 el viernes" y dice en voz alta cuánto, cuándo y cómo cobra | Si responde las tres cosas |
| **D. Recordar su PIN** | Artesana de la tarea A o B | Al final de la sesión, vuelve a escribir su PIN | Si lo recuerda sin ayuda |
| **E. Cobrar con QR** (fase 2) | Artesana | En la "tienda", toca "Ya estoy en la tienda", confirma con su PIN y muestra el QR | Tiempo y si lo logra |
| **F. Celular compartido** | Artesana | "Su nieto toma el celular y quiere cobrar, ¿qué pasa?" | Su reacción y qué protección prefiere: límite por cobro o aviso a una persona de confianza |

**45–55 min · Cierre**
* ¿Preferirían esto o seguir como hoy? ¿Por qué?
* ¿Les da tranquilidad que el dinero les llegue directo a ellas, sin pasar por el grupo?

**55–60 min** · Agradecer y explicar qué sigue.

## 4. Criterios de éxito

| Indicador | Meta | Si no se cumple |
|---|---|---|
| Tarea A en 90 segundos o menos | 2 de 3 artesanas | Simplificar el registro antes de #93 |
| Tarea B sin que la promotora vea el PIN | 2 de 3 | Rediseñar la pantalla de la tarjeta antes de construirla |
| Tarea C correcta sin ayuda | 3 de 4 | Revisar textos con #108 |
| Tarea D: recuerdan su PIN | 3 de 4 | Replantear el PIN (ADR-004, D4) |
| Socias que confían en el QR como efectivo | 50 % o más | Replantear el efectivo con QR en la fase 2 |
| Socias con celular propio, banco y RFC | Se reporta el número | Decide cuántas usarían tarjeta QR y cuántas SPEI |
| Tiendas candidatas | Al menos 1 | Sin tienda no hay efectivo en la fase 2 |
| Palabras técnicas que causen preguntas (billetera, cripto, hash, llave) | 0 | Revisar textos con #108 |

## 5. Hoja de registro (papel)

| Participante | Oficio | Celular propio (sí/no) | Banco (sí/no) | RFC (sí/no/no sabe) | Tiempo A o B | ¿La promotora vio el PIN? (B) | C correcta | Recordó su PIN (D) | Tiempo E | Protección preferida (F) | ¿Necesitó ayuda? | Cita textual anónima |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | | | | | | | | | | | | |
| P2 | | | | | | | | | | | | |

* No anotar la edad si la persona prefiere no ser identificada.
* No anotar los PIN de prueba en la hoja.
* La hoja en papel se guarda con el equipo (carpeta privada), nunca en el repositorio.

## 6. Cómo se reporta

* Un resumen en Markdown en `docs/ux-testing/TEST_06_PAGOS_PESOS_<oficio>.md`, por rol y comunidad, sin datos personales.
* Los resultados que cambien el diseño se comentan en #104 (ADR-004) y en la issue afectada.
* Sin fotos de personas, audio, video, CURP ni teléfonos en el repositorio, issues o PR.
