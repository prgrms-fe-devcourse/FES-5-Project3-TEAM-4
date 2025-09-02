import { createBrowserRouter, Navigate } from 'react-router';
import { lazy } from 'react';
import AuthLayout from '@/common/components/AuthLayout';
import { FiFileText, FiHome, FiUsers } from 'react-icons/fi';
import { TbCards } from 'react-icons/tb';

const Root = lazy(() => import('@/pages'));
const Home = lazy(() => import('@/pages/Home'));
const Tarot = lazy(() => import('@/pages/Tarot'));
const Community = lazy(() => import('@/pages/Community'));
const CommunityLayout = lazy(() => import('@/pages/Community/components/CommunityLayout'));
const Write = lazy(() => import('@/pages/Community/Write'));
const Detail = lazy(() => import('@/pages/Community/Detail'));
const Edit = lazy(() => import('@/pages/Community/Edit'));
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

const TarotQuestion = lazy(() => import('@/pages/TarotQuestion'));
const TarotShuffle = lazy(() => import('@/pages/TarotShuffle'));
const TarotSpreadDraw = lazy(() => import('@/pages/TarotSpreadDraw'));
const TarotResult = lazy(() => import('@/pages/TarotResult'));

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
        children: [
          { index: true, element: <Navigate to="question" replace /> },
          { path: 'question', Component: TarotQuestion },
          { path: 'shuffle', Component: TarotShuffle },
          { path: 'spread', Component: TarotSpreadDraw },
          { path: 'result', Component: TarotResult },
        ],
      },
      {
        path: 'community',
        Component: CommunityLayout,
        handle: { label: 'Community', showInNav: true, icon: FiUsers },
        children: [
          {
            index: true,
            Component: Community,
            handle: { showInNav: false },
            loader: async () => true,
          },
          {
            path: 'write',
            Component: Write,
            handle: { showInNav: false },
          },
          {
            path: ':id',
            Component: Detail,
            handle: { showInNav: false },
          },
          {
            path: 'edit/:id',
            Component: Edit,
            handle: { showInNav: false },
          },
        ],
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
