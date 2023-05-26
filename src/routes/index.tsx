import { createBrowserRouter, useRouteError, redirect, Navigate } from "react-router-dom";
import { Suspense, lazy } from 'react'
 
type IRouterBeforeLoad = (res:any, redirectUrl: string, auth: boolean) => Boolean;
let routerLoader: IRouterBeforeLoad;
let _redirectUrl: string = "/";
const routes = [
  {
    path: '/',
    auth: false,
    name:"login",
    component:lazy(() => import("../pages/Login"))
  },
  {
    path: '/pay',
    auth: false,
    name:"pay",
    component:lazy(() => import("../pages/HomePage"))
  },
  {
    path: '/trader',
    name:"Trader",
    component: lazy(() => import('../pages/TraderPage')),
    children: [
      { 
        path: '/trader/balance',
        auth: true,
        component:lazy(() => import('../pages/TraderBalance'))
      },
      { 
        path: '/trader/list',
        auth: true,
        component:lazy(() => import('../pages/TradingList'))
      },
      { 
        path: '*',
        component: <Navigate to="/trader/balance" replace />
      },
    ]
  },
  { 
    path: '*',
    component:lazy(() => import('../pages/NotFoundPage'))
  },
]
 
 
function ErrorBoundary() {
  let error:any = useRouteError();
  return (
    <div>
      <div>{ error.message}</div>
      <div>{ error.stack}</div>
    </div>
  );
}
 
// 路由处理方式
const generateRouter = (routers:any) => {
  return routers.map((item:any) => {
    if (item.children) {
      item.children = generateRouter(item.children)
    }
    item.element = <Suspense fallback={
      <div>加载中...</div>
    }>
      {/* 把懒加载的异步路由变成组件装载进去 */}
      <item.component />
    </Suspense>
    item.errorElement = <ErrorBoundary></ErrorBoundary>
    item.loader = async (res: any) => {
      if (routerLoader && !item.children) {
        if (routerLoader(res, _redirectUrl, item.auth)) {
          return res;
        } else { 
          return redirect(_redirectUrl);
        }
      }
      return res;
    }
    return item
  })
}
 
const RouterLoader = (fun: IRouterBeforeLoad) => {
  routerLoader = fun;
}
 
const Router  = () => createBrowserRouter(generateRouter([...routes]))
export{ Router,RouterLoader}