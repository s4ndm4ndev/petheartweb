/**
 * Theme Toggle Functionality for Pet Heart Animal Clinic
 * Handles system theme detection, user preferences, and smooth transitions
 */

class ThemeManager {
	constructor() {
		this.storageKey = "pet-heart-theme-preference";
		this.themeAttribute = "data-theme";
		this.toggleButton = null;
		this.systemThemeQuery = window.matchMedia(
			"(prefers-color-scheme: dark)"
		);

		this.init();
	}

	/**
	 * Initialize theme management system
	 */
	init() {
		this.detectSystemTheme();
		this.loadUserPreference();
		this.bindSystemThemeListener();
		this.setupToggleButton();
	}

	/**
	 * Detect system theme preference
	 * @returns {string} 'dark' or 'light'
	 */
	detectSystemTheme() {
		return this.systemThemeQuery.matches ? "dark" : "light";
	}

	/**
	 * Load user preference from localStorage or use system theme
	 */
	loadUserPreference() {
		const savedTheme = localStorage.getItem(this.storageKey);

		if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
			this.setTheme(savedTheme);
		} else {
			// Use system theme if no preference is saved
			const systemTheme = this.detectSystemTheme();
			this.setTheme(systemTheme);
		}
	}

	/**
	 * Set theme and update UI
	 * @param {string} theme - 'light' or 'dark'
	 */
	setTheme(theme) {
		// Add transition class for smooth theme changes
		document.documentElement.classList.add("theme-transitioning");

		// Set theme attribute
		document.documentElement.setAttribute(this.themeAttribute, theme);

		// Update toggle button state
		this.updateToggleButton(theme);

		// Remove transition class after animation completes
		setTimeout(() => {
			document.documentElement.classList.remove("theme-transitioning");
		}, 300);
	}

	/**
	 * Toggle between light and dark themes
	 */
	toggleTheme() {
		const currentTheme = document.documentElement.getAttribute(
			this.themeAttribute
		);
		const newTheme = currentTheme === "dark" ? "light" : "dark";

		this.setTheme(newTheme);
		localStorage.setItem(this.storageKey, newTheme);

		// Announce theme change for screen readers
		this.announceThemeChange(newTheme);
	}

	/**
	 * Update toggle button appearance and accessibility attributes
	 * @param {string} theme - Current theme
	 */
	updateToggleButton(theme) {
		if (!this.toggleButton) return;

		const isDark = theme === "dark";
		const buttonText = isDark
			? "Switch to light mode"
			: "Switch to dark mode";

		this.toggleButton.setAttribute("aria-label", buttonText);
		this.toggleButton.setAttribute("title", buttonText);
	}

	/**
	 * Announce theme change for screen readers
	 * @param {string} theme - New theme
	 */
	announceThemeChange(theme) {
		const announcement = `Switched to ${theme} mode. Page appearance has been updated for better viewing comfort.`;

		// Use the global live region if available
		const liveRegion = document.getElementById('sr-live-region');
		if (liveRegion) {
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.textContent = announcement;

			// Clear the message after screen reader has time to announce it
			setTimeout(() => {
				liveRegion.textContent = '';
			}, 2000);
		} else {
			// Fallback: Create temporary announcement element
			const announcer = document.createElement("div");
			announcer.setAttribute("aria-live", "polite");
			announcer.setAttribute("aria-atomic", "true");
			announcer.className = "sr-only";
			announcer.textContent = announcement;

			document.body.appendChild(announcer);

			// Remove announcement after screen reader has time to read it
			setTimeout(() => {
				if (document.body.contains(announcer)) {
					document.body.removeChild(announcer);
				}
			}, 2000);
		}
	}

	/**
	 * Setup toggle button event listeners
	 */
	setupToggleButton() {
		this.toggleButton = document.querySelector(".theme-toggle");

		if (this.toggleButton) {
			this.toggleButton.addEventListener("click", () =>
				this.toggleTheme()
			);

			// Support keyboard activation
			this.toggleButton.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					this.toggleTheme();
				}
			});

			// Initialize button state
			const currentTheme =
				document.documentElement.getAttribute(this.themeAttribute) ||
				"light";
			this.updateToggleButton(currentTheme);
		}
	}

	/**
	 * Listen for system theme changes
	 */
	bindSystemThemeListener() {
		this.systemThemeQuery.addEventListener("change", (e) => {
			// Only update if user hasn't set a preference
			const savedTheme = localStorage.getItem(this.storageKey);

			if (!savedTheme) {
				const systemTheme = e.matches ? "dark" : "light";
				this.setTheme(systemTheme);
			}
		});
	}

	/**
	 * Clear user preference and revert to system theme
	 */
	clearPreference() {
		localStorage.removeItem(this.storageKey);
		const systemTheme = this.detectSystemTheme();
		this.setTheme(systemTheme);
	}
}

// Initialize theme manager when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		window.themeManager = new ThemeManager();
	});
} else {
	window.themeManager = new ThemeManager();
}

// Export for potential use in other scripts
if (typeof module !== "undefined" && module.exports) {
	module.exports = ThemeManager;
}
