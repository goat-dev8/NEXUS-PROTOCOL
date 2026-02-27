import * as fs from "fs";
import { ethers } from "hardhat";
import * as path from "path";

/**
 * NEXUS Protocol Deployment Script — Wave 6
 * Deploys to Polygon Mainnet (Chain ID: 137)
 *
 * Contracts deployed:
 * 1. StealthRegistry  — Username-based payments with escrow
 * 2. NexusFactory      — Vault factory + registry
 * 3. NexusVault (USDC) — USDC yield vault via factory.createVault()
 * 4. NexusVault (USDT) — USDT yield vault via factory.createVault()
 * 5. NexusVault (DAI)  — DAI yield vault via factory.createVault()
 * 6. NexusPrivacyPool  — Commitment-based privacy pool (USDC)
 */

// Polygon Mainnet Token Addresses
const TOKENS = {
  USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
};

// Aave V3 aToken Addresses on Polygon
const ATOKENS = {
  USDC: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
  USDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
  DAI: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
};

// Privacy Pool denominations (in token smallest units)
const USDC_DENOMINATIONS = [
  ethers.parseUnits("100", 6),    // 100 USDC
  ethers.parseUnits("1000", 6),   // 1,000 USDC
  ethers.parseUnits("10000", 6),  // 10,000 USDC
];

async function main() {
  console.log("🚀 Starting NEXUS Protocol Wave 6 Deployment to Polygon Mainnet...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("📋 Deployment Configuration:");
  console.log("   Deployer:", deployer.address);
  console.log("   Balance:", ethers.formatEther(balance), "MATIC");
  console.log("   Network: Polygon Mainnet (Chain ID: 137)");
  console.log("   Contracts: 6 (StealthRegistry, NexusFactory, 3 Vaults, PrivacyPool)\n");

  const deployedAddresses: Record<string, string> = {};

  // 1. Deploy StealthRegistry
  console.log("1️⃣  Deploying StealthRegistry...");
  const StealthRegistry = await ethers.getContractFactory("StealthRegistry");
  const stealthRegistry = await StealthRegistry.deploy();
  await stealthRegistry.waitForDeployment();
  const stealthRegistryAddress = await stealthRegistry.getAddress();
  deployedAddresses.STEALTH_REGISTRY = stealthRegistryAddress;
  console.log("   ✅ StealthRegistry deployed to:", stealthRegistryAddress);

  // 2. Deploy NexusFactory
  console.log("\n2️⃣  Deploying NexusFactory...");
  const NexusFactory = await ethers.getContractFactory("NexusFactory");
  const nexusFactory = await NexusFactory.deploy();
  await nexusFactory.waitForDeployment();
  const nexusFactoryAddress = await nexusFactory.getAddress();
  deployedAddresses.NEXUS_FACTORY = nexusFactoryAddress;
  console.log("   ✅ NexusFactory deployed to:", nexusFactoryAddress);

  // 3. Create USDC Vault via Factory
  console.log("\n3️⃣  Creating USDC Vault via Factory...");
  const tx1 = await nexusFactory.createVault(
    TOKENS.USDC,
    ATOKENS.USDC,
    "Nexus USDC Vault",
    "nxUSDC",
    "Earn yield on USDC through Aave V3. Low risk, stable returns.",
    1
  );
  await tx1.wait();
  const usdcVaultAddress = await nexusFactory.getVaultForAsset(TOKENS.USDC);
  deployedAddresses.USDC_VAULT = usdcVaultAddress;
  console.log("   ✅ USDC Vault created at:", usdcVaultAddress);

  // 4. Create USDT Vault via Factory
  console.log("\n4️⃣  Creating USDT Vault via Factory...");
  const tx2 = await nexusFactory.createVault(
    TOKENS.USDT,
    ATOKENS.USDT,
    "Nexus USDT Vault",
    "nxUSDT",
    "Earn yield on USDT through Aave V3. Low risk, stable returns.",
    1
  );
  await tx2.wait();
  const usdtVaultAddress = await nexusFactory.getVaultForAsset(TOKENS.USDT);
  deployedAddresses.USDT_VAULT = usdtVaultAddress;
  console.log("   ✅ USDT Vault created at:", usdtVaultAddress);

  // 5. Create DAI Vault via Factory
  console.log("\n5️⃣  Creating DAI Vault via Factory...");
  const tx3 = await nexusFactory.createVault(
    TOKENS.DAI,
    ATOKENS.DAI,
    "Nexus DAI Vault",
    "nxDAI",
    "Earn yield on DAI through Aave V3. Low risk, stable returns.",
    1
  );
  await tx3.wait();
  const daiVaultAddress = await nexusFactory.getVaultForAsset(TOKENS.DAI);
  deployedAddresses.DAI_VAULT = daiVaultAddress;
  console.log("   ✅ DAI Vault created at:", daiVaultAddress);

  // 6. Deploy NexusPrivacyPool
  console.log("\n6️⃣  Deploying NexusPrivacyPool (USDC)...");
  const NexusPrivacyPool = await ethers.getContractFactory("NexusPrivacyPool");
  const privacyPool = await NexusPrivacyPool.deploy(
    TOKENS.USDC,
    ATOKENS.USDC,
    6,
    USDC_DENOMINATIONS
  );
  await privacyPool.waitForDeployment();
  const privacyPoolAddress = await privacyPool.getAddress();
  deployedAddresses.PRIVACY_POOL = privacyPoolAddress;
  console.log("   ✅ NexusPrivacyPool deployed to:", privacyPoolAddress);

  // Register privacy pool in factory
  console.log("\n🔗 Registering privacy pool in factory...");
  const tx4 = await nexusFactory.setPrivacyPool(privacyPoolAddress);
  await tx4.wait();
  console.log("   ✅ Privacy pool registered in factory");

  // Save deployment data
  console.log("\n📝 Saving deployment addresses...");

  const deploymentData = {
    network: "polygon",
    chainId: 137,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    wave: 6,
    contracts: deployedAddresses,
    tokens: TOKENS,
    aTokens: ATOKENS,
    privacyPoolDenominations: {
      USDC: ["100", "1000", "10000"],
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "polygon.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 NEXUS PROTOCOL WAVE 6 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses (6 contracts):");
  console.log("   STEALTH_REGISTRY:", deployedAddresses.STEALTH_REGISTRY);
  console.log("   NEXUS_FACTORY:   ", deployedAddresses.NEXUS_FACTORY);
  console.log("   USDC_VAULT:      ", deployedAddresses.USDC_VAULT);
  console.log("   USDT_VAULT:      ", deployedAddresses.USDT_VAULT);
  console.log("   DAI_VAULT:       ", deployedAddresses.DAI_VAULT);
  console.log("   PRIVACY_POOL:    ", deployedAddresses.PRIVACY_POOL);
  console.log("\n💾 Deployment saved to: deployments/polygon.json");
  console.log("\n🔗 Frontend .env variables:");
  console.log(`   VITE_STEALTH_REGISTRY_ADDRESS=${deployedAddresses.STEALTH_REGISTRY}`);
  console.log(`   VITE_NEXUS_FACTORY_ADDRESS=${deployedAddresses.NEXUS_FACTORY}`);
  console.log(`   VITE_USDC_VAULT_ADDRESS=${deployedAddresses.USDC_VAULT}`);
  console.log(`   VITE_USDT_VAULT_ADDRESS=${deployedAddresses.USDT_VAULT}`);
  console.log(`   VITE_DAI_VAULT_ADDRESS=${deployedAddresses.DAI_VAULT}`);
  console.log(`   VITE_PRIVACY_POOL_ADDRESS=${deployedAddresses.PRIVACY_POOL}`);
  console.log("=".repeat(60));

  return deployedAddresses;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
