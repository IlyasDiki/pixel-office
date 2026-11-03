import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EventBus } from '../game/EventBus';

export function useRealtimePresence(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    // Gabungkan perubahan beruntun jadi satu refresh
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => EventBus.emit('presence:refresh'), 150);
    };

    const channel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        schedule
      )
      .subscribe((status) => {
        // Saat (re)connect, ambil data terbaru supaya perubahan yang terlewat ikut terambil
        if (status === 'SUBSCRIBED') schedule();
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Realtime status:', status);
        }
      });

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [enabled]);
}