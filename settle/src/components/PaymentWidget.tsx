'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
    ArrowLeft,
    Copy,
    Check,
    RefreshCw,
    AlertCircle,
    ChevronDown
} from 'lucide-react'
import QRCode from 'react-qr-code'
import Link from 'next/link'
import { chains, tokens, calculateCryptoAmount, formatCrypto, generatePaymentAddress } from '../lib/utils'

// Animation variants were previously defined but unused; removed to satisfy lint

export default function PaymentWidget() {
    const [selectedChain, setSelectedChain] = useState(chains[0])
    const [selectedToken, setSelectedToken] = useState(tokens[2]) // ETH
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'detected' | 'confirmed'>('pending')
    const [copied, setCopied] = useState(false)
    const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false)
    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false)

    const usdAmount = 150.00
    const cryptoAmount = calculateCryptoAmount(usdAmount, selectedToken.symbol)
    const paymentAddress = generatePaymentAddress()

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const simulatePayment = () => {
        setPaymentStatus('detected')
        setTimeout(() => {
            setPaymentStatus('confirmed')
            setTimeout(() => {
                window.location.href = '/payment-success'
            }, 2000)
        }, 3000)
    }

    const resetPayment = () => {
        setPaymentStatus('pending')
    }

    const getStatusColor = () => {
        switch (paymentStatus) {
            case 'pending':
                return 'text-[#ffd60a]'
            case 'detected':
                return 'text-[#f59e0b]'
            case 'confirmed':
                return 'text-[#2dd4bf]'
        }
    }

    const getStatusMessage = () => {
        switch (paymentStatus) {
            case 'pending':
                return 'Waiting for payment...'
            case 'detected':
                return 'Payment detected! Awaiting confirmation...'
            case 'confirmed':
                return 'Payment confirmed! Redirecting...'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#003566] flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#ffd60a] opacity-5 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#4361ee] opacity-5 animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="glass rounded-t-2xl p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </motion.button>
                        </Link>
                        <h2 className="text-xl font-bold text-white">Payment Demo</h2>
                        <div></div>
                    </div>

                    <div className="text-center">
                        <p className="text-3xl font-bold text-white mb-2">${usdAmount.toFixed(2)}</p>
                        <p className="text-white/60">Demo Store Purchase</p>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="glass rounded-b-2xl p-6">
                    {/* Chain & Token Selection */}
                    <div className="space-y-4 mb-6">
                        {/* Chain Selector */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Payment Network
                            </label>
                            <button
                                onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
                                className="w-full bg-[#001122] border border-white/10 rounded-lg p-3 flex items-center justify-between hover:border-[#ffd60a]/50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: selectedChain.color }}
                                    ></div>
                                    <span className="text-white font-medium">{selectedChain.name}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isChainDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isChainDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 bg-[#001122] border border-white/10 rounded-lg mt-1 z-20 overflow-hidden"
                                    >
                                        {chains.map((chain) => (
                                            <button
                                                key={chain.id}
                                                onClick={() => {
                                                    setSelectedChain(chain)
                                                    setIsChainDropdownOpen(false)
                                                }}
                                                className="w-full p-3 flex items-center space-x-3 hover:bg-white/5 transition-colors"
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-full"
                                                    style={{ backgroundColor: chain.color }}
                                                ></div>
                                                <span className="text-white">{chain.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Token Selector */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Payment Token
                            </label>
                            <button
                                onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                                className="w-full bg-[#001122] border border-white/10 rounded-lg p-3 flex items-center justify-between hover:border-[#ffd60a]/50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] rounded-full flex items-center justify-center text-black text-xs font-bold">
                                        {selectedToken.symbol.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-medium">{selectedToken.symbol}</p>
                                        <p className="text-xs text-white/60">{selectedToken.name}</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isTokenDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isTokenDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 bg-[#001122] border border-white/10 rounded-lg mt-1 z-20 overflow-hidden max-h-40 overflow-y-auto"
                                    >
                                        {tokens.map((token) => (
                                            <button
                                                key={token.symbol}
                                                onClick={() => {
                                                    setSelectedToken(token)
                                                    setIsTokenDropdownOpen(false)
                                                }}
                                                className="w-full p-3 flex items-center space-x-3 hover:bg-white/5 transition-colors"
                                            >
                                                <div className="w-6 h-6 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] rounded-full flex items-center justify-center text-black text-xs font-bold">
                                                    {token.symbol.charAt(0)}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white font-medium">{token.symbol}</p>
                                                    <p className="text-xs text-white/60">{token.name}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Payment Amount */}
                    <div className="bg-[#001122] border border-white/10 rounded-lg p-4 mb-6">
                        <div className="text-center">
                            <p className="text-sm text-white/60 mb-1">Send exactly</p>
                            <p className="text-2xl font-bold text-[#ffd60a]">
                                {formatCrypto(cryptoAmount, selectedToken.symbol)}
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                                Rate: 1 {selectedToken.symbol} = ${selectedToken.price.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-lg mb-6">
                        <QRCode
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={paymentAddress}
                            viewBox={`0 0 200 200`}
                        />
                    </div>

                    {/* Payment Address */}
                    <div className="bg-[#001122] border border-white/10 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 mr-3">
                                <p className="text-sm text-white/60 mb-1">Payment Address</p>
                                <p className="text-white font-mono text-sm break-all">
                                    {paymentAddress}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(paymentAddress)}
                                className="bg-[#ffd60a] text-black p-2 rounded-lg hover:bg-[#ffea5a] transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </motion.button>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <motion.div
                        animate={{
                            opacity: paymentStatus === 'confirmed' ? 1 : 0.9,
                            scale: paymentStatus === 'confirmed' ? 1.02 : 1
                        }}
                        className={`border border-white/10 rounded-lg p-4 mb-6 ${paymentStatus === 'confirmed' ? 'bg-[#2dd4bf]/10 border-[#2dd4bf]/30' : 'bg-[#001122]'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${paymentStatus === 'pending' ? 'bg-[#ffd60a] animate-pulse' :
                                paymentStatus === 'detected' ? 'bg-[#f59e0b] animate-pulse' :
                                    'bg-[#2dd4bf]'
                                }`}></div>
                            <p className={`font-medium ${getStatusColor()}`}>
                                {getStatusMessage()}
                            </p>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        {paymentStatus === 'pending' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={simulatePayment}
                                className="flex-1 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] text-black py-3 px-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                            >
                                Simulate Payment
                            </motion.button>
                        )}

                        {paymentStatus !== 'pending' && (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={resetPayment}
                                    className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Reset</span>
                                </motion.button>

                                {paymentStatus === 'confirmed' && (
                                    <Link href="/" className="flex-1">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-[#2dd4bf] to-[#4361ee] text-white py-3 px-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                                        >
                                            Continue
                                        </motion.button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-[#4361ee]/10 border border-[#4361ee]/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-[#4361ee] mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="text-white/80 mb-2">
                                    <strong>Demo Instructions:</strong>
                                </p>
                                <ul className="text-white/60 space-y-1 text-xs">
                                    <li>• This is a demo - no real payment will be processed</li>
                                    <li>• Click &quot;Simulate Payment&quot; to test the flow</li>
                                    <li>• In production, scan QR or copy address to your wallet</li>
                                    <li>• Payment status updates automatically</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
