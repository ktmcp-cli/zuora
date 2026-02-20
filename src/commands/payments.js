/**
 * Payment Commands
 *
 * Manage payments and payment processing
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerPaymentCommands(program) {
  const payments = new Command('payments')
    .alias('payment')
    .description('Manage payments');

  payments
    .command('create')
    .description('Create a payment')
    .option('-f, --file <path>', 'JSON file with payment data')
    .option('-d, --data <json>', 'JSON string with payment data')
    .action(async (options) => {
      const spinner = ora('Creating payment...').start();
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

        const result = await post('/v1/payments', data);
        spinner.succeed('Payment created');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to create payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('get <id>')
    .description('Retrieve a payment by ID')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching payment ${id}...`).start();
      try {
        const data = await get(`/v1/payments/${id}`);
        spinner.succeed('Payment retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('update <id>')
    .description('Update a payment')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .action(async (id, options) => {
      const spinner = ora(`Updating payment ${id}...`).start();
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

        const result = await put(`/v1/payments/${id}`, data);
        spinner.succeed('Payment updated');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to update payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('refund <id>')
    .description('Create a refund for a payment')
    .option('-f, --file <path>', 'JSON file with refund data')
    .option('-d, --data <json>', 'JSON string with refund data')
    .action(async (id, options) => {
      const spinner = ora(`Creating refund for payment ${id}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await post(`/v1/payments/${id}/refunds`, data);
        spinner.succeed('Refund created');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to create refund');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('reverse <id>')
    .description('Reverse a payment')
    .option('-f, --file <path>', 'JSON file with reversal data')
    .option('-d, --data <json>', 'JSON string with reversal data')
    .action(async (id, options) => {
      const spinner = ora(`Reversing payment ${id}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await post(`/v1/payments/${id}/reverse`, data);
        spinner.succeed('Payment reversed');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to reverse payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('list')
    .description('List payments for an account')
    .option('--account-id <id>', 'Account ID or account number', null)
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '20')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      if (!options.accountId) {
        console.error(chalk.red('Error: --account-id is required'));
        process.exit(1);
      }

      const spinner = ora('Fetching payments...').start();
      try {
        const params = {
          page: options.page,
          pageSize: options.pageSize,
        };
        const data = await get(`/v1/accounts/${options.accountId}/payments`, params);
        spinner.succeed('Payments retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch payments');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(payments);
}
