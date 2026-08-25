import { AppNotification } from '../types';
import { INITIAL_NOTIFICATIONS } from './mockData';

const NOTIF_KEY = 'gramathlete_notifications_v1';

export const getNotifications = (): AppNotification[] => {
  const data = localStorage.getItem(NOTIF_KEY);
  if (!data) {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification => {
  const list = getNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}`,
    timestamp: 'Just now',
    read: false
  };
  const updated = [newNotif, ...list];
  localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  return newNotif;
};

export const markAllNotificationsRead = (): AppNotification[] => {
  const list = getNotifications();
  const updated = list.map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  return updated;
};

export const clearNotifications = (): void => {
  localStorage.setItem(NOTIF_KEY, JSON.stringify([]));
};
