import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

export const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toFixed(6)} ${symbol}`
}

export const truncateAddress = (address: string, length: number = 6) => {
    if (!address) return ''
    return `${address.slice(0, length)}...${address.slice(-4)}`
}

export const generatePaymentAddress = () => {
    // Mock address generation - in real app, this would come from your API
    return `0x${Math.random().toString(16).slice(2, 42)}`
}

export const chains = [
    {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        logo: '/chains/ethereum.svg',
        color: '#627EEA'
    },
    {
        id: 'polygon',
        name: 'Polygon',
        symbol: 'MATIC',
        logo: '/chains/polygon.svg',
        color: '#8247E5'
    },
    {
        id: 'arbitrum',
        name: 'Arbitrum',
        symbol: 'ETH',
        logo: '/chains/arbitrum.svg',
        color: '#28A0F0'
    },
    {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        logo: '/chains/solana.svg',
        color: '#9945FF'
    },
    {
        id: 'avalanche',
        name: 'Avalanche',
        symbol: 'AVAX',
        logo: '/chains/avalanche.svg',
        color: '#E84142'
    }
]

export const tokens = [
    {
        symbol: 'USDC',
        name: 'USD Coin',
        logo: '/tokens/usdc.svg',
        price: 1.00
    },
    {
        symbol: 'USDT',
        name: 'Tether',
        logo: '/tokens/usdt.svg',
        price: 1.00
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        logo: '/tokens/eth.svg',
        price: 2450.00
    },
    {
        symbol: 'SOL',
        name: 'Solana',
        logo: '/tokens/sol.svg',
        price: 130.00
    },
    {
        symbol: 'MATIC',
        name: 'Polygon',
        logo: '/tokens/matic.svg',
        price: 0.85
    }
]

export const getTokenPrice = (symbol: string) => {
    const token = tokens.find(t => t.symbol === symbol)
    return token?.price || 0
}

export const calculateCryptoAmount = (usdAmount: number, tokenSymbol: string) => {
    const tokenPrice = getTokenPrice(tokenSymbol)
    if (tokenPrice === 0) return 0
    return usdAmount / tokenPrice
}

export const mockTransactions = [
    {
        id: '1',
        orderId: 'ORDER-12345',
        date: '2024-01-15',
        customerPayment: '0.05 ETH on Ethereum',
        amountSettled: '150.23 USDC',
        status: 'Settled',
        sourceChain: 'Ethereum',
        sourceAmount: '0.05 ETH',
        settlementChain: 'Polygon',
        settlementAmount: '150.23 USDC',
        exchangeRate: '1 ETH = 3,004.60 USD',
        txHash: '0x1234...5678',
        settlementTxHash: '0x8765...4321'
    },
    {
        id: '2',
        orderId: 'ORDER-12346',
        date: '2024-01-15',
        customerPayment: '1.15 SOL on Solana',
        amountSettled: '149.50 USDC',
        status: 'Processing',
        sourceChain: 'Solana',
        sourceAmount: '1.15 SOL',
        settlementChain: 'Polygon',
        settlementAmount: '149.50 USDC',
        exchangeRate: '1 SOL = 130.00 USD',
        txHash: '0x2345...6789',
        settlementTxHash: null
    },
    {
        id: '3',
        orderId: 'ORDER-12347',
        date: '2024-01-14',
        customerPayment: '100.00 USDC on Arbitrum',
        amountSettled: '99.75 USDC',
        status: 'Settled',
        sourceChain: 'Arbitrum',
        sourceAmount: '100.00 USDC',
        settlementChain: 'Polygon',
        settlementAmount: '99.75 USDC',
        exchangeRate: '1 USDC = 1.00 USD',
        txHash: '0x3456...7890',
        settlementTxHash: '0x9876...5432'
    }
]
