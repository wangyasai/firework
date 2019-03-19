
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

function preload(){
  data = loadTable("data/data.csv", 'csv');
}


function setup(){
  createCanvas(windowWidth,windowHeight);
  background(20);
  rows = data.getRowCount();
  cols = data.getColumnCount();

  left = width*0.02;
  right = width*0.9;
  above = height*0.1;
  bottom = height*0.9;

  for(var j = 1; j < cols; j++){
    sum[j] = 0;
    for(var i = 3; i < rows; i++){
      sum[j] += data.getNum(i,j);
    }
    avg[j] = sum[j]/24;
    posX[j] = map(int((j+1)/2), 1, 50, left + 100, right);
    y[j] = map(avg[j], 0, 200,bottom, above);  
    posY[j] = bottom;
    fireworks[j] = new Firework(posX[j],posY[j],y[j],0);
  }
}


function draw(){ 
  background(20);   
  var time = frameCount;

  //dot line
  for(var j = 1; j < cols; j++){
    if(j<= time){
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
      fireworks[j].display(j);
      fireworks[j].city(j);     
    }
  }
}


function first(){
  
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
      rotate(-PI); 
      this.alpha += (255-this.alpha)*this.easing;   
      if (j%2==0) {
       fill(255,222,85,this.alpha);//黄色 2018
     } else if (j%2==1) {
       fill(254,82,105,this.alpha);//红色 2017
     }
     noStroke();

     rotate(-TWO_PI/24*(i-2));  
     this.r += (data.getNum(i,j)/4-this.r)*this.easing/2;
     var offset = map(data.getNum(i,j),0,300,0,3);

     beginShape();
     vertex(0,0);
     vertex(-offset ,r);
     vertex(offset ,r);
     endShape(CLOSE);

     ellipse(0,r,offset*2);
     pop();        
   }    

 }

 move(){
  this.y += (this.tY- this.y)*this.easing;
}

city(j){
  fill(255, 150);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  for (var i = 0; i < data.getString(0, j).length; i++) { 
    text(data.getString(0, j).charAt(i), this.x, bottom+25+20*i);
  }
}

lines(){
  stroke(100);
  strokeWeight(1);
  line(this.x,this.y,this.x,bottom);
}
}