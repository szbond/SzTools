// interface Image{
//     src:string,
// }
import {
    StyledInputPlaced, 
    // StyledCatureBox
} from '../styledComponents/StyledCompo'
// import {CatppuccinImage} from '../icon/MyIcon'
import { Box, Button, Typography } from "@mui/material"
import React, { useRef, useState } from "react"
import FileUpload from './FileUpload'
import { FluentColorDismissCircle24 } from '../icon/MyIcon'
const FadeBground:React.FC = ()=>{
const [originalImage, setOriginalImage] = useState<string | null>(null);
const [processedImage, setProcessedImage] = useState<string | null>(null);
//  const [isProcessing, setIsProcessing] = useState(false);
const canvasRef = useRef<HTMLCanvasElement>(null)
    // const [processedUrl, setProcessedUrl] = useState<string|null>(null)
const fileInputRef = useRef<HTMLInputElement>(null)
// const [error, setError] = useState<string | null>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
    //   setError('请上传有效的图片文件 (JPEG, PNG, GIF)');
      return;
    }
    
    // setError(null);
    // setIsProcessing(true);
    setProcessedImage(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // 断言event.target.result为字符串类型
      const result = event.target?.result;
      if (typeof result === 'string') {
        setOriginalImage(result);
        processImage(result);
      } else {
        // setError('图片读取失败');
        // setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
    //   setError('图片读取错误');
    //   setIsProcessing(false);
    };
    
    reader.readAsDataURL(file);
  };
  const processImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // setError('无法创建画布上下文');
        // setIsProcessing(false);
        return;
      }
      
      // 设置画布尺寸为原图尺寸
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 创建模糊背景
      createBlurBackground(ctx, img, canvas);
      
      // 在原图中心绘制原始图片
    //   ctx.drawImage(
    //     img,
    //     (canvas.width - img.width) / 2,
    //     (canvas.height - img.height) / 2,
    //     img.width,
    //     img.height
    //   );
      
      // 生成处理后的URL
      setProcessedImage(canvas.toDataURL('image/jpeg', 0.9));
    //   setIsProcessing(false);
    };
    
    img.onerror = () => {
    //   setError('图片加载失败');
    //   setIsProcessing(false);
    };
    
    img.src = src;
  };
  
  const createBlurBackground = (
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    canvas: HTMLCanvasElement
  ) => {
    // 创建离屏画布用于模糊处理
    const blurCanvas = document.createElement('canvas');
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) return;
    
    // 设置模糊画布尺寸（比原图小可增强模糊效果）
    const blurFactor = 0.3;
    blurCanvas.width = img.width * blurFactor;
    blurCanvas.height = img.height * blurFactor;
    
    // 绘制缩小版本
    blurCtx.drawImage(img, 0, 0, blurCanvas.width, blurCanvas.height);
    
    // 应用模糊效果
    const blurStrength = 8;
    ctx.filter = `blur(${blurStrength}px)`;
    
    // 绘制模糊背景（扩大以覆盖整个画布）
    ctx.drawImage(
      blurCanvas, 
      0, 0, blurCanvas.width, blurCanvas.height,
      -blurStrength, -blurStrength, // 扩大模糊区域以消除边缘留白
      canvas.width + blurStrength * 2, 
      canvas.height + blurStrength * 2
    );
    
    // 重置滤镜
    ctx.filter = 'none';
  };
    const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.download = 'blur-background-image.jpg';
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleReset = ()=>{
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  }

    return<Box sx={{padding: '32px 24px'}} className="flex_col allCenter" >
        <input style={{display:'none'}} accept="image/*"  ref={fileInputRef} type="file" onChange={handleImageUpload} />
        <Box className="flex_col allCenter">
            <Typography variant='h4' sx={{fontWeight: 'bold'}} component="h1" gutterBottom color='primary'>模糊背景框</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>上传图片，生成一个原图模糊的背景框</Typography>
        </Box>
        <StyledInputPlaced sx={{width:'90%'}}>
        
        {originalImage?<Box>
            <Box sx={{
                padding:1,
                borderBottom:'1px dashed',
                borderBottomColor:(theme)=>theme.palette.divider
                }}><Button color='error' size='small' onClick={handleReset}><FluentColorDismissCircle24/>重置</Button> </Box>
            <Box sx={{
            bgcolor:(theme)=>theme.palette.background.paper

        }} className="flex_col allCenter">
            {<img src={originalImage}/>}
            {processedImage &&<img src={processedImage }/>}
            <canvas style={{ display: 'none' }} ref={canvasRef}></canvas>
        
        </Box></Box>:<FileUpload clickEvent={()=>{fileInputRef.current?.click()}}/>
            }</StyledInputPlaced>
        

    </Box>

}
export default FadeBground