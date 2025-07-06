import {
  createBrowserRouter,
  Navigate,
//   RouterProvider,
//   Outlet,
//   NavLink,
} from "react-router";
import { lazy} from "react";

const LazySplitImg = lazy(()=>import("../tools/SplitImg.tsx"))
// const LazyWelcome = lazy(()=>import("./tools/DefaultWelcome"))
// const LazyGuid = lazy(()=>import("../Guid.tsx"))
const LazyJoinImg = lazy(()=>import("../tools/JoinImg.tsx"))
// import SplitImg from ;
// import { React } from "react";
import DefaultWelcome from "../tools/DefaultWelcome.tsx";
import Other  from "../tools/Other.tsx";
// import Other  from "./tools/Other.tsx";
// import Welcome  from "./tools/Other.tsx";
import App  from "../App.tsx";
// const basename = import.meta.env.PROD?'/home':'./'
const router = createBrowserRouter([
    {
        path:'/home',
        // name:'主页',
        element:<App></App>,
        children:[
        {
            index:true,
            element:<DefaultWelcome/>},
        {
        path:'SplitImg',
        // name:'矩形裁切图片',
        element:<LazySplitImg/>

    },{
        path:'JoinImg',
        // name:'其他',
        element:<LazyJoinImg/>
    },{
        path:'Other',
        // name:'其他',
        element:<Other/>
    },

        ]

    },
    // {
    //     path:'/welcome',
    //     element:<><LazyGuid/><NavLink to='/home'>home</NavLink></>
    // },
    {
        path:'/',
        element:<Navigate to='/home'/>
    }
    ]);
export default router