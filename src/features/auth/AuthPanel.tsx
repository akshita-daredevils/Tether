import { Button } from '../../components/Button'
import { Panel } from '../../components/Panel'
import { TextInput } from '../../components/TextInput'
import { useAuthForm } from '../../hooks/useAuthForm'

export const AuthPanel = () => {
  const {
    mode,
    email,
    password,
    displayName,
    setEmail,
    setPassword,
    setDisplayName,
    toggleMode,
    submit,
    submitGoogle,
    busy,
    error,
  } = useAuthForm()

  return (
    <Panel
      title="Welcome to Tether"
      description="Sign in to start your private space for two."
      className="neo-card"
    >
      <div className="grid gap-4">
        {mode === 'signup' ? (
          <TextInput
            placeholder="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        ) : null}
        <TextInput
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextInput
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-xs text-accent3">{error}</p> : null}
        <Button onClick={submit} disabled={busy}>
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </Button>
        <Button variant="glass" onClick={submitGoogle} disabled={busy}>
          Continue with Google
        </Button>
        <button
          type="button"
          className="text-xs text-white/60 transition hover:text-white"
          onClick={toggleMode}
        >
          {mode === 'signup' ? 'Already have an account? Sign in.' : 'New here? Create an account.'}
        </button>
      </div>
    </Panel>
  )
}
