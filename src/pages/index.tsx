import Footer from '@/common/layouts/Footer';
import Header from '@/common/layouts/Header';
import { Outlet } from 'react-router';

function Root() {
  return (
    <div>
      <Header />

      <main>
        <Outlet></Outlet>
      </main>

      <Footer />
    </div>
  );
}
export default Root;
