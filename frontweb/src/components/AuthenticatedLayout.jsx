import React from 'react';
import Sidebar from './Sidebar';

export default function AuthenticatedLayout({ children }){
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
