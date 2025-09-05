import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import BgImage from '/velvet.png';

export default function Tarot() {
  useEffect(() => {
    const markReload = () => sessionStorage.setItem('tarot:justReloaded', '1');
    const clearOnBFCacheRestore = (e: PageTransitionEvent) => {
      if (e.persisted) sessionStorage.removeItem('tarot:justReloaded');
    };
    window.addEventListener('beforeunload', markReload);
    window.addEventListener('pageshow', clearOnBFCacheRestore);
    return () => {
      window.removeEventListener('beforeunload', markReload);
      window.removeEventListener('pageshow', clearOnBFCacheRestore);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <Outlet />
    </div>
  );
}
