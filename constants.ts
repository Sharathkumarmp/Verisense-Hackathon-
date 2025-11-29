import { City, VerificationStatus } from './types';

// Get all cities except 'All India' for the dropdown, sorted alphabetically
export const CITIES = Object.values(City)
  .filter(city => city !== City.All)
  .sort();

export const SOURCES = [
  'WhatsApp Forward',
  'Facebook Group',
  'Twitter/X',
  'News Website',
  'Word of Mouth',
  'Telegram Channel',
  'YouTube Video',
  'Instagram Post'
];

// Start with empty memory as requested
export const MOCK_CLAIMS = [];
