'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
    CheckCircle,
    ArrowLeft,
    ExternalLink,
    Copy,
    Check,
    Wallet,
    Clock,
    Shield
} from 'lucide-react'
import Link from 'next/link'

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
}

const bounceIn = {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 260,
        damping: 20
    }
}

export default function PaymentSuccess() {
    const [copied, setCopied] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState(0)

    const mockPayment = {
        orderId: 'ORDER-12345',
        amount: '$150.00',
        customerPayment: '0.05 ETH',
        sourceChain: 'Ethereum',
        settlementAmount: '150.23 USDC',
        settlementChain: 'Polygon',
        txHash: '0x1234567890abcdef1234567890abcdef12345678',
        settlementTxHash: '0xfedcba0987654321fedcba0987654321fedcba09',
        timestamp: new Date().toISOString()
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#003566] flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#2dd4bf] opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#ffd60a] opacity-10 animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-2xl"
            >
                {/* Header */}
                <div className="glass rounded-t-2xl p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </motion.button>
                        </Link>
                        <h2 className="text-xl font-bold text-white">Payment Complete</h2>
                        <div></div>
                    </div>
                </div>

                {/* Success Content */}
                <div className="glass rounded-b-2xl p-8">
                    {/* Success Icon */}
                    <motion.div
                        variants={bounceIn}
                        initial="initial"
                        animate="animate"
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#2dd4bf] to-[#4361ee] rounded-full mb-4">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                        <p className="text-white/80">
                            Your crypto payment has been processed and settled
                        </p>
                    </motion.div>

                    {/* Payment Details */}
                    <motion.div variants={fadeIn} className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-[#001122] border border-white/10 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Payment Summary</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-white/60 text-sm">Order ID</p>
                                    <p className="text-white font-medium">{mockPayment.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Amount</p>
                                    <p className="text-white font-medium">{mockPayment.amount}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Payment Method</p>
                                    <p className="text-white font-medium">{mockPayment.customerPayment} on {mockPayment.sourceChain}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Processing Time</p>
                                    <p className="text-[#2dd4bf] font-medium">{formatTime(timeElapsed)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="bg-[#001122] border border-white/10 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Transaction Details</h3>

                            {/* Customer Transaction */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">Customer Payment</p>
                                        <p className="text-white/60 text-sm">{mockPayment.customerPayment} on {mockPayment.sourceChain}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => copyToClipboard(mockPayment.txHash)}
                                            className="text-white/60 hover:text-[#ffd60a] transition-colors"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <button className="text-white/60 hover:text-[#ffd60a] transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    <div className="w-8 h-0.5 bg-gradient-to-r from-[#ffd60a] to-[#2dd4bf]"></div>
                                    <div className="mx-4 p-2 bg-[#2dd4bf]/20 rounded-full">
                                        <Wallet className="w-4 h-4 text-[#2dd4bf]" />
                                    </div>
                                    <div className="w-8 h-0.5 bg-gradient-to-r from-[#2dd4bf] to-[#4361ee]"></div>
                                </div>

                                {/* Settlement Transaction */}
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">Merchant Settlement</p>
                                        <p className="text-white/60 text-sm">{mockPayment.settlementAmount} on {mockPayment.settlementChain}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => copyToClipboard(mockPayment.settlementTxHash)}
                                            className="text-white/60 hover:text-[#ffd60a] transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button className="text-white/60 hover:text-[#ffd60a] transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: <Shield className="w-6 h-6" />,
                                    title: "Secure",
                                    description: "Protected by Chainlink CCIP"
                                },
                                {
                                    icon: <Clock className="w-6 h-6" />,
                                    title: "Fast",
                                    description: "Settled in under 2 minutes"
                                },
                                {
                                    icon: <CheckCircle className="w-6 h-6" />,
                                    title: "Verified",
                                    description: "Transaction confirmed on-chain"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                                    <div className="text-[#2dd4bf] mb-2 flex justify-center">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-white font-semibold text-sm mb-1">{feature.title}</h4>
                                    <p className="text-white/60 text-xs">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Link href="/" className="flex-1">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] text-black py-3 px-6 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                                >
                                    Continue Shopping
                                </motion.button>
                            </Link>

                            <Link href="/payment-demo" className="flex-1">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-white/10 text-white py-3 px-6 rounded-lg font-bold hover:bg-white/20 transition-all duration-300"
                                >
                                    Try Another Payment
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
