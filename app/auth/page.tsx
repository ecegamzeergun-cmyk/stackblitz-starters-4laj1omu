'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleSubmit() {
    if (!email || !password) return
    setStatus('loading')

    const endpoint = mode === 'signup'
      ? 'https://obqcsjtgwvgmaaqjsmti.supabase.co/auth/v1/signup'
      : 'https://obqcsjtgwvgmaaqjsmti.supabase.co/auth/v1/token?grant_type=password'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWNzanRnd3ZnbWFhcWpzbXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMzEzMDEsImV4cCI6MjA5NjgwNzMwMX0.LBwc8NgUKHC9IG73f6ZzK2i2naOjJbS6ONCWOH0lKIc',
      },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setStatus('error')
      setMessage(data.error_description || data.msg || 'Something went wrong.')
    } else {
      if (mode === 'signup') {
        setStatus('success')
        setMessage('Check your email to confirm your account!')
      } else {
        localStorage.setItem('sb_token', data.access_token)
        router.push('/dashboard')
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold mb-2">
          Contra<span className="text-[#e63946]">rian</span>
        </h1>
        <p className="text-gray-400 mb-8">
          {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e63946]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e63946]"
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#e63946] text-white font-semibold rounded-lg hover:bg-[#c1121f] transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </div>

        {message && (
          <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        <p className="text-gray-500 text-sm mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}
            className="text-[#e63946] hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </main>
  )
}
