import React, { useState, useRef, 
  useEffect 
} from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, 
    // Card, CardContent, 
    // CardActions, 
    // Grid, 
    Box, Typography, IconButton, Container } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ReplayIcon from '@mui/icons-material/Replay';
import ImgCrop from './ImageCropper'
import {StyledUploadArea} from '../styledComponents/StyledCompo'

// 最大图片数量限制
const MAX_IMAGES = 8;

// 默认裁剪区域（高度为200px）
function defaultCrop(imageWidth: number, imageHeight: number): Crop {
  // console.log({imageWidth, imageHeight});

  const cropWidth = Math.min(300, imageWidth);
  const cropHeight = imageHeight*cropWidth/imageWidth;
    const crop = centerCrop(
    makeAspectCrop(
      {
        unit: 'px',
        width: cropWidth,
        height:cropHeight
      },
      imageWidth / imageHeight,
      cropWidth,
      cropHeight
    ),
    cropWidth,
    cropHeight
  )
  return crop
}

interface ImageData {
  id: string;
  src: string;
  name: string;
  width: number;
  height: number;
  nWidth: number;
  nHeight: number;
  crop: PixelCrop;
  aspectRatio: number;
}




function JoinImg() {
  const clickRef = useRef<HTMLDivElement>(null);
  // const [ref] = useClickOutside();
  const [enterCrop, setEnterCrop] = useState<string>('')
  // const setIsSmallScreen =  useTheme().setisSmallScreen
  // const SMALL_SCREEN_BREAKPOINT = 600
  // const [containerWidth, setContainerWidth] = useState<number>(0);
  // const containerRef = useRef<HTMLDivElement>(null);
  
  // 记录上一次的小屏幕状态
  // const lastScreenSizeRef = useRef<'small' | 'large' | null>(null);
  // useEffect(()=>{console.log({containerRef:containerRef});
  // },[])
  // 监听窗口变化和容器尺寸变化
  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      // 判断用户点击的对象是否在DOM节点内部
      if (clickRef.current?.contains(e.target as Node)) {
        return;
      }
      setEnterCrop('');
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const [images, setImages] = useState<ImageData[]>([]);

  const [isExporting, setIsExporting] = useState(false);
  const finalOutputCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

    

  

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    if (images.length >= MAX_IMAGES) {
      alert(`最多只能添加 ${MAX_IMAGES} 张图片`);
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageData[] = [];
    let completedCount:number = 0
    const filesLs = Array.from(files)
    for(let i = 0; i < files.length; i++){
      let file = filesLs[i]
            const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {     
        const aspectRatio = img.width / img.height;
        const maxW = Math.min(300,img.width);
        
          const newImage: ImageData = {
            id: Math.random().toString(36).substring(7),
            src: img.src,
            name: file.name,
            nWidth:img.width,
            nHeight:img.height,
            width: maxW,
            height: img.height*maxW/img.width,
            aspectRatio: aspectRatio,
            crop: defaultCrop(img.width, img.height) as PixelCrop,
          };
          newImages.push(newImage);
          completedCount++;
            if (completedCount === files.length) {
                    if (newImages.length > 0) {

      
            setImages(prev => [...prev, ...newImages]);
          }

    e.target.value = '';
            }
          
          
          
        };
      };
      reader.readAsDataURL(file);

    }



  };

  // 更新裁剪区域
  const handleCropChange = (id: string, crop: PixelCrop) => {
    // console.log({crop:crop});
    
    setImages(prev =>{ 
        const newCrop:ImageData[] = []
        prev.map(img =>{
        newCrop.push((img.id === id )? { ...img, crop } : img)})
        // console.log({newCrop:newCrop});
        return newCrop
        
    }
    );
  };

//   重置裁剪区域
  const handleResetCrop = (id: string) => {
    setImages(prev => 
      prev.map(img => 
        img.id === id 
          ? { ...img, crop: defaultCrop(img.width, img.height) as PixelCrop } 
          : img
      )
    );
  };

  // 删除图片
  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };
  const handleExport = () => {
    setIsExporting(true);
    

    const canvas = finalOutputCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const maxWidth = Math.max(...images.map(img => img.nWidth));
    const totalHeight = images.reduce((sum, img) => (sum + maxWidth*img.crop.height/img.crop.width), 0);
    canvas.width = maxWidth;
    canvas.height = totalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let currentY = 0;
    const drawNextImage = (index: number) => {
      if (index >= images.length) {
        try {
      const link = document.createElement('a');
      link.download = `image-stitch-${new Date().getTime()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败，请重试');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
        return;
      }
      const imgData = images[index];
      const img = new Image();
      img.src = imgData.src;
      img.onload = () => {
        const { x, y, width, height } = imgData.crop;
        const scale = imgData.width/imgData.nWidth
        ctx.drawImage(img, x/scale, y/scale,width/scale,height/scale, 0,currentY,maxWidth,maxWidth*height/width);
        currentY += maxWidth*height/width
        drawNextImage(index + 1);
      };
    };

    drawNextImage(0);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Container  maxWidth={false} sx={{width:'100%',margin:0, py: 4,maxWidth:'none'}}>
      <Box sx={{ textAlign: 'center', mb:1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          长图拼接
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          添加图片，点击并调整裁剪高度，预览导出即可
        </Typography>
      </Box>
 

      <div style={{justifyContent:'center',gap:'100px'}} className='flex_row'>
        <div>
               <StyledUploadArea onClick={triggerFileInput}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <AddPhotoAlternateIcon sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                添加图片
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                点击或拖拽图片到此处
              </Typography>
              <Typography variant="caption" color="text.secondary">
                支持 JPG, PNG 格式 (最多 {MAX_IMAGES} 张)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                已添加: {images.length}/{MAX_IMAGES}
              </Typography>
            </Box>
          </StyledUploadArea>
          {images.length > 0 && (
            <div style={{
              width:'100%',
            }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
                startIcon={<CloudDownloadIcon />}
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? '导出中...' : '导出'}
              </Button>
              <Box  sx={{ mt: 2, textAlign: 'center' }}>
              </Box><Box sx={{ mt: 3}}>
              <Typography variant="h6" gutterBottom>
                预览效果
              </Typography><div className='flex_col' style={{
                alignItems:'center'
              }}>
                {/* {images.map((img)=><div key={img.id}><ImgCrop  
                  fixedwidth={containerWidth/2}  
                src={img.src} height={img.height} width={img.width} x={img.crop.x} y={img.crop.y} cropheight={img.crop.height} cropwidth={img.crop.width}/></div>
              )} */}
              </div>
            </Box>
          
            </div>
            
          )}

          
        </div>
          {images.length === 0 ? (
            <div className='flex_col' style={{
              justifyContent:'center'
            }}>
              <Typography variant="body1" color="textSecondary" align="center">
                未添加任何图片
              </Typography>
            </div>
          ) : (
            <div className='flex_col joinImgContainer'>
              {images.map((img) =>
                  <div key={img.id}ref={clickRef} className='cropParent flex_row'>
                      
                          {img.id === enterCrop?<ReactCrop
                          style={{  
                        position: 'relative',
                        width:img.width,
                        height:img.height,
                        
                        }}
                          crop={img.crop}
                          onChange={(c) => handleCropChange(img.id, c)}
                          // keepSelection
                          ruleOfThirds
                          className="crop-container"
                          onComplete={(image) => {
                            if (img.crop.width > image.width || img.crop.height > image.height) {
                              handleResetCrop(img.id);
                            }
                          }}
                        >
                          <img 
                            src={img.src} 
                            alt={`裁剪 ${img.name}`} 
                          />
                        </ReactCrop>:<div style={{
                          position: 'relative',
                        }} onClick={()=>setEnterCrop(img.id)}>
                          <div className='float_text flex_row'>
                        <Typography variant="subtitle2" sx={{ 
                      fontWeight: 'medium', 
                      overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {img.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(img.crop.height)}px
                        </Typography>
                      </div>
                          <ImgCrop 
                  fixedwidth={img.width}  
                  src={img.src} height={img.height} width={img.width} x={img.crop.x} y={img.crop.y} cropheight={img.crop.height} cropwidth={img.crop.width}/></div>
                        }
                    <div className='flex_col' style={{
                      alignItems:'start'
                    }}>
                        
                        <IconButton 
                        color="info" 
                        onClick={() => handleResetCrop(img.id)}
                        aria-label="重置裁剪"
                        size="small"
                      >
                        <ReplayIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteImage(img.id)}
                        aria-label="删除图片"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {img.id ===enterCrop&&<IconButton 
                        color="success" 
                        onClick={() =>setEnterCrop('')}
                        aria-label="完成"
                        size="small"
                      >
                        <DoneIcon fontSize="small" />
                      </IconButton>}
                    
                    </div>
                  </div>
)}
            </div>
          )}
      </div>

      {/* 隐藏的Canvas用于生成预览 */}
      <canvas ref={finalOutputCanvasRef} style={{ display: 'none' }} />
      <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          © 浏览器纯本地性能原因 - 最多支持 {MAX_IMAGES} 张图片拼接
        </Typography>
      </Box>
    </Container>
  );
}

export default JoinImg;