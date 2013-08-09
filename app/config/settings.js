// Settings that decide various options throughout the Application
module.exports = {
	DEBUG: false,

	api: {
		proxy: false, // Use reverse express proxy (Fixes IE CORS issue)
		simulate: false, // Uses simulated API environment (for testing)
		store: true // Stores proxied response to the api/json directory (proxy must be true)
	}
};

// Import local settings file of possible - soft dependancy - overrides above
try{ _.deepExtend(module.exports, require('config/settings.local')); } catch(e) {}