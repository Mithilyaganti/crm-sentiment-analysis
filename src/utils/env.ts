const env: { [key: string]: any } = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
};


export default env;
