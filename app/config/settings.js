// Settings that decide various options throughout the Application
module.exports = {
	DEBUG: false
};

// Import local settings file of possible - soft dependancy - overrides above
try{ _.deepExtend(module.exports, require('config/settings.local')); } catch(e) {}
