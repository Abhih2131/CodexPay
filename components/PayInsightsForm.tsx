'use client';

import { useMemo, useState } from 'react';
import { deriveDefaultHra } from '@/lib/calculations/simulation';
import { inputSchema } from '@/lib/validation';
import { SimulationInput } from '@/types/simulation';

const states = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'];
const cities = ['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Pune', 'Bengaluru'];

export function PayInsightsForm({ onSubmit }: { onSubmit: (input: SimulationInput) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<SimulationInput>({
    annualFixedCtc: 6000000,
    annualVariablePay: 0,
    dateOfJoining: '2026-04-01',
    state: 'Maharashtra',
    city: 'Mumbai',
    basicCalculationMethod: 'fixed_ctc',
    basicPercentage: 50,
    hraPercentage: 50,
    pfApplicability: 'yes',
    pfCalculationBasis: 'actual_basic',
    variablePayPayoutTiming: 'annual',
    taxRegime: 'new',
    professionalTaxApplicability: 'auto',
    roundingMethod: '2_decimals_internal'
  });

  const helper = useMemo(() => deriveDefaultHra(form.city), [form.city]);

  const update = <K extends keyof SimulationInput>(k: K, v: SimulationInput[K]) => setForm((s) => ({ ...s, [k]: v }));

  const submit = () => {
    const parsed = inputSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[i.path[0] as string] = i.message));
      setErrors(next);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  };

  const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900';

  return (
    <section className="rounded-2xl bg-panel/70 p-6">
      <h2 className="mb-5 text-2xl font-semibold">Compensation Input Setup</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Annual Fixed CTC', 'annualFixedCtc'],
          ['Annual Variable Pay', 'annualVariablePay'],
          ['Basic Percentage', 'basicPercentage'],
          ['HRA Percentage', 'hraPercentage']
        ].map(([label, key]) => (
          <label key={key} className="block text-sm">
            {label}
            <input className={inputClass} type="number" value={form[key as keyof SimulationInput] as number} onChange={(e) => update(key as keyof SimulationInput, Number(e.target.value) as never)} />
            {errors[key] && <span className="text-xs text-rose-300">{errors[key]}</span>}
          </label>
        ))}

        <label className="block text-sm">Date of Joining<input className={inputClass} type="date" value={form.dateOfJoining} onChange={(e) => update('dateOfJoining', e.target.value)} /></label>
        <label className="block text-sm">State<select className={inputClass} value={form.state} onChange={(e) => update('state', e.target.value)}>{states.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="block text-sm">City<select className={inputClass} value={form.city} onChange={(e) => {update('city', e.target.value); update('hraPercentage', deriveDefaultHra(e.target.value));}}>{cities.map((s) => <option key={s}>{s}</option>)}</select><span className="text-xs text-slate-300">Default HRA for city: {helper}%</span></label>
        <label className="block text-sm">Basic Calculation Method<select className={inputClass} value={form.basicCalculationMethod} onChange={(e) => update('basicCalculationMethod', e.target.value as SimulationInput['basicCalculationMethod'])}><option value="fixed_ctc">Basic = % of Fixed CTC</option><option value="gross">Basic = % of Gross</option></select></label>
        <label className="block text-sm">PF Applicability<select className={inputClass} value={form.pfApplicability} onChange={(e) => update('pfApplicability', e.target.value as SimulationInput['pfApplicability'])}><option value="yes">Yes</option><option value="no">No</option></select></label>
        <label className="block text-sm">PF Calculation Basis<select className={inputClass} value={form.pfCalculationBasis} onChange={(e) => update('pfCalculationBasis', e.target.value as SimulationInput['pfCalculationBasis'])}><option value="actual_basic">PF on Actual Basic</option><option value="statutory_ceiling">PF on Statutory Ceiling</option></select>{errors.pfCalculationBasis && <span className="text-xs text-rose-300">{errors.pfCalculationBasis}</span>}</label>
        <label className="block text-sm">Variable Pay Payout Timing<select className={inputClass} value={form.variablePayPayoutTiming} onChange={(e) => update('variablePayPayoutTiming', e.target.value as SimulationInput['variablePayPayoutTiming'])}><option value="annual">Annual</option><option value="quarterly">Quarterly</option><option value="monthly">Monthly</option><option value="separate">Show separately</option></select></label>
        <label className="block text-sm">Tax Regime<select disabled className={inputClass} value={form.taxRegime}><option value="new">New Regime</option></select></label>
        <label className="block text-sm">Professional Tax Applicability<select className={inputClass} value={form.professionalTaxApplicability} onChange={(e) => update('professionalTaxApplicability', e.target.value as SimulationInput['professionalTaxApplicability'])}><option value="auto">Auto as per state rules</option><option value="yes">Yes</option><option value="no">No</option></select></label>
        <label className="block text-sm">Rounding Method<select className={inputClass} value={form.roundingMethod} onChange={(e) => update('roundingMethod', e.target.value as SimulationInput['roundingMethod'])}><option value="2_decimals_internal">Keep 2 decimals internally, show rounded output</option></select></label>
      </div>
      <div className="mt-6 flex gap-3">
        <button onClick={submit} className="rounded-lg bg-accent px-4 py-2 font-semibold text-slate-950">Run Simulation</button>
        <button onClick={() => window.location.reload()} className="rounded-lg border border-slate-400 px-4 py-2">Reset</button>
      </div>
    </section>
  );
}
