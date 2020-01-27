document.getElementById('head').innerHTML="SpaceUp";
document.getElementById('head2').innerHTML="Press the space bar to begin";
document.getElementById('newScore').innerHTML="";
document.getElementById('can').style.background = "url('space.jpg')";
document.getElementById('sother').style.display= "none";
document.getElementById('highScoreText').innerHTML = "";
document.getElementById('highScore').innerHTML = "";
document.getElementById('hype').innerHTML = "";
document.getElementById('hype').style.display = "none";
document.getElementById('load').style.display = "none";
var disS = document.getElementById('displayS');
disS.style.display = "none";
var htmlscore = document.getElementById('score');
htmlscore.style.display = "none";
ctx = document.getElementById('can');
c = ctx.getContext('2d');
ctx.height = 600;
ctx.width = 450;
var H = ctx.height;
var W = ctx.width;
var started = false;
 

function getScore(score){
    var Nfile = JSON.parse(localStorage.getItem('score1') || []);
    Nfile['scores'].push(score); 

    let hscore = Nfile['scores'];
    let real = 0;
    for(let i=0; i<hscore.length; i++){
        if(hscore[i] > real){
            real = hscore[i];
        }
    }
    if(real == score){
        document.getElementById('displayI').style.textShadow = "0 0 5px rgb(255,255,255)";
        document.getElementById('displayI').style.color = "gold";
        let high = document.getElementById('newScore');
        high.style.color = "gold";
        high.innerHTML="New High Score!";
    }
    localStorage.setItem('score1',JSON.stringify(Nfile));

    return real;
}


function gameOver(score){
    let hscore = getScore(score);
    document.getElementById('head').innerHTML="Game Over";
    document.getElementById('head2').innerHTML="Press the space bar to try again";
    disS.style.display = "block";
    htmlscore.style.display = "none";
    document.getElementById('displayM').innerHTML="Final Score:";
    document.getElementById('displayM').innerHTML="Final Score:";
    document.getElementById('displayI').innerHTML= score;
    document.getElementById('sother').style.display= "block";
    document.getElementById('highScoreText').innerHTML = "High Score:";
    document.getElementById('highScore').innerHTML = hscore;;
    document.getElementById('hype').style.display = "none";
    document.getElementById('load').style.display = "none";
    window.addEventListener('keydown', ()=>{
        if(event.keyCode == 32 && started === true){
            document.location.reload();
        }
    });
}


window.addEventListener('keydown', ()=>{
    if(event.keyCode == 32 && started === false){
        document.getElementById('scoreM').innerHTML = "score:";
        document.getElementById('head').innerHTML="";
        document.getElementById('head2').innerHTML="";
        document.getElementById('displayM').innerHTML="";
        document.getElementById('displayI').innerHTML= "";
        htmlscore.style.display = "block";
        disS.style.display = "none";
        document.getElementById('hype').style.display = "block";
        document.getElementById('load').style.display = "block";
        started = true;
        adjust = game();
        }
});


function game(){

    var gravity = .12;
    var bounceWidth = 45;
    var bounceHeight = 5;
    var maxBouncerD = 200;
    var minBouncerD = bounceHeight;
    var adjust = 0;
    var numBouncers = 10;
    var bouncers = [numBouncers];
    var bpos = [];
    var obsticalRad = 30;
    var obsicalSpeed = 1;
    var numObsticals = 1;
    var obsical = [numObsticals];
    var ppos = [[0,-H/2]];
    var Prad = 10;
    var numHyper = 20;
    var hypers = [numHyper];
    var hpos = [];
    var Hrad = 5;
    var score = 0;
    var boost = 0;
    var end = false;
    var ani;
    var uoost = false;
    var count = 0;
    var boostTime = 250;
    var dec = 100/boostTime;
    var room = 10;
    var tran = .005;



    c.translate(W/2,H);
    c.save();

    

    //creating bouncers   
    function Bouncer(x,y){
        this.x = x;
        this.y = y;
        
        this.create = function(){
            c.beginPath();
            c.fillStyle = 'white';
            c.fillRect(this.x - bounceWidth/2,this.y,bounceWidth,bounceHeight);
            c.fill();
        }
    }


    //creating player 
    function Player(x,y,r,dx,dy){
        this.px = x;
        this.py = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        
        this.create = function(){
            c.beginPath();
            let colors = ['#4a148c', '#7b1fa2', '#9c27b0', '#ba68c8', '#e1bee7'];
            if(uoost === true){
                c.fillStyle = colors[Math.round(Math.random() * 5)];
                c.strokeStyle = 'white';
            }
            else{
                c.fillStyle = 'white';
                c.strokeStyle = "#431470";
            }
            c.lineWidth = 1;
            c.arc(this.px,this.py,this.r,0,Math.PI*2,false);
            c.fill();
            c.stroke();
            if(this.py - (this.r*room)  <= -H - adjust){
                screenChange();
            }
        }

        this.move = function(){
            if(this.py + this.r>= 0 - adjust){
                end = true;
            }
            if(this.px <-W/2){
                this.px += W;
                ppos[0][0] += W;
            }
            if(this.px > W/2){
                this.px -= W;
                ppos[0][0] -= W;
            }
            if(uoost == true){
                gravity = 0;
                this.dy = -5;
                room = 50;
                tran = .008;
            }

            let dis;
            for(let k=0; k<numHyper; k++){
                dis = distance(hpos[k][0],hpos[k][1],ppos[0][0],ppos[0][1]);
                if(dis < Hrad + Prad){
                    if(boost < 100 && uoost == false){
                        boost += 20;
                        document.getElementById('load').style.width = boost + "px";
                    } 
                    hypers[k].x = Math.random() * ((W/2 - Hrad) - (-W/2 + Hrad)) + (-W/2 + Hrad);
                    hypers[k].y = Math.random() * ((-H*7 - adjust) - (-H*2 - adjust)) + (-H*2 - adjust);;
                    hpos[k] = [hypers[k].x,hypers[k].y];
                }
            }

            for(let i=0; i<bpos.length; i++){
                let x = bpos[i][0];
                let y = bpos[i][1];
                if(this.px + this.r >= (x-bounceWidth/2) && this.px - this.r <= (x + bounceWidth/2)){
                    if(this.py + this.r >= y && this.py - this.r < y + bounceHeight){
                        if(this.dy >= 0){
                            this.dy = 0;
                            this.dy -=7; 
                        }
                    }
                }
            }
            this.dy += gravity;
            this.py += this.dy;
            ppos[0][1] += this.dy;

            if(this.dy < 0){
                this.pscore();
            }
            this.create();
        }

        this.movei = function(mpx,mpy){
            this.px += mpx;
            ppos[0][0] += mpx;
            this.py += mpy;
            ppos[0][1] += mpy;
            this.create();
        }

        this.pscore = function(){
            let iniScore = Math.round(-this.py/(H/10));
            if(iniScore > score){
                score = Math.round(-this.py/(H/10));
                if(score % 5 == 0 && minBouncerD < 150){
                    minBouncerD += 5;
                }
                document.getElementById('scoreI').innerHTML = score;
            }
        }
    }



    //creating obsticals 
    function Obsicals(x,y,dx,dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.unx = false;
        this.uny = false;

        this.createO = function(){
            c.beginPath();
            c.fillStyle= "rgba(0,0,0,1)";
            c.strokeStyle = "purple";
            c.lineWidth = 2.5;
            c.arc(this.x,this.y,obsticalRad,0,Math.PI*2,false);
            c.fill();
            c.stroke();
        } 

        this.unpre = function(){
            if(Math.round(Math.random() * 500) == 5){
                this.unx = true;
            }
            if(Math.round(Math.random() * 250) == 5){
                this.uny = true;
            }
        }

        this.moveO = function(){
            this.unpre();

            let dis;
            dis = distance(this.x,this.y,ppos[0][0],ppos[0][1]);
            if(dis < obsticalRad + Prad){
                end = true;
            }

            if(this.x > (W/2 - obsticalRad) || this.x < (-W/2 + obsticalRad) || this.unx == true){
                this.dx = -this.dx;
                this.unx = false;
            }
            if(this.uny == true){
                this.dy = -this.dy;
                this.uny = false;
            }
            if(this.y > - adjust + (obsticalRad*2)){
                this.x = Math.floor(Math.random() * ((W/2 - obsticalRad) - (-W/2 + obsticalRad))) + (-W/2 + obsticalRad);
                this.y =  Math.floor(Math.random() * ((-H*3 - adjust) - (-H*1.7 - adjust)))  + (-H*1.7 -adjust);

            }
            this.x += this.dx;
            this.y += this.dy;
        
            this.createO();
        }
    }



    //creating hyper speed
    function Hyper(x,y){
        this.x = x;
        this.y = y;

        this.create = function(){
            c.beginPath();
            c.fillStyle = "rgba(112,6,130,50)";
            c.strokeStyle = "white";
            c.lineWidth = 1.5;
            c.arc(this.x,this.y,Hrad,0,Math.PI*2,false);
            c.stroke();
            c.fill();
        }
    }



    function screenChange(){
        c.translate(0,H*tran);
        adjust += H*tran;
        for(let i=0; i<numBouncers; i++){
            if(- adjust + bounceHeight <= bpos[i][1]){
                    var x1 = Math.floor(Math.random() * ((W/2 - bounceWidth/2) - (-W/2 + bounceWidth/2))) + (-W/2 + bounceWidth/2);
                    var y1 = Math.floor(Math.random() * ((-H*2 - adjust) - (-H - adjust))) + (-H -adjust);
                while(y1 > ((i==0) ? bpos[numBouncers-1][1] : bpos[i-1][1]) || (Math.abs(y1 - ((i==0) ? bpos[numBouncers-1][1] : bpos[i-1][1]))) > maxBouncerD ||  (Math.abs(y1 - ((i==0) ? bpos[numBouncers-1][1] : bpos[i-1][1]))) < minBouncerD){
                    x1 = Math.floor(Math.random() * ((W/2 - bounceWidth/2) - (-W/2 + bounceWidth/2))) + (-W/2 + bounceWidth/2);
                    y1 = Math.floor(Math.random() * ((-H*3 - adjust) - (-H - adjust))) + (-H -adjust);
                }
                bouncers[i] = (new Bouncer(x1,y1));
                bpos[i]=[x1,y1]; 
            }
        }
        for(let j=0; j<numHyper;j++){
            if(-adjust + Hrad*2 <= hpos[j][1]){
                hypers[j].x = Math.random() * ((W/2 - Hrad) - (-W/2 + Hrad)) + (-W/2 + Hrad);
                hypers[j].y = Math.random() * ((-H*7 - adjust) - (-H*2 - adjust)) + (-H*2 - adjust);;
                hpos[j] = [hypers[j].x,hypers[j].y];
            }
        }
    }

    //create bouncers 
    for(let i = 0; i<numBouncers; i++){
        let x = Math.floor(Math.random() * ((W/2 - bounceWidth/2) - (-W/2 + bounceWidth/2))) + (-W/2 + bounceWidth/2);
        let y = Math.floor(Math.random() * (-H*2));
        if(i !== 0){
            while(y > bpos[i-1][1] || (Math.abs(y - bpos[i-1][1])) > maxBouncerD || (Math.abs(y - bpos[i-1][1])) < minBouncerD){
                x = Math.floor(Math.random() * ((W/2 - bounceWidth/2) - (-W/2 + bounceWidth/2))) + (-W/2 + bounceWidth/2);
                y = Math.floor(Math.random() * (-H*2));
            }
        }
        else{        
            x = 0;
            y = Math.random() * (-H/3); 
        } 
        bpos[i]= [x,y];
        bouncers[i] = new Bouncer(x,y);
    }

    //create obsticals
    for(let i = 0; i<numObsticals; i++){
        let x = Math.floor(Math.random() * ((W/2 - obsticalRad) - (-W/2 + obsticalRad))) + (-W/2 + obsticalRad);
        let y =  Math.floor(Math.random() * ((-H*2) - (-H))) + (-H);
        let dy = obsicalSpeed;
        let dx = obsicalSpeed;
        obsical[i] = new Obsicals(x,y,dx,dy);
    }

    //create hyper speed item 
    for(let k=0; k<numHyper; k++){
        let xh = Math.floor(Math.random() * ((W/2 - Hrad) - (-W/2 + Hrad))) + (-W/2 + Hrad);
        let yh = Math.floor(Math.random() * ((-H*7) - (-H*2))) + (-H*2);
        hpos[k] = [xh,yh];
        hypers[k] = new Hyper(xh,yh);
    }
    

    //create player
    var player1 = new Player(0,-H/2,Prad,0,5);
    
    window.addEventListener('keydown', function clientMove(){
        let mpx=0;
        let mpy=0;
        switch(event.keyCode){
            case 37:
                mpx -= 6;
                break;
            case 38:
                //key up
                if( uoost === false){
                    mpy -= 5;
                }
                break;
            case 39:
                mpx += 6;
                break;
            case 40:
                //key down
                if(uoost === false){
                    mpy += 5;
                }
                break;
        }
        if(end == true){
            window.removeEventListener("keydown",clientMove);
        }
        else{
            player1.movei(mpx,mpy);
        } 
    });

    window.addEventListener('keydown', function UseBoost(){
        if(this.event.keyCode == 70 && boost == 100){
            uoost = true;
        }
    });

    function distance(x1,y1,x2,y2){
        let dis;
        dis = Math.sqrt((Math.pow((x1 - x2),2)) + (Math.pow((y1 - y2),2)));
        return dis;
    }

    function die(){
        cancelAnimationFrame(ani);
    }

    //animating 
    function animate(){
        if(uoost === true){ 
            count++;
            boost -= dec; 
            document.getElementById('load').style.width = boost + "px";
            c.clearRect(-W/2,-H - adjust,W,H + adjust);
            if(count >= boostTime){
                uoost = false; 
                gravity = .12;
                count = 0;
                boost = 0;
                document.getElementById('load').style.width = boost + "px";
                tran = .005;
                room = 10;
            }
        }
        else{
            c.clearRect(-W/2,-H - adjust,W,H + adjust);
            }
            player1.move();
            c.beginPath();
            for(let i = 0; i<numBouncers; i++){
                bouncers[i].create();
            }
            for(let j = 0; j<numObsticals; j++){
                obsical[j].moveO();
            }
            for(let k=0; k<numHyper; k++){
                hypers[k].create();
            }
            if(end != true){
                ani = window.requestAnimationFrame(animate);
            }
            else{
                die(); 
                c.clearRect(-W/2,-H - adjust,W,H + adjust);
                player1 = undefined;
                gameOver(score);
            }
    }
    
 
    animate(); 
}
