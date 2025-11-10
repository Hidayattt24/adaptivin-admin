/**
 * PRE-BUILD CHECK SCRIPT - ADAPTIVIN ADMIN
 * Memastikan semua requirement terpenuhi sebelum build
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(COLORS[color] + message + COLORS.reset);
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

function logHeader(message) {
  console.log("\n" + COLORS.cyan + "━".repeat(80) + COLORS.reset);
  log(`  ${message}`, "bright");
  console.log(COLORS.cyan + "━".repeat(80) + COLORS.reset);
}

let passed = 0;
let failed = 0;
let warnings = 0;

function checkEnvironmentVariables() {
  logHeader("🔍 Checking Environment Variables");

  const envFile = path.join(rootDir, ".env.local");
  const envExampleFile = path.join(rootDir, ".env.example");

  if (!fs.existsSync(envFile)) {
    logWarning(".env.local not found");
    warnings++;
  } else {
    logSuccess(".env.local file found");
    passed++;

    const envContent = fs.readFileSync(envFile, "utf-8");
    const requiredVars = [
      "NEXT_PUBLIC_API_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    requiredVars.forEach((varName) => {
      if (envContent.includes(varName)) {
        logSuccess(`  ${varName} is defined`);
      } else {
        logWarning(`  ${varName} is NOT defined`);
        warnings++;
      }
    });
  }

  if (fs.existsSync(envExampleFile)) {
    logSuccess(".env.example file found");
    passed++;
  }
}

function checkRequiredStructure() {
  logHeader("📁 Checking Project Structure");

  const requiredFiles = [
    "package.json",
    "next.config.ts",
    "tsconfig.json",
    "middleware.ts",
  ];

  const requiredDirs = [
    "src",
    "src/app",
    "src/components",
    "src/lib",
    "src/contexts",
    "public",
  ];

  requiredFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      logSuccess(`File: ${file}`);
      passed++;
    } else {
      logError(`File missing: ${file}`);
      failed++;
    }
  });

  requiredDirs.forEach((dir) => {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      logSuccess(`Directory: ${dir}`);
      passed++;
    } else {
      logError(`Directory missing: ${dir}`);
      failed++;
    }
  });
}

function checkDependencies() {
  logHeader("📦 Checking Dependencies");

  const packageJsonPath = path.join(rootDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    logError("package.json not found");
    failed++;
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  const nodeModulesPath = path.join(rootDir, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    logWarning("node_modules not found - run npm install");
    warnings++;
  } else {
    logSuccess("node_modules directory exists");
    passed++;
  }

  const criticalDeps = [
    "next",
    "react",
    "react-dom",
    "axios",
    "@supabase/supabase-js",
    "@mui/material",
  ];

  criticalDeps.forEach((dep) => {
    if (packageJson.dependencies?.[dep]) {
      logSuccess(`  ${dep} v${packageJson.dependencies[dep]}`);
    } else {
      logError(`  ${dep} is NOT installed`);
      failed++;
    }
  });
}

function checkCriticalSourceFiles() {
  logHeader("📄 Checking Critical Source Files");

  const criticalFiles = [
    { path: "src/app/layout.tsx", name: "Root Layout" },
    { path: "src/app/page.tsx", name: "Home Page" },
    { path: "src/contexts/AuthContext.tsx", name: "Auth Context" },
    { path: "src/lib/supabaseClient.ts", name: "Supabase Client" },
    { path: "middleware.ts", name: "Middleware" },
  ];

  criticalFiles.forEach(({ path: filePath, name }) => {
    const fullPath = path.join(rootDir, filePath);
    if (fs.existsSync(fullPath)) {
      logSuccess(`${name}: ${filePath}`);
      passed++;
    } else {
      logError(`${name} missing: ${filePath}`);
      failed++;
    }
  });
}

function checkAPIIntegration() {
  logHeader("🔌 Checking API Integration");

  const apiFiles = [
    "src/lib/api/responseHelper.ts",
    "src/lib/api/auth.ts",
    "src/lib/api/user.ts",
    "src/lib/api/kelas.ts",
    "src/lib/api/sekolah.ts",
  ];

  apiFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      logSuccess(`API: ${file}`);
      passed++;
    } else {
      logWarning(`API file not found: ${file}`);
      warnings++;
    }
  });
}

function runPreBuildChecks() {
  console.clear();
  log("\n" + "=".repeat(80), "cyan");
  log("  🔍 ADAPTIVIN ADMIN - PRE-BUILD CHECK", "bright");
  log("=".repeat(80) + "\n", "cyan");

  logInfo(`Checking project at: ${rootDir}`);
  logInfo(`Started at: ${new Date().toLocaleString()}\n`);

  checkEnvironmentVariables();
  checkRequiredStructure();
  checkDependencies();
  checkCriticalSourceFiles();
  checkAPIIntegration();

  console.log("\n" + COLORS.cyan + "=".repeat(80) + COLORS.reset);
  log("  📊 CHECK SUMMARY", "bright");
  console.log(COLORS.cyan + "=".repeat(80) + COLORS.reset);

  log(`\n✅ Passed: ${passed}`, "green");
  log(`❌ Failed: ${failed}`, failed > 0 ? "red" : "green");
  log(`⚠️  Warnings: ${warnings}`, warnings > 0 ? "yellow" : "green");

  const total = passed + failed + warnings;
  log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%\n`, "blue");

  if (failed === 0 && warnings === 0) {
    log("🎉 ALL CHECKS PASSED! Ready to build for deployment! 🚀", "green");
  } else if (failed === 0) {
    log(
      "✅ All critical checks passed. Warnings can be addressed but not blocking.",
      "green"
    );
  } else {
    log("❌ Some critical checks failed. Please fix before building.", "red");
  }

  log(`\nFinished at: ${new Date().toLocaleString()}`, "blue");
  console.log(COLORS.cyan + "=".repeat(80) + COLORS.reset + "\n");

  if (failed > 0 || warnings > 0) {
    logHeader("💡 RECOMMENDATIONS");

    if (warnings > 0) {
      log("\nTo resolve warnings:", "yellow");
      log("1. Create/update .env.local with all required variables");
      log("2. Run: npm install (if dependencies are missing)");
    }

    if (failed > 0) {
      log("\nTo resolve failures:", "red");
      log("1. Fix missing critical files");
      log("2. Ensure all dependencies are installed");
      log("3. Verify project structure is correct");
    }
  }

  log("\n📝 Next Steps:", "blue");
  log("1. Run: npm run build (to test local build)");
  log("2. Run: npm run start (to test production build locally)");
  log("3. Deploy to Vercel Desktop or Vercel CLI\n");

  process.exit(failed > 0 ? 1 : 0);
}

runPreBuildChecks();
