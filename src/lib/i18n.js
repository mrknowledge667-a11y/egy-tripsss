import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Translation resources
const resources = {
  en: {
    translation: en
  },
  ar: {
    translation: ar
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    
    // Language settings
    fallbackLng: 'en', // Default language if detection fails
    supportedLngs: ['en', 'ar'], // Supported languages
    
    // Detection options
    detection: {
      // Order of language detection methods
      order: [
        'localStorage',    // Check localStorage first
        'sessionStorage',  // Then sessionStorage
        'navigator',       // Then browser language
        'htmlTag',         // Then HTML lang attribute
        'path',           // Then URL path
        'subdomain'       // Finally subdomain
      ],
      
      // Cache settings
      caches: ['localStorage', 'sessionStorage'],
      
      // Check for language in these locations
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      
      // Exclude certain paths from language detection
      excludeCacheFor: ['cimode'],
      
      // Convert language codes (e.g., 'ar-EG' -> 'ar')
      convertDetectedLanguage: (lng) => lng.split('-')[0]
    },
    
    // Translation options
    interpolation: {
      escapeValue: false, // React already escapes values
      format: function(value, format, lng) {
        // Custom formatting for numbers, dates, etc.
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'USD'
          }).format(value);
        }
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(new Date(value));
        }
        return value;
      }
    },
    
    // React specific options
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
      bindI18n: 'languageChanged', // Re-render on language change
      bindI18nStore: 'added removed', // Re-render when translations change
      transEmptyNodeValue: '', // Empty node value
      transSupportBasicHtmlNodes: true, // Support basic HTML in translations
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'] // Allowed HTML tags
    },
    
    // Debugging (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Key separator and namespace separator
    keySeparator: '.', // Use dots for nested keys (e.g., 'nav.home')
    nsSeparator: false, // Disable namespace separator
    
    // Missing keys handling
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    
    // Return objects for complex translations
    returnObjects: true,
    
    // Parsing options
    parseMissingKeyHandler: (key) => {
      if (process.env.NODE_ENV === 'development') {
        return `Missing: ${key}`;
      }
      return key;
    }
  });

// Export configured i18n instance
export default i18n;

// Utility functions for language management
export const languageUtils = {
  // Get current language
  getCurrentLanguage: () => i18n.language,
  
  // Change language programmatically
  changeLanguage: async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      
      // Update document attributes
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
      
      // Update body classes for styling
      document.body.classList.toggle('rtl', lng === 'ar');
      document.body.classList.toggle('ltr', lng !== 'ar');
      
      // Store in localStorage
      localStorage.setItem('i18nextLng', lng);
      
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  },
  
  // Get available languages
  getAvailableLanguages: () => ({
    en: {
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      dir: 'ltr'
    },
    ar: {
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇪🇬',
      dir: 'rtl'
    }
  }),
  
  // Check if current language is RTL
  isRTL: () => i18n.language === 'ar',
  
  // Get direction for current language
  getDirection: () => i18n.language === 'ar' ? 'rtl' : 'ltr',
  
  // Format text based on language direction
  formatText: (text, options = {}) => {
    const { 
      rtlPrefix = '', 
      ltrPrefix = '', 
      rtlSuffix = '', 
      ltrSuffix = '' 
    } = options;
    
    const isRtl = languageUtils.isRTL();
    const prefix = isRtl ? rtlPrefix : ltrPrefix;
    const suffix = isRtl ? rtlSuffix : ltrSuffix;
    
    return `${prefix}${text}${suffix}`;
  },
  
  // Get font family for current language
  getFontFamily: () => {
    const fontFamilies = {
      en: '"Inter", "Segoe UI", system-ui, sans-serif',
      ar: '"Noto Sans Arabic", "Segoe UI", system-ui, sans-serif'
    };
    
    return fontFamilies[i18n.language] || fontFamilies.en;
  }
};

// Initialize direction on load
document.addEventListener('DOMContentLoaded', () => {
  const currentLang = languageUtils.getCurrentLanguage();
  document.documentElement.dir = languageUtils.getDirection();
  document.documentElement.lang = currentLang;
  document.body.classList.add(currentLang === 'ar' ? 'rtl' : 'ltr');
});

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  
  // Update body classes
  document.body.classList.remove('rtl', 'ltr');
  document.body.classList.add(lng === 'ar' ? 'rtl' : 'ltr');
});