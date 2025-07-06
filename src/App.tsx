import { useState, useEffect, } from 'react'
import './css/App.css'
import TopBar from "./TopBar";
import LeftBar from "./LeftBar"
import { Outlet, useLocation } from 'react-router';
import {Drawer,   } from '@mui/material';
import{useTheme, type ThemeMode
} from './context/Context';
import { ThemeProvider, createTheme, } from '@mui/material/styles';
// import{lightTheme, darkTheme} from './theme/theme'
import CssBaseline from '@mui/material/CssBaseline';
import useSystemDarkMode from './hook/useSystemDarkMode'
// 创建 CSS 变量主题

// 全局样式 - 关键解决方案
function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const systemDarkMode = useSystemDarkMode();
  const resolvedMode = themeMode === 'system' 
    ? (systemDarkMode ? 'dark' : 'light') 
    : themeMode;
  const isSmallScreen = useTheme().isSmallScreen
  const setIsSmallScreen = useTheme().setisSmallScreen
  const [open, setOpen] = useState(false);
  
  const autoToggleDrawer = () => {
    
    setOpen(!open);
  };

  const BREAKPOINT = 900; // 设置断点宽度（单位：px）
  useEffect(() => {
  let timeoutId:number =0;
  
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < BREAKPOINT);
    
  };

  const debouncedCheck = () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(checkScreenSize, 100);
  };

  // 初始检查
  checkScreenSize();
  
  window.addEventListener('resize', debouncedCheck);
  
  return () => {
    window.removeEventListener('resize', debouncedCheck);
    clearTimeout(timeoutId);
  };
}, []);
const path = useLocation().pathname
useEffect(()=>{setOpen(false)},[path])


  useEffect(() => {
    // 初始检查
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < BREAKPOINT);
    };

    // 立即执行一次初始检查
    checkScreenSize();

    // 添加resize事件监听
    window.addEventListener('resize', checkScreenSize);

    // 清理函数：移除监听
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []); // 空依赖数组确保effect只运行一次
  useEffect(()=>{
    setOpen(false)
  },[isSmallScreen])

  return (<ThemeProvider 
    
  theme={createTheme({
    palette:{
      mode:resolvedMode ==='dark'?'dark':'light'
    }
  })}
  >
    <CssBaseline />
    <div className='flex_row appContainer'>
    {!isSmallScreen?<div className='leftbarparent'><LeftBar isSmallScreen = {isSmallScreen}/></div>:<Drawer open={open} onClose={()=>setOpen(false)}><LeftBar isSmallScreen/></Drawer>}
    <div className={isSmallScreen?'rightContentmob':'rightContent'}>
      <TopBar
      theme = {themeMode}
      setThemeMode={(mode)=>setThemeMode(mode)}
      autoToggleDrawer = {autoToggleDrawer}
      isSmallScreen={isSmallScreen}
       />
      <div className='paddingTop10 rightContentDash'><Outlet/></div>
      </div>    
    </div></ThemeProvider>
  )
}

export default App
