import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from './Layout';
import config from '../config';

const endpoint = config.BEACON_API;

// ── Sorting header cell ────────────────────────────────────────────
const SortTh = ({ column, label, sortColumn, sortDirection, onSort }) => {
  const active = sortColumn === column;
  return (
    <th
      onClick={() => onSort(column)}
      style={{
        padding: '10px 14px', fontSize: '12px', fontWeight: 500,
        color: active ? 'var(--dg-blue)' : 'var(--dg-text-muted)',
        textAlign: 'left', cursor: 'pointer', userSelect: 'none',
        borderBottom: '0.5px solid var(--dg-border)',
        background: 'var(--dg-blue-bg)', whiteSpace: 'nowrap',
        transition: 'color 0.15s',
      }}
    >
      {label} {active ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
    </th>
  );
};

// ── External resource pill ─────────────────────────────────────────
const ResourcePill = ({ name, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" style={{
    fontSize: '12px', fontWeight: 500,
    color: 'var(--dg-blue)',
    background: 'var(--dg-blue-bg)',
    border: '0.5px solid var(--dg-blue-border)',
    borderRadius: '99px', padding: '4px 12px',
    textDecoration: 'none', whiteSpace: 'nowrap',
    transition: 'background 0.15s',
  }}
    onMouseOver={e => e.currentTarget.style.background = '#daeeff'}
    onMouseOut={e => e.currentTarget.style.background = 'var(--dg-blue-bg)'}
  >
    {name}
  </a>
);

// ── Loading spinner ────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', alignItems: 'center', gap: '12px' }}>
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%',
      border: '2px solid var(--dg-blue-border)',
      borderTopColor: 'var(--dg-blue)',
      animation: 'dg-spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes dg-spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ fontSize: '13px', color: 'var(--dg-text-muted)' }}>Fetching data…</span>
  </div>
);

// ── Main component ─────────────────────────────────────────────────
const SearchResults = () => {
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [data, setData]               = useState([]);
  const [rsID, setRsID]               = useState(null);
  const [sortColumn, setSortColumn]   = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const location      = useLocation();
  const params        = new URLSearchParams(location.search);
  const query         = params.get('query');
  const type          = params.get('type');
  const variantFromState = location.state?.variant;

  const handleSort = column => {
    if (sortColumn === column) setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortColumn(column); setSortDirection('asc'); }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const va = a[sortColumn] ?? 0;
    const vb = b[sortColumn] ?? 0;
    return sortDirection === 'asc' ? va - vb : vb - va;
  });

  // ── Data fetching (unchanged logic) ──
  useEffect(() => {
    if (variantFromState) { setData([variantFromState]); setLoading(false); return; }
    if (!query || !type) return;

    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        if (type === 'variant') {
          const [chrom, pos, ref, alt] = query.split('-');
          if (!chrom || !pos || !ref || !alt) throw new Error('Invalid variant format. Expected chr-pos-ref-alt.');
          const apiUrl = `${endpoint}/g_variants?start=${pos}&alternateBases=${alt}&referenceBases=${ref}&referenceName=${chrom.replace('chr', '')}&assemblyId=GRCh38&limit=1000000`;
          const response = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } });
          if (!response.ok) throw new Error('Failed to fetch variant data');
          const result = await response.json();
          const parsedData = result.response?.resultSets?.[0]?.results.slice(0, 1).flatMap(variant => {
            const freq = variant.frequencyInPopulations?.[0]?.frequencies?.[0];
            if (freq) return [{ VariantID: query, Category: 'DenGen', AlleleCount: freq.alleleCount, AlleleNumber: freq.alleleNumber, Homozygotes: freq.alleleCountHomozygous || 0, AlleleFrequency: freq.alleleFrequency?.toFixed(6) || 'N/A' }];
            return [];
          }) || [];
          setData(parsedData);

        } else if (type === 'gene') {
          const geneRes = await fetch(`https://rest.ensembl.org/lookup/symbol/homo_sapiens/${query}?content-type=application/json`);
          if (!geneRes.ok) throw new Error(`Gene ${query} not found`);
          const geneData = await geneRes.json();
          const { seq_region_name: chrom, start, end } = geneData;
          const regionUrl = `${endpoint}/g_variants?start=${start}&end=${end}&referenceName=${chrom}&assemblyId=GRCh38&limit=1000000`;
          const response = await fetch(regionUrl, { headers: { 'Content-Type': 'application/json' } });
          if (!response.ok) throw new Error('Failed to fetch regional variants');
          const result = await response.json();
          const variants = result.response?.resultSets?.[0]?.results || [];
          setData(variants.flatMap(variant => {
            const freq = variant.frequencyInPopulations?.[0]?.frequencies?.[0];
            if (freq) {
              const s = variant.variation?.location?.interval?.start?.value;
              const ref = variant.variation?.referenceBases;
              const alt = variant.variation?.alternateBases;
              const varID = `chr${chrom}-${s}-${ref}-${alt}`;
              return [{ VariantID: varID, Category: 'DenGen', AlleleCount: freq.alleleCount, AlleleNumber: freq.alleleNumber, Homozygotes: freq.alleleCountHomozygous || 0, AlleleFrequency: freq.alleleFrequency?.toFixed(6) || 'N/A' }];
            }
            return [];
          }));

        } else if (type === 'region') {
          const regionMatch = query.match(/^chr(\w+)-(\d+)-(\d+)$/);
          if (!regionMatch) throw new Error('Invalid region format. Use chr1-start-end');
          const [, chrom, start, end] = regionMatch;
          const regionUrl = `${endpoint}/g_variants?start=${start}&end=${end}&referenceName=${chrom}&assemblyId=GRCh38&limit=1000000`;
          const response = await fetch(regionUrl, { headers: { 'Content-Type': 'application/json' } });
          if (!response.ok) throw new Error('Failed to fetch region variants');
          const result = await response.json();
          const variants = result.response?.resultSets?.[0]?.results || [];
          setData(variants.flatMap(variant => {
            const freq = variant.frequencyInPopulations?.[0]?.frequencies?.[0];
            const s = variant.variation?.location?.interval?.start?.value;
            const ref = variant.variation?.referenceBases;
            const alt = variant.variation?.alternateBases;
            if (freq && s !== undefined && ref && alt) {
              const varID = `chr${chrom}-${s}-${ref}-${alt}`;
              return [{ VariantID: varID, Category: 'DenGen', AlleleCount: freq.alleleCount, AlleleNumber: freq.alleleNumber, Homozygotes: freq.alleleCountHomozygous || 0, AlleleFrequency: freq.alleleFrequency?.toFixed(6) || 'N/A' }];
            }
            return [];
          }));
        }
      } catch (err) {
        setError(err.message); setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, type]);

  // ── rsID fetch (variant only) ──
  useEffect(() => {
    if (type !== 'variant' || !sortedData?.[0]?.VariantID) return;
    const snv = sortedData[0].VariantID;
    const [chr, pos, ref, alt] = snv.split('-');
    if (!chr || !pos || !ref || !alt) return;
    (async () => {
      try {
        const res = await fetch(`https://rest.ensembl.org/variant_recoder/human/${chr}:${pos}:${ref}:${alt}`, { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const d = await res.json();
        if (!Array.isArray(d) || !d[0]) return;
        let found = null;
        for (const key of Object.keys(d[0])) {
          const sub = d[0][key];
          if (sub && Array.isArray(sub.id)) {
            found = sub.id.find(id => typeof id === 'string' && id.startsWith('rs'));
            if (found) break;
          }
        }
        setRsID(found || null);
      } catch { setRsID(null); }
    })();
  }, [type, JSON.stringify(sortedData)]);

  // ── UCSC URL ──
  let ucscUrl = '';
  if (sortedData.length > 0 && sortedData[0].VariantID) {
    const [chrom, posStr] = sortedData[0].VariantID.split('-');
    const pos = parseInt(posStr);
    ucscUrl = `https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&highlight=hg38.${chrom}%3A${pos}-${pos}&position=${chrom}%3A${pos - 75}-${pos + 75}`;
  }

  const externalResources = type === 'variant' && sortedData[0]?.VariantID ? [
    { name: 'gnomAD',              url: `https://gnomad.broadinstitute.org/variant/${sortedData[0].VariantID}` },
    { name: 'dbSNP',               url: rsID ? `https://www.ncbi.nlm.nih.gov/snp/${rsID}` : '#' },
    { name: 'UCSC Genome Browser', url: ucscUrl },
    { name: 'ClinGen Allele Registry', url: 'https://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_canonicalid?canonicalid=CA26350' },
    { name: 'ClinVar',             url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/38266/' },
    { name: 'All of Us',           url: `https://databrowser.researchallofus.org/snvsindels/${sortedData[0].VariantID}` },
    { name: 'UK Biobank',          url: `https://afb.ukbiobank.ac.uk/variant/${sortedData[0].VariantID}` },
    { name: 'FinnGen',             url: `https://r12.finngen.fi/variant/${sortedData[0].VariantID}` },
    { name: 'SweGen',              url: `https://swefreq.nbis.se/dataset/SweGen/browser/variant/${sortedData[0].VariantID}` },
  ] : [];

  return (
    <Layout>

      {/* ── Search context bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '12px', color: 'var(--dg-text-muted)', marginBottom: '24px',
      }}>
        <Link to="/" style={{ color: 'var(--dg-blue)', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <span style={{
          background: 'var(--dg-blue-light)', color: 'var(--dg-blue)',
          borderRadius: '99px', padding: '2px 8px', fontSize: '11px', fontWeight: 500,
          textTransform: 'capitalize',
        }}>
          {type}
        </span>
        <span style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--dg-text)', fontWeight: 500 }}>
          {query}
        </span>
      </div>

      {loading ? <Spinner /> : error ? (
        <div style={{
          border: '0.5px solid #fca5a5', borderRadius: '8px',
          background: '#fff5f5', padding: '16px 18px',
          fontSize: '13px', color: '#b91c1c',
        }}>
          {error}
        </div>
      ) : data.length === 0 ? (
        <div style={{
          border: '0.5px solid var(--dg-border)', borderRadius: '8px',
          padding: '32px', textAlign: 'center',
          fontSize: '14px', color: 'var(--dg-text-muted)',
        }}>
          No variants found for <strong style={{ color: 'var(--dg-text)' }}>{query}</strong>
        </div>
      ) : (
        <>
          {/* Result count */}
          <div style={{ fontSize: '12px', color: 'var(--dg-text-muted)', marginBottom: '10px' }}>
            {sortedData.length.toLocaleString()} {sortedData.length === 1 ? 'variant' : 'variants'} found
          </div>

          {/* ── Results table ── */}
          <div style={{ border: '0.5px solid var(--dg-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '28px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '10px 14px', fontSize: '12px', fontWeight: 500,
                      color: 'var(--dg-text-muted)', textAlign: 'left',
                      borderBottom: '0.5px solid var(--dg-border)',
                      background: 'var(--dg-blue-bg)',
                    }}>
                      Variant ID
                    </th>
                    {[
                      { col: 'AlleleCount',     label: 'Allele count' },
                      { col: 'AlleleNumber',    label: 'Allele number' },
                      { col: 'Homozygotes',     label: 'Homozygotes' },
                      { col: 'AlleleFrequency', label: 'Allele frequency' },
                    ].map(({ col, label }) => (
                      <SortTh key={col} column={col} label={label}
                        sortColumn={sortColumn} sortDirection={sortDirection}
                        onSort={handleSort} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '0.5px solid var(--dg-border)' }}
                      onMouseOver={e => e.currentTarget.style.background = '#fafcff'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff'}
                    >
                      <td style={{ padding: '10px 14px', fontSize: '13px', fontFamily: 'ui-monospace, monospace', color: 'var(--dg-text)' }}>
                        {(type === 'gene' || type === 'region') && item.VariantID ? (
                          <Link
                            to={{ pathname: '/search', search: `?query=${item.VariantID}&type=variant` }}
                            state={{ variant: item }}
                            style={{ color: 'var(--dg-blue)', textDecoration: 'none', fontWeight: 500 }}
                          >
                            {item.VariantID}
                          </Link>
                        ) : (
                          item.VariantID || query
                        )}
                      </td>
                      {['AlleleCount', 'AlleleNumber', 'Homozygotes', 'AlleleFrequency'].map(col => (
                        <td key={col} style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--dg-text)' }}>
                          {item[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── External resources (variant only) ── */}
          {type === 'variant' && externalResources.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--dg-text-muted)', marginBottom: '12px',
              }}>
                Allele Frequency External Resources
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {externalResources.map(r => <ResourcePill key={r.name} {...r} />)}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default SearchResults;
