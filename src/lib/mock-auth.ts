const MOCK_SESSION_KEY = "cadaspatas-mock-session";

export type MockSession = {
  email: string;
  name: string;
};

export function setMockSession(session: MockSession) {
  sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
}

export function getMockSession(): MockSession | null {
  const raw = sessionStorage.getItem(MOCK_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

export function clearMockSession() {
  sessionStorage.removeItem(MOCK_SESSION_KEY);
}
