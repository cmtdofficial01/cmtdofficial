import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Service Methods
export const firebaseService = {
  // Test connection as required
  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  },

  async createDocument(collectionName: string, data: any) {
    return this.submitForm(collectionName, data);
  },

  async submitForm(collectionName: string, data: any) {
    try {
      return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, collectionName);
    }
  },

  async getCollection(collectionName: string) {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionName);
    }
  },

  async getDoc(collectionName: string, id: string) {
    try {
      const snapshot = await getDoc(doc(db, collectionName, id));
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${collectionName}/${id}`);
    }
  },

  async loginStaff(userId: string, password: string): Promise<any> {
    try {
      const staffRef = doc(db, 'staff', userId);
      const snapshot = await getDoc(staffRef); // Use getDoc for security
      
      if (!snapshot.exists()) {
        throw new Error('Invalid User ID or Password');
      }

      const staffData = snapshot.data();

      if (staffData.password !== password) {
        throw new Error('Invalid User ID or Password');
      }

      // Update login count and last login
      await updateDoc(staffRef, {
        loginCount: (staffData.loginCount || 0) + 1,
        lastLogin: serverTimestamp()
      });

      return { id: snapshot.id, ...staffData };
    } catch (error) {
       if (error instanceof Error && error.message === 'Invalid User ID or Password') {
         throw error;
       }
       if (error instanceof Error && error.message.includes('the client is offline')) {
         throw new Error('Authentication failed: You appear to be offline. Please check your internet connection.');
       }
       handleFirestoreError(error, OperationType.GET, 'staff_login');
    }
  },

  async updateDocument(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  },

  async deleteDocument(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  },

  subscribeToCollection(collectionName: string, callback: (data: any[]) => void) {
    return onSnapshot(collection(db, collectionName), 
      (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionName);
      }
    );
  },

  subscribeToQuery(collectionName: string, field: string, value: any, callback: (data: any[]) => void) {
    const q = query(collection(db, collectionName), where(field, '==', value));
    return onSnapshot(q, 
      (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${collectionName}?${field}==${value}`);
      }
    );
  }
};
