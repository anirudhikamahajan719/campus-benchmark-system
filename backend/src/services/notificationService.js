import { getDB, saveDB } from '../data/store.js';
import { v4 as uuidv4 } from 'uuid';
import { broadcastMessage } from '../websocket.js';

export const notificationService = {
  getNotifications: () => {
    const db = getDB();
    return db.notifications;
  },

  createNotification: ({ type, title, message }) => {
    const db = getDB();
    const newNotif = {
      id: `notif_${uuidv4().substring(0, 8)}`,
      type: type || 'SYSTEM_INFO',
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    db.notifications.unshift(newNotif);
    if (db.notifications.length > 50) {
      db.notifications.pop();
    }
    saveDB();

    broadcastMessage({
      type: 'NOTIFICATION_RECEIVED',
      data: newNotif
    });

    return newNotif;
  }
};
