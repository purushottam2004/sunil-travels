import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@repo/auth'
import { Button } from '@repo/ui'

export function SignInPage() {
  const { user, loading, signInWithOAuth } = useAuth()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/enquiries'
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (loading) return <p className="sunil-panel">Loading…</p>
  if (user) return <Navigate to={from} replace />

  return (
    <section className="sunil-panel sign-in">
      <h1>Sign in</h1>
      <p>Optional. Sign in to see enquiries you send from this Google account.</p>
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <p>Google has to be turned on for this Supabase project before the button can finish.</p>
      )}
      <Button
        type="button"
        disabled={pending}
        onClick={() => {
          setPending(true)
          setError(null)
          void signInWithOAuth('google', window.location.origin + from).then(({ error: oauthError }) => {
            if (oauthError) {
              setError(oauthError.message)
              setPending(false)
            }
          })
        }}
      >
        {pending ? 'Opening Google…' : 'Continue with Google'}
      </Button>
    </section>
  )
}
