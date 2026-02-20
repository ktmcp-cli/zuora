# Zuora CLI - AI Agent Usage Guide

This guide is designed for AI agents (like Claude, GPT-4, etc.) to effectively use the Zuora CLI.

## Quick Start for Agents

### 1. Configuration Check

Before making any API calls, verify OAuth credentials are configured:

```bash
zuora config get clientId
zuora config get clientSecret
```

If not set, configure them:

```bash
zuora config set clientId YOUR_CLIENT_ID
zuora config set clientSecret YOUR_CLIENT_SECRET
zuora config set environment production  # or sandbox
```

### 2. Common Workflows

#### Create Account and Subscription

```bash
# Step 1: Create account
zuora accounts create --file account.json

# Step 2: Get account ID from response (e.g., A00000001)

# Step 3: Create subscription for the account
zuora subscriptions create --file subscription.json
# (subscription.json must include "accountKey": "A00000001")
```

#### Process Payment and Generate Invoice

```bash
# Step 1: List invoices for account
zuora invoices list --account-id A00000001 --format json

# Step 2: Get unpaid invoice ID (e.g., INV-00001)

# Step 3: Create payment for invoice
zuora payments create --data '{
  "accountId": "A00000001",
  "amount": 100.00,
  "effectiveDate": "2024-01-15",
  "paymentMethodId": "PM-00001",
  "type": "Electronic",
  "status": "Processed"
}'

# Step 4: Email invoice to customer
zuora invoices email INV-00001 --email customer@example.com
```

#### Handle Refunds and Credits

```bash
# Step 1: Create credit memo from invoice
zuora credit-memos create-from-invoice INV-00001 --data '{
  "items": [
    {
      "amount": 50.00,
      "comment": "Partial refund for service issue"
    }
  ]
}'

# Step 2: Get credit memo ID from response (e.g., CM-00001)

# Step 3: Post the credit memo
zuora credit-memos post CM-00001

# Step 4: Email credit memo
zuora credit-memos email CM-00001

# Step 5: Process refund if needed
zuora payments refund PMT-00001 --data '{"refundAmount":50.00}'
```

#### Manage Subscription Lifecycle

```bash
# Preview subscription change
zuora subscriptions preview --file preview.json --format json

# Update subscription
zuora subscriptions update SUB-00001 --file update.json

# Renew subscription
zuora subscriptions renew SUB-00001

# Cancel subscription (end of term)
zuora subscriptions cancel SUB-00001 --data '{
  "cancellationPolicy": "EndOfLastInvoicePeriod",
  "cancellationEffectiveDate": "2024-12-31"
}'
```

## Output Parsing

### JSON Format (Recommended for Agents)

Always use `--format json` when you need to parse the output programmatically:

```bash
zuora accounts get A00000001 --format json
```

This returns structured JSON that's easy to parse:

```json
{
  "success": true,
  "id": "8ad09e208a7a84c0018a7d0c8a0e002d",
  "accountNumber": "A00000001",
  "name": "Example Corporation",
  "balance": 100.00,
  "currency": "USD",
  "status": "Active"
}
```

### Pretty Format (Human-Readable)

Default format for terminal display. Use when showing results to humans:

```bash
zuora accounts summary A00000001
```

## Error Handling

### Common Errors and Solutions

**401 Unauthorized**
```bash
# Check credentials
zuora config get clientId
zuora config get clientSecret

# Re-set if needed
zuora config set clientId NEW_CLIENT_ID
zuora config set clientSecret NEW_CLIENT_SECRET
```

**404 Not Found**
- Verify the resource ID/key is correct
- Check that resource exists in the current environment (production vs sandbox)

**422 Validation Error**
- Read the error message carefully - it shows which fields are invalid
- Check data format matches Zuora API requirements
- Verify required fields are present

## Best Practices for Agents

### 1. Always Check Configuration First

Before executing any command, verify credentials are set:

```bash
zuora config list
```

### 2. Use JSON Format for Parsing

When you need to extract data from responses:

```bash
zuora accounts get A00000001 --format json | jq '.accountNumber'
```

### 3. Handle Multi-Step Operations

Many operations require multiple steps. Always capture IDs from responses:

```bash
# Create account and capture ID
ACCOUNT_ID=$(zuora accounts create --file account.json --format json | jq -r '.accountNumber')

# Use captured ID in next step
zuora subscriptions create --data "{\"accountKey\":\"$ACCOUNT_ID\",...}"
```

### 4. Use Files for Complex Data

For complex payloads, use JSON files instead of inline data:

```bash
# Good - using file
zuora subscriptions create --file subscription.json

# Avoid - inline complex JSON
zuora subscriptions create --data '{"accountKey":"A00000001","autoRenew":true,...}'
```

### 5. Check Environment

Different environments have different data. Verify which environment you're using:

```bash
zuora config get environment
zuora config get baseUrl
```

## Data Structure Examples

### Account Creation

```json
{
  "name": "Example Corp",
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

### Subscription Creation

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
      "productRatePlanId": "PLAN-00001"
    }
  ]
}
```

### Payment Creation

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

## Environment-Specific Considerations

### Production vs Sandbox

Always be aware of which environment you're operating in:

```bash
# Production
zuora config set environment production

# Sandbox (for testing)
zuora config set environment sandbox
```

**Important**: Data in production is real customer data. Always use sandbox for testing.

### Regional Endpoints

Zuora has different regional endpoints:

- `production` - US Production (https://rest.zuora.com)
- `us-cloud` - US Cloud Production (https://rest.na.zuora.com)
- `eu-production` - EU Production (https://rest.eu.zuora.com)

Set the appropriate environment based on your tenant location.

## Debugging Tips

### 1. Enable Verbose Output

For debugging, use JSON format to see full API responses:

```bash
zuora accounts get A00000001 --format json
```

### 2. Check API Documentation

If unsure about data formats, refer to:
https://developer.zuora.com/v1-api-reference/

### 3. Test in Sandbox First

Before running operations in production:

```bash
# Switch to sandbox
zuora config set environment sandbox

# Test operation
zuora accounts create --file account.json

# Switch back to production
zuora config set environment production
```

## Rate Limiting

Zuora enforces rate limits. The CLI will warn you when approaching limits:

```
Warning: Only 5/100 API calls remaining in this window
```

If you see this warning frequently:
- Space out your API calls
- Use batch operations where possible
- Contact Zuora to increase your rate limits

## Security Best Practices

### 1. Use Environment Variables

For automated/scripted usage, use environment variables instead of storing credentials in config:

```bash
export ZUORA_CLIENT_ID=your_client_id
export ZUORA_CLIENT_SECRET=your_client_secret
zuora accounts list
```

### 2. Rotate Credentials Regularly

OAuth clients should be rotated periodically for security:

```bash
# Update to new credentials
zuora config set clientId NEW_CLIENT_ID
zuora config set clientSecret NEW_CLIENT_SECRET
```

### 3. Clear Config When Done

If using shared systems, clear config after use:

```bash
zuora config clear
```

## Common Use Cases

### 1. Monthly Billing Run

```bash
# Get account summary
zuora accounts summary A00000001 --format json

# Generate billing documents
zuora accounts billing-documents A00000001 --format json

# Email invoices
for invoice in $(zuora invoices list --account-id A00000001 --format json | jq -r '.invoices[].id'); do
  zuora invoices email $invoice
done
```

### 2. Subscription Upgrade

```bash
# Preview the upgrade
zuora subscriptions preview --file upgrade-preview.json --format json

# Apply the upgrade
zuora subscriptions update SUB-00001 --file upgrade.json
```

### 3. Customer Churn Analysis

```bash
# List all subscriptions
zuora subscriptions get SUB-00001 --format json

# Check cancellation status
# Extract relevant metrics
```

## Troubleshooting

### "Authentication failed" Error

1. Check credentials are set: `zuora config list`
2. Verify credentials are valid in Zuora admin panel
3. Ensure OAuth client has proper permissions
4. Check environment matches your tenant

### "Resource not found" Error

1. Verify the ID/key is correct
2. Check you're in the right environment (production vs sandbox)
3. Ensure resource exists and hasn't been deleted

### "Validation error" Messages

1. Read the error message - it shows which field is invalid
2. Check data types (string vs number vs date)
3. Verify required fields are present
4. Consult API documentation for field requirements

## Additional Resources

- Zuora API Reference: https://developer.zuora.com/v1-api-reference/
- Knowledge Center: https://knowledgecenter.zuora.com/
- API Changelog: https://developer.zuora.com/docs/get-started/changelogs/v1-api-changelog/
- OAuth Setup Guide: https://knowledgecenter.zuora.com/Billing/Tenant_Management/A_Administrator_Settings/Manage_Users#Create_an_OAuth_Client_for_a_User

## Support

For Zuora API-specific questions, consult the official documentation at https://developer.zuora.com/

For CLI-specific issues, check the GitHub repository or create an issue.
