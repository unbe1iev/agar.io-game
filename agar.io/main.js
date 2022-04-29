//Some variables that we use:
const updateFPS = 60
let time = 0
const bgColor = '#ddd'
let delta
let deltaTime = 0;
let score = 0
let player
let frameTimer
let finishGame = false
let ww // window width
let wh // window height

class Vec2{
    constructor(x, y){
        this.x = x
        this.y = y
    }

    set(x,y){
        this.x = x
        this.y = y
    }

    move(x, y){
        this.x += x
        this.y += y
    }

    sub(v){
        return new Vec2(this.x - v.x, this.y - v.y)
    }

    mul(s){
        return new Vec2(this.x * s, this.y * s)
    }

    get length(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    clone(){
        return new Vec2(this.x, this.y)
    }

    toString(){
        return `(${this.x}, ${this.y})`
    }

    get unit(){
        return this.mul(1/this.length)
    }
}

const canvas = document.getElementById('mycanvas')
const ctx = canvas.getContext('2d')

let bonus = []
const bots = [] // array of bots

function twodimensional_table(num) {
    const tab = new Array(num)

    for (let i = 0; i < num; i++) {
        tab[i] = []
    }

    return tab;
}

bonus = twodimensional_table(20);

function withBonusCollisionDetect(){
    for (let i = 0; i<bonus.length; i++){
        if ((Math.pow((bonus[i][0] - player.p.x), 2) + Math.pow((player.p.y - bonus[i][1]), 2)) <= Math.pow((player.r + bonus[i][2]), 2)){
            player.mass += 100;
            score += 10

            bonus[i][0] = randInt(-1480, 1480)
            bonus[i][1] = randInt(-1480, 1480)
            bonus[i][3] = randRGB()
        }
    }
}

function withBotsCollisionDetect(){
    bots.forEach((bot,index) => {
        if ((Math.pow((bot.p.x-player.p.x), 2) + Math.pow((player.p.y-bot.p.y), 2)) <= Math.pow((player.r+bot.r), 2)){
            if(player.mass > bot.mass){
                player.mass += bot.mass / 2
                score += 100
                bots.splice(index, 1)
            } else if (player.mass < bot.mass){
                bot.mass += player.mass / 2
                delete player
                finishGame = true
                alert("You Lost!")
                location.reload()
            }
        }
    });
}

ctx.circle = function(v, r){
    this.arc(v.x, v.y, r, 0, Math.PI*2)
}

ctx.line = function(v1,v2){
    this.moveTo(v1.x, v1.y)
    this.lineTo(v2.x, v2.y)
}

function initCanvas(){
    ww = canvas.width = window.innerWidth
    wh = canvas.height = window.innerHeight
}

function randInt(min, max) {
    if (Number.isInteger(min) && Number.isInteger(max)){
        if (max > min){
            return Math.floor(Math.random() * max) + 1
        } else throw 'Minimum is greater than Maximum value'
    } else throw 'Minimum or maximum is not an integer type value'
}

function randRGB() {
    return `rgb(${randInt(0, 220)}, ${randInt(0, 220)}, ${randInt(0, 220)})`
}

function angleToRads(angle) { return angle * Math.PI / 180 }

initCanvas()

const global = {
    scale: 1,
    width: 3000,
    height: 3000,
    collideFactor: 0
};

function map(value, min, max, nmin, nmax){
    let l1 = max-min
    let l2 = nmax-nmin
    let ratio = l2/l1
    return (value-min)*ratio+nmin
}

class Player{
    constructor(args){
        let def = {
            id: randInt(1, 100),
            p: new Vec2(0,0),
            v: new Vec2(map(Math.random(),0,1,-5,5),map(Math.random(),0,1,-5,5)),
            a: new Vec2(0,0),
            mass: 500,
            color: randRGB()
        }

        Object.assign(def, args)
        Object.assign(this, def)
    }

    draw(){
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.p.x, this.p.y, this.r, angleToRads(0), angleToRads(360))
        ctx.fill()
        ctx.closePath()
    }

    update(){
        this.p.move(this.v.x,this.v.y)
        this.v.move(this.a.x,this.a.y)
        this.checkBorder()
    }

    checkBorder(){
        if ((this.p.x-this.r) < (-global.width/2)){
            this.p.x = -global.width/2 + this.r
        }
        if ((this.p.x +this.r) > (global.width/2)){
            this.p.x = global.width/2 - this.r
        }
        if ((this.p.y-this.r) < (-global.height/2)){
            this.p.y = -global.height/2 + this.r
        }
        if ((this.p.y+this.r) > (global.height/2)){
            this.p.y = global.height/2 - this.r
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

    for (let i = 0; i<bonus.length; i++){
        bonus[i][0] = randInt(-1480, 1480)
        bonus[i][1] = randInt(-1480, 1480)
        bonus[i][2] = 5
        bonus[i][3] = randRGB()
    }

    setInterval(function(){
        let scale = 1/Math.log(Math.sqrt(player.r)/4+2)
        console.log(scale)
    },2000)

}

function update(){
    time++
    if (finishGame){
        clearInterval(frameTimer)
        ctx.fillText("You Lost!", 10, 90);
        alert("You Lost! ;)")
        location.reload()
        return
    }

    delta = mousePos.sub(new Vec2(ww/2,wh/2))

    if (delta.length > 1){
        delta = delta.unit.mul(player.maxSpeed-7)
    }
    player.v = delta
    deltaTime += 1000/updateFPS // in [ms]
}

function draw(){
    if (finishGame){
        clearInterval(frameTimer)
        ctx.fillText("You Lost!", 10, 90);
        alert("You Lost! ;)")
        location.reload()
        return
    }
    ctx.fillStyle=bgColor
    ctx.fillRect(0,0,ww,wh)

    ctx.save()

    ctx.translate(ww/2, wh/2)
    ctx.scale(global.scale, global.scale)
    ctx.translate(-player.p.x, -player.p.y)
    ctx.beginPath()

    let gridWidth = 300
    let gcount = global.width/2/gridWidth

    //grid
    for(let i=-gcount;i<=gcount;i++){
        ctx.moveTo(i*gridWidth,-global.width/2)
        ctx.lineTo(i*gridWidth,global.width/2)
        ctx.moveTo(-global.height/2,i*gridWidth)
        ctx.lineTo(global.height/2,i*gridWidth)
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    ctx.stroke()

    for (let i = 0; i < bonus.length; i++){
        ctx.beginPath()
        ctx.fillStyle = bonus[i][3]
        ctx.arc(bonus[i][0], bonus[i][1], bonus[i][2], angleToRads(0), angleToRads(360), false)
        ctx.fill()
        ctx.closePath()
    }

    player.draw()
    player.update()

    withBonusCollisionDetect()
    withBotsCollisionDetect()

    // This will continue with the bots feature
    bots.forEach(bot => {
        bot.draw()
        bot.update()
    });

    ctx.restore()

    ctx.font='25px Consolas'
    ctx.fillStyle='black'
    ctx.fillText("Score: " + parseInt(score) + " Mass: " + parseInt(player.mass),10,30)

    if (finishGame){
        ctx.font='50px Consolas'
        ctx.fillStyle='black'
        ctx.fillText('Score: '+ parseInt(score),global.ww/2,global.wh/2)
        clearInterval(frameTimer)
    } else requestAnimationFrame(draw)
}

function onLoad(){
    initCanvas()
    init()
    requestAnimationFrame(draw)
    frameTimer = setInterval(update,1000/updateFPS)
}

window.addEventListener('load', onLoad)
window.addEventListener('resize', initCanvas)

let mousePos = new Vec2(0,0)
let mousePosDown = new Vec2(0,0)
let mousePosUp = new Vec2(0,0)

window.addEventListener('mousemove', onMouseMove)
window.addEventListener('mouseup', onMouseUp)
window.addEventListener('mousedown', onMouseDown)

function onMouseMove(evt){
    mousePos.set(evt.x, evt.y)
}

function onMouseUp(evt){
    mousePos.set(evt.x, evt.y)
    mousePosUp = mousePos.clone()
}

function onMouseDown(evt){
    mousePos.set(evt.x, evt.y)
    mousePosDown = mousePos.clone()
}

