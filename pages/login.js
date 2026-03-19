import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Heart, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const from = router.query.from || '/'
      router.push(from)
    } else {
      setError('Incorrect password. Try again!')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Wesley & Leesianna's Wedding Planner 💍</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen pattern-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-plum-400 to-plum-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-white">Wesley & Leesianna's</h1>
            <p className="text-sm text-moon-300 font-sans mt-1">Wedding Planner ✨</p>
          </div>

          {/* Card */}
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-moon-300" />
              <h2 className="font-serif text-lg text-plum-50">Enter Password</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white0 hover:text-plum-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-500 font-sans">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Enter'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-white0 font-sans mt-6">
            For Wesley & Leesianna and their families 💕
          </p>
        </div>
      </div>
    </>
  )
}
