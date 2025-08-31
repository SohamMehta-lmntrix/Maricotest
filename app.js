// Saffola Nutripower - Mobile-First Interactive Website
// Global variables
let currentSlide = 0;
let autoSlideInterval;
let assistantOpen = false;
let touchStartX = 0;
let touchEndX = 0;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🥜 Saffola Nutripower website initializing...');
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    setupNavigation();
    initializeCarousel();
    setupScrollEffects();
    initializeBenefits();
    initializeRecipeFilters();
    setupAssistant();
    initializeFloatingActions();
    initializeProductButtons();
    initializeNutritionCalculator();
    setupTouchInteractions();
    optimizeImages();
    
    console.log('✅ Saffola Nutripower website ready for mobile & desktop!');
}

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (navToggle) navToggle.classList.remove('active');
        });
    });
    
    // Update nav on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateActiveNav);
    });
}

function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = window.innerWidth >= 768 ? 80 : 70; // Mobile vs desktop nav height
        const targetPosition = section.offsetTop - navHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        console.log('Scrolled to:', sectionId);
    } else {
        console.warn('Section not found:', sectionId);
    }
}

function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 120;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
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
}

// ============================================================================
// CAROUSEL FUNCTIONS (Mobile-Optimized)
// ============================================================================

function initializeCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (!carouselTrack || !dots.length) return;
    
    // Set up dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Start auto-rotation (longer intervals on mobile)
    const autoSlideDelay = window.innerWidth <= 768 ? 5000 : 4000;
    startAutoSlide(autoSlideDelay);
    
    // Pause on hover (desktop) or touch (mobile)
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', () => startAutoSlide(autoSlideDelay));
        
        // Touch/swipe support for mobile
        carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - previous slide
            const prevSlide = (currentSlide - 1 + 3) % 3;
            goToSlide(prevSlide);
        } else {
            // Swipe left - next slide
            const nextSlide = (currentSlide + 1) % 3;
            goToSlide(nextSlide);
        }
    }
}

function goToSlide(slideIndex) {
    const carouselTrack = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    
    if (!carouselTrack || !slides.length) return;
    
    currentSlide = slideIndex;
    
    // Move carousel with CSS transform
    const slideWidth = 100;
    carouselTrack.style.transform = `translateX(-${slideIndex * slideWidth}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
    
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideIndex);
    });
}

function startAutoSlide(delay = 4000) {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        const nextSlide = (currentSlide + 1) % 3;
        goToSlide(nextSlide);
    }, delay);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// ============================================================================
// PRODUCT FUNCTIONS
// ============================================================================

function initializeProductButtons() {
    const productBtns = document.querySelectorAll('.btn-product');
    productBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard?.getAttribute('data-product');
            if (productId) {
                showProductDetails(productId);
            }
        });
    });
    console.log('✅ Product buttons initialized');
}

function showProductDetails(productId) {
    console.log('Showing product details for:', productId);
    const productInfo = {
        paste: {
            title: 'Saffola Nutripower Paste',
            description: 'Perfect spreadable consistency for breads, rotis, and morning meals. Rich in healthy fats and natural nutrition from premium dry fruits.',
            features: [
                'Smooth texture perfect for spreading',
                'Rich source of healthy fats from nuts',
                'Great for breakfast and snacks',
                'No artificial preservatives',
                'Family-friendly portion size (400g)'
            ],
            usage: [
                'Spread on bread, roti, or crackers',
                'Mix with warm water for instant drink',
                'Add to smoothies for extra nutrition',
                'Use in baking recipes'
            ]
        },
        powder: {
            title: 'Saffola Nutripower Mixture',
            description: 'Premium powder blend that mixes instantly with milk, water, or smoothies. High protein content (12g per serving) for active lifestyles.',
            features: [
                'Instant mixing formula',
                '12g protein per serving',
                'Easy to digest',
                'Versatile usage options',
                'Concentrated nutrition (200g pack)'
            ],
            usage: [
                'Mix with milk for protein drink',
                'Add to smoothies and shakes',
                'Sprinkle on cereals and yogurt',
                'Use in healthy baking'
            ]
        },
        mix: {
            title: 'Saffola Nutripower Dry Fruit Mix',
            description: 'Ready-to-eat crunchy blend perfect for snacking. Natural energy boost with premium quality dry fruits and nuts.',
            features: [
                'Ready to eat convenience',
                'Crunchy satisfying texture',
                'Portable snacking option (150g)',
                'Natural energy source',
                'Premium quality ingredients'
            ],
            usage: [
                'Direct snacking anytime',
                'Add to trail mixes',
                'Top for yogurt and cereals',
                'Office and travel snacking'
            ]
        }
    };
    
    const product = productInfo[productId];
    if (product) {
        showProductModal(product);
    }
}

function showProductModal(product) {
    const modalHTML = `
        <div class="product-modal" id="productModal" onclick="closeProductModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${product.title}</h3>
                    <button class="modal-close" onclick="closeProductModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-section">
                        <h4>Key Features:</h4>
                        <ul class="product-list">
                            ${product.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="product-section">
                        <h4>How to Use:</h4>
                        <ul class="product-list">
                            ${product.usage.map(use => `<li>• ${use}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="scrollToBuy(); closeProductModal();">Buy Now</button>
                        <button class="btn-secondary" onclick="closeProductModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeProductModal(event) {
    // Close only if clicking outside modal content or on close button
    if (!event || event.target.classList.contains('product-modal') || event.target.classList.contains('modal-close')) {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = ''; // Restore scroll
        }
    }
}

// ============================================================================
// NUTRITION CALCULATOR
// ============================================================================

function initializeNutritionCalculator() {
    const calculateBtn = document.querySelector('.nutrition-calculator .btn-primary');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateNutrition);
    }
}

function calculateNutrition() {
    const age = parseInt(document.getElementById('age').value) || 25;
    const activity = document.getElementById('activity').value || 'moderate';
    
    // Calculate recommendations based on age and activity
    let proteinNeed, calorieNeed, servings, dailyBenefit;
    
    if (age < 18) {
        proteinNeed = 45;
        calorieNeed = 2000;
    } else if (age < 50) {
        proteinNeed = activity === 'high' ? 65 : activity === 'moderate' ? 55 : 50;
        calorieNeed = activity === 'high' ? 2400 : activity === 'moderate' ? 2200 : 2000;
    } else {
        proteinNeed = activity === 'high' ? 60 : activity === 'moderate' ? 50 : 45;
        calorieNeed = activity === 'high' ? 2200 : activity === 'moderate' ? 2000 : 1800;
    }
    
    servings = Math.ceil(proteinNeed / 12); // 12g protein per serving
    dailyBenefit = Math.round((12 / proteinNeed) * 100);
    
    const recommendationsHTML = `
        <div class="recommendation-item">
            <h5>Recommended Servings</h5>
            <div class="recommendation-value">${servings} per day</div>
        </div>
        <div class="recommendation-item">
            <h5>Protein Coverage</h5>
            <div class="recommendation-value">${dailyBenefit}%</div>
        </div>
        <div class="recommendation-item">
            <h5>Best Times</h5>
            <div class="recommendation-value">Breakfast & Evening</div>
        </div>
        <div class="recommendation-item">
            <h5>Ideal Variant</h5>
            <div class="recommendation-value">${activity === 'high' ? 'Powder' : age < 18 ? 'Paste' : 'Mix'}</div>
        </div>
    `;
    
    const resultDiv = document.getElementById('calculatorResult');
    const recommendationsDiv = document.getElementById('nutritionRecommendations');
    
    if (recommendationsDiv) {
        recommendationsDiv.innerHTML = recommendationsHTML;
    }
    
    if (resultDiv) {
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ============================================================================
// AVAILABILITY CHECKER
// ============================================================================

function checkAvailability() {
    const pincode = document.getElementById('pincode').value;
    const resultDiv = document.getElementById('availabilityResult');
    
    if (!pincode || pincode.length !== 6) {
        resultDiv.innerHTML = '<p style="color: var(--saffola-red);">Please enter a valid 6-digit pincode.</p>';
        resultDiv.classList.remove('hidden');
        return;
    }
    
    // Simulate availability check (in real app, this would be an API call)
    const availablePlatforms = [
        'Blinkit', 'Zepto', 'Swiggy Instamart', 'BigBasket',
        'Amazon', 'Flipkart', 'Apollo Pharmacy', 'Netmeds'
    ];
    
    const availableCount = Math.floor(Math.random() * 3) + 6; // 6-8 platforms
    const selectedPlatforms = availablePlatforms.slice(0, availableCount);
    
    const resultHTML = `
        <h4 style="color: var(--success-green); margin-bottom: 1rem;">
            ✅ Great news! Saffola Nutripower is available in your area (${pincode})
        </h4>
        <p><strong>Available on ${availableCount} platforms:</strong></p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; margin-top: 1rem;">
            ${selectedPlatforms.map(platform => 
                `<span style="background: var(--success-green); color: white; padding: 0.5rem; border-radius: 8px; text-align: center; font-size: 0.875rem;">${platform}</span>`
            ).join('')}
        </div>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-medium);">
            Delivery times may vary by platform and location. Quick commerce options available for 10-30 minute delivery.
        </p>
    `;
    
    resultDiv.innerHTML = resultHTML;
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================================================
// BENEFITS SECTION
// ============================================================================

function initializeBenefits() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    // Add click interactions for benefit cards on mobile
    benefitCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle animation feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// ============================================================================
// RECIPE FILTERS
// ============================================================================

function initializeRecipeFilters() {
    // Recipe category navigation could be added here
    // For now, we'll add smooth scrolling between recipe categories
    const recipeCategories = document.querySelectorAll('.recipe-category');
    
    recipeCategories.forEach(category => {
        const cards = category.querySelectorAll('.recipe-card');
        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.classList.contains('recipe-link')) {
                    e.preventDefault();
                    // Could add modal for recipe details or redirect to video
                    console.log('Recipe video would open here');
                }
            });
        });
    });
}

// ============================================================================
// NUTRITION ASSISTANT (Mobile-Optimized)
// ============================================================================

function setupAssistant() {
    const assistantToggle = document.querySelector('.assistant-toggle');
    const assistantChat = document.getElementById('assistantChat');
    const chatInput = document.getElementById('chatInput');
    
    if (assistantToggle) {
        assistantToggle.addEventListener('click', toggleAssistant);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
        
        // Prevent zoom on iOS when focusing input
        chatInput.addEventListener('focus', function() {
            if (window.innerWidth <= 768) {
                this.style.fontSize = '16px';
            }
        });
    }
}

function toggleAssistant() {
    const assistantChat = document.getElementById('assistantChat');
    if (assistantChat) {
        assistantOpen = !assistantOpen;
        assistantChat.classList.toggle('hidden', !assistantOpen);
        
        if (assistantOpen) {
            // Adjust position on mobile
            if (window.innerWidth <= 768) {
                assistantChat.style.bottom = '5rem';
                assistantChat.style.left = '0.5rem';
                assistantChat.style.right = '0.5rem';
                assistantChat.style.width = 'auto';
            }
            
            // Focus input on open
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                setTimeout(() => chatInput.focus(), 300);
            }
        }
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const userMessage = chatInput.value.trim();
    
    if (!userMessage) return;
    
    // Add user message
    addChatMessage(userMessage, 'user');
    chatInput.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const botResponse = generateBotResponse(userMessage);
        addChatMessage(botResponse, 'bot');
    }, 500 + Math.random() * 1000); // Random delay for realism
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! I'm your Saffola Nutripower nutrition expert. I can help you with product information, recipes, and nutrition advice. What would you like to know?";
    }
    
    // Product questions
    if (message.includes('paste')) {
        return "Nutripower Paste is perfect for spreading on bread and rotis! It's smooth, rich in healthy fats, and great for family breakfasts. Would you like to know about its nutritional benefits?";
    }
    if (message.includes('powder') || message.includes('mixture')) {
        return "Nutripower Powder is our most popular variant! Mix it with milk for a protein-rich drink (12g per serving). It's perfect for smoothies, shakes, and active lifestyles.";
    }
    if (message.includes('mix') || message.includes('snack')) {
        return "Nutripower Mix is ready-to-eat and perfect for snacking! Crunchy, portable, and gives you natural energy. Great for office, travel, or anytime snacking.";
    }
    
    // Nutrition questions
    if (message.includes('protein')) {
        return "All Nutripower variants provide 12g of high-quality protein per serving! This covers about 20-25% of your daily protein needs and helps with muscle health and satiety.";
    }
    if (message.includes('benefits') || message.includes('nutrition')) {
        return "Nutripower is rich in Omega-3 fatty acids, high protein (12g), natural fiber, essential minerals, and antioxidants. Plus, it has zero preservatives - just pure natural nutrition!";
    }
    if (message.includes('omega')) {
        return "Yes! Nutripower is rich in Omega-3 from walnuts and almonds. These support brain health, improve cognitive function, and are great for heart health too.";
    }
    
    // Recipe questions
    if (message.includes('recipe') || message.includes('cook')) {
        return "I have lots of recipe ideas! Try energy ladoos, smoothie bowls, protein pancakes, or healthy cookies. Check our recipes section for step-by-step ideas!";
    }
    if (message.includes('breakfast')) {
        return "For breakfast, try: Nutripower smoothie bowl, protein pancakes, overnight oats with paste, or simply mix powder with milk. All are quick, nutritious, and delicious!";
    }
    
    // Usage questions
    if (message.includes('how to use') || message.includes('serving')) {
        return "Use 20-30g (2-3 tbsp) per serving. Paste: spread on bread/roti. Powder: mix with 200ml milk. Mix: eat directly or add to yogurt/cereals. Start with smaller amounts for children.";
    }
    if (message.includes('children') || message.includes('kids')) {
        return "Nutripower is perfect for growing children! Start with 1-2 tbsp servings. The paste is great for picky eaters, and powder makes milk more appealing. All variants support healthy growth.";
    }
    
    // Buying questions
    if (message.includes('buy') || message.includes('where') || message.includes('price')) {
        return "You can buy Nutripower on Blinkit, Zepto, Swiggy Instamart, BigBasket for quick delivery. Also available on Amazon, Flipkart, and top pharmacies. Available in 3 convenient variants!";
    }
    
    // Health questions
    if (message.includes('weight loss') || message.includes('diet')) {
        return "Nutripower supports weight management with high protein (increases satiety) and healthy fats. Use powder in smoothies, paste instead of regular spreads, or mix as a healthy snack.";
    }
    if (message.includes('diabetes') || message.includes('sugar')) {
        return "Nutripower has no added sugars - sweetness comes naturally from dates. However, for diabetes management, please consult your doctor about portion sizes and how it fits your meal plan.";
    }
    
    // Age-specific questions
    if (message.includes('elderly') || message.includes('senior')) {
        return "Great for seniors! Easy to digest, provides essential nutrients for bone health (calcium, magnesium), and the paste form is gentle on teeth. Perfect for maintaining strength and energy.";
    }
    
    // Storage and safety
    if (message.includes('storage') || message.includes('expire')) {
        return "Store in a cool, dry place. After opening, refrigerate and use within 2-3 months. Always use a clean, dry spoon. Check the packaging for exact expiry dates.";
    }
    
    // Comparison questions
    if (message.includes('difference') || message.includes('which one')) {
        return "Choose based on convenience: Paste for spreading, Powder for drinks, Mix for snacking. All have same nutritional benefits! Paste is great for families, Powder for active people, Mix for on-the-go.";
    }
    
    // Mobile-specific questions
    if (message.includes('mobile') || message.includes('app')) {
        return "This website is fully mobile-optimized! You can browse products, use the nutrition calculator, check availability, and even chat with me on any device. Works great on mobile!";
    }
    
    // Default helpful response
    return "That's a great question! Nutripower provides complete nutrition with premium dry fruits. For specific health advice, consult a nutritionist. Would you like to know about our products, recipes, or nutritional benefits?";
}

// ============================================================================
// FLOATING ACTIONS
// ============================================================================

function initializeFloatingActions() {
    // Show/hide floating actions based on scroll
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(() => {
            const floatingActions = document.querySelector('.floating-actions');
            if (floatingActions) {
                if (window.pageYOffset > 300) {
                    floatingActions.style.opacity = '1';
                    floatingActions.style.transform = 'translateY(0)';
                } else {
                    floatingActions.style.opacity = '0';
                    floatingActions.style.transform = 'translateY(20px)';
                }
            }
        }, 10); // Throttle scroll events
    });
}

function openLiveChat() {
    console.log('Opening live chat...');
    // Open nutrition assistant
    if (!assistantOpen) {
        toggleAssistant();
    }
    
    // Add a welcome message for live chat
    setTimeout(() => {
        addChatMessage("Hi! I'm here to help you with any questions about Saffola Nutripower. Ask me about products, nutrition, recipes, or anything else!", 'bot');
    }, 500);
}

// ============================================================================
// TOUCH INTERACTIONS & MOBILE OPTIMIZATIONS
// ============================================================================

function setupTouchInteractions() {
    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-product, .platform-card');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
        
        // Add ripple effect on click
        button.addEventListener('click', createRippleEffect);
    });
    
    // Prevent double-tap zoom on buttons
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ============================================================================
// SCROLL FUNCTIONS
// ============================================================================

function scrollToProducts() {
    console.log('Scrolling to products section');
    scrollToSection('products');
}

function scrollToBuy() {
    console.log('Scrolling to buy section');
    scrollToSection('buy');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================================================
// BUY NOW PLATFORM FUNCTIONS
// ============================================================================

function fallbackToBlinkit() {
    // In a real app, these would open the respective apps or websites
    console.log('Opening Blinkit...');
    window.open('https://blinkit.com/s/?q=saffola%20nutripower', '_blank');
}

function fallbackToZepto() {
    console.log('Opening Zepto...');
    window.open('https://www.zeptonow.com/search?query=saffola%20nutripower', '_blank');
}

function fallbackToInstamart() {
    console.log('Opening Swiggy Instamart...');
    window.open('https://www.swiggy.com/instamart/search?custom_back=true&query=saffola%20nutripower', '_blank');
}

function fallbackToBigBasket() {
    console.log('Opening BigBasket...');
    window.open('https://www.bigbasket.com/ps/?q=saffola%20nutripower', '_blank');
}

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

function optimizeImages() {
    // Lazy load images when they come into view
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
                
                // Add fade-in effect
                img.style.opacity = '0';
                img.onload = function() {
                    this.style.transition = 'opacity 0.3s ease';
                    this.style.opacity = '1';
                };
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.1
    });
    
    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Also observe regular images for fade-in effect
    document.querySelectorAll('img:not([data-src])').forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.onload = function() {
                this.style.transition = 'opacity 0.3s ease';
                this.style.opacity = '1';
            };
        }
    });
}

// ============================================================================
// KEYBOARD NAVIGATION SUPPORT
// ============================================================================

document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        if (assistantOpen) {
            toggleAssistant();
        }
        const productModal = document.querySelector('.product-modal');
        if (productModal) {
            closeProductModal();
        }
    }
    
    // Navigation with arrow keys in carousel
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const carouselContainer = document.querySelector('.carousel-container');
        const isCarouselVisible = carouselContainer && isElementInViewport(carouselContainer);
        
        if (isCarouselVisible) {
            e.preventDefault();
            const direction = e.key === 'ArrowLeft' ? -1 : 1;
            const newSlide = (currentSlide + direction + 3) % 3;
            goToSlide(newSlide);
        }
    }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// RESPONSIVE BEHAVIOR
// ============================================================================

// Handle orientation change
window.addEventListener('orientationchange', function() {
    // Wait for orientation change to complete
    setTimeout(() => {
        // Recalculate carousel if needed
        if (currentSlide !== undefined) {
            goToSlide(currentSlide);
        }
        
        // Adjust assistant chat position
        const assistantChat = document.getElementById('assistantChat');
        if (assistantChat && assistantOpen) {
            if (window.innerWidth <= 768) {
                assistantChat.style.left = '0.5rem';
                assistantChat.style.right = '0.5rem';
                assistantChat.style.width = 'auto';
            } else {
                assistantChat.style.left = '2rem';
                assistantChat.style.right = 'auto';
                assistantChat.style.width = '350px';
            }
        }
    }, 100);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate carousel position
        if (currentSlide !== undefined) {
            goToSlide(currentSlide);
        }
        
        // Update auto-slide interval based on screen size
        const newDelay = window.innerWidth <= 768 ? 5000 : 4000;
        if (autoSlideInterval) {
            stopAutoSlide();
            startAutoSlide(newDelay);
        }
    }, 250);
});

// ============================================================================
// ANALYTICS & TRACKING (Placeholder)
// ============================================================================

function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log(`Track: ${category} - ${action} - ${label}`);
    
    // In a real app, you would integrate with Google Analytics, Facebook Pixel, etc.
    // Example:
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
}

// Track important interactions
document.addEventListener('click', function(e) {
    const target = e.target;
    
    if (target.classList.contains('btn-product')) {
        trackEvent('Product', 'Learn More Click', target.closest('.product-card')?.dataset.product);
    }
    
    if (target.classList.contains('recipe-link')) {
        trackEvent('Recipe', 'Video Click', target.closest('.recipe-card')?.querySelector('h4')?.textContent);
    }
    
    if (target.classList.contains('platform-card')) {
        trackEvent('Purchase', 'Platform Click', target.querySelector('h4')?.textContent);
    }
});

// ============================================================================
// INITIALIZATION COMPLETION
// ============================================================================

// Make functions globally available for HTML onclick handlers
window.scrollToProducts = scrollToProducts;
window.scrollToBuy = scrollToBuy;
window.scrollToTop = scrollToTop;
window.showProductDetails = showProductDetails;
window.closeProductModal = closeProductModal;
window.calculateNutrition = calculateNutrition;
window.checkAvailability = checkAvailability;
window.toggleAssistant = toggleAssistant;
window.sendChatMessage = sendChatMessage;
window.openLiveChat = openLiveChat;
window.fallbackToBlinkit = fallbackToBlinkit;
window.fallbackToZepto = fallbackToZepto;
window.fallbackToInstamart = fallbackToInstamart;
window.fallbackToBigBasket = fallbackToBigBasket;
window.goToSlide = goToSlide;

console.log('🚀 Saffola Nutripower - Fully responsive mobile-first website ready!');
console.log('📱 Optimized for mobile, tablet, and desktop experiences');
console.log('✨ Features: Touch gestures, responsive design, nutrition assistant, and more!');