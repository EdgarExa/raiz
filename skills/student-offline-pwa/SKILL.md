---
name: student-offline-pwa
description: Guía de arquitectura frontend rural Offline-First y diseño accesible "Modo Abuelo" (112px, zero-typing, zero-seed) para estudiantes del TecNM en trabajo de campo en la Mixteca.
---

# 📱 Skill TecNM: Arquitectura Rural Offline-First ("Modo Abuelo")

Las aplicaciones urbanas fallan en la montaña porque asumen conectividad 4G permanente y usuarios familiarizados con contraseñas complejas. Esta guía define los principios de ingeniería rural que aplicamos en el Open Hub TecNM.

---

## 1. El Patrón "Outbox" en IndexedDB

Cuando el campesino está en su parcela en Yucuhiti o Tijaltepec, **no hay señal**. La aplicación nunca debe bloquearse ni mostrar pantallas de error:

1. **Almacenamiento Local Inmediato:** El registro de cosecha, el audio y la foto se guardan en el IndexedDB del navegador.
2. **Cola de Salida (Outbox):** Se le asigna un estado `PENDIENTE_DE_SINCRONIZAR`.
3. **Sincronización Transparente:** Un listener `window.addEventListener('online', ...)` detecta cuándo el productor llega a la cabecera municipal (Tlaxiaco) y sube los lotes en segundo plano sin intervención del usuario.

---

## 2. Los 3 Principios de Diseño Táctil ("Modo Abuelo")

* **Botones Gigantes de 112px:** Diseñados para dedos callosos por el trabajo de campo y personas de la tercera edad con vista cansada.
* **Cero Tecleo (Zero-Typing):** Toda la interacción se realiza mediante voz o selección visual de iconos (grano, mazorca, miel, telar).
* **Cero Frases Semilla (Zero-Seed Phrase):** La billetera Stellar se deriva matemáticamente a partir del número de teléfono o un carnet QR físico que el productor guarda en su cartera. El campesino nunca tiene que anotar 24 palabras en inglés.
