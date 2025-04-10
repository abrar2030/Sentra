/**
 * Modern Portfolio - Main JavaScript
 * 
 * This file contains all the interactive functionality for the portfolio website
 * including animations, theme toggling, navigation, and portfolio filtering.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // Preloader
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Variables
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.querySelector('.theme-toggle');
    const backToTop = document.querySelector('.back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioLinks = document.querySelectorAll('.portfolio-link[data-project]');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.querySelector('.modal-body');
    const contactForm = document.getElementById('contactForm');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
        
        // Active nav link based on scroll position
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Mobile Navigation Toggle
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Save theme preference to localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Portfolio Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Project Modal
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const projectId = this.getAttribute('data-project');
            
            // Get project data (in a real project, this would come from a database or JSON file)
            const projectData = getProjectData(projectId);
            
            // Populate modal with project data
            modalBody.innerHTML = `
                <div class="modal-project">
                    <h2 class="modal-project-title">${projectData.title}</h2>
                    <div class="modal-project-img">
                        <img src="${projectData.image}" alt="${projectData.title}">
                    </div>
                    <div class="modal-project-info">
                        <div class="modal-project-tags">
                            ${projectData.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="modal-project-description">
                            ${projectData.description}
                        </div>
                        <div class="modal-project-features">
                            <h3>Key Features</h3>
                            <ul>
                                ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="modal-project-links">
                            <a href="${projectData.github}" class="btn btn-primary" target="_blank">
                                <i class="fab fa-github"></i>
                                <span>View on GitHub</span>
                            </a>
                            ${projectData.demo ? `
                                <a href="${projectData.demo}" class="btn btn-outline" target="_blank">
                                    <i class="fas fa-external-link-alt"></i>
                                    <span>Live Demo</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            // Show modal
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', function() {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    projectModal.addEventListener('click', function(e) {
        if (e.target === this) {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Validate form (simple validation)
            let isValid = true;
            const requiredFields = ['name', 'email', 'subject', 'message'];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!formValues[field].trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // In a real project, you would send this data to a server
            // For demo purposes, we'll just show a success message
            showNotification('Your message has been sent successfully!', 'success');
            
            // Reset form
            this.reset();
        });
    }
    
    // Back to Top button
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Skill animation on scroll
    const skillSections = document.querySelectorAll('.skill-category');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillSections.forEach(section => {
        observer.observe(section);
    });
});

// Helper Functions

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Get project data (mock data for demo purposes)
function getProjectData(projectId) {
    const projects = {
        'project1': {
            title: 'PayNext Payment System',
            image: 'assets/projects/paynext.jpg',
            tags: ['Java', 'Docker', 'Kubernetes', 'AWS', 'Terraform'],
            description: `
                <p>PayNext is a cloud-native, scalable, and automated FinTech payment platform designed to handle high-volume transactions with robust security measures. The system leverages containerization and orchestration technologies to ensure high availability and fault tolerance.</p>
                <p>The architecture follows microservices principles, with separate services for authentication, transaction processing, fraud detection, and reporting. Each service is independently deployable and scalable, communicating through RESTful APIs and message queues.</p>
            `,
            features: [
                'Secure payment processing with end-to-end encryption',
                'Real-time transaction monitoring and fraud detection',
                'Auto-scaling infrastructure based on transaction volume',
                'Multi-region deployment for disaster recovery',
                'Comprehensive audit logging and compliance reporting'
            ],
            github: 'https://github.com/abrar2030/PayNext',
            demo: null
        },
        'project2': {
            title: 'FinovaBank Platform',
            image: 'assets/projects/finovabank.jpg',
            tags: ['Java', 'JavaScript', 'GitHub Actions', 'Terraform', 'Ansible'],
            description: `
                <p>FinovaBank is a secure and scalable digital banking platform designed for modern financial services. It provides a comprehensive suite of banking functionalities including account management, fund transfers, bill payments, and financial analytics.</p>
                <p>The platform implements a layered security architecture with multi-factor authentication, transaction monitoring, and anomaly detection. The infrastructure is deployed using Infrastructure as Code (IaC) principles with Terraform and configured using Ansible for consistent environments.</p>
            `,
            features: [
                'Secure user authentication with biometric options',
                'Real-time transaction processing and notifications',
                'Automated CI/CD pipeline with security scanning',
                'Comprehensive financial analytics dashboard',
                'Integration with third-party payment processors'
            ],
            github: 'https://github.com/abrar2030/FinovaBank',
            demo: null
        },
        'project3': {
            title: 'BlockGuardian Fraud Detection',
            image: 'assets/projects/blockguardian.jpg',
            tags: ['Solidity', 'React.js', 'TensorFlow', 'FastAPI', 'PostgreSQL'],
            description: `
                <p>BlockGuardian is a blockchain-based fraud detection system for DeFi transactions using smart contracts. It leverages machine learning algorithms to identify suspicious patterns and anomalies in transaction data, providing real-time alerts and preventive measures.</p>
                <p>The system combines on-chain and off-chain data analysis to create a comprehensive view of transaction patterns. Smart contracts implement automated risk scoring and transaction verification, while the machine learning models continuously improve through feedback loops.</p>
            `,
            features: [
                'Real-time transaction monitoring and risk assessment',
                'Machine learning models for anomaly detection',
                'Smart contract-based transaction verification',
                'Decentralized alert system for suspicious activities',
                'Comprehensive dashboard for security analytics'
            ],
            github: 'https://github.com/abrar2030/BlockGuardian',
            demo: null
        },
        'project4': {
            title: 'BlockScore Credit Scoring',
            image: 'assets/projects/blockscore.jpg',
            tags: ['Solidity', 'Node.js', 'XGBoost', 'React.js', 'MongoDB'],
            description: `
                <p>BlockScore is an AI-driven credit scoring platform using on-chain financial behavior analysis. It creates a decentralized credit scoring system that leverages blockchain data to assess creditworthiness without relying on traditional credit bureaus.</p>
                <p>The platform analyzes wallet activity, loan repayment history, and other on-chain metrics to generate a comprehensive credit profile. Machine learning algorithms process this data to create accurate risk assessments that can be used by DeFi lending protocols.</p>
            `,
            features: [
                'Privacy-preserving credit scoring using zero-knowledge proofs',
                'Multi-chain data aggregation for comprehensive analysis',
                'Machine learning models optimized for blockchain data',
                'Decentralized identity verification',
                'Integration with major DeFi lending platforms'
            ],
            github: 'https://github.com/abrar2030/BlockScore',
            demo: null
        },
        'project5': {
            title: 'CarbonXchange Marketplace',
            image: 'assets/projects/carbonxchange.jpg',
            tags: ['Solidity', 'Flask', 'LSTM', 'PostgreSQL', 'Web3.js'],
            description: `
                <p>CarbonXchange is a carbon credit trading platform with fractional ownership capabilities. It enables businesses and individuals to buy, sell, and trade carbon credits on a transparent and efficient marketplace powered by blockchain technology.</p>
                <p>The platform implements tokenization of carbon credits, allowing for fractional ownership and improved liquidity. Smart contracts ensure the integrity of transactions and automate the verification process, while the underlying blockchain provides an immutable record of all trades.</p>
            `,
            features: [
                'Tokenized carbon credits with fractional ownership',
                'Automated verification of carbon offset projects',
                'Real-time pricing based on market demand',
                'Integration with carbon offset registries',
                'Transparent tracking of carbon credit lifecycle'
            ],
            github: 'https://github.com/abrar2030/CarbonXchange',
            demo: null
        },
        'project6': {
            title: 'LendSmart Micro Lending',
            image: 'assets/projects/lendsmart.jpg',
            tags: ['Solidity', 'Flask', 'MongoDB', 'React.js', 'IPFS'],
            description: `
                <p>LendSmart is a decentralized lending protocol with automated collateral management. It facilitates peer-to-peer lending with flexible terms and automated risk management through smart contracts.</p>
                <p>The protocol implements dynamic interest rates based on market conditions and borrower risk profiles. Collateral management is fully automated, with liquidation processes triggered by predefined thresholds to protect lenders while providing fair treatment to borrowers.</p>
            `,
            features: [
                'Automated collateral management and liquidation',
                'Risk-based interest rate determination',
                'Multi-collateral lending options',
                'Decentralized governance for protocol parameters',
                'Integration with major DeFi protocols for yield optimization'
            ],
            github: 'https://github.com/abrar2030/LendSmart',
            demo: null
        }
    };
    
    return projects[projectId] || {
        title: 'Project Details',
        image: 'assets/projects/default.jpg',
        tags: ['Unknown'],
        description: '<p>Project details not found.</p>',
        features: ['No features available'],
        github: '#',
        demo: null
    };
}
