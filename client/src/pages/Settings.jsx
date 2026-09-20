import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader, Panel } from '../components/layout/Panel';
import { Input, Button, Toggle } from '../components/common/UI';

export default function Settings() {
  const { state, updateState } = useAppContext();

  return (
    <>
      <PageHeader title="Settings" />

      <div className="max-w-3xl space-y-6">
        <Panel title="Profile Information">
          <div className="grid gap-4 max-w-md">
            <Input label="Full Name" defaultValue={state.profile.name} />
            <Input label="Email Address" defaultValue={state.profile.email} />
            <Input label="Job Role" defaultValue={state.profile.role} />
            <div className="mt-2">
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        </Panel>

        <Panel title="Preferences">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[14px]">Theme Preference</div>
                <div className="text-[13px] text-ink-2">Select your UI color mode.</div>
              </div>
              <select 
                className="h-[34px] rounded-[8px] border border-line-2 bg-surface text-[13px] px-2"
                value={state.theme}
                onChange={e => updateState('theme', e.target.value)}
              >
                <option value="system">System Default</option>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-line">
              <div>
                <div className="font-medium text-[14px]">Live Updates</div>
                <div className="text-[13px] text-ink-2">Automatically poll for new data.</div>
              </div>
              <Toggle checked={state.live} onChange={() => updateState('live', !state.live)} />
            </div>
          </div>
        </Panel>

        <Panel title="Notification Rules">
           <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[14px]">PR Reviews</div>
                <div className="text-[13px] text-ink-2">When someone requests your review on a PR.</div>
              </div>
              <Toggle checked={state.notif.review.slack} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-line">
              <div>
                <div className="font-medium text-[14px]">Trend Alerts</div>
                <div className="text-[13px] text-ink-2">When engineering velocity drops below baseline.</div>
              </div>
              <Toggle checked={state.notif.trend.email} onChange={() => {}} />
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
