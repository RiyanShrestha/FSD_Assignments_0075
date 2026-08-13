import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PracticalSummary from '../sections/PracticalSummary';

const Dashboard = ({ onNavigate }) => {
  const cards = [
    {
      id: 'http-explorer',
      num: '01',
      title: 'HTTP Request–Response',
      desc: 'Trace HTTP requests and responses and inspect network information.',
      concepts: ['HTTP', 'Fetch API', 'Request', 'Response', 'Status Codes', 'Headers', 'Network Tab'],
    },
    {
      id: 'layout-lab',
      num: '02',
      title: 'HTML/CSS Layout Lab',
      desc: 'Identify and fix alignment, spacing and responsiveness problems.',
      concepts: ['HTML', 'CSS', 'Flexbox', 'Grid', 'Spacing', 'Alignment', 'Responsive Design'],
    },
    {
      id: 'javascript-lab',
      num: '03',
      title: 'JavaScript Interactive Lab',
      desc: 'Demonstrate DOM manipulation, events, dynamic updates and validation.',
      concepts: ['DOM', 'Events', 'Dynamic Updates', 'Form Validation', 'JavaScript'],
    },
    {
      id: 'react-components',
      num: '04',
      title: 'React Component Lab',
      desc: 'Analyze a UI and break it into reusable React components.',
      concepts: ['Components', 'Props', 'State', 'Reusability', 'Hierarchy', 'React'],
    },
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  };

  const badgeContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    margin: '1.25rem 0'
  };

  const bannerStyle = {
    padding: '2.5rem 2rem',
    background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(99, 102, 241, 0.05) 100%)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '2rem',
    position: 'relative'
  };

  return (
    <div className="fade-in">
      <div style={bannerStyle}>
        <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          DEPARTMENT OF COMPUTER APPLICATIONS
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Web Development Tutorial Lab
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.6' }}>
          Interactive academic demonstration platform covering core client-server communications, design alignment, spacing models, event-driven scripting, and modern React component decomposition.
        </p>
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2.5rem' }}>
        Syllabus Modules
      </h2>

      <div style={gridStyle}>
        {cards.map((card) => (
          <Card key={card.id} title={`${card.num}. ${card.title}`} subtitle="Lab Experiment Details">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '3rem' }}>
              {card.desc}
            </p>
            
            <div style={badgeContainerStyle}>
              {card.concepts.map((concept) => (
                <span 
                  key={concept} 
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {concept}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <Button 
                variant="primary" 
                onClick={() => onNavigate(card.id)}
                style={{ width: '100%' }}
              >
                Open Tutorial →
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <PracticalSummary />
    </div>
  );
};

export default Dashboard;
