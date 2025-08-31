'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
    Code,
    Copy,
    Check,
    Book,
    Webhook,
    Key,
    CreditCard,
    Shield
} from 'lucide-react'
import Link from 'next/link'

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
}

export default function ApiDocumentation() {
    const [activeSection, setActiveSection] = useState('getting-started')
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const sections = [
        { id: 'getting-started', label: 'Getting Started', icon: Book },
        { id: 'authentication', label: 'Authentication', icon: Key },
        { id: 'create-invoice', label: 'Create Invoice', icon: CreditCard },
        { id: 'webhooks', label: 'Webhooks', icon: Webhook },
        { id: 'security', label: 'Security', icon: Shield }
    ]

    const codeExamples = {
        createInvoice: `curl -X POST https://api.settle.com/v1/invoice \\
  -H "Authorization: Bearer sk_test_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 150.00,
    "currency": "USD",
    "orderId": "ORDER-12345",
    "redirectUrl": "https://mystore.com/confirmation"
  }'`,

        webhook: `{
  "type": "payment.received",
  "data": {
    "invoiceId": "inv_1234567890",
    "orderId": "ORDER-12345",
    "amount": 150.00,
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
}`,

        nodeJs: `const settle = require('@settle/node-sdk');

settle.configure({
  secretKey: 'sk_test_your_secret_key'
});

// Create an invoice
const invoice = await settle.invoices.create({
  amount: 150.00,
  currency: 'USD',
  orderId: 'ORDER-12345',
  redirectUrl: 'https://mystore.com/confirmation'
});

console.log('Payment URL:', invoice.paymentUrl);`,

        widget: `<!-- Add this to your checkout page -->
<script src="https://js.settle.com/v1/settle.js"></script>
<div id="settle-payment-widget"></div>

<script>
  Settle.init({
    publicKey: 'pk_test_your_public_key',
    amount: 150.00,
    currency: 'USD',
    orderId: 'ORDER-12345',
    onSuccess: function(payment) {
      // Redirect to success page
      window.location.href = '/payment-success';
    },
    onError: function(error) {
      console.error('Payment failed:', error);
    }
  });
</script>`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#003566]">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-40 right-40 w-96 h-96 rounded-full bg-[#ffd60a] opacity-5 animate-pulse"></div>
                <div className="absolute bottom-40 left-40 w-80 h-80 rounded-full bg-[#4361ee] opacity-5 animate-pulse delay-1000"></div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 z-40 overflow-y-auto">
                    <div className="p-6">
                        <Link href="/">
                            <div className="flex items-center space-x-2 mb-8">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] rounded-lg flex items-center justify-center">
                                    <Code className="w-5 h-5 text-black" />
                                </div>
                                <span className="text-lg font-bold text-white">API Docs</span>
                            </div>
                        </Link>

                        <nav className="space-y-2">
                            {sections.map((section) => {
                                const Icon = section.icon
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === section.id
                                            ? 'bg-[#ffd60a]/20 text-[#ffd60a] border border-[#ffd60a]/30'
                                            : 'text-white/80 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="font-medium text-sm">{section.label}</span>
                                    </button>
                                )
                            })}
                        </nav>

                        <div className="mt-8 p-4 bg-[#4361ee]/10 border border-[#4361ee]/20 rounded-lg">
                            <p className="text-xs text-white/80 mb-2">
                                <strong>Need Help?</strong>
                            </p>
                            <p className="text-xs text-white/60">
                                Join our Discord community or email support@settle.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="ml-64 flex-1 relative z-30">
                    {/* Header */}
                    <div className="glass border-b border-white/10 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white">API Documentation</h1>
                                <p className="text-white/60 mt-1">
                                    Integrate SETTLE into your application
                                </p>
                            </div>
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    Go to Dashboard
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    <div className="p-6 max-w-4xl">
                        {/* Getting Started */}
                        {activeSection === 'getting-started' && (
                            <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Getting Started</h2>
                                    <p className="text-white/80 text-lg mb-6">
                                        Welcome to the SETTLE API! This guide will help you integrate crypto payments into your application in minutes.
                                    </p>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Quick Start</h3>
                                    <ol className="space-y-4 text-white/80">
                                        <li className="flex items-start space-x-3">
                                            <span className="bg-[#ffd60a] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                                            <div>
                                                <p className="font-semibold text-white">Sign up for a SETTLE account</p>
                                                <p className="text-sm">Create your merchant account and get your API keys</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="bg-[#ffd60a] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                                            <div>
                                                <p className="font-semibold text-white">Configure your settlement preferences</p>
                                                <p className="text-sm">Choose your preferred settlement chain and token</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <span className="bg-[#ffd60a] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                                            <div>
                                                <p className="font-semibold text-white">Integrate the payment widget or API</p>
                                                <p className="text-sm">Add our widget to your site or use our REST API</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Base URL</h3>
                                    <div className="bg-[#001122] border border-white/10 rounded-lg p-4 font-mono">
                                        <code className="text-[#ffd60a]">https://api.settle.com</code>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Authentication */}
                        {activeSection === 'authentication' && (
                            <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Authentication</h2>
                                    <p className="text-white/80 text-lg mb-6">
                                        SETTLE uses API keys to authenticate requests. Your API keys carry many privileges, so be sure to keep them secure!
                                    </p>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">API Keys</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-white mb-2">Public Key</h4>
                                            <p className="text-white/70 text-sm mb-3">
                                                Used for client-side operations and payment widget initialization. Safe to expose in your frontend code.
                                            </p>
                                            <div className="bg-[#001122] border border-white/10 rounded-lg p-3 font-mono text-sm">
                                                <code className="text-[#2dd4bf]">pk_test_1234567890abcdef</code>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-white mb-2">Secret Key</h4>
                                            <p className="text-white/70 text-sm mb-3">
                                                Used for server-side API calls. Keep this secure and never expose it in client-side code.
                                            </p>
                                            <div className="bg-[#001122] border border-white/10 rounded-lg p-3 font-mono text-sm">
                                                <code className="text-[#f59e0b]">sk_test_0987654321fedcba</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Making Authenticated Requests</h3>
                                    <p className="text-white/70 mb-4">
                                        Include your secret key in the Authorization header:
                                    </p>
                                    <div className="bg-[#001122] border border-white/10 rounded-lg p-4 relative">
                                        <pre className="text-sm text-white/80 overflow-x-auto">
                                            {`curl -H "Authorization: Bearer sk_test_your_secret_key" \\
     https://api.settle.com/v1/invoices`}
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard('curl -H "Authorization: Bearer sk_test_your_secret_key" https://api.settle.com/v1/invoices', 'auth-example')}
                                            className="absolute top-3 right-3 text-white/60 hover:text-[#ffd60a] transition-colors"
                                        >
                                            {copied === 'auth-example' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Create Invoice */}
                        {activeSection === 'create-invoice' && (
                            <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Create Invoice</h2>
                                    <p className="text-white/80 text-lg mb-6">
                                        Create a payment invoice to accept crypto payments from your customers.
                                    </p>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">POST /v1/invoice</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-white mb-3">Request Body</h4>
                                            <div className="bg-[#001122] border border-white/10 rounded-lg p-4 relative">
                                                <pre className="text-sm text-white/80 overflow-x-auto">
                                                    {`{
  "amount": 150.00,
  "currency": "USD",
  "orderId": "ORDER-12345",
  "redirectUrl": "https://mystore.com/confirmation",
  "metadata": {
    "productName": "Premium Widget",
    "customerId": "customer_123"
  }
}`}
                                                </pre>
                                                <button
                                                    onClick={() => copyToClipboard(JSON.stringify({
                                                        amount: 150.00,
                                                        currency: "USD",
                                                        orderId: "ORDER-12345",
                                                        redirectUrl: "https://mystore.com/confirmation",
                                                        metadata: {
                                                            productName: "Premium Widget",
                                                            customerId: "customer_123"
                                                        }
                                                    }, null, 2), 'request-body')}
                                                    className="absolute top-3 right-3 text-white/60 hover:text-[#ffd60a] transition-colors"
                                                >
                                                    {copied === 'request-body' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-white mb-3">Response</h4>
                                            <div className="bg-[#001122] border border-white/10 rounded-lg p-4 relative">
                                                <pre className="text-sm text-white/80 overflow-x-auto">
                                                    {`{
  "invoiceId": "inv_1234567890",
  "paymentUrl": "https://pay.settle.com/inv_1234567890",
  "amount": 150.00,
  "currency": "USD",
  "orderId": "ORDER-12345",
  "status": "pending",
  "expiresAt": "2024-01-15T11:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z"
}`}
                                                </pre>
                                                <button
                                                    onClick={() => copyToClipboard('Response example', 'response-body')}
                                                    className="absolute top-3 right-3 text-white/60 hover:text-[#ffd60a] transition-colors"
                                                >
                                                    {copied === 'response-body' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-white mb-3">cURL Example</h4>
                                            <div className="bg-[#001122] border border-white/10 rounded-lg p-4 relative">
                                                <pre className="text-sm text-white/80 overflow-x-auto">
                                                    {codeExamples.createInvoice}
                                                </pre>
                                                <button
                                                    onClick={() => copyToClipboard(codeExamples.createInvoice, 'curl-example')}
                                                    className="absolute top-3 right-3 text-white/60 hover:text-[#ffd60a] transition-colors"
                                                >
                                                    {copied === 'curl-example' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-white mb-3">Node.js Example</h4>
                                            <div className="bg-[#001122] border border-white/10 rounded-lg p-4 relative">
                                                <pre className="text-sm text-white/80 overflow-x-auto">
                                                    {codeExamples.nodeJs}
                                                </pre>
                                                <button
                                                    onClick={() => copyToClipboard(codeExamples.nodeJs, 'nodejs-example')}
                                                    className="absolute top-3 right-3 text-white/60 hover:text-[#ffd60a] transition-colors"
                                                >
                                                    {copied === 'nodejs-example' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Webhooks */}
                        {activeSection === 'webhooks' && (
                            <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Webhooks</h2>
                                    <p className="text-white/80 text-lg mb-6">
                                        SETTLE sends webhooks to notify your application about payment events in real-time.
                                    </p>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Webhook Events</h3>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                event: 'payment.received',
                                                description: 'Sent when customer payment is confirmed on source chain'
                                            },
                                            {
                                                event: 'settlement.processing',
                                                description: 'Sent when cross-chain settlement begins'
                                            },
                                            {
                                                event: 'settlement.completed',
                                                description: 'Sent when funds are delivered to merchant wallet'
                                            },
                                            {
                                                event: 'payment.failed',
                                                description: 'Sent when a payment fails or expires'
                                            }
                                        ].map((webhook, index) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-4">
                                                <div className="flex items-center space-x-3">
                                                    <code className="bg-[#ffd60a]/20 text-[#ffd60a] px-2 py-1 rounded text-sm font-mono">
                                                        {webhook.event}
                                                    </code>
                                                    <span className="text-white/70">{webhook.description}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Webhook Payload Example</h3>
                                    <div className="bg-[#001122] border border-white/10 rounded-lg p-4 relative">
                                        <pre className="text-sm text-white/80 overflow-x-auto">
                                            {codeExamples.webhook}
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard(codeExamples.webhook, 'webhook-example')}
                                            className="absolute top-3 right-3 text-white/60 hover:text-[#ffd60a] transition-colors"
                                        >
                                            {copied === 'webhook-example' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Payment Widget Section for other tabs */}
                        {activeSection === 'security' && (
                            <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Payment Widget</h2>
                                    <p className="text-white/80 text-lg mb-6">
                                        The easiest way to accept crypto payments with just a few lines of code.
                                    </p>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Widget Integration</h3>
                                    <div className="bg-[#001122] border border-white/10 rounded-lg p-4 relative">
                                        <pre className="text-sm text-white/80 overflow-x-auto">
                                            {codeExamples.widget}
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard(codeExamples.widget, 'widget-example')}
                                            className="absolute top-3 right-3 text-white/60 hover:text-[#ffd60a] transition-colors"
                                        >
                                            {copied === 'widget-example' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="glass rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Widget Options</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-3 text-white/80">Parameter</th>
                                                    <th className="text-left py-3 text-white/80">Type</th>
                                                    <th className="text-left py-3 text-white/80">Required</th>
                                                    <th className="text-left py-3 text-white/80">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                <tr className="border-b border-white/5">
                                                    <td className="py-3 font-mono text-[#ffd60a]">publicKey</td>
                                                    <td className="py-3 text-white/70">string</td>
                                                    <td className="py-3 text-[#2dd4bf]">Yes</td>
                                                    <td className="py-3 text-white/70">Your public API key</td>
                                                </tr>
                                                <tr className="border-b border-white/5">
                                                    <td className="py-3 font-mono text-[#ffd60a]">amount</td>
                                                    <td className="py-3 text-white/70">number</td>
                                                    <td className="py-3 text-[#2dd4bf]">Yes</td>
                                                    <td className="py-3 text-white/70">Payment amount in USD</td>
                                                </tr>
                                                <tr className="border-b border-white/5">
                                                    <td className="py-3 font-mono text-[#ffd60a]">orderId</td>
                                                    <td className="py-3 text-white/70">string</td>
                                                    <td className="py-3 text-[#2dd4bf]">Yes</td>
                                                    <td className="py-3 text-white/70">Unique order identifier</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 font-mono text-[#ffd60a]">onSuccess</td>
                                                    <td className="py-3 text-white/70">function</td>
                                                    <td className="py-3 text-white/50">No</td>
                                                    <td className="py-3 text-white/70">Callback for successful payment</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
