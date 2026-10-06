import { Link } from 'react-router-dom'
import CityVideoBackground from '../components/CityVideoBackground'

const neofundComponents = [
  ['01', 'Mandate', 'What the manager intends to own, where they will act and where they will not.'],
  ['02', 'Capital', 'How capital is committed, allocated, deployed and returned.'],
  ['03', 'Ownership', 'The rights, responsibilities and economic interests associated with participation.'],
  ['04', 'Decisions', 'The reasoning, approvals and exceptions behind the organization’s actions.'],
  ['05', 'Reputation', 'The trust produced by observable judgment, communication and operating behavior over time.'],
]

const trustRequirements = [
  'A mandate with clear boundaries',
  'A vehicle appropriate to the intended activity',
  'Defined responsibilities and governance',
  'A documented history of decisions and exceptions',
  'Accurate capital, ownership and reporting records',
  'Qualified legal, tax and compliance support',
]

export default function FishNetwork() {
  return <div className="thesis-page">
    <section className="page-hero fish-page-hero">
      <CityVideoBackground />
      <div className="page-frame narrow">
        <p className="eyebrow">Iron Key and the Neofund thesis</p>
        <h1>The next investment firms will be built from evidence.</h1>
        <p>Iron Key helps experienced professionals turn a focused investment thesis into a credible first vehicle and an operating record. That foundation comes before larger structures, more capital or software.</p>
        <div className="hero-actions thesis-hero-actions">
          <Link className="button button-light" to="/apply">Start a conversation <span aria-hidden="true">↗</span></Link>
          <a className="text-link light" href="#why-now">Explore the thesis <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>

    <section className="section paper-bright" id="why-now">
      <div className="page-frame">
        <div className="section-index"><span>01</span><p>Why now</p></div>
        <div className="split-heading thesis-split-heading">
          <h2>Investment expertise is becoming more distributed. The path to becoming a manager has not kept pace.</h2>
          <div>
            <p>Capable investors increasingly emerge from outside established fund franchises. They are operators, analysts, founders, sector specialists and experienced professionals with direct proximity to markets that larger institutions may only encounter from a distance.</p>
            <p>The missing layer is not simply access to software or service providers. It is a disciplined path from relevant experience to a defined mandate, an appropriate first vehicle and evidence that another person can examine.</p>
          </div>
        </div>
        <div className="thesis-beliefs">
          <article><span>01</span><h3>Proximity</h3><p>Relevant experience can place a manager closer to information, operators and opportunities within a defined field.</p></article>
          <article><span>02</span><h3>Focus</h3><p>A clear mandate creates boundaries around what the manager will examine, ignore and seek to understand.</p></article>
          <article><span>03</span><h3>Ownership</h3><p>A first vehicle gives the manager responsibility for decisions, governance, communication and outcomes.</p></article>
        </div>
        <p className="thesis-conviction">The opportunity is not simply to form more funds. It is to help capable people become credible managers before they attempt to build full investment organizations.</p>
      </div>
    </section>

    <section className="section thesis-sequence-section">
      <div className="page-frame">
        <div className="section-index on-dark"><span>02</span><p>The structural problem</p></div>
        <div className="thesis-sequence-heading">
          <h2>The traditional path asks the institution to arrive before the evidence.</h2>
          <p>An aspiring manager is often encouraged to form a fund, appoint service providers, begin fundraising and absorb fixed operating costs before they have accumulated enough evidence of how they invest. A legal structure can establish a vehicle. It cannot establish judgment, discipline or trust.</p>
        </div>
        <div className="sequence-comparison">
          <article>
            <p className="mini-label">The conventional sequence</p>
            <ol><li>Form the fund</li><li>Announce the strategy</li><li>Seek capital</li><li>Attempt to establish the record</li></ol>
          </article>
          <article>
            <p className="mini-label">The evidence-led sequence</p>
            <ol><li>Define the mandate</li><li>Choose the appropriate first vehicle</li><li>Operate and document the work</li><li>Pursue a larger mandate when the record supports it</li></ol>
          </article>
        </div>
        <div className="first-vehicle-principle">
          <h3>The first vehicle is the first operating version of the firm.</h3>
          <p>The right starting point may be an investment club, a single deal, an SPV or a fund. Iron Key begins here: helping the manager choose a structure their present evidence can support and understand what that vehicle must prove.</p>
        </div>
      </div>
    </section>

    <section className="section paper neofund-model-section">
      <div className="page-frame">
        <div className="section-index"><span>03</span><p>The progression</p></div>
        <div className="split-heading thesis-split-heading">
          <h2>Manager readiness comes before institutional infrastructure.</h2>
          <div>
            <p>Iron Key helps the manager clarify the mandate, choose the first vehicle and define the operating evidence required to earn the next stage of responsibility.</p>
            <p>As that record develops, the organization can become a Neofund: a software-native investment organization whose essential systems develop together rather than across disconnected documents, conversations and service providers.</p>
          </div>
        </div>
        <div className="neofund-components">
          {neofundComponents.map(([number, title, body]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <p className="thesis-boundary">Iron Key does not certify a manager or promise that a vehicle will attract capital or perform. A Neofund is not a specific legal structure or a substitute for professional advice. It is the investment organization a credible manager may build toward.</p>
      </div>
    </section>

    <section className="section thesis-operating-section">
      <div className="page-frame">
        <div className="section-index on-dark"><span>04</span><p>What comes next</p></div>
        <div className="human-infrastructure-heading">
          <h2>A credible organization begins with human judgment. Infrastructure helps it compound.</h2>
          <div>
            <p>The manager defines the mandate, interprets incomplete information, makes decisions, manages conflicts and communicates with the people whose capital is at risk. No software can perform that responsibility on the manager’s behalf.</p>
            <p>Once the foundation is credible, connected infrastructure can strengthen the organization by making ownership, governance, participation, reporting and decision history easier to coordinate and examine.</p>
          </div>
        </div>
        <div className="neofund-pillars thesis-operating-pillars">
          <article><span>01</span><h2>Operate</h2><p>Put the mandate into practice through a real vehicle with defined responsibilities, governance and communication.</p></article>
          <article><span>02</span><h2>Prove</h2><p>Build an accumulating record of decisions and operating behavior that another person can examine.</p></article>
          <article><span>03</span><h2>Progress</h2><p>Add capital, structure and infrastructure when the evidence supports a larger mandate.</p></article>
        </div>
        <div className="trust-requirements">
          <div><p className="eyebrow">The conditions for trust</p><h3>A Neofund earns trust by making its constraints visible.</h3></div>
          <ul>{trustRequirements.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        <p className="operating-boundary">Technology can improve coordination and transparency. It cannot guarantee good judgment, investor interest, capital commitments or financial results.</p>
      </div>
    </section>

    <section className="section paper relationship-section">
      <div className="page-frame">
        <div className="section-index"><span>05</span><p>One thesis, distinct roles</p></div>
        <div className="relationship-intro">
          <h2>Iron Key establishes the foundation. Fish Network supports what follows.</h2>
          <p>They express the same evidence-led thesis at different stages of the manager’s progression.</p>
        </div>
      </div>
      <div className="page-frame relationship-grid">
        <article><span>01</span><p className="eyebrow">Iron Key · The starting point</p><h2>Prepare the manager.</h2><p>Iron Key helps experienced professionals define their mandate, choose an appropriate first vehicle and understand the operating evidence required to become credible managers. It addresses the human and strategic foundation before institutional scale.</p></article>
        <article><span>02</span><p className="eyebrow">Fish Network · The enabling layer</p><h2>Support the organization.</h2><p>Fish Network is intended to provide connected infrastructure through which a developing Neofund can coordinate capital, ownership, decisions and participation.</p></article>
      </div>
      <div className="page-frame external-callout"><p>Fish Network is a separate business. Participation in Iron Key does not currently require its use. Product availability and features should be confirmed directly with Fish Network.</p><a className="button button-dark" href="https://fishnetwork.co" target="_blank" rel="noreferrer">Visit Fish Network <span aria-hidden="true">↗</span></a></div>
    </section>

    <section className="section closing-section"><div className="page-frame cta-inline"><div><p className="eyebrow">Begin with the evidence</p><h2>Start with the manager. Build toward the organization.</h2><p>If you have relevant professional experience, a serious investment thesis and the ambition to manage capital, begin by defining what you intend to build and what your first vehicle must prove.</p></div><div className="cta-actions"><Link className="button button-dark" to="/apply">Start a conversation <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/#method">Explore the method <span aria-hidden="true">→</span></Link></div></div></section>
  </div>
}
