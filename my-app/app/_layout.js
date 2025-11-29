import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { getSessionUser } from '../services/session';

export default function RootLayout(){
  const router = useRouter();
  const segments = useSegments();

  useEffect(()=>{
    const u = getSessionUser();
    const atLogin = segments[0] === 'login';
    const atRegister = segments[0] === 'register';
    if (!u && !atLogin && !atRegister){
      router.replace('/login');
    }
  }, [segments, router]);

  return <Slot />;
}