/**
 * Account Commands
 *
 * Manage customer accounts
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerAccountCommands(program) {
  const accounts = new Command('accounts')
    .alias('account')
    .description('Manage customer accounts');

  accounts
    .command('create')
    .description('Create a new account')
    .option('-f, --file <path>', 'JSON file with account data')
    .option('-d, --data <json>', 'JSON string with account data')
    .action(async (options) => {
      const spinner = ora('Creating account...').start();
      try {
        let data;
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        } else {
          spinner.fail('No data provided');
          console.error(chalk.red('Error: Provide data with --file or --data'));
          process.exit(1);
        }

        const result = await post('/v1/accounts', data);
        spinner.succeed('Account created');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to create account');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  accounts
    .command('get <id>')
    .description('Retrieve an account by ID or account number')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching account ${id}...`).start();
      try {
        const data = await get(`/v1/accounts/${id}`);
        spinner.succeed('Account retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch account');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  accounts
    .command('update <id>')
    .description('Update an account')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .action(async (id, options) => {
      const spinner = ora(`Updating account ${id}...`).start();
      try {
        let data;
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        } else {
          spinner.fail('No data provided');
          console.error(chalk.red('Error: Provide data with --file or --data'));
          process.exit(1);
        }

        const result = await put(`/v1/accounts/${id}`, data);
        spinner.succeed('Account updated');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to update account');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  accounts
    .command('summary <id>')
    .description('Retrieve account summary')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching account summary for ${id}...`).start();
      try {
        const data = await get(`/v1/accounts/${id}/summary`);
        spinner.succeed('Account summary retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch account summary');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  accounts
    .command('billing-documents <id>')
    .description('List billing documents for an account')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '20')
    .action(async (id, options) => {
      const spinner = ora(`Fetching billing documents for account ${id}...`).start();
      try {
        const params = {
          page: options.page,
          pageSize: options.pageSize,
        };
        const data = await get(`/v1/accounts/${id}/billing-documents`, params);
        spinner.succeed('Billing documents retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch billing documents');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(accounts);
}
