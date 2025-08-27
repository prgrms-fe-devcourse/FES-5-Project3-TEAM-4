import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import AuthLayout from '@/common/components/AuthLayout';

const Root = lazy(() => import('@/pages'));
const Home = lazy(() => import('@/pages/Home'));
const Tarot = lazy(() => import('@/pages/Tarot'));
const Community = lazy(() => import('@/pages/Community'));
const Mypage = lazy(() => import('@/pages/Mypage'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Management = lazy(() => import('@/pages/Mypage/components/Management'));
const Post = lazy(() => import('@/pages/Mypage/components/Post'));
const Likes = lazy(() => import('@/pages/Mypage/components/Likes'));
const Record = lazy(() => import('@/pages/Mypage/components/Record'));

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        handle: { label: 'Home', showInNav: true },
      },
      {
        path: 'tarot',
        Component: Tarot,
        handle: { label: 'Tarot', showInNav: true },
      },
      {
        path: 'community',
        Component: Community,
        handle: { label: 'Community', showInNav: true },
        loader: async () => {
          // ex)
          // const { data } = await supabase.from("테이블명").select("*");
          // return data;
          return true;
        },
      },
      {
        path: 'mypage',
        Component: Mypage,
        handle: { label: 'Mypage', showInNav: true },
        children: [
          {
            index: true,
            path: 'management',
            Component: Management,
          },
          {
            path: 'post',
            Component: Post,
          },
          {
            path: 'likes',
            Component: Likes,
          },
          {
            path: 'record',
            Component: Record,
          },
        ],
      },

      {
        path: 'auth',
        Component: AuthLayout,
        children: [
          {
            path: 'login',
            Component: Login,
            handle: { label: 'Login', showInNav: true },
            // action: async ({ request }) => {
            // ex)
            // const formData = await request.formData();
            // const name = formData.get("name") as string;
            // const email = formData.get("email") as string;
            // TODO: supabase 통신
            // },
          },
          {
            path: 'register',
            Component: Register,
            handle: { label: 'Register', showInNav: true },
            // action: async ({ request }) => {
            // ex)
            // const formData = await request.formData();
            // const name = formData.get("name") as string;
            // const email = formData.get("email") as string;
            // TODO: supabase 통신
            // },
          },
        ],
      },
    ],
  },
  { path: '*', Component: NotFound },
]);
