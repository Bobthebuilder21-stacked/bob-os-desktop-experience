import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithUsername = useCallback(async (username: string) => {
    const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@bobos.local`;
    const password = `bobos-${username.toLowerCase()}-autogen`;

    // Try sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInError) return { error: null };

    // If invalid credentials, try signing up
    if (signInError.message.includes("Invalid login credentials")) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, display_name: username },
        },
      });
      if (signUpError) return { error: signUpError.message };

      // Auto sign-in after signup
      const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
      if (retryError) return { error: retryError.message };
      return { error: null };
    }

    return { error: signInError.message };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, session, loading, loginWithUsername, signOut };
}
