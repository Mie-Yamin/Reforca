import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        return {
            id: user.uid,
            name: user.displayName || 'Warga Bahari',
            email: user.email,
            phone: user.phoneNumber || '0812-xxxx-xxxx',
            role: 'warga',
            photoURL: user.photoURL
        };
    } catch (error) {
        console.error("Gagal login dengan Google:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Gagal logout:", error);
        throw error;
    }
};