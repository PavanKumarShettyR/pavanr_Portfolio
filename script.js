// Wait for DOM to completely load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation and Scroll Handling
    setupNavigation();
    
    // Dark Mode Toggle
    setupDarkMode();
    
    // Projects Slider
    setupProjectsSlider();
    
    // Skills Animation
    setupSkillsAnimation();
    
    // Form Submission
    setupContactForm();

    // Projects Gallery Modal
    setupGalleryModal();
    
    // Testimonials Slider
    setupTestimonialsSlider();
    
    // Download Resume Analytics
    trackResumeDownload();
});

// Navigation and Scroll Handling
function setupNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Shrink navigation on scroll
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            nav.style.padding = '0.8rem var(--space-md)';
        } else {
            nav.style.padding = '1.5rem var(--space-md)';
        }
    });
}

// Dark Mode Toggle
function setupDarkMode() {
    const themeToggleBtn = document.querySelector('.theme-switch');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// Projects Slider
function setupProjectsSlider() {
    const projectsContainer = document.querySelector('.projects-slider');
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!projectsContainer || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const cardWidth = projectCards[0].offsetWidth + parseInt(window.getComputedStyle(projectCards[0]).marginRight);
    const maxIndex = Math.max(0, projectCards.length - Math.floor(projectsContainer.offsetWidth / cardWidth));
    
    // Create dots for each card
    projectCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dot');
    
    // Set up button handlers
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            // Wrap around to beginning
            goToSlide(0);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            // Wrap around to end
            goToSlide(maxIndex);
        }
    });
    
    // Function to move to a specific slide
    function goToSlide(index) {
        const slideAmount = -1 * index * cardWidth;
        projectsContainer.style.transform = `translateX(${slideAmount}px)`;
        projectsContainer.style.transition = 'transform 0.5s ease-in-out';
        
        // Update current index
        currentIndex = index;
        
        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newCardWidth = projectCards[0].offsetWidth + parseInt(window.getComputedStyle(projectCards[0]).marginRight);
        const newMaxIndex = Math.max(0, projectCards.length - Math.floor(projectsContainer.offsetWidth / newCardWidth));
        
        if (currentIndex > newMaxIndex) {
            goToSlide(newMaxIndex);
        }
    });
}

// Skills Animation
function setupSkillsAnimation() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    if (skillLevels.length === 0) return;

    // Initialize with zero width
    skillLevels.forEach(skill => {
        skill.style.width = '0%';
    });

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to animate skills when in viewport
    function animateSkills() {
        skillLevels.forEach(skill => {
            if (isInViewport(skill.parentElement)) {
                const targetWidth = skill.style.width || skill.getAttribute('style').match(/width:\s*(\d+)%/)[1] + '%';
                skill.style.width = targetWidth;
            }
        });
    }
    
    // Check on load and scroll
    window.addEventListener('load', animateSkills);
    window.addEventListener('scroll', animateSkills);
}

// Projects Gallery Modal
function setupGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalFeatures = document.getElementById('modal-features');
    const body = document.body;
    
    if (!modal) return;
    
    // Project details data
    const projectDetails = {
        '2x2x2': {
            title: '2x2x2 Team Management',
            image: 'images/2x2x2_dashboard.png',
            description: 'Reduced time to collect and report the 2by2by2 updates. Approx. 2 hours saved from PMO efforts per week. Approx. 30 mins saved from the team members providing updates per week. Standardized recording and reporting of updates need less reconciliation and modification efforts. Easy follow ups when required. No loss of information per week basis.',
            technologies: ['Power Apps', 'SharePoint', 'Power Automate'],
            features: [
                'Hierarchical team visualization',
                'Role-based access control',
                'Scalable for large teams',
                'Automated data collection'
            ]
        },
        'skillmatrix': {
            title: 'Skillmatrix Dashboard',
            image: 'images/skillMatrix_addNew.png',
            description: 'A skill management solution for large teams with both contractors and staff. Provides leaders with high visibility on existing capabilities and future learning to enable better decision-making for resource utilization.',
            technologies: ['Power Apps', 'Power BI', 'Dataverse', 'SharePoint'],
            features: [
                'Skill assessment and tracking',
                'Gap analysis visualization',
                'Resource allocation insights',
                'Team capability heat map'
            ]
        },
        'awards-portal': {
            title: 'Shell.ai Awards Portal',
            image: 'images/shellAiAwardsPortal.png',
            description: 'Award nomination portal for one of Shell\'s largest annual events. Delivered a zero-error app in just 2 weeks, enabling seamless nomination entry, modification, and submission across the organization.',
            technologies: ['Power Apps', 'Power Automate', 'SharePoint', 'Outlook Integration'],
            features: [
                'Nomination workflow with approval stages',
                'Category-based judging system',
                'Automated notifications',
                'Real-time analytics dashboard',
                'Export and reporting capabilities'
            ]
        },
        'swag-idea': {
            title: 'SWAG Idea Portal',
            image: 'images/swagIdeasPortal.png',
            description: 'Idea management portal for the SWAG team (Service Now, Automation, and Workday). A weekend project, it provides a platform to add, motivate, and manage team ideas in a single application.',
            technologies: ['Power Apps', 'Power Automate', 'Outlook'],
            features: [
                'Idea submission form',
                'Voting and feedback system',
                'Categorization and tagging',
                'Implementation status tracking',
                'TRB discussion on further stages of implementation'
            ]
        },
        'slim': {
            title: 'SLiM Assessment App',
            image: 'images/slimReview.png',
            description: 'Full lifecycle management for Software License Management reviews, replacing an email-based, untrackable process. Features a modern UI and timeline functionality to track the entire review cycle with the IRM team.',
            technologies: ['Power Apps', 'Power Automate', 'SharePoint', 'Outlook'],
            features: [
                'Software license review workflow',
                'Timeline visualization of process stages',
                'Document management and version control',
                'Automated compliance checks'
            ]
        },
        'components-tracker': {
            title: 'Reusable Components Tracker',
            image: 'images/reusableCompTracker_teamsNot.png',
            description: 'Power Automate flow that converts raw XML from Blue Prism to SharePoint list data with email and Microsoft Teams notifications. Provides visibility on developer efforts and reusable components.',
            technologies: ['Power Automate', 'SharePoint', 'Microsoft Teams'],
            features: [
                'Automated XML parsing and data extraction',
                'Component categorization and tagging',
                'Usage analytics and tracking',
                'Developer contribution metrics',
                'Notification system for new components'
            ]
        }
    };
    
    // Open modal with project details
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectDetails[projectId];
            
            if (project) {
                // Set modal content
                modalTitle.textContent = project.title;
                modalImage.src = project.image;
                modalImage.alt = project.title;
                modalDescription.textContent = project.description;
                
                // Clear and populate technologies
                modalTechnologies.innerHTML = '';
                project.technologies.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    modalTechnologies.appendChild(span);
                });
                
                // Clear and populate features
                modalFeatures.innerHTML = '';
                project.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    modalFeatures.appendChild(li);
                });
                
                // Show modal with animation
                modal.style.display = 'block';
                setTimeout(() => {
                    modal.classList.add('show');
                    body.style.overflow = 'hidden'; // Prevent background scrolling
                }, 10);
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', closeModal);
    
    // Close modal if clicked outside of modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            body.style.overflow = ''; // Re-enable scrolling
        }, 300);
    }
}

// Testimonials Slider
function setupTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!testimonialCards.length) return;
    
    let currentIndex = 0;
    const totalTestimonials = testimonialCards.length;
    
    // Create dots for each testimonial
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.testimonial-dots .slider-dot');
    
    // Set up button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? totalTestimonials - 1 : currentIndex - 1;
            showTestimonial(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = currentIndex === totalTestimonials - 1 ? 0 : currentIndex + 1;
            showTestimonial(newIndex);
        });
    }
    
    // Function to show a specific testimonial
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Show the selected testimonial
        testimonialCards[index].classList.add('active');
        
        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Remove auto-rotation - only manual navigation is enabled
}

// Track Resume Downloads
function trackResumeDownload() {
    const downloadBtn = document.querySelector('.cta-download');
    
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function(e) {
        // In a real implementation, you would track this event using analytics
        console.log('Resume downloaded at:', new Date().toString());
        
        // You could also show a thank you message
        const thankYouMessage = document.createElement('div');
        thankYouMessage.classList.add('download-message');
        thankYouMessage.textContent = 'Thank you for downloading my resume!';
        thankYouMessage.style.position = 'fixed';
        thankYouMessage.style.bottom = '20px';
        thankYouMessage.style.right = '20px';
        thankYouMessage.style.backgroundColor = 'var(--success-color)';
        thankYouMessage.style.color = 'white';
        thankYouMessage.style.padding = '10px 20px';
        thankYouMessage.style.borderRadius = '5px';
        thankYouMessage.style.zIndex = '9999';
        thankYouMessage.style.boxShadow = 'var(--shadow-md)';
        thankYouMessage.style.opacity = '0';
        thankYouMessage.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(thankYouMessage);
        
        setTimeout(() => {
            thankYouMessage.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            thankYouMessage.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(thankYouMessage);
            }, 300);
        }, 3000);
    });
}

// Contact Form
function setupContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameField = form.querySelector('#name');
        const emailField = form.querySelector('#email');
        const subjectField = form.querySelector('#subject');
        const messageField = form.querySelector('#message');
        
        // Simple validation
        let valid = true;
        
        if (!nameField.value.trim()) {
            highlightField(nameField, true);
            valid = false;
        } else {
            highlightField(nameField, false);
        }
        
        if (!emailField.value.trim() || !isValidEmail(emailField.value)) {
            highlightField(emailField, true);
            valid = false;
        } else {
            highlightField(emailField, false);
        }
        
        if (!subjectField.value.trim()) {
            highlightField(subjectField, true);
            valid = false;
        } else {
            highlightField(subjectField, false);
        }
        
        if (!messageField.value.trim()) {
            highlightField(messageField, true);
            valid = false;
        } else {
            highlightField(messageField, false);
        }
        
        if (valid) {
            // In a real implementation, you would send the form data to a server
            // For now, we'll just show a success message
            showSubmissionStatus('success', 'Thank you for your message! I will get back to you soon.');
            form.reset();
        } else {
            showSubmissionStatus('error', 'Please fill in all required fields correctly.');
        }
    });
    
    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Helper function to highlight fields with errors
    function highlightField(field, isError) {
        if (isError) {
            field.style.borderColor = 'var(--warning-color)';
        } else {
            field.style.borderColor = 'var(--border-color)';
        }
    }
    
    // Helper function to show submission status
    function showSubmissionStatus(type, message) {
        // Remove any existing status message
        const existingStatus = document.querySelector('.submission-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Create new status element
        const statusElement = document.createElement('div');
        statusElement.classList.add('submission-status', type);
        statusElement.textContent = message;
        
        form.appendChild(statusElement);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            statusElement.classList.add('fade-out');
            setTimeout(() => {
                statusElement.remove();
            }, 500);
        }, 5000);
    }
}

// Add some animations and effects to make the portal more interactive
function addEnhancedVisualEffects() {
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        const scrollPosition = window.scrollY;
        
        if (hero) {
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });
    
    // Add animation for highlight cards
    const highlightCards = document.querySelectorAll('.highlight-card');
    
    highlightCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.highlight-icon');
            
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.highlight-icon');
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Call the enhanced visuals function
addEnhancedVisualEffects();