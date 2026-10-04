// Valores públicos: podem ficar no repositório.
// A chave privada VAPID NUNCA entra aqui; ela fica só nos secrets do Supabase.
export const config = {
  // Supabase > Project Settings > API
  supabaseUrl: '',
  supabaseAnonKey: '',
  // Gerada por scripts/gerar-chaves-vapid.ps1
  vapidPublicKey: '',
};
