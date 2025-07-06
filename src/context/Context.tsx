import React, { createContext, useContext, useState,type ReactNode } from 'react';
// import {type PaletteMode} from "@mui/material" 
type ThemeMode = 'light' | 'dark' | 'system';
// 定义Context类型
type ThemeContextType = {
  theme: ThemeMode;
  isSmallScreen:boolean;
  setisSmallScreen:(setBoolen:boolean)=>void;
  setTheme:(mode:ThemeMode)=>void;
};

// 创建Context（带默认值）
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isSmallScreen:false,
  setisSmallScreen:()=>{},
  setTheme:()=>{},

});

// 创建自定义Hook
export const useTheme = () => useContext(ThemeContext);

// Provider组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isSmallScreen, setiScreen] = useState(false);
  const setisSmallScreen = (setBoolen:boolean) => {
    setiScreen(setBoolen);
  };


  return (
    <ThemeContext.Provider value={{ theme, isSmallScreen, setisSmallScreen, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export type {ThemeMode}