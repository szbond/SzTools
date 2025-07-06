import React, { type CSSProperties, memo } from 'react';

interface ImgCropProps {
  x: number;
  y: number;
  cropwidth: number;
  cropheight: number;
  width: number;
  height: number;
  src: string;
  fixedwidth: number;
  className?: string;
  isSmallScreen?: boolean;
}

const ImgCrop: React.FC<ImgCropProps> = memo(({
  x,
  y,
  cropwidth,
  cropheight,
  width,
  height,
  src,
  fixedwidth,
  className,
//   isSmallScreen
}) => {
  // 计算宽高比
//   const aspectRatio = cropheight / cropwidth;
  
  // 计算缩放比例
  const scale = fixedwidth > 0 ? fixedwidth / cropwidth : 0;
  
  // 计算偏移
  const translateX = -x * scale;
  const translateY = -y * scale;
  
  // 图片实际尺寸
  const imgWidth = width * scale;
  const imgHeight = height * scale;
  
  // 容器样式
  const containerStyle: CSSProperties = {
    width: `${fixedwidth}px`,
    position: 'relative',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    aspectRatio: `${cropwidth} / ${cropheight}`,
    // borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    margin: '0 auto'
  };
  
  const imgContainerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  };
  
  const imgStyle: CSSProperties = {
    position: 'absolute',
    width: `${imgWidth}px`,
    height: `${imgHeight}px`,
    transform: `translate(${translateX}px, ${translateY}px)`,
    maxWidth: 'none',
    display: 'block'
  };
  

  return (
    <div className={`img-crop-container ${className || ''}`}>
      <div style={containerStyle} aria-label="Cropped image preview">
        <div style={imgContainerStyle}>
          <img
            src={src}
            alt="Cropped content"
            style={imgStyle}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = '#e0e0e0';
              target.alt = 'Failed to load image';
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default ImgCrop;