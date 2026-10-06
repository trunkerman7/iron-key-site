import { Link } from 'react-router-dom'
import CityVideoBackground from '../components/CityVideoBackground'
import FishAsciiBackdrop from '../components/FishAsciiBackdrop'
import NeofundStory from '../components/NeofundStory'
import { RecordArchive, VehicleArtwork } from '../components/VisualSystems'

const method = [
  {
    number: '01',
    title: 'Define the mandate',
    copy: 'Turn experience and conviction into a focused investment thesis with a clear field of action.',
    output: 'A strategy with edges',
  },
  {
    number: '02',
    title: 'Choose the vehicle',
    copy: 'Select the structure that fits the opportunity, the network and the proof that exists today.',
    output: 'A credible starting point',
  },
  {
    number: '03',
    title: 'Operate and prove',
    copy: 'Make decisions, deploy capital, govern the vehicle and create evidence another person can examine.',
    output: 'A verifiable record',
  },
  {
    number: '04',
    title: 'Grow the institution',
    copy: 'Use demonstrated judgment and operating evidence to pursue a larger mandate when the record supports it.',
    output: 'A firm ready to progress',
  },
]

const vehicles = [
  {
    number: '01',
    type: 'club' as const,
    title: 'Investment club',
    summary: 'A structured way to develop judgment with a trusted group before carrying a full mandate.',
    use: 'Shared learning and disciplined decisions',
    proves: 'Process and collaboration',
    next: 'A first body of work',
  },
  {
    number: '02',
    type: 'deal' as const,
    title: 'Single deal',
    summary: 'A focused vehicle for showing how you source, assess and execute one high-conviction opportunity.',
    use: 'One defined opportunity',
    proves: 'Selection and execution',
    next: 'Repeatable deal activity',
  },
  {
    number: '03',
    type: 'spv' as const,
    title: 'SPV',
    summary: 'A formal structure for organizing capital and ownership around a specific asset or transaction.',
    use: 'Capital around a specific asset',
    proves: 'Structuring and governance',
    next: 'A broader portfolio mandate',
  },
  {
    number: '04',
    type: 'fund' as const,
    title: 'Fund',
    summary: 'A repeatable strategy across a portfolio, appropriate when the mandate and operating record support it.',
    use: 'A repeatable portfolio strategy',
    proves: 'Construction and full operations',
    next: 'Institutional scale',
  },
]

export default function Home() {
  return <div className="home-v3">
    <section className="hero-cinema">
      <CityVideoBackground />
      <div className="page-frame hero-cinema__content">
        <p className="eyebrow">Ushering in the new era of fund managers</p>
        <h1>Capital needs<br />new managers.</h1>
        <p className="hero-cinema__lead">Iron Key prepares emerging fund managers to build a verifiable record and grow into an investment firm through the right vehicle, efficiently.</p>
        <div className="hero-actions">
          <Link className="button button-light" to="/apply">Start a conversation <span aria-hidden="true">↗</span></Link>
          <a className="text-link light" href="#method">Explore the method <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>

    <section className="section thesis-section" id="firm">
      <div className="page-frame">
        <div className="thesis-grid">
          <div className="section-kicker"><span>01</span><p>Why Iron Key exists</p></div>
          <div className="thesis-copy">
            <h2>A fund can be formed in weeks.<br />A manager takes years.</h2>
            <div className="thesis-copy__body">
              <p>Structure can be purchased. Judgment, discipline and the trust to manage capital have to be demonstrated. Most aspiring managers are encouraged to begin with the fund, taking on legal structure, administration, fundraising and fixed costs before they have enough operating evidence for another person to examine.</p>
              <p>The problem is not access to fund formation. It is the absence of a credible path to becoming the manager the fund requires. Iron Key exists for that distance: begin at the scale your evidence supports, operate seriously and earn the right to grow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section neofund-thesis" id="neofund">
      <NeofundStory />
    </section>

    <section className="section method-section" id="method">
      <div className="page-frame">
        <div className="section-kicker section-kicker--dark"><span>02</span><p>The Iron Key method</p></div>
        <div className="method-heading">
          <h2>Build the manager<br />before the mythology.</h2>
          <p>The path follows the evidence. Each stage produces the conditions required for the next.</p>
        </div>
        <div className="method-ledger">
          {method.map(item => <article key={item.number} tabIndex={0}>
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            <div><small>Produces</small><strong>{item.output}</strong></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section vehicle-framework" id="vehicles">
      <div className="page-frame">
        <div className="section-kicker"><span>03</span><p>Choose the first vehicle</p></div>
        <div className="framework-heading">
          <h2>Start where your strategy can prove something real.</h2>
          <p>The right vehicle is not the most impressive structure. It is the one that proves the next thing investors need to believe.</p>
        </div>
        <div className="vehicle-gallery">
          {vehicles.map(vehicle => <article className={`vehicle-object vehicle-object--${vehicle.type}`} key={vehicle.title} tabIndex={0}>
            <div className="vehicle-object__visual">
              <span>{vehicle.number} / 04</span>
              <VehicleArtwork type={vehicle.type} />
            </div>
            <div className="vehicle-object__copy">
              <p className="mini-label">First vehicle</p>
              <h3>{vehicle.title}</h3>
              <p>{vehicle.summary}</p>
            </div>
            <dl>
              <div><dt>Best used for</dt><dd>{vehicle.use}</dd></div>
              <div><dt>What it proves</dt><dd>{vehicle.proves}</dd></div>
              <div><dt>Builds toward</dt><dd>{vehicle.next}</dd></div>
            </dl>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section record-section-v3" id="record">
      <div className="page-frame">
        <div className="section-kicker section-kicker--dark"><span>04</span><p>Operate and prove</p></div>
        <div className="record-heading-v3">
          <h2>A return is a number.<br />A record shows the manager.</h2>
          <p>A serious record reveals how the mandate was interpreted, how decisions were made, how capital moved and how investors were kept informed.</p>
        </div>
        <RecordArchive />
      </div>
    </section>

    <section className="section standards-section">
      <div className="page-frame">
        <div className="section-kicker"><span>05</span><p>The Iron Key standard</p></div>
        <div className="credibility-proof">
          <div>
            <p className="eyebrow">Method architecture</p>
            <h2>Institutional training. First-vehicle experience.</h2>
          </div>
          <div className="credibility-proof__body">
            <p>Iron Key’s method is shaped by Joseph Argiro’s experience across Vanguard, UBS, Hewlett Packard Enterprise and ICO Alert, alongside operating his own digital-asset fund through the 2022 market crash.</p>
            <ul className="credibility-names" aria-label="Relevant career experience">
              <li>Vanguard</li>
              <li>UBS</li>
              <li>Hewlett Packard Enterprise</li>
              <li>ICO Alert</li>
            </ul>
          </div>
        </div>
        <div className="principles standards-principles">
          <article><span>01</span><h3>Readiness before structure</h3><p>The vehicle should follow the manager’s actual operating capacity.</p></article>
          <article><span>02</span><h3>Evidence before claims</h3><p>Judgment should leave a record another person can examine.</p></article>
          <article><span>03</span><h3>Process before promotion</h3><p>Operating discipline comes before the fundraising story.</p></article>
          <article><span>04</span><h3>Preparation without promises</h3><p>Preparation can improve readiness. It cannot guarantee an outcome.</p></article>
        </div>
      </div>
    </section>

    <section className="section fish-bridge">
      <FishAsciiBackdrop className="fish-bridge__ascii" />
      <div className="page-frame fish-bridge__grid">
        <div>
          <p className="eyebrow">After manager readiness</p>
          <h2>The first vehicle should build more than returns.</h2>
        </div>
        <div className="fish-bridge__copy">
          <p>Fish Network is building the operating and trust infrastructure for Neofunds. Capital, ownership, decisions and participation develop on connected infrastructure, creating a record that can be examined as it is built.</p>
          <p className="fish-bridge__line">Iron Key prepares the manager. Fish Network supports the organization that may follow.</p>
          <div className="fish-functions">
            <span><b>01</b><strong>Operate</strong><small>Capital, ownership and governance</small></span>
            <span><b>02</b><strong>Prove</strong><small>Decisions, participation and reporting</small></span>
            <span><b>03</b><strong>Progress</strong><small>Infrastructure that develops with the mandate</small></span>
          </div>
          <Link className="text-link light" to="/fish-network">Explore Fish Network <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>

    <section className="section audience-section">
      <div className="page-frame">
        <div className="section-kicker"><span>06</span><p>Who Iron Key is for</p></div>
        <div className="audience-heading">
          <h2>Built for professionals with an investment point of view worth proving.</h2>
          <p>Iron Key is for experienced professionals with a credible area of expertise, a serious investment thesis and the ambition to manage capital with institutional discipline.</p>
        </div>
        <div className="fit-grid audience-fit">
          <div>
            <p className="eyebrow">Designed for people who</p>
            <ul>
              <li>Bring relevant professional or investment experience</li>
              <li>Have a defensible investment point of view</li>
              <li>Will begin at the scale their evidence supports</li>
              <li>Want to document how they decide, operate and communicate</li>
              <li>Intend to grow from a first vehicle into an investment firm</li>
            </ul>
          </div>
          <div className="muted">
            <p className="eyebrow">Not designed for people seeking</p>
            <ul>
              <li>A shortcut into investment management</li>
              <li>Guaranteed investor introductions</li>
              <li>Capital raised on their behalf</li>
              <li>Fund formation without managerial preparation</li>
              <li>Guaranteed launches, commitments or financial results</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="section incubator-status" id="programme">
      <div className="page-frame incubator-status__grid">
        <div>
          <p className="eyebrow">Incubator Program</p>
          <h2>Build the manager before the fund.</h2>
        </div>
        <div>
          <p>A selective program for experienced professionals who want to turn a serious investment thesis into a credible first vehicle and a verifiable operating record.</p>
          <Link className="button button-dark" to="/apply">Start a conversation <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="page-frame programme-notes">
        <article><span>Designed to develop</span><p>A focused mandate, the right first vehicle and verifiable operating evidence that can support a larger investment firm.</p></article>
        <article><span>Defined boundaries</span><p>Iron Key does not raise capital, introduce investors, provide investment advice or replace qualified legal, tax and compliance professionals.</p></article>
      </div>
    </section>
  </div>
}
