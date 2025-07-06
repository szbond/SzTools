import SplitImgDemo,{type ImageFragment} from './toolDemo/SplitImgDemo'
// import aImg4 from '../assets/demo/splitImg/fragment-4.jpg'
import aImg1 from '../assets/demo/splitImg/fragment-1.jpg'
import aImg10 from '../assets/demo/splitImg/fragment-10.jpg'
import aImg2 from '../assets/demo/splitImg/fragment-2.jpg'
import aImg4 from '../assets/demo/splitImg/fragment-4.jpg'
import aImg3 from '../assets/demo/splitImg/fragment-3.jpg'
import aImg5 from '../assets/demo/splitImg/fragment-5.jpg'
import aImg6 from '../assets/demo/splitImg/fragment-6.jpg'
import aImg7 from '../assets/demo/splitImg/fragment-7.jpg'
import aImg8 from '../assets/demo/splitImg/fragment-8.jpg'
import aImg9 from '../assets/demo/splitImg/fragment-9.jpg'
export default function DefaultWelcome(){
    const imgFrs:ImageFragment[] =[{
        id: 'fr5',
        url: aImg5,
        x: 0,       // 在完整图片中的x坐标（百分比）
        y: 0,     // 在完整图片中的y坐标（百分比）
        width: 1/2,  // 在完整图片中的宽度占比
        height: 2/5,

    },{
        id: 'fr7',
        url: aImg7,
        x: 1/2,       // 在完整图片中的x坐标（百分比）
        y: 0,     // 在完整图片中的y坐标（百分比）
        width: 1/2,  // 在完整图片中的宽度占比
        height: 1/5,

    },{
        id: 'fr6',
        url: aImg6,
        x: 1/2,       // 在完整图片中的x坐标（百分比）
        y: 1/5,     // 在完整图片中的y坐标（百分比）
        width: 1/2,  // 在完整图片中的宽度占比
        height: 2/5,

    },{
        id: 'fr10',
        url: aImg10,
        x: 0,       // 在完整图片中的x坐标（百分比）
        y: 2/5,     // 在完整图片中的y坐标（百分比）
        width: 1/4,  // 在完整图片中的宽度占比
        height: 2/5,

    },{
        id: 'fr1',
        url: aImg1,
        x: 1/4,       // 在完整图片中的x坐标（百分比）
        y: 2/5,     // 在完整图片中的y坐标（百分比）
        width: 1/4,  // 在完整图片中的宽度占比
        height: 1/5,

    },{
        id: 'fr8',
        url: aImg8,
        x: 1/4,       // 在完整图片中的x坐标（百分比）
        y: 3/5,     // 在完整图片中的y坐标（百分比）
        width: 1/2,  // 在完整图片中的宽度占比
        height: 1/5,

    },{
        id: 'fr2',
        url: aImg2,
        x: 3/4,       // 在完整图片中的x坐标（百分比）
        y: 3/5,     // 在完整图片中的y坐标（百分比）
        width: 1/4,  // 在完整图片中的宽度占比
        height: 1/5,

    },{
        id: 'fr3',
        url: aImg3,
        x: 0,       // 在完整图片中的x坐标（百分比）
        y: 4/5,     // 在完整图片中的y坐标（百分比）
        width: 1/4,  // 在完整图片中的宽度占比
        height: 1/5,

    },{
        id: 'fr9',
        url: aImg9,
        x: 1/4,       // 在完整图片中的x坐标（百分比）
        y: 4/5,     // 在完整图片中的y坐标（百分比）
        width: 1/2,  // 在完整图片中的宽度占比
        height: 1/5,

    },
    {
        id: 'fr4',
        url: aImg4,
        x: 3/4,       // 在完整图片中的x坐标（百分比）
        y: 4/5,     // 在完整图片中的y坐标（百分比）
        width: 1/4,  // 在完整图片中的宽度占比
        height: 1/5,

    },
] 
    return<><SplitImgDemo fragments={imgFrs} aspectRatio={2550/3300}/></>
}