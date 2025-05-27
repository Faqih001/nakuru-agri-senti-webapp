import { createContext } from 'react';
import { AuthContextType } from './types';

// Create and export AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the event constants for auth events - fix for the type issue
export const AuthEvents = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  SIGNED_UP: 'SIGNED_UP',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED'
};
