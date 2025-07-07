// interface Image{
//     src:string,
// }
import * as StackBlur from 'stackblur-canvas';
// import {image} from 'stackblur-canvas';
import {
    StyledInputPlaced, 
    // StyledCatureBox
} from '../styledComponents/StyledCompo'
// import {CatppuccinImage} from '../icon/MyIcon'
import { Box, Button, Chip, InputAdornment, TextField, Typography } from "@mui/material"
import React, { useRef, useState, } from "react"
import FileUpload from './FileUpload'
import { FluentColorDismissCircle24, FluentColorArrowSquare24,  FluentColorArrowSync24} from '../icon/MyIcon'
const FadeBground:React.FC = ()=>{
const [originalImage, setOriginalImage] = useState<string | null>(null);
const [radius, setRadius] = useState<number | null>(null);
// const [fileresult, setFileresult] = useState<number | null>(null);
const [processedImage, setProcessedImage] = useState<string | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
const [blurR, setBlurR] = useState<number>(40);
const canvasRef = useRef<HTMLCanvasElement>(null)
    // const [processedUrl, setProcessedUrl] = useState<string|null>(null)
const fileInputRef = useRef<HTMLInputElement>(null)
const [error, setError] = useState<string | null>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      setError('请上传有效的图片文件 (JPEG, PNG, GIF)');
      return;
    setError(null);
    setIsProcessing(true);
    setProcessedImage(null);
    }
    try{
    
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // 断言event.target.result为字符串类型
      const result = event.target?.result;
      if (typeof result === 'string') {
        setOriginalImage(result);
        processImage(result);
        // reader.readAsDataURL(file);
      } else {
        setError('图片读取失败');
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError('图片读取错误');
      setIsProcessing(false);
    };
    
    reader.readAsDataURL(file);

    }
    catch(error){alert(error)}

  };
  const processImage = (src: string) => {

    const img = new Image();
    img.src = src;
    img.onload = () => {

      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;

      const ctx = canvas.getContext('2d');


      if (!ctx) {
        setError('无法创建画布上下文');
        setIsProcessing(false);
        return;
      }
      
      // 设置画布尺寸为原图尺寸
      // 1. 计算原始比例
      const originalRatio = img.width / img.height;
      
      // 2. 确定目标绘制尺寸（根据您的需求设置最大边）
      const MAX_DRAW_SIZE = 1024; // 绘制到画布上的实际显示尺寸
      let drawWidth, drawHeight;
      
      if (img.width > img.height) {
        drawWidth = Math.min(img.width, MAX_DRAW_SIZE);
        drawHeight = drawWidth / originalRatio;
      } else {
        drawHeight = Math.min(img.height, MAX_DRAW_SIZE);
        drawWidth = drawHeight * originalRatio;
      }
      
      // 3. 创建画布（尺寸是绘制尺寸的2倍）

      canvas.width = drawWidth * 2;
      canvas.height = drawHeight * 2;
    // canvas.width = img.width;
    //   canvas.height = img.height;
    //   ctx.scale(2, 2);
      // 创建模糊背景
      createBlurBackground(ctx, img, canvas);
      //在原图中心绘制原始图片
      if(radius){
        ctx.beginPath();
        ctx.moveTo(drawWidth/2 + radius, drawHeight/2);

        ctx.arcTo(3/2*drawWidth, drawHeight/2, 3/2*drawWidth, 3/2*drawHeight, radius);
        ctx.arcTo(3/2*drawWidth, 3/2*drawHeight, drawWidth/2, 3/2*drawHeight, radius);
        ctx.arcTo(drawWidth/2, 3/2*drawHeight, drawWidth/2, drawHeight/2, radius);
        ctx.arcTo(drawWidth/2, drawHeight/2, 3/2*drawWidth, drawHeight/2, radius);
        ctx.closePath();
        ctx.clip();
        

      }
      
      ctx.drawImage(
        img,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      
      // 生成处理后的URL
      const finalUrl = canvas.toDataURL('image/jpeg', 0.9)||canvas.toDataURL('image/png')
      setProcessedImage(finalUrl);
      setIsProcessing(false);
    };
    
    img.onerror = () => {
      setError('图片加载失败');
      setIsProcessing(false);
    };
    
  };
  const createBlurBackground = (
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    canvas: HTMLCanvasElement
  )=>{
    if(blurR<0 || blurR>255
    ){
        setError('模糊半径请限制在0-255')
        return}

    const blurCanvas = document.createElement('canvas');
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) {
        setError('find no blurCtx')
        return};

    const blurFactor = 0.3;
    blurCanvas.width = img.width * blurFactor;
    blurCanvas.height = img.height * blurFactor;

    blurCtx.drawImage(img, 0, 0, blurCanvas.width, blurCanvas.height);
    StackBlur.image(img, blurCanvas, blurR, true);
    const blurStrength = 40;

    ctx.drawImage(
      blurCanvas, 
      0, 0, blurCanvas.width, blurCanvas.height,
      -blurStrength, -blurStrength, // 扩大模糊区域以消除边缘留白
      canvas.width + blurStrength * 2, 
      canvas.height + blurStrength * 2
    );                

  }
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
      setOriginalImage(null)
      setProcessedImage(null)
      setBlurR(40)
      setRadius(null)
    }

  }

    return<Box sx={{padding: '32px 24px'}} className="flex_col allCenter" >
        <input style={{display:'none'}} accept="image/*"  ref={fileInputRef} type="file" onChange={handleImageUpload} />
        <canvas style={{ display: 'none' }} ref={canvasRef}></canvas>
        <Box className="flex_col allCenter">
            <Typography variant='h4' sx={{fontWeight: 'bold'}} component="h1" gutterBottom color='primary'>模糊背景框</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>上传图片，生成一个原图模糊的背景框</Typography>
        </Box>
        <StyledInputPlaced sx={{width:'90%'}}>
            {processedImage&&<Box className='flex_row allCenter' sx={{
                padding:1,
                gap:2,
                // height:50,
                borderBottom:'1px dashed',
                borderBottomColor:(theme)=>theme.palette.divider
                }}>
                    {error&&<Chip color='error' label={error}/>}
                    {isProcessing&&<Chip label='处理中'/>}
                    
                    <TextField slotProps={{
                        input:{
                            endAdornment: <InputAdornment position="end">px</InputAdornment>,
                        }
                    }} onChange={(e)=>{setRadius(parseInt(e.target.value))}} label='圆角' sx={{width:100}} defaultValue={0} size='small' type='number'/>
                    <TextField  onChange={(e)=>setBlurR(Math.max(parseInt(e.target.value),0))} label='模糊度' sx={{width:100}} defaultValue={40} size='small' type='number'/>
                    {originalImage&&<><Button variant='outlined' color='success'sx={{height:30}} onClick={()=>{processImage(originalImage)}}> <FluentColorArrowSync24/>生成</Button><Button sx={{height:30}} variant='outlined'  onClick={handleDownload}><FluentColorArrowSquare24/>下载</Button><Button sx={{height:30}} variant='outlined'  color='error' size='small' onClick={handleReset}><FluentColorDismissCircle24/>重置</Button></>}
                </Box>}
        

        
        {originalImage?<Box sx={{
            bgcolor:(theme)=>theme.palette.background.paper

        }} className="flex_col allCenter">
            <Box className='flex_row' sx={{maxWidth:'90%'}}>
                <img width={'50%'} src={originalImage}/>
                {processedImage &&<img width={'50%'} src={processedImage }/>}

            </Box>
            
        
        </Box>:<FileUpload clickEvent={()=>{fileInputRef.current?.click()}}/>
            }</StyledInputPlaced>
        

    </Box>

}
export default FadeBground