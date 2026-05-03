import { createContext } from 'react';

export type NoticeTone = 'success' | 'error' | 'info' | 'loading';

export type NoticeInput = {
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  message?: string;
  title: string;
  tone?: NoticeTone;
};

export type Notice = NoticeInput & {
  id: string;
  tone: NoticeTone;
};

export type NotificationContextValue = {
  clearNotice: (id: string) => void;
  notify: (notice: NoticeInput) => string;
  notifyError: (title: string, message?: string) => string;
  notifyInfo: (title: string, message?: string) => string;
  notifyLoading: (title: string, message?: string) => string;
  notifySuccess: (title: string, message?: string) => string;
};

export const NotificationContext = createContext<NotificationContextValue | null>(null);
