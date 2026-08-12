import React, { useState } from 'react';
import Toast from './Toast';
import './ApplicationForm.css';

/*
  ApplicationForm Component
  -------------------------
  This is the main form component that demonstrates all required React concepts:

  1. useState Hook        — manages form data, toast visibility, and toast message
  2. Event Handling       — onChange, onSubmit, onClick handlers
  3. event.preventDefault — prevents page reload on form submit
  4. alert()              — shows validation errors
  5. Toast Notification   — conditional rendering of success toast
  6. Clear Form           — resets all state to initial values
*/

function ApplicationForm() {

  // ==============================
  // 1. useState HOOK
  // ==============================
  // Each piece of form data is stored in React state using useState.
  // This makes all values visible in React Developer Tools.

  const [name, setName]             = useState('');       // Full Name
  const [email, setEmail]           = useState('');       // Email Address
  const [phone, setPhone]           = useState('');       // Phone Number
  const [college, setCollege]       = useState('');       // College / University
  const [position, setPosition]     = useState('');       // Internship Position (dropdown)
  const [experience, setExperience] = useState('');       // Experience Level (radio)
  const [skills, setSkills]         = useState('');       // Skills
  const [message, setMessage]       = useState('');       // Why should we select you?
  const [resume, setResume]         = useState(null);     // Resume file
  const [terms, setTerms]           = useState(false);    // Terms & Conditions checkbox

  // Toast state — controls the toast notification
  const [showToast, setShowToast]     = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  // ==============================
  // 2. EVENT HANDLING — onChange
  // ==============================
  // Each input field uses onChange to update its corresponding state variable.
  // These are simple event handler functions.

  const handleNameChange       = (event) => setName(event.target.value);
  const handleEmailChange      = (event) => setEmail(event.target.value);
  const handlePhoneChange      = (event) => setPhone(event.target.value);
  const handleCollegeChange    = (event) => setCollege(event.target.value);
  const handlePositionChange   = (event) => setPosition(event.target.value);
  const handleExperienceChange = (event) => setExperience(event.target.value);
  const handleSkillsChange     = (event) => setSkills(event.target.value);
  const handleMessageChange    = (event) => setMessage(event.target.value);
  const handleTermsChange      = (event) => setTerms(event.target.checked);

  // File input handler
  const handleResumeChange = (event) => {
    // event.target.files is an array-like object; we take the first file
    const file = event.target.files[0];
    if (file) {
      setResume(file);
    }
  };


  // ==============================
  // 4. VALIDATION using alert()
  // ==============================
  // Simple validation function that checks each required field.
  // Uses JavaScript alert() to notify the user of missing information.

  const validateForm = () => {
    if (!name.trim()) {
      alert('Please enter your full name.');
      return false;
    }
    if (!email.trim()) {
      alert('Please enter your email address.');
      return false;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number.');
      return false;
    }
    if (!college.trim()) {
      alert('Please enter your college or university.');
      return false;
    }
    if (!position) {
      alert('Please select an internship position.');
      return false;
    }
    if (!experience) {
      alert('Please select your experience level.');
      return false;
    }
    if (!message.trim()) {
      alert('Please tell us why we should select you.');
      return false;
    }
    if (!terms) {
      alert('Please accept the Terms & Conditions.');
      return false;
    }
    return true;
  };


  // ==============================
  // 3. event.preventDefault() + 5. TOAST
  // ==============================
  // The form's onSubmit handler.
  // - Calls event.preventDefault() so the page does NOT reload.
  // - Runs validation.
  // - If valid, shows the toast notification using state.

  const handleSubmit = (event) => {
    // Prevent the default form submission (page reload)
    event.preventDefault();

    // Run validation — if invalid, stop here
    if (!validateForm()) {
      return;
    }

    // Form is valid! Show the success toast
    setToastMessage('Application submitted successfully! 🎉');
    setShowToast(true);

    // Log submitted data to the console (for demonstration)
    console.log('Form Submitted:', {
      name,
      email,
      phone,
      college,
      position,
      experience,
      skills,
      message,
      resume: resume ? resume.name : 'No file uploaded',
      terms,
    });

    // Automatically hide the toast after 4 seconds
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 4000);
  };


  // ==============================
  // 6. CLEAR FORM — onClick
  // ==============================
  // Resets all state variables to their initial values.
  // Uses onClick event handling on the Clear Form button.
  // Does NOT reload the page — only updates React state.

  const handleClearForm = (event) => {
    // We don't need preventDefault here since it's a button with type="button",
    // but we include it for demonstration purposes
    event.preventDefault();

    setName('');
    setEmail('');
    setPhone('');
    setCollege('');
    setPosition('');
    setExperience('');
    setSkills('');
    setMessage('');
    setResume(null);
    setTerms(false);
    setShowToast(false);
    setToastMessage('');

    // Reset the file input element manually since file inputs are uncontrolled
    const fileInput = document.getElementById('resume');
    if (fileInput) {
      fileInput.value = '';
    }
  };


  // ==============================
  // JSX — Form UI
  // ==============================

  return (
    <section className="form-section">
      <div className="form-wrapper">

        {/* Form header */}
        <div className="form-header">
          <h2 className="form-header__title">Apply for an Internship</h2>
          <p className="form-header__subtitle">
            Complete the form below to submit your application.
          </p>
        </div>

        {/* 
          The form uses onSubmit={handleSubmit} 
          so that pressing Enter or clicking Apply Now triggers the handler.
        */}
        <form className="application-form" onSubmit={handleSubmit} noValidate>

          {/* Row 1: Full Name & Email */}
          <div className="form-row">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={name}
                onChange={handleNameChange}     /* onChange event handler */
                required
              />
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}    /* onChange event handler */
                required
              />
            </div>
          </div>

          {/* Row 2: Phone & College */}
          <div className="form-row">
            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneChange}    /* onChange event handler */
                required
              />
            </div>

            {/* College / University */}
            <div className="form-group">
              <label htmlFor="college">College / University</label>
              <input
                type="text"
                id="college"
                placeholder="Enter your college or university"
                value={college}
                onChange={handleCollegeChange}  /* onChange event handler */
                required
              />
            </div>
          </div>

          {/* Internship Position — Dropdown */}
          <div className="form-group">
            <label htmlFor="position">Internship Position</label>
            <select
              id="position"
              value={position}
              onChange={handlePositionChange}   /* onChange event handler */
              required
            >
              <option value="" disabled>Select a position</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Software Tester">Software Tester</option>
              <option value="Mobile App Developer">Mobile App Developer</option>
            </select>
          </div>

          {/* Experience Level — Radio Buttons */}
          <div className="form-group">
            <label>Experience Level</label>
            <div className="radio-group" role="radiogroup" aria-label="Experience Level">
              <div className="radio-option">
                <input
                  type="radio"
                  id="beginner"
                  name="experience"
                  value="Beginner"
                  checked={experience === 'Beginner'}
                  onChange={handleExperienceChange}  /* onChange event handler */
                />
                <label htmlFor="beginner">Beginner</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="intermediate"
                  name="experience"
                  value="Intermediate"
                  checked={experience === 'Intermediate'}
                  onChange={handleExperienceChange}  /* onChange event handler */
                />
                <label htmlFor="intermediate">Intermediate</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="advanced"
                  name="experience"
                  value="Advanced"
                  checked={experience === 'Advanced'}
                  onChange={handleExperienceChange}  /* onChange event handler */
                />
                <label htmlFor="advanced">Advanced</label>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              placeholder="e.g. React, Java, Python, Figma"
              value={skills}
              onChange={handleSkillsChange}     /* onChange event handler */
            />
          </div>

          {/* Why should we select you? — Textarea */}
          <div className="form-group">
            <label htmlFor="message">Why should we select you?</label>
            <textarea
              id="message"
              placeholder="Tell us briefly about yourself and why you are interested in this internship..."
              value={message}
              onChange={handleMessageChange}    /* onChange event handler */
              required
            />
          </div>

          <hr className="form-divider" />

          {/* Resume Upload */}
          <div className="form-group">
            <label>Resume</label>
            <div className="file-input-wrapper">
              <div className="file-input-label">
                <span className="file-input-label__icon">📄</span>
                <span className={`file-input-label__text ${resume ? 'file-input-label__text--active' : ''}`}>
                  {resume ? resume.name : 'Upload your resume (PDF, DOC, DOCX)'}
                </span>
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}  /* onChange event handler */
                />
              </div>
              <span className="file-hint">Accepted formats: PDF, DOC, DOCX</span>
            </div>
          </div>

          {/* Terms & Conditions — Checkbox */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={handleTermsChange}      /* onChange event handler */
            />
            <label htmlFor="terms">
              I agree to the <strong>Terms &amp; Conditions</strong> and confirm
              that the information provided is accurate.
            </label>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            {/* 
              Apply Now — type="submit" triggers the form's onSubmit handler.
            */}
            <button type="submit" className="btn btn--primary">
              Apply Now
            </button>

            {/* 
              Clear Form — type="button" prevents form submission.
              Uses onClick to call handleClearForm.
            */}
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleClearForm}        /* onClick event handler */
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* 
        5. TOAST — Conditional Rendering
        The Toast component only renders when showToast is true.
      */}
      <Toast showToast={showToast} toastMessage={toastMessage} />
    </section>
  );
}

export default ApplicationForm;
