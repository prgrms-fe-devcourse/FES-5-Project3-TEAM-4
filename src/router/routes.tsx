import { createBrowserRouter, Navigate } from 'react-router';
import { lazy } from 'react';
import AuthLayout from '@/common/components/AuthLayout';
import { FiFileText, FiHome, FiUsers } from 'react-icons/fi';
import { TbCards } from 'react-icons/tb';
import { recordLoader } from '@/pages/Mypage/loader/recordLoader';
import { postLoader } from '@/pages/Mypage/loader/postLoader';
import { likeLoader } from '@/pages/Mypage/loader/likeLoader';

const Root = lazy(() => import('@/pages'));
const Home = lazy(() => import('@/pages/Home'));
const Tarot = lazy(() => import('@/pages/Tarot'));
const Community = lazy(() => import('@/pages/Community'));
const Mypage = lazy(() => import('@/pages/Mypage'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const PasswordReset = lazy(() => import('@/pages/PasswordReset'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const LoginCallBack = lazy(() => import('@/pages/Login/components/OAuthCallback'));
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
        handle: { label: 'Home', showInNav: true, icon: FiHome },
      },
      {
        path: 'tarot',
        Component: Tarot,
        handle: { label: 'Tarot', showInNav: true, icon: TbCards },
      },
      {
        path: 'community',
        Component: Community,
        handle: { label: 'Community', showInNav: true, icon: FiUsers },
        loader: async () => {
          // ex)
          // const { data } = await supabase.from("테이블명").select("*");
          // return data;
          return true;
        },
      },
      {
        path: 'mypage',
        handle: { label: 'Mypage', showInNav: true, icon: FiFileText },
        Component: Mypage,
        loader: async () => {
          // ex)
          // const { data } = await supabase.from("테이블명").select("*");
          // return data;
          return true;
        },
        children: [
          { index: true, element: <Navigate to="management" /> },
          {
            path: 'management',
            Component: Management,
          },
          {
            path: 'post',
            Component: Post,
            loader: postLoader,
          },
          {
            path: 'likes',
            Component: Likes,
            loader: likeLoader,
          },
          {
            path: 'record',
            Component: Record,
            loader: recordLoader,
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
            handle: { label: 'Login', showInNav: false },
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
            handle: { label: 'Register', showInNav: false },
            // action: async ({ request }) => {
            // ex)
            // const formData = await request.formData();
            // const name = formData.get("name") as string;
            // const email = formData.get("email") as string;
            // TODO: supabase 통신
            // },
          },
          {
            path: 'forgotPassword',
            Component: ForgotPassword,
            handle: { label: 'forgotPassword', showInNav: false },
            // action: async ({ request }) => {
            // ex)
            // const formData = await request.formData();
            // const name = formData.get("name") as string;
            // const email = formData.get("email") as string;
            // TODO: supabase 통신
            // },
          },
          {
            path: 'passwordReset',
            Component: PasswordReset,
            handle: { label: 'passwordReset', showInNav: false },
            // action: async ({ request }) => {
            // ex)
            // const formData = await request.formData();
            // const name = formData.get("name") as string;
            // const email = formData.get("email") as string;
            // TODO: supabase 통신
            // },
          },
          {
            path: 'callback',
            Component: LoginCallBack,
            handle: { label: 'OAuth', showInNav: false },
          },
        ],
      },
    ],
  },
  { path: '*', Component: NotFound },
]);
