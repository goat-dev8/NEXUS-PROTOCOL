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
  <em>Smart Yield Infrastructure with Privacy Pool on Polygon</em>
</h3>

<p align="center">
  <strong>AI-optimized yield vaults + commitment-based privacy pool | Honest, transparent DeFi</strong>
</p>

<p align="center">
  <a href="#-live-deployment">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-privacy-model">Privacy Model</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-smart-contracts">Contracts</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

---

## 🌐 Live Deployment

### 📍 Polygon Mainnet Contracts

| Contract             | Address                                      | Polygonscan                                                                        |
| -------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| **StealthRegistry**  | `0x678e033Ac388BfE5a1b0a98329e98E253854060C` | [View](https://polygonscan.com/address/0x678e033Ac388BfE5a1b0a98329e98E253854060C) |
| **NexusFactory**     | `0x548eBA09dD9FE4D45F76Cf6a6E42139c16a6A387` | [View](https://polygonscan.com/address/0x548eBA09dD9FE4D45F76Cf6a6E42139c16a6A387) |
| **USDC Vault**       | `0x3AA9fb8b22466403f6a3498c99ACDb9A27e80a49` | [View](https://polygonscan.com/address/0x3AA9fb8b22466403f6a3498c99ACDb9A27e80a49) |
| **USDT Vault**       | `0x579d7019DbCD1598Ef4757723Baa05c7c31249F4` | [View](https://polygonscan.com/address/0x579d7019DbCD1598Ef4757723Baa05c7c31249F4) |
| **DAI Vault**        | `0xfB758bAD4Ee1533E79e3130665178a151D7ad00a` | [View](https://polygonscan.com/address/0xfB758bAD4Ee1533E79e3130665178a151D7ad00a) |
| **NexusPrivacyPool** | *Pending deployment*                          | —                                                                                  |

### 🌍 Frontend

- **Production**: [Coming Soon on Vercel]

---

## ✨ Features

### 📊 Yield Vaults

ERC4626 yield vaults that deposit underlying assets into Aave V3 on Polygon for real, verifiable yield.

- ERC4626 compliant tokenized vaults
- Integrated with **Aave V3** on Polygon for real yields
- Configurable fee structure (0.1% deposit/withdraw)
- Emergency withdrawal functionality
- **Note**: All deposits, withdrawals, and balances are publicly visible on-chain

### 🔒 Privacy Pool (NEW)

Commitment-based privacy pool that breaks the on-chain link between deposit and withdrawal addresses.

- Fixed denomination deposits (100 / 1,000 / 10,000 USDC)
- Commit-reveal scheme: deposit with a commitment hash, withdraw to any address using the secret
- Deposited funds earn yield on Aave V3 while waiting
- Relayer support (0.3% fee) for meta-transactions
- Merkle tree for commitment verification
- **Honest disclaimer**: Deposit amounts are fixed but public. Timing correlation between deposits and withdrawals is possible. This is not full ZK privacy — it breaks address linkability only.

### 💸 @Username Payments

Send and receive funds using human-readable usernames.

- **@username** based payments (3-20 chars)
- Escrow-style payment holding
- Encrypted notes support
- **Honest disclaimer**: Usernames and payment amounts are publicly visible on-chain. This is a UX convenience feature, not a privacy feature.

### 🤖 AI Yield Agent

AI assistant that suggests yield optimization strategies across vaults.

- Portfolio analysis and recommendations
- Risk tolerance settings
- Auto-compounding suggestions
- Strategy optimization history

### 🪪 Identity Verification

Attestation-based identity verification with on-chain badges.

- Prove Humanity, Age (18+), Wallet History
- Badge-based verification system
- **Honest disclaimer**: Verification relies on third-party attestors. On-chain attestations are public.

### 🏛️ Governance

Vote on protocol proposals using NXS tokens.

- Proposal creation and voting (For / Against / Abstain)
- Vote delegation
- Transparent on-chain governance

---

## 🔍 Privacy Model

We believe in being honest about what our protocol can and cannot do.

| Feature            | What's Public                     | What's Private                        |
| ------------------ | --------------------------------- | ------------------------------------- |
| **Yield Vaults**   | Deposits, withdrawals, balances   | Nothing — fully transparent on-chain  |
| **Privacy Pool**   | Deposit amounts (fixed), timing   | Sender ↔ receiver link (broken)       |
| **@Username Pay**  | Usernames, amounts, transactions  | Nothing — convenience feature only    |
| **Identity**       | On-chain attestations             | Personal data (off-chain only)        |

### Privacy Pool — How It Works

1. **Deposit**: User submits a commitment hash (H(secret, nullifier)) with a fixed USDC amount
2. **Wait**: Funds earn Aave V3 yield. More deposits grow the anonymity set
3. **Withdraw**: User provides the secret + nullifier to withdraw to ANY address. The nullifier prevents double-spending
4. **Result**: On-chain observers cannot link the depositor address to the withdrawal address

### What This Is NOT

- ❌ Not "anonymous yield farming" — vault yields are fully public
- ❌ Not ZK-powered — no zero-knowledge proofs are used (commit-reveal only)
- ❌ Not Tornado Cash — no Merkle tree proofs, simpler commitment scheme
- ❌ Not fully private — timing analysis can still correlate deposits and withdrawals

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              NEXUS Protocol                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │   Frontend   │  │  AI Agent    │  │   Vaults     │  │   Privacy Pool   │ │
│  │   (React)    │  │  (Frontend)  │  │  (ERC4626)   │  │  (Commit-Reveal) │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────────┘ │
│         │                 │                  │                  │            │
│         └─────────────────┴──────────────────┴──────────────────┘            │
│                                     │                                        │
│                     ┌───────────────┼───────────────┐                        │
│                     │               │               │                        │
│              ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐                │
│              │  Stealth    │ │  Nexus      │ │   Aave V3   │                │
│              │  Registry   │ │  Factory    │ │   (Yield)   │                │
│              └─────────────┘ └─────────────┘ └─────────────┘                │
│                                                                              │
│                            Polygon PoS (Chain 137)                           │
└──────────────────────────────────────────────────────────────────────────────┘
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

### NexusPrivacyPool.sol (NEW)

Commitment-based privacy pool with fixed denomination deposits and Aave V3 yield.

```solidity
// Key Features:
- deposit(commitment, denominationIndex) → Deposit tokens, store commitment
- withdraw(nullifierHash, commitment, denominationIndex, recipient, relayer) → Verify & send
- harvestYield() → Collect Aave yield (owner only)
- getAnonymitySetSize(denominationIndex) → Number of unspent commitments
- Denominations: 100, 1000, 10000 USDC
```

### StealthRegistry.sol

Username-based payment system (not stealth in the cryptographic sense).

```solidity
// Key Features:
- registerUsername(username, stealthMetaHash)
- sendPayment(recipientUsername, token, amount, ...)
- claimPayment(paymentId)
- isUsernameAvailable(username)
- getPendingPayments(username)
```

### NexusFactory.sol

Factory pattern for deploying new vaults. Also stores the privacy pool address.

```solidity
// Key Features:
- createVault(asset, aToken, name, symbol, ...)
- getAllVaults()
- getVaultForAsset(asset)
- setPrivacyPool(address) / getPrivacyPool()
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
│   │   ├── NexusPrivacyPool.sol # Commitment Privacy Pool (NEW)
│   │   ├── StealthRegistry.sol  # Username Payment System
│   │   └── NexusFactory.sol     # Vault Factory
│   ├── 📁 scripts/
│   │   └── deploy.ts            # 6-contract deployment script
│   ├── 📁 deployments/
│   │   └── polygon.json         # Deployed addresses
│   └── hardhat.config.ts
│
├── 📁 web/                       # Frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   │   ├── 📁 layout/       # TopBar, Sidebar, Footer
│   │   │   └── 📁 ui/           # shadcn/ui primitives
│   │   ├── 📁 pages/            # Page components
│   │   │   ├── Landing.tsx      # Landing page with bgn.jpg hero
│   │   │   ├── Dashboard.tsx    # Portfolio overview
│   │   │   ├── Vaults.tsx       # Yield Vaults management
│   │   │   ├── PrivacyPool.tsx  # Privacy Pool deposit/withdraw (NEW)
│   │   │   ├── StealthPay.tsx   # @Username Payments
│   │   │   ├── Portfolio.tsx    # Portfolio analytics
│   │   │   ├── AIAgent.tsx      # AI yield optimization
│   │   │   ├── Governance.tsx   # Protocol governance
│   │   │   ├── Identity.tsx     # Identity verification
│   │   │   └── Settings.tsx     # User settings
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   │   ├── useWallet.ts
│   │   │   ├── useVaults.ts
│   │   │   ├── useStealthPay.ts
│   │   │   └── usePrivacyPool.ts  # (NEW)
│   │   ├── 📁 lib/              # Utilities & config
│   │   │   ├── config.ts        # Contract addresses
│   │   │   ├── constants.ts
│   │   │   └── contracts/abis.ts # All contract ABIs
│   │   └── 📁 stores/           # Zustand stores
│   │       └── useAppStore.ts
│   ├── index.html
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
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
- ✅ Nullifier tracking to prevent double-spending in Privacy Pool

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

- [x] Smart contract development (Vaults, Factory, StealthRegistry)
- [x] Polygon mainnet deployment
- [x] Frontend MVP with wallet integration

### Phase 2: Privacy Pool ✅ (Wave 6)

- [x] NexusPrivacyPool contract (commit-reveal, fixed denominations)
- [x] Privacy Pool frontend page with deposit/withdraw
- [x] Honest privacy model documentation
- [x] Full UI redesign (dark/emerald theme)
- [x] Fixed misleading "privacy-first" and "ZK-powered" claims

### Phase 3: Enhancement 🔄

- [ ] Full Aave yield integration testing
- [ ] Portfolio tracking improvements
- [ ] AI agent backend implementation
- [ ] Mobile responsiveness optimization

### Phase 4: Advanced Privacy 📋

- [ ] ZK proof integration for Privacy Pool withdrawals
- [ ] Full EIP-5564 stealth address protocol
- [ ] Larger anonymity sets
- [ ] Relayer network

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

Built with dedication for the **Polygon Buildathon**

---

## 🔗 Links

- **Website**: [Coming Soon]
- **Documentation**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]

---

<p align="center">
  <strong>🛡️ NEXUS Protocol — Honest Yield Infrastructure with Privacy Pool 🛡️</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Built%20for-Polygon%20Buildathon-8247E5?style=flat-square" alt="Polygon Buildathon" />
</p>
