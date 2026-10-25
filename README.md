# 🛡️ CommunityLab
### Motor Inteligente de Transformación y Distribución para Comunidades Digitales

> **Hackathon ONE G10 · Oracle Next Education & Alura · Octubre 2026**  
> **Equipo 36**  
> *"La IA propone · El humano decide · OCI guarda solo lo aprobado."*

---

## 📌 ¿Qué es CommunityLab?

**CommunityLab** transforma la actividad orgánica de una comunidad digital (testimonios, dudas, logros dispersos en canales como Discord) en activos de marketing listos para distribución — de forma automatizada, con curación humana obligatoria y persistencia en la nube de Oracle.

---

## 🎯 Pilares del Sistema

1. **🤖 Ingesta y Generación Inteligente (n8n + Groq LLM):**
   - Recibe interacciones por webhook o lotes JSON.
   - Analiza el sentimiento, extrae temas clave y calcula un scoring determinístico.
   - Genera automáticamente 3 formatos de marketing:
     - 📢 **Post de LinkedIn** (historias y testimonios).
     - 💡 **FAQ Dinámico** (solución a dudas técnicas recurrentes).
     - 📰 **Newsletter Semanal** (destacados y logros comunitarios).

2. **👨‍💻 Curaduría Humana Obligatoria (*Human-in-the-Loop*):**
   - Estación de trabajo interactiva en **Streamlit** conectada a **Google Sheets**.
   - Los curadores pueden revisar la sugerencia de la IA, editar el copy en línea y decidir si **Aprobar** o **Rechazar**.
   - Ningún activo se publica ni se sube a la nube sin el consentimiento explícito del curador humano.

3. **☁️ Persistencia Cloud (Oracle Cloud Infrastructure - OCI):**
   - Integración con **OCI Object Storage Always Free** mediante solicitudes HTTP PUT autenticadas por **Pre-Authenticated Request (PAR)** ejecutadas **exclusivamente por el backend automatizado (WF2 en n8n)** al aprobar activos.
   - Convención: `activos/aprobados/{execution_id}/{asset_id}.json` exclusivamente para contenidos con decisión humana aprobada.
   - *Seguridad Zero-Trust:* La URL PAR de OCI solo la usa el WF2 en n8n; no hace falta ni se expone en Netlify ni en el frontend.

4. **📊 Observabilidad, Métricas Diarias & Power BI:**
   - Flujo automatizado **WF3** que consolida diariamente en Google Sheets (`Metricas_diarias` y `Metricas_descartes_diarias`).
   - Adaptación del modelo analítico oficial en **Power BI Desktop** (`CommunityLab_Dashboard.pbix`):
     - **Página 1 — Resumen del Pipeline:** Tarjetas de estado, embudo DAX (Generados ➔ Curados ➔ Aprobados ➔ OCI), anillo por canal y reconciliación OCI (`✔ Aprobados = Oracle`).
     - **Página 2 — Auditoría de Descartes:** Monitoreo y clasificación de motivos de descarte (`tipo_no_elegible`, `sentimiento_no_positivo`, `fallo_generacion`).
     - Regla DAX: Todas las medidas aplican `MAX(fecha)` sobre el último día consolidado.

5. **🔐 Configuración y Plantillas de Despliegue:**
   - Plantilla de variables de entorno para Netlify y Local: [`.env.example`](.env.example).
   - Plantilla de secretos para Streamlit Cloud y Local: [`SECRETS_TEMPLATE.toml`](SECRETS_TEMPLATE.toml) y [`.streamlit/secrets.toml.example`](.streamlit/secrets.toml.example).
   - Plantilla de datos oficial de Google Sheets: [`PLANTILLA_GOOGLE_SHEETS_CURADURIA.csv`](PLANTILLA_GOOGLE_SHEETS_CURADURIA.csv).

---

## 📁 Estructura del Repositorio

El código fuente, flujos automatizados y documentación detallada se encuentran organizados dentro del módulo [`communitylab/`](communitylab/):

```text
communitylab/
├── README.md                                 # Documentación técnica completa y arquitectura
├── .gitignore                                # Exclusiones de Git
├── .env.example                              # Plantilla de variables de entorno
├── workflows/                                # Workflows exportados de n8n
│   ├── WF1-ingesta-analisis-generacion.json  # v1.8: Ingesta, validación y generación Groq
│   ├── WF2-curaduria-oci.json                # v1.4: Curaduría hacia OCI vía PAR PUT
│   ├── WF3-metricas-diarias.json             # v1.2: Métricas diarias y auditoría descartes
│   └── sample-payload-ingesta.json           # Payload JSON de prueba para el Webhook de WF1
├── dashboard/                                # Aplicación de Curaduría en Streamlit
│   ├── dashboard_curaduria.py                # Interfaz Human-in-the-Loop y Power BI v2.2
│   ├── requirements.txt                      # Dependencias Python
│   ├── README-dashboard.md                   # Manual de uso y configuración del dashboard
│   ├── plantilla_curaduria.csv               # Esquema de Google Sheets con filas de ejemplo
│   └── .streamlit/
│       └── secrets.toml.example              # Plantilla de credenciales GCP y Sheets
├── CommunityLab_Dashboard.pbix.pbip          # Proyecto y modelo oficial de Power BI Desktop
└── docs/
    ├── README.md                             # Guía de capturas y catálogo de evidencias
    └── capturas/                             # Evidencias de ejecución y capturas
```

---

## ⚡ Enlaces Rápidos

- 🌐 **[Despliegue Web Oficial en Vivo (Netlify)](https://proyecto-equipo-36.netlify.app/)**
- 🛡️ **[Dashboard de Curaduría & Métricas en Vivo (Streamlit Cloud)](https://g10-latam-equipo-36.streamlit.app/)**
- 📖 **[Documentación Técnica Completa](communitylab/README.md)** (Arquitectura Mermaid, Contratos de Datos y Matriz de Cumplimiento)
- 🤖 **[Workflows de n8n](communitylab/workflows/)**
- 🖥️ **[Dashboard Streamlit Local v2.2 (app.py)](app.py)** / [`communitylab/dashboard/`](communitylab/dashboard/)
- 📄 **[Plantilla Google Sheets Curaduría](PLANTILLA_GOOGLE_SHEETS_CURADURIA.csv)**
- 🔐 **[Plantilla de Secretos Streamlit](SECRETS_TEMPLATE.toml)**
- 📦 **[Repositorio Curaduría Streamlit (Oscar)](https://github.com/VelaztiquiOscar/G10-LATAM-EQUIPO-36.git)**

---
*Desarrollado con dedicación por el **Equipo 36** — Hackathon ONE G10 (Oracle & Alura).*

