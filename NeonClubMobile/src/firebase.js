// Firebase web SDK v9 auth binding
import { getAuth } from 'firebase/auth';
import { app } from './services/firebaseApp';

const auth = getAuth(app);

export { auth };
