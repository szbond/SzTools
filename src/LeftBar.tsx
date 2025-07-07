// import { NavLink,  } from "react-router"
import {StyledNavlink, StyledBox, StyledLeftBox, StyledTypography, StyledToolBox} from './styledComponents/StyledCompo'
interface Links {
name: string;
path: string;
}
interface LeftBarProps{
    isSmallScreen:boolean
}
import {Typography, Button} from '@mui/material'

import {MaterialIconTheme3d} from './icon/MyIcon'

export default function LeftBar(props:LeftBarProps){
    // console.log({useTheme:useTheme()});
    
    
    const links = [
        {
            name:'切图工具',
            path:'./SplitImg'

        },
        {
            name:'长图拼接',
            path:'./JoinImg'},
        {
            name:'模糊背景',
            path:'./FadeBground'},
        
    ]
    return<div
    className={"flex_col text_left  "+(props.isSmallScreen?"leftbarmobel":"leftbar")}
    ><StyledBox
    className="leftbarGap topfade"><Button
    style={{minWidth:0,width:32,borderRadius:12,height:32,padding:0}}
    variant="text"
    ><MaterialIconTheme3d/></Button>
    <Typography variant="body2" color="primary" align="center">SzTools</Typography>
    </StyledBox>
        <StyledLeftBox sx={{
        }} className="leftBarItems ">
            <StyledToolBox className='flex_col'>
                <StyledTypography variant="caption">图片工具
                </StyledTypography>
                {links.map((link:Links, ind:number)=><StyledNavlink key={ind} className='leftBarItem text_left'  to={link.path}>
                    <Typography sx={{paddingLeft:3,alignContent:'center'}} variant="body1">
                        {link.name}
                        </Typography>
                    </StyledNavlink>)}
            </StyledToolBox>
        </StyledLeftBox>
        </div>
}