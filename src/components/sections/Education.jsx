import { education } from '../../data/content.js'
import SectionHeading from '../common/SectionHeading.jsx'
import Reveal from '../common/Reveal.jsx'
import { IconCap, IconSpark } from '../common/Icons.jsx'

export default function Education() {
  return (
    <section id="education" className="relative scroll-mt-20 py-24">
      <div className="container-page">
        <SectionHeading index={7} kicker="Academic Record" title="Education" />

        <Reveal>
          <div className="panel overflow-hidden shadow-panel">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                <IconCap size={28} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold text-ink">{education.degree}</h3>
                  <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                    {education.date}
                  </span>
                </div>
                <p className="mt-1 font-mono text-sm text-accent">{education.school}</p>

                <div className="mt-5 rounded-lg border border-accent/25 bg-accent/[0.06] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <IconSpark size={15} className="text-accent" />
                    <span className="mono-label text-accent">thesis</span>
                  </div>
                  <h4 className="font-mono text-sm text-ink">&ldquo;{education.thesisTitle}&rdquo;</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {education.thesisDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
