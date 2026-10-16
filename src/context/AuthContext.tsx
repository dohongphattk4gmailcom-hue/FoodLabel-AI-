import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';

export interface AuthContextType {
  user: User | any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Sync user profile from Firestore or create initial doc
  const syncUserProfile = async (currentUser: User) => {
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserProfile({
          uid: currentUser.uid,
          displayName: data.displayName || currentUser.displayName || 'Học sinh THCS',
          email: data.email || currentUser.email || '',
          photoURL: data.photoURL || currentUser.photoURL || undefined,
          age: data.age,
          weightKg: data.weightKg,
          heightCm: data.heightCm,
          gender: data.gender,
          activityLevel: data.activityLevel,
          personalGoal: data.personalGoal,
          calculatedBmi: data.calculatedBmi,
          estimatedTdee: data.estimatedTdee,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : undefined,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : undefined,
        });
      } else {
        // Initialize default profile
        const initialProfile = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Học sinh THCS',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userDocRef, initialProfile);
        setUserProfile({
          uid: currentUser.uid,
          displayName: initialProfile.displayName,
          email: initialProfile.email,
          photoURL: initialProfile.photoURL,
        });
      }
    } catch (err) {
      console.error('Error syncing user profile from Firestore:', err);
      // In case of Firestore permission or offline, still set basic auth info
      setUserProfile({
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Học sinh THCS',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || undefined,
      });
    }
  };

  const LOCAL_GUEST_KEY = 'foodlabel_ai_guest_session';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.removeItem(LOCAL_GUEST_KEY);
        await syncUserProfile(currentUser);
      } else {
        // Check for active guest session
        try {
          const savedGuest = localStorage.getItem(LOCAL_GUEST_KEY);
          if (savedGuest) {
            const guestData = JSON.parse(savedGuest);
            setUser(guestData.user);
            setUserProfile(guestData.profile);
          } else {
            setUser(null);
            setUserProfile(null);
          }
        } catch {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAsGuest = async () => {
    setAuthError(null);
    try {
      const result = await signInAnonymously(auth);
      if (result.user) {
        await syncUserProfile(result.user);
        return;
      }
    } catch {
      // If anonymous auth is not enabled in Firebase Console, fallback smoothly to local guest session
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      const guestUser = {
        uid: guestId,
        displayName: 'Học sinh Dùng thử (Khách)',
        email: 'khach.demo@foodlabel.edu.vn',
        isAnonymous: true,
      };
      const guestProfile: UserProfile = {
        uid: guestId,
        displayName: 'Học sinh Dùng thử (Khách)',
        email: 'khach.demo@foodlabel.edu.vn',
        age: 13,
        weightKg: 45,
        heightCm: 155,
        gender: 'male',
      };
      localStorage.setItem(LOCAL_GUEST_KEY, JSON.stringify({ user: guestUser, profile: guestProfile }));
      setUser(guestUser);
      setUserProfile(guestProfile);
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Cửa sổ đăng nhập đã bị đóng trước khi hoàn tất.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setAuthError('Yêu cầu mở cửa sổ đăng nhập đã bị huỷ.');
      } else {
        setAuthError(err.message || 'Không thể đăng nhập bằng tài khoản Google.');
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (credential.user) {
        await syncUserProfile(credential.user);
      }
    } catch (err: any) {
      console.error('Email Sign In error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setAuthError('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Định dạng địa chỉ email không hợp lệ.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthError('Tính năng Đăng nhập Email/Mật khẩu chưa được kích hoạt trong Firebase Console. Hãy dùng nút "Đăng nhập nhanh với Google".');
      } else {
        setAuthError(err.message || 'Lỗi khi đăng nhập tài khoản.');
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setAuthError(null);
    try {
      const trimmedDisplayName = displayName.trim() || 'Học sinh FoodLabel';
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName: trimmedDisplayName,
        });

        const userDocRef = doc(db, 'users', credential.user.uid);
        try {
          await setDoc(userDocRef, {
            uid: credential.user.uid,
            displayName: trimmedDisplayName,
            email: credential.user.email || email.trim(),
            photoURL: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, `users/${credential.user.uid}`);
        }

        setUserProfile({
          uid: credential.user.uid,
          displayName: trimmedDisplayName,
          email: credential.user.email || email.trim(),
        });
      }
    } catch (err: any) {
      console.error('Email Sign Up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Địa chỉ email này đã được đăng ký. Bạn hãy chuyển sang Đăng nhập!');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Mật khẩu quá ngắn. Vui lòng đặt mật khẩu tối thiểu 6 ký tự.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Định dạng địa chỉ email không hợp lệ.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthError('Phương thức Email/Password chưa bật trên Firebase Console. Bạn vui lòng sử dụng "Đăng nhập nhanh với Google" nhé!');
      } else {
        setAuthError(err.message || 'Lỗi khi tạo tài khoản mới.');
      }
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      localStorage.removeItem(LOCAL_GUEST_KEY);
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setAuthError('Lỗi khi đăng xuất.');
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const payload: any = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      // Clean undefined
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });

      await updateDoc(userDocRef, payload);
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const value = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      authError,
      clearAuthError,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInAsGuest,
      logout,
      updateUserProfile,
    }),
    [user, userProfile, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
