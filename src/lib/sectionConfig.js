/**
 * Section Configuration
 * 
 * This file is the single source of truth for valid sections/styles
 * that can be used in the Admin Panel and Frontend.
 * 
 * Each section maps to a specific frontend page.
 */

// Valid sections with their frontend page mappings
export const VALID_SECTIONS = [
  {
    value: 'budget',
    label: '💰 Budget',
    description: 'Budget-friendly packages',
    frontendPage: '/egypt-packages?style=budget',
    table: 'packages',
  },
  {
    value: 'luxury',
    label: '✨ Luxury',
    description: 'Premium luxury packages',
    frontendPage: '/egypt-packages?style=luxury',
    table: 'packages',
  },
  {
    value: 'Honeymoon',
    label: '💕 Honeymoon',
    description: 'Romantic honeymoon packages',
    frontendPage: '/nile-cruises?type=romantic',
    table: 'packages',
  },
  {
    value: 'Nile Cruise',
    label: '🚢 Nile Cruise',
    description: 'Nile river cruise packages',
    frontendPage: '/nile-cruises',
    table: 'packages',
  },
  {
    value: 'Day Tour',
    label: '☀️ Day Tour',
    description: 'Single-day guided tours',
    frontendPage: '/day-tours',
    table: 'packages',
  },
  {
    value: 'Shore Excursion',
    label: '⚓ Shore Excursion',
    description: 'Tours from cruise ship ports',
    frontendPage: '/shore-excursions',
    table: 'packages',
  },
  {
    value: 'Small Group',
    label: '👥 Small Group',
    description: 'Small group tours (max 16 people)',
    frontendPage: '/group-tours',
    table: 'packages',
  },
  {
    value: 'Group Tour',
    label: '🧑‍🤝‍🧑 Group Tour',
    description: 'Regular group tours',
    frontendPage: '/group-tours',
    table: 'packages',
  },
  {
    value: 'Transfer',
    label: '🚗 Transfer',
    description: 'Airport and city transfers',
    frontendPage: '/transfers',
    table: 'packages',
  },
  {
    value: 'Private Tour',
    label: '🎯 Private Tour',
    description: 'Private guided tours',
    frontendPage: '/egypt-packages',
    table: 'packages',
  },
]

// Get just the style values for dropdowns
export const STYLE_OPTIONS = VALID_SECTIONS.map(s => s.value)

// Get options with labels for fancy dropdowns
export const STYLE_OPTIONS_WITH_LABELS = VALID_SECTIONS.map(s => ({
  value: s.value,
  label: s.label,
  description: s.description,
}))

// Styles that are no longer valid and should be cleaned up
export const DEPRECATED_STYLES = [
  'Culture', 'Adventure', 'Beach', 'Romantic', 'Family', 'Cruise',
  'Classic', 'Premium', 'Spiritual', 'Safari', 'Diving', 
  'Historical', 'Desert', 'City Break', 'Budget', 'Luxury'
]

// Map deprecated styles to valid replacements
export const STYLE_MIGRATION_MAP = {
  'Culture': 'Day Tour',
  'Adventure': 'Day Tour',
  'Beach': 'Day Tour',
  'Romantic': 'Honeymoon',
  'Family': 'Private Tour',
  'Cruise': 'Nile Cruise',
  'Classic': 'budget',
  'Premium': 'luxury',
  'Spiritual': 'Day Tour',
  'Safari': 'Day Tour',
  'Diving': 'Shore Excursion',
  'Historical': 'Day Tour',
  'Desert': 'Day Tour',
  'City Break': 'Day Tour',
  'Budget': 'budget',
  'Luxury': 'luxury',
}

// Helper to check if a style is valid
export const isValidStyle = (style) => STYLE_OPTIONS.includes(style)

// Helper to get the recommended replacement for a deprecated style
export const getMigrationTarget = (style) => STYLE_MIGRATION_MAP[style] || 'Day Tour'

export default {
  VALID_SECTIONS,
  STYLE_OPTIONS,
  STYLE_OPTIONS_WITH_LABELS,
  DEPRECATED_STYLES,
  STYLE_MIGRATION_MAP,
  isValidStyle,
  getMigrationTarget,
}
