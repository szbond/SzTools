// interface Image{
//     src:string,
// }
import React, { useRef, useState } from "react"
const FadeBground:React.FC = ()=>{
    const [image, setImage] = useState<HTMLImageElement|null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>)=>{
        //上传照片
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            setImage(img);
        }
        img.src = event.target?.result as string;
    }
        

    }
    return<div className="flex_col">
        <input ref={fileInputRef} type="file" onChange={handleImageUpload} />
        <div onClick={() => fileInputRef.current?.click()}>上传照片</div>
        {image&&<div>展示照片<img src={image.src}/></div>}
    </div>

}
export default FadeBground