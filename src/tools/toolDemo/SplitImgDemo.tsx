import React, { useEffect, useState, type CSSProperties } from "react";
import { Box, Slider, Typography } from "@mui/material";
import{useTheme} from '../../context/Context';
import { NavLink } from "react-router";

// 类型定义
interface ImageFragment {
  id: string;
  url: string;
  x: number;       // 在完整图片中的x坐标（百分比）
  y: number;       // 在完整图片中的y坐标（百分比）
  width: number;   // 在完整图片中的宽度占比
  height: number;  // 在完整图片中的高度占比
}

interface CompositeImageProps {
  fragments: ImageFragment[];
  // isSmall:false;
  aspectRatio: number; // 完整图片的宽高比 (width/height)
}

const SplitImgDemo: React.FC<CompositeImageProps> = ({ 
  fragments, 
  aspectRatio 
}) => {
  const smllSc = useTheme().isSmallScreen
  
  const [gapVal, setGap] = useState(0)
  const marks = [
  {
    value: 0,
    label: 0,
  },{
    value: 3,
    label: 3,
  },
  {
    value: 5,
    label: 5,
  }
];
  // 生成网格模板
  const generateGridTemplate = () => {
    const rows: string[] = [];
    const columns: string[] = [];
    
    // 创建100等分的网格系统（可根据需要调整精度）
    for (let i = 0; i < 100; i++) {
      rows.push("1fr");
      columns.push("1fr");
    }
    
    return {
      gridTemplateRows: rows.join(" "),
      gridTemplateColumns: columns.join(" ")
    };
  };

  // 容器样式
  const containerStyle: CSSProperties = {
    width: smllSc?"90%":"31%",
    aspectRatio: `${aspectRatio}`,
    ...generateGridTemplate()
  };

  // 图片片段样式
  const getFragmentStyle = (frag: ImageFragment): CSSProperties => ({
    gridArea: `${Math.floor(frag.y * 100) + 1} / ${Math.floor(frag.x * 100) + 1}
              / span ${Math.ceil(frag.height * 100)} / span ${Math.ceil(frag.width * 100)}`,

    padding:gapVal,

  });
  useEffect(()=>{
    setGap(0)
  },[smllSc])

  return (<div
  className="splitDemo flex_col "><Box 
  sx={(theme)=>({
    border:'1px solid',
    borderColor:theme.palette.divider,
    boxShadow:theme.shadows[2]
  })}
  className="splitDemoCon"
>效果展示，滑动以切割 or <NavLink to='./SplitImg'><Typography sx={{
  display:'inline'
}} color="primary">前往试试</Typography></NavLink><Slider 
  aria-label='gap'  
  size="small"
  step={smllSc?0.5:1}
  marks = {marks}
  min={0}
  max={smllSc?3:5}
  // valueLabelDisplay="auto"
  value={gapVal}
  onChange={(_event, value,)=>{setGap(value)}}
  ></Slider></Box>
    <div className="splitDemoGrid" style={containerStyle}>
      {fragments.map((fragment) => (
        <img
        className="splitDemoImg"
          key={fragment.id}
          src={fragment.url}
          alt={`Image fragment ${fragment.id}`}
          style={getFragmentStyle(fragment)}
        />
      ))}
    </div></div>
  );
};

export default SplitImgDemo;
export type {ImageFragment}