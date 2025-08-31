'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import {
    ArrowRight,
    ArrowLeft,
    Wallet,
    CheckCircle,
    Copy,
    Check,
    Globe,
    Shield,
    Zap
} from 'lucide-react'
import Link from 'next/link'
import { chains, tokens } from '../lib/utils'

// Removed unused fadeIn variant to satisfy lint

const slideIn = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4 }
}

export default function OnboardingFlow() {
    const { login, authenticated, user, ready } = usePrivy()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        businessName: '',
        website: '',
        settlementChain: 'polygon',
        settlementToken: 'usdc',
        walletAddress: ''
    })
    const [walletConnected, setWalletConnected] = useState(false)
    const [copied, setCopied] = useState(false)

    const totalSteps = 4

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const connectWallet = async () => {
        await login()
        if (user?.wallet?.address) {
            setWalletConnected(true)
            setFormData({
                ...formData,
                walletAddress: user.wallet.address
            })
        }
    }

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div key="step1" variants={slideIn} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">Welcome to SETTLE</h2>
                            <p className="text-white/80 text-lg">
                                {"Let's get your crypto payment system set up in just a few minutes"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    placeholder="Enter your business name"
                                    className="w-full bg-[#001122] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#ffd60a]/50 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://yourstore.com"
                                    className="w-full bg-[#001122] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#ffd60a]/50 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            {[
                                { icon: <Zap className="w-8 h-8" />, title: "Instant Settlement", desc: "Get paid immediately" },
                                { icon: <Shield className="w-8 h-8" />, title: "Secure", desc: "Built on Chainlink CCIP" },
                                { icon: <Globe className="w-8 h-8" />, title: "Multi-Chain", desc: "Accept from any blockchain" }
                            ].map((feature, index) => (
                                <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                                    <div className="text-[#ffd60a] mb-3 flex justify-center">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                                    <p className="text-white/60 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )

            case 2:
                return (
                    <motion.div key="step2" variants={slideIn} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
                            <p className="text-white/80 text-lg">
                                This wallet will receive all your settlement payments
                            </p>
                        </div>

                        {!walletConnected && !(ready && authenticated) ? (
                            <div className="text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={connectWallet}
                                    className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-light transition-colors flex items-center space-x-3 mx-auto"
                                >
                                    <Wallet className="w-6 h-6" />
                                    <span>Connect Wallet</span>
                                </motion.button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="inline-flex items-center space-x-3 bg-[#2dd4bf]/20 border border-[#2dd4bf]/30 rounded-lg px-6 py-4 mb-6">
                                    <CheckCircle className="w-6 h-6 text-[#2dd4bf]" />
                                    <span className="text-[#2dd4bf] font-semibold">Wallet Connected</span>
                                </div>

                                <div className="bg-[#001122] border border-white/10 rounded-lg p-4">
                                    <p className="text-white/60 text-sm mb-2">Connected Wallet Address</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-mono">{formData.walletAddress || user?.wallet?.address}</p>
                                        <button
                                            onClick={() => copyToClipboard(formData.walletAddress || user?.wallet?.address || '')}
                                            className="text-[#ffd60a] hover:text-[#ffea5a] transition-colors"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )

            case 3:
                return (
                    <motion.div key="step3" variants={slideIn} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">Settlement Preferences</h2>
                            <p className="text-white/80 text-lg">
                                Choose the blockchain and token you want to receive payments in
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-3">
                                    Settlement Chain
                                </label>
                                <div className="space-y-3">
                                    {chains.slice(0, 3).map((chain) => (
                                        <label
                                            key={chain.id}
                                            className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all hover:border-[#ffd60a]/50 ${formData.settlementChain === chain.id
                                                ? 'border-[#ffd60a] bg-[#ffd60a]/10'
                                                : 'border-white/10 bg-white/5'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="settlementChain"
                                                value={chain.id}
                                                checked={formData.settlementChain === chain.id}
                                                onChange={(e) => setFormData({ ...formData, settlementChain: e.target.value })}
                                                className="sr-only"
                                            />
                                            <div
                                                className="w-8 h-8 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: chain.color }}
                                            ></div>
                                            <div>
                                                <p className="text-white font-semibold">{chain.name}</p>
                                                <p className="text-white/60 text-sm">Fast & low cost</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-3">
                                    Settlement Token
                                </label>
                                <div className="space-y-3">
                                    {tokens.slice(0, 3).map((token) => (
                                        <label
                                            key={token.symbol}
                                            className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all hover:border-[#ffd60a]/50 ${formData.settlementToken === token.symbol.toLowerCase()
                                                ? 'border-[#ffd60a] bg-[#ffd60a]/10'
                                                : 'border-white/10 bg-white/5'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="settlementToken"
                                                value={token.symbol.toLowerCase()}
                                                checked={formData.settlementToken === token.symbol.toLowerCase()}
                                                onChange={(e) => setFormData({ ...formData, settlementToken: e.target.value })}
                                                className="sr-only"
                                            />
                                            <div className="w-8 h-8 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] rounded-full flex items-center justify-center text-black text-sm font-bold">
                                                {token.symbol.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{token.symbol}</p>
                                                <p className="text-white/60 text-sm">{token.name}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )

            case 4:
                return (
                    <motion.div key="step4" variants={slideIn} className="space-y-6">
                        <div className="text-center mb-8">
                            <CheckCircle className="w-16 h-16 text-[#2dd4bf] mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-white mb-4">All Set!</h2>
                            <p className="text-white/80 text-lg">
                                Your SETTLE account is ready to accept crypto payments
                            </p>
                        </div>

                        <div className="bg-[#001122] border border-white/10 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Configuration Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Business:</span>
                                    <span className="text-white font-medium">{formData.businessName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Website:</span>
                                    <span className="text-white font-medium">{formData.website}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Settlement:</span>
                                    <span className="text-white font-medium">
                                        {formData.settlementToken.toUpperCase()} on {
                                            chains.find(c => c.id === formData.settlementChain)?.name
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Wallet:</span>
                                    <span className="text-white font-medium font-mono">
                                        {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-4)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-white/80 mb-6">
                                You will receive <strong className="text-[#ffd60a]">{formData.settlementToken.toUpperCase()}</strong> on{' '}
                                <strong className="text-[#4361ee]">
                                    {chains.find(c => c.id === formData.settlementChain)?.name}
                                </strong>{' '}
                                for all payments.
                            </p>

                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] text-black px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                                >
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#003566] flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#ffd60a] opacity-5 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#4361ee] opacity-5 animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                {/* Header */}
                <div className="glass rounded-t-2xl p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </motion.button>
                        </Link>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-xl font-bold text-white">SETTLE</span>
                        </div>
                        <div></div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-white/60">
                            <span>Step {currentStep} of {totalSteps}</span>
                            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                className="bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] h-2 rounded-full transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="glass rounded-b-2xl p-8 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {getStepContent()}
                    </AnimatePresence>

                    {/* Navigation */}
                    {currentStep < 4 && (
                        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${currentStep === 1
                                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={nextStep}
                                disabled={
                                    (currentStep === 1 && (!formData.businessName || !formData.website)) ||
                                    (currentStep === 2 && !walletConnected)
                                }
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${(currentStep === 1 && (!formData.businessName || !formData.website)) ||
                                    (currentStep === 2 && !walletConnected)
                                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] text-black hover:shadow-lg'
                                    }`}
                            >
                                <span>Continue</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
