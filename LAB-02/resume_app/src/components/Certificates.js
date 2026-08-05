import React from 'react';
import '../styles/Certificates.css';

const Certificates = () => {
  const certificatesData = [
    {
      title: 'Academic Excellence Award / Honors Placeholder',
      issuer: 'RV University',
      date: '2024',
      verified: true,
      credentialUrl: '#'
    },
    {
      title: 'Verified Professional Certificate Placeholder',
      issuer: 'Learning Platform (Coursera / Udemy)',
      date: 'Add Year',
      verified: false,
      credentialUrl: '#'
    },
    {
      title: 'Technical Certification Placeholder',
      issuer: 'Cloud Provider (AWS / Google Cloud)',
      date: 'Add Year',
      verified: false,
      credentialUrl: '#'
    }
  ];

  return (
    <section id="certificates" className="certificates-section section-padding">
      <div className="certificates-container">
        <h2 className="section-title">Certificates & <span className="gradient-text">Awards</span></h2>
        
        <div className="certificates-grid">
          {certificatesData.map((cert, idx) => (
            <div key={idx} className={`certificate-card ${!cert.verified ? 'placeholder-cert' : ''}`}>
              <div className="certificate-header">
                <span className="award-badge">Award/Cert</span>
                {!cert.verified && (
                  <span className="placeholder-tag">Placeholder</span>
                )}
              </div>
              <h3>{cert.title}</h3>
              <div className="certificate-meta">
                <span className="issuer">{cert.issuer}</span>
                <span className="dot">•</span>
                <span className="date">{cert.date}</span>
              </div>
              <a href={cert.credentialUrl} className="btn-certificate">
                View Credential
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
