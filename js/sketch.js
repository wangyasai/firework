
var rows;
var cols;
var data;
var posX = [];
var y = [];
var posY = [];
var sum = [];
var avg = [];
var left,right,above,bottom;
var s;
let fireworks = [];
let r = [];
let oneFirework;
let firework17;
let firework18;
var time;
var s;
var a = 0;
var alpha = 255;

var alpha = [];
var viewW,viewH;

function preload(){
  data = loadTable("data/data.csv", 'csv');
}


function setup(){
  if(windowWidth<750){
    viewH = windowHeight;
    viewW = viewH*16/9;
  }else{
    viewH = windowHeight;
    viewW = windowWidth;
  }
  createCanvas(viewW,viewH);
  background(20,0,100);
  rows = data.getRowCount();
  cols = data.getColumnCount();

  if(windowWidth > 1000){
    left = width*0.1;
    right = width*0.9;
  }else{
    left = width*0.1;
    right = width*0.9;
  }
  
  above = height*0.2;
  bottom = height*0.85;

  for(var j = 1; j < cols; j++){
    sum[j] = 0;
    r[j]=[];
    for(var i = 3; i < rows; i++){
      sum[j] += data.getNum(i,j);
      r[j][i]= 0;
    }
    avg[j] = sum[j]/24;
    posX[j] = map(int((j+1)/2), 1, 50, left, right);
    y[j] = map(avg[j], 0, 200, bottom, above);  
    posY[j] = bottom;
    alpha[j] = 255;
    fireworks[j] = new Firework(posX[j],posY[j],y[j],alpha[j]);

  }
  oneFirework = new Firework(width/2, bottom-50,y[1],255);
  firework18 = new Firework(width/2,  bottom-50,y[2]+100,255);
}



function draw(){ 
  background(20);  
  
  if(a==0){
    push();
    if(windowWidth < 750){
      translate(-width/3,0);
    }
    intro();
    pop();
  }

  if(a==1){
    fireworkStart();
  }  
}


function mousePressed(){
  if(a==0){
    s = frameCount; 
  }
  a =1; 
}


function intro(){
  oneFirework.colLines(1);
  var angle = map(frameCount,100,150,PI*1.5,PI*3.5);
  noFill();
  stroke(255);
  strokeWeight(1);
  if(frameCount>100&&frameCount<150){ 
    arc(width/2, height/3+60,120,120,PI*1.5, angle); 
  }else if(frameCount>=150){
    ellipse(width/2, height/3+60,120,120); 
  }

  fill(255);  
  noStroke();
  textSize(12);
  var rr = 90;
  if(frameCount>100){
    textAlign(CENTER);
    text("除夕中午12点",width/2,height/3+60-rr);
  }
  if(frameCount>110){
    text("除夕下午6点",width/2+rr*1.3,height/3+60+5);
  }
  if(frameCount>120){
    text("大年初一0点",width/2,height/3+60+rr);
  }
  if(frameCount>130){
    line(width/2+rr+0,height/3,width/2+rr-10,height/3+60);
    text("大年初一中午12点",width/2-rr*1.4,height/3+5+60);
  }

  for(var i =0; i<4;i++){
    if(frameCount>100+i*10){
      push();
      translate(width/2,height/3+60);
      rotate(PI+i*PI/2);
      stroke(255);
      strokeWeight(1);
      line(0,60,0,70);
      pop();
    }
  }

  oneFirework.display(1);
  oneFirework.move();
  oneFirework.city(1);

  if(frameCount>200){
   fill(255,222,85,this.alpha);
   firework18.display(2);
   firework18.move();
   text("2018年数据",width/2+100,y[2]+105);
 }

 if(frameCount>300){
  fill(255,510*sin(frameCount/10));
  text("点击屏幕看城市烟花秀",width/2,height*0.7);
}   
}


function fireworkStart(){
  time = frameCount-s;

  //dot line
  for(var j = 1; j < cols; j++){
    if(j <= time){
      fireworks[j].colLines(j);
    }
  } 
  

  if(time>0){ 
    for(var i = 0 ; i < 5; i++){
      var lineY = map(i, 0, 4,bottom, above);
      for(var j = left-40; j < right+40; j+=10){
       stroke(100);
       strokeWeight(1);
       line(j,lineY,j+5,lineY);
     }
     textAlign(RIGHT);
     textSize(14);
     fill(255);
     noStroke();
     text(50*i,left-40,lineY);
   }

   var lengends = "春节零点前后十二小时的PM2.5/CO的均值";
   for (var i = 0; i < lengends.length; i++) { 
    push();
    translate(left-85,lineY+15*i);
    rotate(PI/2);
    text(lengends.charAt(i), 0,0);
    pop();
  }
}

  //fireworks
  for(var j = 1; j < cols; j++){
    if(j<= time){ 
      fireworks[j].move();
      fireworks[j].display(j);   
      fireworks[j].city(j);
      fireworks[j].infor(j);   
    } 
  }
  check();
}


class Firework{
  constructor(posX,posY,targetY,alphas) {
    this.x = posX;
    this.y = posY;
    this.tY = targetY;
    this.easing = 0.09;
    this.w = 80;
    this.r = 0; 
    this.alpha = alphas; 
  }


  display(j){  
    for(var i = 3; i < rows; i++ ){
      push();
      translate(this.x,this.y);     
      noStroke();

      var n ;
      rotate(-PI-TWO_PI/24*(i-2));  
      if(width>1000){
        n = 1.9;
      }else{
        n = 3;
      }

      r[j][i]+= (data.getNum(i,j)/n-r[j][i])*this.easing;
      this.r = r[j][i];
      var n_ = map(width,0,2000,0,5);
      var offset = map(data.getNum(i,j),0,300,0,n_);
      if ((j)%2==0) {
        fill(255,222,85,this.alpha);//黄色 2018
      } else if ((j)%2==1) {
        fill(254,82,105,this.alpha);//红色 2017
      }
      noStroke();
      if(time>j && a==1){
        beginShape();
        vertex(0,0);
        vertex(-offset ,this.r/n);
        vertex( offset ,this.r/n);
        endShape(CLOSE);
        arc(0,this.r/n,offset*2,offset*2,PI*2,PI*3);
      }else if(frameCount >100+ (24-i) && a==0){
        beginShape();
        vertex(0,0);
        vertex(-offset ,this.r/n);
        vertex( offset ,this.r/n);
        endShape(CLOSE);
        arc(0,this.r/n,offset*2,offset*2,PI*2,PI*3);
      }

      pop();        
    }    
  }


  move(){
    this.y += (this.tY- this.y)*this.easing;
  }

  //city name
  city(j){
    fill(220);
    noStroke();
    var n_;
    if(width>1000){
      n_= 16;
    }else{
      n_ = 12;
    }
    textSize(n_);
    textAlign(CENTER);
    for (var i = 0; i < data.getString(0, j).length; i++) { 
      if (j%2==1) {
        text(data.getString(0, j).charAt(i), this.x, bottom+25+(n_+3)*i);
      }
    }
  }


  // city connect firework 
  colLines(){
    stroke(100);
    strokeWeight(1);
    for(var i = bottom ; i >this.y ; i-=10){
      line(this.x,i,this.x,i-5);
    }
  }


  //show 2017 / 2018
  infor(j){
    if(dist(mouseX,mouseY,right-60,above+10)<10 && j%2==0){     
     this.alpha = 50;  
     noStroke();
     fill(254,82,105);
     ellipse(right-60,above+13,20,20)
   }else if(dist(mouseX,mouseY,right-30,above+10)<10 && j%2==1){    
     this.alpha = 50;
     noStroke();
     fill(255,222,85);
     ellipse(right-30,above+13,20,20);
   }else if(dist(mouseX,mouseY,right,above+10)<10){    
     this.alpha = 50;
     noStroke();
     fill(255);
     ellipse(right,above+13,20,20);

     if(j%2==1){     
      if(y[j]<y[j+1]){ //17年小于18年
        fill(255);  
        var r_ = map(windowWidth,0,2000,0,4);
        var offset = map(y[j+1]-y[j],0,100,0,r_);     
        beginShape();
        vertex(this.x,y[j]);
        vertex(this.x-offset,y[j+1]);
        vertex(this.x+offset,y[j+1]);
        endShape(CLOSE);
        arc(this.x,y[j+1],offset*2,offset*2,PI*2,PI*3);
      }else{//18年小于17年
        fill(255);
        var r_ = map(windowWidth,0,2000,0,4);
        var offset = map(y[j+1]-y[j],0,100,0,r_);  
        beginShape();
        vertex(this.x,y[j]);
        vertex(this.x-offset,y[j+1]);
        vertex(this.x+offset,y[j+1]);
        endShape(CLOSE);
        arc(this.x,y[j+1],offset*2,offset*2,PI,PI*2);
      }
     // line(this.x,y[j],this.x,y[j+1]);
   }
 }else if(dist(mouseX,mouseY,this.x,this.y)<10){
  fill(255);
  textSize(15);
  text(nfc(avg[j],2),this.x,this.y);

}else{
 this.alpha = 255;
}
}
}



function check(){
  noFill();
  strokeWeight(2);
  stroke(254,82,105);
  ellipse(right-60,above+13,20,20);
  stroke(255,222,85);
  ellipse(right-30,above+13,20,20);
  stroke(255);
  ellipse(right,above+13,20,20);
  var text17 = "查看2017";
  var text18 = "查看2018";
  var compare = "比较17-18";
  textSize(14);
  fill(200);
  noStroke();
  for (var i = 0; i < text17.length; i++) { 
    text(text17.charAt(i), right-60,above+40+(15)*i);
    text(text18.charAt(i), right-30,above+40+(15)*i);
    text(compare.charAt(i), right,above+40+(15)*i);
  }
}













