import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      telegramId: string;
      firstName: string;
      lastName?: string;
      username?: string;
    };
  }

  interface User {
    id: string;
    telegramId: string;
    firstName: string;
    lastName?: string;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    telegramId: string;
    firstName: string;
    lastName?: string;
    username?: string;
  }
}
