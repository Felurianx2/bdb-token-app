# 🦈 Token BDB - DApp Completa

<div align="center">

![Token BDB](https://img.shields.io/badge/Token-BDB-0fbab7?style=for-the-badge&logo=stellar)
![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue?style=for-the-badge&logo=stellar)
![Rust](https://img.shields.io/badge/Rust-1.75+-orange?style=for-the-badge&logo=rust)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

**Token fungible en Stellar/Soroban para las verdaderas Tiburonas 🦈**

🚀[Demo en Vivo](https://bdb-token-app.vercel.app) | 📖[Documentación](#-características)

</div>

---

## 📋 Tabla de Contenidos

- [🌟 Características](#-características)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🎮 Uso](#-uso)
- [📊 Smart Contract](#-smart-contract)
- [🛠️ Tecnologías](#️-tecnologías)
- [🧪 Testing](#-testing)
- [🚀 Deploy](#-deploy)

---

## 🌟 Características

✅ **Token Fungible Completo**
- Minteo de tokens (solo admin)
- Transferencias entre cuentas
- Consulta de balance
- 7 decimales (1 BDB = 10,000,000 stroops)

✅ **Frontend Moderno**
- Integración con Freighter Wallet
- Diseño responsive (mobile, tablet, desktop)
- Animaciones suaves
- Paleta de colores del mar 🌊

✅ **Seguridad**
- Validaciones de transferencias
- Control de acceso (admin)
- Firmas con wallet del usuario
- Balance verificado antes de transferir

---

## 📁 Estructura del Proyecto
```
bdb-token-app/
├── contracts/
│   └── bdb-token/              # Smart contract (Rust/Soroban)
│       ├── src/
│       │   └── lib.rs          # Código del token BDB
│       ├── Cargo.toml          # Dependencias de Rust
│       └── README.md           # Docs del contrato
│
├── src/                        # Frontend (React + TypeScript)
│   ├── App.tsx                 # Componente principal
│   ├── App.css                 # Estilos (paleta del mar)
│   ├── contract.ts             # Lógica de interacción con blockchain
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts           # Tipos de TypeScript
│
├── public/                     # Assets estáticos
├── .env                        # Variables de entorno (NO subir a git)
├── .env.example                # Template de variables
├── .gitignore                  # Archivos ignorados por git
├── package.json                # Dependencias del frontend
├── tsconfig.json               # Configuración TypeScript
├── vite.config.ts              # Configuración Vite
└── README.md                   # Este archivo
```

---

## 🚀 Instalación

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Rust** 1.75+ ([Instalar](https://rustup.rs/))
- **Stellar CLI** ([Guía de instalación](https://developers.stellar.org/docs/tools/developer-tools))
- **Freighter Wallet** ([Extensión de navegador](https://www.freighter.app/))

### Clonar el Repositorio
```bash
git clone https://github.com/TU_USERNAME/bdb-token-dapp.git
cd bdb-token-app
```

### Instalar Dependencias del Frontend
```bash
npm install
```

### Compilar el Smart Contract (Opcional)

Si quieres recompilar el contrato:
```bash
cd contracts/bdb-token

# Agregar target wasm32
rustup target add wasm32-unknown-unknown

# Compilar
cargo build --target wasm32-unknown-unknown --release

# El contrato compilado estará en:
# target/wasm32-unknown-unknown/release/bdb_token.wasm
```

---

## ⚙️ Configuración

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
# ID del contrato deployado en Stellar Testnet
VITE_BDB_CONTRACT_ID=CAWSMAP3EKUYB375RIGOHYOET5ISHT36MHZZTUUFOITGFVIXT4D2YF7T

# RPC URL de Stellar Testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
```

### 2. Configurar Freighter Wallet

1. Instala la extensión [Freighter](https://www.freighter.app/)
2. Crea una nueva wallet o importa una existente
3. **Importante:** Cambia la red a **TESTNET**
   - Abre Freighter
   - Click en ⚙️ Settings
   - Network → **Test SDF Network (TESTNET)**

### 3. Obtener XLM de Testnet (Para gas fees)
```bash
# Desde Freighter, copia tu dirección pública (empieza con G...)
# Luego ejecuta:

stellar keys fund TU_DIRECCION_PUBLICA --network testnet
```

O usa el faucet web: https://laboratory.stellar.org/#account-creator?network=test

---

## 🎮 Uso

### Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173/**

### Flujo de Uso

1. **Conectar Wallet**
   - Click en "Conectar Wallet"
   - Freighter abrirá un popup
   - Aprueba la conexión

2. **Ver Balance**
   - Click en "Ver mi Balance BDB"
   - Se mostrará tu balance en tokens (no en stroops)

3. **Transferir Tokens**
   - Ingresa la dirección destino (debe empezar con G)
   - Ingresa la cantidad de tokens
   - Click en "💰 Transferir"
   - Freighter pedirá confirmación
   - Aprueba la transacción

4. **Desconectar**
   - Click en "🚪 Desconectar"

---

## 📊 Smart Contract

### Información del Contrato

- **Contract ID:** `CAWSMAP3EKUYB375RIGOHYOET5ISHT36MHZZTUUFOITGFVIXT4D2YF7T`
- **Red:** Stellar Testnet
- **Decimales:** 7 (1 BDB = 10,000,000 stroops)
- **Lenguaje:** Rust + Soroban SDK

### Funciones Disponibles

#### `initialize(admin: Address, decimal: u32, name: String, symbol: String)`
Inicializa el token (solo una vez).
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source admin \
  --network testnet \
  -- initialize \
  --admin ADMIN_ADDRESS \
  --decimal 7 \
  --name "Token BDB" \
  --symbol "BDB"
```

#### `mint(to: Address, amount: i128)`
Mintea tokens a una dirección (solo admin).
```bash
stellar contract invoke \
  --id CAWSMAP3EKUYB375RIGOHYOET5ISHT36MHZZTUUFOITGFVIXT4D2YF7T \
  --source admin \
  --network testnet \
  -- mint \
  --to GBEOAGM47N5TMCRGHUQW2SYVDT73BK7M4KPJVCCGUZOGAO7KHBAXOQKE \
  --amount 10000000
```

**Nota:** `amount` está en stroops. Para 1 BDB, usa `10000000`.

#### `balance(id: Address)`
Consulta el balance de una cuenta.
```bash
stellar contract invoke \
  --id CAWSMAP3EKUYB375RIGOHYOET5ISHT36MHZZTUUFOITGFVIXT4D2YF7T \
  --source cualquier_cuenta \
  --network testnet \
  -- balance \
  --id TU_DIRECCION
```

#### `transfer(from: Address, to: Address, amount: i128)`
Transfiere tokens entre cuentas.
```bash
stellar contract invoke \
  --id CAWSMAP3EKUYB375RIGOHYOET5ISHT36MHZZTUUFOITGFVIXT4D2YF7T \
  --source from_account \
  --network testnet \
  -- transfer \
  --from FROM_ADDRESS \
  --to TO_ADDRESS \
  --amount 5000000
```

---

## 🛠️ Tecnologías

### Backend (Smart Contract)

- **Rust** - Lenguaje de programación
- **Soroban SDK** - Framework para smart contracts en Stellar
- **Stellar CLI** - Herramienta de línea de comandos

### Frontend

- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Stellar SDK** - SDK de JavaScript para Stellar
- **Freighter API** - Integración con wallet

### Blockchain

- **Stellar** - Blockchain
- **Soroban** - Plataforma de smart contracts
- **Testnet** - Red de pruebas

---

## 🧪 Testing

### Tests del Smart Contract
```bash
cd contracts/bdb-token
cargo test
```

### Tests del Frontend
```bash
npm run test
```

### Linting
```bash
# TypeScript/ESLint
npm run lint

# Rust
cd contracts/bdb-token
cargo clippy
```

---

## 🚀 Deploy

### Deploy del Smart Contract

#### 1. Crear identidad para deploy
```bash
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet
```

#### 2. Compilar el contrato
```bash
cd contracts/bdb-token
cargo build --target wasm32-unknown-unknown --release
```

#### 3. Deployar a Testnet
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/bdb_token.wasm \
  --source deployer \
  --network testnet
```

Guarda el CONTRACT_ID que te devuelve.

#### 4. Inicializar el token
```bash
stellar contract invoke \
  --id TU_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address deployer) \
  --decimal 7 \
  --name "Token BDB" \
  --symbol "BDB"
```

### Deploy del Frontend

#### Opción 1: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Opción 2: Netlify
```bash
# Build de producción
npm run build

# Sube la carpeta dist/ a Netlify
```

#### Opción 3: GitHub Pages
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar scripts en package.json:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autora

**Isamar Suarez** - *Tiburona Developer* 🦈

- GitHub: [@Felurianx2](https://github.com/Felurianx2)
- LinkedIn: [isamarsuarez](https://www.linkedin.com/in/isamarsuarez/)

---

## 📚 Recursos Adicionales

- [Documentación de Stellar](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Freighter API](https://docs.freighter.app/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [React Docs](https://react.dev/)

---

<div align="center">

⭐ Si te gustó este proyecto, dale una estrella en GitHub!

</div>
