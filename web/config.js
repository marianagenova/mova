// Valores públicos: podem ficar no repositório.
// A chave privada VAPID NUNCA entra aqui; ela fica só nos secrets do Supabase.
export const config = {
  // Supabase > Project Settings > API
  supabaseUrl: 'https://kocdeaukwsydyzwnofof.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvY2RlYXVrd3N5ZHl6d25vZm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMjMzNzIsImV4cCI6MjEwNjY5OTM3Mn0.P82DgPuJPcZgVoCUM1hNM7BxHFzbGIg5cfs5ZoF1liA',
  // Gerada por scripts/gerar-chaves-vapid.ps1
  vapidPublicKey: 'BIMvZMUTNE5loPiqi-VkTQMYFcvm9JbCX3pg_T0_kWuiOn9FQOqZ5T4FSgM87jSSUvkHpSJjszpdTong6T9m0Ik',
};
