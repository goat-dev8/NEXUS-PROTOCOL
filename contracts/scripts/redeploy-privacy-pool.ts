import { ethers } from "hardhat";

/**
 * Redeploy NexusPrivacyPool with Aave rounding fix
 * Then add small denominations and register in factory
 */

const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const USDC_ATOKEN = "0xA4D94019934D8333Ef880ABFFbF2FDd611C762BD";
const AAVE_POOL = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
const FACTORY = "0x7e597aCDbA0Eb5bdb323Ea9e76272a736B5D3831";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("MATIC balance:", ethers.formatEther(balance));

  // Deploy NexusPrivacyPool
  console.log("\n--- Deploying NexusPrivacyPool (fixed) ---");
  const PrivacyPool = await ethers.getContractFactory("NexusPrivacyPool");
  
  // Initial denominations: 100 USDC, 1000 USDC, 10000 USDC (in 6-decimal units)
  const initialDenominations = [
    ethers.parseUnits("100", 6),
    ethers.parseUnits("1000", 6),
    ethers.parseUnits("10000", 6),
  ];

  const privacyPool = await PrivacyPool.deploy(
    USDC,
    USDC_ATOKEN,
    6,
    initialDenominations,
  );
  await privacyPool.waitForDeployment();
  const poolAddress = await privacyPool.getAddress();
  console.log("NexusPrivacyPool deployed:", poolAddress);

  // Add small denominations for testing
  console.log("\nAdding small denominations...");
  
  const smallDenoms = [
    { amount: 10000n, label: "0.01 USDC" },  // 0.01 USDC
    { amount: 100000n, label: "0.1 USDC" },  // 0.1 USDC  
    { amount: 1000000n, label: "1 USDC" },    // 1 USDC
  ];

  for (const d of smallDenoms) {
    const tx = await privacyPool.addDenomination(d.amount);
    await tx.wait();
    console.log(`  Added ${d.label} denomination`);
  }

  // Register in factory
  console.log("\nRegistering in NexusFactory...");
  const factory = await ethers.getContractAt("NexusFactory", FACTORY);
  const tx = await factory.setPrivacyPool(USDC, poolAddress);
  await tx.wait();
  console.log("Privacy Pool registered for USDC in factory");

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("NexusPrivacyPool:", poolAddress);
  console.log("Denominations: 100, 1000, 10000, 0.01, 0.1, 1 USDC");
  console.log("\nUpdate config.ts PRIVACY_POOL address to:", poolAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
