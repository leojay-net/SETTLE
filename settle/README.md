# SETTLE — Cross‑chain Payment Gateway with CCIP‑powered Settlement

SETTLE is a payment gateway that lets consumers pay in their preferred crypto while merchants receive settlement in their chosen currency (fiat or crypto) on any supported chain. Under the hood, SETTLE leverages Chainlink CCIP to orchestrate secure, programmable, cross‑chain value transfer for settlement.

This repository contains a Next.js App Router demo of a hosted checkout, a simple SDK wrapper, and a sample “third‑party” integration page showing how a merchant would integrate SETTLE.

## What SETTLE enables

- Consumer experience
	- Pay with popular tokens on supported chains.
	- Simple hosted checkout with QR code and status updates.

- Merchant experience
	- Set a preferred settlement currency (USDC, ETH, or fiat via off‑ramp) and a preferred destination chain.
	- Receive settlement on the target chain while customers pay from other chains.
	- Webhooks and redirects after payment confirmation.

- Infrastructure
	- Chainlink CCIP used for secure cross‑chain settlement orchestration.
	- Clear separation between payment capture and settlement instructions.

## How it works

1. The merchant creates a payment (invoice) and presents a hosted checkout page to the consumer.
2. The consumer pays in their preferred token/chain.
3. SETTLE confirms payment and initiates cross‑chain settlement to the merchant’s target chain and currency using CCIP.
4. Merchant receives confirmation via redirect and webhook; funds arrive on the destination chain.

## Repository layout (app)

- `src/lib/settle-sdk.ts` — Minimal client SDK used by the demo to generate a hosted checkout URL.
- `src/app/integration-demo/page.tsx` — Simulated third‑party app showing how to kick off a checkout with the SDK.
- `src/app/payment-demo/page.tsx` — Hosted checkout page the customer is redirected to.
- `src/app/payment-success/page.tsx` — Success page after simulated payment confirmation.
- `src/components/*` — UI components (Navbar, LandingPage, PaymentWidget, PaymentSuccess, etc.).

## Run the demo locally

Prerequisites: Node 18+ recommended.

Install and start the app:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Try the full integration flow

Hosted Checkout demo:

1. Open `/integration-demo`.
2. Pick amount, token, and chain, then click “Checkout with Settle”.
3. You’ll be redirected to `/payment-demo` (hosted checkout) with query parameters.
4. Click “Simulate Payment”.
5. After confirmation, you’ll be redirected to `/payment-success` with the order details.

Environment variable (optional):

- `NEXT_PUBLIC_SETTLE_PK` — Demo public key shown in URLs. Default: `pk_test_demo`.

## Using the SDK (demo)

The demo SDK returns a hosted checkout URL and can also perform a redirect. See `src/lib/settle-sdk.ts`.

```ts
import { initSettle } from "@/lib/settle-sdk";

const settle = initSettle({ publicKey: process.env.NEXT_PUBLIC_SETTLE_PK || "pk_test_demo" });

await settle.openCheckout({
	amount: 149.99,
	currency: "USD",
	orderId: "ORDER-1001",
	token: "ETH",        // customer’s pay token
	chain: "ethereum",   // customer’s pay chain
	redirectUrl: `${window.location.origin}/payment-success`,
	description: "Pro Subscription",
});
```

Parameters are passed to the hosted checkout via URL. The success page reads them to display a realistic confirmation.

## Developer integration

Integrate SETTLE in one of two ways:

1) Hosted Checkout (recommended)
- Fastest path to production. Redirect customers to a secure SETTLE page and receive a redirect back after confirmation.

2) API and Webhooks
- Create and manage invoices via API. Listen to webhooks for payment and settlement updates.

### Hosted Checkout quickstart

Client-only redirect using the demo SDK:

```ts
import { initSettle } from "@/lib/settle-sdk";

const settle = initSettle({ publicKey: process.env.NEXT_PUBLIC_SETTLE_PK || "pk_test_demo" });

await settle.openCheckout({
	amount: 150,
	currency: "USD",
	orderId: "ORDER-12345",
	token: "ETH",        // customer's pay token
	chain: "ethereum",   // customer's pay chain
	redirectUrl: `${window.location.origin}/payment-success`,
	description: "Demo Purchase",
});
```

The customer is redirected to `/payment-demo` and then back to your `redirectUrl` when confirmed. The demo adds `orderId`, `amount`, and `description` as query parameters to your success URL for reconciliation.

### Server-side invoice creation (pattern)

In production, create the invoice on your server to keep secrets private, then send the customer to the `paymentUrl` returned by SETTLE.

Example Node endpoint pattern:

```ts
// POST /api/invoices
// Body: { amount, currency, orderId, token, chain, redirectUrl, description }
import type { Request, Response } from "express";

export async function createInvoice(req: Request, res: Response) {
	const { amount, currency = "USD", orderId, token, chain, redirectUrl, description } = req.body;
	// 1) Validate and persist order
	// 2) Call Settle API with your secret key to create the invoice
	// const invoice = await settleClient.invoices.create({ amount, currency, orderId, token, chain, redirectUrl, description });
	// For demo purposes we mimic the response shape:
	const params = new URLSearchParams({ amount: String(amount), currency, orderId, token, chain, redirectUrl, description });
	const paymentUrl = `${process.env.APP_BASE_URL}/payment-demo?${params.toString()}`;
	res.json({ paymentUrl });
}
```

On the client, redirect to `paymentUrl` or open it in a new window.

### Webhooks

SETTLE sends signed webhooks for key lifecycle events. Recommended events:
- `payment.detected` — a customer transaction is seen on the source chain
- `payment.confirmed` — the customer transaction is finalized
- `settlement.sent` — settlement initiated to the merchant’s destination chain
- `settlement.confirmed` — settlement finalized on the destination chain

Example payload shape:

```json
{
	"type": "payment.confirmed",
	"data": {
		"invoiceId": "inv_1234567890",
		"orderId": "ORDER-12345",
		"amount": 150.0,
		"currency": "USD",
		"customerPayment": {
			"amount": "0.05",
			"token": "ETH",
			"chain": "ethereum",
			"txHash": "0x1234...5678"
		},
		"status": "confirmed",
		"timestamp": "2024-01-15T10:30:00Z"
	}
}
```

Verification pattern (Node/Express):

```ts
import type { Request, Response } from "express";

export async function webhook(req: Request, res: Response) {
	const signature = req.header("Settle-Signature");
	const payload = req.rawBody; // ensure raw body capture in your server
	// verify signature with your webhook secret
	// settle.webhooks.verify(payload, signature, process.env.SETTLE_WEBHOOK_SECRET)
	// then handle event
	const event = JSON.parse(payload.toString());
	if (event.type === "payment.confirmed") {
		// mark order as paid
	}
	res.status(200).send("ok");
}
```

### Redirect and return parameters

After payment, the customer is redirected to the URL you provide. The demo adds:
- `orderId`
- `amount`
- `description`

Use these for client-side acknowledgment. Treat webhooks as source of truth for fulfillment.

### Idempotency and reconciliation

- Use an idempotency key for invoice creation on your server to avoid duplicate orders on retries.
- Reconcile orders using your own `orderId` as the primary reference.

### Configuration

- `NEXT_PUBLIC_SETTLE_PK` — public key used by the client (demo only).
- `SETTLE_SECRET_KEY` — server-side secret for authenticating with Settle APIs (not included in this demo).
- `SETTLE_WEBHOOK_SECRET` — secret for verifying webhook signatures (not included in this demo).

### Testing and sandbox

- Use `/integration-demo` for end-to-end testing of the hosted checkout flow.
- Simulate confirmations from the hosted checkout “Simulate Payment” action.

## Settlement using Chainlink CCIP

In production, after detecting customer payment on the source chain, SETTLE would:

- Determine settlement route based on merchant preferences (target chain and currency).
- Initiate a CCIP message and value transfer to the destination chain.
- Optionally swap into the desired asset on the destination chain.
- Confirm completion and notify the merchant via webhook and redirect.

This demo focuses on the user experience and integration touchpoints; on‑chain interactions and orchestration are simulated.

## API and webhooks (demo)

The `/docs` route contains a sample API documentation UI, including example webhook payloads and a cURL sample for creating an invoice. In a production deployment, the server would expose endpoints for invoice creation, webhook verification, and merchant configuration.

## Notes and limitations

- This is a front‑end focused demo. It simulates payment detection and settlement.
- Do not use in production as‑is. Add real on‑chain listeners, CCIP execution, back‑end invoice storage, and webhook signing/verification.
- UI and flows are optimized for clarity and can be adapted to different brands or checkout patterns.

## License

This repository is provided for demonstration purposes without warranty. See the repository’s license files if present in the root of the project.
