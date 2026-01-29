/*
  নোট:
  - Animated network background
  - Mouse interaction
*/

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let w, h;
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const mouse = { x:null, y:null, radius:160 };

window.addEventListener("mousemove", e=>{
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Dot {
  constructor(){
    this.x = Math.random()*w;
    this.y = Math.random()*h;
    this.vx = (Math.random()-0.5)*1;
    this.vy = (Math.random()-0.5)*1;
    this.r = 2.5;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,0.9)";
    ctx.fill();
  }
  update(){
    this.x+=this.vx;
    this.y+=this.vy;
    if(this.x<0||this.x>w) this.vx*=-1;
    if(this.y<0||this.y>h) this.vy*=-1;
    this.draw();
  }
}

const dots=[];
for(let i=0;i<150;i++) dots.push(new Dot());

function connect(){
  for(let i=0;i<dots.length;i++){
    for(let j=i+1;j<dots.length;j++){
      const dx=dots[i].x-dots[j].x;
      const dy=dots[i].y-dots[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<180){
        ctx.strokeStyle=`rgba(255,255,255,${1-d/180})`;
        ctx.beginPath();
        ctx.moveTo(dots[i].x,dots[i].y);
        ctx.lineTo(dots[j].x,dots[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate(){
  ctx.clearRect(0,0,w,h);
  dots.forEach(d=>d.update());
  connect();
  requestAnimationFrame(animate);
}
animate();
