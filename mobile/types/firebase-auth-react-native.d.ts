declare module 'firebase/auth' {
  export type User = {
    uid: string;
    email?: string | null;
  };

  export function initializeAuth(app: any, options?: any): any;
  export function getReactNativePersistence(storage: any): any;
  export function onAuthStateChanged(auth: any, callback: (user: User | null) => void): () => void;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
}
