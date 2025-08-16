/**
 * Main JavaScript file for Pet Heart Animal Clinic
 * Initializes all interactive components
 */

// Initialize all components when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
	console.log("Pet Heart Animal Clinic - Initializing components...");

	// Initialize mobile navigation
	initMobileNavigation();

	// Initialize accessibility features
	initAccessibilityFeatures();

	// Theme toggle is initialized automatically by theme-toggle.js
	// Additional components will be initialized here in future tasks
});

/**
 * Initialize mobile navigation toggle with enhanced accessibility
 */
function initMobileNavigation() {
	const navToggle = document.querySelector('.nav-toggle');
	const primaryNav = document.querySelector('.primary-nav');
	const navLinks = document.querySelectorAll('.nav-link');

	if (!navToggle || !primaryNav) {
		return;
	}

	// Toggle navigation menu
	function toggleNavigation() {
		const isOpen = primaryNav.classList.contains('nav-open');

		if (isOpen) {
			closeNavigation();
		} else {
			openNavigation();
		}
	}

	// Open navigation menu
	function openNavigation() {
		primaryNav.classList.add('nav-open');
		navToggle.setAttribute('aria-expanded', 'true');
		navToggle.setAttribute('aria-label', 'Close navigation menu');

		// Focus first nav link for keyboard users
		const firstNavLink = primaryNav.querySelector('.nav-link');
		if (firstNavLink) {
			setTimeout(() => firstNavLink.focus(), 100);
		}

		// Trap focus within navigation
		trapFocus(primaryNav);

		// Announce state change
		announceNavigationState(true);
	}

	// Close navigation menu
	function closeNavigation() {
		primaryNav.classList.remove('nav-open');
		navToggle.setAttribute('aria-expanded', 'false');
		navToggle.setAttribute('aria-label', 'Open navigation menu');

		// Return focus to toggle button
		navToggle.focus();

		// Remove focus trap
		removeFocusTrap();

		// Announce state change
		announceNavigationState(false);
	}

	// Handle toggle button click
	navToggle.addEventListener('click', toggleNavigation);

	// Handle toggle button keyboard events
	navToggle.addEventListener('keydown', function(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleNavigation();
		}
	});

	// Announce navigation state changes for screen readers
	function announceNavigationState(isOpen) {
		const announcement = isOpen ? 'Navigation menu opened' : 'Navigation menu closed';
		announceToScreenReader(announcement);
	}

	// Close mobile nav when clicking on nav links
	navLinks.forEach(link => {
		link.addEventListener('click', function() {
			if (window.innerWidth < 768) {
				closeNavigation();
			}
		});

		// Handle keyboard navigation
		link.addEventListener('keydown', function(event) {
			if (event.key === 'Escape') {
				closeNavigation();
			}
		});
	});

	// Close mobile nav when clicking outside
	document.addEventListener('click', function(event) {
		const isClickInsideNav = primaryNav.contains(event.target);
		const isClickOnToggle = navToggle.contains(event.target);

		if (!isClickInsideNav && !isClickOnToggle && primaryNav.classList.contains('nav-open')) {
			closeNavigation();
		}
	});

	// Handle escape key to close navigation
	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape' && primaryNav.classList.contains('nav-open')) {
			closeNavigation();
		}
	});

	// Close navigation on window resize if mobile menu is open
	window.addEventListener('resize', function() {
		if (window.innerWidth >= 768 && primaryNav.classList.contains('nav-open')) {
			closeNavigation();
		}
	});

	// Focus trap functionality for accessibility
	let focusableElements = [];
	let firstFocusableElement = null;
	let lastFocusableElement = null;

	function trapFocus(container) {
		focusableElements = container.querySelectorAll(
			'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
		);

		if (focusableElements.length > 0) {
			firstFocusableElement = focusableElements[0];
			lastFocusableElement = focusableElements[focusableElements.length - 1];

			container.addEventListener('keydown', handleFocusTrap);
		}
	}

	function handleFocusTrap(event) {
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				// Shift + Tab
				if (document.activeElement === firstFocusableElement) {
					event.preventDefault();
					lastFocusableElement.focus();
				}
			} else {
				// Tab
				if (document.activeElement === lastFocusableElement) {
					event.preventDefault();
					firstFocusableElement.focus();
				}
			}
		}
	}

	function removeFocusTrap() {
		if (primaryNav) {
			primaryNav.removeEventListener('keydown', handleFocusTrap);
		}
	}
}

/**
 * Announce messages to screen readers using live regions
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
	const liveRegion = document.getElementById('sr-live-region');
	if (liveRegion) {
		liveRegion.setAttribute('aria-live', priority);
		liveRegion.textContent = message;

		// Clear the message after screen reader has time to announce it
		setTimeout(() => {
			liveRegion.textContent = '';
		}, 1000);
	}
}

/**
 * Initialize additional accessibility features
 */
function initAccessibilityFeatures() {
	// Add keyboard navigation support for skip links
	const skipLinks = document.querySelectorAll('.skip-link');
	skipLinks.forEach(link => {
		link.addEventListener('click', function(e) {
			const targetId = this.getAttribute('href').substring(1);
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				e.preventDefault();
				targetElement.focus();
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

				// Announce the skip action
				announceToScreenReader(`Skipped to ${targetElement.getAttribute('aria-label') || targetId}`);
			}
		});
	});

	// Enhance focus management for interactive elements
	const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]');
	interactiveElements.forEach(element => {
		// Add focus indicators for keyboard navigation
		element.addEventListener('focus', function() {
			this.classList.add('keyboard-focused');
		});

		element.addEventListener('blur', function() {
			this.classList.remove('keyboard-focused');
		});

		// Remove focus class on mouse interaction
		element.addEventListener('mousedown', function() {
			this.classList.remove('keyboard-focused');
		});
	});

	// Initialize heading hierarchy validation
	validateHeadingHierarchy();
}

/**
 * Validate proper heading hierarchy for accessibility
 */
function validateHeadingHierarchy() {
	const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
	let previousLevel = 0;
	let hasH1 = false;

	headings.forEach((heading, index) => {
		const currentLevel = parseInt(heading.tagName.charAt(1));

		// Check for h1
		if (currentLevel === 1) {
			if (hasH1) {
				console.warn('Multiple h1 elements found. Only one h1 should exist per page for proper document structure.');
			}
			hasH1 = true;
		}

		// Check for proper hierarchy
		if (index > 0 && currentLevel > previousLevel + 1) {
			console.warn(`Heading hierarchy issue: ${heading.tagName} follows h${previousLevel}. Consider using h${previousLevel + 1} instead.`);
		}

		previousLevel = currentLevel;
	});

	if (!hasH1) {
		console.warn('No h1 element found. Add an h1 element for proper document structure.');
	}
}
