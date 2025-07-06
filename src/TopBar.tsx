import { NavLink, useLocation} from "react-router"
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {Button, Menu, MenuItem, Typography, alpha, Box} from "@mui/material"
import StyledButton,{StyledBox} from './styledComponents/StyledCompo'
import {type ThemeMode} from './context/Context'
import {MeteoconsClearDayFill, MeteoconsClearNightFill, MeteoconsSolarEclipseFill} from './icon/MyIcon'
import { 
    // useContext,
    // useEffect,
    // useEffect, 
    useState, 
    type JSX
} from "react";

interface TopbarPro{
    theme:ThemeMode,
    isSmallScreen:boolean,
    autoToggleDrawer:()=>void,
    setThemeMode:(mode:ThemeMode)=>void
}
interface ModeLs{
    name: string | JSX.Element,
    value:ThemeMode
}
export default function TopBar(props:TopbarPro){
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const setDash = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    const allMode:ModeLs[] = [
        {name:<MeteoconsSolarEclipseFill/>,value:'system'}, 
        {name:<MeteoconsClearNightFill/>,value:'dark'}, 
        {name:<MeteoconsClearDayFill/>,value:'light'}]
    const path = useLocation().pathname.slice(1).split('/')
    const jionPath = (ind:number):string=>"/"+path.slice(0,ind+1).join('/')
    return<StyledBox
    className={"flex_row topfade " + (props.isSmallScreen?"mobletopbar":"topbar")}
    >{props.isSmallScreen&&<StyledButton
    onClick={()=>props.autoToggleDrawer()}
    style={{minWidth:0,width:32,borderRadius:12,height:32,}}
    // variant="outlined"
    ><DragHandleIcon color="primary"/></StyledButton>}
        <div className='flex_row topbarcontainer'>
        <NavLink
    to='/'><Typography color="primary">导航</Typography></NavLink>
    {path.map((val, ind)=><div key={ind}><NavLink end to={jionPath(ind)}><Typography color="primary">/{val}</Typography></NavLink></div>)}
    </div>
        {
        props.isSmallScreen?<div>
            <Button
            onClick={setDash}
             size="small" variant="outlined">主题</Button>
            <Menu 
            slotProps={{list:{
                sx:{padding:0}
            }}}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                    {allMode.map(mode=><MenuItem sx={{
                        bgcolor:(theme)=>alpha(props.theme ===mode.value?theme.palette.primary.main:theme.palette.background.paper, 0.2)

                    }} key={mode.value} onClick={()=>{props.setThemeMode(mode.value);handleClose()}}>{mode.name}</MenuItem>)}
                    
            
            </Menu>
            </div>:<Box sx={{
                gap:4
            }} className = 'flex_row'>
            <Typography>主题 </Typography>
            <Box sx={(theme)=>({
                borderRadius:theme.shape.borderRadius,
                border:'1px solid',
                borderColor:theme.palette.divider,
                overflow:'hidden',
                alignItems:'center',
            })} className="flex_row">
                
{/* <Typography variant="body1">主题 </Typography> */}
            {allMode.map(mode=>
                
                <Box key={mode.value} sx={{
                    bgcolor:(theme)=>alpha(props.theme ===mode.value?theme.palette.primary.main:theme.palette.background.paper, 0.2),
                    // textAlign:'center',
                    display:'flex',
                    // alignItems:'center'
                    justifyContent:'center'
                    
                }}  onClick={()=>props.setThemeMode(mode.value)}>{mode.name}</Box>)}</Box></Box>}
    </StyledBox>
}