import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader, Panel } from '../components/layout/Panel';
import { Button, Badge } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function Billing() {
  const { state } = useAppContext();

  return (
    <>
      <PageHeader title="Billing & Plans" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-5xl">
        <Panel className="flex flex-col border-line" flat={state.plan !== 'free'}>
          <div className="mb-4">
            <h3 className="text-[20px] font-bold">Free</h3>
            <div className="text-[28px] font-extrabold mt-2">$0<span className="text-[14px] text-ink-3 font-normal">/mo</span></div>
          </div>
          <ul className="space-y-3 mb-6 text-[14px] flex-1">
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> Up to 3 tracked repos</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> 30-day data retention</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> Basic dashboard</li>
          </ul>
          <Button variant={state.plan === 'free' ? 'dark' : 'default'} disabled={state.plan === 'free'} className="w-full">
            {state.plan === 'free' ? 'Current Plan' : 'Downgrade'}
          </Button>
        </Panel>

        <Panel className={`flex flex-col ${state.plan === 'team' ? 'border-accent shadow-[0_0_0_1px_var(--color-accent)]' : 'border-line'}`}>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-[20px] font-bold">Team</h3>
              <div className="text-[28px] font-extrabold mt-2">$49<span className="text-[14px] text-ink-3 font-normal">/mo</span></div>
            </div>
            {state.plan === 'team' && <Badge variant="pro">Active</Badge>}
          </div>
          <ul className="space-y-3 mb-6 text-[14px] flex-1">
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> Unlimited tracked repos</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> 90-day data retention</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> Slack & Discord alerts</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> Ask DevPulse AI</li>
          </ul>
          <Button variant={state.plan === 'team' ? 'dark' : 'primary'} disabled={state.plan === 'team'} className="w-full">
            {state.plan === 'team' ? 'Current Plan' : 'Upgrade to Team'}
          </Button>
        </Panel>

        <Panel className="flex flex-col border-line">
          <div className="mb-4">
            <h3 className="text-[20px] font-bold">Enterprise</h3>
            <div className="text-[28px] font-extrabold mt-2">Custom</div>
          </div>
          <ul className="space-y-3 mb-6 text-[14px] flex-1">
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> 1-year data retention</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> SSO / SAML</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> Priority support</li>
            <li className="flex items-center gap-2"><Icon name="check" size="tiny" className="text-good" /> Custom SLA</li>
          </ul>
          <Button className="w-full">Contact Sales</Button>
        </Panel>
      </div>

      <div className="max-w-5xl">
        <Panel title="Usage this month">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[14px] mb-1">
                <span>API Syncs</span>
                <span className="text-ink-2">4,203 / 10,000</span>
              </div>
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[14px] mb-1">
                <span>AI Queries</span>
                <span className="text-ink-2">124 / 500</span>
              </div>
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full bg-c-review rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
