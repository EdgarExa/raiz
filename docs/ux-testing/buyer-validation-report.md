# Reporte de Validación y Entrevistas a Compradores Potenciales — Raíz Protocol

## 1. Metodología y Alcance
* **Instrumento:** Entrevista semiestructurada aplicada a unidades de análisis representativas (6 perfiles de compradores en Tlaxiaco, Oaxaca de Juárez, Huajuapan, San Juan Ñumí y Puebla).
* **Objetivo:** Reconocer hábitos de compra, categorías preferidas (textiles, palma, alfarería, miel, café, alimentos y decoración), fricciones en plataformas actuales y funcionalidades prioritarias para el desarrollo de la aplicación móvil de Raíz.

---

## 2. Síntesis Comparativa de Perfiles de Compradores
Se contrastaron las necesidades de 6 perfiles de compradores representativos de la región Mixteca y zonas de influencia:

| Código | Edad | Residencia | Interés Principal | Prioridad Declarada |
| :--- | :---: | :--- | :--- | :--- |
| **Comprador 1** | 29 | Tlaxiaco | Textiles, miel | Catálogo y carrito |
| **Comprador 2** | 41 | Oaxaca de Juárez | Café, alimentos | Entrega y pagos |
| **Comprador 3** | 22 | Huajuapan | Accesorios, palma | Favoritos y filtros |
| **Comprador 4** | 55 | San Juan Ñumí | Miel, cerámica | Facilidad de uso |
| **Comprador 5** | 35 | Puebla | Textiles, decoración | Autenticidad y envíos |
| **Comprador 6** | 47 | Tlaxiaco | Alimentos, miel | Confianza y atención |

---

## 3. Tabulación de Necesidades Detectadas (Frecuencias)
A partir del análisis cruzado de las respuestas, se identificaron los requerimientos con mayor demanda entre los perfiles:

| Necesidad Detectada | Menciones (sobre 6 perfiles) | Interpretación / Hallazgo |
| :--- | :---: | :--- |
| **Catálogo claro y fotografías** | 6 / 6 | Requisito básico de navegación y contenido visual sin filtros exagerados. |
| **Precios y costos de entrega visibles** | 5 / 6 | Evita el abandono de pedidos por costos ocultos o sorpresa al final. |
| **Confianza en productor y autenticidad** | 5 / 6 | Demanda perfiles verificables y procedencia cultural clara (comunidad de origen). |
| **Opciones de entrega** | 4 / 6 | Necesidad de pactar puntos de entrega o envíos según la zona y fragilidad. |
| **Búsqueda por categorías o filtros** | 4 / 6 | Facilita encontrar productos específicos rápidamente sin buscar en redes sociales. |
| **Compra o solicitud de pedido simple** | 4 / 6 | Reducir pasos, confusión y permitir carritos o solicitudes directas. |
| **Atención y seguimiento de pedidos** | 3 / 6 | Mejorar la experiencia poscompra con confirmaciones y canales de contacto. |

---

## 4. Traducción en Requisitos Funcionales y No Funcionales para la App
Basado en la validación directa con los compradores, se establecieron las especificaciones técnicas para el desarrollo en el repositorio:

* **RF-01:** Mostrar catálogo por categorías: textiles, palma, cerámica, miel, café, alimentos, accesorios y decoración *(Prioridad: Alta)*.
* **RF-02:** Consultar ficha con fotografías, precio, medidas o ingredientes, procedencia y existencias *(Prioridad: Alta)*.
* **RF-03:** Buscar y filtrar por categoría, precio, comunidad y disponibilidad *(Prioridad: Alta)*.
* **RF-04:** Permitir carrito o solicitud de pedido, con resumen previo a confirmar *(Prioridad: Alta)*.
* **RF-05:** Mostrar opciones de entrega, costos y fecha aproximada antes de confirmar *(Prioridad: Alta)*.
* **RF-06:** Permitir ver estado e historial de pedidos *(Prioridad: Media)*.
* **RF-07:** Proporcionar perfil del productor sin exponer datos sensibles *(Prioridad: Alta)*.
* **RF-08:** Permitir favoritos y reseñas verificables *(Prioridad: Media)*.
* **RNF-01:** Interfaz adaptable a teléfono y comprensible para usuarios con distinta experiencia digital *(Prioridad: Alta)*.
* **RNF-02:** Proteger datos y ofrecer métodos de pago mediante servicios seguros *(Prioridad: Alta)*.
