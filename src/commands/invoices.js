/**
 * Invoice Commands
 *
 * Manage invoices and billing documents
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, downloadFile, formatOutput } from '../lib/api.js';
import { readFileSync, writeFileSync } from 'fs';

export function registerInvoiceCommands(program) {
  const invoices = new Command('invoices')
    .alias('invoice')
    .description('Manage invoices');

  invoices
    .command('get <id>')
    .description('Retrieve an invoice by ID')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching invoice ${id}...`).start();
      try {
        const data = await get(`/v1/invoices/${id}`);
        spinner.succeed('Invoice retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch invoice');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  invoices
    .command('list')
    .description('List invoices for an account')
    .option('--account-id <id>', 'Account ID or account number', null)
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '20')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      if (!options.accountId) {
        console.error(chalk.red('Error: --account-id is required'));
        process.exit(1);
      }

      const spinner = ora('Fetching invoices...').start();
      try {
        const params = {
          page: options.page,
          pageSize: options.pageSize,
        };
        const data = await get(`/v1/accounts/${options.accountId}/invoices`, params);
        spinner.succeed('Invoices retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch invoices');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  invoices
    .command('update <id>')
    .description('Update an invoice')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .action(async (id, options) => {
      const spinner = ora(`Updating invoice ${id}...`).start();
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

        const result = await put(`/v1/invoices/${id}`, data);
        spinner.succeed('Invoice updated');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to update invoice');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  invoices
    .command('email <id>')
    .description('Email an invoice to customer')
    .option('--email <address>', 'Email address (optional, uses account contact if not provided)')
    .action(async (id, options) => {
      const spinner = ora(`Emailing invoice ${id}...`).start();
      try {
        const data = options.email ? { emailAddresses: [options.email] } : {};
        const result = await post(`/v1/invoices/${id}/email`, data);
        spinner.succeed('Invoice email sent');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to send invoice email');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  invoices
    .command('pdf <id>')
    .description('Generate PDF for an invoice')
    .option('-o, --output <path>', 'Output file path')
    .action(async (id, options) => {
      const spinner = ora(`Generating PDF for invoice ${id}...`).start();
      try {
        const buffer = await downloadFile(`/v1/invoices/${id}/files`);

        if (options.output) {
          writeFileSync(options.output, buffer);
          spinner.succeed(`PDF saved to ${options.output}`);
        } else {
          spinner.succeed('PDF generated');
          console.log(chalk.yellow('Tip: Use -o/--output to save the PDF to a file'));
        }
      } catch (error) {
        spinner.fail('Failed to generate PDF');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  invoices
    .command('write-off <id>')
    .description('Write off an invoice')
    .option('-f, --file <path>', 'JSON file with write-off data')
    .option('-d, --data <json>', 'JSON string with write-off data')
    .action(async (id, options) => {
      const spinner = ora(`Writing off invoice ${id}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await put(`/v1/invoices/${id}/write-off`, data);
        spinner.succeed('Invoice written off');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to write off invoice');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  invoices
    .command('reverse <id>')
    .description('Reverse an invoice')
    .option('-f, --file <path>', 'JSON file with reversal data')
    .option('-d, --data <json>', 'JSON string with reversal data')
    .action(async (id, options) => {
      const spinner = ora(`Reversing invoice ${id}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await put(`/v1/invoices/${id}/reverse`, data);
        spinner.succeed('Invoice reversed');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to reverse invoice');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(invoices);
}
