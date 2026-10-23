---
name: student-git-collaboration
description: Guía de colaboración en GitHub, Drips Network y flujo de Pull Requests para estudiantes de residencias profesionales del TecNM en Yucu Protocol.
---

# 🐙 Skill TecNM: Colaboración en GitHub y Financiamiento Drips

Esta guía establece el estándar de ingeniería para que los estudiantes del TecNM contribuyan al repositorio `Open-Hub-Tec/yucu`, documenten sus avances y reciban reconocimiento y fondos comunitarios a través de **Drips Network** en Stellar.

---

## 1. Convención de Commits Semánticos

Cada commit debe iniciar con un prefijo claro:

* `feat:` Nueva funcionalidad (ej. `feat(escrow): agregar hito de entrega de miel`)
* `fix:` Corrección de error (ej. `fix(qr): corregir margen de impresión en papel kraft`)
* `docs:` Cambios en documentación o guías estudiantiles
* `test:` Adición o mejora de pruebas unitarias (`npm test`)

---

## 2. El Filtro de Calidad Obligatorio (`npm run verify`)

Antes de enviar cualquier Pull Request a `main`, el estudiante debe correr en su terminal:

```bash
npm run verify
```

Este comando ejecuta en secuencia:
1. `npm run lint` (verificación de tipos de TypeScript sin errores).
2. `npm run test` (las 7 suites de pruebas del protocolo, criptografía y contratos).
3. `npm run build` (compilación exitosa del bundle de producción y servidor).

---

## 3. Vincular el Trabajo con Drips Network

1. Cada Pull Request debe vincular el Issue correspondiente (ej. `Closes #14`).
2. Al fusionarse en la rama principal, el contrato de Drips Network registra la autoría comunitaria del estudiante para asignación de becas de investigación y fondos de desarrollo de la Stellar Development Foundation.
