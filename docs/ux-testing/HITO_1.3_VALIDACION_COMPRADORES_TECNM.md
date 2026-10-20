# 🛍️ Buyer Research Validation & UX Usability Testing (TecNM)

**Repositorio:** `Open-Hub-Tec/raiz`  
**Institución:** Instituto Tecnológico de Tlaxiaco (TecNM) – Carrera de Ingeniería en Sistemas Computacionales  
**Asignatura / Proyecto:** Buyer-side validation + UX usability testing  
**Issue asociada:** `#68`  
**Estado:** Documento base para completar con evidencia de campo y resultados finales

---

## 1. Objetivo

Esta investigación valida la percepción del comprador respecto a la autenticidad, la disposición a pagar por productos Mixtecos verificados, la confianza en el modelo directo sin comisión, la estrategia de zero-PII en Stellar y la usabilidad del flujo móvil de Raíz.

El documento se alinea con los objetivos del issue #68 y sirve como base para la validación de mercado, ética de compra y prueba de usabilidad con el enfoque Think-Aloud.

---

## 2. Equipo, muestra y metodología

### Equipo de investigación
- **Ingeniería Brigade:** Estudiantes de 5º semestre, Grupo B, TecNM Tlaxiaco
- **Población objetivo:** Specialty café owners, baristas, coleccionistas de textiles y consumidores éticos
- **Ubicaciones:** Tlaxiaco, Oaxaca de Juárez y Huajuapan
- **Dispositivo utilizado:** Smartphone con la PWA de Raíz (`DigitalPassportScreen.tsx` y `BuyerShowcaseScreen.tsx`)
- **Instrumento principal:** QR hang-tag físico + Think-Aloud protocol

### Objetivos de validación
1. Validar willingness-to-pay y motivación de compra auténtica.
2. Validar comprensión del modelo directo de Raíz (0% comisión / sin plataforma intermedia).
3. Evaluar confianza en la estrategia de zero-PII sobre Stellar.
4. Medir usabilidad móvil en 5 tareas core.

---

## 3. Guion de entrevista cualitativa

### Preguntas de descubrimiento
1. ¿Qué motiva a comprar textiles Mixtecos o café de origen auténtico frente a alternativas industriales?
2. ¿Ha experimentado fraude, plagio o reventa comercial no autorizada?
3. ¿La prueba matemática de autenticidad (hash SHA-256 en Stellar sin almacenar PII) genera mayor confianza?
4. ¿Le parece más transparente y ético el contacto directo con el productor por WhatsApp y sin intermediaros?
5. ¿Cómo percibe que el artesano decida mostrar solo su nombre, comunidad o nombre de cooperativa?

### Registro de respuestas
- [Agregar transcripciones breves o citas textuales]
- [Agregar patrones cualitativos por tema]
- [Agregar observaciones de confianza, ética y percepción de riesgo]

---

## 4. Protocolo de usabilidad de 5 tareas

### Tareas observadas
| ID | Tarea | Objetivo | Tiempo objetivo |
| --- | --- | --- | --- |
| T1 | Escanear QR y abrir pasaporte digital | Verificar flujo de entrada y validación | [registrar] |
| T2 | Identificar origen, nombre de artesano/comunidad y horas invertidas | Comprobar comprensión del contexto cultural | [registrar] |
| T3 | Revisar sello de autenticidad en Stellar | Evaluar comprensión del hash y la prueba criptográfica | [registrar] |
| T4 | Localizar aviso de logística directa y activar contacto | Validar claridad del modelo directo | [registrar] |
| T5 | Navegar showcase y filtrar por categoría y municipio | Evaluar descubribilidad del catálogo | [registrar] |

### Métrica recomendada
- Tiempo en tarea
- Tasa de éxito
- Errores por tarea
- Comentarios verbalizados
- Nivel de confianza del participante

### Formularios de registro
- [Agregar tabla de tiempos por participante]
- [Agregar campo de éxito/fracaso]
- [Agregar observaciones de fricción]

---

## 5. Sistema de evaluación SUS

Se propone evaluar 10 afirmaciones usando escala 1–5.

- Ítems impares: `Score = rating - 1`
- Ítems pares: `Score = 5 - rating`
- Total SUS: `(sumatoria de los 10 scores) * 2.5`

### Plantilla de cálculo
| Item | Rating | Score |
| --- | ---: | ---: |
| Q1 |  |  |
| Q2 |  |  |
| Q3 |  |  |
| Q4 |  |  |
| Q5 |  |  |
| Q6 |  |  |
| Q7 |  |  |
| Q8 |  |  |
| Q9 |  |  |
| Q10 |  |  |

**Total SUS:** [calcular]  
**Interpretación:** [A / B / C / D / F]  
**Observaciones:** [agregar]

---

## 6. Benchmark de referencia (campo #01)

### Participante
- [Nombre]
- [Edad]
- [Perfil profesional / consumidor / coleccionista]
- [Ubicación]
- [Fecha]

### Citas relevantes
> "[Agregar cita textual del participante]"

### Resultados de usabilidad
| # | Tarea | Tiempo | Resultado | Observaciones |
| --- | --- | ---: | --- | --- |
| T1 |  |  |  |  |
| T2 |  |  |  |  |
| T3 |  |  |  |  |
| T4 |  |  |  |  |
| T5 |  |  |  |  |

### WTP / disposición a pagar
- [Monto sugerido por kg de café]
- [Monto sugerido por huipil / textil]
- [Justificación cualitativa]

---

## 7. Hallazgos de fricción crítica y soluciones propuestas

### Fricción 1: claridad del hash criptográfico
**Componente:** `DigitalPassportScreen.tsx`  
**Hallazgo:** [describir problema observado]  
**Cita del participante:** "[agregar cita]"  
**Respuesta propuesta:** [explicar acción de mejora]

### Fricción 2: claridad del modelo directo de logística
**Componente:** `BuyerShowcaseScreen.tsx` / `ProductDetailModal.tsx`  
**Hallazgo:** [describir problema observado]  
**Cita del participante:** "[agregar cita]"  
**Respuesta propuesta:** [explicar acción de mejora]

### Fricción 3: comprensión de la identidad visible del artesano
**Componente:** [pantalla correspondiente]  
**Hallazgo:** [describir problema observado]  
**Cita del participante:** "[agregar cita]"  
**Respuesta propuesta:** [explicar acción de mejora]

---

## 8. Evidencias a adjuntar

Se recomienda incluir los siguientes materiales antes de cerrar el PR:

- [ ] Registro de entrevistas con notas de campo
- [ ] Capturas de pantalla del flujo móvil
- [ ] Evidencia del QR hang-tag funcionando
- [ ] Video o audio de la sesión Think-Aloud
- [ ] Tabla de tiempos y métricas SUS
- [ ] Documento PDF o imagen del benchmark de referencia
- [ ] Citas textuales relevantes para validación cualitativa

### Espacio para anexar referencias
- [Agregar enlace a PDF]
- [Agregar enlace a imágenes]
- [Agregar enlace a grabaciones]

---

## 9. Criterio de cierre / definición de done

- [ ] Entrevista de compra realizada con segmento objetivo.
- [ ] Preguntas cualitativas registradas y analizadas.
- [ ] 5 tareas de usabilidad ejecutadas y cronometradas.
- [ ] SUS calculado y interpretado.
- [ ] Hallazgos de fricción documentados.
- [ ] Evidencias adjuntadas en la carpeta `docs/ux-testing/`.
- [ ] PR finalizado con la referencia al issue #68.

---

## 10. Referencia del issue

**Issue #68**: Buyer Research Validation & UX Usability Testing (TecNM)

Este documento se usa como evidencia del trabajo de validación del comprador y del análisis de usabilidad realizado para la experiencia de compra en Raíz.
