'use client'

import { useState } from 'react'

const BIASES = [
  'Fear / Panic',
  'FOMO',
  'Herd Behavior',
  'Overconfidence',
  'Loss Aversion',
  'Recency Bias',
  'Other',
]

export default function Dashboard() {
  const [form, setForm] = useState({
    asset: '',
    action: 'buy',
    reason: '',
    bias: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  async function handleSubmit() {
    if (!form.asset || !form.reason) return
    setStatus('loading')
    // Supabase'e kaydedeceğiz — şimdilik simüle ediyoruz
    await new Promise(r => setTimeout(r, 800))
    setStatus('success')
    setForm({ asset: '', action: 'buy', reason: '', bias: '' })
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">
          Contra<span className="text-[#e63946]">rian</span>
        </h1>
        <p className="text-gray-400 mb-8">Log your investment decision</p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Asset (e.g. AAPL, BTC, Gold)"
              value={form.asset}
              onChange={e => setForm({ ...form, asset: e.target.value })}
              className="flex-1 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e63946]"
            />
            <select
              value={form.action}
              onChange={e => setForm({ ...form, action: e.target.value })}
              className="px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-[#e63946]"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="hold">Hold</option>
            </select>
          </div>

          <textarea
            placeholder="Why are you making this decision? Be honest."
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
            rows={4}
            className="px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e63946] resize-none"
          />

          <select
            value={form.bias}
            onChange={e => setForm({ ...form, bias: e.target.value })}
            className="px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-[#e63946]"
          >
            <option value="">What emotion is driving this? (optional)</option>
            {BIASES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#e63946] text-white font-semibold rounded-lg hover:bg-[#c1121f] transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Saving...' : status === 'success' ? '✓ Logged!' : 'Log Decision'}
          </button>
        </div>
      </div>
    </main>
  )
}
