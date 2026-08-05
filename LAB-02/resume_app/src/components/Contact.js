import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="contact-container">
        <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
        
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p className="contact-desc">
              Have an exciting opportunity, project, or just want to say hi? Feel free to reach out using the form or social channels.
            </p>
            <div className="info-items">
              <div className="info-item">
                <span className="info-label">LinkedIn:</span>
                <a href="https://www.linkedin.com/in/riyan-shrestha-11b962316" target="_blank" rel="noopener noreferrer" className="info-value link">
                  linkedin.com/in/riyan-shrestha-11b962316
                </a>
              </div>
              <div className="info-item">
                <span className="info-label">GitHub:</span>
                <a href="https://github.com/RiyanShrestha" target="_blank" rel="noopener noreferrer" className="info-value link">
                  github.com/RiyanShrestha
                </a>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <a href="mailto:riyanshresthabca24@rvu.edu.in" className="info-value link">
                  riyanshresthabca24@rvu.edu.in
                </a>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <a href="tel:+919611302767" className="info-value link">
                  +91 9611302767
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            {submitted ? (
              <div className="form-success">
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-submit">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
