// import { BorderBottom } from '@mui/icons-material'
// import { BorderLeft } from '@mui/icons-material'
// import { Height } from '@mui/icons-material'
// import { Height } from '@mui/icons-material'
import{styled, Box, alpha,Typography,} from '@mui/material'
import { NavLink } from 'react-router'
const StyledButton = styled('button')(({theme})=>[
    {
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        border:'1px solid'
    },
    theme.applyStyles('dark', {
        '&:hover':{
        borderColor:theme.palette.primary.dark[600],
        background: 'hsla(210, 14%, 13%, 0.8)',
        boxShadow: `${theme.palette.common.black} 0 1px 2px 0`,
    },
    '&:active':{
        background:'hsl(210, 14%, 9%)'
    },
        borderColor:'rgba(48, 56, 64, 0.5)',
        backgroundColor: 'hsla(210, 14%, 13%, 0.2)',
        boxShadow: `hsla(210, 14%, 22%, 0.3) 0 1px 0 inset, ${theme.palette.common.black} 0 -1px 0 inset, ${theme.palette.common.black} 0 1px 2px 0`,
  }),
  theme.applyStyles('light', {
    '&:hover':{
        boxShadow: 'hsla(215, 15%, 89%, 0.5) 0 1px 2px 0',
        borderColor:theme.palette.grey[300],
        background: theme.palette.grey[50],
    },
    '&:active':{
        background:theme.palette.grey[100]
    },
    borderColor: 'hsl(210, 14%, 87%)',
    backgroundColor:'hsla(210, 14%, 92%, 0.1)',
    boxShadow:'#FFF 0 1px 0 inset, hsla(215, 15%, 89%, 0.4) 0 -1px 0 inset, hsla(215, 15%, 89%, 0.5) 0 1px 2px 0'

  }),

])
//顶部状态栏
export const StyledBox = styled(Box)(({theme})=>[
    {
        borderBottom:'1px solid',
        backdropFilter:'blur(8px)'
    },
    theme.applyStyles('dark',{
        borderBottomColor:'rgba(61, 71, 81, 0.3)',
        backgroundColor:'rgba(15, 18, 20, 0.6)'


    }),
    theme.applyStyles('light',{
        backgroundColor:'rgba(255, 255, 255, 0.6)',
        borderBottomColor:'rgb(232, 234, 238)',



    }),
])
export const StyledNavlink = styled(NavLink)(({theme})=>[
    {
        padding:0,
        minHeight:40,
        // marginTop:2,
        '&::before':{
                position: 'relative',
                left: 12,
                width: 1,
                
                // height:'100%',
                content:'" "',
                zIndex:5,

            },
            // zIndex:50,
    },
    theme.applyStyles('dark',{
        color:'rgb(182, 190, 201)',
        '&:hover':{
            color:' #fff',
            backgroundColor: 'hsla(210, 14%, 13%, 0.4)'
        },
        '&.active':{
            '&:hover':{
                backgroundColor:'hsl(210, 14%, 22%)',
                color:'hsl(210, 100%, 80%)'
            },
            color:'rgb(102, 179, 255)',
            backgroundColor:'rgb(29, 33, 38)',
            '&::before':{
                position: 'relative',
                left: 12,
                width: 1,
                // zIndex:100,
                content:'" "',
                background: 'rgb(102, 179, 255)',

            }

        },
        


    }),
    theme.applyStyles('light',{
        color:'rgb(26, 30, 35)',
        '&:hover':{color:'hsl(200, 10%, 4%)',backgroundColor:'hsl(215, 15%, 97%)'},
        '&.active':{
            color:'rgb(0, 107, 214)',
            backgroundColor:'rgb(235, 245, 255)',
            '&:hover':{
                backgroundColor:'hsla(210, 100%, 90%, 0.8)',
                color:'hsl(210, 100%, 38%)'
            },
            '&::before':{
                position: 'relative',
                left: 12,
                width: 1,
                // zIndex:0,
                content:'" "',
                background: 'rgb(25, 118,210)',


            }

        },
        



    }),
])
export const StyledLeftBox = styled(Box)(({theme})=>[
    {
        borderRight:'1px solid',
    },
    theme.applyStyles('dark',{
        borderRightColor:'rgba(61, 71, 81, 0.3)',
    }),theme.applyStyles('light',{
        borderRightColor:'rgb(232, 234, 238)',
    }),
])
export const StyledTypography = styled(Typography)(({theme})=>[
    {
        padding:'4px 24px',
        color:theme.palette.text.secondary,
        '&::after':{
        display: 'flex',
        position: 'absolute',
        content: '" "',
        width: 10,
        // zIndex: 3,
        borderRadius: 2,
        top:7,
        left: 7,
        height: 10,
        border:'1px solid'}
    },
    theme.applyStyles('dark',{
        '&::after':{
            backgroundColor: 'rgba(29, 33, 38, 0.8)',
        borderColor:'  rgba(48, 56, 64, 0.6)',
        }
         
    }),theme.applyStyles('light',{
        '&::after':{
            backgroundColor: 'hsla(215, 15%, 97%, 0.5)',
        borderColor:'hsl(215, 15%, 89%)',}
         
    }),
])
export const StyledToolBox = styled(Box)(({theme})=>[
    {
        position: 'relative',
        zIndex: 0,
        gap:4,
        '&::before':{
            position: 'absolute',
            content: '" "',
            width: 1,
            zIndex: 2,
            top:18,
            left: 12,
            height: 'calc(100% - 18px)',
            
        }
    },
    theme.applyStyles('dark',{
        '&::before':{backgroundColor: 'rgb(29, 33, 38)',}
       


    }),
    theme.applyStyles('light',{
        '&::before':{
        backgroundColor: 'hsl(215, 15%, 92%)',}



    }),
])
export const StyledUploadArea = styled(Box)(({ theme }) => ({
  margin:10,
  border: `2px dashed`,
  borderColor:theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
//   transition: 'border-color 0.3s, background-color 0.3s',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
//   height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
export const StyledInputPlaced = styled(Box)(({theme})=>({
              border:'1px dashed',
              padding:4,
              borderRadius:2,
              backgroundColor:alpha(theme.palette.divider, 0.05),
              borderColor:theme.palette.divider,

}))
export const StyledDemoBox = styled(Box)(({theme})=>[{
    border:'1px solid',
    borderColor:theme.palette.divider,
    // boxShadow:theme.shadows[2]

},theme.applyStyles('light',{
    // border:'1px solid',
    // borderColor:theme.palette.divider,
    boxShadow:'hsl(200, 0%, 100%) 0 1px 0 inset, hsla(215, 15%, 92%, 0.4) 0 -1px 0 inset, hsla(215, 15%, 89%, 0.5) 0 1px 2px 0'
},),theme.applyStyles('dark',{
    // border:'1px solid',
    // borderColor:theme.palette.divider,
    boxShadow:`hsla(210, 14%, 22%, 0.1) 0 1px 0 inset, ${theme.palette.common.black} 0 -1px 0 inset, ${theme.palette.common.black} 0 1px 2px 0`
})])
export const StyledCatureBox = styled(Box)(({theme})=>[{
    borderRadius: 6,      
    // bgcolor:theme.palette.background.paper,
    backgroundColor:alpha(theme.palette.divider, 0.01),
    border:'1px solid',
    borderColor:theme.palette.divider,
    '&:hover':{
        backgroundColor:theme.palette.background.paper,
        borderColor:theme.palette.primary.main,



    }
}])
export default StyledButton