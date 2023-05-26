import { NavigateFunction, Location, To, NavigateOptions } from "react-router-dom";
import { RouterLoader } from "../routes";
type IrouterBeforeLoad = (to: Ito, location?: Location) => Boolean;

interface Ito {
  to: To
  options?: NavigateOptions
  needAuth?: boolean
}

let routerBeforeLoad: IrouterBeforeLoad;
let flag: Boolean = true;

const RouterBeforeEach = (fun: IrouterBeforeLoad) => {
  ///页面刷新时，配合loader实现调用，并做拦截重定向，由flag判断是否是初次刷新页面，以免在useUtilsNavigate调用是触发多次路由校验
  RouterLoader((res: any, redirectUrl: string, auth: boolean) => {
    let result: Boolean = true;
    if (flag) {
      let url = new URL(res.request.url)
      result = fun({ to: url.pathname, needAuth: auth })
      if (redirectUrl == url.pathname) {
        result = true;
      }
    }
    return result;
  })
  routerBeforeLoad = fun;
}

///所有的js路由跳转通过此函数，由此做路由拦截
const useUtilsNavigate = (navigate: NavigateFunction, location: Location, to: To, options?: NavigateOptions) => {
  if (routerBeforeLoad && routerBeforeLoad({ to, options }, location)) {
    //flag设置false标志已经不是第一次加载页面
    flag = false;
    navigate(to, options)
  } else {
    return;
  }
  //flag设置false标志已经不是第一次加载页面
  flag = false;
  navigate(to, options)
}

export { useUtilsNavigate, RouterBeforeEach };
export type { IrouterBeforeLoad, Ito };
