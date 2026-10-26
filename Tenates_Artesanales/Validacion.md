# Ficha de Asignación: Estudiantes TecNM (Campus Tlaxiaco)

- **Brigada:** Frontend, Experiencia de Usuario (UX) & Comercio Justo
- **Skill Pedagógica:** `skills/student-offline-pwa/SKILL.md`
- **Nivel de Dificultad:** Intermedio
- **Tiempo Estimado:** 1 a 2 semanas

---

### 🌍 Contexto y Propósito en Yucu Protocol

Los productores de café de especialidad de Tlaxiaco, Oaxaca, necesitan establecer relaciones comerciales directas con compradores mayoristas de México, Europa y Estados Unidos, evitando intermediarios que reducen sus ganancias. Sin embargo, los compradores requieren mecanismos confiables para verificar el origen, la autenticidad y la trazabilidad de los productos antes de realizar una compra.

El proyecto **Yucu Protocol** busca facilitar el comercio justo mediante una plataforma digital que permita consultar certificados de origen respaldados por Soroban/Stellar, conocer la procedencia de los lotes y establecer acuerdos comerciales directamente entre productores y compradores.

La actividad consiste en diseñar y mejorar la experiencia de usuario del proceso de compra B2B, integrando un panel de pago transparente, un visor de autenticidad y opciones de divisa para operaciones nacionales e internacionales. La interfaz deberá ser intuitiva, accesible y adaptable a dispositivos móviles y computadoras.

---

### 📋 Checklist de Tareas a Resolver por el Estudiante:

- [ ] **Diseñar el panel de checkout B2B:** Crear una interfaz que permita al comprador consultar los detalles del lote de café, cantidad, precio, origen y desglose del pago antes de confirmar una operación.

- [ ] **Integrar el visor de Atestación de Origen:** Mostrar la información verificable del lote, incluyendo coordenadas GPS autorizadas, firma acústica del productor, hash de atestación y sello de verificación Soroban.

- [ ] **Implementar el selector de divisa dual:** Permitir visualizar las opciones MXNe/SPEI para el productor en Oaxaca y USDC/Stellar para compradores internacionales, diferenciando las divisas de los métodos de transferencia.

- [ ] **Mostrar la distribución transparente del pago:** Presentar claramente el porcentaje correspondiente al productor (98%) y al fondo comunitario Tequio (2%), conforme a la configuración del protocolo.

- [ ] **Garantizar accesibilidad y diseño responsivo:** Aplicar los criterios WCAG 2.1 AA, asegurando legibilidad, contraste adecuado, navegación mediante teclado y adaptación a dispositivos móviles y de escritorio.

- [ ] **Realizar pruebas de usabilidad:** Simular la compra de un micro-lote de Café Pluma/Typica de 50 kg, evaluando la facilidad de navegación, comprensión del certificado y claridad del proceso de pago.

- [ ] **Documentar los resultados:** Registrar los errores, dificultades, tiempos de interacción y mejoras propuestas para optimizar la experiencia del comprador.

---

### 📂 Archivos Clave de Trabajo:

- `src/components/BuyerFlowModal.tsx` — Interfaz del proceso de compra B2B y visualización del desglose de pago.
- `src/components/YucuPassportBadge.tsx` — Componente visual del certificado de origen y sello de autenticidad.
- `src/core/hooks/useYucuProtocol.ts` — Hook para consultar e integrar información del protocolo Yucu.
- `src/App.tsx` — Integración de componentes y navegación principal.
- `src/config/protocolFees.ts` — Configuración de los porcentajes de distribución de pagos.

---

### 🧪 Comandos de Validación:

**Ejecutar la aplicación en desarrollo:**

```bash
npm run dev
```

**Verificar que el proyecto compile correctamente:**

```bash
npm run build
```

**Ejecutar las pruebas automatizadas configuradas:**

```bash
npm test
```

**Verificar los cambios realizados:**

```bash
git status
```

**Crear la rama de trabajo:**

```bash
git checkout -b feature/estudiante-buyer-ux
```

---

### ✅ Criterios de Aceptación (Definition of Done):

- [ ] El comprador puede consultar el hash de atestación, la firma acústica y el sello Soroban en menos de 3 clics.

- [ ] El panel de checkout presenta claramente la información del micro-lote de Café Pluma/Typica de 50 kg, incluyendo cantidad, precio y origen.

- [ ] La interfaz muestra de manera transparente la distribución del pago: **98% al productor y 2% al fondo comunitario Tequio**, conforme a `src/config/protocolFees.ts`.

- [ ] El selector de divisa permite consultar las opciones MXNe/SPEI y USDC/Stellar sin generar confusión sobre los importes y métodos de pago.

- [ ] Las coordenadas GPS y los datos del productor se muestran únicamente cuando existe autorización para su publicación.

- [ ] El diseño cumple con los criterios aplicables de accesibilidad WCAG 2.1 AA y funciona correctamente en dispositivos móviles y computadoras.

- [ ] Se completó una simulación del proceso de compra de 50 kg de Café Pluma/Typica sin realizar transacciones financieras reales.

- [ ] Se documentaron los resultados de las pruebas de usabilidad y las mejoras implementadas.

- [ ] Los comandos `npm run build` y `npm test` finalizan correctamente, siempre que las pruebas estén configuradas en el proyecto.

- [ ] Se envió un Pull Request desde la rama `feature/estudiante-buyer-ux`, cumpliendo las guías de diseño y desarrollo del repositorio.
