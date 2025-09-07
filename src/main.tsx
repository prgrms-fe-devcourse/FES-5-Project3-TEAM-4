import { createRoot } from 'react-dom/client';
import '@/common/api/supabase/supabase';
import '@/styles/style.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(<App />);
