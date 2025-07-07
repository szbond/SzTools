import React, { 
    // useRef, 
    // useState 
} from "react"
import { StyledCatureBox } from "../styledComponents/StyledCompo"
import { CatppuccinImage } from "../icon/MyIcon"
import { Button } from "@mui/material"
const FileUpload:React.FC<{clickEvent:()=>void}> = ({clickEvent})=>{
    // console.log(targetInput);
    
    return<div className='flex_col allCenter' style={{
              flex: '1',
              padding: '40px',
              textAlign: 'center'
            }}>
              <StyledCatureBox className='flex_row allCenter'>
                <span style={{ fontSize: '48px', color: '#3498db' }}><CatppuccinImage/></span>
              </StyledCatureBox>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#2c3e50' }}>选择一张图片</h3>
              <p style={{ color: '#34495e', marginBottom: '20px', maxWidth: '400px' }}>支持 JPG、PNG 格式的图片文件 </p>
              
              <Button 
              variant='contained'
                // onClick={() => targetInput?.click()}
                onClick={() =>clickEvent()
                }
                >
                选择图片
              </Button>
            </div>

}
export default FileUpload