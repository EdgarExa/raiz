# 🎓 Guía para Estudiantes de Ingeniería del TecNM: Resolución de Issues en Yucu Protocol

Bienvenido/a al repositorio oficial de **Yucu Protocol** (`Open-Hub-Tec/yucu-protocol`). Este protocolo es una infraestructura Web3 pública y de código abierto construida sobre **Stellar & Soroban**, diseñada para proteger la propiedad intelectual de los artesanos indígenas y permitir la comercialización directa de café de especialidad de la Mixteca Oaxaqueña con 0% de intermediación.

Este documento establece el **proceso formativo y metodológico** para que los estudiantes residentes y tesistas del **Instituto Tecnológico de Tlaxiaco (TecNM)** resuelvan los issues técnicos de GitHub como parte de sus residencias profesionales.

---

## 🏛️ 1. Estructura de Brigadas de Estudiantes

Cada issue en GitHub está asignado a una brigada técnica específica de acuerdo con el perfil y especialidad del estudiante:

| Brigada Técnica | Área de Especialidad | Issues Asignados | Skills de Apoyo |
| :--- | :--- | :--- | :--- |
| **Brigada Soroban & Smart Contracts** | Rust, WebAssembly, Tipos XDR, Storage TTL | [**#75**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/75), [**#71**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/71) | `skills/student-soroban-contracts/SKILL.md` |
| **Brigada IA & Oráculos Acústicos** | TypeScript, Procesamiento de Audio, Consenso | [**#76**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/76), [**#40**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/40) | `skills/student-rwa-attestations/SKILL.md`, `skills/stellar-soroban-rwa/SKILL.md` |
| **Brigada Frontend & React SDK** | React, Tailwind, Hooks, Widgets Embebibles | [**#79**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/79), [**#74**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/74) | `skills/student-offline-pwa/SKILL.md` |
| **Brigada LegalTech & Bienes Culturales** | Regalías Perpetuas, Ley Indígena 2022, CPLI | [**#78**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/78) | `skills/student-rwa-attestations/SKILL.md` |
| **Brigada Sostenibilidad & DPP** | Pasaporte Digital UE ESPR 2026, Insetting Carbono | [**#77**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/77) | `skills/student-rwa-attestations/SKILL.md` |
| **Brigada Onboarding & Calidad** | Scaffolder CLI, QA, Pruebas Automatizadas | [**#80**](https://github.com/Open-Hub-Tec/yucu-protocol/issues/80) | `skills/student-git-collaboration/SKILL.md` |

---

## 🛠️ 2. Flujo de Trabajo Paso a Paso para Resolver un Issue

### Paso 1: Reclamar tu Asignación en GitHub
1. Ingresa a la pestaña de [Issues](https://github.com/Open-Hub-Tec/yucu-protocol/issues).
2. Selecciona el issue correspondiente a tu brigada.
3. Deja un comentario indicando tu nombre, número de control y la fecha estimada de entrega:
   > *"Hola, soy [Tu Nombre], estudiante de Ingeniería en Sistemas Computacionales del TecNM Campus Tlaxiaco. Tomo este issue para mi brigada técnica."*

### Paso 2: Estudiar la Skill Pedagógica
Antes de escribir una sola línea de código, abre y lee con detenimiento el archivo markdown correspondiente en la carpeta `/skills/`. Cada skill contiene los patrones de diseño, snippets de código probados y errores comunes que debes evitar.

### Paso 3: Configurar tu Rama de Trabajo (Git)
Crea una rama limpia a partir de `main`:
```bash
git checkout main
git pull origin main
git checkout -b feature/estudiante-<tu_nombre>-<tema_issue>
```
*Ejemplo:* `feature/estudiante-mariana-soroban-ttl`

### Paso 4: Implementar la Solución
* Si tu tarea involucra crear un nuevo módulo para una cooperativa o producto, utiliza el generador interactivo:
  ```bash
  npm run scaffold
  ```
* Marca en el issue de GitHub las casillas `- [ ]` que vayas completando.

### Paso 5: Validar Localmente (Testing Riguroso)
El protocolo cuenta con una suite de **88+ pruebas automatizadas**. Tu código no debe romper ninguna prueba existente y debe incluir pruebas para la nueva funcionalidad:
```bash
# Correr pruebas unitarias y de integración
npm test

# Verificar compilación TypeScript sin errores
npm run build
```

### Paso 6: Enviar tu Pull Request (PR)
Sube tu rama y crea el PR en GitHub:
```bash
git add .
git commit -m "feat(soroban): implementacion de ttl temporal para pesaje de café (Fixes #75)"
git push origin feature/estudiante-<tu_nombre>-<tema_issue>
```

En la descripción de tu Pull Request incluye:
1. **Número de issue resuelto** (`Fixes #75`, `Closes #76`, etc.).
2. **Resumen de la solución**: Qué hiciste y qué decisiones de diseño tomaste.
3. **Captura de pantalla o log de `npm test` exitoso**.
4. **Impacto para los productores de Tlaxiaco**.

---

## 📋 3. Criterios de Acreditación (Definition of Done)

Para que tu Pull Request sea aprobado por los revisores del Open-Hub y acreditado en tu reporte de Residencia Profesional:
1. **Funcionalidad Completa:** Resuelve todos los puntos del checklist del issue.
2. **Cero Advertencias:** Compilación limpia con `npm run build` y `cargo test` (si aplica).
3. **Cobertura de Pruebas:** Pruebas unitarias que validen casos normales y casos límite (ej. coordenadas inválidas, montos negativos).
4. **Respeto a la Identidad Cultural:** Toda interfaz y documentación debe honrar los nombres de las comunidades mixtecas y el principio de 0% comisión para intermediarios.
