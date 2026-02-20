/**
 * Product Commands
 *
 * Manage product catalog
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, formatOutput } from '../lib/api.js';

export function registerProductCommands(program) {
  const products = new Command('products')
    .alias('catalog')
    .description('Manage product catalog');

  products
    .command('list')
    .description('List all products in catalog')
    .option('--page <number>', 'Page number', '1')
    .option('--page-size <number>', 'Page size', '40')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching product catalog...').start();
      try {
        const params = {
          page: options.page,
          pageSize: options.pageSize,
        };
        const data = await get('/v1/catalog/products', params);
        spinner.succeed('Product catalog retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch product catalog');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  products
    .command('get <id>')
    .description('Retrieve a product by ID')
    .option('-f, --format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching product ${id}...`).start();
      try {
        const data = await get(`/v1/catalog/products/${id}`);
        spinner.succeed('Product retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch product');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(products);
}
