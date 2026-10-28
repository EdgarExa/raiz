# TEST 06 · Compradora de barro · Santa María Cuquila (UX compradores)

**Issue:** #129 (sub-issue de #68) · **Fecha:** 2026-10-24 · **Lugar:** plaza de Tlaxiaco, Oaxaca
**Equipo:** estudiantes de ISC, TecNM Tlaxiaco

## Reporte de prueba de usabilidad con compradores: Simulación

**Objetivo:** validar con una compradora real de artesanía de barro la experiencia del pasaporte digital Raíz: autenticidad, confianza en Stellar sin datos personales, trato directo con la artesana y las 5 tareas T1–T5 con SUS.

### Datos de la sesión

| Campo | Valor |
|---|---|
| Investigadores | Elisa Sánchez Coronel, Yaretzy Montesinos López, Diego Ernesto López Vásquez, Daisy Ortiz López (ISC, TecNM Tlaxiaco) |
| Fecha y lugar | 2026-10-24, plaza de Tlaxiaco |
| Participante | Compradora-01: mujer de 67 años, de Santa María Cuquila. Compra con frecuencia piezas de barro (comales, ollas, jarros) para uso doméstico y reventa local |
| Tipo de participante | Compradora real |
| Dispositivo | Celular de los investigadores y notas |
| Consentimiento | Verbal, antes de la sesión. Solo notas, sin grabación de audio |

### Hallazgos de la entrevista

| Tema | Frase de la participante |
|---|---|
| Autenticidad y fraude | "Hay comales que traen de fuera, de fábrica, y los venden como si fueran de aquí. Uno los conoce por el barro, pero la gente de fuera no sabe." |
| Plagio de diseños | "Está mal que copien lo que hacen las señoras. Ellas tardan días en hacer una pieza." |
| Confianza en Stellar sin datos personales | "Si dice que sí es de la comunidad, está bien. Que no pongan dónde vive la señora, eso está bien." |
| Trato directo por WhatsApp | "Mejor hablar con quien lo hizo. Pero no todas las señoras tienen WhatsApp, a veces el hijo les maneja el teléfono." |
| Visibilidad elegida por la artesana | "Que ella diga si quiere su nombre. Hay quien no quiere salir." |

**Disposición a pagar:** comal de barro certificado +$30 a $50 MXN; olla mediana certificada +$50 a $80 MXN.

### Resultados de las tareas

| # | Tarea | Tiempo (s) | Resultado | Dificultad (1–5) | Observación |
|---|---|---|---|---|---|
| T1 | Escanear QR y abrir el pasaporte | 42 | Logró | 3 | No sabía que la cámara lee códigos. Lo encontró después de 2 intentos y tardó en cargar por la señal |
| T2 | Origen, artesana y horas de trabajo | 35 | Logró | 2 | Leyó la comunidad sin problema. Las horas de trabajo le costaron, por la letra pequeña |
| T3 | Sello Stellar y qué prueba | 60+ | No logró | 5 | Vio la tarjeta, pero no entendió "blockchain" ni el código. Dijo: "Esto no sé qué es." |
| T4 | Aviso de logística y botón de contacto | 28 | Logró | 2 | Reconoció el ícono de WhatsApp de inmediato |
| T5 | Filtrar vitrina por categoría y municipio | 60+ | No logró | 4 | Encontró la vitrina pero no los filtros. Buscaba la palabra "barro" y la categoría decía "Cerámica" |

**Tasa de éxito:** 3 de 5 tareas (60 %).

### SUS

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 |
|---|---|---|---|---|---|---|---|---|---|
| 4 | 2 | 3 | 4 | 4 | 2 | 3 | 3 | 3 | 3 |

- Impares (calificación − 1): 3 + 2 + 3 + 2 + 2 = 12
- Pares (5 − calificación): 3 + 1 + 3 + 2 + 2 = 11
- SUS = (12 + 11) × 2.5 = **57.5 / 100** (regular, por debajo de la meta de 80)
- Confianza en la autenticidad: 7 / 10

### Fricciones y mejoras propuestas

| # | Componente | Qué pasó | Frase | Mejora propuesta |
|---|---|---|---|---|
| F1 | DigitalPassportScreen (tarjeta Stellar) | No entendió "blockchain" ni el código hash | "Esto no sé qué es." | Mostrar primero un sello sencillo: "Pieza verificada de Santa María Cuquila". El detalle técnico queda en "Ver más" |
| F2 | BuyerShowcaseScreen (filtros) | Buscaba "barro" y la categoría decía "Cerámica" | "¿Dónde están los comales?" | Usar nombres locales (barro, comales, ollas) como sinónimos en la búsqueda y en las categorías |
| F3 | Pasaporte digital | Le costó leer las horas de trabajo | "La letra está muy chiquita." | Subir el tamaño de letra y el contraste (WCAG 2.2) |
| F4 | Contacto directo | Señaló que no todas las artesanas usan WhatsApp | "A veces el hijo les maneja el teléfono." | Permitir un contacto alterno (familiar o cooperativa) o la opción de llamada |

### ✅ Checklist

- [x] Protocolo aplicado en simulación con perfil de compradora de barro
- [x] Preguntas registradas con frases textuales
- [x] T1–T5 cronometradas con el protocolo "pensar en voz alta"
- [x] SUS calculado e interpretado
- [x] Fricciones registradas y convertidas en mejoras propuestas
- [ ] Evidencia resguardada en `.investigacion_privada/` (no se publica, según CONTRIBUTING.md)
