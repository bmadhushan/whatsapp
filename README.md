# WhatsApp Product Search Bot

A WhatsApp chatbot that allows users to search products by name and instantly receive prices and images, built using the WhatsApp Cloud API and Node.js.

## What the app does

Users can message the WhatsApp bot with natural text like:

```
hello
nike shoes
iphone 13
```

The bot:

- Receives messages via the WhatsApp Cloud API
- Processes them on a Node.js + Express backend
- Searches products (CSV now, database later)
- Responds with product name, price (LKR), size, colors, description, and image

The experience feels like a WhatsApp group or chat, but powered by an intelligent backend.

## Technical architecture (current)

### Backend

- Node.js
- Express
- Axios
- Webhook-based message handling

### WhatsApp integration

- WhatsApp Cloud API (Meta)
- Webhooks configured and verified
- Test phone number active
- Messaging permissions enabled

### Infrastructure

- ngrok for local webhook tunneling (development)
- GitHub repository for version control

## Message flow (working)

1. User sends a message to the WhatsApp bot.
2. Meta WhatsApp Cloud API receives the message and triggers a webhook event.
3. The webhook hits `POST /webhook`.
4. The Node.js server logs the incoming message, parses sender + text, and sends a WhatsApp reply via the Graph API.

✅ End-to-end WhatsApp send & receive is fully working.

## Data (planned / ready to integrate)

You already have product data in CSV format containing:

- Product name
- Price (LKR)
- Size
- Colors
- Product image URL
- Product description

This will be:

- Loaded into memory (MVP)
- Or stored in a DB later (MySQL / MongoDB)

### CSV format and expected behavior

Example CSV row:

```
product_name,price_lkr,size,colours,image_url,product_description
Nike Air Force 1 Low,38500,42,"Black,White",https://example.com/nike-af1.jpg,"Classic Nike sneaker with premium leather."
```

#### Load phase

- CSV is loaded once at server startup.
- Parsed into an in-memory array of product objects.

#### Search phase

Incoming WhatsApp message text is matched against `product_name` using:

- Case-insensitive matching.
- Partial matches (string includes).

Example:

- User: `nike` → matches all products with `nike` in `product_name`.

#### Response mapping (CSV → WhatsApp)

For each matched product:

- `product_name` → title text
- `price_lkr` → formatted price line
- `size` → size info
- `colours` → color list
- `image_url` → WhatsApp image message
- `product_description` → caption or follow-up text

#### Current constraints

- No pagination yet (return top 1–3 matches).
- No fuzzy AI search yet.
- CSV is the single source of truth.
- No database required at MVP stage.

## Current status

### ✅ Completed

- GitHub repo created & clean
- Secure `.gitignore` setup
- Webhook verification working
- WhatsApp message send & receive confirmed
- Token & permissions validated
- Local development environment stable

### 🟡 In progress

- Product search logic
- CSV parsing
- Response formatting (images, price cards)

### 🔴 Not started yet

- Pagination / multiple product results
- Natural language matching
- Hosting without ngrok
- Production WhatsApp number
- App review & business verification

## What this app can become

With small upgrades, this can evolve into:

- WhatsApp e-commerce catalog
- Dropshipping assistant
- Retail product lookup bot
- Customer support + product search combo
- Marketplace discovery bot

## One-sentence summary

A WhatsApp chatbot that allows users to search products by name and instantly receive prices and images, built using WhatsApp Cloud API and Node.js.
