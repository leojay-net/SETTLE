'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Wallet, Menu, X } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { login, logout, ready, authenticated, user } = usePrivy()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <motion.div {...fadeIn} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-black" />
                        </div>
                        <Link href="/" className="text-2xl font-bold text-white">
                            SETTLE
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#features" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-2.5 rounded-xl transition-all font-medium text-lg">
                            Features
                        </Link>
                        <Link href="/#how-it-works" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-2.5 rounded-xl transition-all font-medium text-lg">
                            How it Works
                        </Link>
                        <Link href="/docs" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-2.5 rounded-xl transition-all font-medium text-lg">
                            API Docs
                        </Link>
                        <Link href="/dashboard" className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-2.5 rounded-xl transition-all font-medium text-lg">
                            Dashboard
                        </Link>
                        <div className="ml-4 pl-6 border-l border-slate-700 flex items-center gap-3">
                            {ready && authenticated && (
                                <span className="text-slate-300 text-sm font-mono">
                                    {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                                </span>
                            )}
                            {ready && !authenticated ? (
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => login()}
                                    className="bg-accent text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-accent-light transition-colors"
                                >
                                    Connect Wallet
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => logout()}
                                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                                >
                                    Logout
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-3 rounded-xl text-white hover:bg-slate-800/50 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50"
                    >
                        <div className="px-4 py-6 space-y-3">
                            <Link onClick={() => setIsMenuOpen(false)} href="/#features" className="block text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-4 rounded-xl transition-all font-medium text-lg">
                                Features
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/#how-it-works" className="block text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-4 rounded-xl transition-all font-medium text-lg">
                                How it Works
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/docs" className="block text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-4 rounded-xl transition-all font-medium text-lg">
                                API Docs
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/dashboard" className="block text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-4 rounded-xl transition-all font-medium text-lg">
                                Dashboard
                            </Link>
                            <div className="pt-4 mt-4 border-t border-slate-700/50">
                                {!authenticated ? (
                                    <button onClick={() => { setIsMenuOpen(false); login(); }} className="w-full bg-accent hover:bg-accent-light text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors">
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button onClick={() => { setIsMenuOpen(false); logout(); }} className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors">
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
