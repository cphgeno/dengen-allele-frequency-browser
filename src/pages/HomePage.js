import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import config from '../config';

function classifyQuery(query) {
  const cleaned = query.trim().toLowerCase();
  if (/^chr[0-9xy]+-\d+-\d+$/i.test(cleaned))             return 'region';
  if (/^chr[0-9xy]+-\d+-[acgt]+-[acgt]+$/i.test(cleaned)) return 'variant';
  if (/^[a-z0-9\-\.]{2,20}$/i.test(cleaned))              return 'gene';
  return 'unknown';
}

const examples = [
  { label: 'PCSK9',                     value: 'PCSK9',                  type: 'Gene' },
  { label: 'chr11-102904-C-G',          value: 'chr11-102904-C-G',       type: 'Variant' },
  { label: 'chr1-55039445-55064852',    value: 'chr1-55039445-55064852', type: 'Region' },
];

const stats = [
  { value: '2,211',   label: 'Unrelated individuals' },
  { value: '52×+',    label: 'Avg. sequencing depth' },
  { value: 'GRCh38',  label: 'Reference genome' },
  { value: 'SNV + SV', label: 'Variant types' },
];

function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const type = classifyQuery(query);
    if (type !== 'unknown') navigate(`/search?query=${query}&type=${type}`);
  }

  return (
    <Layout>

      {/* ── Hero — same tinted pattern as DenGen landing ── */}
      <div style={{
        background: '#f0f7ff',
        borderBottom: '0.5px solid #cce0f5',
        padding: '56px 48px',
        marginLeft: '-48px',
        marginRight: '-48px',
      }}>
        <span style={{
          display: 'inline-block',
          fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--dg-blue)', background: '#daeeff',
          borderRadius: '99px', padding: '3px 10px', marginBottom: '16px',
        }}>
          Danish population genomics
        </span>

        <h1 style={{
          fontSize: '36px', fontWeight: 500, color: '#0a3a5e',
          lineHeight: 1.2, marginBottom: '14px', maxWidth: '560px',
        }}>
          DenGen Allele Frequency Browser
        </h1>

        <p style={{
          fontSize: '15px', color: '#3a6080', lineHeight: 1.75,
          maxWidth: '520px', marginBottom: '28px',
        }}>
          The DenGen Allele Frequency Browser is a resource of variant allele frequencies
          made publicly available. The dataset encompasses SNP and indel variant calls in
          2,211 individuals from whole genome sequencing of all Danish DenGen participants.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '520px', marginBottom: '16px' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Gene, variant (chr1-pos-ref-alt) or region (chr1-start-end)"
            style={{
              flex: 1, padding: '10px 14px',
              border: '0.5px solid var(--dg-blue-border)',
              borderRadius: '6px', fontSize: '13px',
              fontFamily: 'var(--dg-font)', color: 'var(--dg-text)',
              background: '#fff', outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--dg-blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--dg-blue-border)'}
          />
          <button type="submit" style={{
            background: 'var(--dg-blue)', color: '#fff',
            border: 'none', borderRadius: '6px',
            padding: '10px 22px', fontSize: '13px', fontWeight: 500,
            fontFamily: 'var(--dg-font)', cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Search
          </button>
        </form>

        {/* Example searches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#3a6080' }}>Try:</span>
          {examples.map(ex => (
            <button key={ex.value} onClick={() => setQuery(ex.value)} style={{
              background: '#fff', border: '0.5px solid #cce0f5',
              borderRadius: '99px', padding: '3px 10px',
              fontSize: '12px', fontFamily: 'var(--dg-font)',
              color: 'var(--dg-text-muted)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              transition: 'border-color 0.15s',
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--dg-blue)'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#cce0f5'}
            >
              <span style={{
                fontSize: '10px', fontWeight: 500, color: 'var(--dg-blue)',
                background: 'var(--dg-blue-light)', borderRadius: '99px', padding: '1px 5px',
              }}>
                {ex.type}
              </span>
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats strip — same as DenGen landing ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '0.5px solid var(--dg-border)',
        marginLeft: '-48px', marginRight: '-48px',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '22px 32px',
            borderRight: i < stats.length - 1 ? '0.5px solid var(--dg-border)' : 'none',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 500, color: '#0a3a5e' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--dg-text-muted)', marginTop: '3px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Learn more ── */}
      <div style={{ padding: '28px 0 0' }}>
        <a href={config.DENGEN_LANDING_PAGE} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dg-blue)', textDecoration: 'none' }}>
          Learn more about DenGen →
        </a>
      </div>

    </Layout>
  );
}

export default HomePage;