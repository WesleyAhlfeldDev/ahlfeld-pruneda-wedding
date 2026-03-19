// API route has full access to env vars — validates password here
const AUTH_TOKEN = 'wedding-planner-authenticated'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  const correct = process.env.SITE_PASSWORD || 'wedding2027'

  if (password === correct) {
    // Set a fixed token cookie — middleware checks for this
    res.setHeader(
      'Set-Cookie',
      `auth=${AUTH_TOKEN}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`
    )
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ error: 'Incorrect password' })
}
