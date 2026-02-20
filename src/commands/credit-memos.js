/**
 * Credit Memo Commands
 *
 * Manage credit memos
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, del, downloadFile, formatOutput } from '../lib/api.js';
import { readFileSync, writeFileSync } from 'fs';

export function registerCreditMemoCommands(program) {
  const creditMemos = new Command('credit-memos')
    .alias('credits')
    .description('Manage credit memos');

  creditMemos
    .command('list')
    .description('List credit memos for an account')
    .option('--account-id <id>', 'Account ID or account number', null)
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '20')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      if (!options.accountId) {
        console.error(chalk.red('Error: --account-id is required'));
        process.exit(1);
      }

      const spinner = ora('Fetching credit memos...').start();
      try {
        const params = {
          accountId: options.accountId,
          page: options.page,
          pageSize: options.pageSize,
        };
        const data = await get('/v1/credit-memos', params);
        spinner.succeed('Credit memos retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch credit memos');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('get <id>')
    .description('Retrieve a credit memo by ID')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching credit memo ${id}...`).start();
      try {
        const data = await get(`/v1/credit-memos/${id}`);
        spinner.succeed('Credit memo retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch credit memo');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('create-from-invoice <invoiceId>')
    .description('Create credit memo from invoice')
    .option('-f, --file <path>', 'JSON file with credit memo data')
    .option('-d, --data <json>', 'JSON string with credit memo data')
    .action(async (invoiceId, options) => {
      const spinner = ora(`Creating credit memo from invoice ${invoiceId}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await post(`/v1/invoices/${invoiceId}/credit-memos`, data);
        spinner.succeed('Credit memo created');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to create credit memo');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('update <id>')
    .description('Update a credit memo')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .action(async (id, options) => {
      const spinner = ora(`Updating credit memo ${id}...`).start();
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

        const result = await put(`/v1/credit-memos/${id}`, data);
        spinner.succeed('Credit memo updated');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to update credit memo');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('delete <id>')
    .description('Delete a credit memo')
    .action(async (id) => {
      const spinner = ora(`Deleting credit memo ${id}...`).start();
      try {
        const result = await del(`/v1/credit-memos/${id}`);
        spinner.succeed('Credit memo deleted');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to delete credit memo');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('cancel <id>')
    .description('Cancel a credit memo')
    .action(async (id) => {
      const spinner = ora(`Cancelling credit memo ${id}...`).start();
      try {
        const result = await put(`/v1/credit-memos/${id}/cancel`, {});
        spinner.succeed('Credit memo cancelled');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to cancel credit memo');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('post <id>')
    .description('Post a credit memo')
    .action(async (id) => {
      const spinner = ora(`Posting credit memo ${id}...`).start();
      try {
        const result = await put(`/v1/credit-memos/${id}/post`, {});
        spinner.succeed('Credit memo posted');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to post credit memo');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('email <id>')
    .description('Email a credit memo to customer')
    .option('--email <address>', 'Email address (optional)')
    .action(async (id, options) => {
      const spinner = ora(`Emailing credit memo ${id}...`).start();
      try {
        const data = options.email ? { emailAddresses: [options.email] } : {};
        const result = await post(`/v1/credit-memos/${id}/email`, data);
        spinner.succeed('Credit memo email sent');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to send credit memo email');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  creditMemos
    .command('pdf <id>')
    .description('Generate PDF for a credit memo')
    .option('-o, --output <path>', 'Output file path')
    .action(async (id, options) => {
      const spinner = ora(`Generating PDF for credit memo ${id}...`).start();
      try {
        const result = await post(`/v1/credit-memos/${id}/pdf`, {});

        if (result.success && result.fileId) {
          const buffer = await downloadFile(`/v1/files/${result.fileId}`);

          if (options.output) {
            writeFileSync(options.output, buffer);
            spinner.succeed(`PDF saved to ${options.output}`);
          } else {
            spinner.succeed('PDF generated');
            console.log(chalk.yellow('Tip: Use -o/--output to save the PDF to a file'));
            console.log(formatOutput(result));
          }
        } else {
          spinner.succeed('PDF generation initiated');
          console.log(formatOutput(result));
        }
      } catch (error) {
        spinner.fail('Failed to generate PDF');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(creditMemos);
}
