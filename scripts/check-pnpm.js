#!/usr/bin/env node

if (
  !process.env.npm_config_user_agent ||
  !process.env.npm_config_user_agent.includes("pnpm")
) {
  console.error("\x1b[31mError: Please use pnpm instead of npm\x1b[0m");
  console.error("\x1b[33mRun: pnpm install\x1b[0m");
  process.exit(1);
}
