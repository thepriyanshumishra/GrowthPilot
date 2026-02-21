"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onIdTokenChanged,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

import { getCurrentUser } from '@/app/actions/user';
import { User as DbUser } from '@prisma/client';

interface AuthContextType {
    user: User | null;
    dbUser: DbUser | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    dbUser: null,
    loading: true,
    signInWithGoogle: async () => { },
    logout: async () => { },
    refreshUser: async () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [dbUser, setDbUser] = useState<DbUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchDbUser = async () => {
        try {
            const data = await getCurrentUser();
            setDbUser(data);
        } catch (error) {
            console.error("Error fetching DB user", error);
        }
    }

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                try {
                    const token = await user.getIdToken();
                    console.log("AuthContext: Syncing token to cookie");
                    document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;

                    // Fetch DB user details
                    await fetchDbUser();
                } catch (error) {
                    console.error("Error getting id token", error);
                }
            } else {
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                setDbUser(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase Auth Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Manually set cookie to avoid race condition with onIdTokenChanged
            const token = await user.getIdToken();
            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;

            // After successful sign-in, check DB status
            const dbUser = await getCurrentUser();

            // Refresh local state
            setDbUser(dbUser);

            if (dbUser?.isOnboarded) {
                router.push("/dashboard");
            } else {
                router.push("/onboarding");
            }
        } catch (error: any) {
            if (
                error.code !== 'auth/popup-closed-by-user' &&
                error.code !== 'auth/cancelled-popup-request' &&
                error.code !== 'auth/popup-blocked'
            ) {
                console.error("Error signing in with Google", error);
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setDbUser(null);
            router.push("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, dbUser, loading, signInWithGoogle, logout, refreshUser: fetchDbUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
