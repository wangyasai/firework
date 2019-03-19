
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
var r = [];
let oneFirework;
let firework17;
let firework18;
var time;
var s;
var a = 0;

function preload(){
  data = loadTable("data/data.csv", 'csv');
}


function setup(){
  createCanvas(windowWidth,windowHeight);
  background(20);
  rows = data.getRowCount();
  cols = data.getColumnCount();

  if(windowWidth > 1000){
    left = width*0.1;
    right = width*0.9;
  }else{
    left = 10;
    right = width-10;
  }
  
  above = height*0.1;
  bottom = height*0.9;

  for(var j = 1; j < cols; j++){
    sum[j] = 0;
    for(var i = 3; i < rows; i++){
      sum[j] += data.getNum(i,j);
    }
    avg[j] = sum[j]/24;
    posX[j] = map(int((j+1)/2), 1, 50, left, right);
    y[j] = map(avg[j], 0, 200,bottom, above);  
    posY[j] = bottom;
    fireworks[j] = new Firework(posX[j],posY[j],y[j],0);
  }
  oneFirework = new Firework(width/2, bottom,y[1],0);
  firework17 = new Firework(width/2, y[1],y[1],0);
  firework18 = new Firework(width/2, y[2],y[2],0);
}


function draw(){ 
  background(20);  

  if(a==0){
    intro();
  }

  if(a==1){
    fireworkStart();
  }

}


function mousePressed(){
  if(a==0){
    s = frameCount; 
  }
  
  a = 1; 
}


function intro(){
  oneFirework.lines(1);
  for(var i = above; i<bottom;i+=10){
    strokeWeight(5);
    stroke(20);
    line(left,i,right,i);
  } 
  fill(255);
  oneFirework.display(1);
  oneFirework.move();
  oneFirework.city(1);

  var angle = map(frameCount,70,120,PI*1.5,PI*3.5);
  noFill();
  stroke(255);
  strokeWeight(1);
  if(frameCount>70&&frameCount<120){ 
    arc(width/2, height/3,120,120,PI*1.5, angle); 
  }else if(frameCount>120){
    ellipse(width/2, height/3,120,120); 
  }

  fill(255);
  noStroke();
  textSize(12);
  var rr = 90;
  if(frameCount>70){
    text("除夕中午12点",width/2,height/3-rr);
  }
  if(frameCount>80){
    text("除夕下午6点",width/2+rr*1.3,height/3);
  }
  if(frameCount>90){
    text("除夕下午6点",width/2,height/3+rr);
  }
  if(frameCount>100){
    text("除夕下午6点",width/2-rr*1.3,height/3);
  }

  if(frameCount>110){
     fill(255,222,85,this.alpha);//黄色 2018
     firework17.display(1);
     fill(254,82,105,this.alpha);//红色 2017
     firework18.display(2);
   }
 }

 function fireworkStart(){
  time = frameCount-s;

  //dot line
  for(var j = 1; j < cols; j++){
    if(j <= time){
      fireworks[j].lines(j);
    }
  } 


  for(var i = above; i<bottom;i+=10){
    strokeWeight(5);
    stroke(20);
    line(left,i,right,i);
  } 

  //fireworks
  for(var j = 1; j < cols; j++){
    if(j<= time){ 
      fireworks[j].move();
      if (j%2==0) {
       fill(255,222,85,this.alpha);//黄色 2018
     } else if (j%2==1) {
       fill(254,82,105,this.alpha);//红色 2017
     }
     fireworks[j].display(j);
     fireworks[j].city(j);     
   }
 }
}


function first(){
  for(var i = 2; i < rows; i++ ){
    push();
    translate(width/2, height/3);
    var r = map(data.getNum(i,1), 0, 300, 0, 80);
    var offset = map(data.getNum(i,1),0,300,0,3);  
    fill(255,222,85);
    noStroke();
    rotate(-PI-TWO_PI/24*(i-2)); 
    beginShape();  
    if(frameCount > 100+(25-i)) {
      vertex(0,0);
      vertex(-offset ,r);
      vertex(offset ,r);
      endShape(CLOSE);
      ellipse(0,r,offset*2);
    }
    endShape(CLOSE);
    pop();     

    noFill();
    stroke(255);
  }    
}


class Firework{
  constructor(posX,posY,targetY,r) {
    this.x = posX;
    this.y = posY;
    this.tY = targetY;
    this.easing = 0.05;
    this.w = 80;
    this.r = r; 
    this.alpha = -100;  
  }


  display(j){  
    for(var i = 2; i < rows; i++ ){
      var r = map(data.getNum(i,j), 0, 300, 0, this.w);
      push();
      translate(this.x,this.y);     
      this.alpha += (255-this.alpha)*this.easing;   

      noStroke();

      var n ;
      rotate(-PI-TWO_PI/24*(i-2));  
      if(width>1000){
       n = 1;
     }else{
       n = 2;
     }
     this.r += (data.getNum(i,j)/n-this.r)*this.easing/2;
     var offset = map(data.getNum(i,j),0,300,0,3);

     beginShape();
     vertex(0,0);
     vertex(-offset ,r/n);
     vertex(offset ,r/n);
     endShape(CLOSE);
     ellipse(0,r/n,offset*2);
     pop();        
   }    

 }

 move(){
  this.y += (this.tY- this.y)*this.easing;
}

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

lines(){
  stroke(100);
  strokeWeight(1);
  line(this.x,this.y,this.x,bottom);
}
}