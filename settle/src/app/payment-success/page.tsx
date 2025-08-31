import PaymentSuccess from '../../components/PaymentSuccess'
import { Suspense } from 'react'

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-200">Loading...</div>}>
            <PaymentSuccess />
        </Suspense>
    )
}
