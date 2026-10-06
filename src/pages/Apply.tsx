import { FormEvent, useState } from 'react'

export default function Apply() {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle')
  const endpoint = import.meta.env.VITE_APPLICATION_ENDPOINT as string | undefined

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const params = new URLSearchParams(location.search)
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) data[key] = params.get(key) ?? sessionStorage.getItem(key) ?? ''
    if (!endpoint) { setStatus('error'); return }
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ form: 'incubator-interest', ...data }) })
      if (!response.ok) throw new Error()
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return <div className="application-page">
    <section className="page-hero application-hero">
      <div className="page-frame narrow">
        <p className="eyebrow">Incubator Program</p>
        <h1>Build the manager before the fund.</h1>
        <p className="application-hero__statement">Knowing a market is not the same as being ready to manage capital. <span>Iron Key helps experienced professionals turn a serious investment thesis into a credible first vehicle and a verifiable operating record.</span></p>
        <div className="hero-actions">
          <a className="button button-light" href="#conversation">Start a conversation <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>

    <section className="section paper-bright application-conversation" id="conversation">
      <div className="page-frame application-conversation-heading">
        <div><p className="eyebrow">The next step</p><h2>Start with a conversation.</h2></div>
        <p>Share your experience, investment thesis and intended first vehicle. We will review the context and be in touch if an initial consultation would be useful.</p>
      </div>
      <form className="application-form page-frame" onSubmit={submit}>
        <fieldset><legend><span>01</span> Contact</legend><div className="form-grid application-contact-grid"><label>Full name<input name="fullName" autoComplete="name" required /></label><label>Work email<input type="email" name="email" autoComplete="email" required /></label><label>LinkedIn profile<input type="url" name="linkedin" placeholder="https://linkedin.com/in/…" required /></label></div></fieldset>
        <fieldset><legend><span>02</span> What you intend to build</legend><div className="form-grid"><label className="wide">Current or most recent role and organization<input name="role" required /></label><label className="wide">What is your investment thesis or area of expertise?<textarea name="thesis" rows={4} required /></label><label>What are you considering?<select name="vehicle" required defaultValue=""><option value="" disabled>Select</option><option>Investment club</option><option>Single deal or syndicate</option><option>SPV</option><option>Fund</option><option>Not sure</option></select></label><label>When would you like to begin?<select name="timeline" required defaultValue=""><option value="" disabled>Select</option><option>Within 6 months</option><option>6–18 months</option><option>Later</option><option>No date</option></select></label><label className="wide">What is the main thing standing between you and your first vehicle?<textarea name="obstacle" rows={4} /></label></div></fieldset>
        <label className="application-consent"><input type="checkbox" name="acknowledgement" required /><span>I understand that Iron Key provides education, not investment, legal or tax advice, and does not introduce investors or raise capital.</span></label>
        <button className="button button-dark submit-application" disabled={status==='sending'}>{status==='sending'?'Sending…':'Start the conversation'} <span aria-hidden="true">→</span></button>
        <div className="form-status" aria-live="polite">{status==='success'&&<p>Thank you. We will review your background, thesis and intended vehicle and be in touch if there is a potential fit.</p>}{status==='error'&&<p>We could not send your details. Please try again later.</p>}</div>
      </form>
    </section>
  </div>
}
