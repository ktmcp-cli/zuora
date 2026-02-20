![Banner](https://raw.githubusercontent.com/ktmcp-cli/zuora/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# Zuora CLI

Production-ready command-line interface for the [Zuora Billing API](https://developer.zuora.com/) - subscription and billing management for SaaS businesses.

> **⚠️ Unofficial CLI** - This tool is not officially sponsored, endorsed, or maintained by Zuora. It is an independent project built on the public Zuora Billing API. API documentation: https://developer.zuora.com/v1-api-reference/

## Features

- Complete coverage of Zuora Billing API v1 endpoints
- OAuth 2.0 authentication with automatic token management
- Simple, intuitive command structure
- JSON and pretty-print output formats
- File-based and inline data input
- Comprehensive error handling with detailed error messages
- Persistent configuration storage
- Progress indicators for long-running operations
- Multi-environment support (production, sandbox, US/EU regions)

## Why CLI > MCP

### The MCP Problem

Model Context Protocol (MCP) servers introduce unnecessary complexity and failure points for API access:

1. **Extra Infrastructure Layer**: MCP requires running a separate server process that sits between your AI agent and the API
2. **Cognitive Overhead**: Agents must learn MCP-specific tool schemas on top of the actual API semantics
3. **Debugging Nightmare**: When things fail, you're debugging three layers (AI → MCP → API) instead of two (AI → API)
4. **Limited Flexibility**: MCP servers often implement a subset of API features, forcing you to extend or work around limitations
5. **Maintenance Burden**: Every API change requires updating both the MCP server and documentation

### The CLI Advantage

A well-designed CLI is the superior abstraction for AI agents:

1. **Zero Runtime Dependencies**: No server process to start, monitor, or crash
2. **Direct API Access**: One hop from agent to API with transparent HTTP calls
3. **Human + AI Usable**: Same tool works perfectly for both developers and agents
4. **Self-Documenting**: Built-in `--help` text provides complete usage information
5. **Composable**: Standard I/O allows piping, scripting, and integration with other tools
6. **Better Errors**: Direct error messages from the API without translation layers
7. **Instant Debugging**: `--format json` gives you the exact API response for inspection

**Example Complexity Comparison:**

MCP approach:
```
AI Agent → MCP Tool Schema → MCP Server → HTTP Request → API → Response Chain (reverse)
```

CLI approach:
```
AI Agent → Shell Command → HTTP Request → API → Direct Response
```

The CLI is simpler, faster, more reliable, and easier to debug.

## Installation

```bash
npm install -g @ktmcp-cli/zuora
```

Or install locally:

```bash
cd zuora
npm install
npm link
```

## Configuration

### Set OAuth Credentials

Create an OAuth client in Zuora:
1. Go to https://www.zuora.com/apps/admin.do#oauth
2. Create a new OAuth client
3. Copy the Client ID and Client Secret

```bash
zuora config set clientId YOUR_CLIENT_ID
zuora config set clientSecret YOUR_CLIENT_SECRET
```

### Set Environment (Optional)

Default is `production`. Available environments:

- `production` - https://rest.zuora.com
- `sandbox` - https://rest.apisandbox.zuora.com
- `us-cloud` - https://rest.na.zuora.com
- `us-cloud-sandbox` - https://rest.sandbox.na.zuora.com
- `eu-production` - https://rest.eu.zuora.com
- `eu-sandbox` - https://rest.sandbox.eu.zuora.com

```bash
zuora config set environment sandbox
```

### Environment Variables

Alternatively, use environment variables:

```bash
export ZUORA_CLIENT_ID=your_client_id
export ZUORA_CLIENT_SECRET=your_client_secret
export ZUORA_ENVIRONMENT=production  # Optional
export ZUORA_BASE_URL=https://rest.zuora.com  # Optional
```

### View Configuration

```bash
# Show all config
zuora config list

# Get specific value
zuora config get clientId

# Clear all config
zuora config clear
```

## Usage

### General Syntax

```bash
zuora <resource> <action> [options]
```

### Available Resources

- `accounts` (alias: `account`) - Manage customer accounts
- `subscriptions` (alias: `subs`) - Manage subscriptions
- `invoices` (alias: `invoice`) - Manage invoices
- `payments` (alias: `payment`) - Manage payments
- `products` (alias: `catalog`) - Manage product catalog
- `credit-memos` (alias: `credits`) - Manage credit memos
- `config` - Manage CLI configuration

### Global Options

- `-f, --format <format>` - Output format: `json` or `pretty` (default: pretty)
- `-h, --help` - Display help for command
- `-v, --version` - Output version number

## Examples

### Configuration

```bash
# Set OAuth credentials
zuora config set clientId abc123
zuora config set clientSecret xyz789

# Set environment
zuora config set environment sandbox

# View configuration
zuora config list
```

### Accounts

```bash
# Create an account
zuora accounts create --file account.json

# Get account details
zuora accounts get A00000001

# Update an account
zuora accounts update A00000001 --data '{"name":"Updated Company"}'

# Get account summary
zuora accounts summary A00000001

# List billing documents for account
zuora accounts billing-documents A00000001
```

### Subscriptions

```bash
# Create a subscription
zuora subscriptions create --file subscription.json

# Get subscription details
zuora subscriptions get SUB-00001

# Update subscription
zuora subscriptions update SUB-00001 --file update.json

# Cancel subscription
zuora subscriptions cancel SUB-00001 --data '{"cancellationEffectiveDate":"2024-12-31"}'

# Renew subscription
zuora subscriptions renew SUB-00001

# Preview subscription changes
zuora subscriptions preview --file preview-data.json
```

### Invoices

```bash
# List invoices for account
zuora invoices list --account-id A00000001 --page 1 --page-size 20

# Get invoice details
zuora invoices get INV-00001

# Update invoice
zuora invoices update INV-00001 --data '{"dueDate":"2024-12-31"}'

# Email invoice to customer
zuora invoices email INV-00001

# Email to specific address
zuora invoices email INV-00001 --email customer@example.com

# Generate and download PDF
zuora invoices pdf INV-00001 --output invoice.pdf

# Write off invoice
zuora invoices write-off INV-00001

# Reverse invoice
zuora invoices reverse INV-00001
```

### Payments

```bash
# Create a payment
zuora payments create --file payment.json

# Get payment details
zuora payments get PMT-00001

# Update payment
zuora payments update PMT-00001 --file update.json

# Create refund
zuora payments refund PMT-00001 --data '{"refundAmount":50.00}'

# Reverse payment
zuora payments reverse PMT-00001

# List payments for account
zuora payments list --account-id A00000001
```

### Products

```bash
# List all products in catalog
zuora products list

# Get product details
zuora products get PROD-00001

# List with pagination
zuora products list --page 2 --page-size 50
```

### Credit Memos

```bash
# List credit memos for account
zuora credit-memos list --account-id A00000001

# Get credit memo details
zuora credit-memos get CM-00001

# Create credit memo from invoice
zuora credit-memos create-from-invoice INV-00001 --file credit-data.json

# Update credit memo
zuora credit-memos update CM-00001 --data '{"comments":"Updated notes"}'

# Delete credit memo (if not posted)
zuora credit-memos delete CM-00001

# Cancel credit memo
zuora credit-memos cancel CM-00001

# Post credit memo
zuora credit-memos post CM-00001

# Email credit memo
zuora credit-memos email CM-00001

# Generate PDF
zuora credit-memos pdf CM-00001 --output credit-memo.pdf
```

## Data Formats

### Creating an Account

Example `account.json`:

```json
{
  "name": "Example Corporation",
  "currency": "USD",
  "billCycleDay": 1,
  "paymentTerm": "Net 30",
  "billToContact": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postalCode": "94105"
  },
  "soldToContact": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postalCode": "94105"
  }
}
```

### Creating a Subscription

Example `subscription.json`:

```json
{
  "accountKey": "A00000001",
  "autoRenew": true,
  "contractEffectiveDate": "2024-01-01",
  "termType": "TERMED",
  "initialTerm": 12,
  "renewalTerm": 12,
  "subscribeToRatePlans": [
    {
      "productRatePlanId": "PLAN-00001",
      "chargeOverrides": [
        {
          "productRatePlanChargeId": "CHARGE-00001",
          "pricing": {
            "recurringFlatFee": {
              "listPrice": 99.00
            }
          }
        }
      ]
    }
  ]
}
```

### Creating a Payment

Example `payment.json`:

```json
{
  "accountId": "A00000001",
  "amount": 100.00,
  "effectiveDate": "2024-01-15",
  "paymentMethodId": "PM-00001",
  "type": "Electronic",
  "status": "Processed"
}
```

## Error Handling

The CLI provides clear error messages for common issues:

- **401 Unauthorized** - Check your OAuth credentials (clientId/clientSecret)
- **403 Forbidden** - Insufficient permissions for this operation
- **404 Not Found** - Resource doesn't exist
- **422 Validation Error** - Invalid data format (shows specific field errors)
- **429 Rate Limit** - Too many requests (shows retry time)
- **500/502/503 Server Error** - Zuora API issue (retry later)

## Rate Limiting

The API includes rate limit headers in responses. The CLI warns you when fewer than 10 requests remain in your current window.

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev -- accounts list

# Run directly
node bin/zuora.js accounts list
```

## API Documentation

- Official API Reference: https://developer.zuora.com/v1-api-reference/
- API Changelog: https://developer.zuora.com/docs/get-started/changelogs/v1-api-changelog/
- OAuth Setup: https://www.zuora.com/apps/admin.do#oauth
- Knowledge Center: https://knowledgecenter.zuora.com/

## Supported Operations

This CLI covers the most common Zuora Billing operations:

### Accounts
- Create, retrieve, update accounts
- Get account summary
- List billing documents

### Subscriptions
- Create, retrieve, update subscriptions
- Cancel and renew subscriptions
- Preview subscription changes

### Invoices
- List and retrieve invoices
- Update, reverse, write-off invoices
- Email invoices and generate PDFs

### Payments
- Create, retrieve, update payments
- Process refunds and reversals
- List payment history

### Products
- List product catalog
- Retrieve product details

### Credit Memos
- Create from invoices
- Update, cancel, post, delete
- Email and generate PDFs

## License

MIT

## Support

For issues and feature requests, please refer to the official Zuora API documentation or create an issue in the GitHub repository.
