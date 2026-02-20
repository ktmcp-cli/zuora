#!/usr/bin/env node

const { showWelcomeMessage } = require('../src/lib/welcome');
showWelcomeMessage('zuora');

/**
 * Zuora CLI - Main Entry Point
 *
 * Production-ready CLI for Zuora Billing API
 * Subscription and billing management
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

// Import command modules
import { registerConfigCommands } from '../src/commands/config.js';
import { registerAccountCommands } from '../src/commands/accounts.js';
import { registerSubscriptionCommands } from '../src/commands/subscriptions.js';
import { registerInvoiceCommands } from '../src/commands/invoices.js';
import { registerPaymentCommands } from '../src/commands/payments.js';
import { registerProductCommands } from '../src/commands/products.js';
import { registerCreditMemoCommands } from '../src/commands/credit-memos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('zuora')
  .description(chalk.cyan('Zuora Billing API CLI - Subscription and billing management'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ zuora config set clientId YOUR_CLIENT_ID
  $ zuora config set clientSecret YOUR_CLIENT_SECRET
  $ zuora accounts get A00000001
  $ zuora subscriptions list
  $ zuora invoices list --account-id A00000001
  $ zuora payments create -f payment.json

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://developer.zuora.com/v1-api-reference/')}

${chalk.bold('Create OAuth Client:')}
  ${chalk.blue('https://www.zuora.com/apps/admin.do#oauth')}

${chalk.bold('Available Environments:')}
  production, sandbox, us-cloud, us-cloud-sandbox, eu-production, eu-sandbox
  Set with: zuora config set environment <env>
`);

// Register all command modules
registerConfigCommands(program);
registerAccountCommands(program);
registerSubscriptionCommands(program);
registerInvoiceCommands(program);
registerPaymentCommands(program);
registerProductCommands(program);
registerCreditMemoCommands(program);

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
