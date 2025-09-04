import { RouterProvider } from 'react-router';
import { routes } from './router/routes';
import { Suspense } from 'react';
import Loading from './common/components/Loading';

function App() {
  return (
    // TODO: loading component 넣기
    <Suspense fallback={<Loading />}>
      <RouterProvider router={routes}></RouterProvider>
    </Suspense>
  );
}

export default App;
