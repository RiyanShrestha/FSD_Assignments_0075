// Toggle menu on mobile
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when link is clicked
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Toggle content visibility
function toggleContent(button) {
    const content = button.nextElementSibling;
    const isActive = content.classList.contains('active');
    
    // Close all other open items
    document.querySelectorAll('.toggle-content.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        content.classList.add('active');
        button.textContent = button.textContent.replace('+ ', '- ');
    } else {
        button.textContent = button.textContent.replace('- ', '+ ');
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    
    // Simulate form submission
    formMessage.textContent = 'Sending message...';
    formMessage.className = 'form-message';
    
    setTimeout(() => {
        formMessage.textContent = '✓ Message sent successfully!';
        formMessage.className = 'form-message success';
        form.reset();
        
        // Clear message after 3 seconds
        setTimeout(() => {
            formMessage.textContent = '';
        }, 3000);
    }, 800);
}