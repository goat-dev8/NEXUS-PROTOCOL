<p align="center">
  <img src="https://img.shields.io/badge/Polygon-8247E5?style=for-the-badge&logo=polygon&logoColor=white" alt="Polygon" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Aave_V3-2EBAC6?style=for-the-badge&logo=aave&logoColor=white" alt="Aave V3" />
  <img src="https://img.shields.io/badge/ERC--4626-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" alt="ERC-4626" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black" alt="Hardhat" />
</p>

<h1 align="center">🛡️ NEXUS Protocol</h1>

<h3 align="center"><em>Yield-Backed Privacy Infrastructure on Polygon</em></h3>

<p align="center">
  <strong>ERC-4626 yield vaults · Commitment-based privacy pool · Username stealth payments</strong><br/>
  <strong>6 smart contracts live on Polygon Mainnet — real Aave V3 yield, real privacy gains</strong>
</p>

<p align="center">
  <a href="https://nexus-protocol-black.vercel.app">🌐 Live App</a> •
  <a href="#-smart-contracts-on-polygon-mainnet">Contracts</a> •
  <a href="#-core-features">Features</a> •
  <a href="#-privacy-model--honest-claims">Privacy Model</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-user-flow">User Flow</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 💡 What Is NEXUS Protocol?

NEXUS Protocol is a **yield-backed privacy infrastructure** deployed on **Polygon Mainnet**. It combines three core primitives into one cohesive DeFi application:

1. **ERC-4626 Yield Vaults** — Deposit stablecoins (USDC, USDT, DAI) into tokenized vaults that auto-supply to **Aave V3** for real on-chain yield generation. "Yield pays first, principal stays productive."

2. **Commitment-Based Privacy Pool** — A Tornado-Cash-inspired pool where users deposit fixed denominations with a cryptographic commitment (`keccak256(secret, nullifier)`). Withdrawals use a nullifier to prove deposit knowledge without revealing which deposit was theirs. Funds earn Aave V3 yield while in the pool.

3. **Username Stealth Payments** — Register a human-readable `@username` on-chain and receive payments without exposing your wallet address to senders. Payments are held in escrow until claimed by the username owner.

All contracts are **fully deployed and functional** on Polygon Mainnet with real Aave V3 integration — no mocks, no testnets.

---

## 📍 Smart Contracts on Polygon Mainnet

| # | Contract | Address | Polygonscan |
|---|----------|---------|-------------|
| 1 | **StealthRegistry** | `0x7474DFdA6a63C0743eB06D5559AB161f4C30c22B` | [View ↗](https://polygonscan.com/address/0x7474DFdA6a63C0743eB06D5559AB161f4C30c22B) |
| 2 | **NexusFactory** | `0x7e597aCDbA0Eb5bdb323Ea9e76272a736B5D3831` | [View ↗](https://polygonscan.com/address/0x7e597aCDbA0Eb5bdb323Ea9e76272a736B5D3831) |
| 3 | **NexusVault (USDC)** | `0x9cD3434916fF1B39b42c79d038fD7f622B22d695` | [View ↗](https://polygonscan.com/address/0x9cD3434916fF1B39b42c79d038fD7f622B22d695) |
| 4 | **NexusVault (USDT)** | `0x8931b20fEC39E9b84e43A6bD8dcEa695b5272028` | [View ↗](https://polygonscan.com/address/0x8931b20fEC39E9b84e43A6bD8dcEa695b5272028) |
| 5 | **NexusVault (DAI)** | `0xdF90cA5EF64Aa00e72E371f12D4c7594c9866B12` | [View ↗](https://polygonscan.com/address/0xdF90cA5EF64Aa00e72E371f12D4c7594c9866B12) |
| 6 | **NexusPrivacyPool** | `0x740a7a9191d5F8aB64C35C1e2Aa95A4FE4F57a5b` | [View ↗](https://polygonscan.com/address/0x740a7a9191d5F8aB64C35C1e2Aa95A4FE4F57a5b) |

**Chain:** Polygon Mainnet (Chain ID: 137) · **Compiler:** Solidity 0.8.20 · **Optimizer:** 200 runs + viaIR

---

## 🏗️ Core Features

### 1. 🏦 ERC-4626 Yield Vaults (`NexusVault.sol`)

Production-grade tokenized vaults following the ERC-4626 standard:

- **Real Aave V3 yield** — Deposits are automatically supplied to Aave V3 Pool on Polygon. No mock yields.
- **Multi-asset support** — Three vaults deployed for USDC, USDT, and DAI
- **Configurable fees** — Deposit/withdraw fees (default 0.1%) capped at 5% max, with separate fee recipient
- **Full share accounting** — `totalAssets()` reads live `aToken.balanceOf()` for real-time TVL
- **Emergency controls** — Owner can emergency-withdraw from Aave if a critical vulnerability is found
- **Factory deployed** — All vaults created through `NexusFactory.createVault()` for standardized deployment

**Key Functions:**
| Function | Description |
|----------|-------------|
| `deposit(assets, receiver)` | Deposit underlying → collect fee → supply to Aave → mint shares |
| `withdraw(assets, receiver, owner)` | Burn shares → withdraw from Aave → collect fee → transfer |
| `totalAssets()` | Returns live aToken balance (real TVL in Aave) |
| `getVaultInfo()` | Returns name, symbol, TVL, APY, risk level in one call |
| `getUserPosition(user)` | Returns user's shares, asset value, and pending yield |
| `setFees(depositFee, withdrawFee)` | Update fees (owner only, max 5%) |
| `emergencyWithdraw()` | Pull all funds from Aave to owner (emergency only) |

### 2. 🕵️ Privacy Pool (`NexusPrivacyPool.sol`)

Commitment-based privacy pool that breaks **sender↔receiver correlation**:

- **Commit-reveal scheme** — Deposit with `commitment = keccak256(secret, nullifier)`. Withdraw with `nullifierHash = keccak256(nullifier)`. No on-chain link between depositor and recipient.
- **Fixed denominations** — All deposits of the same denomination are fungible. Anonymity set = total deposits at that denomination. Supports 0.01, 0.1, 1, 100, 1,000, and 10,000 USDC.
- **Yield while waiting** — All pool deposits are forwarded to Aave V3. Funds earn yield passively. Owner can harvest yield without touching principal.
- **Relayer support** — Optional relayer can submit withdrawal tx on behalf of the recipient (0.3% fee). Prevents gas-funding correlation.
- **Merkle root tracking** — Commitments are stored in a hash chain per denomination with incremental root updates.
- **Nullifier protection** — Spent nullifiers are recorded to prevent double-withdrawal.

**Key Functions:**
| Function | Description |
|----------|-------------|
| `deposit(commitment, denominationIndex)` | Deposit fixed amount → store commitment → supply to Aave |
| `withdraw(nullifierHash, commitment, denomIndex, recipient, relayer)` | Verify commitment + nullifier → withdraw from Aave → pay recipient |
| `getPoolStats()` | Total deposited, withdrawn, Aave balance, yield earned |
| `getAnonymitySetSize(denomIndex)` | Number of deposits at a denomination (privacy metric) |
| `getAllDenominations()` | List all supported denominations with active status |
| `harvestYield(recipient)` | Owner harvests earned yield (principal untouched) |
| `addDenomination(amount)` | Owner adds new deposit denomination |
| `isSpentNullifier(hash)` | Check if a nullifier has been used |

### 3. 👤 Username Stealth Payments (`StealthRegistry.sol`)

Human-readable payment routing without exposing wallet addresses:

- **@username registration** — Register a 3-20 character username (lowercase + numbers + underscore) for 0.01 MATIC
- **Escrow payments** — Send ERC-20 tokens to any `@username`. Tokens are held in the contract until the username owner claims them.
- **Privacy gain** — Senders interact with a username, not a wallet address. Recipients claim without revealing their address to the sender at payment time.
- **Payment history** — Track sent/received payments with encrypted notes
- **Spam prevention** — Registration fee + username format validation

**Key Functions:**
| Function | Description |
|----------|-------------|
| `registerUsername(username, stealthMetaHash)` | Register @username with stealth meta-address hash |
| `sendPayment(username, token, amount, ephemeralHash, note)` | Send ERC-20 to @username (held in escrow) |
| `claimPayment(paymentId)` | Claim a pending payment (only username owner) |
| `isUsernameAvailable(username)` | Check availability |
| `getProfile(username)` | Get profile owner, registration date, status |
| `getPendingPayments(username)` | List unclaimed payments with total pending amount |

### 4. 🏭 Vault Factory (`NexusFactory.sol`)

Standardized vault deployment and registry:

- **One-call vault creation** — Deploy a fully configured ERC-4626 vault with Aave integration
- **Asset-to-vault mapping** — Prevents duplicate vaults per asset
- **Registry** — Query all deployed vaults, get vault-by-asset
- **Privacy pool registration** — Links the privacy pool to the factory

---

## 🔒 Privacy Model — Honest Claims

> **We are transparent about what NEXUS Protocol does and doesn't provide.**

### What We Deliver

| Privacy Feature | How It Works |
|----------------|--------------|
| **Sender↔Receiver Unlinkability** | Privacy Pool commitments break the on-chain link. Depositor address ≠ Withdrawal recipient. |
| **Fixed-Denomination Fungibility** | All 0.01 USDC deposits look identical. Anonymity set grows with each deposit. |
| **Username Address Abstraction** | Senders pay `@username`, not `0x...`. Recipient's wallet is not exposed to the sender. |
| **Nullifier-Based Withdrawal** | Withdrawals prove deposit knowledge via nullifier — no depositor address revealed. |
| **Relayer Support** | Third party can submit withdrawal tx, preventing gas-funding correlation. |

### What We Don't Claim

- ❌ **We do NOT claim "fully anonymous" transactions** — Vault deposits, yields, and payment flows are public on-chain.
- ❌ **We do NOT claim ZK-proof privacy** — The current commit-reveal scheme is simplified. Full ZK-SNARK verification (Groth16/PLONK) is a planned future upgrade.
- ❌ **We do NOT hide vault activity** — All ERC-4626 vault deposits/withdrawals/yields are standard on-chain ERC-20 transfers visible to anyone.
- ❌ **Trivial correlation is possible** — Deposit timing, amounts, and gas patterns can be used to correlate deposits and withdrawals for sophisticated observers.

### Privacy vs Standard DeFi

| Feature | Standard DeFi | NEXUS Protocol |
|---------|--------------|----------------|
| Vault deposits | Fully public | Fully public (same) |
| Payment recipient | Wallet exposed | Hidden behind @username |
| Deposit↔Withdrawal link | Direct on-chain link | Broken by commitment scheme |
| Anonymity set | N/A | Grows with deposits per denomination |
| Relayer withdrawal | N/A | Supported (breaks gas correlation) |

---

## 🏛️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  NEXUS Protocol Architecture                  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  NexusVault   │  │  NexusVault  │  │   NexusVault     │    │
│  │   (USDC)     │  │   (USDT)     │  │    (DAI)         │    │
│  │  ERC-4626    │  │  ERC-4626    │  │   ERC-4626       │    │
│  └──────┬───────┘  └──────┬───────┘  └───────┬──────────┘    │
│         │                 │                   │               │
│         └─────────┬───────┘───────────────────┘               │
│                   │                                           │
│         ┌─────────▼─────────┐                                 │
│         │   NexusFactory    │ ← Creates & registers vaults    │
│         └───────────────────┘                                 │
│                                                               │
│  ┌──────────────────────┐    ┌─────────────────────────┐      │
│  │  NexusPrivacyPool    │    │   StealthRegistry       │      │
│  │  Commit/Reveal       │    │   @username Payments     │      │
│  │  Fixed Denominations │    │   Escrow + Claim         │      │
│  │  Aave V3 Yield       │    │   Payment History        │      │
│  └──────────┬───────────┘    └─────────────────────────┘      │
│             │                                                 │
│  ┌──────────▼──────────────────────────────────────────┐      │
│  │             Aave V3 Pool (Polygon)                   │      │
│  │  Real yield on USDC, USDT, DAI via aTokens           │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  Frontend: React + TypeScript + Vite + RainbowKit + wagmi    │
│  Connected to Polygon Mainnet via publicnode RPC              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow

### Vault Deposit & Withdrawal

```
1. Connect Wallet (MetaMask/WalletConnect via RainbowKit)
2. Navigate to Vaults → Select USDC/USDT/DAI vault
3. Approve token spending → Deposit amount
4. Contract: ERC-20 transferFrom → Aave V3 supply → Mint vault shares
5. Earn real Aave V3 yield passively
6. Withdraw: Burn shares → Aave V3 withdraw → Transfer tokens (minus fee)
```

### Privacy Pool Deposit & Withdrawal

```
1. Navigate to Privacy Pool → Select denomination (0.01 to 10,000 USDC)
2. Frontend generates: secret (random), nullifier (random)
3. Computes: commitment = keccak256(secret, nullifier)
4. User receives a "Privacy Note" (contains secret + nullifier + denomination)
5. Approve USDC → Deposit with commitment hash
6. Contract: Transfer USDC → Store commitment → Supply to Aave V3

--- Later (any time, any address) ---

7. Enter Privacy Note → Choose recipient address
8. Frontend derives: nullifierHash = keccak256(nullifier)
9. Contract: Verify commitment exists → Check nullifier unspent
10. Withdraw from Aave → Transfer USDC to recipient
11. No on-chain link between depositor and recipient
```

### Stealth Payment Flow

```
1. Register @username (0.01 MATIC registration fee)
2. Share your @username publicly
3. Sender: Enter @username → Select token & amount → Send
4. Contract: ERC-20 transferFrom → Store in escrow → Emit PaymentCreated
5. Recipient: View pending payments → Claim
6. Contract: Verify ownership → Transfer tokens → Mark claimed
```

---

## 🛠️ Tech Stack

### Smart Contracts
| Technology | Purpose |
|-----------|---------|
| **Solidity 0.8.20** | Smart contract language |
| **Hardhat** | Development & deployment framework |
| **OpenZeppelin** | ERC-4626, Ownable, ReentrancyGuard, SafeERC20 |
| **Aave V3** | Real yield generation via supply/withdraw |
| **Polygon Mainnet** | L2 deployment chain (low gas, high speed) |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool & dev server |
| **wagmi v2** | React hooks for Ethereum |
| **RainbowKit** | Wallet connection UI |
| **TailwindCSS** | Utility-first styling |
| **shadcn/ui** | Component library |
| **viem** | Low-level Ethereum client |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or bun
- MetaMask or WalletConnect-compatible wallet
- MATIC for gas on Polygon

### Frontend Setup

```bash
cd web
npm install
npm run dev
```

### Contract Development

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network polygon
```

### Environment Variables

```env
# contracts/.env
PRIVATE_KEY=your_deployer_private_key

# web/.env (optional overrides)
VITE_POLYGON_RPC_URL=https://polygon-bor-rpc.publicnode.com
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

---

## 📁 Project Structure

```
NEXUS-PROTOCOL/
├── contracts/
│   ├── src/
│   │   ├── NexusVault.sol          # ERC-4626 yield vault with Aave V3
│   │   ├── NexusFactory.sol        # Vault factory & registry
│   │   ├── NexusPrivacyPool.sol    # Commitment-based privacy pool
│   │   └── StealthRegistry.sol     # Username stealth payments
│   ├── scripts/
│   │   └── deploy.ts               # Full deployment script
│   ├── deployments/
│   │   └── polygon.json            # Deployed addresses
│   ├── hardhat.config.ts
│   └── package.json
├── web/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx          # Landing page
│   │   │   ├── Dashboard.tsx        # Portfolio dashboard
│   │   │   ├── Vaults.tsx           # Vault deposit/withdraw UI
│   │   │   ├── PrivacyPool.tsx      # Privacy pool deposit/withdraw
│   │   │   ├── StealthPay.tsx       # Username payments
│   │   │   ├── Portfolio.tsx        # Position tracking
│   │   │   ├── AIAgent.tsx          # AI yield suggestions
│   │   │   ├── Governance.tsx       # DAO governance (future)
│   │   │   ├── Identity.tsx         # User identity management
│   │   │   └── Settings.tsx         # App settings
│   │   ├── hooks/
│   │   │   ├── useVaults.ts         # Vault interaction hooks
│   │   │   ├── usePrivacyPool.ts    # Privacy pool hooks
│   │   │   ├── useStealthPay.ts     # Stealth payment hooks
│   │   │   ├── useWallet.ts         # Wallet connection
│   │   │   └── usePrices.ts         # Token price feeds
│   │   ├── lib/
│   │   │   ├── config.ts            # Contract addresses & config
│   │   │   ├── wagmi-config.ts      # wagmi + RainbowKit setup
│   │   │   ├── constants.ts         # App constants
│   │   │   └── contracts/abis.ts    # Contract ABIs
│   │   └── components/              # Reusable UI components
│   ├── vercel.json                   # Vercel SPA routing config
│   └── package.json
├── vercel.json                       # Root Vercel config
└── README.md
```

---

## 🔑 Key Design Decisions

### "Yield Pays First, Principal Stays Productive"

Every stablecoin deposited into NEXUS vaults **immediately enters Aave V3**. There are no idle funds. The ERC-4626 `totalAssets()` reads `aToken.balanceOf()` directly — vault share pricing reflects real-time Aave lending yields. This is creative treasury management: users earn passive yield while their principal remains liquid through vault shares.

### Honest Privacy Architecture

We responded to feedback that "'privacy-first' and 'anonymous yield farming' claims are misleading" by:

1. **Removing all "anonymous" and "privacy-first" marketing language**
2. **Documenting exactly what is and isn't private** (see [Privacy Model](#-privacy-model--honest-claims))
3. **Shipping real privacy features** — commitment-based deposits, nullifier withdrawals, relayer support, and username abstraction
4. **Acknowledging limitations** — no ZK proofs yet, vault activity is public, timing correlation is possible

### Aave V3 Rounding Handling

Aave V3 can lose 1-2 units on supply/withdraw (dust rounding). The Privacy Pool's `withdraw()` uses `min(amount, aToken.balanceOf(this))` to gracefully handle this — no reverts from rounding.

---

## 📊 Wave 6 Improvements

Wave 6 delivered the most significant upgrades to the protocol:

| Improvement | Details |
|-------------|---------|
| **NexusPrivacyPool** | New contract — commitment/nullifier privacy with Aave V3 yield |
| **6 Mainnet Contracts** | All contracts deployed and verified on Polygon |
| **Real Aave Integration** | No mocks — real `supply()` and `withdraw()` on Aave V3 Pool |
| **Dark Emerald UI** | Complete frontend redesign with dark theme + emerald accents |
| **Username Payments** | @username registration + escrow + claim flow |
| **Dynamic Denominations** | Privacy pool supports 6 denominations (0.01 to 10,000 USDC) |
| **Approve-Before-Deposit** | Fixed race condition — `waitForTransactionReceipt` after approval |
| **Aave Rounding Fix** | Graceful handling of Aave V3 dust loss in privacy pool withdrawals |
| **Mock Data Removal** | All frontend data reads from live contracts — no hardcoded values |
| **Contract-Driven UI** | Denominations, APY, risk levels read from on-chain |

---

## 📜 License

MIT

---

<p align="center">
  <strong>Built for the Polygon Buildathon 🟣</strong><br/>
  <em>Honest DeFi. Real yield. Meaningful privacy.</em>
</p>
