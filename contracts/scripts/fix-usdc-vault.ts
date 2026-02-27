import * as fs from "fs";
import { ethers } from "hardhat";
import * as path from "path";

/**
 * Fix USDC Vault — Redeploy with correct native USDC aToken
 * 
 * The original deployment used bridged USDC.e aToken (0x625E77...)
 * instead of native USDC aToken (0xA4D940...)
 */

const NATIVE_USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const CORRECT_ATOKEN = "0xA4D94019934D8333Ef880ABFFbF2FDd611C762BD"; // Native USDC aToken

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("🔧 USDC Vault Fix — Redeploying with correct aToken\n");
  console.log("   Deployer:", deployer.address);
  console.log("   Balance:", ethers.formatEther(balance), "MATIC");
  console.log("   Old aToken (WRONG):", "0x625E7708f30cA75bfd92586e17077590C60eb4cD (bridged USDC.e)");
  console.log("   New aToken (CORRECT):", CORRECT_ATOKEN, "(native USDC)\n");

  // Deploy new NexusVault directly (not via factory since factory can only create one per asset)
  console.log("📦 Deploying new USDC Vault...");
  const NexusVault = await ethers.getContractFactory("NexusVault");
  const vault = await NexusVault.deploy(
    NATIVE_USDC,
    CORRECT_ATOKEN,
    "Nexus USDC Vault",
    "nxUSDC",
    "Low-risk USDC vault powered by Aave V3 on Polygon",
    1 // low risk
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("   ✅ New USDC Vault deployed to:", vaultAddress);

  // Verify aToken
  const storedAToken = await vault.aToken();
  console.log("   ✅ Stored aToken:", storedAToken);
  console.log("   ✅ Match:", storedAToken.toLowerCase() === CORRECT_ATOKEN.toLowerCase());

  // Update polygon.json
  const deploymentPath = path.join(__dirname, "..", "deployments", "polygon.json");
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const oldAddress = deployment.contracts.USDC_VAULT;
  deployment.contracts.USDC_VAULT = vaultAddress;
  deployment.aTokens.USDC = CORRECT_ATOKEN;
  deployment.timestamp = new Date().toISOString();
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));

  console.log("\n📝 Updated deployments/polygon.json");
  console.log("   Old USDC_VAULT:", oldAddress);
  console.log("   New USDC_VAULT:", vaultAddress);
  console.log("\n🎉 USDC Vault fix complete! Update frontend config.ts with new address.");
}

main().catch((error) => {
  console.error("❌ Fix failed:", error);
  process.exit(1);
});
