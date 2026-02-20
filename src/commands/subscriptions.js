/**
 * Subscription Commands
 *
 * Manage subscriptions
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerSubscriptionCommands(program) {
  const subscriptions = new Command('subscriptions')
    .alias('subs')
    .description('Manage subscriptions');

  subscriptions
    .command('create')
    .description('Create a new subscription')
    .option('-f, --file <path>', 'JSON file with subscription data')
    .option('-d, --data <json>', 'JSON string with subscription data')
    .action(async (options) => {
      const spinner = ora('Creating subscription...').start();
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

        const result = await post('/v1/subscriptions', data);
        spinner.succeed('Subscription created');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to create subscription');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  subscriptions
    .command('get <key>')
    .description('Retrieve a subscription by key (ID or subscription number)')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (key, options) => {
      const spinner = ora(`Fetching subscription ${key}...`).start();
      try {
        const data = await get(`/v1/subscriptions/${key}`);
        spinner.succeed('Subscription retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch subscription');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  subscriptions
    .command('update <key>')
    .description('Update a subscription')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .action(async (key, options) => {
      const spinner = ora(`Updating subscription ${key}...`).start();
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

        const result = await put(`/v1/subscriptions/${key}`, data);
        spinner.succeed('Subscription updated');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to update subscription');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  subscriptions
    .command('cancel <key>')
    .description('Cancel a subscription')
    .option('-f, --file <path>', 'JSON file with cancellation data')
    .option('-d, --data <json>', 'JSON string with cancellation data')
    .action(async (key, options) => {
      const spinner = ora(`Cancelling subscription ${key}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await put(`/v1/subscriptions/${key}/cancel`, data);
        spinner.succeed('Subscription cancelled');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to cancel subscription');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  subscriptions
    .command('renew <key>')
    .description('Renew a subscription')
    .option('-f, --file <path>', 'JSON file with renewal data')
    .option('-d, --data <json>', 'JSON string with renewal data')
    .action(async (key, options) => {
      const spinner = ora(`Renewing subscription ${key}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await put(`/v1/subscriptions/${key}/renew`, data);
        spinner.succeed('Subscription renewed');
        console.log(formatOutput(result));
      } catch (error) {
        spinner.fail('Failed to renew subscription');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  subscriptions
    .command('preview')
    .description('Preview subscription changes')
    .option('-f, --file <path>', 'JSON file with preview data')
    .option('-d, --data <json>', 'JSON string with preview data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Generating subscription preview...').start();
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

        const result = await post('/v1/subscriptions/preview', data);
        spinner.succeed('Subscription preview generated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to generate preview');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(subscriptions);
}
