import React from 'react';
import '../styles/Projects.css';

const Projects = () => {
  const projectsData = [
    {
      title: 'Premium SaaS Landing Experience',
      description: 'A pixel-perfect, responsive marketing interface built with advanced React paradigms, subtle CSS gradients, and fluid interactions.',
      technologies: ['React', 'CSS Grid', 'CSS Variables', 'ES6 JavaScript'],
      github: 'https://github.com/RiyanShrestha',
      demo: '#',
      verified: true
    },
    {
      title: 'Glassmorphic Dashboard Analytics',
      description: 'High-fidelity dark-mode analytical application with glassmorphic cards, custom tooltips, and interactive chart placeholders.',
      technologies: ['React.js', 'Flexbox', 'CSS Keyframes', 'SVG'],
      github: 'https://github.com/RiyanShrestha',
      demo: '#',
      verified: true
    },
    {
      title: 'Future Project Title',
      description: 'Placeholder project description. Update with details on code architectures, responsive behaviors, and business value delivered.',
      technologies: ['React', 'CSS', 'Live API'],
      github: 'https://github.com/RiyanShrestha',
      demo: '#',
      verified: false
    }
  ];

  return (
    <section id="projects" className="projects-section section-padding">
      <div className="projects-container">
        <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
        
        <div className="projects-grid">
          {projectsData.map((project, idx) => (
            <div key={idx} className={`project-card ${!project.verified ? 'placeholder-project' : ''}`}>
              <div className="project-header">
                <h3>{project.title}</h3>
                {!project.verified && (
                  <span className="placeholder-tag">Placeholder</span>
                )}
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech-list">
                {project.technologies.map((tech, tIdx) => (
                  <span key={tIdx} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.github} className="btn-link secondary">
                  GitHub Code
                </a>
                <a href={project.demo} className="btn-link primary">
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
