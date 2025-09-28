import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// Inline Icon helper (small set)
function Icon({ name, size = 18, color = 'currentColor' }){
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch(name){
    case 'bell.fill': return (<svg {...common}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.93 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'chart.line.uptrend.xyaxis': return (<svg {...common}><path d="M3 3v18h18" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 14l3-3 4 4 6-7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'person.3.fill': return (<svg {...common}><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 20a4 4 0 0 1 8 0" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'percent': return (<svg {...common}><path d="M19 5L5 19" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><circle cx="6.5" cy="6.5" r="1.5" stroke={color} strokeWidth="1.4"/><circle cx="17.5" cy="17.5" r="1.5" stroke={color} strokeWidth="1.4"/></svg>);
    case 'clock.fill': return (<svg {...common}><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.4"/><path d="M12 7v6l4 2" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case 'doc.text.fill': return (<svg {...common}><path d="M7 2h6l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'chart.bar.fill': return (<svg {...common}><path d="M3 3v18h18" stroke={color} strokeWidth="1.4"/><rect x="7" y="10" width="3" height="8" stroke={color} strokeWidth="1.4"/><rect x="12" y="6" width="3" height="12" stroke={color} strokeWidth="1.4"/><rect x="17" y="2" width="3" height="16" stroke={color} strokeWidth="1.4"/></svg>);
    case 'chevron.right': return (<svg {...common}><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'arrow.up': return (<svg {...common}><path d="M12 19V5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><path d="M5 12l7-7 7 7" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'arrow.down': return (<svg {...common}><path d="M12 5v14" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><path d="M19 12l-7 7-7-7" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'arrow.up.arrow.down': return (<svg {...common}><path d="M12 5v14" stroke={color} strokeWidth="1.4"/><path d="M5 12l7-7 7 7" stroke={color} strokeWidth="1.4"/></svg>);
    default: return (<svg {...common}><rect width="100%" height="100%" fill={color} /></svg>);
  }
}

export default function Home(){
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const dashboardCards = [
    { title: 'Vendas do Mês', value: 'R$ 45.230', change: '+12.5%', icon: 'chart.line.uptrend.xyaxis', trend: 'up' },
    { title: 'Usuários Ativos', value: '2.847', change: '+8.2%', icon: 'person.3.fill', trend: 'up' },
    { title: 'Taxa de Conversão', value: '3.24%', change: '-2.1%', icon: 'percent', trend: 'down' },
    { title: 'Tempo Médio', value: '4m 32s', change: '+15.3%', icon: 'clock.fill', trend: 'up' },
  ];

  const quickActions = [
    { title: 'Relatórios', icon: 'doc.text.fill', route: '/reports' },
    { title: 'Analytics', icon: 'chart.bar.fill', route: '/reports' },
    { title: 'Configurações', icon: 'doc.text.fill', route: '/settings' },
    { title: 'Suporte', icon: 'doc.text.fill', route: '/settings' },
  ];

  const recentData = [
    { id: 1, title: 'Relatório de Vendas', subtitle: 'Última atualização: 2h atrás', icon: 'doc.text.fill' },
    { id: 2, title: 'Análise de Performance', subtitle: 'Dados atualizados', icon: 'chart.line.uptrend.xyaxis' },
    { id: 3, title: 'Backup Automático', subtitle: 'Concluído com sucesso', icon: 'doc.text.fill' },
    { id: 4, title: 'Nova Atualização', subtitle: 'Versão 2.1.0 disponível', icon: 'doc.text.fill' },
  ];

  const tableData = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'Ativo', role: 'Admin', lastLogin: '2024-01-15', revenue: 'R$ 12.500' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'Ativo', role: 'Vendedor', lastLogin: '2024-01-14', revenue: 'R$ 8.750' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', status: 'Inativo', role: 'Vendedor', lastLogin: '2024-01-10', revenue: 'R$ 5.200' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', status: 'Ativo', role: 'Gerente', lastLogin: '2024-01-15', revenue: 'R$ 15.300' },
    { id: 5, name: 'Carlos Lima', email: 'carlos@email.com', status: 'Ativo', role: 'Vendedor', lastLogin: '2024-01-13', revenue: 'R$ 9.800' },
    { id: 6, name: 'Lucia Ferreira', email: 'lucia@email.com', status: 'Pendente', role: 'Vendedor', lastLogin: '2024-01-12', revenue: 'R$ 3.400' },
  ];

  const sortData = (data, field, order) => {
    return [...data].sort((a,b) => {
      let aVal = a[field];
      let bVal = b[field];
      if (field === 'revenue'){
        aVal = parseFloat(aVal.replace('R$ ', '').replace('.', '').replace(',', '.'));
        bVal = parseFloat(bVal.replace('R$ ', '').replace('.', '').replace(',', '.'));
      }
      if (order === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const sortedData = sortData(tableData, sortBy, sortOrder);

  return (
    <div className="container" style={{ paddingTop: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div className="text-default" style={{ color: 'var(--color-muted)' }}>Dashboard</div>
          <h2 className="text-title" style={{ margin: 0 }}>Visão Geral</h2>
        </div>
        <div>
          <button className="button-primary" style={{ background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} title="Notificações"><Icon name="bell.fill" size={16} color="var(--color-text)"/></button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        {dashboardCards.map((c, i) => (
          <div key={i} className="card" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Icon name={c.icon} size={20} />
              <div style={{ padding: 6, borderRadius: 8, background: c.trend === 'up' ? 'var(--color-accent)20' : 'var(--color-muted)20' }}>
                <Icon name={c.trend === 'up' ? 'arrow.up' : 'arrow.down'} size={12} color={c.trend === 'up' ? 'var(--color-accent)' : 'var(--color-muted)'} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="text-title">{c.value}</div>
              <div className="text-default" style={{ color: 'var(--color-muted)' }}>{c.title}</div>
              <div style={{ marginTop: 6, color: c.trend === 'up' ? 'var(--color-accent)' : 'var(--color-muted)' }}>{c.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="text-subtitle">Ações Rápidas</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {quickActions.map((a, i) => (
            <Link key={i} to={a.route}>
              <div className="card" style={{ textAlign: 'center' }}>
                <Icon name={a.icon} size={20} />
                <div style={{ marginTop: 8 }}>{a.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Data */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="text-subtitle">Dados Recentes</div>
          <div className="text-link">Ver todos</div>
        </div>
        <div>
          {recentData.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, borderRadius: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={item.icon} size={16} /></div>
              <div style={{ flex: 1 }}>
                <div className="text-default-semibold">{item.title}</div>
                <div className="text-default" style={{ color: 'var(--color-muted)' }}>{item.subtitle}</div>
              </div>
              <Icon name="chevron.right" size={16} color="var(--color-muted)" />
            </div>
          ))}
        </div>
      </div>

      {/* Data Table / Mobile cards */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="text-subtitle">Dados dos Usuários</div>
          <div className="text-link">Exportar</div>
        </div>

        <div>
          {/* simple responsive: show cards stacked */}
          {sortedData.map(row => (
            <div key={row.id} className="card" style={{ marginBottom: 12, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="text-default-semibold">{row.name}</div>
                  <div className="text-default" style={{ color: 'var(--color-muted)' }}>{row.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{row.revenue}</div>
                  <div style={{ color: 'var(--color-muted)' }}>{row.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
