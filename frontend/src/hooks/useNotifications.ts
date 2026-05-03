import { useContext } from 'react';
import { NotificationContext } from '../context/notificationCore';
import type { NotificationContextValue } from '../context/notificationCore';

const noopNotify = () => '';

const fallbackNotifications: NotificationContextValue = {
  clearNotice: () => undefined,
  notify: noopNotify,
  notifyError: noopNotify,
  notifyInfo: noopNotify,
  notifyLoading: noopNotify,
  notifySuccess: noopNotify,
};

export function useNotifications() {
  return useContext(NotificationContext) || fallbackNotifications;
}
