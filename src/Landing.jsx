import { useNavigate } from 'react-router-dom'

function Feature({ title, desc }) {
  return (
    <div className="p-5 rounded-xl border bg-white/70 backdrop-blur">
      <div className="text-base font-semibold text-slate-800">{title}</div>
      <div className="text-sm text-slate-600 mt-1">{desc}</div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50">
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-items-center font-bold">AA</div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900">Architectural AI Agent</div>
            <div className="text-xs text-slate-600">Floor plans • Compliance • Estimates</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a className="hover:text-slate-900" href="#features">Features</a>
          <a className="hover:text-slate-900" href="#how">How it works</a>
          <a className="hover:text-slate-900" href="#faq">FAQ</a>
          <button onClick={() => navigate('/app')} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Open Tool</button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Generate buildable floor plans with compliance and costs in minutes
            </h1>
            <p className="mt-4 text-slate-700 text-base md:text-lg">
              Describe your site and spaces. Get alternative layouts, municipal code checks, cultural guidance, and a material estimate instantly.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/app')} className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow">
                Start Designing
              </button>
              <a href="#features" className="px-5 py-3 rounded-xl bg-white/70 border font-semibold text-slate-800">Explore Features</a>
            </div>
            <div className="mt-4 text-xs text-slate-600">No account required. Runs in the browser.</div>
          </div>
          <div>
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 grid place-items-center text-slate-600">
                <div className="text-center p-6">
                  <div className="text-6xl mb-2">📐</div>
                  <div className="font-semibold">Live Plan Preview</div>
                  <div className="text-sm">SVG-based, zoomable, export-ready</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="h-16 rounded-lg bg-white border grid place-items-center text-sm text-slate-600">BBMP ✓</div>
                <div className="h-16 rounded-lg bg-white border grid place-items-center text-sm text-slate-600">Vastu ✓</div>
                <div className="h-16 rounded-lg bg-white border grid place-items-center text-sm text-slate-600">BOM ✓</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Feature title="Automated layouts" desc="Deterministic packing with alternative schemes and scoring." />
            <Feature title="Regulatory checks" desc="Setbacks, FAR, min room size across BBMP, BMC, GDC/MCD, National." />
            <Feature title="Cultural guidance" desc="General Vastu, regional Vaastu, Islamic and Christian considerations." />
            <Feature title="Material estimate" desc="Blocks, tiles, finishes, doors/windows with cost ranges." />
            <Feature title="Exports" desc="SVG floor plan, CSV bill of materials, JSON project report." />
            <Feature title="Database-ready" desc="Projects persist in a database for easy retrieval and iteration." />
          </div>
        </section>

        <section id="how" className="py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How it works</h2>
          <ol className="list-decimal list-inside text-slate-700 space-y-2">
            <li>Enter site and required spaces</li>
            <li>Generate alternative plans</li>
            <li>Review compliance and cultural checks</li>
            <li>Export materials and share a report</li>
          </ol>
        </section>

        <section id="faq" className="py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQ</h2>
          <div className="space-y-3 text-slate-700">
            <div>
              <div className="font-semibold">Is this accurate for permitting?</div>
              <div className="text-sm">It highlights common constraints and is a great starting point. Always have a local professional review final drawings.</div>
            </div>
            <div>
              <div className="font-semibold">Can I adjust room sizes?</div>
              <div className="text-sm">Yes—modify required spaces on the tool; UI tweaks are coming for live drag/resize.</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t mt-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <div>© {new Date().getFullYear()} Architectural AI Agent</div>
          <div className="flex items-center gap-4">
            <a href="/test" className="hover:text-slate-900">System Check</a>
            <button onClick={() => navigate('/app')} className="px-3 py-1.5 rounded bg-slate-900 text-white">Open Tool</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
