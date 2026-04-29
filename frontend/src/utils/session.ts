export const getSessionKey = (): string => {
  const existing = localStorage.getItem('nafas_session_key');
  if (existing) return existing;
  const generated = `guest_${crypto.randomUUID()}`;
  localStorage.setItem('nafas_session_key', generated);
  return generated;
};
