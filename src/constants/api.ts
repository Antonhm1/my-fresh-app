export const API_LIMITS = {
  BANNERS: 6,
  EVENTS: 6,
  MAX_API_LIMIT: 100
} as const;

export const FALLBACK_IMAGES = {
  EVENT: '/eventplaceholderimage1.png',
  EVENT_2: '/eventplaceholderimage2.png',
  EVENT_3: '/eventpladeholderimage3.png'
} as const;

export const EMPTY_STATE_MESSAGES = {
  BANNERS: 'Ingen udvalgte aktiviteter at vise i øjeblikket.',
  EVENTS: 'Ingen kommende begivenheder at vise i øjeblikket.',
  GENERAL: 'Ingen data tilgængelig i øjeblikket.'
} as const;

export const LOADING_MESSAGES = {
  BANNERS: 'Indlæser aktiviteter...',
  EVENTS: 'Indlæser begivenheder...',
  GENERAL: 'Indlæser...'
} as const;