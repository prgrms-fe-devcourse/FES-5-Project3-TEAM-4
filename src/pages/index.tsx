import { Outlet } from 'react-router';

function Root() {
  return (
    <div>
      <header>
        {/* TODO: haeder component 넣기 */}
        <h1>header</h1>
      </header>

      <main>
        <Outlet></Outlet>
      </main>

      <footer>
        {/* TODO: footer component 넣기 */}
        <small> &copy; 2025 CTA </small>
      </footer>
    </div>
  );
}
export default Root;
