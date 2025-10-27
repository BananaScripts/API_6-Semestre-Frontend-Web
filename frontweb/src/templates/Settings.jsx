import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Icon({ name, size = 18, color = 'currentColor' }){
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch(name){
    case 'person.fill': return (<svg {...common}><circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.4"/><path d="M5 20c0-3.3 2.7-6 7-6s7 2.7 7 6" stroke={color} strokeWidth="1.4"/></svg>);
    case 'key': return (<svg {...common}><path d="M3 11a4 4 0 1 1 5.29 3.71L14 20l4-4-5.71-5.71A4 4 0 0 1 3 11z" stroke={color} strokeWidth="1.4"/></svg>);
    case 'bell': return (<svg {...common}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'globe': return (<svg {...common}><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.4"/><path d="M2 12h20M12 2v20" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case 'envelope': return (<svg {...common}><rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.4"/><path d="M3 6l9 7 9-7" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'info.circle': return (<svg {...common}><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.2"/><path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>);
    case 'chevron.right': return (<svg {...common}><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'logout': return (<svg {...common}><path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4v16" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>);
    default: return (<svg {...common}><rect width="100%" height="100%" fill={color}/></svg>);
  }
}

export default function Settings(){
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load(){
      try{
        const payload = api.decodeToken();
        let found = null;
        if (payload && payload.email){
          const all = await api.listUsers();
          found = all.find(u => u.email === payload.email) || null;
        }
        setUser(found);
      }catch(e){ setUser(null); }
    }
    load();
  }, []);

  const handleLogout = async () => {
    // If there were an auth context we'd call logout; here clear token and redirect
    localStorage.removeItem('token');
    navigate('/login');
  };

  const colors = {
    background: 'var(--color-background)',
    card: 'var(--color-card)',
    border: 'var(--color-border)',
    text: 'var(--color-text)',
    muted: 'var(--color-muted)'
  };

  const userInfo = {
    name: user?.nome || user?.name || 'Usuário',
    email: user?.email || 'usuario@email.com',
    phone: user?.phone || '+55 11 99999-9999',
    memberSince: user?.created_at ? `Membro desde ${new Date(user.created_at).toLocaleDateString()}` : 'Membro desde Jan 2023'
  };

  const profileSections = [
    {
      title: 'Conta',
      items: [
        { icon: 'person.fill', title: 'Informações Pessoais', subtitle: 'Nome, email, telefone', route: '/profile/personal' },
        { icon: 'key', title: 'Alterar Senha', subtitle: 'Segurança da conta', route: '/profile/password' },
      ],
    },
    {
      title: 'Preferências',
      items: [
        { icon: 'bell', title: 'Notificações', subtitle: 'Alertas e lembretes', route: '/profile/notifications' },
        { icon: 'globe', title: 'Idioma', subtitle: 'Português (Brasil)', route: '/profile/language' },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: 'envelope', title: 'Fale Conosco', subtitle: 'Suporte por email', route: '/profile/contact' },
        { icon: 'info.circle', title: 'Sobre', subtitle: 'Versão 1.0.0', route: '/profile/about' },
      ],
    },
  ];

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div className="card" style={{ padding: 20, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
          <Icon name="person.fill" size={36} color="var(--color-text)" />
        </div>
        <div className="text-title">{userInfo.name}</div>
        <div className="text-default" style={{ color: 'var(--color-muted)', marginTop: 6 }}>{userInfo.email}</div>
        <div className="text-default" style={{ color: 'var(--color-muted)', marginTop: 6 }}>{userInfo.memberSince}</div>
      </div>

      {profileSections.map((section, si) => (
        <div key={si} style={{ marginBottom: 24 }}>
          <div className="text-subtitle" style={{ marginLeft: 4, marginBottom: 8, color: 'var(--color-muted)' }}>{section.title}</div>
          <div className="card" style={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}>
            {section.items.map((item, ii) => (
              <Link key={ii} to={item.route}>
                <div className="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: ii === section.items.length - 1 ? 'none' : `1px solid var(--color-border)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
                      <Icon name={item.icon} size={18} color="var(--color-text)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.title}</div>
                      <div className="text-default" style={{ color: 'var(--color-muted)', marginTop: 4 }}>{item.subtitle}</div>
                    </div>
                  </div>
                  <Icon name="chevron.right" size={18} color="var(--color-muted)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div style={{ paddingTop: 8 }}>
        <button onClick={handleLogout} className="button-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px' }}>
          <Icon name="logout" size={18} color="var(--color-text)" />
          <span style={{ fontWeight: 700 }}>Sair da Conta</span>
        </button>
      </div>
    </div>
  );
}
