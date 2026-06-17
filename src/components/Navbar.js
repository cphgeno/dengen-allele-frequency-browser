import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: '/',      label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/terms', label: 'Terms of use' },
  ];

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 0',
      borderBottom: '0.5px solid var(--dg-border)',
      position: 'sticky', top: 0,
      background: '#fff', zIndex: 200,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        textDecoration: 'none', fontFamily: 'var(--dg-font)',
        fontSize: '17px', fontWeight: 500, color: 'var(--dg-text)',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 2C4 2 7 4 9 9C11 14 14 16 14 16" stroke="#1a6fa8" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M14 2C14 2 11 4 9 9C7 14 4 16 4 16" stroke="#1a6fa8" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.4"/>
          <line x1="5.5" y1="6.5"  x2="12.5" y2="6.5"  stroke="#1a6fa8" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="4.5" y1="9"    x2="13.5" y2="9"    stroke="#1a6fa8" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="5.5" y1="11.5" x2="12.5" y2="11.5" stroke="#1a6fa8" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        DenGen <span style={{ fontWeight: 400, color: 'var(--dg-text-muted)', fontSize: '14px', marginLeft: '2px' }}>· Allele Frequency Browser</span>
      </Link>

      {/* Links */}
      <ul style={{ display: 'flex', gap: '24px', alignItems: 'center', margin: 0, padding: 0 }}>
        {links.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <li key={to} style={{ listStyle: 'none' }}>
              <Link to={to} style={{
                fontSize: '13px', fontFamily: 'var(--dg-font)',
                textDecoration: 'none',
                color: active ? 'var(--dg-blue)' : 'var(--dg-text-muted)',
                fontWeight: active ? 500 : 400,
                borderBottom: active ? '1.5px solid var(--dg-blue)' : '1.5px solid transparent',
                paddingBottom: '2px', transition: 'color 0.15s',
              }}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;


