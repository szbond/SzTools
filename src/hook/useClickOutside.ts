// src/hooks/useClickOutside.ts
import { useEffect, useCallback, type RefObject } from "react";

// 类型定义
type ClickCallback = (event: MouseEvent) => void;
type ElementRef = RefObject<HTMLElement> | null;

// 创建全局点击监听管理器 (单例模式)
const createClickTracker = () => {
  const listeners: Set<ClickCallback> = new Set();
  
  const handleDocumentClick = (event: MouseEvent) => {
    listeners.forEach(callback => callback(event));
  };
  
  // 初始化时添加监听
  if (typeof document !== "undefined") {
    document.addEventListener("click", handleDocumentClick);
  }
  
  return {
    register: (callback: ClickCallback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    destroy: () => {
      document.removeEventListener("click", handleDocumentClick);
    }
  };
};

// 全局单例
const globalClickTracker = createClickTracker();

/**
 * 检测是否点击了特定元素外部
 * 
 * @param elements 元素引用数组
 * @param callback 点击外部时触发的回调函数
 * 
 * 使用示例:
 * ```
 * const ref = useRef<HTMLDivElement>(null);
 * 
 * useClickOutside([ref], () => {
 *   // 处理点击外部逻辑
 * });
 * ```
 */
export function useClickOutside(
  elements: ElementRef[], 
  callback: (event: MouseEvent) => void
) {
  // 使用 useCallback 稳定回调函数，避免不必要的重新注册
  const stableCallback = useCallback(callback, [callback]);
  
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      // 检查点击是否发生在所有目标元素外部
      const isOutside = elements.every(elementRef => {
        // 如果elementRef为null，则视为不需要检查，所以返回true（即点击在外部）
        if (!elementRef) return true;
        const element = elementRef.current;
        return element && !element.contains(event.target as Node);
      });
      
      if (isOutside) {
        stableCallback(event);
      }
    };
    
    // 注册到全局监听器
    const unregister = globalClickTracker.register(handler);
    
    // 返回清理函数
    return ()=>{unregister;}
  }, [elements, stableCallback]);
}