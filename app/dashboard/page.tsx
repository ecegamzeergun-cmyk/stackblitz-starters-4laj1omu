'use client'

import { useState } from 'react'
import { useState, useEffect } from 'react'

const SUPABASE_URL = 'https://obqcsjtgwvgmaaqjsmti.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWNzanRnd3ZnbWFhcWpzbXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMzEzMDEsImV4cCI6MjA5NjgwNzMwMX0.LBwc8NgUKHC9IG73f6ZzK2i2naOjJbS6ONCWOH0lKIc'

const BIASES = [
  'Fear / Panic', 'FOMO', 'Herd Behavior',
  'Overconfidence', 'Loss Aversion', 'Recency Bias', 'Other',
]

function getToken() { return localStorage.getItem('sb_token') }

async function getUserId() {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  return data.id
}

export default function Dashboard() {
  const [tab, setTab] = useState<'log' | 'decisions' | 'analysis'>('log')
  const [form, setForm] = useState({ asset: '', action: 'buy', reason: '', bias: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [decisions, setDecisions] = useState<any[]>([])
  const [loadingDecisions, setLoadingDecisions] = useState(false)

  useEffect(() => {
    if (tab === 'decisions') fetchDecisions()
  }, [tab])

  async function fetchDecisions() {
    setLoadingDecisions(true)
    const token = getToken()
    const res = await fetch(`${SUPABASE_URL}/rest/v1/decisions?order=created_at.desc`, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    setDecisions(Array.isArray(data) ? data : [])
    setLoadingDecisions(false)
  }
  
  async function handleSubmit() {
    if (!form.asset || !form.reason) return
    setStatus('loading')
    const token = getToken()
    const userId = await getUserId()
    if (!token || !userId) { setStatus('error'); return }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/decisions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${token}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId, asset: form.asset,
        action: form.action, reason: form.reason, bias: form.bias || null,
      })
    })
    if (res.ok) {
      setStatus('success')
      setForm({ asset: '', action: 'buy', reason: '', bias: '' })
      setTimeout(() => setStatus('idle'), 2000)
    } else { setStatus('error') }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Contra<span className="text-[#e63946]">rian</span>
        </h1>
        <div className="flex gap-1">
          {[
            { key: 'log', label: 'Log Decision' },
            { key: 'decisions', label: 'My Decisions' },
            { key: 'analysis', label: 'My Analysis' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key
                  ? 'bg-[#e63946] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Log Decision Tab */}
        {tab === 'log' && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-400 mb-2">What are you doing and why?</p>
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
            {status === 'error' && (
              <p className="text-red-400 text-sm">Something went wrong. Are you logged in?</p>
            )}
          </div>
        )}

        {/* My Decisions Tab */}
        {tab === 'decisions' && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">Coming soon</p>
            <p className="text-sm mt-2">Your decision history will appear here.</p>
          </div>
        )}

        {/* Analysis Tab */}
        {tab === 'analysis' && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">Coming soon</p>
            <p className="text-sm mt-2">Your AI-powered bias analysis will appear here.</p>
          </div>
        )}
      </div>
    </main>
  )
}
