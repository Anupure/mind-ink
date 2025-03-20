#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs-extra";
import { program } from "commander";
import path from "path";
import chalk from "chalk";

program
  .name("turbo-init")
  .description("Initialize a new TurboRepo with the current setup")
  .argument("<project-name>", "Name of the new TurboRepo")
  .action((projectName) => {
    const targetPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(targetPath)) {
      console.log(chalk.red(`❌ Directory '${projectName}' already exists.`));
      process.exit(1);
    }

    console.log(chalk.blue(`🚀 Initializing TurboRepo in ${projectName}...`));

    // Copy current repo structure
    fs.copySync(path.resolve(__dirname, "../.."), targetPath, {
      filter: (src) => !src.includes("node_modules") && !src.includes(".git")
    });

    // Go to the new directory
    process.chdir(targetPath);

    // Reinstall dependencies
    console.log(chalk.green("📦 Installing dependencies..."));
    execSync("pnpm install", { stdio: "inherit" });

    console.log(chalk.green("✅ TurboRepo setup complete!"));
    console.log(chalk.cyan(`\nNext steps:\n  cd ${projectName}\n  pnpm dev\n`));
  });

program.parse();
