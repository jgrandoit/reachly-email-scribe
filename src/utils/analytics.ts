
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  user_id?: string;
  timestamp?: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    // Load saved events from localStorage
    this.loadEvents();
  }

  private loadEvents() {
    try {
      const saved = localStorage.getItem('reachly_analytics');
      if (saved) {
        this.events = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load analytics events:', error);
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem('reachly_analytics', JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  track(event: string, properties?: Record<string, any>, userId?: string) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      user_id: userId,
      timestamp: new Date().toISOString(),
    };

    this.events.push(analyticsEvent);
    this.saveEvents();

    // Log for debugging
    console.log('Analytics:', analyticsEvent);
  }

  getEvents(limit?: number): AnalyticsEvent[] {
    return limit ? this.events.slice(-limit) : this.events;
  }

  getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(event => event.event === eventType);
  }

  getMetrics() {
    const totalEvents = this.events.length;
    const uniqueEvents = [...new Set(this.events.map(e => e.event))];
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = this.events.filter(e => e.timestamp?.startsWith(today));

    return {
      totalEvents,
      uniqueEventTypes: uniqueEvents.length,
      todayEvents: todayEvents.length,
      eventTypes: uniqueEvents,
    };
  }

  clearEvents() {
    this.events = [];
    this.saveEvents();
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

export const analytics = new Analytics();

// Convenience functions for common events
export const trackPageView = (page: string, userId?: string) => {
  analytics.track('page_view', { page }, userId);
};

export const trackEmailGenerated = (framework: string, tone: string, userId?: string) => {
  analytics.track('email_generated', { framework, tone }, userId);
};

export const trackSubscription = (action: string, tier?: string, userId?: string) => {
  analytics.track('subscription', { action, tier }, userId);
};

export const trackAuth = (action: string, userId?: string) => {
  analytics.track('auth', { action }, userId);
};
