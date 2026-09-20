import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader, Panel } from '../components/layout/Panel';
import { Toggle, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function Integrations() {
  const { state, updateState } = useAppContext();
  
  const toggleInteg = (k) => {
    updateState('integ', { ...state.integ, [k]: !state.integ[k] });
  };

  return (
    <>
      <PageHeader title="Integrations" sub="Connect DevPulse with your workspace tools." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <Panel className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#4A154B] text-white grid place-items-center font-bold text-xl">S</div>
              <div>
                <h3 className="font-semibold text-[16px]">Slack</h3>
                <div className="text-ink-2 text-[13px]">Send alerts to channels.</div>
              </div>
            </div>
            <Toggle checked={state.integ.slack} onChange={() => toggleInteg('slack')} />
          </div>
          <p className="text-[14px] text-ink-2 leading-relaxed flex-1 mb-4">Get daily summaries, PR review reminders, and deployment alerts directly in your team's Slack channels.</p>
          <div className="pt-4 border-t border-line mt-auto">
            {state.integ.slack ? (
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-good font-medium flex items-center gap-1.5"><Icon name="check" size="tiny" /> Connected</span>
                <Button size="sm" variant="ghost">Configure</Button>
              </div>
            ) : (
              <Button className="w-full">Connect to Slack</Button>
            )}
          </div>
        </Panel>

        <Panel className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#5865F2] text-white grid place-items-center font-bold text-xl">D</div>
              <div>
                <h3 className="font-semibold text-[16px]">Discord</h3>
                <div className="text-ink-2 text-[13px]">Webhook notifications.</div>
              </div>
            </div>
            <Toggle checked={state.integ.discord} onChange={() => toggleInteg('discord')} />
          </div>
          <p className="text-[14px] text-ink-2 leading-relaxed flex-1 mb-4">Route critical issue alerts and weekly engineering digests to your Discord server via Webhooks.</p>
          <div className="pt-4 border-t border-line mt-auto">
            {state.integ.discord ? (
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-good font-medium flex items-center gap-1.5"><Icon name="check" size="tiny" /> Connected</span>
                <Button size="sm" variant="ghost">Configure</Button>
              </div>
            ) : (
              <Button className="w-full">Connect to Discord</Button>
            )}
          </div>
        </Panel>

        <Panel className="flex flex-col h-full md:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-surface-2 border border-line text-ink grid place-items-center"><Icon name="mail" /></div>
              <div>
                <h3 className="font-semibold text-[16px]">Email Reports</h3>
                <div className="text-ink-2 text-[13px]">Scheduled PDF summaries.</div>
              </div>
            </div>
            <Toggle checked={state.integ.email} onChange={() => toggleInteg('email')} />
          </div>
          <div className="pt-4 border-t border-line mt-auto">
             <div className="text-[13px] text-ink-2">Managed in the <a href="/reports" className="text-accent hover:underline">Reports</a> tab.</div>
          </div>
        </Panel>
      </div>
    </>
  );
}
