import React, { useState } from 'react';
import { PageHeader, Panel } from '../components/layout/Panel';
import { Input, Button, Avatar } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { ME } from '../utils/mockData';

export default function AskAI() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi there! I can help you analyze your engineering data. Ask me things like "Who merged the most PRs this week?" or "Summarize activity in ecommerce-api."' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const q = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    setTimeout(() => {
      let reply = "I analyzed the data. The team has been highly focused on performance improvements recently. Merge times are slightly elevated on Friday afternoons.";
      if (q.toLowerCase().includes('ecommerce-api')) reply = "ecommerce-api has seen 42 commits this week. The main themes were Order tracking and API optimization.";
      if (q.toLowerCase().includes('pr') || q.toLowerCase().includes('merge')) reply = "Merge rates are healthy at 72%. The average time to merge is currently 14.2 hours.";
      
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      <PageHeader title="Ask DevPulse" sub="Query your engineering data using natural language." />

      <Panel className="flex flex-col h-[600px] max-h-[70vh] p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-surface-2/30">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="shrink-0 mt-1">
                {m.role === 'user' ? <Avatar id={ME} size="md" /> : (
                  <div className="w-[36px] h-[36px] rounded-full bg-accent text-on-accent grid place-items-center"><Icon name="spark" size="tiny" /></div>
                )}
              </div>
              <div className={`p-3.5 text-[14.5px] leading-relaxed rounded-[12px] shadow-sm ${m.role === 'user' ? 'bg-ink text-bg rounded-tr-none' : 'bg-surface border border-line rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="shrink-0 mt-1">
                <div className="w-[36px] h-[36px] rounded-full bg-accent text-on-accent grid place-items-center"><Icon name="spark" size="tiny" /></div>
              </div>
              <div className="p-3.5 bg-surface border border-line rounded-[12px] rounded-tl-none shadow-sm flex items-center gap-1.5 opacity-50">
                <i className="w-2 h-2 rounded-full bg-ink animate-bounce" style={{ animationDelay: '0ms' }}></i>
                <i className="w-2 h-2 rounded-full bg-ink animate-bounce" style={{ animationDelay: '150ms' }}></i>
                <i className="w-2 h-2 rounded-full bg-ink animate-bounce" style={{ animationDelay: '300ms' }}></i>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-surface border-t border-line">
          <form onSubmit={handleSend} className="relative">
            <Input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="pr-12 bg-surface-2"
              disabled={loading}
            />
            <Button 
              type="submit" 
              size="icon-sm" 
              variant="primary" 
              className="absolute right-[3px] top-[3px]"
              disabled={loading || !query.trim()}
            >
              <Icon name="up" size="tiny" />
            </Button>
          </form>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar text-[12px]">
            {['Who is reviewing the most PRs?', 'Show me a summary of last week.', 'Are there any stuck issues?'].map(q => (
              <button key={q} onClick={() => setQuery(q)} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-line-2 bg-surface hover:bg-surface-2 text-ink-2 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      </Panel>
    </>
  );
}
