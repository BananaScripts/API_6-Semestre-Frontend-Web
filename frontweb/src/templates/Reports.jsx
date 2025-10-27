import React, { useState, useMemo } from 'react';

function Icon({ name, size = 18, color = 'currentColor' }){
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch(name){
    case 'calendar': return (<svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.2"/><path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>);
    case 'download': return (<svg {...common}><path d="M12 3v12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><path d="M8 11l4 4 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><path d="M21 21H3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>);
    case 'bar-chart': return (<svg {...common}><path d="M3 3v18M8 12v9M13 6v15M18 10v11" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'pie-chart': return (<svg {...common}><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.2"/><path d="M12 12V3a9 9 0 0 1 9 9h-9z" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>);
    case 'filter': return (<svg {...common}><path d="M3 5h18M6 12h12M10 19h4" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    default: return (<svg {...common}><rect width="100%" height="100%" fill={color}/></svg>);
  }
}

export default function Reports(){
  const [range, setRange] = useState('7d');

  const stats = useMemo(() => ({
    users: 524,
    active: 412,
    reports: 128,
  }), []);

  const recentReports = useMemo(() => ([
    { id: 1, title: 'Relatório Diário', date: '2025-09-27', author: 'Sistema', status: 'Pronto' },
    { id: 2, title: 'Utilização por Módulo', date: '2025-09-25', author: 'João', status: 'Processando' },
    { id: 3, title: 'Atendimentos', date: '2025-09-23', author: 'Maria', status: 'Pronto' },
  ]), []);

  return (
    <div className="container" style={{ paddingTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h1 className="text-title" style={{ margin: 0 }}>Relatórios</h1>
          <div className="text-default" style={{ color: 'var(--color-muted)' }}>Visão geral e exportações</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="input-container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="calendar" size={16} color="var(--color-muted)" />
            <select value={range} onChange={e => setRange(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text)' }}>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
          </div>
          <button className="button-primary" title="Exportar PDF" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="download" size={16} color="var(--color-background)"/>Exportar</button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="text-default" style={{ color: 'var(--color-muted)' }}>Usuários</div>
          <div className="text-title" style={{ marginTop: 8 }}>{stats.users}</div>
        </div>
        <div className="card">
          <div className="text-default" style={{ color: 'var(--color-muted)' }}>Ativos</div>
          <div className="text-title" style={{ marginTop: 8, color: 'var(--color-accent)' }}>{stats.active}</div>
        </div>
        <div className="card">
          <div className="text-default" style={{ color: 'var(--color-muted)' }}>Relatórios Gerados</div>
          <div className="text-title" style={{ marginTop: 8 }}>{stats.reports}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="text-subtitle">Tráfego</div>
            <div className="text-default" style={{ color: 'var(--color-muted)' }}>{range === '7d' ? 'Últimos 7 dias' : range === '30d' ? 'Últimos 30 dias' : 'Últimos 90 dias'}</div>
          </div>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
            <Icon name="bar-chart" size={64} color="var(--color-muted)" />
          </div>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="text-subtitle">Distribuição</div>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
            <Icon name="pie-chart" size={64} color="var(--color-muted)" />
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="text-subtitle">Relatórios Recentes</div>
          <div className="text-default" style={{ color: 'var(--color-muted)' }}>{recentReports.length} itens</div>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {recentReports.map(r => (
            <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div className="text-default" style={{ color: 'var(--color-muted)' }}>{r.author} · {r.date}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="text-default" style={{ color: r.status === 'Pronto' ? 'var(--color-accent)' : 'var(--color-muted)', fontWeight: 700 }}>{r.status}</div>
                <button className="button-primary" style={{ background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}><Icon name="download" size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
