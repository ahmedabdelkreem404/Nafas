import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, RotateCcw, Shield, Sparkles, X } from 'lucide-react';
import { NotificationContext } from './notificationCore';
import type { NotificationContextValue, Notice, NoticeInput, NoticeTone } from './notificationCore';

function createId() {
  return `notice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function NoticeIcon({ tone }: { tone: NoticeTone }) {
  if (tone === 'success') return <CheckCircle2 size={20} aria-hidden="true" />;
  if (tone === 'error') return <Shield size={20} aria-hidden="true" />;
  if (tone === 'loading') return <RotateCcw className="notice-toast__spinner" size={20} aria-hidden="true" />;
  return <Sparkles size={20} aria-hidden="true" />;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const timers = useRef<Record<string, number>>({});

  const clearNotice = useCallback((id: string) => {
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
    setNotices((current) => current.filter((notice) => notice.id !== id));
  }, []);

  const notify = useCallback((input: NoticeInput) => {
    const id = createId();
    const tone = input.tone || 'info';
    const notice: Notice = {
      ...input,
      duration: input.duration ?? (tone === 'error' ? 6500 : tone === 'loading' ? 0 : 4200),
      id,
      tone,
    };

    setNotices((current) => [notice, ...current].slice(0, 4));

    if (notice.duration && notice.duration > 0) {
      timers.current[id] = window.setTimeout(() => clearNotice(id), notice.duration);
    }

    return id;
  }, [clearNotice]);

  const value = useMemo<NotificationContextValue>(() => ({
    clearNotice,
    notify,
    notifyError: (title, message) => notify({ message, title, tone: 'error' }),
    notifyInfo: (title, message) => notify({ message, title, tone: 'info' }),
    notifyLoading: (title, message) => notify({ message, title, tone: 'loading' }),
    notifySuccess: (title, message) => notify({ message, title, tone: 'success' }),
  }), [clearNotice, notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notice-viewport" aria-live="polite" aria-atomic="false">
        {notices.map((notice) => (
          <section key={notice.id} className={`notice-toast notice-toast--${notice.tone}`}>
            <div className="notice-toast__icon">
              <NoticeIcon tone={notice.tone} />
            </div>
            <div className="notice-toast__content">
              <strong>{notice.title}</strong>
              {notice.message ? <p>{notice.message}</p> : null}
              {notice.action ? (
                <button type="button" onClick={notice.action.onClick}>
                  {notice.action.label}
                </button>
              ) : null}
            </div>
            <button className="notice-toast__close" type="button" onClick={() => clearNotice(notice.id)} aria-label="إغلاق الرسالة">
              <X size={16} aria-hidden="true" />
            </button>
          </section>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
