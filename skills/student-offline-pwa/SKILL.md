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
3. **Sincronización al volver la señal:** Un listener `window.addEventListener('online', ...)` detecta cuándo el productor llega a la cabecera municipal (Tlaxiaco). Los datos sí pueden subirse solos, pero **el registro en la cadena no**: cada transacción la firma la persona en su teléfono con su PIN (patrón preparar → firmar → enviar, ADR-003). La app le avisa "Tienes 2 lotes por confirmar" y ella firma. Ver #99 [W9].

---

## 2. Los 3 Principios de Diseño Táctil ("Modo Abuelo")

* **Botones Gigantes de 112px:** Diseñados para dedos callosos por el trabajo de campo y personas de la tercera edad con vista cansada.
* **Cero Tecleo (Zero-Typing):** Toda la interacción se realiza mediante voz o selección visual de iconos (grano, mazorca, miel, telar).
* **Cero Frases Semilla (Zero-Seed Phrase):** La persona nunca anota 24 palabras. Su llave se genera **al azar en su propio celular**, cifrada con un PIN, o va cifrada en su tarjeta QR si no tiene celular ([ADR-004](../../docs/adr/ADR-004-PAGOS-EN-PESOS-SIN-BILLETERA.md), D4; issues #91 y #117).
  * **Nunca derives la llave del número de teléfono, de la CURP ni de otro dato conocido:** cualquiera que sepa el número podría calcular la llave y vaciar la cuenta. El servidor nunca genera ni guarda llaves de usuarios (ADR-003).
