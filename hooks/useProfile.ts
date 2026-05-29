import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapProfile } from '@/lib/mappers';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        setProfile(data ? mapProfile(data) : null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const creaProfile = useCallback(
    async (nickname: string, avatarId: string): Promise<void> => {
      if (!user) throw new Error('Utente non autenticato');
      const { data, error } = await supabase
        .from('profiles')
        .insert({ id: user.id, nickname, avatar_id: avatarId })
        .select()
        .single();
      if (error) throw error;
      setProfile(mapProfile(data));
    },
    [user]
  );

  return { profile, loading, creaProfile };
}
