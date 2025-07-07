import React, { useRef, useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import JSzip from 'jszip'
import  saveAs  from 'file-saver'
import { 
  // Button, 
    // Card, CardContent, 
    // CardActions, Grid,
    Box, Typography, 
    // IconButton, styled, Container 
  } from '@mui/material';
import {
  StyledInputPlaced, 
  // StyledCatureBox
} from '../styledComponents/StyledCompo'
import {FluentColorLinkMultiple24,FluentColorApps24,FluentEmojiFlatUpDownArrow,FluentColorDismissCircle24,FluentColorImage24, FluentEmojiFlatLeftRightArrow,FluentColorArrowSquare24,FluentEmojiFlatLeftArrow, FluentEmojiFlatRightArrow} from '../icon/MyIcon'
import { NavLink } from 'react-router';
import FileUpload from './FileUpload';
type Rectangle = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type HistoryItem = Rectangle[];

type ActionMode = 'merge' | 'horizontal' | 'vertical' | null;

const HandleImg: React.FC = () => {
  // console.log({useDarkMode:useDarkMode()});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const NumInputRef = useRef<HTMLInputElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [nValue, setNValue] = useState<number>(5);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [selectedRect, setSelectedRect] = useState<Rectangle | null>(null);
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });
  const [displayScale, setDisplayScale] = useState<number>(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setOriginalImageSize({ width: img.width, height: img.height });
        setRectangles([]);
        setHistory([]);
        setCurrentHistoryIndex(-1);
        setSelectedRect(null);
        setActionMode(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const calculateDisplayScale = useCallback(() => {
    if (!image) return 1;
    
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.6;
    
    const widthRatio = maxWidth / image.width;
    const heightRatio = maxHeight / image.height;
    
    return Math.min(widthRatio, heightRatio, 1);
  }, [image]);

  useEffect(() => {
    if (!image) return;
    
    const scale = calculateDisplayScale();
    setDisplayScale(scale);
    
    const width = image.width * scale;
    const height = image.height * scale;
    
    setCanvasSize({ width, height });
  }, [image, calculateDisplayScale]);

  const saveToHistory = (newRectangles: Rectangle[]) => {
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), 
                      JSON.parse(JSON.stringify(newRectangles))];
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

const drawCanvas = useCallback(() => {
  const canvas = canvasRef.current;
  if (!canvas || !image) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(image, 0, 0, image.width, image.height, 
                0, 0, canvas.width, canvas.height);
  
  // 绘制整个画布的外边框
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // 绘制所有矩形边框
  rectangles.forEach(rect => {
    // 计算位置并确保不超出画布
    const x = Math.max(0, Math.min(rect.x * displayScale, canvas.width - 1));
    const y = Math.max(0, Math.min(rect.y * displayScale, canvas.height - 1));
    
    // 计算实际可绘制的宽度和高度
    const maxWidth = canvas.width - x;
    const maxHeight = canvas.height - y;
    const width = Math.min(rect.width * displayScale, maxWidth);
    const height = Math.min(rect.height * displayScale, maxHeight);
    
    // 只绘制右边和下边，避免重叠边框变粗
    ctx.beginPath();
    ctx.moveTo(x + width, y); // 右上角
    ctx.lineTo(x + width, y + height); // 右下角
    ctx.lineTo(x, y + height); // 左下角
    ctx.stroke();
  });
  
  // 高亮选中的矩形（完整绘制）
  if (selectedRect) {
    const rect = rectangles.find(r => r.id === selectedRect.id);
    if (rect) {
      const x = Math.max(0, Math.min(rect.x * displayScale, canvas.width - 1));
      const y = Math.max(0, Math.min(rect.y * displayScale, canvas.height - 1));
      
      const maxWidth = canvas.width - x;
      const maxHeight = canvas.height - y;
      const width = Math.min(rect.width * displayScale, maxWidth);
      const height = Math.min(rect.height * displayScale, maxHeight);
      
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      
      ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
      ctx.fillRect(x, y, width, height);
    }
  }
  
  if (actionMode) {
      ctx.fillStyle = '#2c3e50';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      
      let text = '';
      if (actionMode === 'merge') {
        text = selectedRect 
          ? '请选择第二个矩形进行合并' 
          : '请选择第一个矩形进行合并';
      } else if (actionMode === 'horizontal') {
        text = '请选择一个矩形进行横向分割';
      } else if (actionMode === 'vertical') {
        text = '请选择一个矩形进行纵向分割';
      }
      
      ctx.fillText(text, canvas.width / 2, 30);
    }
}, [image, rectangles, selectedRect, actionMode, canvasSize, displayScale]);

  const handleSplit = () => {
    if (!image) return;
    
    const maxSide = Math.max(image.width, image.height);
    const squareSize = Math.ceil(maxSide / nValue);
    // console.log({squareSize:squareSize});
    
    
    const cols = Math.ceil(image.width / squareSize);
    const rows = Math.ceil(image.height / squareSize);
    // console.log({cols:cols,rows:rows});
    const newRectangles: Rectangle[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let cx = col * squareSize
        let cy =  row * squareSize
        const xOverlap = Math.max(0, Math.min(cx + squareSize, image.width) - Math.max(cx, 0));
            let yOverlap = Math.max(0, Math.min(cy + squareSize, image.height) - Math.max(cy, 0));
            let overlapArea = xOverlap * yOverlap;
            let squareArea = squareSize * squareSize;
            let overlapRatio = overlapArea / squareArea;
            
            if (overlapRatio < (1 - 0.8)) {
              continue
                // validSquares.push(square);
            }
        newRectangles.push({
          id: `${row}-${col}-${Date.now()}`,
          x: cx,
          y: cy,
          width: squareSize,
          height: squareSize,
        });
      }
    }
    // console.log({newRectangles:newRectangles});
    
    setRectangles(newRectangles);
    saveToHistory(newRectangles);
    setSelectedRect(null);
  };

  const getIntersection = (rectA: Rectangle, rectB: Rectangle) => {
    const x1 = Math.max(rectA.x, rectB.x);
    const y1 = Math.max(rectA.y, rectB.y);
    const x2 = Math.min(rectA.x + rectA.width, rectB.x + rectB.width);
    const y2 = Math.min(rectA.y + rectA.height, rectB.y + rectB.height);
    
    if (x2 <= x1 || y2 <= y1) return null;
    
    return {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || rectangles.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / displayScale;
    const y = (e.clientY - rect.top) / displayScale;
    
    const clickedRect = [...rectangles].reverse().find(r => 
      x >= r.x && x <= r.x + r.width && 
      y >= r.y && y <= r.y + r.height
    );
    
    if (!clickedRect) {
      setSelectedRect(null);
      return;
    }
    
    if (actionMode === 'merge') {
      if (!selectedRect) {
        setSelectedRect(clickedRect);
      } else {
        handleMerge(selectedRect, clickedRect);
        setSelectedRect(null);
        setActionMode(null);
      }
    } else if (actionMode === 'horizontal') {
      handleSplitRect(clickedRect, 'horizontal');
      setActionMode(null);
    } else if (actionMode === 'vertical') {
      handleSplitRect(clickedRect, 'vertical');
      setActionMode(null);
    } else {
      setSelectedRect(clickedRect);
    }
  };

  const handleMerge = (rect1: Rectangle, rect2: Rectangle) => {
    const minX = Math.min(rect1.x, rect2.x);
    const minY = Math.min(rect1.y, rect2.y);
    const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
    const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
    
    const mergedRect: Rectangle = {
      id: `merged-${Date.now()}`,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
    
    // 处理与合并矩形相交的矩形
    const newRectangles: Rectangle[] = [];
    
    rectangles.forEach(rect => {
      // 检查是否完全包含在合并矩形内
      if (rect.x >= minX && 
          rect.x + rect.width <= maxX && 
          rect.y >= minY && 
          rect.y + rect.height <= maxY) {
        return; // 跳过完全包含的矩形
      }
      
      const inter = getIntersection(rect, mergedRect);
      if (!inter) {
        newRectangles.push(rect); // 没有相交，保留原矩形
        return;
      }
      
      // 分割相交的矩形
      // 顶部部分
      if (rect.y < inter.y) {
        newRectangles.push({
          id: `${rect.id}-top-${Date.now()}`,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: inter.y - rect.y
        });
      }
      
      // 底部部分
      const bottomY = inter.y + inter.height;
      if (rect.y + rect.height > bottomY) {
        newRectangles.push({
          id: `${rect.id}-bottom-${Date.now()}`,
          x: rect.x,
          y: bottomY,
          width: rect.width,
          height: rect.y + rect.height - bottomY
        });
      }
      
      // 左侧部分
      if (rect.x < inter.x) {
        newRectangles.push({
          id: `${rect.id}-left-${Date.now()}`,
          x: rect.x,
          y: inter.y,
          width: inter.x - rect.x,
          height: inter.height
        });
      }
      
      // 右侧部分
      const rightX = inter.x + inter.width;
      if (rect.x + rect.width > rightX) {
        newRectangles.push({
          id: `${rect.id}-right-${Date.now()}`,
          x: rightX,
          y: inter.y,
          width: rect.x + rect.width - rightX,
          height: inter.height
        });
      }
    });
    
    // 添加合并后的矩形
    newRectangles.push(mergedRect);
    
    setRectangles(newRectangles);
    saveToHistory(newRectangles);
  };

  const handleSplitRect = (rect: Rectangle, direction: 'horizontal' | 'vertical') => {
    const newRectangles = rectangles.filter(r => r.id !== rect.id);
    
    if (direction === 'horizontal') {
      const width1 = Math.floor(rect.width / 2);
      const width2 = rect.width - width1;
      
      newRectangles.push(
        {
          id: `${rect.id}-left-${Date.now()}`,
          x: rect.x,
          y: rect.y,
          width: width1,
          height: rect.height
        },
        {
          id: `${rect.id}-right-${Date.now()}`,
          x: rect.x + width1,
          y: rect.y,
          width: width2,
          height: rect.height
        }
      );
    } else {
      const height1 = Math.floor(rect.height / 2);
      const height2 = rect.height - height1;
      
      newRectangles.push(
        {
          id: `${rect.id}-top-${Date.now()}`,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: height1
        },
        {
          id: `${rect.id}-bottom-${Date.now()}`,
          x: rect.x,
          y: rect.y + height1,
          width: rect.width,
          height: height2
        }
      );
    }
    
    setRectangles(newRectangles);
    saveToHistory(newRectangles);
  };

  const handleExport = () => {
    const zip = new JSzip();
    if (!image || rectangles.length === 0) return;
    
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;
    
    exportCanvas.width = image.width;
    exportCanvas.height = image.height;
    exportCtx.drawImage(image, 0, 0);
    
    rectangles.forEach((rect, index) => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = rect.width;
      tempCanvas.height = rect.height;
      
      tempCtx.drawImage(
        exportCanvas,
        rect.x, rect.y, rect.width, rect.height,
        0, 0, rect.width, rect.height
      );
      
      const dataURL = tempCanvas.toDataURL('image/jpeg',1);
      const base64Data = dataURL.split(',')[1];
      zip.file(`fragment-${index + 1}.jpeg`, base64Data, { base64: true });
      // const link = document.createElement('a');
      // link.download = `fragment-${index + 1}.png`;
      // link.href = dataURL;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    });
    zip.generateAsync({ type: 'blob' }).then(content=>saveAs(content, 'images.zip'));
      // 下载ZIP
      // saveAs(content, 'images.zip');
    
    alert(`已导出 ${rectangles.length} 个图像碎片`);
  };

  const handleUndo = () => {
    if (currentHistoryIndex <= 0) return;
    
    const newIndex = currentHistoryIndex - 1;
    const prevRectangles = history[newIndex];
    setRectangles(prevRectangles);
    setCurrentHistoryIndex(newIndex);
  };

  const handleRedo = () => {
    if (currentHistoryIndex >= history.length - 1) return;
    
    const newIndex = currentHistoryIndex + 1;
    const nextRectangles = history[newIndex];
    setRectangles(nextRectangles);
    setCurrentHistoryIndex(newIndex);
  };

  const handleReset = () => {
    setImage(null);
    setRectangles([]);
    setHistory([]);
    setCurrentHistoryIndex(-1);
    setSelectedRect(null);
    setActionMode(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [image, rectangles, selectedRect, actionMode, canvasSize, displayScale, drawCanvas]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        handleUndo();
      } else if (e.ctrlKey && e.key === 'y') {
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <div
    className='imgDashbord flex_col'>
      
      
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{textAlign:'center'}}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>图片等比分割</Typography>
        <Typography variant="subtitle1" color="text.secondary">上传图片，分割后调整网格 <NavLink  to='/home'><Typography sx={{display:'inline'}} color='primary'>查看示例</Typography></NavLink>
        </Typography>
        </Box>
        <Box
        sx={(theme)=>({
          padding: 2,
          borderRadius: 2,
          border:'1px solid',
          borderColor:theme.palette.divider,
          flexWrap: 'wrap',
          justifyContent:'center',
          alignItems:'center',
          gap: 5
        })}
        className='flex_row'>
          
            <ButtonGroup>
              <Button 
            variant='outlined'
            onClick={() => fileInputRef.current?.click()}
            >
            <FluentColorImage24/><Typography noWrap>上传</Typography>
            </Button>
              <TextField
                color='primary'
                variant='outlined' 
                type='number' 
                size='small'
                defaultValue={5}
                label='长边切分'
                slotProps={{
                  root:{
                    sx:{
                      height:'100%',
                      maxWidth:'75px'
                    }
                  },
                  input:{
                    sx:{
                    borderRadius:'0px',
                    // paddingLeft:'2px'
                    }
                  }
                }}
              
              //  value={nValue} 
               onChange={(e) => {setNValue(Math.max(1, parseInt(e.target.value) || 1))}}
               />
               <Button 
              variant='outlined'
                onClick={handleSplit}
                disabled={!image}
              >
                <FluentColorApps24/><Typography variant='body1' noWrap>分割</Typography>
              </Button>
              
            </ButtonGroup>

          
          <div className='flex_row center-gap-wrap'>
            <ButtonGroup
            sx={{
            display:'flex',
            // height:40,
            alignItems:'center',
            justifyContent:'center'
          }}
          size='small'
            >
            
            
            <ButtonGroup
            sx={{
            display:'flex',
            // height:40,
            alignItems:'center',
            justifyContent:'center'
          }}
          size='small'
            >
              <Button
            variant='outlined'
              onClick={() => setActionMode('merge')}
              disabled={!image || rectangles.length === 0}
            >
              <FluentColorLinkMultiple24/> 合并
            </Button></ButtonGroup>
              <Button
              variant='outlined'
              onClick={() => setActionMode('horizontal')}
              disabled={!image || rectangles.length === 0}
            >
              <FluentEmojiFlatLeftRightArrow/> 横切
            </Button>
            <Button 
              variant='outlined'
              onClick={() => setActionMode('vertical')}
              disabled={!image || rectangles.length === 0}
            >
              <FluentEmojiFlatUpDownArrow/>纵切
            </Button>
            </ButtonGroup>
          </div>
          
          <ButtonGroup
          sx={{
            display:'flex',
            // height:40,
            alignItems:'center',
            justifyContent:'center'
          }}
           size='small'>
            <Button
            // color='error'
            // size='small'
              onClick={handleUndo}
              disabled={currentHistoryIndex <= 0}
            >
            <FluentEmojiFlatLeftArrow/>后退
            </Button>
            <Button
            // color='success'
            // size='small'
              onClick={handleRedo}
              disabled={currentHistoryIndex >= history.length - 1}
            >
              重做<FluentEmojiFlatRightArrow/> 
            </Button>
            
          </ButtonGroup>
          <div><Button
            variant='outlined'
            // color='success'
              onClick={handleExport}
              size='small'
              disabled={!image || rectangles.length === 0}
            ><FluentColorArrowSquare24/>
            下载
            </Button>{image && (
              <Button 
                
                // color='error'
                onClick={handleReset}
              >
                <FluentColorDismissCircle24/>重置
              </Button>
            )}</div>
          
          
        </Box>
        
        <StyledInputPlaced className='flex_col'>
          {image ? (
            <>
            <Box className='flex_row chipRow'>
                <Chip
                size='small'
                 color="info"
                 variant='filled'
                 label={'原始尺寸:' + originalImageSize.width +'×'+ originalImageSize.height +'像素'}/>
                <Chip
                size='small'
                 color="info"
                 variant='filled'
                 label={'显示比例:' + (displayScale * 100).toFixed(0)+'%'}/>
                 <Chip
                size='small'
                 color="info"
                 variant='filled'
                 label={'矩形数:'+rectangles.length}/>
                {selectedRect&&<Chip
                size='small'
                 color="info"
                 variant='filled'
                 label={'选中矩形:' + selectedRect.x +','+ selectedRect.y +'-'+selectedRect.width+'×'+selectedRect.height}/>
                }
              </Box>
              <Box 
                className='flex_col' sx={{
                borderTop: '1px dashed',
                borderColor:(theme)=>theme.palette.divider,
                borderRadius: '0px 0px 8px 8px',
                padding:2,
                backgroundColor:(theme)=>theme.palette.background.paper ,


              }} style={{
                flex: '1',
                justifyContent: 'center',
                alignItems: 'center',
                // minHeight: '400px',
                
              }}>

                <canvas 
                  ref={canvasRef} 
                  onClick={handleCanvasClick}
                  style={{ 
                    width: canvasSize.width, 
                    height: canvasSize.height,
                    // background: 'white',
                    // border:'1px solid red',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                              
              </Box>
            </>
          ) : (
<FileUpload clickEvent={()=>{fileInputRef.current?.click()}}></FileUpload>
          )}
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </StyledInputPlaced>
      </div>
    </div>
  );
};

export default HandleImg;
