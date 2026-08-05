import React from 'react';
import '../styles/Education.css';

const Education = () => {
  const educationData = [
    {
      institution: 'RV University',
      degree: 'BCA (Hons.) - Bachelor of Computer Applications',
      period: '2024 - Present',
      verified: true,
      description: 'Focus on web development, software design, programming paradigms, and modern application development frameworks.'
    },
    {
      institution: 'IIMS College',
      degree: 'High School / A-Levels or Pre-University Studies',
      period: '2020 - 2022',
      verified: true,
      description: 'Participated in technical events and academic leadership.'
    },
    {
      institution: 'Institution Name',
      degree: 'Add degree/major details',
      period: 'Year - Year',
      verified: false,
      description: 'Placeholder education entry. Update with correct school name, degree details, and relevant coursework.'
    }
  ];

  return (
    <section id="education" className="education-section section-padding">
      <div className="education-container">
        <h2 className="section-title">Education <span className="gradient-text">Timeline</span></h2>
        
        <div className="education-timeline">
          {educationData.map((edu, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className={`education-card ${!edu.verified ? 'placeholder-card' : ''}`}>
                <div className="card-header">
                  <h3>{edu.institution}</h3>
                  <span className="education-period">{edu.period}</span>
                </div>
                <h4>{edu.degree}</h4>
                <p>{edu.description}</p>
                {!edu.verified && (
                  <span className="placeholder-tag">Placeholder</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
