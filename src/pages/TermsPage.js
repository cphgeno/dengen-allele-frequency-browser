import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import config from '../config';

const sidebarSections = [
  {
    heading: 'Terms of Use',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'purpose',      label: 'Purpose' },
      { id: 'access',       label: 'Access to browser' },
      { id: 'copyright',    label: 'Copyright & citations' },
      { id: 'contact',      label: 'Contact information' },
    ],
  },
];

const SectionHeading = ({ id, children }) => (
  <h2 id={id} style={{
    fontSize: '18px', fontWeight: 500, color: 'var(--dg-text)',
    marginBottom: '10px', marginTop: '40px', scrollMarginTop: '80px',
  }}>
    {children}
  </h2>
);

const Body = ({ children }) => (
  <p style={{ fontSize: '14px', color: 'var(--dg-text-muted)', lineHeight: 1.8, margin: '0 0 16px' }}>
    {children}
  </p>
);

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    style={{ color: 'var(--dg-blue)', textDecoration: 'none', fontWeight: 500 }}>
    {children}
  </a>
);

const InternalLink = ({ href, children }) => (
  <a href={href} style={{ color: 'var(--dg-blue)', textDecoration: 'none', fontWeight: 500 }}>
    {children}
  </a>
);

const Tag = ({ children }) => (
  <span style={{
    display: 'inline-block', fontSize: '11px', fontWeight: 500,
    background: 'var(--dg-blue-light)', color: 'var(--dg-blue)',
    border: '0.5px solid var(--dg-blue-border)',
    borderRadius: '99px', padding: '2px 9px',
    marginRight: '6px', marginBottom: '8px',
  }}>
    {children}
  </span>
);

function DataUseTermsPage() {
  const [activeId, setActiveId] = useState('introduction');

  useEffect(() => {
    const allIds = sidebarSections.flatMap(s => s.items.map(i => i.id));
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    allIds.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0', minHeight: '600px' }}>

        {/* Sidebar */}
        <aside style={{
          borderRight: '0.5px solid var(--dg-border)', paddingTop: '4px',
          position: 'sticky', top: '80px', alignSelf: 'start',
          maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
        }}>
          {sidebarSections.map(section => (
            <div key={section.heading} style={{ marginBottom: '22px' }}>
              <div style={{
                fontSize: '10px', fontWeight: 500, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--dg-text-muted)',
                padding: '0 16px', marginBottom: '6px',
              }}>
                {section.heading}
              </div>
              {section.items.map(item => {
                const isActive = activeId === item.id;
                return (
                  <button key={item.id} onClick={() => scrollTo(item.id)} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: isActive ? 'var(--dg-blue-bg)' : 'none', border: 'none',
                    borderRight: isActive ? '2px solid var(--dg-blue)' : '2px solid transparent',
                    padding: '7px 16px', fontSize: '13px', fontFamily: 'var(--dg-font)',
                    color: isActive ? 'var(--dg-blue)' : 'var(--dg-text-muted)',
                    fontWeight: isActive ? 500 : 400, cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Content */}
        <article style={{ padding: '0 0 60px 48px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', color: 'var(--dg-text-muted)', marginBottom: '10px' }}>
              DenGen Allele Frequency Browser › Terms of Use
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 500, color: 'var(--dg-text)', marginBottom: '10px', lineHeight: 1.2 }}>
              Terms of Use
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--dg-text-muted)', lineHeight: 1.7, maxWidth: '560px', margin: 0 }}>
              Please read these terms carefully before accessing or using the DenGen Allele Frequency Browser.
            </p>
            <div style={{ marginTop: '14px' }}>
              <Tag>Research use only</Tag>
              <Tag>GDPR compliant</Tag>
              <Tag>Danish law</Tag>
            </div>
            <hr style={{ border: 'none', borderTop: '0.5px solid var(--dg-border)', margin: '24px 0 0' }} />
          </div>

          <SectionHeading id="introduction">Introduction</SectionHeading>
          <Body>
            Welcome to the DenGen Allele Frequency Browser. By accessing or using this platform, you agree to comply with the following terms and conditions. If you do not agree with any part of these terms, please refrain from using the platform.
          </Body>

          <SectionHeading id="purpose">Purpose</SectionHeading>
          <Body>
            The DenGen Allele Frequency Browser (the "Browser") is a site operated by the Department of Genomic Medicine, Rigshospitalet. Please refer to the <ExternalLink href={config.DENGEN_TERMS}>DenGen Terms of Use</ExternalLink> and terms below which covers the use of the DenGen Allele Frequency Browser (together the "AFB Terms"). By accessing and using the Browser you hereby agree to the AFB Terms. The Browser is a free-to-access resource of variant allele frequencies derived from summary statistics generated from research that has been conducted by DenGen. Use of the Browser is for the biomedical research community and the purposes of conducting health-related research purposes only.
          </Body>

          <SectionHeading id="access">Access to Browser</SectionHeading>
          <Body>
            Whilst DenGen has a reasonable belief that the use of the Browser and the summary statistics should not require any further licence or permission, the Browser and the summary statistics are provided by DenGen on an "As-Is" basis, and no warranties or representations, expressed or implied, are given about the performance, accuracy, completeness, currency or that results which may be obtained from the use of the Browser will be error free or reliable. DenGen makes no assurance that access to the Browser will always be available or be uninterrupted. We reserve the right to withdraw or amend the service we provide on the Browser without notice. We will not be liable, if for any reason, the Browser is unavailable at any time or for any period. DenGen hereby excludes any and all liability to any third party arising from the use of the Browser and the summary statistics.
          </Body>

          <SectionHeading id="copyright">Copyright notice and citations</SectionHeading>
          <Body>
            All trademarks, logos and brand names displayed on this website are the property of their respective owners and are subject to copyright and trademark laws. You must not copy or use these without the express permission of their respective owner. DenGen requests that any published use of material obtained from the Browser in publications <ExternalLink href={config.DENGEN_CITE}>cite</ExternalLink> that the data has been generated under DenGen.
          </Body>

          <SectionHeading id="contact">Contact Information</SectionHeading>
          <Body>
            For questions or further information, please <ExternalLink href={config.DENGEN_CONTACT}>contact us</ExternalLink>.
          </Body>

          <hr style={{ border: 'none', borderTop: '0.5px solid var(--dg-border)', margin: '40px 0 20px' }} />
          <a href="/" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dg-blue)', textDecoration: 'none' }}>
            ← Home
          </a>
        </article>
      </div>
    </Layout>
  );
}

export default DataUseTermsPage;
