import { useEffect, useMemo, useRef, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

function InputRow({ label, children }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-center py-2">
      <div className="col-span-12 md:col-span-4 text-sm font-medium text-slate-700">{label}</div>
      <div className="col-span-12 md:col-span-8">{children}</div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 mr-2 mb-2">
      {children}
    </span>
  );
}

function RoomListEditor({ value, onChange }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState(12);

  const add = () => {
    if (!name || area <= 0) return;
    onChange([...(value || []), { name, min_area: Number(area) }]);
    setName("");
    setArea(12);
  };

  const remove = (idx) => {
    const arr = [...(value || [])];
    arr.splice(idx, 1);
    onChange(arr);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(value || []).map((r, i) => (
          <div key={i} className="flex items-center bg-slate-50 border border-slate-200 rounded px-2 py-1">
            <span className="text-sm text-slate-700 mr-2">{r.name} · {r.min_area} m²</span>
            <button onClick={() => remove(i)} className="text-xs text-rose-600 hover:underline">remove</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input placeholder="Room name" value={name} onChange={e=>setName(e.target.value)} className="border rounded px-2 py-1 text-sm w-40" />
        <input type="number" min="1" step="0.5" placeholder="Min area (m²)" value={area} onChange={e=>setArea(e.target.value)} className="border rounded px-2 py-1 text-sm w-40" />
        <button onClick={add} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Add</button>
      </div>
    </div>
  );
}

function ProjectForm({ onCreated }) {
  const [title, setTitle] = useState("My New Home");
  const [projectType, setProjectType] = useState("Residential (Single-family)");
  const [siteWidth, setSiteWidth] = useState(12);
  const [siteHeight, setSiteHeight] = useState(18);
  const [rooms, setRooms] = useState([
    { name: "Living", min_area: 20 },
    { name: "Kitchen", min_area: 12 },
    { name: "Bedroom", min_area: 12 },
    { name: "Toilet", min_area: 4 },
  ]);
  const [adjacency, setAdjacency] = useState("");
  const [orientation, setOrientation] = useState("");
  const [culture, setCulture] = useState("General Vastu");
  const [code, setCode] = useState("BBMP");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    try {
      setSubmitting(true);
      setError("");
      const body = {
        title,
        project_type: projectType,
        site: { width: Number(siteWidth), height: Number(siteHeight) },
        required_spaces: rooms,
        adjacency_notes: adjacency || null,
        orientation_notes: orientation || null,
        cultural_tuning: culture,
        municipal_code: code,
      };
      const res = await fetch(`${API}/api/projects`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const data = await res.json();
      onCreated(data.project_id);
    } catch (e) {
      setError(e.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Start New Project</h2>
      <InputRow label="Project Title">
        <input value={title} onChange={e=>setTitle(e.target.value)} className="border rounded px-3 py-2 w-full" />
      </InputRow>
      <InputRow label="Project Type">
        <select value={projectType} onChange={e=>setProjectType(e.target.value)} className="border rounded px-3 py-2 w-full">
          {[
            "Residential (Single-family)",
            "Residential (Multi-family)",
            "Commercial (Office)",
            "Commercial (Retail)",
            "Mixed-use",
            "Other",
          ].map(opt=> <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </InputRow>
      <InputRow label="Site Dimensions (m)">
        <div className="flex gap-3">
          <input type="number" min="1" step="0.5" value={siteWidth} onChange={e=>setSiteWidth(e.target.value)} className="border rounded px-3 py-2 w-32" />
          <input type="number" min="1" step="0.5" value={siteHeight} onChange={e=>setSiteHeight(e.target.value)} className="border rounded px-3 py-2 w-32" />
        </div>
      </InputRow>
      <InputRow label="Required Spaces">
        <RoomListEditor value={rooms} onChange={setRooms} />
      </InputRow>
      <InputRow label="Adjacency & Orientation Notes">
        <textarea value={adjacency} onChange={e=>setAdjacency(e.target.value)} placeholder="Kitchen near Dining; Bedroom away from Living..." className="border rounded px-3 py-2 w-full" />
        <textarea value={orientation} onChange={e=>setOrientation(e.target.value)} placeholder="Living to face North..." className="border rounded px-3 py-2 w-full mt-2" />
      </InputRow>
      <InputRow label="Cultural/Religious Parameters">
        <select value={culture} onChange={e=>setCulture(e.target.value)} className="border rounded px-3 py-2 w-full">
          {["General Vastu","North Indian Vaastu","South Indian Vaastu","Islamic Beliefs","Christian Beliefs","None"].map(opt=> <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </InputRow>
      <InputRow label="Municipal Code">
        <select value={code} onChange={e=>setCode(e.target.value)} className="border rounded px-3 py-2 w-full">
          {["BBMP","BMC","GDC/MCD","National","None"].map(opt=> <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </InputRow>
      {error && <div className="text-sm text-rose-600 mb-2">{error}</div>}
      <div className="flex justify-end">
        <button disabled={submitting} onClick={create} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">
          {submitting ? 'Creating…' : 'Generate Plans'}
        </button>
      </div>
    </div>
  );
}

function PlanSVG({ svg }) {
  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      <div className="w-full" style={{minHeight: 360}} dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}

function ComplianceList({ items }) {
  if (!items) return null;
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className={`rounded border px-3 py-2 ${it.passed ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
          <div className="text-sm font-semibold text-slate-800">{it.name}</div>
          <div className="text-xs text-slate-600">{it.message}</div>
        </div>
      ))}
    </div>
  );
}

function EstimateTable({ estimate }) {
  if (!estimate) return null;
  return (
    <div className="bg-white rounded-lg border p-3">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2 pr-4">Item</th>
              <th className="py-2 pr-4">Unit</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Unit Rate</th>
              <th className="py-2 pr-4">Cost</th>
            </tr>
          </thead>
          <tbody>
            {estimate.bom.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="py-1 pr-4">{row.item}</td>
                <td className="py-1 pr-4">{row.unit}</td>
                <td className="py-1 pr-4">{row.quantity}</td>
                <td className="py-1 pr-4">{row.unit_rate ?? '-'}</td>
                <td className="py-1 pr-4">{row.cost ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-slate-700 mt-3">Total (range): ₹{estimate.total_cost_low} - ₹{estimate.total_cost_high}</div>
    </div>
  );
}

function useBackendUrl() {
  // Guard: if no env set, attempt to infer backend by switching port to 8000 on same host.
  return useMemo(() => {
    if (API) return API;
    try {
      const url = new URL(window.location.href);
      // Replace front port (3000) with 8000; if no port, set 8000.
      url.port = '8000';
      return `${url.origin}`;
    } catch {
      return '';
    }
  }, []);
}

function Dashboard({ projectId }) {
  const [plans, setPlans] = useState([]);
  const [active, setActive] = useState(null);
  const [svg, setSvg] = useState("");
  const [compliance, setCompliance] = useState([]);
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const backend = useBackendUrl();
  const svgRef = useRef(null);

  const generate = async () => {
    try {
      setLoading(true);
      setError("");
      await fetch(`${backend}/api/projects/${projectId}/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alternatives: 4 })});
      const res = await fetch(`${backend}/api/projects/${projectId}/plans`);
      if (!res.ok) throw new Error(`Fetch plans failed: ${res.status}`);
      const data = await res.json();
      setPlans(data);
      if (data[0]) select(data[0].plan_id, data);
    } catch (e) {
      setError(e.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const select = async (planId, knownPlans = null) => {
    try {
      setActive(planId);
      const svgRes = await fetch(`${backend}/api/projects/${projectId}/plans/${planId}/svg`);
      const svgData = await svgRes.json();
      setSvg(svgData.svg);

      const compRes = await fetch(`${backend}/api/projects/${projectId}/plans/${planId}/compliance`);
      const compData = await compRes.json();
      setCompliance(compData.items);

      const estRes = await fetch(`${backend}/api/projects/${projectId}/plans/${planId}/estimate`);
      const estData = await estRes.json();
      setEstimate(estData);

      if (!knownPlans) {
        const plansRes = await fetch(`${backend}/api/projects/${projectId}/plans`);
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
    } catch (e) {
      setError(e.message || 'Failed to load plan details');
    }
  };

  const downloadSVG = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${active || 'plan'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    if (!svg) return;
    // Create an image from SVG string
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Try to parse width/height from viewBox if present
      const match = svg.match(/viewBox=\"(\d+(?:\.\d+)?) (\d+(?:\.\d+)?) (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)\"/);
      const w = match ? parseFloat(match[3]) : img.width || 1200;
      const h = match ? parseFloat(match[4]) : img.height || 800;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0,0,w,h);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        const dl = document.createElement('a');
        dl.href = URL.createObjectURL(blob);
        dl.download = `${active || 'plan'}.png`;
        dl.click();
        setTimeout(() => URL.revokeObjectURL(dl.href), 1000);
      }, 'image/png');
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  useEffect(() => { generate(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Floor Plan Output</h3>
          <div className="flex items-center gap-2">
            <button onClick={generate} disabled={loading} className="px-3 py-1.5 rounded border bg-white hover:bg-slate-50 text-sm disabled:opacity-60">{loading ? 'Generating…' : 'Generate Alternatives'}</button>
            <a className="text-sm text-blue-600 hover:underline" href={`${backend}/api/projects/${projectId}/plans/${active}/bom.csv`} target="_blank" rel="noreferrer">Export BOM (CSV)</a>
          </div>
        </div>
        {error && <div className="rounded border border-rose-300 bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>}
        {svg ? <PlanSVG svg={svg} ref={svgRef} /> : (
          <div className="rounded-lg border bg-white p-6 text-slate-500 min-h-[360px] grid place-items-center">
            {loading ? 'Generating plans…' : 'No plan yet.'}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={downloadSVG} disabled={!svg} className="px-3 py-1.5 rounded border bg-white hover:bg-slate-50 text-sm disabled:opacity-60">Download SVG</button>
          <button onClick={downloadPNG} disabled={!svg} className="px-3 py-1.5 rounded border bg-white hover:bg-slate-50 text-sm disabled:opacity-60">Download PNG</button>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-700 mb-2">Alternative Layouts</div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {plans.map((p) => (
              <button key={p.plan_id} onClick={() => select(p.plan_id)} className={`px-3 py-2 rounded border text-sm ${active === p.plan_id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50'}`}>
                {p.plan_id.split('-').pop()} · Score {p.score}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-semibold text-slate-800 mb-2">Compliance</div>
          <ComplianceList items={compliance} />
        </div>
        <EstimateTable estimate={estimate} />
      </div>
    </div>
  );
}

export default function App() {
  const [projectId, setProjectId] = useState(null);
  const backend = useBackendUrl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800">Architectural AI Agent</h1>
            <p className="text-slate-600">Automated floor plans, compliance checks, and material estimates.</p>
          </div>
          <div className="flex gap-2">
            <a className="text-sm text-blue-600 hover:underline" href={`${backend}/test`} target="_blank" rel="noreferrer">Backend Status</a>
          </div>
        </header>

        {!projectId ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProjectForm onCreated={setProjectId} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur rounded-xl border p-6">
                <div className="text-sm font-semibold text-slate-800 mb-2">Quick Access Metrics</div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>Recent Projects: <Tag>Alpha</Tag><Tag>Beta</Tag></div>
                  <div>Avg. Compliance Pass Rate: <span className="font-semibold text-emerald-600">82%</span></div>
                  <div>Last Generated: <span className="font-semibold">—</span></div>
                </div>
                <div className="mt-4">
                  <button onClick={() => setProjectId(null)} className="px-3 py-2 rounded bg-slate-800 text-white text-sm">Load Project</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Dashboard projectId={projectId} />
        )}
      </div>
    </div>
  );
}
