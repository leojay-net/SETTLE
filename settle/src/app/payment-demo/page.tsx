import PaymentWidget from '../../components/PaymentWidget'
import { Suspense } from 'react'

export default function PaymentDemoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-200">Loading checkout…</div>}>
            <PaymentWidget />
        </Suspense>
    )
}
