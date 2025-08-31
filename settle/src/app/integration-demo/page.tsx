"use client";

import { useState } from "react";
import { initSettle } from "../../lib/settle-sdk";
import { motion } from "framer-motion";

export default function IntegrationDemo() {
    const [amount, setAmount] = useState(149.99);
    const [token, setToken] = useState("ETH");
    const [chain, setChain] = useState("ethereum");
    const orderId = "ORDER-1001";

    const settle = initSettle({ publicKey: process.env.NEXT_PUBLIC_SETTLE_PK || "pk_test_demo" });

    const handleCheckout = async () => {
        await settle.openCheckout({
            amount,
            currency: "USD",
            orderId,
            token,
            chain,
            redirectUrl: `${window.location.origin}/payment-success`,
            description: "Demo Store Purchase",
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Demo Store</h1>
                <p className="text-muted-foreground mb-8">This page simulates a third-party app integrating Settle&apos;s hosted checkout.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass p-6 rounded-xl">
                        <h2 className="font-semibold mb-4">Product</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Item:</span><span>Pro Subscription</span></div>
                            <div className="flex justify-between"><span>Price:</span><span>${amount.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Order ID:</span><span>{orderId}</span></div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCheckout}
                            className="mt-6 w-full bg-accent text-white py-3 rounded-lg font-semibold"
                        >
                            Checkout with Settle
                        </motion.button>
                    </div>

                    <div className="glass p-6 rounded-xl">
                        <h2 className="font-semibold mb-4">Payment Preferences</h2>
                        <label className="block text-sm mb-2">Amount (USD)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
                            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2"
                        />

                        <label className="block text-sm mt-4 mb-2">Token</label>
                        <select value={token} onChange={(e) => setToken(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2">
                            <option>ETH</option>
                            <option>USDC</option>
                            <option>BTC</option>
                        </select>

                        <label className="block text-sm mt-4 mb-2">Chain</label>
                        <select value={chain} onChange={(e) => setChain(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2">
                            <option value="ethereum">Ethereum</option>
                            <option value="polygon">Polygon</option>
                            <option value="optimism">Optimism</option>
                        </select>
                    </div>
                </div>

                <div className="glass p-6 rounded-xl mt-6 text-sm">
                    <h3 className="font-semibold mb-2">How it works</h3>
                    <ol className="list-decimal ml-5 space-y-1 text-muted-foreground">
                        <li>Your app calls Settle SDK to create an invoice/checkout URL.</li>
                        <li>User is redirected to Settle&apos;s hosted checkout (our Payment Demo page).</li>
                        <li>After payment confirmation, Settle redirects back to your success page.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
