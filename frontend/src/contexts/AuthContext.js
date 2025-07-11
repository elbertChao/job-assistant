import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('Error getting session:', error);
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });
        // Listen for auth changes
        const { data: { subscription }, } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            // Handle user signup completion
            // if (event === 'SIGNED_UP' && session?.user) {
            if (session?.user) {
                console.log('User signed up, creating profile...');
                // The profile should be created automatically by the database trigger
                // But let's add a small delay to ensure it's processed
                setTimeout(() => {
                    console.log('Profile creation should be complete');
                }, 1000);
            }
        });
        return () => subscription.unsubscribe();
    }, []);
    const signUp = async (email, password, fullName) => {
        try {
            console.log('Attempting to sign up user:', email);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });
            if (error) {
                console.error('Signup error:', error);
                throw error;
            }
            console.log('Signup successful:', data);
            toast.success('Account created successfully!');
        }
        catch (error) {
            console.error('Signup failed:', error);
            toast.error(error.message || 'Failed to create account');
            throw error;
        }
    };
    const signIn = async (email, password) => {
        try {
            console.log('Attempting to sign in user:', email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                console.error('Signin error:', error);
                throw error;
            }
            console.log('Signin successful:', data);
            toast.success('Signed in successfully!');
        }
        catch (error) {
            console.error('Signin failed:', error);
            toast.error(error.message || 'Failed to sign in');
            throw error;
        }
    };
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error)
                throw error;
            toast.success('Signed out successfully!');
        }
        catch (error) {
            console.error('Signout failed:', error);
            toast.error(error.message || 'Failed to sign out');
            throw error;
        }
    };
    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
