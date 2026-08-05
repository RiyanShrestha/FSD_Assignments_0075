import React from 'react';
import '../styles/Experience.css';

const Experience = () => {
  const experiences = [
    {
      role: 'Frontend Architect / Developer (Mock Role)',
      company: 'Personal Labs / Open Source Projects',
      period: '2023 - Present',
      description: 'Designing high-fidelity UI systems, integrating React state management libraries, and engineering responsive CSS frameworks.',
      isPlaceholder: true
    },
    {
      role: 'Software Engineer Intern (Placeholder)',
      company: 'Add Company Name',
      period: 'Month Year - Month Year',
      description: 'Collaborate with cross-functional teams to build custom web applications. Optimize rendering performance and build reusable frontend components.',
      isPlaceholder: true
    }
  ];

  return (
    <section id="experience" className="experience-section section-padding">
      <div className="experience-container">
        <h2 className="section-title">Work <span className="gradient-text">Experience</span></h2>
        
        <div className="experience-list">
          {experiences.map((exp, idx) => (
            <div key={idx} className="experience-card placeholder-experience">
              <div className="experience-header">
                <div className="role-company">
                  <h3>{exp.role}</h3>
                  <h4>{exp.company}</h4>
                </div>
                <div className="header-meta">
                  <span className="experience-period">{exp.period}</span>
                  <span className="placeholder-tag">Placeholder</span>
                </div>
              </div>
              <p className="experience-desc">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
