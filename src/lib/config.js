/**
 * Configuration Management
 *
 * Handles API credentials and configuration using conf package
 */

import Conf from 'conf';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

const config = new Conf({
  projectName: 'zuora-cli',
  defaults: {
    clientId: process.env.ZUORA_CLIENT_ID || '',
    clientSecret: process.env.ZUORA_CLIENT_SECRET || '',
    baseUrl: process.env.ZUORA_BASE_URL || 'https://rest.zuora.com',
    environment: process.env.ZUORA_ENVIRONMENT || 'production',
  },
});

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export function getConfig(key) {
  return config.get(key);
}

/**
 * Set configuration value
 * @param {string} key - Configuration key
 * @param {*} value - Configuration value
 */
export function setConfig(key, value) {
  config.set(key, value);
}

/**
 * Get all configuration
 * @returns {Object} All configuration values
 */
export function getAllConfig() {
  return config.store;
}

/**
 * Delete configuration value
 * @param {string} key - Configuration key
 */
export function deleteConfig(key) {
  config.delete(key);
}

/**
 * Clear all configuration
 */
export function clearConfig() {
  config.clear();
}

/**
 * Get OAuth client credentials from config or environment
 * @returns {Object} Client credentials
 * @throws {Error} If credentials are not configured
 */
export function getCredentials() {
  const clientId = getConfig('clientId') || process.env.ZUORA_CLIENT_ID;
  const clientSecret = getConfig('clientSecret') || process.env.ZUORA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'OAuth credentials not configured. Set them with:\n' +
      '  zuora config set clientId YOUR_CLIENT_ID\n' +
      '  zuora config set clientSecret YOUR_CLIENT_SECRET\n\n' +
      'Or set ZUORA_CLIENT_ID and ZUORA_CLIENT_SECRET environment variables.\n' +
      'Create OAuth clients at: https://www.zuora.com/apps/admin.do#oauth'
    );
  }

  return { clientId, clientSecret };
}

/**
 * Get base URL from config or environment
 * @returns {string} Base URL
 */
export function getBaseUrl() {
  const env = getConfig('environment') || process.env.ZUORA_ENVIRONMENT || 'production';

  // Environment-specific base URLs
  const urls = {
    production: 'https://rest.zuora.com',
    sandbox: 'https://rest.apisandbox.zuora.com',
    'us-production': 'https://rest.zuora.com',
    'us-sandbox': 'https://rest.apisandbox.zuora.com',
    'us-cloud': 'https://rest.na.zuora.com',
    'us-cloud-sandbox': 'https://rest.sandbox.na.zuora.com',
    'eu-production': 'https://rest.eu.zuora.com',
    'eu-sandbox': 'https://rest.sandbox.eu.zuora.com',
  };

  return getConfig('baseUrl') || urls[env] || urls.production;
}

/**
 * Get environment name
 * @returns {string} Environment name
 */
export function getEnvironment() {
  return getConfig('environment') || process.env.ZUORA_ENVIRONMENT || 'production';
}
