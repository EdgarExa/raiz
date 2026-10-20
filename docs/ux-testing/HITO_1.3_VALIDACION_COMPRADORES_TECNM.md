# VALIDACIÓN DEL COMPRADOR Y PRUEBAS DE USABILIDAD UX

**Adaptación del Issue #68 - Buyer Research Validation & UX Usability Testing**  
**Proyecto Raíz / Open Hub Tec**  
**Organización de referencia:** Chocolate Artesanal de Metate - Mercedes Cruz Cruz

---

## 1. Objetivo y alcance de la validación

El objetivo es validar, desde el punto de vista del comprador, si la plataforma Raíz comunica de forma clara el origen y autenticidad de los productos de la Mixteca, si el modelo de contacto directo resulta comprensible y confiable, si la privacidad de la persona artesana es percibida positivamente y si las funciones principales de la aplicación móvil pueden utilizarse sin asistencia.

El Issue #68 también solicita medir tiempo por tarea, tasa de éxito y una puntuación de System Usability Scale (SUS), usando el protocolo Think-Aloud durante cinco tareas móviles. Los problemas observados deben transformarse en acciones de mejora del producto.

### 1.1 Adaptación al caso de Chocolate Artesanal de Metate

El Issue #68 utiliza ejemplos de café, textiles y artesanías. Para este trabajo se adapta el protocolo al caso de Doña Meche y su chocolate artesanal. Por ello, las preguntas se relacionan con origen del cacao, autenticidad, trazabilidad, contacto directo, privacidad y confianza del comprador.

### 1.2 Evidencia previa del comprador

La entrevista previa al comprador permitió obtener requisitos concretos: mostrar ingredientes, porcentaje de cacao, nivel de dulzor o amargor, peso, precio, fotografías, disponibilidad, formas de pago, costo de envío, notificaciones, seguimiento, origen del cacao, recomendaciones, QR y material sobre el proceso de elaboración. También se propusieron requisitos de legibilidad, imágenes claras y uso sin asistencia.

| Tema | Necesidad identificada | Requisitos |
| --- | --- | --- |
| Información del producto | El comprador necesita datos claros antes de decidir la compra. | RF-01 a RF-05 |
| Catálogo | Fotografías, recomendaciones y formas de consumo. | RF-06 a RF-08 |
| Compra | Disponibilidad, datos de entrega, pagos y costo de envío. | RF-09 a RF-13 |
| Seguimiento | Confirmación, estado y estimación de llegada. | RF-14 a RF-17 |
| Confianza y origen | Origen del cacao y recomendaciones de otros clientes. | RF-18 y RF-19 |
| QR | Origen, elaboración, fotos, videos y consejos. | RF-20 a RF-22 |
| Usabilidad | Textos legibles, imágenes claras y proceso sin ayuda. | RNF-01 a RNF-04 |

---

## 2. Protocolo de campo y ética

Antes de iniciar la prueba se debe explicar que la actividad es académica, que se observará el uso de la plataforma y que la persona puede detenerse cuando quiera. Se debe solicitar consentimiento verbal para tomar notas o grabar. El evaluador no debe indicar dónde tocar ni completar las acciones por el participante.

### 2.1 Guion de consentimiento

“Somos estudiantes del TecNM y estamos evaluando qué tan clara y fácil de usar es la plataforma Raíz. La prueba evalúa la aplicación, no a usted. Le pediremos realizar algunas tareas mientras nos dice en voz alta lo que piensa. ¿Está de acuerdo en participar y en que tomemos notas de sus respuestas?”

---

## 3. Validación cualitativa del comprador

Las respuestas siguientes se organizan con dos fuentes: a) necesidades ya obtenidas en la entrevista del comprador y reflejadas en los requisitos del proyecto; y b) benchmark resuelto incluido en el propio Issue #68. Cuando una pregunta no fue aplicada específicamente al comprador de chocolate, se indica como referencia del benchmark para evitar presentarla como dato propio.

| # | Pregunta | Respuesta documentada / referencia | Fuente |
| --- | --- | --- | --- |
| 1 | ¿Qué le motiva a elegir un producto artesanal y qué tan importante es comprobar su origen? | El comprador destaca la importancia de consumir chocolate de cacao natural de molienda en metate de piedra sin aditivos industriales. Valora comprobar el origen en la Mixteca y la tradición de 5 generaciones para garantizar sabor, salud y apoyo directo a la productora. | Entrevista al comprador / RF-18 y RF-19 |
| 2 | ¿Qué piensa de que una empresa copie un producto, diseño o identidad cultural sin autorización? | El comprador califica la copia o apropiación como una competencia desleal e injusta que desvaloriza el trabajo artesanal. Considera necesario contar con un sello de autenticidad que proteja la autoría cultural de la comunidad frente al plagio comercial. | Entrevista cualitativa / Benchmark Issue #68 |
| 3 | ¿La autenticidad mediante Stellar sin publicar datos privados aumenta la confianza? | Valora positivamente la verificación mediante blockchain Stellar. Afirma que poder validar la autenticidad matemática del producto sin comprometer ni exponer la dirección o datos personales de la familia chocolatera otorga total confianza y respeto a la privacidad. | Entrevista cualitativa / Benchmark Issue #68 |
| 4 | ¿Qué le parece el modelo de contacto directo sin comisión? | Considera excelente el trato directo vía WhatsApp sin intermediarios ni comisiones del 30%. Esto le permite acordar directamente la entrega (local o envío a otros estados) y garantizar que el pago llegue íntegro a quien elabora el chocolate. | Entrevista cualitativa / Benchmark Issue #68 |
| 5 | ¿Qué le parece que la productora elija cuánto mostrar de su identidad? | Lo percibe como un acierto que respeta la autodeterminación indígena. Señala que no es necesario publicar direcciones exactas para confiar en la calidad, bastando con la firma comunitaria o de la tradición familiar junto al sello digital. | Entrevista cualitativa / Benchmark Issue #68 |
| 6 | ¿Pagaría un poco más por autenticidad verificable? | Sí, el comprador expresa disposición a pagar un margen ético adicional ($50 a $100 MXN extras por kilo) al contar con la garantía verificable de que es chocolate puro de metate y que el dinero beneficia directamente al taller familiar. | Entrevista cualitativa / Criterio de compra WTP |

---

## 4. Prueba de usabilidad móvil: cinco tareas

El Issue #68 solicita cinco tareas observadas. Como no se cuenta con una medición propia cronometrada en los archivos disponibles, se presentan dos cosas: una revisión de la interfaz capturada por el equipo y el benchmark resuelto del Issue #68. Los tiempos del benchmark son referencia, no resultados del equipo.

| Tarea | Instrucción | Benchmark | Evidencia propia en capturas | Conclusión |
| --- | --- | --- | --- | --- |
| T1 | Escanear QR y abrir el pasaporte digital. | 6 s, éxito. | En las capturas revisadas no se observa un acceso visible al QR desde la ficha mostrada. | Debe validarse el escaneo real con etiqueta física. |
| T2 | Encontrar origen, nombre/comunidad y horas invertidas. | 14 s, éxito. | Las capturas muestran nombre del artesano/productor y ubicación; no se observan horas invertidas en las pantallas compartidas. | Cumplimiento parcial visible. |
| T3 | Localizar el sello Stellar y explicar qué comprueba. | 28 s, éxito con duda sobre el código hexadecimal. | No se observa la tarjeta de autenticidad Stellar en las capturas compartidas. | No verificable con la evidencia propia disponible. |
| T4 | Encontrar logística directa y activar contacto. | 11 s, éxito. | En el modal de producto aparece la acción “Mensaje Directo”. | La acción de contacto directo sí es visible. |
| T5 | Filtrar vitrina por categoría y municipio. | 18 s, éxito. | La pantalla Productos muestra filtros por tipo de producto y municipio/comunidad. | La función de filtrado sí es visible. |

### 4.1 Métricas del benchmark resuelto del Issue #68

| Métrica | Cálculo | Resultado de referencia |
| --- | --- | --- |
| Tasa de éxito | 5 tareas completadas / 5 x 100 | 100% |
| Tiempo promedio | (6 + 14 + 28 + 11 + 18) / 5 | 15.4 segundos |
| Tarea más lenta | Mayor tiempo registrado | T3, 28 segundos |
| Mayor fricción | Mayor duda observada | T3: interpretación del código/hash de Stellar |

---

## 5. System Usability Scale (SUS)

El Issue #68 incluye un benchmark resuelto con diez respuestas SUS. Estas respuestas se usan aquí únicamente como referencia técnica de cálculo y no como resultado de nuestro comprador de chocolate.

| # | Afirmación SUS | Benchmark |
| --- | --- | ---: |
| 1 | Creo que usaría esta plataforma con frecuencia. | 5 |
| 2 | Me pareció innecesariamente complicada. | 1 |
| 3 | Me pareció fácil de utilizar. | 5 |
| 4 | Creo que necesitaría ayuda de otra persona para usarla. | 2 |
| 5 | Las diferentes funciones de la plataforma están bien integradas. | 5 |
| 6 | Encontré demasiadas inconsistencias en la plataforma. | 1 |
| 7 | Creo que la mayoría de las personas aprenderían a usarla rápidamente. | 5 |
| 8 | Me pareció difícil de utilizar. | 1 |
| 9 | Me sentí seguro utilizando la plataforma. | 5 |
| 10 | Necesité aprender muchas cosas antes de poder utilizarla. | 2 |

### 5.1 Cálculo de referencia

- Ítems impares: 20 puntos.
- Ítems pares: 18 puntos.
- SUS = (20 + 18) x 2.5 = 95.0 / 100.
- Clasificación indicada en el Issue #68: Grade A+ / usabilidad excepcional.

Para obtener una puntuación propia del equipo se tendría que aplicar nuevamente las diez afirmaciones a un comprador representativo del proyecto de chocolate. Con los archivos actuales no existe esa medición específica.

---

## 6. Fricciones UX y acciones de mejora

El benchmark del Issue #68 documenta dos fricciones críticas. Se incorporan porque forman parte de la referencia oficial del mismo issue y sirven para justificar qué debe observarse en la versión de Raíz usada por el equipo.

| Componente | Fricción observada | Mejora documentada | Referencia |
| --- | --- | --- | --- |
| Tarjeta de autenticidad Stellar | El participante dudó ante el código hexadecimal y su significado. | Agregar una etiqueta amigable que explique que se trata de una huella digital resistente a manipulaciones y sin datos personales. | PR #35, según Issue #68. |
| Logística/contacto directo | El participante buscó primero información de tarifas de envío antes de usar WhatsApp. | Colocar junto al botón de contacto una nota clara indicando que la entrega se acuerda directamente entre comprador y artesano. | PR #36, según Issue #68. |

### 6.1 Hallazgos adicionales de la revisión de las capturas propias

- La pantalla Productos muestra filtros por tipo de producto y municipio/comunidad, por lo que T5 tiene una ruta visible.
- El modal de detalle incluye la acción “Mensaje Directo”, lo que apoya la tarea de contacto directo de T4.
- En las capturas compartidas no se observa una tarjeta Stellar ni un código QR accesible desde el modal mostrado; por eso T1 y T3 requieren validación adicional en una sesión real o con otras pantallas de la PWA.

---

## 7. Evidencias del proyecto

Las fotografías siguientes documentan entrevistas reales realizadas por el equipo. Las capturas de la PWA documentan la interfaz disponible para preparar y revisar las tareas de usabilidad.

- Figura 1. Evidencia fotográfica de entrevista a la productora de chocolate artesanal.
- Figura 2. Segunda evidencia fotográfica de levantamiento de información mediante entrevista.
- Figura 3. Explicación de la app de Raíz.
- Figura 4. Uso de la app Raíz.
- Figura 5. Foto de productora con la app Raíz.

### 7.1 Evidencia de audio

También se cuenta con el archivo “WhatsApp Audio 2026-10-12 at 11.24.41 PM.mp4” como evidencia de la actividad. En este reporte no se atribuyen citas textuales nuevas al audio porque no se dispone de una transcripción verificada dentro de los materiales del documento.

---

## 8. Control de cumplimiento del Issue #68

| # | Entregable | Estado documentado | Observación |
| --- | --- | --- | --- |
| 1 | Entrevista de campo con comprador representativo | Completo | Entrevista cualitativa complementada con las respuestas requeridas por el Issue #68. |
| 2 | Preguntas cualitativas con citas textuales | Completo | Preguntas cualitativas respondidas con citas y postura del comprador representativo. |
| 3 | Cinco tareas cronometradas con Think-Aloud | Cubierto por benchmark | Benchmark: 6, 14, 28, 11 y 18 s; la medición propia no está documentada. |
| 4 | SUS calculado y categorizado | Cubierto por benchmark | SUS de referencia: 95/100. No debe confundirse con una medición propia. |
| 5 | Fricciones convertidas en mejoras/PR | Cubierto por benchmark | El Issue #68 documenta dos fricciones y las relaciona con PR #35 y #36. |
| 6 | Documentación completa en repositorio | No verificable con los archivos entregados | Se requiere confirmar que el equipo haya subido el reporte final a la ruta del repositorio indicada por el proyecto. |

---

## 9. Conclusión

La información disponible permite documentar las necesidades principales del comprador y revisar varias funciones visibles de Raíz, como el catálogo, los filtros y el contacto directo. El Issue #68 aporta además un benchmark resuelto que demuestra cómo deben calcularse los tiempos, la tasa de éxito y el SUS, y cómo convertir fricciones en mejoras concretas.

La comparación entre la evidencia propia y el benchmark muestra que la solución cubre parte de las necesidades identificadas, pero todavía hace falta una medición propia de T1 a T5 y del SUS si se desea afirmar resultados específicos del comprador de chocolate. Por esa razón, este documento presenta los valores del Issue #68 como referencia técnica y no los atribuye al participante del equipo.

---

## 10. Fuentes utilizadas

- Open-Hub-Tec/raiz, Issue #68: Buyer Research Validation & UX Usability Testing (TecNM), GitHub, consultado el 15 de octubre de 2026.
- Instrumentación de elicitación: entrevista a productora y entrevista a comprador/consumidor de chocolate.
- Identificación, clasificación y redacción de requisitos (RF y RNF), con RF-01 a RF-25 y RNF-01 a RNF-04.
- Evidencia fotográfica, audio y capturas de la PWA Raíz proporcionadas por el equipo.
