# Zuora CLI - Quick Start Guide

Get up and running with the Zuora CLI in under 5 minutes.

## Prerequisites

- Node.js >= 18.0.0
- Zuora account (Production or Sandbox)
- OAuth client credentials

## Installation

```bash
npm install -g @ktmcp-cli/zuora
```

## Setup

### 1. Create OAuth Client in Zuora

1. Log into your Zuora tenant
2. Go to **Settings** → **Administration Settings** → **Manage Users**
3. Create or select an API user
4. Click **Manage OAuth Clients**
5. Click **Create New Client**
6. Copy the **Client ID** and **Client Secret**

### 2. Configure the CLI

```bash
# Set OAuth credentials
zuora config set clientId YOUR_CLIENT_ID
zuora config set clientSecret YOUR_CLIENT_SECRET

# Set environment (optional - defaults to production)
zuora config set environment sandbox

# Verify configuration
zuora config list
```

### 3. Test the Connection

```bash
# List products in your catalog
zuora products list

# You should see a list of products or an empty array if no products exist
```

## Common Commands

### Account Management

```bash
# Create account
zuora accounts create --file account.json

# Get account details
zuora accounts get A00000001

# Get account summary
zuora accounts summary A00000001
```

### Subscription Management

```bash
# Create subscription
zuora subscriptions create --file subscription.json

# Get subscription
zuora subscriptions get SUB-00001

# Cancel subscription
zuora subscriptions cancel SUB-00001
```

### Invoice Management

```bash
# List invoices for account
zuora invoices list --account-id A00000001

# Email invoice
zuora invoices email INV-00001

# Download invoice PDF
zuora invoices pdf INV-00001 --output invoice.pdf
```

## Sample Data Files

### account.json

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
  }
}
```

### subscription.json

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
      "productRatePlanId": "YOUR_PLAN_ID"
    }
  ]
}
```

## Tips

### Use JSON Output for Scripting

```bash
# Get account ID for use in scripts
ACCOUNT_ID=$(zuora accounts get A00000001 --format json | jq -r '.basicInfo.accountNumber')
echo $ACCOUNT_ID
```

### Check Help for Any Command

```bash
# General help
zuora --help

# Command-specific help
zuora accounts --help
zuora invoices email --help
```

### Switch Environments Easily

```bash
# Use sandbox for testing
zuora config set environment sandbox

# Switch to production
zuora config set environment production
```

## Troubleshooting

### "Authentication failed" Error

1. Verify credentials are correct:
   ```bash
   zuora config list
   ```

2. Check OAuth client in Zuora admin panel is active

3. Ensure API user has proper permissions

### "Resource not found" Error

- Verify the ID is correct
- Check you're in the right environment (production vs sandbox)
- Ensure the resource exists

### Need More Help?

- Check `AGENT.md` for detailed usage guide
- Read `README.md` for complete documentation
- Visit https://developer.zuora.com/v1-api-reference/

## Next Steps

1. **Explore commands**: Run `zuora --help` to see all available commands
2. **Read AGENT.md**: Learn advanced usage patterns
3. **Check examples**: See `README.md` for comprehensive examples
4. **Test workflows**: Try creating an account → subscription → invoice flow

---

*Happy billing!* 🚀
