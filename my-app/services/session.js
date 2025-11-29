// services/session.js
// Sessão simples para exigir login antes de navegar
let memoryUser = null;

export function saveSessionUser(user){
  memoryUser = user || null;
  try{
    if (typeof window !== 'undefined' && window.localStorage){
      window.localStorage.setItem('trafficvision:user', JSON.stringify(memoryUser));
    }
  }catch(_){/* noop */}
}

export function getSessionUser(){
  if (memoryUser) return memoryUser;
  try{
    if (typeof window !== 'undefined' && window.localStorage){
      const raw = window.localStorage.getItem('trafficvision:user');
      if (raw){
        memoryUser = JSON.parse(raw);
        return memoryUser;
      }
    }
  }catch(_){/* noop */}
  return null;
}

export function clearSession(){
  memoryUser = null;
  try{
    if (typeof window !== 'undefined' && window.localStorage){
      window.localStorage.removeItem('trafficvision:user');
    }
  }catch(_){/* noop */}
}