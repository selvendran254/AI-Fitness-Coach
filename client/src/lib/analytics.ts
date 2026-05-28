import mixpanel from 'mixpanel-browser';

const TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

/**
 * Initialize Mixpanel when token is configured.
 */
export function initAnalytics(): void {
  if (TOKEN) {
    mixpanel.init(TOKEN, { debug: import.meta.env.DEV });
  }
}

/**
 * Track an analytics event if analytics is enabled.
 */
export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (TOKEN) mixpanel.track(name, props);
}
