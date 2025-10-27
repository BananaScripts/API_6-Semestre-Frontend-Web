import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

function Icon({ name, size = 18, color = 'currentColor' }){
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch(name){
    case 'plus': return (<svg {...common}><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'person.circle.fill': return (<svg {...common}><circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.4"/><path d="M4 20c0-3.3 2.7-6 7-6s7 2.7 7 6" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case 'person.3.fill': return (<svg {...common}><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 20a4 4 0 0 1 8 0" stroke={color} strokeWidth="1.4"/></svg>);
    case 'magnifyingglass': return (<svg {...common}><circle cx="11" cy="11" r="6" stroke={color} strokeWidth="1.4"/><path d="M21 21l-4.3-4.3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case 'xmark.circle.fill': return (<svg {...common}><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.2"/><path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'chevron.right': return (<svg {...common}><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    default: return (<svg {...common}><rect width="100%" height="100%" fill={color}/></svg>);
  }
}

export default function Chat(){
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = useMemo(() => ([
    { id: 1, name: 'João Silva', lastMessage: 'Obrigado pela ajuda!', time: '2 min', unread: 2, avatar: 'person.circle.fill', online: true },
    { id: 2, name: 'Maria Santos', lastMessage: 'Preciso de mais informações sobre o projeto', time: '15 min', unread: 0, avatar: 'person.circle.fill', online: false },
    { id: 3, name: 'Carlos Oliveira', lastMessage: 'Vou enviar os documentos amanhã', time: '1h', unread: 1, avatar: 'person.circle.fill', online: true },
    { id: 4, name: 'Ana Costa', lastMessage: 'Perfeito, obrigada!', time: '2h', unread: 0, avatar: 'person.circle.fill', online: false },
    { id: 5, name: 'Pedro Lima', lastMessage: 'Podemos marcar uma reunião?', time: '3h', unread: 0, avatar: 'person.circle.fill', online: false },
    { id: 6, name: 'Equipe Dev', lastMessage: 'Nova atualização disponível', time: '1d', unread: 5, avatar: 'person.3.fill', online: false },
  ]), []);

  const filtered = conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container" style={{ paddingTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 className="text-title" style={{ margin: 0 }}>Conversas</h2>
        <div>
          <button className="button-primary" style={{ background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} title="Novo chat"><Icon name="plus" size={14} color="var(--color-text)"/></button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div className="input-container" style={{ borderColor: 'var(--color-border)' }}>
          <Icon name="magnifyingglass" size={16} color="var(--color-muted)" />
          <input placeholder="Buscar conversas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', marginLeft: 8, background: 'transparent', color: 'var(--color-text)', width: '100%' }} />
          {searchQuery.length > 0 && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Limpar"><Icon name="xmark.circle.fill" size={16} color="var(--color-muted)"/></button>
          )}
        </div>
      </div>

      <div>
        {filtered.map(conv => (
          <Link key={conv.id} to={`/chat/${conv.id}`}>
            <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, borderRadius: 12 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={conv.avatar} size={20} /></div>
                {conv.online && <div style={{ position: 'absolute', right: 2, bottom: 2, width: 12, height: 12, borderRadius: 6, background: 'var(--color-accent)', border: '2px solid var(--color-card)' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="text-default-semibold">{conv.name}</div>
                  <div className="text-default" style={{ color: 'var(--color-muted)' }}>{conv.time}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <div className="text-default" style={{ color: 'var(--color-muted)' }}>{conv.lastMessage}</div>
                  {conv.unread > 0 && <div style={{ background: 'var(--color-accent)', color: 'var(--color-background)', padding: '4px 8px', borderRadius: 12, fontWeight: 700 }}>{conv.unread > 9 ? '9+' : conv.unread}</div>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ position: 'fixed', right: 24, bottom: 24 }}>
        <button className="button-primary" style={{ width: 56, height: 56, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Nova conversa"><Icon name="plus" size={20} color="var(--color-background)"/></button>
      </div>
    </div>
  );
}
