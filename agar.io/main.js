//Some variables that we use:
const updateFPS = 60;
let time = 0;
const bgColor = "#ddd";
let delta
let deltaTime = 0;
let score = 0
let player
let frameTimer;
let finishGame = false;

class Vec2{
  constructor(x,y){
    this.x = x
    this.y = y
  }

  set(x,y){
    this.x =x
    this.y =y
  }

  move(x,y){
    this.x+=x
    this.y+=y
  }

  sub(v){
    return new Vec2(this.x-v.x,this.y-v.y)
  }

  mul(s){
    return new Vec2(this.x*s,this.y*s)
  }

  get length(){
    return Math.sqrt(this.x*this.x+this.y*this.y)
  }

  set length(nv){
    let temp = this.unit.mul(nv)
    this.set(temp.x,temp.y)
  }

  clone(){
    return new Vec2(this.x,this.y)
  }

  toString(){
    return `(${this.x}, ${this.y})`
  }

  equal(v){
    return this.x===v.x && this.y ===v.y
  }

  get unit(){
    return this.mul(1/this.length)
  }
}

const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");

let bonus = [];
const bots = [];

function twodimensional_table(number) {
  const tab = new Array(number);
  for (let i = 0; i < number; i++) {
      tab[i] = [];
    }
    return tab;
}

bonus = twodimensional_table(10);

function withBonusCollisionDetect(){
    for (let i = 0; i<bonus.length; i++){
        if ((Math.pow((bonus[i][0]-player.p.x), 2) + Math.pow((player.p.y-bonus[i][1]), 2)) <= Math.pow((player.r+bonus[i][2]), 2)){
            player.mass = 100;
            
            bonus[i][0] = rand(-1480, 1480)
            bonus[i][1] = rand(-1480, 1480)
            bonus[i][3] = randRGB()
        }
    }
}

function withBotsCollisionDetect(){
  bots.forEach((bot,index) => {
    
    if ((Math.pow((bot.p.x-player.p.x), 2) + Math.pow((player.p.y-bot.p.y), 2)) <= Math.pow((player.r+bot.r), 2)){
      if(player.mass > bot.mass){
        player.mass+=bot.mass
        score +=100
        bots.splice(index, 1)
      } else if (player.mass < bot.mass){
        bot.mass+=player.mass
        delete player
        finishGame = true
        alert("YOU LOST! XD")
        location.reload()
      }
  }
  });
}

ctx.circle= function(v,r){
  this.arc(v.x,v.y,r,0,Math.PI*2)
}

ctx.line= function(v1,v2){
  this.moveTo(v1.x,v1.y)
  this.lineTo(v2.x,v2.y)
}

function initCanvas(){
  ww = canvas.width = window.innerWidth
  wh = canvas.height = window.innerHeight
}

function rand(min, max) {
    min = parseInt(min, 10)
    max = parseInt(max, 10)

    if (min > max) {
        var tmp = min
        min = max
        max = tmp
    }

    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randRGB() {
    return `rgb(${rand(0, 220)}, ${rand(0, 220)}, ${rand(0, 220)})`
}

function katToRad(kat) { return kat * Math.PI / 180 }

initCanvas()

const global = {
  scale: 1,
  width: 3000,
  height: 3000,
  collideFactor: 0
};

function map(value,min,max,nmin,nmax){
  let l1 = max-min
  let l2 = nmax - nmin
  let ratio = l2/l1
  return (value-min)*ratio+nmin
}

class Player{
  constructor(args){
    let def = {
      id: parseInt(Math.random() * 100000),
      p: new Vec2(0,0),
      v: new Vec2(map(Math.random(),0,1,-5,5),map(Math.random(),0,1,-5,5)),
      a: new Vec2(0,0), 
      mass: 500,
      color: randRGB()
    }
    
    Object.assign(def,args)
    Object.assign(this,def)
  }

  draw(){
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.p.x, this.p.y, this.r, katToRad(0), katToRad(360))
    ctx.fill()
    ctx.closePath()
  }

  update(){
    this.p.move(this.v.x,this.v.y)
    this.v.move(this.a.x,this.a.y)
    this.mass += 3
    this.checkBoundary()
  }

  checkBoundary(){
    if (this.p.x-this.r<-global.width/2){
      this.p.x = -global.width/2+this.r
    }
    if (this.p.x +this.r> global.width/2){
      this.p.x = global.width/2-this.r
    }
    if (this.p.y-this.r<-global.height/2){
      this.p.y = -global.height/2+this.r
    }
    if (this.p.y+this.r>global.height/2){
      this.p.y = global.height/2-this.r
    }
  }

  get r(){
    return Math.sqrt(this.mass)
  }

  get maxSpeed(){
    return ((30/(1+Math.log(this.r*2)))+3)
  }
}

class Bot{
  constructor(args){
    let def = {
      id: parseInt(Math.random() * 100000),
      p: new Vec2(rand(-1500, 1500),rand(-1500, 1500)),
      v: new Vec2(map(Math.random(),0,1,-5,5),map(Math.random(),0,1,-5,5)),
      a: new Vec2(0,0), 
      mass: 80,
      color: randRGB()
    }
    Object.assign(def,args)
    Object.assign(this,def)
  }

  draw(){
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.p.x, this.p.y, this.r, katToRad(0), katToRad(360))
    ctx.fill()
    ctx.closePath()
  }

  update(){
    //this.p.move(this.v.x,this.v.y)
    //this.v.move(this.a.x,this.a.y)
    this.mass += 3
    this.checkBoundary()

    if (this.mass < player.mass)
    {
      //here
      //for (var i = 0; i<bonus.length; i++){

      //}
    }else{

    }
  }

  checkBoundary(){
    if (this.p.x-this.r<-global.width/2){
      this.p.x = -global.width/2+this.r
    }
    if (this.p.x +this.r> global.width/2){
      this.p.x = global.width/2-this.r
    }
    if (this.p.y-this.r<-global.height/2){
      this.p.y = -global.height/2+this.r
    }
    if (this.p.y+this.r>global.height/2){
      this.p.y = global.height/2-this.r
    }
  }

  get r(){
    return Math.sqrt(this.mass)
  }

  get maxSpeed(){
    return ((30/(1+Math.log(this.r*2)))+3)
  }
}

function init(){

  player = new Player()

  for (let i = 0; i < 10; i++) {
    bots.push(new Bot())
    
  }

  for (let i = 0; i<bonus.length; i++){
    bonus[i][0] = rand(-1480, 1480)
    bonus[i][1] = rand(-1480, 1480)
    bonus[i][2] = 5
    bonus[i][3] = randRGB()
  }

  setInterval(function(){
    let scale = 1/Math.log(Math.sqrt(player.r)/4+2)
  },2000)
  
}

function update(){
  time++
  if (finishGame){
    clearInterval(frameTimer)
    ctx.fillStyle = gradient
    ctx.fillText("You Lost!", 10, 90);
    alert("You Lost! ;)")
    location.reload()
    return
  }

  delta = mousePos.sub(new Vec2(ww/2,wh/2)).mul(0.01)
  if (delta.length > 1){
    delta = delta.unit.mul(player.maxSpeed)
  }
  player.v = delta
  deltaTime += 1000/updateFPS // in [ms]
}

var cen=new Vec2(0,0)

function draw(){
  if (finishGame){
    clearInterval(frameTimer)
    ctx.fillStyle = gradient
    ctx.fillText("You Lost!", 10, 90);
    alert("You Lost! ;)")
    lcoation.reload()
    return
  }
  ctx.fillStyle=bgColor
  ctx.fillRect(0,0,ww,wh)
  
  ctx.save()

    ctx.translate(ww/2,wh/2)
    ctx.scale(global.scale,global.scale)
    ctx.translate(-player.p.x,-player.p.y)
    ctx.beginPath()
  
    let gridWidth=300
    let gcount = global.width/2/gridWidth

    //grid
    for(let i=-gcount;i<=gcount;i++){
      ctx.moveTo(i*gridWidth,-global.width/2)
      ctx.lineTo(i*gridWidth,global.width/2)
      ctx.moveTo(-global.height/2,i*gridWidth)
      ctx.lineTo(global.height/2,i*gridWidth)
    }

    ctx.strokeStyle="rgba(0,0,0,0.4)"
    ctx.stroke()

    for (let i = 0; i < bonus.length; i++){
      ctx.beginPath()
      ctx.fillStyle = bonus[i][3]
      ctx.arc(bonus[i][0], bonus[i][1], bonus[i][2], katToRad(0), katToRad(360), false)
      ctx.fill()
      ctx.closePath()
   }

    player.draw()
    player.update()

    withBonusCollisionDetect()
    withBotsCollisionDetect()

    bots.forEach(bot => {
      bot.draw()
      bot.update()
    });

    ctx.restore()
  
  
  ctx.font="25px Consolas"
  ctx.fillStyle="black"
  ctx.fillText("Score: "+ parseInt(score),10,30)
  
  if (finishGame){
    ctx.font="50px Consolas"
    ctx.fillStyle="black"
    ctx.fillText("Score: "+ parseInt(score),global.ww/2,global.wh/2)
    clearInterval(frameTimer)
    return
  } else requestAnimationFrame(draw)
}

function loaded(){
  initCanvas()
  init()
  requestAnimationFrame(draw)
  frameTimer = setInterval(update,1000/updateFPS)
}

window.addEventListener("load",loaded)
window.addEventListener("resize",initCanvas)

let mousePos = new Vec2(0,0)
let mousePosDown = new Vec2(0,0)
let mousePosUp = new Vec2(0,0)

window.addEventListener("mousemove",mousemove)
window.addEventListener("mouseup",mouseup)
window.addEventListener("mousedown",mousedown)

function mousemove(evt){
  mousePos.set(evt.x,evt.y)
}

function mouseup(evt){
  mousePos.set(evt.x,evt.y)
  mousePosUp = mousePos.clone()
  
}

function mousedown(evt){
  mousePos.set(evt.x,evt.y)
  mousePosDown = mousePos.clone()
}

