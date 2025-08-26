import { RouterProvider } from 'react-router';
import { routes } from './router/routes';
import { Suspense } from 'react';

function App() {
  return (
    // TODO: loading component 넣기
    <Suspense fallback={<div>로딩 중...</div>}>
      <RouterProvider router={routes}></RouterProvider>
    </Suspense>
  );
}

export default App;
