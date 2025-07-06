// interface Image{
//     src:string,
// }
import {StyledInputPlaced} from '../styledComponents/StyledCompo'

import { Box, Typography } from "@mui/material"
import React, { useRef, useState } from "react"
const FadeBground:React.FC = ()=>{
    const [image, setImage] = useState<HTMLImageElement|null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        //上传照片
        const file = e.target.files?.[0];    
        if (!file) return;
        // console.log('sss');
        
        const reader = new FileReader();
        // console.log('sss');
        reader.onload = (event) => {
        // console.log('sss');
        const img = new Image();
        img.onload = () => {
            setImage(img);
        }
        img.src = event.target?.result as string;
        // console.log(img.src);
        
    }
    reader.readAsDataURL(file);
        

    }
    const handleResetImg = (e:React.MouseEvent<HTMLButtonElement>)=>{
        setImage(null)
        console.log(e);
        

    }
    return<Box sx={{padding: '32px 24px'}} className="flex_col allCenter" >
        <Box className="flex_col allCenter">
            <Typography variant='h4' sx={{fontWeight: 'bold'}} component="h1" gutterBottom color='primary'>模糊背景框</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>上传图片，生成一个原图模糊的背景框</Typography>
        </Box>
        <StyledInputPlaced>
        
        {image?<div className="flex_col allCenter">
            <img style={{
            width:200,
            objectFit:'contain'
        }} src={image.src}/>
        <button onClick={handleResetImg}>重置</button>
        </div>:<Box sx={{width:600, height:600}} onClick={() => fileInputRef.current?.click()}></Box>}</StyledInputPlaced>
        <input style={{display:'none'}} accept="image/*"  ref={fileInputRef} type="file" onChange={handleImageUpload} />

    </Box>

}
export default FadeBground