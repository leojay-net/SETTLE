export type SettleInitOptions = {
    publicKey: string;
    baseUrl?: string; // For demo, default to current origin
};

export type CheckoutOptions = {
    amount: number; // USD amount
    currency?: string; // Default USD
    orderId: string;
    redirectUrl?: string;
    token?: string; // e.g., ETH, USDC
    chain?: string; // e.g., ethereum, polygon
    description?: string;
};

export type Invoice = {
    paymentUrl: string;
};

export type SettleSDK = {
    createInvoice(opts: CheckoutOptions): Promise<Invoice>;
    openCheckout(opts: CheckoutOptions): Promise<void>;
};

export function initSettle(options: SettleInitOptions): SettleSDK {
    const { publicKey } = options;

    const getBaseUrl = () => {
        if (options.baseUrl) return options.baseUrl.replace(/\/$/, "");
        if (typeof window !== "undefined") return window.location.origin;
        return "";
    };

    const createInvoice = async (opts: CheckoutOptions): Promise<Invoice> => {
        // In a real SDK this would hit Settle's API. For the demo we build a hosted checkout URL.
        const params = new URLSearchParams();
        params.set("amount", String(opts.amount));
        if (opts.currency) params.set("currency", opts.currency);
        params.set("orderId", opts.orderId);
        if (opts.redirectUrl) params.set("redirectUrl", opts.redirectUrl);
        if (opts.token) params.set("token", opts.token);
        if (opts.chain) params.set("chain", opts.chain);
        if (opts.description) params.set("description", opts.description);
        params.set("pk", publicKey);

        const url = `${getBaseUrl()}/payment-demo?${params.toString()}`;
        return { paymentUrl: url };
    };

    const openCheckout = async (opts: CheckoutOptions) => {
        const invoice = await createInvoice(opts);
        if (typeof window !== "undefined") {
            window.location.href = invoice.paymentUrl;
        }
    };

    return { createInvoice, openCheckout };
}
