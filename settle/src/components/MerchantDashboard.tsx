'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
    Wallet,
    Settings,
    BarChart3,
    CreditCard,
    Key,
    Bell,
    User,
    LogOut,
    Search,
    Filter,
    Download,
    ExternalLink,
    Copy,
    Check,
    TrendingUp,
    DollarSign,
    Activity,
    ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import { mockTransactions, formatCurrency } from '../lib/utils'

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

export default function MerchantDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const mockStats = {
        totalVolume: 45623.45,
        transactionsToday: 23,
        averageSale: 198.41,
        conversionRate: 94.2
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#003566]">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-40 right-40 w-96 h-96 rounded-full bg-[#ffd60a] opacity-5 animate-pulse"></div>
                <div className="absolute bottom-40 left-40 w-80 h-80 rounded-full bg-[#4361ee] opacity-5 animate-pulse delay-1000"></div>
            </div>

            {/* Sidebar */}
            <div className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 z-40">
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] rounded-lg flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white">SETTLE</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'transactions', label: 'Transactions', icon: CreditCard },
                            { id: 'integration', label: 'Integration', icon: Key },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-[#ffd60a]/20 text-[#ffd60a] border border-[#ffd60a]/30'
                                        : 'text-white/80 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            )
                        })}
                    </nav>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#4361ee] to-[#2dd4bf] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">Demo Store</p>
                                <p className="text-xs text-white/60">demo@store.com</p>
                            </div>
                            <button className="text-white/60 hover:text-white">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 relative z-30">
                {/* Header */}
                <div className="glass border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {activeTab === 'overview' && 'Dashboard Overview'}
                                {activeTab === 'transactions' && 'Transactions'}
                                {activeTab === 'integration' && 'Integration'}
                                {activeTab === 'settings' && 'Settings'}
                            </h1>
                            <p className="text-white/60 mt-1">
                                {activeTab === 'overview' && 'Monitor your payment performance'}
                                {activeTab === 'transactions' && 'View and manage all transactions'}
                                {activeTab === 'integration' && 'Set up payment integration'}
                                {activeTab === 'settings' && 'Configure your account settings'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-white/60 hover:text-white">
                                <Bell className="w-6 h-6" />
                            </button>
                            <Link href="/payment-demo">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    Test Payment
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={stagger}
                            className="space-y-6"
                        >
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        title: 'Total Volume',
                                        value: formatCurrency(mockStats.totalVolume),
                                        change: '+12.5%',
                                        icon: DollarSign,
                                        color: 'text-[#2dd4bf]'
                                    },
                                    {
                                        title: 'Transactions Today',
                                        value: mockStats.transactionsToday.toString(),
                                        change: '+8.2%',
                                        icon: Activity,
                                        color: 'text-[#ffd60a]'
                                    },
                                    {
                                        title: 'Average Sale',
                                        value: formatCurrency(mockStats.averageSale),
                                        change: '+5.1%',
                                        icon: TrendingUp,
                                        color: 'text-[#4361ee]'
                                    },
                                    {
                                        title: 'Conversion Rate',
                                        value: `${mockStats.conversionRate}%`,
                                        change: '+2.3%',
                                        icon: ArrowUpRight,
                                        color: 'text-[#2dd4bf]'
                                    }
                                ].map((stat, index) => {
                                    const Icon = stat.icon
                                    return (
                                        <motion.div
                                            key={index}
                                            variants={fadeIn}
                                            className="glass rounded-2xl p-6 hover-lift web3-glow"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-sm text-[#2dd4bf] font-medium">
                                                    {stat.change}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-1">
                                                {stat.value}
                                            </h3>
                                            <p className="text-white/60 text-sm">
                                                {stat.title}
                                            </p>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Recent Transactions */}
                            <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                                    <Link href="#" onClick={() => setActiveTab('transactions')}>
                                        <button className="text-[#ffd60a] hover:text-[#ffea5a] font-medium text-sm flex items-center space-x-1">
                                            <span>View All</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {mockTransactions.slice(0, 3).map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-3 h-3 rounded-full ${tx.status === 'Settled' ? 'bg-[#2dd4bf]' : 'bg-[#f59e0b] animate-pulse'
                                                    }`}></div>
                                                <div>
                                                    <p className="text-white font-medium">{tx.orderId}</p>
                                                    <p className="text-white/60 text-sm">{tx.customerPayment}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold">{tx.amountSettled}</p>
                                                <p className="text-white/60 text-sm">{tx.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={stagger}
                            className="space-y-6"
                        >
                            {/* Filters */}
                            <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            className="w-full bg-[#001122] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-[#ffd60a]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <button className="bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2">
                                        <Filter className="w-4 h-4" />
                                        <span>Filter</span>
                                    </button>
                                    <button className="bg-[#ffd60a] text-black px-4 py-3 rounded-lg hover:bg-[#ffea5a] transition-colors flex items-center space-x-2 font-semibold">
                                        <Download className="w-4 h-4" />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </motion.div>

                            {/* Transactions Table */}
                            <motion.div variants={fadeIn} className="glass rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5">
                                            <tr>
                                                <th className="text-left p-4 text-white/80 font-semibold">Order ID</th>
                                                <th className="text-left p-4 text-white/80 font-semibold">Date</th>
                                                <th className="text-left p-4 text-white/80 font-semibold">Customer Payment</th>
                                                <th className="text-left p-4 text-white/80 font-semibold">Amount Settled</th>
                                                <th className="text-left p-4 text-white/80 font-semibold">Status</th>
                                                <th className="text-left p-4 text-white/80 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockTransactions.map((tx, index) => (
                                                <motion.tr
                                                    key={tx.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <p className="text-white font-medium">{tx.orderId}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-white/80">{tx.date}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-white">{tx.customerPayment}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-[#2dd4bf] font-semibold">{tx.amountSettled}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'Settled'
                                                            ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]'
                                                            : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                                                            }`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => copyToClipboard(tx.txHash, tx.id)}
                                                                className="text-white/60 hover:text-[#ffd60a] transition-colors"
                                                            >
                                                                {copied === tx.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                            <button className="text-white/60 hover:text-[#ffd60a] transition-colors">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Integration Tab */}
                    {activeTab === 'integration' && (
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={stagger}
                            className="space-y-6"
                        >
                            {/* API Keys */}
                            <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6">API Keys</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            Public Key
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value="pk_test_1234567890abcdef"
                                                readOnly
                                                className="flex-1 bg-[#001122] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => copyToClipboard('pk_test_1234567890abcdef', 'public')}
                                                className="bg-[#ffd60a] text-black p-3 rounded-lg hover:bg-[#ffea5a] transition-colors"
                                            >
                                                {copied === 'public' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            Secret Key
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="password"
                                                value="sk_test_0987654321fedcba"
                                                readOnly
                                                className="flex-1 bg-[#001122] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => copyToClipboard('sk_test_0987654321fedcba', 'secret')}
                                                className="bg-[#ffd60a] text-black p-3 rounded-lg hover:bg-[#ffea5a] transition-colors"
                                            >
                                                {copied === 'secret' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </motion.button>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gradient-to-r from-[#4361ee] to-[#2dd4bf] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                                    >
                                        Regenerate Keys
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Widget Code */}
                            <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6">Payment Widget</h2>

                                <div className="bg-[#001122] border border-white/10 rounded-lg p-4 font-mono text-sm text-white/80 overflow-x-auto">
                                    <pre>{`<!-- Add this to your checkout page -->
<script src="https://js.settle.com/v1/settle.js"></script>
<div id="settle-payment-widget"></div>

<script>
  Settle.init({
    publicKey: 'pk_test_1234567890abcdef',
    amount: 150.00,
    currency: 'USD',
    orderId: 'ORDER-12345',
    onSuccess: function(payment) {
      // Handle successful payment
      console.log('Payment successful:', payment);
    },
    onError: function(error) {
      // Handle payment error
      console.error('Payment error:', error);
    }
  });
</script>`}</pre>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-white/60 text-sm">
                                        Copy this code to your checkout page
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => copyToClipboard('widget-code', 'widget')}
                                        className="bg-[#ffd60a] text-black px-4 py-2 rounded-lg hover:bg-[#ffea5a] transition-colors flex items-center space-x-2"
                                    >
                                        {copied === 'widget' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        <span>Copy Code</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={stagger}
                            className="space-y-6"
                        >
                            {/* Settlement Configuration */}
                            <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6">Settlement Configuration</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            Settlement Chain
                                        </label>
                                        <select className="w-full bg-[#001122] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#ffd60a]/50 focus:outline-none">
                                            <option>Polygon</option>
                                            <option>Ethereum</option>
                                            <option>Arbitrum</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            Settlement Token
                                        </label>
                                        <select className="w-full bg-[#001122] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#ffd60a]/50 focus:outline-none">
                                            <option>USDC</option>
                                            <option>USDT</option>
                                            <option>DAI</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Settlement Wallet Address
                                    </label>
                                    <input
                                        type="text"
                                        value="0x1234567890123456789012345678901234567890"
                                        className="w-full bg-[#001122] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-[#ffd60a]/50 focus:outline-none"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-6 bg-gradient-to-r from-[#ffd60a] to-[#ffea5a] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    Save Settings
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
