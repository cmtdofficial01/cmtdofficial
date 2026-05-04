import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const logout = () => {
  localStorage.removeItem('admin_auth');
  localStorage.removeItem('staff_auth');
  localStorage.removeItem('staff_id');
  localStorage.removeItem('staff_name');
  auth.signOut();
};
