import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as IconHome } from '../assets/icons/home.svg';
import { ReactComponent as IconUsers } from '../assets/icons/users.svg';
import { ReactComponent as IconChart } from '../assets/icons/chart.svg';
import { ReactComponent as IconChat } from '../assets/icons/chat.svg';
import { ReactComponent as IconSettings } from '../assets/icons/settings.svg';

export default function Sidebar(){
  const items = [
    // topPercent values control vertical placement inside the sidebar
    // Assumption: first near top (4%), then 20%, 40%, 60%, 80%
    { to: '/home', label: 'Dashboard', Icon: IconHome, topPercent: 4 },
    { to: '/admin', label: 'Usuários', Icon: IconUsers, topPercent: 20 },
    { to: '/reports', label: 'Relatórios', Icon: IconChart, topPercent: 40 },
    { to: '/chat', label: 'Chat', Icon: IconChat, topPercent: 60 },
    { to: '/settings', label: 'Configurações', Icon: IconSettings, topPercent: 80 },
  ];

  return (
    <nav className="sidebar" aria-label="Barra lateral de navegação">
      <div className="sidebar-logo">Akasys</div>
      <ul className="sidebar-list">
        {items.map(({to,label,Icon, topPercent}) => (
          <li key={to} style={{ position: 'absolute', left: '50%', top: `${topPercent}%`, transform: 'translate(-50%, -50%)' }}>
            <NavLink to={to} className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}>
              <Icon className="sidebar-icon" aria-hidden="true" />
              <span className="sidebar-label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
