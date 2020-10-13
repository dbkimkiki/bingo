import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/RGBELoader.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';

var container, controls, threejsElement;
var camera, scene, threejsRenderer;
let mercuryObject;
var stats;
var showStats = false;

const canvas = document.getElementById('bingocanvas');
let curVideo = null;
let isDebug = false;
let debugElement = null;
let usePreview = true;
let previewAlpha = 0.6;
let isDark = true;
let textOnTopLandscape = true;

let bingoMatched = false;
let bingoFadeOutFrames = 150;
let spriteDestroyed = false;
let itemsDestroyed = false;
let endPhase = 0;
let radioFadeInFrames = 300;
let waitRedirectFrames = 150;

let restoreImage = true;
let disableUnclickable = false;
let playVideoInBingoBox = true;
let loadedVideos = 0;

let strokeWidth = 1;
let strokeColor, fontColor, rectColor;
let screenColor, deltaAlpha;
if(isDark)
{
  strokeColor = 0x000000;
  fontColor = 0xffffff;
  rectColor = 0xffffff;
}
else
{
  strokeColor = 0xffffff;
  fontColor = 0x484848;
  //fontColor = 0x000000;
  rectColor = 0xeeeeee;
}
if(false){
  strokeColor = 0xffffff;
  //fontColor = 0x404040;
  fontColor = 0x000000;
  rectColor = 0xeeeeee;
}

//let highlightColor = 0x479ad5;
//let highlightColor = 0x484848;
let highlightColor = 0xeeeeee;

let fontSizeOffset = -12;

let autoclick = true;
let animateMode = false;
let verticalMode; //boolean
let xOffset = 0;
let yOffset = 0;
// let screenWidth = window.innerWidth;
// let screenHeight = window.innerHeight;
let viewportWidth = document.documentElement.clientWidth;
let viewportHeight = document.documentElement.clientHeight;
let screenWidth = window.screen.width;
let screenHeight = window.screen.height;
let innerWidth = window.innerWidth;
let innerHeight = window.innerHeight;
let rectLength;
let spriteArray = [];
let previewSpriteArray = [];
let videoArray = [];
let bingoBoxVideoArray = [];
let xLoc = [];
let yLoc = [];
//let rectArray = [];
let showArray = [];
let textArray = [];
let bingoArray = [
  120, 119, 95, 109, 99, 18,
  113, 96, 91, 115, 97, 112,
  108, 90, 116, 114, 94, 103,
  102, 98, 110, 107, 89, 92,
  117, 93, 104, 87, 88, 85,
  101, 100, 105, 106, 86, 111
];
let clickableArray = [
  1, 1, 0, 1, 1, 1,
  1, 1, 1, 1, 1, 0,
  1, 0, 1, 1, 1, 1,
  1, 1, 1, 0, 1, 1,
  0, 1, 1, 1, 1, 1,
  0, 1, 1, 1, 1, 1
];
let playableArray = [
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0
];

let videoEndTimeArray = [
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0
];
let graphicsArray = [];
let useHighlight = true;

let beforeX = 0;
let beforeY = 0;

let decreaseScale = 0;
let increaseScale = 0;
let deltaScale = 0;
let deltaPosX = 0;
let deltaPosY = 0;
let selectedImage = null;
let curImage = null;

let toggled = false;
let inAnimation = false;
let pendingResize = false;
let isLoaded = false;
let loadedCnt = 0;
let videoLoaded = [];

let increaseMovementFrames = 15;
let decreaseMovementFrames = 15;
let currentMovementFrame = 0;
let shakyFrame = 0;
let shakyMaxFrames =20;

let originX = 0;
let originY = 0;



window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

let isMobileEnv = window.mobileCheck();
if(!isMobileEnv)
{
  fontSizeOffset = -4;
}


//let strokeColor = 0x8A8A8A; //grey
//let fontColor = 0xeeeeee;


let textStyle = new PIXI.TextStyle({
  fontFamily: ['-apple-system','BlinkMacSystemFont',"Segoe UI",'Roboto',"Helvetica Neue",'Arial',"Noto Sans",'sans-serif',"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"],
  fontSize: 36,
  //fontStyle: 'italic',
  //fontWeight: 'lighter',
  fontWeight: '400',
  fill: fontColor,
  //stroke: '#4a1850',
  //strokeThickness: 5,
  //dropShadow: true,
  //dropShadowColor: '#000000',
  //dropShadowBlur: 4,
  //dropShadowAngle: Math.PI / 6,
  //dropShadowDistance: 6,
  //wordWrap: true,
  //wordWrapWidth: 440,
});


if(isDebug)
{
  debugElement = document.getElementsByClassName('debug-text')[0];
}
else
{
  for(let i=0;i<document.getElementsByClassName('debug-text').length;i++)
  {
    document.getElementsByClassName('debug-text')[i].style.display = 'none';
  }
}

const stage = new PIXI.Container();
const loader = PIXI.Loader.shared;
stage.sortableChildren = true;

let graphics = new PIXI.Graphics();
let renderWidth = viewportWidth;
let renderHeight = viewportHeight;

if(!document.getElementById('mercury-play-back'))
{
  let span = document.createElement("SPAN");
  span.setAttribute("id", "mercury-play-back");
  span.innerHTML = 'Mercury Play Back';
  document.getElementById('bingo').appendChild(span);
}

if(isDebug)
{
  console.log('viewportWidth: ' +viewportWidth);
  console.log('viewportHeight: ' +viewportHeight);
  console.log('screenWidth: ' +screenWidth);
  console.log('screenHeight: ' +screenHeight);
  debugElement.innerHTML = viewportWidth.toString() +', '+viewportHeight.toString()+', '+screenWidth.toString() +', '+screenHeight.toString()+', '+window.innerWidth.toString() +', '+window.innerHeight.toString();
}

//SETUP
if(viewportWidth<viewportHeight)
{
  verticalMode = true;
  if(window.mobileCheck())
  {
    rectLength = screenWidth;
    renderWidth = screenWidth;
  }
  else
  {
    rectLength = viewportWidth;
    renderWidth = viewportWidth;
  }

  
  xOffset = 0;
  yOffset = (viewportHeight - rectLength) / 2;

  if(document.getElementById('mercury-play-back'))
  {
    if(yOffset >=80)
    {
      yOffset += yOffset/3;
      document.getElementById('mercury-play-back').style.display = 'block';
      document.getElementById('mercury-play-back').style.left = (rectLength/2).toString()+'px';
      document.getElementById('mercury-play-back').style.top = (yOffset/2).toString()+'px';
    }
    else
    {
      document.getElementById('mercury-play-back').style.display = 'none';
    }
    /*
    if(!window.mobileCheck())
    {
      document.getElementById('mercury-play-back').style.fontSize = '200%';
    }
    */
  }
  
}
else
{
  verticalMode = false;
  rectLength = innerHeight;
  xOffset = (viewportWidth - rectLength) / 2;
  yOffset = 0;
  renderHeight = innerHeight;
  if(document.getElementById('mercury-play-back'))
  {
    if(textOnTopLandscape)
    {
      if(innerHeight>400)
      {
        yOffset += rectLength/6;
        document.getElementById('mercury-play-back').style.display = 'block';
        document.getElementById('mercury-play-back').style.top = (yOffset/2).toString()+'px';
        document.getElementById('mercury-play-back').style.left = '50%';
        rectLength -= yOffset * 3 / 2;
        xOffset = (viewportWidth - rectLength) / 2;
      }
      else
      {
        document.getElementById('mercury-play-back').style.display = 'none';
      }
    }
    else
    {
      if(xOffset >=150)
      {
        xOffset += xOffset/1.5;
        document.getElementById('mercury-play-back').style.display = 'block';
        document.getElementById('mercury-play-back').style.top = (rectLength/2).toString()+'px';
        document.getElementById('mercury-play-back').style.left = (xOffset/2).toString()+'px';
      }
      else
      {
        document.getElementById('mercury-play-back').style.display = 'none';
      }
    }
    
  }
  
}

document.getElementById('bingo-loading').style.left = (xOffset + rectLength / 2).toString()+'px';
document.getElementById('bingo-loading').style.top = (yOffset + rectLength / 2).toString()+'px';

window.onorientationchange = function() { 

  let htmlElement =  $("html");
  let bodyElement = $("body");

  if($(window).innerWidth() < $(window).innerHeight()) {//landscape to portrait
      htmlElement.css("overflow-x","hidden");
      bodyElement.css("overflow-x", "hidden");
   } else {//portrait to landscape
      htmlElement.css("overflow","auto");
      bodyElement.css("overflow", "auto");
      //below 2 lines makes the UI not shrink in portrait mode 
      htmlElement.css("overflow-x","auto");
      bodyElement.css("overflow-x", "auto");
   }

}

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

if(isDark)
{
  screenColor = 0x000000;
}
else
{
  screenColor = 0xffffff;
}

const renderer = new PIXI.Renderer({
  view: canvas,
  width: renderWidth,
  height: renderHeight,
  autoDensity: true,
  backgroundColor: screenColor,
  resolution: window.devicePixelRatio
});

window.addEventListener('resize', resize);
//window.addEventListener('deviceorientation', resize);
window.addEventListener('orientationchange', resize);

/*
window.WebFontConfig = {
  google: {
      families: ['Noto Sans', 'Noto Sans CJK KR'],
  },

  active() {
      fontinit();
  },
};
(function() {
  const wf = document.createElement('script');
  wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
  }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
  wf.type = 'text/javascript';
  wf.async = 'true';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
}());
function fontinit() {
  // create some white text using the Snippet webfont
  const textSample = new PIXI.Text('Pixi.js text using the\ncustom "Snippet" Webfont', {
      fontFamily: 'Noto Sans',
      fontSize: 50,
      fill: 'white',
      align: 'left',
  });
  textSample.position.set(50, 200);
  stage.addChild(textSample);
}
*/





let pathArray = [];
let previewArray = [];
/*
for(let i=120;i>=85;i--)
{
    pathArray.push("images/" + i.toString() + "/main.jpg");
}
*/
for(let i=0;i<36;i++)
{
  let str = (85+i).toString();
  if(str.length>2) str = str.substring(str.length-2);
  pathArray[i] = "bingoimages/" + str + ".jpg";
  if(i!=5&&i!=10&&i!=16&&i!=22&&i!=27&&i!=32) previewArray.push("bingoimages_preview/" + str + ".jpg");
  if(useHighlight && playableArray[i])graphicsArray[i] = new PIXI.Graphics();
  //pathArray.push("bingoimages/" + str + ".jpg");
}

loader.add(pathArray).add(previewArray).add("bingoimages_preview/blank.jpg").load(setup);











function setup() {
  for(let i=0;i<36;i++)
  {
    bingoArray[i]-=85;
  }
  /*
  for(let i=120;i>=85;i--)
  {
    
    spriteArray.push(new PIXI.Sprite(
        loader.resources["images/"+i.toString()+"/main.jpg"].texture
      ));
    let str = i.toString();
    if(str.length>2) str = str.substring(str.length-2);
    textArray.push(new PIXI.Text(str));
    
    //console.log(str);
  }
  */
  for(let k=0;k<36;k++)
  {
    let i = bingoArray[k];
    let str = (i+85).toString();

    if(str.length>2) str = str.substring(str.length-2);
    /*
    try{
      spriteArray.push(new PIXI.Sprite(
        loader.resources["bingoimages/" + str + ".jpg"].texture
      ));
    }
    catch (e) {
      if (e instanceof TypeError) {
          //printError(e, true);
          console.log('type error '+str);
      } else {
          //printError(e, false);
          console.log(e);
      }
    }
    */
    try{
      spriteArray[k] = new PIXI.Sprite(
        loader.resources["bingoimages/" + str + ".jpg"].texture
      );
      if(clickableArray[k]==1)
      {
        previewSpriteArray[k] = new PIXI.Sprite(
          loader.resources["bingoimages_preview/" + str + ".jpg"].texture
        );
      }
      else
      {
        previewSpriteArray[k] = new PIXI.Sprite(
          loader.resources["bingoimages_preview/blank.jpg"].texture
        );
      }
      
      if(playableArray[k])
      {
        if(isMobileEnv)
        {
          videoArray[k] =  new PIXI.Sprite(PIXI.Texture.from("videos/"+str+"_low.mp4"));
        }
        else
        {
          videoArray[k] =  new PIXI.Sprite(PIXI.Texture.from("videos/"+str+".mp4"));
        }

        bingoBoxVideoArray[k] = new PIXI.Sprite(PIXI.Texture.from("videos/"+str+"_low.mp4"));
        
      }
    }
    catch (e) {
      if (e instanceof TypeError) {
          //printError(e, true);
          console.log('type error '+str);
      } else {
          //printError(e, false);
          console.log(e);
      }
    }
    

    textArray[k] = new PIXI.Text(str);
    
    //console.log(str);
  }
  if(rectLength>=800)
  {
    strokeWidth = 5;
    textStyle.fontSize = 36+fontSizeOffset;
  }
  else if(rectLength>=600)
  {
    strokeWidth = 4;
    textStyle.fontSize = 32+fontSizeOffset;
  }
  else if(rectLength>=400)
  {
    strokeWidth = 3;
    textStyle.fontSize = 28+fontSizeOffset;
  }
  else if(rectLength>=250)
  {
    strokeWidth = 2;
    textStyle.fontSize = 24+fontSizeOffset;
  }
  else
  {
    strokeWidth = 1;
    textStyle.fontSize = 20+fontSizeOffset;
  }

  
  strokeWidth = 1;
  
  graphics.lineStyle(strokeWidth, strokeColor, 1, 0);
  graphics.beginFill(rectColor);
  graphics.zIndex = -1;
  for(let i=0;i<36;i++)
  {
    //let i = bingoArray[k];
    xLoc[i] = xOffset + (rectLength*(i%6)/6)+rectLength/12;
    yLoc[i] = yOffset + (rectLength*parseInt(i/6)/6)+rectLength/12;
    spriteArray[i].x= xLoc[i];
    spriteArray[i].y= yLoc[i];
    spriteArray[i].width = rectLength/6 - 2*strokeWidth;
    spriteArray[i].height = rectLength/6 - 2*strokeWidth;
    spriteArray[i].num = i;

    spriteArray[i].interactive = true;
    spriteArray[i].anchor.set(0.5);
    spriteArray[i].on('pointerdown', onClick);
    showArray[i] = false;
    spriteArray[i].alpha = 0;

    if(usePreview)
    {
      //graphics.drawRect(xOffset + (rectLength*(i%6)/6), yOffset + (rectLength*parseInt(i/6)/6), rectLength/6, rectLength/6);
      previewSpriteArray[i].x= xLoc[i];
      previewSpriteArray[i].y= yLoc[i];
      previewSpriteArray[i].width = rectLength/6 - 2*strokeWidth;
      previewSpriteArray[i].height = rectLength/6 - 2*strokeWidth;
      previewSpriteArray[i].num = i;
      previewSpriteArray[i].zIndex = -0.8;
      previewSpriteArray[i].alpha = previewAlpha;

      previewSpriteArray[i].anchor.set(0.5);
      stage.addChild(previewSpriteArray[i]);
    }
    else
    {
      graphics.drawRect(xOffset + (rectLength*(i%6)/6), yOffset + (rectLength*parseInt(i/6)/6), rectLength/6, rectLength/6);
    }
    
    //graphics.on('pointerdown', rectClick);
    /*
    rectArray[i] = new PIXI.Graphics();
    rectArray[i].lineStyle(strokeWidth, strokeColor, 1, 0);
    rectArray[i].beginFill(rectColor);
    rectArray[i].drawRect(xOffset + (rectLength*(i%6)/6), yOffset + (rectLength*parseInt(i/6)/6), rectLength/6, rectLength/6);
    rectArray[i].endFill();
    */
    //rectArray[i].zIndex = -1;
    //rectArray[i].lineStyle(alignment = 0, color = 0xf30149);
    //rectArray[i].lineStyle.color = 0xf30149;
    textArray[i].x = xLoc[i];
    textArray[i].y = yLoc[i];
    textArray[i].anchor.set(0.5);
    textArray[i].style = textStyle;
    textArray[i].zIndex = -0.5;
    stage.addChild(textArray[i]);
    stage.addChild(spriteArray[i]);
    if(playableArray[i])
    {
      videoArray[i].x = xOffset;
      videoArray[i].y = yOffset;
      videoArray[i].width = rectLength;
      videoArray[i].height = rectLength;
      videoArray[i].zIndex = 1;
      videoArray[i].interactive;
      stage.addChild(videoArray[i]);
      videoArray[i].texture.baseTexture.resource.source.pause();
      videoLoaded[i] = false;
      spriteArray[i].video = videoArray[i];
      videoArray[i].alpha=0;
      //videoArray[i].texture.baseTexture.resource.source.onloadstart = function(){ console.log('loading')};
      videoArray[i].texture.baseTexture.resource.source.oncanplay = function()
      { 
        videoLoaded[i] = true; document.getElementById('bingo-loading').style.display = 'none'; 
        //console.log('loaded');
        loadedVideos++;
        if(loadedVideos == 6)
        if(isDebug) debugElement.innerHTML = 'All Loaded.';
      };

      videoArray[i].texture.baseTexture.resource.source.setAttribute('muted','true');

      //console.log(videoArray[i].texture.baseTexture.resource.source);

      
      
      document.getElementById('bingo-loading').style.display = 'none';
      // paused, currentTime, duration
      // videoArray[i].texture.baseTexture.resource.source.addEventListener('loadstart', function (event) {
      //     console.log('loading');
      //   });
      // videoArray[i].texture.baseTexture.resource.source.on('loadstart', function (event) {
      //   console.log('loading');
      // });
      //videoArray[i].loop = true;

      if(useHighlight)
      {
        graphicsArray[i].lineStyle(strokeWidth * 2, highlightColor, 1, 0);
        graphicsArray[i].beginFill(0xffffff);
        graphicsArray[i].drawRect(xOffset + (rectLength*(i%6)/6) - strokeWidth, yOffset + (rectLength*parseInt(i/6)/6) - strokeWidth, rectLength/6 + 2 * strokeWidth, rectLength/6 + 2 * strokeWidth);
        graphicsArray[i].zIndex = -0.5;
        graphicsArray[i].alpha=0;
        stage.addChild(graphicsArray[i]);
        graphicsArray[i].endFill();
      }

      if(playVideoInBingoBox)
      {
        bingoBoxVideoArray[i].x= xLoc[i];
        bingoBoxVideoArray[i].y= yLoc[i];
        bingoBoxVideoArray[i].width = rectLength/6 - 2*strokeWidth;
        bingoBoxVideoArray[i].height = rectLength/6 - 2*strokeWidth;
        bingoBoxVideoArray[i].num = i;

        bingoBoxVideoArray[i].interactive = false;
        bingoBoxVideoArray[i].anchor.set(0.5);
        bingoBoxVideoArray[i].on('pointerdown', onClick);
        bingoBoxVideoArray[i].alpha = 0;
        bingoBoxVideoArray[i].texture.baseTexture.resource.source.currentTime = 0;
        bingoBoxVideoArray[i].texture.baseTexture.resource.source.play();
        bingoBoxVideoArray[i].texture.baseTexture.resource.source.loop = true;
        stage.addChild(bingoBoxVideoArray[i]);
      }
      
    }
    loadedCnt++;
    if(loadedCnt==36)
    {
      isLoaded = true;
      if(pendingResize)
      {
        pendingResize = false;
        resize();
      }
    }
  }
  stage.addChild(graphics);
  graphics.endFill();

  if(spriteArray[0]!=null)
  {
    decreaseScale = spriteArray[0].scale.x;
    let temp = spriteArray[0].width;
    spriteArray[0].width = rectLength/6;
    increaseScale = spriteArray[0].scale.x * 6;
    spriteArray[0].width = temp;
  }

  function onClick(p) {
    if(bingoMatched) return;
    //console.log("This before: "+this.zIndex);
    //console.log('Image '+k+' is clicked');
    if(toggled == false && inAnimation == false)
    {
      
      if(this.alpha!=0)
      {
        //when sprite is showing, and bingo number is hidden

        if(disableUnclickable && clickableArray[this.num]==0) return;
        beforeX = this.x;
        beforeY = this.y;
        //this.x = xOffset + rectLength/2;
        //this.y = yOffset + rectLength/2;
        //console.log("Scale: "+this.scale.x);
        //this.scale.x *= 6;
        //this.scale.y *= 6;
        for(let i=0;i<36;i++)
        {
          //let i = bingoArray[k];
          //console.log(i+" before "+spriteArray[i].zIndex);
          stage.setChildIndex(spriteArray[i], 0);
          //spriteArray[i].zIndex = 0;
          //console.log(i+" before "+spriteArray[i].zIndex);
        }
        this.zIndex = 1;
        //console.log("This after: "+this.zIndex);
        selectedImage = this;
        /*
        deltaScale = (increaseScale - decreaseScale) / increaseMovementFrames;
        deltaPosX = (xOffset + rectLength/2 - this.x) / increaseMovementFrames;
        deltaPosY = (yOffset + rectLength/2 - this.y) / increaseMovementFrames;
        */
        deltaScale = (increaseScale - decreaseScale);
        originX = this.x;
        originY = this.y;
        deltaPosX = (xOffset + rectLength/2 - this.x);
        deltaPosY = (yOffset + rectLength/2 - this.y);
        deltaAlpha = -1.0 / increaseMovementFrames;
        inAnimation = true;
        currentMovementFrame = 0;
        shakyFrame = 0;
        selectedImage.angle = 0;
        curImage = selectedImage;
        if(playVideoInBingoBox)
        {
          //bingoBoxVideoArray[n].alpha = 0;
          //stage.removeChild(bingoBoxVideoArray[n]);
        }
        
      }
      else
      {
        //when sprite is hidden, and bingo number is showing
        this.alpha = 1;
        let n = -1;
        for(let i = 0;i<36;i++)
        {
          //let i = bingoArray[k];
          if(spriteArray[i] == this)
          {
            //console.log('this is '+ i);
            n = i;
            break;
          }
        }
        showArray[n] = true;
        textArray[n].visible = false;
        previewSpriteArray[n].visible = false;
        if(useHighlight && playableArray[n]) graphicsArray[n].alpha=1;

        if(autoclick == true)
        {
          //when sprite is showing, and bingo number is hidden

          if(disableUnclickable && clickableArray[this.num]==0) return;
          beforeX = this.x;
          beforeY = this.y;
          //this.x = xOffset + rectLength/2;
          //this.y = yOffset + rectLength/2;
          //console.log("Scale: "+this.scale.x);
          //this.scale.x *= 6;
          //this.scale.y *= 6;
          for(let i=0;i<36;i++)
          {
            //let i = bingoArray[k];
            //console.log(i+" before "+spriteArray[i].zIndex);
            stage.setChildIndex(spriteArray[i], 0);
            //spriteArray[i].zIndex = 0;
            //console.log(i+" before "+spriteArray[i].zIndex);
          }
          this.zIndex = 1;
          //console.log("This after: "+this.zIndex);
          selectedImage = this;
          /*
          deltaScale = (increaseScale - decreaseScale) / increaseMovementFrames;
          deltaPosX = (xOffset + rectLength/2 - this.x) / increaseMovementFrames;
          deltaPosY = (yOffset + rectLength/2 - this.y) / increaseMovementFrames;
          */
          deltaScale = (increaseScale - decreaseScale);
          originX = this.x;
          originY = this.y;
          deltaPosX = (xOffset + rectLength/2 - this.x);
          deltaPosY = (yOffset + rectLength/2 - this.y);
          deltaAlpha = -1.0 / increaseMovementFrames;
          inAnimation = true;
          currentMovementFrame = 0;
          shakyFrame = 0;
          selectedImage.angle = 0;
          curImage = selectedImage;
          if(playVideoInBingoBox)
          {
            //bingoBoxVideoArray[n].alpha = 0;
            //stage.removeChild(bingoBoxVideoArray[n]);
          }
          
        }
      }
    }
    else if(toggled == true && inAnimation == false)
    {
      //when image is toggled(selected) and size is maximized
      //minimize size
      selectedImage = this;
      let k = selectedImage.num;
      // TODO
      // IF PLAYABLE, STOP AND HIDE
      if(playableArray[k])
      {
        videoArray[k].alpha = 0;
        //stage.removeChild(videoArray[k]);
        videoArray[k].texture.baseTexture.resource.source.pause();
        if(isDebug) console.log('video Paused');
        //videoLoaded = false;
        document.getElementById('bingo-loading').style.display = 'none';
      }
 
      //this.x = beforeX;
      //this.y = beforeY;
      //this.scale.x /= 6;
      //this.scale.y /= 6;
      this.zIndex = 0;
      /*
      deltaScale = (decreaseScale - increaseScale) / decreaseMovementFrames;
      deltaPosX = (beforeX - this.x) / decreaseMovementFrames;
      deltaPosY = (beforeY - this.y) / decreaseMovementFrames;
      */
      deltaScale = (decreaseScale - increaseScale);
      originX = this.x;
      originY = this.y;
      deltaPosX = (beforeX - this.x);
      deltaPosY = (beforeY - this.y);
      deltaAlpha = 1.0 / decreaseMovementFrames;
      inAnimation = true;
      currentMovementFrame = 0;
      shakyFrame = 0;
      selectedImage.angle = 0;
      curImage = null;
      curVideo = null;
    }
    
    if(!animateMode)
    {
      renderer.render(stage);
    }
    
  }


  renderer.render(stage);
  

}

/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/


function resize(){
  //if(bingoMatched) return;
  if(inAnimation||isLoaded==false)
  {
    pendingResize = true;
    return;
  }
  // screenWidth = window.innerWidth;
  // screenHeight = window.innerHeight;
  viewportWidth = document.documentElement.clientWidth;
  viewportHeight = document.documentElement.clientHeight;
  screenWidth = window.screen.width;
  screenHeight = window.screen.height;
  innerWidth = window.innerWidth;
  innerHeight = window.innerHeight;
  if(isDebug)
  {
    console.log('viewportWidth: ' +viewportWidth);
    console.log('viewportHeight: ' +viewportHeight);
    console.log('screenWidth: ' +screenWidth);
    console.log('screenHeight: ' +screenHeight);
    debugElement.innerHTML = viewportWidth.toString() +', '+viewportHeight.toString()+', '+screenWidth.toString() +', '+screenHeight.toString()+', '+window.innerWidth.toString() +', '+window.innerHeight.toString();
  }
  

  //document.getElementById('bingo').style.height = screenHeight;
  //document.getElementById('bingo').style.width = screenWidth;

  if(viewportWidth<viewportHeight)
  {
    // Portrait
    verticalMode = true;
    if(window.mobileCheck())
    {
      rectLength = screenWidth;
      renderWidth = screenWidth;
    }
    else
    {
      rectLength = viewportWidth;
      renderWidth = viewportWidth;
    }
    xOffset = 0;
    yOffset = (viewportHeight - rectLength) / 2;

    if(document.getElementById('mercury-play-back'))
    {
      if(yOffset >=80)
      {
        yOffset += yOffset/3;
        document.getElementById('mercury-play-back').style.display = 'block';
        document.getElementById('mercury-play-back').style.left = (rectLength/2).toString()+'px';
        document.getElementById('mercury-play-back').style.top = (yOffset/2).toString()+'px';
      }
      else
      {
        document.getElementById('mercury-play-back').style.display = 'none';
      }
    }
    

    renderer.resize(renderWidth, viewportHeight);
  }
  else
  {
    // Landscape
    verticalMode = false;
    rectLength = innerHeight;
    xOffset = (viewportWidth - rectLength) / 2;
    yOffset = 0;

    if(document.getElementById('mercury-play-back'))
    {
      if(textOnTopLandscape)
      {
        if(innerHeight>400)
        {
          yOffset += rectLength/6;
          document.getElementById('mercury-play-back').style.display = 'block';
          document.getElementById('mercury-play-back').style.top = (yOffset/2).toString()+'px';
          document.getElementById('mercury-play-back').style.left = '50%';
          rectLength -= yOffset * 3 / 2;
          xOffset = (viewportWidth - rectLength) / 2;
        }
        else
        {
          document.getElementById('mercury-play-back').style.display = 'none';
        }
      }
      else
      {
        if(xOffset >=150)
        {
          xOffset += xOffset/1.5;
          document.getElementById('mercury-play-back').style.display = 'block';
          document.getElementById('mercury-play-back').style.top = (rectLength/2).toString()+'px';
          document.getElementById('mercury-play-back').style.left = (xOffset/2).toString()+'px';
        }
        else
        {
          document.getElementById('mercury-play-back').style.display = 'none';
        }
      }
      
      /*
      if(!window.mobileCheck())
      {
        document.getElementById('mercury-play-back').style.fontSize = '200%';
      }
      */
    }
    
    renderer.resize(viewportWidth, innerHeight);
    
  }
  document.getElementById('bingo-loading').style.left = (xOffset + rectLength / 2).toString()+'px';
  document.getElementById('bingo-loading').style.top = (yOffset + rectLength / 2).toString()+'px';


  if(rectLength>=800)
  {
    strokeWidth = 5;
    textStyle.fontSize = 36+fontSizeOffset;
  }
  else if(rectLength>=600)
  {
    strokeWidth = 4;
    textStyle.fontSize = 32+fontSizeOffset;
  }
  else if(rectLength>=400)
  {
    strokeWidth = 3;
    textStyle.fontSize = 28+fontSizeOffset;
  }
  else if(rectLength>=250)
  {
    strokeWidth = 2;
    textStyle.fontSize = 24+fontSizeOffset;
  }
  else
  {
    strokeWidth = 1;
    textStyle.fontSize = 20+fontSizeOffset;
  }
  strokeWidth=1;

  graphics.clear();
  graphics.lineStyle(strokeWidth, strokeColor, 1, 0);
  graphics.zIndex = -1;
  graphics.beginFill(rectColor);
  for(let i=0;i<36;i++)
  {
    xLoc[i] = xOffset + (rectLength*(i%6)/6)+rectLength/12;
    yLoc[i] = yOffset + (rectLength*parseInt(i/6)/6)+rectLength/12;
    if(!spriteDestroyed)
    {
      //let i = bingoArray[k];
      
      spriteArray[i].x= xLoc[i];
      spriteArray[i].y= yLoc[i];
      spriteArray[i].width = rectLength/6 - 2*strokeWidth;
      spriteArray[i].height = rectLength/6 - 2*strokeWidth;
      spriteArray[i].zIndex = 0;
    }
    

    
    if(!itemsDestroyed)
    {
      if(usePreview)
      {
        //graphics.drawRect(xOffset + (rectLength*(i%6)/6), yOffset + (rectLength*parseInt(i/6)/6), rectLength/6, rectLength/6);
        previewSpriteArray[i].x= xLoc[i];
        previewSpriteArray[i].y= yLoc[i];
        previewSpriteArray[i].width = rectLength/6 - 2*strokeWidth;
        previewSpriteArray[i].height = rectLength/6 - 2*strokeWidth;
        previewSpriteArray[i].zIndex = -0.8;
        //spriteArray[i].interactive = true;

      }
      else
      {
        graphics.drawRect(xOffset + (rectLength*(i%6)/6), yOffset + (rectLength*parseInt(i/6)/6), rectLength/6, rectLength/6);
      }
      

      textArray[i].x = xLoc[i];
      textArray[i].y = yLoc[i];
      textArray[i].style = textStyle;
      textArray[i].zIndex = -0.5;
    }
    

    if(playableArray[i])
    {
      if(!spriteDestroyed)
      {
        videoArray[i].x = xOffset;
        videoArray[i].y = yOffset;
        videoArray[i].width = rectLength;
        videoArray[i].height = rectLength;
        //stage.addChild(videoArray[i]);
        videoArray[i].texture.baseTexture.resource.source.pause();
        //videoLoaded[i] = false;
        videoArray[i].alpha=0;
      }
      
      document.getElementById('bingo-loading').style.display = 'none';

      if(useHighlight)
      {
        graphicsArray[i].clear();
        graphicsArray[i].lineStyle(strokeWidth*2, highlightColor, 1, 0);
        graphicsArray[i].beginFill(0xffffff);
        graphicsArray[i].drawRect(xOffset + (rectLength*(i%6)/6) - strokeWidth, yOffset + (rectLength*parseInt(i/6)/6) - strokeWidth, rectLength/6 + 2 * strokeWidth, rectLength/6 + 2 * strokeWidth);
        graphicsArray[i].zIndex = -0.5;
        if(showArray[i]) graphicsArray[i].alpha=1; else graphicsArray[i].alpha=0;
        graphicsArray[i].endFill();
      }

      if(playVideoInBingoBox)
      {
        bingoBoxVideoArray[i].x= xLoc[i];
        bingoBoxVideoArray[i].y= yLoc[i];
        bingoBoxVideoArray[i].width = rectLength/6 - 2*strokeWidth;
        bingoBoxVideoArray[i].height = rectLength/6 - 2*strokeWidth;

        //bingoBoxVideoArray[i].alpha = 0;
        //bingoBoxVideoArray[i].texture.baseTexture.resource.source.pause();
      }
      
    }
    //rectArray[i].moveTo(xOffset + (rectLength*(i%6)/6), yOffset + (rectLength*parseInt(i/6)/6));

    //rectArray[i].width = rectLength/6;
    //rectArray[i].length = rectLength/6;
    //rectArray[i].zIndex = -1;
  }
  graphics.endFill();

  if(!spriteDestroyed)
  {
    if(spriteArray[0]!=null)
    {
      decreaseScale = spriteArray[0].scale.x;
      let temp = spriteArray[0].width;
      spriteArray[0].width = rectLength/6;
      increaseScale = spriteArray[0].scale.x * 6;
      spriteArray[0].width = temp;
    }

    for(let i=0;i<36;i++)
    {
      //let i = bingoArray[k];
      //spriteArray[i].alpha = 1.0;

      if(!restoreImage)
      {
        if(showArray[i])
        {
          spriteArray[i].alpha = 1.0;
          if(useHighlight && playableArray[i]) graphicsArray[i].alpha = 1.0;
        }
        else
        {
          textArray[i].alpha = 1.0;
          previewSpriteArray[i].alpha = previewAlpha;
        }
      }
      else
      { 
        spriteArray[i].alpha = 0.0;

        if(!playableArray[i])
        {
          textArray[i].visible = true;
          previewSpriteArray[i].visible = true;
          textArray[i].alpha = 1.0;
          previewSpriteArray[i].alpha = previewAlpha;
          showArray[i] = false;
        }
        else
        {
          if(showArray[i])
          {

            if(playVideoInBingoBox)
            {
              spriteArray[i].alpha = 0.0;
              bingoBoxVideoArray[i].alpha = 1;
              
              bingoBoxVideoArray[i].texture.baseTexture.resource.source.currentTime = 0;
              bingoBoxVideoArray[i].texture.baseTexture.resource.source.play();
              bingoBoxVideoArray[i].texture.baseTexture.resource.source.loop = true;
            }
            else
            {
              spriteArray[i].alpha = 1.0;
            }
            if(useHighlight) graphicsArray[i].alpha = 1.0;
          }
          else
          {
            textArray[i].visible = true;
            previewSpriteArray[i].visible = true;
            textArray[i].alpha = 1.0;
            previewSpriteArray[i].alpha = previewAlpha;
          }
        }

      }

    }
  }
  
  graphics.alpha = 1.0;
  inAnimation = false;
  toggled = false;
  curImage = null;

  if(selectedImage!=null&&!spriteDestroyed)
  {
    let k = selectedImage.num;
    // IF PLAYABLE, STOP AND HIDE
    if(playableArray[k])
    {
      videoArray[k].alpha = 0;
      //stage.removeChild(videoArray[k]);
      if(isDebug) console.log('video Paused');
      videoArray[k].texture.baseTexture.resource.source.pause();
      //videoLoaded = false;
      //console.log('remove video');
      document.getElementById('bingo-loading').style.display = 'none';
    }
  }
  

  if(!animateMode)
  {
    renderer.render(stage);
  }

  if(isDebug)
  {
    console.log('rectLength: '+ rectLength);
  }
  if(!bingoMatched)
    console.log('checkBingo: '+checkBingo());

  if(threejsRenderer != null)
  {
    threejsResize();
  }
  
}


/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------*/

const ticker = new PIXI.Ticker();
ticker.add(animate);
ticker.start();

function animate() {
  
  if(!bingoMatched)
  {
    // INCREASE IMAGE
    if(selectedImage!=null&&deltaScale>0&&currentMovementFrame<increaseMovementFrames)
    {
      let coeff = Math.sin(Math.PI/2.0*currentMovementFrame/increaseMovementFrames);
      selectedImage.scale.x = deltaScale * coeff + decreaseScale;
      selectedImage.scale.y = deltaScale * coeff + decreaseScale;
      //selectedImage.scale.x += deltaScale;
      //selectedImage.scale.y += deltaScale;
      selectedImage.x = deltaPosX * coeff + originX;
      selectedImage.y = deltaPosY * coeff + originY;
      //selectedImage.x += deltaPosX;
      //selectedImage.y += deltaPosY;
      for(let i=0;i<36;i++)
      {
        //let i = bingoArray[k];
        if(showArray[i])
        {
          //spriteArray[i].alpha += deltaAlpha;
          if(playVideoInBingoBox&&playableArray[i])
          {
            spriteArray[i].alpha = 0;
            bingoBoxVideoArray[i].alpha = (0-1) * coeff + 1;
          }
          else
          {
            spriteArray[i].alpha = (0-1) * coeff + 1;
          }
          spriteArray[i].alpha = (0-1) * coeff + 1;
          if(useHighlight && playableArray[i]) graphicsArray[i].alpha = (0-1) * coeff + 1;
        }
        else
        {
          //textArray[i].alpha += deltaAlpha;
          textArray[i].alpha = (0-1) * coeff + 1;
          previewSpriteArray[i].alpha = (0-previewAlpha) * coeff + previewAlpha;
        }
      }
      graphics.alpha = (0-1) * coeff + 1;
      selectedImage.alpha = 1.0;
      currentMovementFrame++;
    }

    // DECREASE IMAGE
    if(selectedImage!=null&&deltaScale<0&&currentMovementFrame<decreaseMovementFrames)
    {
      let coeff = Math.sin(Math.PI/2.0*currentMovementFrame/decreaseMovementFrames);
      selectedImage.scale.x = deltaScale * coeff + increaseScale;
      selectedImage.scale.y = deltaScale * coeff + increaseScale;
      //selectedImage.scale.x += deltaScale;
      //selectedImage.scale.y += deltaScale;
      selectedImage.x = deltaPosX * coeff + originX;
      selectedImage.y = deltaPosY * coeff + originY;
      //selectedImage.x += deltaPosX;
      //selectedImage.y += deltaPosY;
      for(let i=0;i<36;i++)
      {
        //let i = bingoArray[k];
        if(showArray[i])
        {
          //spriteArray[i].alpha += deltaAlpha;
          if(playVideoInBingoBox&&playableArray[i])
          {
            spriteArray[i].alpha = 0;
            bingoBoxVideoArray[i].alpha = (1-0) * coeff;
          }
          else
          {
            spriteArray[i].alpha = (1-0) * coeff;
          }
          if(useHighlight && playableArray[i]) graphicsArray[i].alpha = (1-0) * coeff;
        }
        else
        {
          //textArray[i].alpha += deltaAlpha;
          textArray[i].alpha = (1-0) * coeff;
          previewSpriteArray[i].alpha = (previewAlpha-0) * coeff;
        }
      }
      graphics.alpha = (1-0) * coeff;
      selectedImage.alpha = 1.0;
      currentMovementFrame++;
    }

    // INCREASE DONE AND STOP
    if(selectedImage!=null&&deltaScale>0&&currentMovementFrame>=increaseMovementFrames)
    {
      currentMovementFrame = 0;
      deltaScale = 0;
      selectedImage.scale.x = increaseScale;
      selectedImage.scale.y = increaseScale;
      selectedImage.x = xOffset + rectLength/2;
      selectedImage.y = yOffset + rectLength/2;
      for(let i=0;i<36;i++)
      {
        //let i = bingoArray[k];
        if(showArray[i])
        {
          spriteArray[i].alpha = 0;
          if(useHighlight && playableArray[i]) graphicsArray[i].alpha = 0;
        }
        else
        {
          textArray[i].alpha = 0;
          previewSpriteArray[i].alpha = 0;
        }
      }
      graphics.alpha = 0;
      selectedImage.alpha = 1.0;
      inAnimation = false;
      toggled = true;
      if(pendingResize)
      {
        pendingResize = false;
        resize();
      }

      // TODO
      // IF PLAYABLE, SHOW AND PLAY VIDEO
      let k = selectedImage.num;
      if(playableArray[k])
      {
        videoArray[k].alpha = 1;
        //stage.addChild(videoArray[k]);
        videoArray[k].texture.baseTexture.resource.source.currentTime = 0;
        videoArray[k].texture.baseTexture.resource.source.play();
        videoArray[k].texture.baseTexture.resource.source.loop = false;
        curVideo =  videoArray[k].texture.baseTexture.resource.source;
        if(isDebug) console.log(curVideo);
        
        //console.log(videoArray[k].texture.baseTexture.resource.source);
        
        if(!videoLoaded[k])
        {
          //console.log('video is still loading');
          document.getElementById('bingo-loading').style.display = 'block';
        }
        else
        {
          document.getElementById('bingo-loading').style.display = 'none';
        }
      }
      
    }

    // DECREASE DONE AND STOP
    if(selectedImage!=null&&deltaScale<0&&currentMovementFrame>=decreaseMovementFrames)
    {
      currentMovementFrame = 0;
      deltaScale = 0;
      selectedImage.scale.x = decreaseScale;
      selectedImage.scale.y = decreaseScale;
      selectedImage.x = beforeX;
      selectedImage.y = beforeY;
      for(let i=0;i<36;i++)
      {
        //let i = bingoArray[k];

        if(!restoreImage)
        {
          if(showArray[i])
          {
            
            if(playVideoInBingoBox&&playableArray[i])
            {
              bingoBoxVideoArray[i].alpha = 1.0;
            }
            else
            {
              spriteArray[i].alpha = 1.0;
            }
            if(useHighlight && playableArray[i]) graphicsArray[i].alpha = 1.0;
          }
          else
          {
            textArray[i].alpha = 1.0;
            previewSpriteArray[i].alpha = previewAlpha;
          }
        }
        else
        { 
          spriteArray[i].alpha = 0.0;

          if(!playableArray[i])
          {
            textArray[i].visible = true;
            previewSpriteArray[i].visible = true;
            textArray[i].alpha = 1.0;
            previewSpriteArray[i].alpha = previewAlpha;
            showArray[i] = false;
          }
          else
          {
            if(showArray[i])
            {
              

              if(playVideoInBingoBox)
              {
                spriteArray[i].alpha = 0.0;
                bingoBoxVideoArray[i].alpha = 1;
                
                bingoBoxVideoArray[i].texture.baseTexture.resource.source.currentTime = 0;
                bingoBoxVideoArray[i].texture.baseTexture.resource.source.play();
                bingoBoxVideoArray[i].texture.baseTexture.resource.source.loop = true;
              }
              else
              {
                spriteArray[i].alpha = 1.0;
              }

              if(useHighlight) graphicsArray[i].alpha = 1.0;
            }
            else
            {
              textArray[i].visible = true;
              previewSpriteArray[i].visible = true;
              textArray[i].alpha = 1.0;
              previewSpriteArray[i].alpha = previewAlpha;
            }
          }

        }




        
      }
      graphics.alpha = 1.0;
      inAnimation = false;
      toggled = false;
      if(pendingResize)
      {
        pendingResize = false;
        resize();
      }
      console.log('checkBingo: '+checkBingo());
    }

    if(curImage && !curVideo &&selectedImage!=null&&shakyFrame<=shakyMaxFrames&&deltaScale == 0)
    {
      let translatePower = 1;
      let rotationPower = 1;
      if(shakyFrame == 0)
      {
        selectedImage.x +=1 * translatePower;
        selectedImage.y +=1 * translatePower;
        selectedImage.angle += 0 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 1)
      {
        selectedImage.x -=1 * translatePower;
        selectedImage.y -=2 * translatePower;
        selectedImage.angle -= 1 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 2)
      {
        selectedImage.x -=3 * translatePower;
        selectedImage.y +=0 * translatePower;
        selectedImage.angle += 1 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 3)
      {
        selectedImage.x +=3 * translatePower;
        selectedImage.y +=2 * translatePower;
        selectedImage.angle += 0 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 4)
      {
        selectedImage.x +=1 * translatePower;
        selectedImage.y -=1 * translatePower;
        selectedImage.angle += 1 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 5)
      {
        selectedImage.x -=1 * translatePower;
        selectedImage.y +=2 * translatePower;
        selectedImage.angle -= 1 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 6)
      {
        selectedImage.x -=3 * translatePower;
        selectedImage.y +=1 * translatePower;
        selectedImage.angle += 0 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 7)
      {
        selectedImage.x +=3 * translatePower;
        selectedImage.y +=1 * translatePower;
        selectedImage.angle -= 1 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 8)
      {
        selectedImage.x -=1 * translatePower;
        selectedImage.y -=1 * translatePower;
        selectedImage.angle += 1 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 9)
      {
        selectedImage.x +=1 * translatePower;
        selectedImage.y +=2 * translatePower;
        selectedImage.angle += 0 * rotationPower;
      }
      else if(shakyFrame == shakyMaxFrames/10 * 10)
      {
        selectedImage.x +=1 * translatePower;
        selectedImage.y -=2 * translatePower;
        selectedImage.angle -= 0 * rotationPower;
      }
      
      shakyFrame++;
      if(shakyFrame==shakyMaxFrames)
      {
        //console.log('shaky Done');



        //when image is toggled(selected) and size is maximized
        //minimize size
        //let k = curImage.num;
        // TODO
        // IF PLAYABLE, STOP AND HIDE

        //this.x = beforeX;
        //this.y = beforeY;
        //this.scale.x /= 6;
        //this.scale.y /= 6;
        curImage.zIndex = 0;
        /*
        deltaScale = (decreaseScale - increaseScale) / decreaseMovementFrames;
        deltaPosX = (beforeX - this.x) / decreaseMovementFrames;
        deltaPosY = (beforeY - this.y) / decreaseMovementFrames;
        */
        deltaScale = (decreaseScale - increaseScale);
        originX = curImage.x;
        originY = curImage.y;
        deltaPosX = (beforeX - curImage.x);
        deltaPosY = (beforeY - curImage.y);
        deltaAlpha = 1.0 / decreaseMovementFrames;
        inAnimation = true;
        currentMovementFrame = 0;
        shakyFrame = 0;
        curImage.angle = 0;
        

        curVideo = null;
        curImage = null;

        if(pendingResize)
        {
          pendingResize = false;
          resize();
        }

      }
    }

    

    if(curImage && curVideo && curVideo.currentTime >= curVideo.duration-0.001)
    {
      //console.log(curVideo.currentTime);
      //console.log('duration '+curVideo.duration)


      //when image is toggled(selected) and size is maximized
      //minimize size
      let k = curImage.num;
      // TODO
      // IF PLAYABLE, STOP AND HIDE
      if(playableArray[k])
      {
        videoArray[k].alpha = 0;
        if(isDebug) console.log('video Paused');
        //stage.removeChild(videoArray[k]);
        videoArray[k].texture.baseTexture.resource.source.pause();
        //videoLoaded = false;
        document.getElementById('bingo-loading').style.display = 'none';
      }

      //this.x = beforeX;
      //this.y = beforeY;
      //this.scale.x /= 6;
      //this.scale.y /= 6;
      curImage.zIndex = 0;
      /*
      deltaScale = (decreaseScale - increaseScale) / decreaseMovementFrames;
      deltaPosX = (beforeX - this.x) / decreaseMovementFrames;
      deltaPosY = (beforeY - this.y) / decreaseMovementFrames;
      */
      deltaScale = (decreaseScale - increaseScale);
      originX = curImage.x;
      originY = curImage.y;
      deltaPosX = (beforeX - curImage.x);
      deltaPosY = (beforeY - curImage.y);
      deltaAlpha = 1.0 / decreaseMovementFrames;
      inAnimation = true;
      currentMovementFrame = 0;
      shakyFrame = 0;

      curVideo = null;
      curImage = null;

    }
  }
  else if(endPhase == 0)//if bingoMatched
  {
    if(currentMovementFrame<bingoFadeOutFrames)
    {
      let coeff = Math.sin(Math.PI/2.0*currentMovementFrame/bingoFadeOutFrames);

      for(let i=0;i<36;i++)
      {
        if(playableArray[i])
        {
          previewSpriteArray[i].alpha = 0;
          textArray[i].alpha =0;
        }
        else
        {
          previewSpriteArray[i].alpha = (0-previewAlpha) * coeff + previewAlpha;
          textArray[i].alpha = (0-1) * coeff + 1;
          
        }
        
      }
      currentMovementFrame++;
    }
    else
    {
      if(!itemsDestroyed)
      {
        itemsDestroyed = true;
        destroyAll();
        
      }
      threejsInit();
      requestAnimationFrame(render);
      endPhase = 1;
      currentMovementFrame = 0;
      
    }

  }
  else if(endPhase == 1)
  {
    if(threejsRenderer)
    {
      if(currentMovementFrame<radioFadeInFrames)
      {
        let coeff = Math.sin(Math.PI/2.0*currentMovementFrame/radioFadeInFrames);

        document.getElementById('threejs-background').style.opacity = coeff;
        currentMovementFrame++;
      }
      else
      {
        endPhase = 2;
        currentMovementFrame = 0;
      }
    }
    
  }
  else if(endPhase == 2)
  {
    if(threejsRenderer)
    {
      if(currentMovementFrame<waitRedirectFrames)
      {
        let coeff = Math.sin(Math.PI/2.0*currentMovementFrame/waitRedirectFrames);

        //document.getElementById('threejs-background').style.opacity = coeff;
        currentMovementFrame++;
      }
      else
      {
        endPhase = 3;
        currentMovementFrame = 0;
        redirect();
      }
    }
    
  }
  

  renderer.render(stage);
  if(animateMode)
  {
    requestAnimationFrame(animate);
  }
  
}


function checkBingo() {
  let isBingo = true;
  for(let i =0;i<36;i++)
  {
    if(playableArray[i])
    {
      if(!showArray[i])
      {
        isBingo = false;
        return isBingo;
      }
    }
  }
  if(isBingo)
  {
    bingoMatched = true;
    currentMovementFrame = 0;
    stage.removeChild(graphics);
    spriteDestroyed = true;
    for(let i=0;i<36;i++)
    {
      stage.removeChild(spriteArray[i]);
      stage.removeChild(videoArray[i]);
      spriteArray[i].destroy({ options: true });
      if(videoArray[i])videoArray[i].destroy({ options: true });
    }


  }
  return isBingo;
}


function destroyAll() {
  for(let i=0;i<36;i++)
  {
    stage.removeChild(previewSpriteArray[i]);
    stage.removeChild(textArray[i]);
    textArray[i].destroy({ options: true });
    previewSpriteArray[i].destroy({ options: true });
  }
  //redirect();

  
}

$('#info-alert').on('close.bs.alert', function () {
  // do something...
  document.getElementById('bingo').style.pointerEvents = 'auto';
})

function redirect() {
  window.location.replace("https://encyclopedia.osisun.ch");
}


/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------------- */



// Camera Setting
{
  var camPosX = 0; // -x to x is left to right
  var camPosY = 0; // y is camera up and down
  var camPosZ = 4; // +z farther from origin, -z into the origin
  var fov = 30;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 0.25;
  var far = 20;
}
var useControls = true;






function threejsInit() {

  container = document.querySelector('#threejs-background');
  //resizeContent();

  if(showStats)
  {
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
  }

  scene = new THREE.Scene();

  {
    
    aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(camPosX, camPosY, camPosZ);
    camera.updateProjectionMatrix();

  }

  new RGBELoader()
    .setDataType( THREE.UnsignedByteType )
    .load( 'encyclopedia/royal_esplanade_1k.hdr', function ( texture ) {

      var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

      scene.environment = envMap;
      
      texture.dispose();
      pmremGenerator.dispose();
      if(isDebug) console.log('hdr loaded');
      var gltfLoader = new GLTFLoader();

      gltfLoader.load( 'encyclopedia/resource/2.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {
          if ( child.isMesh ) {
            // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
            // roughnessMipmapper.generateMipmaps( child.material );
          }
        } );

        var objScale = 5;
        gltf.scene.children[0].scale.x = objScale;
        gltf.scene.children[0].scale.y = objScale;
        gltf.scene.children[0].scale.z = objScale;
        gltf.scene.rotation.z = -0.1;

        scene.add( gltf.scene );
        mercuryObject=gltf.scene.children[0];
        mercuryObject.parent.position.x = -0.3;
        if(window.innerHeight>window.innerWidth)
          mercuryObject.parent.position.y = -0.2;
        else
          mercuryObject.parent.position.y = 0;

        if(isDebug) console.log(mercuryObject);

        } );

  });

  {
    threejsRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    threejsRenderer.setPixelRatio( window.devicePixelRatio );
    threejsRenderer.setSize( window.innerWidth, window.innerHeight );
    threejsRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threejsRenderer.toneMappingExposure = 1;
    threejsRenderer.outputEncoding = THREE.sRGBEncoding;
    threejsElement = container.appendChild( threejsRenderer.domElement );
    /*
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.left = '0px';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.zIndex = '-1';
    */
    var pmremGenerator = new THREE.PMREMGenerator( threejsRenderer );
    pmremGenerator.compileEquirectangularShader();
  }

  // ORBIT CONTROLS
  if(useControls)
  {
    controls = new OrbitControls( camera, threejsRenderer.domElement );
    //controls.addEventListener( 'change', render ); // use if there is no animation loop
    //controls.minDistance = 2;
    controls.minDistance = 6;
    //controls.maxDistance = 10;
    if(isDebug)
    {
      controls.maxDistance = 20;
    }
    else
    {
      controls.maxDistance = 11;
    }
    
    controls.mouseButtons = {
      // LEFT: THREE.MOUSE.ROTATE,
      // MIDDLE: THREE.MOUSE.DOLLY,
      // RIGHT: THREE.MOUSE.PAN
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY
    };
    controls.touches = {
      // ONE: THREE.TOUCH.ROTATE,
      // TWO: THREE.TOUCH.DOLLY_PAN
      ONE: THREE.TOUCH.DOLLY_PAN,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.target.set( 0, 0, - 0.2 );
    var minPan = new THREE.Vector3( - 2, -1, -0.2 );
    var maxPan = new THREE.Vector3( 2, 1, -0.2 );
    var _v = new THREE.Vector3();
    
    controls.addEventListener("change", function() {
        _v.copy(controls.target);
        controls.target.clamp(minPan, maxPan);
        _v.sub(controls.target);
        camera.position.sub(_v);
        //console.log(controls.position0.z);
    })

    //createLimitPan({camera, controls, THREE});
    controls.update();
  }
}

function threejsResize() {
  console.log('Threejs canvas is resized.')
 
  let windowAspect = window.innerWidth / window.innerHeight;
  camera.aspect = windowAspect;
  camera.updateProjectionMatrix();

  threejsRenderer.setSize( window.innerWidth, window.innerHeight );

}


function render(time) {

  if(showStats) stats.begin();

  time *= 0.001; 

  try {
    mercuryObject.rotation.y = 1.2 * time * 0.5 + 2.0;
    
    

  } catch (e) {
      if (e instanceof TypeError) {
          //printError(e, true);
          console.log('Waiting object to be created');
      } else {
          //printError(e, false);
          console.log(e);
      }
  }

  threejsRenderer.render( scene, camera );

  if(showStats) stats.end();

  requestAnimationFrame(render);

}
