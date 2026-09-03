import { about } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import { IconLock } from '../common/Icons.jsx'

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24">
      <div className="container-page">
        <SectionHeading index={1} kicker={about.kicker} title={about.heading} />

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="space-y-5">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-ink-soft sm:text-lg">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel p-5">
              <div className="mb-4 flex items-center gap-2">
                <IconLock size={16} className="text-accent" />
                <span className="mono-label">access.profile</span>
              </div>
              <dl className="grid grid-cols-1 gap-3">
                {about.stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between rounded-md border border-white/[0.08] bg-base-700/40 px-4 py-3"
                  >
                    <dt className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                      {s.label}
                    </dt>
                    <dd className="font-mono text-sm text-accent">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
