import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { sliceState, techScores, langShare } from '../utils/helpers';
import { REPOS, LANG_COL } from '../utils/mockData';
import { PageHeader, Filters, Panel } from '../components/layout/Panel';
import { HorizontalBars, DonutChart } from '../components/charts/Charts';

export default function Technology() {
  const { state } = useAppContext();
  const sl = sliceState(null, state);
  
  const tech = useMemo(() => techScores(sl.commits, REPOS), [sl.commits]);
  const lang = useMemo(() => langShare(sl.commits, REPOS), [sl.commits]);

  const langItems = lang.map(l => ({ l: l.l, v: l.p, c: LANG_COL[l.l] || LANG_COL.Other }));
  const techItems = tech.map(t => ({ l: t.t, v: t.n, c: 'var(--color-c-commit)', t: t.n + ' commits' }));

  return (
    <>
      <PageHeader title="Technology Stack" right={<Filters repo={false} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title="Language distribution" sub="Based on active repositories in the period.">
          <DonutChart items={langItems} center={['', 'Languages']} />
        </Panel>

        <Panel title="Technologies used" sub="Derived from repository tags & activity.">
          <HorizontalBars items={techItems} />
        </Panel>
      </div>
    </>
  );
}
