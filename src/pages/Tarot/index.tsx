import { Outlet } from 'react-router-dom';
import BgImage from '/velvet.png';

export default function Tarot() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <Outlet />
    </div>
  );
}
