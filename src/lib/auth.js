/**
 * Authentication Module
 *
 * Handles OAuth 2.0 authentication for Zuora API
 */

import axios from 'axios';
import { getCredentials, getBaseUrl } from './config.js';

// Cache token in memory
let cachedToken = null;
let tokenExpiry = null;

/**
 * Generate OAuth 2.0 bearer token
 * @returns {Promise<string>} Bearer token
 */
export async function getBearerToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const { clientId, clientSecret } = getCredentials();
  const baseUrl = getBaseUrl();

  try {
    const response = await axios.post(
      `${baseUrl}/oauth/token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    cachedToken = response.data.access_token;

    // Set expiry to 90% of token lifetime to refresh before expiration
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiry = Date.now() + (expiresIn * 1000 * 0.9);

    return cachedToken;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `OAuth authentication failed: ${error.response.data.error_description || error.response.data.error || 'Unknown error'}`
      );
    }
    throw new Error(`OAuth authentication failed: ${error.message}`);
  }
}

/**
 * Get authentication headers for API requests
 * @returns {Promise<Object>} Headers object with bearer token
 */
export async function getAuthHeaders() {
  const token = await getBearerToken();

  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

/**
 * Clear cached token (force refresh on next request)
 */
export function clearTokenCache() {
  cachedToken = null;
  tokenExpiry = null;
}

/**
 * Validate OAuth credentials format
 * @param {string} clientId - Client ID to validate
 * @param {string} clientSecret - Client Secret to validate
 * @returns {boolean} True if format is valid
 */
export function validateCredentialsFormat(clientId, clientSecret) {
  return (
    typeof clientId === 'string' &&
    clientId.length >= 10 &&
    typeof clientSecret === 'string' &&
    clientSecret.length >= 10
  );
}
