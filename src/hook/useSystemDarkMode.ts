import { useEffect, useState } from "react";

// 自定义 Hook：检测系统深色模式
const useSystemDarkMode = () => {
  const [systemDarkMode, setSystemDarkMode] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 初始设置
    setSystemDarkMode(darkModeQuery.matches);
    
    // 监听变化
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDarkMode(e.matches);
    };
    
    darkModeQuery.addEventListener('change', handleChange);
    
    return () => {
      darkModeQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return systemDarkMode;
};
export default useSystemDarkMode