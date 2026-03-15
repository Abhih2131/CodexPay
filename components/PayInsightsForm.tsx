'use client';

import { useMemo, useState } from 'react';
import { deriveDefaultHra } from '@/lib/calculations/simulation';
import { inputSchema } from '@/lib/validation';
import { SimulationInput } from '@/types/simulation';

const states = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'];
const cities = ['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Pune', 'Bengaluru'];

type DraftInput = Omit<SimulationInput, 'pfApplicability'> & { pfApplicability: SimulationInput['pfApplicability'] | '' };

const cardClass = 'rounded-3xl border border-slate-500/25 bg-gradient-to-b from-slate-900/60 to-slate-900/35 p-6 shadow-2xl backdrop-blur-md';
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-slate-300';
const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200';

export function PayInsightsForm({ onSubmit }: { onSubmit: (input: SimulationInput) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<DraftInput>({
    annualFixedCtc: 6000000,
    annualVariablePay: 0,
    dateOfJoining: '2026-04-01',
    state: 'Maharashtra',
    city: 'Mumbai',
    basicCalculationMethod: 'fixed_ctc',
    basicPercentage: 50,
    hraPercentage: 50,
    pfApplicability: '',
    pfCalculationBasis: 'actual_basic',
    variablePayPayoutTiming: 'annual',
    taxRegime: 'new',
    professionalTaxApplicability: 'auto',
    roundingMethod: '2_decimals_internal'
  });

  const helper = useMemo(() => deriveDefaultHra(form.city), [form.city]);
  const update = <K extends keyof DraftInput>(k: K, v: DraftInput[K]) => setForm((s) => ({ ...s, [k]: v }));

  const submit = () => {
    const normalized = {
      ...form,
      pfApplicability: (form.pfApplicability || 'no') as SimulationInput['pfApplicability']
    };

    const parsed = inputSchema.safeParse(normalized);
    if (!parsed.success || !form.pfApplicability) {
      const next: Record<string, string> = {};
      if (!form.pfApplicability) next.pfApplicability = 'Please choose PF applicability';
      parsed.error?.issues.forEach((i) => (next[i.path[0] as string] = i.message));
      setErrors(next);
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <section className={`${cardClass} space-y-5`}>
      <div>
        <h2 className="text-2xl font-semibold">Compensation Input Setup</h2>
        <p className="mt-1 text-sm text-slate-300">Configure compensation assumptions to generate an auditable CTC-to-net simulation.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block"><span className={labelClass}>Annual Fixed CTC</span><input className={inputClass} type="number" value={form.annualFixedCtc} onChange={(e) => update('annualFixedCtc', Number(e.target.value))} />{errors.annualFixedCtc && <p className="mt-1 text-xs text-rose-300">{errors.annualFixedCtc}</p>}</label>
        <label className="block"><span className={labelClass}>Annual Variable Pay</span><input className={inputClass} type="number" value={form.annualVariablePay} onChange={(e) => update('annualVariablePay', Number(e.target.value))} /></label>
        <label className="block"><span className={labelClass}>Date of Joining</span><input className={inputClass} type="date" value={form.dateOfJoining} onChange={(e) => update('dateOfJoining', e.target.value)} /></label>
        <label className="block"><span className={labelClass}>State</span><select className={inputClass} value={form.state} onChange={(e) => update('state', e.target.value)}>{states.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="block"><span className={labelClass}>City</span><select className={inputClass} value={form.city} onChange={(e) => { update('city', e.target.value); update('hraPercentage', deriveDefaultHra(e.target.value)); }}>{cities.map((s) => <option key={s}>{s}</option>)}</select><p className="mt-1 text-xs text-slate-300">Default HRA for city: {helper}% (editable below)</p></label>
        <label className="block"><span className={labelClass}>Basic Calculation Method</span><select className={inputClass} value={form.basicCalculationMethod} onChange={(e) => update('basicCalculationMethod', e.target.value as SimulationInput['basicCalculationMethod'])}><option value="fixed_ctc">Basic = % of Fixed CTC</option><option value="gross">Basic = % of Gross</option></select></label>
        <label className="block"><span className={labelClass}>Basic Percentage</span><input className={inputClass} type="number" value={form.basicPercentage} onChange={(e) => update('basicPercentage', Number(e.target.value))} />{errors.basicPercentage && <p className="mt-1 text-xs text-rose-300">{errors.basicPercentage}</p>}</label>
        <label className="block"><span className={labelClass}>HRA Percentage</span><input className={inputClass} type="number" value={form.hraPercentage} onChange={(e) => update('hraPercentage', Number(e.target.value))} />{errors.hraPercentage && <p className="mt-1 text-xs text-rose-300">{errors.hraPercentage}</p>}</label>
        <label className="block"><span className={labelClass}>PF Applicability</span><select className={inputClass} value={form.pfApplicability} onChange={(e) => update('pfApplicability', e.target.value as DraftInput['pfApplicability'])}><option value="">Select</option><option value="yes">Yes</option><option value="no">No</option></select>{errors.pfApplicability && <p className="mt-1 text-xs text-rose-300">{errors.pfApplicability}</p>}</label>
        <label className="block"><span className={labelClass}>PF Calculation Basis</span><select className={inputClass} value={form.pfCalculationBasis} onChange={(e) => update('pfCalculationBasis', e.target.value as SimulationInput['pfCalculationBasis'])} disabled={form.pfApplicability === 'no' || form.pfApplicability === ''}><option value="actual_basic">PF on Actual Basic</option><option value="statutory_ceiling">PF on Statutory Ceiling</option></select></label>
        <label className="block"><span className={labelClass}>Variable Pay Payout Timing</span><select className={inputClass} value={form.variablePayPayoutTiming} onChange={(e) => update('variablePayPayoutTiming', e.target.value as SimulationInput['variablePayPayoutTiming'])}><option value="annual">Annual</option><option value="quarterly">Quarterly</option><option value="monthly">Monthly</option><option value="separate">Show separately</option></select></label>
        <label className="block"><span className={labelClass}>Tax Regime</span><select disabled className={inputClass} value={form.taxRegime}><option value="new">New Regime</option></select></label>
        <label className="block"><span className={labelClass}>Professional Tax Applicability</span><select className={inputClass} value={form.professionalTaxApplicability} onChange={(e) => update('professionalTaxApplicability', e.target.value as SimulationInput['professionalTaxApplicability'])}><option value="auto">Auto as per state rules</option><option value="yes">Yes</option><option value="no">No</option></select></label>
        <label className="block"><span className={labelClass}>Rounding Method</span><select className={inputClass} value={form.roundingMethod} onChange={(e) => update('roundingMethod', e.target.value as SimulationInput['roundingMethod'])}><option value="2_decimals_internal">Keep 2 decimals internally, show rounded output</option></select></label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-700/40 pt-4">
        <button onClick={submit} className="rounded-xl bg-gradient-to-r from-sky-300 to-cyan-200 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow">Run Simulation</button>
        <button onClick={() => window.location.reload()} className="rounded-xl border border-slate-300/70 bg-slate-950/25 px-5 py-2.5 text-sm">Reset</button>
      </div>
    </section>
  );
}
