---
name: pdfvector-api
description: Use PDF Vector public APIs for document, invoice, identity, bank statement, and academic workflows, including parsing, ask, extract, search, citations, paper graphs, similar papers, grants, pricing, and page-separated output with includePages.
---

# PDF Vector API

Use this skill when a user wants to call PDF Vector public APIs from an agent or app. It covers document, invoice, identity, bank statement, and academic APIs.

## Sources

- API reference: https://global.pdfvector.com/api/reference
- TypeScript SDK: https://www.npmjs.com/package/@pdfvector/client
- Website: https://www.pdfvector.com

## Authentication

Use a PDF Vector API key in the `Authorization` header:

```text
Authorization: Bearer YOUR_API_KEY
```

Never print, log, commit, or echo a real API key. Use `YOUR_API_KEY` in examples.

## TypeScript SDK

Install the official client when the runtime is JavaScript or TypeScript:

```bash
npm install @pdfvector/client
```

Create a client:

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });
```

For custom or self-hosted instances, pass the instance domain:

```typescript
const client = createClient({
  domain: "global.pdfvector.com",
  apiKey: "YOUR_API_KEY",
});
```

## Page-Separated Output

Set `includePages: true` when the caller needs page-separated markdown. PDF Vector still returns the full document in top-level `markdown`.

Relevant response fields:

- `markdown`: full parsed markdown for the document or paper.
- `pages`: page-level markdown array, available when `includePages` is true.
- `pages[].pageNumber`: 1-based page number.
- `pages[].markdown`: markdown for that page.
- `pageCount`: total pages.
- `model`: model tier used.
- `credits`: credits charged.
- `requestId`: request identifier for support/debugging.
- `html`: full HTML for Document Parse when using the `max` model.

## Credit Costs

| API | nano | mini | pro | max | Unit |
|-----|------|------|-----|-----|------|
| Document Parse | 1 | 2 | 4 | 8 | /page |
| Document Ask | 2 | 4 | 8 | 16 | /page |
| Document Extract | 2 | 4 | 8 | 16 | /page |
| Identity Parse | - | - | 6 | 10 | /page |
| Identity Ask | 6 | 10 | 14 | 18 | /page |
| Identity Extract | 6 | 10 | 14 | 18 | /page |
| Invoice Parse | - | - | 6 | 10 | /page |
| Invoice Ask | 6 | 10 | 14 | 18 | /page |
| Invoice Extract | 6 | 10 | 14 | 18 | /page |
| Bank Statement Parse | - | - | 6 | 10 | /page |
| Bank Statement Ask | 6 | 10 | 14 | 18 | /page |
| Bank Statement Extract | 6 | 10 | 14 | 18 | /page |
| Academic Search | 2 | 2 | 2 | 2 | /request |
| Academic Fetch | 2 | 2 | 2 | 2 | /request |
| Academic Parse | 1 | 2 | 4 | 8 | /page |
| Academic Find Citations | 2 | 2 | 2 | 2 | /sentence |
| Academic Paper Graph | 2+ | 2+ | 2+ | 2+ | /request |
| Academic Similar Papers | 3 | 3 | 3 | 3 | /request |
| Academic Search Grants | 2 | 2 | 2 | 2 | /request |

## Model Guidance

Use `model: "auto"` by default. Other model tiers are `"nano"`, `"mini"`, `"pro"`, and `"max"`.

Choose higher tiers when the document is complex, layout-heavy, or needs stronger extraction quality. Use `max` for Document Parse when the caller needs HTML output.

## Agent Workflow

1. Ask for or locate the PDF Vector API key without exposing it.
2. Choose `document.parse` for direct documents or `academic.parse` for papers and publication IDs.
3. Set `includePages: true` when the user asks for page-by-page output, citations by page, page summaries, or chunking by page.
4. Return `markdown` for the full result and `pages` when the caller needs page-level content.
5. Include `requestId` in debugging notes when a request fails.

## Public API Examples

## Document Parse

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/document/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: my-doc-123" \
  -d '{
    "url": "https://example.com/annual-report.pdf",
    "model": "max",
    "includePages": true
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.document.parse(
  { url: "https://example.com/annual-report.pdf", model: "max", includePages: true },
  { context: { documentId: "my-doc-123" } },
);

console.log(result.markdown);
console.log(result.pages?.[0]?.markdown);
console.log(`Pages: ${result.pageCount}, Model: ${result.model}`);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/document/parse",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "my-doc-123",
    },
    json={
        "url": "https://example.com/annual-report.pdf",
        "model": "max",
        "includePages": True,
    },
)
data = response.json()
print(data["markdown"], data["pages"][0]["markdown"], data["pageCount"])
```

### Example Response

```json
{
  "documentId": "my-doc-123",
  "markdown": "# Annual Report 2024\n\n## Executive Summary\nRevenue grew 23% year-over-year to $4.2B...",
  "pageCount": 5,
  "pages": [{ "pageNumber": 1, "markdown": "# Annual Report 2024\n\n## Executive Summary..." }],
  "model": "max",
  "html": "<h1>Annual Report 2024</h1><h2>Executive Summary</h2><p>Revenue grew 23% year-over-year to $4.2B...</p>",
  "credits": 40,
  "requestId": 42
}
```

## Document Ask

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/document/ask \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: my-doc-123" \
  -d '{
    "url": "https://example.com/annual-report.pdf",
    "question": "What was the total revenue in Q4?",
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.document.ask(
  {
    url: "https://example.com/annual-report.pdf",
    question: "What was the total revenue in Q4?",
    model: "max",
  },
  { context: { documentId: "my-doc-123" } },
);

console.log(result.markdown);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/document/ask",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "my-doc-123",
    },
    json={
        "url": "https://example.com/annual-report.pdf",
        "question": "What was the total revenue in Q4?",
        "model": "max",
    },
)
data = response.json()
print(data["markdown"])
```

### Example Response

```json
{
  "documentId": "my-doc-123",
  "markdown": "Based on the document, the total revenue in Q4 was $1.12B, representing a 15% increase from Q3 and a 23% year-over-year growth.",
  "model": "max",
  "requestId": 43
}
```

## Document Extract

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/document/extract \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: my-doc-123" \
  -d '{
    "url": "https://example.com/annual-report.pdf",
    "prompt": "Extract the company overview, fiscal year, revenue, net income, and key business segments",
    "schema": {
      "type": "object",
      "properties": {
        "companyName": { "type": "string" },
        "fiscalYear": { "type": "string" },
        "totalRevenue": { "type": "number" },
        "netIncome": { "type": "number" },
        "segments": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "revenue": { "type": "number" },
              "growthPercent": { "type": "number" }
            }
          }
        }
      }
    },
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.document.extract(
  {
    url: "https://example.com/annual-report.pdf",
    prompt: "Extract the company overview, fiscal year, revenue, net income, and key business segments",
    schema: {
      type: "object",
      properties: {
        companyName: { type: "string" },
        fiscalYear: { type: "string" },
        totalRevenue: { type: "number" },
        netIncome: { type: "number" },
        segments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              revenue: { type: "number" },
              growthPercent: { type: "number" },
            },
          },
        },
      },
    },
    model: "max",
  },
  { context: { documentId: "my-doc-123" } },
);

console.log(result.data);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/document/extract",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "my-doc-123",
    },
    json={
        "url": "https://example.com/annual-report.pdf",
        "prompt": "Extract the company overview, fiscal year, revenue, net income, and key business segments",
        "schema": {
            "type": "object",
            "properties": {
                "companyName": {"type": "string"},
                "fiscalYear": {"type": "string"},
                "totalRevenue": {"type": "number"},
                "netIncome": {"type": "number"},
                "segments": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "revenue": {"type": "number"},
                            "growthPercent": {"type": "number"},
                        },
                    },
                },
            },
        },
        "model": "max",
    },
)
data = response.json()
print(data["data"])
```

### Example Response

```json
{
  "documentId": "my-doc-123",
  "data": {
    "companyName": "Acme Corporation",
    "fiscalYear": "2024",
    "totalRevenue": 4200000000,
    "netIncome": 820000000,
    "segments": [
      { "name": "Cloud Services", "revenue": 2100000000, "growthPercent": 34 },
      { "name": "Enterprise Software", "revenue": 1400000000, "growthPercent": 18 },
      { "name": "Consulting", "revenue": 700000000, "growthPercent": 12 }
    ]
  },
  "model": "max",
  "requestId": 44
}
```

## Identity Parse

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/identity/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: passport-456" \
  -d '{
    "url": "https://example.com/passport-scan.jpg",
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.identity.parse(
  { url: "https://example.com/passport-scan.jpg", model: "max" },
  { context: { documentId: "passport-456" } },
);

console.log(result.markdown);
console.log(`Type: ${result.documentType}, Model: ${result.model}`);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/identity/parse",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "passport-456",
    },
    json={
        "url": "https://example.com/passport-scan.jpg",
        "model": "max",
    },
)
data = response.json()
print(data["markdown"])
```

### Example Response

```json
{
  "documentId": "passport-456",
  "markdown": "# Passport — John A. Smith\n\n**Full Name:** John Alexander Smith\n**Nationality:** United States\n**Date of Birth:** 1985-03-15\n**Expiry Date:** 2029-07-22",
  "pageCount": 1,
  "model": "max",
  "html": "<h1>Passport — John A. Smith</h1><p><strong>Full Name:</strong> John Alexander Smith</p><p><strong>Nationality:</strong> United States</p>",
  "documentType": "passport",
  "requestId": 42
}
```

## Identity Ask

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/identity/ask \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: passport-456" \
  -d '{
    "url": "https://example.com/passport-scan.jpg",
    "question": "What is the expiry date?",
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.identity.ask(
  {
    url: "https://example.com/passport-scan.jpg",
    question: "What is the expiry date?",
    model: "max",
  },
  { context: { documentId: "passport-456" } },
);

console.log(result.markdown);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/identity/ask",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "passport-456",
    },
    json={
        "url": "https://example.com/passport-scan.jpg",
        "question": "What is the expiry date?",
        "model": "max",
    },
)
data = response.json()
print(data["markdown"])
```

### Example Response

```json
{
  "documentId": "passport-456",
  "markdown": "The expiry date on the passport is July 22, 2029.",
  "model": "max",
  "requestId": 43
}
```

## Identity Extract

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/identity/extract \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: passport-456" \
  -d '{
    "url": "https://example.com/passport-scan.jpg",
    "prompt": "Extract the full name, date of birth, nationality, passport number, and expiry date",
    "schema": {
      "type": "object",
      "properties": {
        "fullName": { "type": "string" },
        "dateOfBirth": { "type": "string" },
        "nationality": { "type": "string" },
        "passportNumber": { "type": "string" },
        "expiryDate": { "type": "string" }
      }
    },
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.identity.extract(
  {
    url: "https://example.com/passport-scan.jpg",
    prompt: "Extract the full name, date of birth, nationality, passport number, and expiry date",
    schema: {
      type: "object",
      properties: {
        fullName: { type: "string" },
        dateOfBirth: { type: "string" },
        nationality: { type: "string" },
        passportNumber: { type: "string" },
        expiryDate: { type: "string" },
      },
    },
    model: "max",
  },
  { context: { documentId: "passport-456" } },
);

console.log(result.data);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/identity/extract",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "passport-456",
    },
    json={
        "url": "https://example.com/passport-scan.jpg",
        "prompt": "Extract the full name, date of birth, nationality, passport number, and expiry date",
        "schema": {
            "type": "object",
            "properties": {
                "fullName": {"type": "string"},
                "dateOfBirth": {"type": "string"},
                "nationality": {"type": "string"},
                "passportNumber": {"type": "string"},
                "expiryDate": {"type": "string"},
            },
        },
        "model": "max",
    },
)
data = response.json()
print(data["data"])
```

### Example Response

```json
{
  "documentId": "passport-456",
  "data": {
    "fullName": "John Alexander Smith",
    "dateOfBirth": "1985-03-15",
    "nationality": "United States",
    "passportNumber": "E12345678",
    "expiryDate": "2029-07-22"
  },
  "model": "max",
  "requestId": 44
}
```

## Invoice Parse

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/invoice/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: inv-2024-0892" \
  -d '{
    "url": "https://example.com/supplier-invoice.pdf",
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.invoice.parse(
  { url: "https://example.com/supplier-invoice.pdf", model: "max" },
  { context: { documentId: "inv-2024-0892" } },
);

console.log(result.markdown);
console.log(`Pages: ${result.pageCount}, Model: ${result.model}`);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/invoice/parse",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "inv-2024-0892",
    },
    json={
        "url": "https://example.com/supplier-invoice.pdf",
        "model": "max",
    },
)
data = response.json()
print(data["markdown"])
```

### Example Response

```json
{
  "documentId": "inv-2024-0892",
  "markdown": "# Invoice #INV-2024-0892\n\n**Vendor:** TechSupply Co.\n**Date:** 2024-11-15\n**Due Date:** 2024-12-15\n\n| Item | Qty | Price |\n|------|-----|-------|\n| Server Rack | 2 | $3,400.00 |\n| Network Switch | 4 | $1,200.00 |\n\n**Total: $4,600.00**",
  "pageCount": 1,
  "model": "max",
  "html": "<h1>Invoice #INV-2024-0892</h1><p><strong>Vendor:</strong> TechSupply Co.</p><table><tr><td>Server Rack</td><td>$3,400.00</td></tr></table>",
  "requestId": 42
}
```

## Invoice Ask

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/invoice/ask \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: inv-2024-0892" \
  -d '{
    "url": "https://example.com/supplier-invoice.pdf",
    "question": "What is the total amount due?",
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.invoice.ask(
  {
    url: "https://example.com/supplier-invoice.pdf",
    question: "What is the total amount due?",
    model: "max",
  },
  { context: { documentId: "inv-2024-0892" } },
);

console.log(result.markdown);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/invoice/ask",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "inv-2024-0892",
    },
    json={
        "url": "https://example.com/supplier-invoice.pdf",
        "question": "What is the total amount due?",
        "model": "max",
    },
)
data = response.json()
print(data["markdown"])
```

### Example Response

```json
{
  "documentId": "inv-2024-0892",
  "markdown": "The total amount due on invoice #INV-2024-0892 is $4,600.00, with a payment due date of December 15, 2024.",
  "model": "max",
  "requestId": 43
}
```

## Invoice Extract

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/invoice/extract \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: inv-2024-0892" \
  -d '{
    "url": "https://example.com/supplier-invoice.pdf",
    "prompt": "Extract vendor name, invoice number, date, total amount, and all line items",
    "schema": {
      "type": "object",
      "properties": {
        "vendor": { "type": "string" },
        "invoiceNumber": { "type": "string" },
        "date": { "type": "string" },
        "total": { "type": "number" },
        "lineItems": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "description": { "type": "string" },
              "quantity": { "type": "number" },
              "unitPrice": { "type": "number" },
              "amount": { "type": "number" }
            }
          }
        }
      }
    },
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.invoice.extract(
  {
    url: "https://example.com/supplier-invoice.pdf",
    prompt: "Extract vendor name, invoice number, date, total amount, and all line items",
    schema: {
      type: "object",
      properties: {
        vendor: { type: "string" },
        invoiceNumber: { type: "string" },
        date: { type: "string" },
        total: { type: "number" },
        lineItems: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              unitPrice: { type: "number" },
              amount: { type: "number" },
            },
          },
        },
      },
    },
    model: "max",
  },
  { context: { documentId: "inv-2024-0892" } },
);

console.log(result.data);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/invoice/extract",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "inv-2024-0892",
    },
    json={
        "url": "https://example.com/supplier-invoice.pdf",
        "prompt": "Extract vendor name, invoice number, date, total amount, and all line items",
        "schema": {
            "type": "object",
            "properties": {
                "vendor": {"type": "string"},
                "invoiceNumber": {"type": "string"},
                "date": {"type": "string"},
                "total": {"type": "number"},
                "lineItems": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "description": {"type": "string"},
                            "quantity": {"type": "number"},
                            "unitPrice": {"type": "number"},
                            "amount": {"type": "number"},
                        },
                    },
                },
            },
        },
        "model": "max",
    },
)
data = response.json()
print(data["data"])
```

### Example Response

```json
{
  "documentId": "inv-2024-0892",
  "data": {
    "vendor": "TechSupply Co.",
    "invoiceNumber": "INV-2024-0892",
    "date": "2024-11-15",
    "total": 4600.00,
    "lineItems": [
      { "description": "Server Rack", "quantity": 2, "unitPrice": 1700.00, "amount": 3400.00 },
      { "description": "Network Switch", "quantity": 4, "unitPrice": 300.00, "amount": 1200.00 }
    ]
  },
  "model": "max",
  "requestId": 44
}
```

## Bank Statement Parse

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/bankStatement/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: stmt-nov-2024" \
  -d '{
    "url": "https://example.com/monthly-statement.pdf",
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.bankStatement.parse(
  { url: "https://example.com/monthly-statement.pdf", model: "max" },
  { context: { documentId: "stmt-nov-2024" } },
);

console.log(result.markdown);
console.log(`Pages: ${result.pageCount}, Model: ${result.model}`);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/bankStatement/parse",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "stmt-nov-2024",
    },
    json={
        "url": "https://example.com/monthly-statement.pdf",
        "model": "max",
    },
)
data = response.json()
print(data["markdown"])
```

### Example Response

```json
{
  "documentId": "stmt-nov-2024",
  "markdown": "# Bank Statement — Chase Checking ****4821\n\n**Period:** Nov 1 – Nov 30, 2024\n**Opening Balance:** $12,450.33\n**Closing Balance:** $14,892.17\n\n| Date | Description | Amount |\n|------|-------------|--------|\n| 11/02 | Direct Deposit | +$5,200.00 |\n| 11/05 | Rent Payment | -$2,100.00 |",
  "pageCount": 3,
  "model": "max",
  "html": "<h1>Bank Statement — Chase Checking ****4821</h1><table><tr><td>11/02</td><td>Direct Deposit</td><td>+$5,200.00</td></tr></table>",
  "requestId": 42
}
```

## Bank Statement Ask

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/bankStatement/ask \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: stmt-nov-2024" \
  -d '{
    "url": "https://example.com/monthly-statement.pdf",
    "question": "What is the closing balance?",
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.bankStatement.ask(
  {
    url: "https://example.com/monthly-statement.pdf",
    question: "What is the closing balance?",
    model: "max",
  },
  { context: { documentId: "stmt-nov-2024" } },
);

console.log(result.markdown);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/bankStatement/ask",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "stmt-nov-2024",
    },
    json={
        "url": "https://example.com/monthly-statement.pdf",
        "question": "What is the closing balance?",
        "model": "max",
    },
)
data = response.json()
print(data["markdown"])
```

### Example Response

```json
{
  "documentId": "stmt-nov-2024",
  "markdown": "The closing balance for the statement period ending November 30, 2024 is $14,892.17.",
  "model": "max",
  "requestId": 43
}
```

## Bank Statement Extract

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/bankStatement/extract \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-pdfvector-document-id: stmt-nov-2024" \
  -d '{
    "url": "https://example.com/monthly-statement.pdf",
    "prompt": "Extract account holder, opening balance, closing balance, statement period, and all transactions",
    "schema": {
      "type": "object",
      "properties": {
        "accountHolder": { "type": "string" },
        "openingBalance": { "type": "number" },
        "closingBalance": { "type": "number" },
        "statementPeriod": { "type": "string" },
        "transactions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "date": { "type": "string" },
              "description": { "type": "string" },
              "amount": { "type": "number" },
              "balance": { "type": "number" }
            }
          }
        }
      }
    },
    "model": "max"
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.bankStatement.extract(
  {
    url: "https://example.com/monthly-statement.pdf",
    prompt: "Extract account holder, opening balance, closing balance, statement period, and all transactions",
    schema: {
      type: "object",
      properties: {
        accountHolder: { type: "string" },
        openingBalance: { type: "number" },
        closingBalance: { type: "number" },
        statementPeriod: { type: "string" },
        transactions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              description: { type: "string" },
              amount: { type: "number" },
              balance: { type: "number" },
            },
          },
        },
      },
    },
    model: "max",
  },
  { context: { documentId: "stmt-nov-2024" } },
);

console.log(result.data);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/bankStatement/extract",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "x-pdfvector-document-id": "stmt-nov-2024",
    },
    json={
        "url": "https://example.com/monthly-statement.pdf",
        "prompt": "Extract account holder, opening balance, closing balance, statement period, and all transactions",
        "schema": {
            "type": "object",
            "properties": {
                "accountHolder": {"type": "string"},
                "openingBalance": {"type": "number"},
                "closingBalance": {"type": "number"},
                "statementPeriod": {"type": "string"},
                "transactions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "date": {"type": "string"},
                            "description": {"type": "string"},
                            "amount": {"type": "number"},
                            "balance": {"type": "number"},
                        },
                    },
                },
            },
        },
        "model": "max",
    },
)
data = response.json()
print(data["data"])
```

### Example Response

```json
{
  "documentId": "stmt-nov-2024",
  "data": {
    "accountHolder": "John A. Smith",
    "openingBalance": 12450.33,
    "closingBalance": 14892.17,
    "statementPeriod": "Nov 1 – Nov 30, 2024",
    "transactions": [
      { "date": "2024-11-02", "description": "Direct Deposit - Employer", "amount": 5200.00, "balance": 17650.33 },
      { "date": "2024-11-05", "description": "Rent Payment", "amount": -2100.00, "balance": 15550.33 },
      { "date": "2024-11-12", "description": "Grocery Store", "amount": -187.43, "balance": 15362.90 },
      { "date": "2024-11-18", "description": "Utility Bill", "amount": -245.73, "balance": 15117.17 }
    ]
  },
  "model": "max",
  "requestId": 44
}
```

## Academic Search

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/academic/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "transformer attention mechanism",
    "providers": ["semantic-scholar", "pubmed", "openalex", "europe-pmc"],
    "limit": 10,
    "offset": 0,
    "yearFrom": 2017,
    "yearTo": 2025,
    "fields": ["title", "authors", "year", "doi", "citationCount"]
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.academic.search({
  query: "transformer attention mechanism",
  providers: ["semantic-scholar", "pubmed", "openalex", "europe-pmc"],
  limit: 10,
  offset: 0,
  yearFrom: 2017,
  yearTo: 2025,
  fields: ["title", "authors", "year", "doi", "totalCitations"],
});

console.log(`Found ${result.estimatedTotalResults} results`);
for (const paper of result.results) {
  console.log(`${paper.title} (${paper.year})`);
}
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/academic/search",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "query": "transformer attention mechanism",
        "providers": ["semantic-scholar", "pubmed", "openalex", "europe-pmc"],
        "limit": 10,
        "offset": 0,
        "yearFrom": 2017,
        "yearTo": 2025,
        "fields": ["title", "authors", "year", "doi", "citationCount"],
    },
)
data = response.json()
print(f"Found {data['estimatedTotalResults']} results")
```

### Example Response

```json
{
  "estimatedTotalResults": 48293,
  "results": [
    {
      "doi": "10.48550/arXiv.1706.03762",
      "title": "Attention Is All You Need",
      "authors": [{"name": "Ashish Vaswani"}, {"name": "Noam Shazeer"}],
      "year": 2017,
      "totalCitations": 120843,
      "abstract": "The dominant sequence transduction models...",
      "provider": "semantic-scholar"
    },
    {
      "doi": "10.18653/v1/N19-1423",
      "title": "BERT: Pre-training of Deep Bidirectional Transformers",
      "authors": [{"name": "Jacob Devlin"}, {"name": "Ming-Wei Chang"}],
      "year": 2019,
      "totalCitations": 95421,
      "provider": "semantic-scholar"
    }
  ],
  "requestId": 45
}
```

## Academic Fetch

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/academic/fetch \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["10.1038/s41586-021-03819-2", "2303.08774", "PMID:33116299"],
    "fields": ["title", "authors", "year", "doi", "abstract", "citationCount"]
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.academic.fetch({
  ids: ["10.1038/s41586-021-03819-2", "2303.08774", "PMID:33116299"],
  fields: ["title", "authors", "year", "doi", "abstract", "totalCitations"],
});

for (const paper of result.results) {
  console.log(`${paper.title} — ${paper.detectedProvider}`);
}
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/academic/fetch",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "ids": ["10.1038/s41586-021-03819-2", "2303.08774", "PMID:33116299"],
        "fields": ["title", "authors", "year", "doi", "abstract", "citationCount"],
    },
)
for paper in response.json()["results"]:
    print(paper["title"])
```

### Example Response

```json
{
  "results": [
    {
      "id": "10.1038/s41586-021-03819-2",
      "detectedProvider": "semantic-scholar",
      "doi": "10.1038/s41586-021-03819-2",
      "title": "Highly accurate protein structure prediction with AlphaFold",
      "authors": [{"name": "John Jumper"}, {"name": "Richard Evans"}],
      "year": 2021,
      "totalCitations": 28451,
      "url": "https://global.pdfvector.com/publications/doi:10.1038%2Fs41586-021-03819-2",
      "providerURL": "https://www.semanticscholar.org/paper/fcc0b70984..."
    },
    {
      "id": "2303.08774",
      "detectedProvider": "arxiv",
      "title": "GPT-4 Technical Report",
      "authors": [{"name": "OpenAI"}],
      "year": 2023,
      "url": "https://global.pdfvector.com/publications/arxiv:2303.08774",
      "providerURL": "https://arxiv.org/abs/2303.08774"
    }
  ],
  "requestId": 46
}
```

## Academic Parse

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/academic/parse \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1706.03762",
    "model": "auto",
    "includePages": true
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.academic.parse({
  id: "1706.03762",
  model: "auto",
  includePages: true,
});

console.log(result.title);
console.log(result.pdfURL);
console.log(result.markdown);
console.log(result.pages?.[0]?.markdown);
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/academic/parse",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "url": "https://arxiv.org/abs/1706.03762",
        "model": "auto",
        "includePages": True,
    },
)
data = response.json()
print(data["title"])
print(data["markdown"])
print(data["pages"][0]["markdown"])
```

### Example Response

```json
{
  "id": "1706.03762",
  "title": "Attention Is All You Need",
  "doi": "10.48550/arXiv.1706.03762",
  "url": "https://global.pdfvector.com/publications/arxiv:1706.03762",
  "providerURL": "https://arxiv.org/abs/1706.03762",
  "pdfURL": "https://arxiv.org/pdf/1706.03762",
  "detectedProvider": "arxiv",
  "markdown": "# Attention Is All You Need\n\nAshish Vaswani...",
  "pageCount": 15,
  "pages": [{ "pageNumber": 1, "markdown": "# Attention Is All You Need\n\nAshish Vaswani..." }],
  "model": "auto",
  "credits": 15,
  "requestId": 47
}
```

## Academic Find Citations

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/academic/findCitations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "paragraph": "Large language models have demonstrated remarkable few-shot learning capabilities across a wide range of NLP tasks. The scaling of transformer architectures to billions of parameters has led to emergent abilities not observed in smaller models.",
    "providers": ["semantic-scholar", "openalex"],
    "fields": ["title", "authors", "year", "doi", "citationCount"]
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.academic.findCitations({
  paragraph: "Large language models have demonstrated remarkable few-shot learning capabilities across a wide range of NLP tasks. The scaling of transformer architectures to billions of parameters has led to emergent abilities not observed in smaller models.",
  providers: ["semantic-scholar", "openalex"],
  fields: ["title", "authors", "year", "doi", "totalCitations"],
});

console.log(`Found ${result.totalCitations} citations`);
for (const item of result.results) {
  console.log(`"${item.sentence}"`);
  for (const cite of item.citations) {
    console.log(`  [${cite.score}] ${cite.title}`);
  }
}
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/academic/findCitations",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "paragraph": "Large language models have demonstrated remarkable few-shot learning capabilities across a wide range of NLP tasks. The scaling of transformer architectures to billions of parameters has led to emergent abilities not observed in smaller models.",
        "providers": ["semantic-scholar", "openalex"],
        "fields": ["title", "authors", "year", "doi", "citationCount"],
    },
)
data = response.json()
print(f"Found {data['totalCitations']} citations")
```

### Example Response

```json
{
  "results": [
    {
      "sentence": "Deep learning has revolutionized NLP.",
      "citations": [
        {
          "score": 9,
          "doi": "10.1038/nature14539",
          "title": "Deep Learning",
          "authors": [{"name": "Ian Goodfellow"}, {"name": "Yoshua Bengio"}],
          "year": 2016,
          "totalCitations": 75000
        }
      ]
    },
    {
      "sentence": "Transformer architectures have become the dominant approach for sequence modeling.",
      "citations": [
        {
          "score": 10,
          "doi": "10.48550/arXiv.1706.03762",
          "title": "Attention Is All You Need",
          "authors": [{"name": "Ashish Vaswani"}],
          "year": 2017,
          "totalCitations": 120843
        }
      ]
    }
  ],
  "sentenceCount": 2,
  "totalCitations": 2,
  "requestId": 47
}
```

## Academic Paper Graph

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/academic/paperGraph \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "10.1038/nature12373",
    "citationsLimit": 20,
    "referencesLimit": 20,
    "fields": ["title", "authors", "year", "doi", "totalCitations"]
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.academic.paperGraph({
  id: "10.1038/nature12373",
  citationsLimit: 20,
  referencesLimit: 20,
  fields: ["title", "authors", "year", "doi", "totalCitations"],
});

console.log(`Paper: ${result.paper.title}`);
console.log(`Citations: ${result.citations.length} of ${result.totalCitations}`);
console.log(`References: ${result.references.length} of ${result.totalReferences}`);

for (const cite of result.citations) {
  console.log(`  Cited by: ${cite.title} (${cite.year})`);
}
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/academic/paperGraph",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "id": "10.1038/nature12373",
        "citationsLimit": 20,
        "referencesLimit": 20,
        "fields": ["title", "authors", "year", "doi", "totalCitations"],
    },
)
data = response.json()
print(f"Paper: {data['paper']['title']}")
print(f"Citations: {len(data['citations'])} of {data['totalCitations']}")
```

### Example Response

```json
{
  "paper": {
    "doi": "10.1038/nature12373",
    "title": "Sequence-to-sequence models for data-to-text generation",
    "authors": [{"name": "Sam Wiseman"}, {"name": "Stuart Shieber"}],
    "year": 2017,
    "totalCitations": 842
  },
  "citations": [
    {
      "doi": "10.18653/v1/P19-1602",
      "title": "Data-to-Text Generation with Content Selection and Planning",
      "authors": [{"name": "Ratish Puduppully"}],
      "year": 2019,
      "totalCitations": 312
    },
    {
      "doi": "10.18653/v1/2020.acl-main.17",
      "title": "Bridging the Structural Gap Between Encoding and Decoding",
      "authors": [{"name": "Kaiqiang Song"}],
      "year": 2020,
      "totalCitations": 45
    }
  ],
  "references": [
    {
      "doi": "10.48550/arXiv.1409.3215",
      "title": "Sequence to Sequence Learning with Neural Networks",
      "authors": [{"name": "Ilya Sutskever"}],
      "year": 2014,
      "totalCitations": 25891
    }
  ],
  "totalCitations": 842,
  "totalReferences": 35,
  "requestId": 48
}
```

## Academic Similar Papers

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/academic/similarPapers \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "10.1038/nature12373",
    "limit": 10,
    "includeEdges": false,
    "fields": ["title", "authors", "year", "doi", "totalCitations"]
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.academic.similarPapers({
  id: "10.1038/nature12373",
  limit: 10,
  includeEdges: false,
  fields: ["title", "authors", "year", "doi", "totalCitations"],
});

console.log(`Seed: ${result.seed.title}`);
console.log(`Found ${result.results.length} similar papers`);

for (const item of result.results) {
  console.log(`  [${item.similarity.toFixed(2)}] ${item.publication.title}`);
}
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/academic/similarPapers",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "id": "10.1038/nature12373",
        "limit": 10,
        "includeEdges": False,
        "fields": ["title", "authors", "year", "doi", "totalCitations"],
    },
)
data = response.json()
print(f"Seed: {data['seed']['title']}")
for item in data["results"]:
    print(f"  [{item['similarity']:.2f}] {item['publication']['title']}")
```

### Example Response

```json
{
  "seed": {
    "doi": "10.1038/nature12373",
    "title": "Sequence-to-sequence models for data-to-text generation",
    "authors": [{"name": "Sam Wiseman"}],
    "year": 2017,
    "totalCitations": 842
  },
  "results": [
    {
      "publication": {
        "doi": "10.18653/v1/P19-1602",
        "title": "Data-to-Text Generation with Content Selection and Planning",
        "authors": [{"name": "Ratish Puduppully"}],
        "year": 2019,
        "totalCitations": 312
      },
      "similarity": 0.94,
      "pageRank": 0.0023,
      "distance": 1
    },
    {
      "publication": {
        "doi": "10.1162/tacl_a_00302",
        "title": "Neural Data-to-Text Generation: A Comparison between Pipeline and End-to-End Architectures",
        "authors": [{"name": "Thiago Castro Ferreira"}],
        "year": 2019,
        "totalCitations": 89
      },
      "similarity": 0.87,
      "pageRank": 0.0018,
      "distance": 1
    }
  ],
  "requestId": 49
}
```

## Academic Search Grants

### cURL

```bash
curl -X POST https://global.pdfvector.com/api/academic/searchGrants \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "machine learning healthcare",
    "providers": ["grants-gov", "nih-reporter"],
    "limit": 5,
    "fundingMin": 50000,
    "deadlineFrom": "2026-01-01",
    "fields": ["title", "agency", "fundingAmountMin", "fundingAmountMax", "deadlineDate", "url"]
  }'
```

### TypeScript

```typescript
import { createClient } from "@pdfvector/client";

const client = createClient({ apiKey: "YOUR_API_KEY" });

const result = await client.academic.searchGrants({
  query: "machine learning healthcare",
  providers: ["grants-gov", "nih-reporter"],
  limit: 5,
  fundingMin: 50000,
  deadlineFrom: "2026-01-01",
  fields: ["title", "agency", "fundingAmountMin", "fundingAmountMax", "deadlineDate", "url"],
});

console.log(`Found ${result.estimatedTotalResults} grants`);
for (const grant of result.results) {
  console.log(`${grant.title} — ${grant.agency}`);
  console.log(`  Funding: $${grant.fundingAmountMin?.toLocaleString()} - $${grant.fundingAmountMax?.toLocaleString()}`);
  console.log(`  Deadline: ${grant.deadlineDate}`);
}
```

### Python

```python
import requests

response = requests.post(
    "https://global.pdfvector.com/api/academic/searchGrants",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "query": "machine learning healthcare",
        "providers": ["grants-gov", "nih-reporter"],
        "limit": 5,
        "fundingMin": 50000,
        "deadlineFrom": "2026-01-01",
        "fields": ["title", "agency", "fundingAmountMin", "fundingAmountMax", "deadlineDate", "url"],
    },
)
data = response.json()
print(f"Found {data['estimatedTotalResults']} grants")
for grant in data["results"]:
    print(f"{grant['title']} — {grant['agency']}")
```

### Example Response

```json
{
  "estimatedTotalResults": 127,
  "results": [
    {
      "title": "Artificial Intelligence for Transforming Healthcare Delivery",
      "agency": "National Institutes of Health",
      "fundingAmountMin": 250000,
      "fundingAmountMax": 500000,
      "deadlineDate": "2026-06-15",
      "url": "https://grants.nih.gov/grants/guide/rfa-files/RFA-HL-25-001.html",
      "provider": "nih-reporter"
    },
    {
      "title": "Machine Learning Applications in Clinical Decision Support",
      "agency": "Department of Health and Human Services",
      "fundingAmountMin": 100000,
      "fundingAmountMax": 300000,
      "deadlineDate": "2026-03-31",
      "url": "https://www.grants.gov/search-results-detail/123456",
      "provider": "grants-gov"
    }
  ],
  "requestId": 50
}
```

## Common Pitfalls

- Do not use a real API key in generated code samples.
- Do not assume `pages` exists unless `includePages` was requested.
- Do not rely only on `pages` when the caller needs the whole document; use top-level `markdown`.
- For Academic Parse, do not invent metadata. Use returned fields such as `title`, `doi`, `providerURL`, and `pdfURL`.
