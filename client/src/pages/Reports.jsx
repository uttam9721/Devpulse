import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader, Panel, EmptyState } from '../components/layout/Panel';
import { Button, Select } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function Reports() {
  const { state, updateUI } = useAppContext();

  return (
    <>
      <PageHeader title="Scheduled Reports" />

      <div className="flex gap-2 mb-6 border-b border-line">
        {['Weekly', 'Monthly'].map(t => (
          <button 
            key={t}
            onClick={() => updateUI('reportTab', t.toLowerCase())}
            className={`px-4 py-2 text-[14px] font-medium border-b-2 transition-colors ${state.ui.reportTab === t.toLowerCase() ? 'border-accent text-accent' : 'border-transparent text-ink-2 hover:text-ink'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Panel>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-[18px] font-semibold flex items-center gap-2"><Icon name="report" /> Engineering Digest</h3>
                <p className="text-ink-2 text-[14px] mt-1">Generated every Monday at 9:00 AM.</p>
              </div>
              <Button size="sm" variant="ghost" icon="send">Send now</Button>
            </div>
            
            <div className="bg-surface-2 p-6 rounded-custom border border-line">
              <h4 className="font-bold text-[16px] mb-4">This Week in Engineering</h4>
              <p className="text-[14px] leading-relaxed mb-4">
                The team merged <b>24 pull requests</b> and closed <b>18 issues</b>. We saw a slight decrease in PR size, averaging <b>120 lines</b>, which contributed to a faster merge time of <b>14.2 hours</b> (down 12% from last week).
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-surface border border-line rounded-[8px]">
                  <div className="text-[12px] text-ink-3 uppercase tracking-wider font-medium">Merge Time</div>
                  <div className="text-[20px] font-bold num text-good">14.2h</div>
                </div>
                <div className="p-3 bg-surface border border-line rounded-[8px]">
                  <div className="text-[12px] text-ink-3 uppercase tracking-wider font-medium">Reviews</div>
                  <div className="text-[20px] font-bold num">45</div>
                </div>
              </div>
              <ul className="list-disc pl-5 text-[14px] space-y-1.5">
                <li><b>ecommerce-api</b> saw the most activity (42 commits).</li>
                <li><b>Uttam Kumar</b> had the longest streak (14 days).</li>
                <li>Highest priority resolved: <i>Cart total mismatch with discount codes</i>.</li>
              </ul>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Export">
            <p className="text-[13px] text-ink-2 mb-4">Download your data for external analysis or compliance.</p>
            <Select 
              className="w-full mb-3"
              options={[
                { value: 'csv', label: 'CSV (Raw Data)' },
                { value: 'json', label: 'JSON (Full Dump)' },
                { value: 'pdf', label: 'PDF (Summary Report)' }
              ]} 
            />
            <Button className="w-full" icon="down">Download</Button>
          </Panel>
          
          <Panel title="Recipients">
            <ul className="text-[13px] space-y-3">
              <li className="flex items-center gap-3">
                <Icon name="mail" className="text-ink-3" />
                <span className="flex-1">uttam@devpulse.dev</span>
                <span className="text-good font-medium">Active</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="text-ink-3" />
                <span className="flex-1">eng-leadership@...</span>
                <span className="text-good font-medium">Active</span>
              </li>
            </ul>
            <Button size="sm" variant="ghost" className="w-full mt-4" icon="plus">Add recipient</Button>
          </Panel>
        </div>
      </div>
    </>
  );
}
