---
name: student-rwa-attestations
description: Guía pedagógica para estudiantes del TecNM Tlaxiaco sobre cómo diseñar y emitir Atestaciones RWA (Activos del Mundo Real), hash canónico SHA-256 y etiquetas Hang-Tag QR para café, miel y textiles de la Mixteca.
---

# 🌾 Skill TecNM: Creación de Atestaciones Físicas y Oráculos de Campo

Esta guía enseña a los estudiantes de Sistemas Computacionales cómo convertir un producto físico agrícola o artesanal en un activo criptográfico inmutable en Stellar Soroban.

---

## 1. La Fórmula del "Community Digest" SHA-256

Para evitar que intermediarios alteren el peso o procedencia de un saco de café, el estudiante debe programar la función de hashing canónico determinista:

```typescript
import crypto from 'crypto';

export function calcularDigestLote(params: {
  folio: string;          // ej. "MX-2024-884"
  productorId: string;    // Billetera Stellar del productor
  comunidad: string;      // ej. "Santa María Yucuhiti"
  kilos: number;          // ej. 120
  humedadPorcentaje: number; // ej. 11.2%
}): string {
  // Orden estricto de campos para garantizar reproducibilidad matemática
  const cargaCanonico = [
    params.folio.toUpperCase().trim(),
    params.productorId.trim(),
    params.comunidad.trim(),
    params.kilos.toFixed(2),
    params.humedadPorcentaje.toFixed(2),
  ].join('|');

  return crypto.createHash('sha256').update(cargaCanonico).digest('hex');
}
```

---

## 2. Los 3 Oráculos que Conectan el Campo con Soroban

1. **Oráculo de Voz en Tu'un Savi:**
   * Utiliza la API de audio multimodal para transcribir el relato oral del campesino grabado en la parcela.
   * Extrae automáticamente kilos, variedad y comunidad.
2. **Oráculo Óptico de Calidad SCAA:**
   * Evalúa la fotografía de la muestra sobre fondo blanco o jícara tradicional.
   * Clasifica granos con broca, vanos o fermentados, estimando el puntaje de catación (>85 puntos).
3. **Oráculo Satelital Anti-Deforestación (EUDR):**
   * Cruza las coordenadas del cafetal con el satélite Copernicus Sentinel-2 de la Agencia Espacial Europea (ESA).
   * Genera el certificado de cero tala forestal posterior a diciembre de 2020 exigido por la Unión Europea.

---

## 3. Generación de la Etiqueta Física Hang-Tag QR

El código QR no almacena datos pesados, sino el enlace canónico GS1 Digital Link:
`https://yucu.tecnm.mx/01/0750100000001/10/MX-2024-884`

Al escanearse en el puerto de Hamburgo o en una cafetería en Ciudad de México, el enlace consulta el contrato Soroban y despliega la atestación de origen verificada con la firma del TecNM.
