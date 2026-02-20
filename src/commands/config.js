/**
 * Configuration Commands
 *
 * Manage CLI configuration settings
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig, setConfig, getAllConfig, clearConfig } from '../lib/config.js';

export function registerConfigCommands(program) {
  const config = new Command('config')
    .description('Manage configuration settings');

  config
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action((key, value) => {
      try {
        setConfig(key, value);
        console.log(chalk.green(`✓ Configuration updated: ${key} = ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('get <key>')
    .description('Get a configuration value')
    .action((key) => {
      try {
        const value = getConfig(key);
        if (value === undefined) {
          console.log(chalk.yellow(`Configuration key '${key}' not found`));
        } else {
          console.log(chalk.cyan(key), '=', value);
        }
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('list')
    .description('List all configuration')
    .action(() => {
      try {
        const allConfig = getAllConfig();
        console.log(chalk.bold('Current Configuration:'));
        console.log(JSON.stringify(allConfig, null, 2));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('clear')
    .description('Clear all configuration')
    .action(() => {
      try {
        clearConfig();
        console.log(chalk.green('✓ Configuration cleared'));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(config);
}
