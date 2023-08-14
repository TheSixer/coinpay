import { createBrowserRouter, useRouteError, redirect } from "react-router-dom";
import { Suspense, lazy } from 'react'
import { Box, CircularProgress } from "@mui/material";
 
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
    path: '/admin-login',
    auth: false,
    name:"adminLogin",
    component:lazy(() => import("../pages/AdminLogin"))
  },
  {
    path: '/trader-register',
    auth: false,
    name:"adminLogin",
    component:lazy(() => import("../pages/TraderRegister"))
  },
  {
    path: '/pay',
    auth: false,
    name:"pay",
    component:lazy(() => import("../pages/HomePage"))
  },
  {
    path: '/admin',
    name:"Admin",
    component: lazy(() => import('../pages/AdminPage')),
    children: [
      { 
        path: '/admin/rate',
        auth: true,
        component:lazy(() => import('../pages/RateManage'))
      },
      { 
        path: '/admin/recharge',
        auth: true,
        component:lazy(() => import('../pages/FoundManage'))
      },
      { 
        path: '/admin/withdraw',
        auth: true,
        component:lazy(() => import('../pages/WithdrawManage'))
      },
      { 
        path: '/admin/orders',
        auth: true,
        component:lazy(() => import('../pages/OrderList'))
      },
      { 
        path: '/admin/trader',
        auth: true,
        component:lazy(() => import('../pages/TraderManage'))
      },
    ]
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
        path: '/trader/transfer-records',
        auth: true,
        component:lazy(() => import('../pages/TransferRecords'))
      },
      { 
        path: '/trader/recharge',
        auth: true,
        component:lazy(() => import('../pages/Recharge'))
      },
      { 
        path: '/trader/withdraw',
        auth: true,
        component:lazy(() => import('../pages/Withdraw'))
      },
      { 
        path: '/trader/cards',
        auth: true,
        component:lazy(() => import('../pages/CardList'))
      },
      { 
        path: '/trader/new-card',
        auth: true,
        component:lazy(() => import('../pages/NewCard'))
      },
      { 
        path: '/trader/update',
        auth: true,
        component:lazy(() => import('../pages/UpdateInfo'))
      },
      { 
        path: '*',
        component:lazy(() => import('../pages/TraderBalance'))
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
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