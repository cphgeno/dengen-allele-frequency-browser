const Footer = () => (
  <footer style={{
    borderTop: '0.5px solid var(--dg-border)',
    padding: '20px 0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'var(--dg-font)',
  }}>
    <span style={{ fontSize: '12px', color: 'var(--dg-text-muted)' }}>
      © 2026 DenGen, MDxCORE, Rigshospitalet
    </span>
    <div style={{ display: 'flex', gap: '8px' }}>
      {[
        { label: 'Rigshospitalet',               href: 'https://www.rigshospitalet.dk' },
        { label: 'Danish National Genome Center', href: 'https://eng.ngc.dk' },
      ].map(({ label, href }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
          fontSize: '11px', color: 'var(--dg-text-muted)',
          border: '0.5px solid var(--dg-border)', borderRadius: '4px',
          padding: '4px 10px', textDecoration: 'none', transition: 'color 0.15s',
        }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--dg-blue)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--dg-text-muted)'}
        >
          {label}
        </a>
      ))}
    </div>
  </footer>
);

export default Footer;