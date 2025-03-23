interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const USER_CHAT_KEY = 'user_chat_history';
const LAWYER_CHAT_KEY = 'lawyer_chat_history';

export function saveMessages(messages: Message[], isLawyer: boolean) {
  if (typeof window === 'undefined') return;
  const key = isLawyer ? LAWYER_CHAT_KEY : USER_CHAT_KEY;
  localStorage.setItem(key, JSON.stringify(messages));
}

export function loadMessages(isLawyer: boolean): Message[] {
  if (typeof window === 'undefined') return [];
  const key = isLawyer ? LAWYER_CHAT_KEY : USER_CHAT_KEY;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}
