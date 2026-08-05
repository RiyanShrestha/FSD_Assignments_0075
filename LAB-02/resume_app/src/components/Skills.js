import React from 'react';
import '../styles/Skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Python', 'SQL']
    },
    {
      title: 'Frontend Development',
      skills: ['React.js', 'Redux', 'JSX', 'Responsive Design', 'Flexbox', 'CSS Grid']
    },
    {
      title: 'Backend & Database',
      skills: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'PostgreSQL']
    },
    {
      title: 'Tools & Workflow',
      skills: ['Git & GitHub', 'Figma (UI/UX)', 'Vite / CRA', 'npm / yarn', 'VS Code']
    },
    {
      title: 'Soft Skills',
      skills: ['Team Leadership', 'Effective Communication', 'Problem Solving', 'Adaptability']
    },
    {
      title: 'Specializations (Placeholder)',
      skills: ['Add professional skill 1', 'Add professional skill 2', 'Add professional skill 3'],
      isPlaceholder: true
    }
  ];

  return (
    <section id="skills" className="skills-section section-padding">
      <div className="skills-container">
        <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
        
        <div className="skills-grid">
          {skillCategories.map((category, idx) => (
            <div key={idx} className={`skills-card ${category.isPlaceholder ? 'placeholder-skills' : ''}`}>
              <div className="skills-card-header">
                <h3>{category.title}</h3>
                {category.isPlaceholder && (
                  <span className="placeholder-badge">Placeholder</span>
                )}
              </div>
              <div className="badges-container">
                {category.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
