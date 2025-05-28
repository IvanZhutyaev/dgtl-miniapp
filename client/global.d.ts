// src/global.d.ts

interface TelegramWebApp {
    initData: string;
    initDataUnsafe: object;
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: {
      bg_color: string;
      text_color: string;
      hint_color: string;
      link_color: string;
      button_color: string;
      button_text_color: string;
    };
    viewportHeight: number;
    headerColor: string;
    isExpanded: boolean;
    hapticFeedback: {
      impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    };
    ready: () => void; // Add 'ready' method type here
  }
  
  interface Telegram {
    WebApp: TelegramWebApp;
  }
  
  interface Window {
    Telegram: Telegram;
  }
  