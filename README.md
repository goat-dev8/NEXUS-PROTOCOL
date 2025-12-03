<p align="center">
  <img src="https://img.shields.io/badge/Polygon-8247E5?style=for-the-badge&logo=polygon&logoColor=white" alt="Polygon" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Aave-2EBAC6?style=for-the-badge&logo=aave&logoColor=white" alt="Aave" />
</p>

<h1 align="center">
  🛡️ NEXUS Protocol
</h1>

<h3 align="center">
  <em>The Invisible Yield Layer on Polygon</em>
</h3>

<p align="center">
  <strong>Privacy-First AI Yield Aggregator | Your Yield. Your Privacy. Your Sovereignty.</strong>
</p>

<p align="center">
  <a href="#-live-deployment">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-smart-contracts">Contracts</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

---

## 🌐 Live Deployment

### 📍 Polygon Mainnet Contracts

| Contract            | Address                                      | Polygonscan                                                                        |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| **StealthRegistry** | `0x678e033Ac388BfE5a1b0a98329e98E253854060C` | [View](https://polygonscan.com/address/0x678e033Ac388BfE5a1b0a98329e98E253854060C) |
| **NexusFactory**    | `0x548eBA09dD9FE4D45F76Cf6a6E42139c16a6A387` | [View](https://polygonscan.com/address/0x548eBA09dD9FE4D45F76Cf6a6E42139c16a6A387) |
| **USDC Vault**      | `0x3AA9fb8b22466403f6a3498c99ACDb9A27e80a49` | [View](https://polygonscan.com/address/0x3AA9fb8b22466403f6a3498c99ACDb9A27e80a49) |
| **USDT Vault**      | `0x579d7019DbCD1598Ef4757723Baa05c7c31249F4` | [View](https://polygonscan.com/address/0x579d7019DbCD1598Ef4757723Baa05c7c31249F4) |
| **DAI Vault**       | `0xfB758bAD4Ee1533E79e3130665178a151D7ad00a` | [View](https://polygonscan.com/address/0xfB758bAD4Ee1533E79e3130665178a151D7ad00a) |

### 🌍 Frontend

- **Production**: [Coming Soon on Vercel]

---

## ✨ Features

### 🔒 ZK-Shielded Vaults

Deposit stablecoins into yield-generating vaults with privacy at the core. Your funds, your privacy.

- ERC4626 compliant tokenized vaults
- Integrated with **Aave V3** on Polygon for real yields
- Configurable fee structure (0.1% deposit/withdraw)
- Emergency withdrawal functionality

### 👻 Stealth Payments

Send and receive funds using human-readable usernames without exposing wallet addresses.

- **@username** based payments (3-20 chars)
- Escrow-style payment holding
- Encrypted notes support
- Future: Full EIP-5564 stealth address integration

### 🤖 NEXUS AI Agent

Autonomous AI that optimizes your yield strategy 24/7 across multiple DeFi protocols.

- Portfolio analysis and recommendations
- Auto-rebalancing strategies
- Risk assessment and alerts
- Protocol health monitoring

### 🪪 ZK Identity (Planned)

Zero-knowledge identity verification without revealing personal data.

- Sybil resistance
- Compliance-ready
- Self-sovereign identity

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              NEXUS Protocol                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │   Frontend   │   │  AI Agent    │   │   Vaults     │   │   Stealth    │  │
│  │   (React)    │   │  (Planned)   │   │  (ERC4626)   │   │   Registry   │  │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘  │
│         │                  │                   │                   │         │
│         └──────────────────┴───────────────────┴───────────────────┘         │
│                                     │                                        │
│                            ┌────────▼────────┐                               │
│                            │   Polygon L2    │                               │
│                            │   (Chain 137)   │                               │
│                            └────────┬────────┘                               │
│                                     │                                        │
│                            ┌────────▼────────┐                               │
│                            │   Aave V3       │                               │
│                            │   Yield Source  │                               │
│                            └─────────────────┘                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📜 Smart Contracts

### NexusVault.sol

ERC4626 compliant yield vault that automatically deposits to Aave V3.

```solidity
// Key Features:
- deposit(assets, receiver) → shares
- withdraw(assets, receiver, owner) → shares
- totalAssets() → TVL in underlying token
- getCurrentAPY() → Current yield rate
- getUserPosition(user) → User's shares & value
```

### StealthRegistry.sol

Username-based stealth payment system.

```solidity
// Key Features:
- registerUsername(username, stealthMetaHash)
- sendPayment(recipientUsername, token, amount, ...)
- claimPayment(paymentId)
- isUsernameAvailable(username)
- getPendingPayments(username)
```

### NexusFactory.sol

Factory pattern for deploying new vaults.

```solidity
// Key Features:
- createVault(asset, aToken, name, symbol, ...)
- getAllVaults()
- getVaultForAsset(asset)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun or npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/goat-dev8/NEXUS-PROTOCOL.git
cd NEXUS-PROTOCOL

# Install frontend dependencies
cd web
bun install  # or npm install

# Create environment file
cp .env.example .env
# Add your WalletConnect Project ID to .env

# Start development server
bun dev  # or npm run dev
```

### Smart Contract Development

```bash
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Polygon (requires .env setup)
npx hardhat run scripts/deploy.ts --network polygon
```

### Environment Variables

```bash
# Frontend (.env in /web)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_POLYGON_RPC_URL=https://polygon-rpc.com

# Contracts (.env in /contracts)
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=your_private_key
POLYGONSCAN_API_KEY=your_api_key
```

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Purpose                     |
| ----------------- | --------------------------- |
| **React 18**      | UI Framework                |
| **TypeScript**    | Type Safety                 |
| **Vite**          | Build Tool                  |
| **TailwindCSS**   | Styling                     |
| **shadcn/ui**     | UI Components               |
| **Framer Motion** | Animations                  |
| **wagmi v2**      | React Hooks for Ethereum    |
| **viem**          | TypeScript Ethereum Library |
| **RainbowKit**    | Wallet Connection           |
| **React Router**  | Routing                     |
| **Zustand**       | State Management            |

### Smart Contracts

| Technology          | Purpose                   |
| ------------------- | ------------------------- |
| **Solidity 0.8.20** | Smart Contract Language   |
| **Hardhat**         | Development Environment   |
| **OpenZeppelin**    | Secure Contract Libraries |
| **Foundry**         | Testing Framework         |

### Blockchain

| Network         | Purpose               |
| --------------- | --------------------- |
| **Polygon PoS** | L2 Mainnet Deployment |
| **Aave V3**     | Yield Generation      |

---

## 📁 Project Structure

```
NEXUS-PROTOCOL/
├── 📁 contracts/                 # Smart contracts
│   ├── 📁 src/
│   │   ├── NexusVault.sol       # ERC4626 Yield Vault
│   │   ├── StealthRegistry.sol  # Username Payment System
│   │   └── NexusFactory.sol     # Vault Factory
│   ├── 📁 scripts/
│   │   └── deploy.ts            # Deployment script
│   ├── 📁 deployments/
│   │   └── polygon.json         # Deployed addresses
│   └── hardhat.config.ts
│
├── 📁 web/                       # Frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   │   ├── 📁 layout/       # Layout components
│   │   │   └── 📁 ui/           # UI primitives
│   │   ├── 📁 pages/            # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Vaults.tsx
│   │   │   ├── StealthPay.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── AIAgent.tsx
│   │   │   └── Settings.tsx
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   │   ├── useWallet.ts
│   │   │   ├── useVaults.ts
│   │   │   └── useStealthPay.ts
│   │   ├── 📁 lib/              # Utilities & config
│   │   │   ├── config.ts        # Contract addresses
│   │   │   ├── constants.ts
│   │   │   └── utils.ts
│   │   └── 📁 stores/           # Zustand stores
│   │       └── useAppStore.ts
│   ├── index.html
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── .gitignore
├── vercel.json
└── README.md
```

---

## 🔐 Security

### Smart Contract Security

- ✅ ReentrancyGuard on all state-changing functions
- ✅ SafeERC20 for token transfers
- ✅ Ownable access control
- ✅ Fee caps (max 5%)
- ✅ Emergency withdrawal functionality
- ✅ Input validation on all parameters

### Frontend Security

- ✅ No private keys stored in frontend
- ✅ Environment variables for sensitive data
- ✅ Wallet connection via established providers
- ✅ Transaction signing only through user wallets

### Audit Status

⏳ Pending professional audit

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅

- [x] Smart contract development
- [x] Polygon mainnet deployment
- [x] Frontend MVP
- [x] Wallet integration
- [x] Vault functionality

### Phase 2: Enhancement 🔄

- [ ] Full Aave yield integration
- [ ] Portfolio tracking
- [ ] Mobile responsiveness optimization
- [ ] Transaction history

### Phase 3: Privacy 📋

- [ ] ZK identity integration
- [ ] Full stealth address protocol (EIP-5564)
- [ ] Privacy-preserving transactions

### Phase 4: AI 📋

- [ ] AI Agent MVP
- [ ] Yield optimization algorithms
- [ ] Risk scoring system
- [ ] Auto-rebalancing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for the **Polygon Buildathon Wave 3**

---

## 🔗 Links

- **Website**: [Coming Soon]
- **Documentation**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]

---

<p align="center">
  <strong>🛡️ NEXUS Protocol - Your Yield. Your Privacy. Your Sovereignty. 🛡️</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Built%20for-Polygon%20Buildathon-8247E5?style=flat-square" alt="Polygon Buildathon" />
</p>
