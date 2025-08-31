'use client'

import { motion } from 'framer-motion'
import {
    Wallet,
    CreditCard,
    TrendingUp,
    Shield,
    Zap,
    Globe,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
}

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export default function LandingPage() {
    // nav handled globally

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden">
            {/* Modern Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-px h-32 bg-white/10"></div>
            </div>

            {/* Hero Section - Improved spacing and typography */}
            <motion.section
                initial="initial"
                animate="animate"
                variants={stagger}
                className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-8">
                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white"
                        >
                            Accept Any Crypto
                            <span className="block text-slate-300 text-4xl sm:text-5xl lg:text-6xl mt-2">Settle in One Token</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            className="text-xl sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
                        >
                            SETTLE enables merchants to accept payments in any cryptocurrency while receiving settlements in their preferred token on their chosen blockchain.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
                        >
                            <Link href="/onboarding">
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-light transition-colors flex items-center gap-3"
                                >
                                    <span>Start Accepting Crypto</span>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>

                            <Link href="/payment-demo">
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="border border-slate-600 bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-colors flex items-center gap-3"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>Try Payment Demo</span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section - Modern card design */}
            <motion.section
                id="features"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={fadeIn} className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Why Choose SETTLE?
                        </h2>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Simplify crypto payments with our seamless, secure, and efficient solution
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="w-10 h-10" />,
                                title: "Instant Settlement",
                                description: "Receive your preferred token on your chosen blockchain instantly after customer payments",
                                color: "from-yellow-400 to-orange-500"
                            },
                            {
                                icon: <Shield className="w-10 h-10" />,
                                title: "Secure & Trustless",
                                description: "Built on Chainlink CCIP for secure cross-chain transfers with no intermediaries",
                                color: "from-green-400 to-emerald-500"
                            },
                            {
                                icon: <Globe className="w-10 h-10" />,
                                title: "Multi-Chain Support",
                                description: "Accept payments from Ethereum, Polygon, Arbitrum, Solana, and more",
                                color: "from-blue-400 to-cyan-500"
                            },
                            {
                                icon: <CreditCard className="w-10 h-10" />,
                                title: "Easy Integration",
                                description: "Simple widget or API integration. Get started in minutes, not days",
                                color: "from-purple-400 to-pink-500"
                            },
                            {
                                icon: <TrendingUp className="w-10 h-10" />,
                                title: "Real-time Analytics",
                                description: "Track transactions, volume, and performance with our comprehensive dashboard",
                                color: "from-indigo-400 to-purple-500"
                            },
                            {
                                icon: <Wallet className="w-10 h-10" />,
                                title: "No Wallet Required",
                                description: "Customers can pay with any wallet or exchange without creating new accounts",
                                color: "from-teal-400 to-blue-500"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="group relative"
                            >
                                <div className="relative h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-2">
                                    <div className="inline-flex p-4 rounded-2xl bg-slate-200 text-slate-900 mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* How It Works Section - Modern step design */}
            <motion.section
                id="how-it-works"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24 bg-slate-900/20"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={fadeIn} className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            How It Works
                        </h2>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Three simple steps to start accepting crypto payments
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "Setup Your Account",
                                description: "Connect your wallet, choose your settlement chain and token, and configure your preferences",
                                gradient: "from-yellow-400 to-orange-500"
                            },
                            {
                                step: "02",
                                title: "Integrate Payment Widget",
                                description: "Add our simple widget to your website or use our API for custom implementations",
                                gradient: "from-blue-400 to-cyan-500"
                            },
                            {
                                step: "03",
                                title: "Start Receiving Payments",
                                description: "Customers pay with any crypto, you receive your preferred token automatically",
                                gradient: "from-emerald-400 to-teal-500"
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="relative group"
                            >
                                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 text-center hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-2">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-200 text-slate-900 font-bold text-xl mb-6">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Connection line for larger screens */}
                                {index < 2 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                                        <div className="w-12 h-0.5 bg-gradient-to-r from-slate-600 to-slate-500"></div>
                                        <ArrowRight className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section - Modern design */}
            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-5xl mx-auto text-center">
                    <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12 hover:bg-slate-700/50 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-blue-400/10 rounded-3xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
                                Ready to Get <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Started</span>?
                            </h2>
                            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Join thousands of merchants already using SETTLE to accept crypto payments
                            </p>
                            <Link href="/onboarding">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 inline-flex items-center space-x-4 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10">Start Building Now</span>
                                    <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Footer - Modern design */}
            <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-700/50">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white">SETTLE</span>
                    </div>
                    <p className="text-slate-400 text-lg">
                        © 2024 SETTLE. Simplifying crypto payments for everyone.
                    </p>
                </div>
            </footer>
        </div>
    )
}
