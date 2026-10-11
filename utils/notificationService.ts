export interface ReminderPreferences {
  sundayCelebration: boolean;
  midweekCommunion: boolean;
  covenantPrayer: boolean;
  wsfFellowship: boolean;
  announcements: boolean;
}

export interface ChurchServiceSchedule {
  id: string;
  name: string;
  dayName: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  hour: number;
  minute: number;
  timeString: string;
  description: string;
  location: string;
  preferenceKey: keyof ReminderPreferences;
}

export const CHURCH_SERVICES: ChurchServiceSchedule[] = [
  {
    id: 'sunday-1st',
    name: 'Sunday 1st Celebration Service',
    dayName: 'Every Sunday',
    dayOfWeek: 0,
    hour: 7,
    minute: 0,
    timeString: '7:00 AM - 9:15 AM',
    description: 'High praise, deep worship, and life-transforming Word of Faith.',
    location: 'Simbock Sanctuary (Entrée Onana)',
    preferenceKey: 'sundayCelebration'
  },
  {
    id: 'sunday-2nd',
    name: 'Sunday 2nd Celebration Service',
    dayName: 'Every Sunday',
    dayOfWeek: 0,
    hour: 9,
    minute: 30,
    timeString: '9:30 AM - 11:30 AM',
    description: 'Encounter signs, wonders, and prophetic impartations.',
    location: 'Simbock Sanctuary (Entrée Onana)',
    preferenceKey: 'sundayCelebration'
  },
  {
    id: 'midweek-communion',
    name: 'Midweek Holy Communion Service',
    dayName: 'Every Wednesday',
    dayOfWeek: 3,
    hour: 17,
    minute: 30,
    timeString: '5:30 PM - 7:30 PM',
    description: 'Spiritual recharging & the mystery of the Holy Communion for divine vitality.',
    location: 'Simbock Sanctuary (Entrée Onana)',
    preferenceKey: 'midweekCommunion'
  },
  {
    id: 'wsf-fellowship',
    name: 'Winners Satellite Fellowship (WSF)',
    dayName: 'Every Saturday',
    dayOfWeek: 6,
    hour: 17,
    minute: 0,
    timeString: '5:00 PM - 6:00 PM',
    description: 'Warm caring fellowship and prayer in 11 centers across Simbock.',
    location: '11 Neighborhood Centers across Simbock & Yaoundé',
    preferenceKey: 'wsfFellowship'
  },
  {
    id: 'covenant-chop',
    name: 'Covenant Hour of Prayer (CHOP)',
    dayName: 'Monday - Saturday',
    dayOfWeek: -1, // Daily weekday
    hour: 6,
    minute: 0,
    timeString: '6:00 AM - 7:00 AM',
    description: 'Commanding your morning at the altar of prevailing prayer.',
    location: 'Simbock Sanctuary & Online Broadcast',
    preferenceKey: 'covenantPrayer'
  }
];

const PREFERENCES_KEY = 'wci_notification_preferences_v1';
const LAST_ALERT_KEY = 'wci_last_service_alert_date';

const DEFAULT_PREFERENCES: ReminderPreferences = {
  sundayCelebration: true,
  midweekCommunion: true,
  covenantPrayer: true,
  wsfFellowship: true,
  announcements: true
};

export function getStoredPreferences(): ReminderPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: ReminderPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save notification preferences:', e);
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      sendBrowserNotification('🔔 WCI Simbock Notifications Active', {
        body: 'Welcome! You are now subscribed to upcoming church services & prophetic announcements.',
        tag: 'welcome-notification',
      });
    }
    return perm;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

export async function sendBrowserNotification(title: string, options?: NotificationOptions): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const defaultOptions: NotificationOptions = {
    icon: 'https://faithtabernacle.org.ng/vendor/images/lfw_.png',
    badge: 'https://faithtabernacle.org.ng/vendor/images/lfw_.png',
    ...options
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, defaultOptions);
        return;
      }
    }
    new Notification(title, defaultOptions);
  } catch (error) {
    try {
      new Notification(title, defaultOptions);
    } catch (e) {
      console.warn('Failed to display browser notification:', e);
    }
  }
}

export async function sendTestNotification(): Promise<boolean> {
  const perm = await requestNotificationPermission();
  if (perm !== 'granted') {
    return false;
  }

  await sendBrowserNotification('⛪ WCI Simbock — Test Notification', {
    body: 'Great! Notifications are working properly on your device. You will receive service reminders before Sunday and Wednesday services!',
    tag: 'test-notification',
  });
  return true;
}

export interface NextServiceInfo {
  service: ChurchServiceSchedule;
  nextDate: Date;
  diffMs: number;
  formattedCountdown: string;
  isToday: boolean;
  isTomorrow: boolean;
}

export function getNextUpcomingService(): NextServiceInfo | null {
  const now = new Date();
  let nearest: NextServiceInfo | null = null;

  for (const s of CHURCH_SERVICES) {
    const candidates: Date[] = [];

    if (s.dayOfWeek === -1) {
      // Daily Mon-Sat (1 to 6)
      for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
        const d = new Date(now);
        d.setDate(d.getDate() + dayOffset);
        const dayOfWeek = d.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 6) {
          d.setHours(s.hour, s.minute, 0, 0);
          if (d.getTime() > now.getTime()) {
            candidates.push(d);
            break; // next upcoming CHOP
          }
        }
      }
    } else {
      for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
        const d = new Date(now);
        d.setDate(d.getDate() + dayOffset);
        if (d.getDay() === s.dayOfWeek) {
          d.setHours(s.hour, s.minute, 0, 0);
          if (d.getTime() > now.getTime()) {
            candidates.push(d);
            break;
          }
        }
      }
    }

    if (candidates.length > 0) {
      const nextDate = candidates[0];
      const diffMs = nextDate.getTime() - now.getTime();

      if (!nearest || diffMs < nearest.diffMs) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const formattedCountdown = hours > 24 
          ? `In ${Math.ceil(hours / 24)} days` 
          : hours > 0 
            ? `In ${hours}h ${minutes}m` 
            : `In ${minutes} minutes`;

        const isToday = nextDate.toDateString() === now.toDateString();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = nextDate.toDateString() === tomorrow.toDateString();

        nearest = {
          service: s,
          nextDate,
          diffMs,
          formattedCountdown,
          isToday,
          isTomorrow
        };
      }
    }
  }

  return nearest;
}

export function checkAndTriggerServiceAlerts(): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const prefs = getStoredPreferences();
  const next = getNextUpcomingService();
  if (!next) return;

  if (!prefs[next.service.preferenceKey]) return;

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${next.service.id}`;
  const lastAlertKey = localStorage.getItem(LAST_ALERT_KEY);

  // If next service is within 2 hours or starting shortly today
  const hoursUntil = next.diffMs / (1000 * 60 * 60);

  if (hoursUntil > 0 && hoursUntil <= 2 && lastAlertKey !== todayKey) {
    localStorage.setItem(LAST_ALERT_KEY, todayKey);
    sendBrowserNotification(`⏰ Upcoming: ${next.service.name}`, {
      body: `Starting ${next.service.timeString} at ${next.service.location}. We look forward to worshipping together!`,
      tag: `service-alert-${next.service.id}`,
    });
  }
}
