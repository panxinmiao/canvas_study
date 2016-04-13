/**
 * @author PanXinmiao
 * HAVE FUN AND ENJOY IT!
 */
function cube(cubeWidth){
    var body = document.getElementsByTagName('body')[0];
    body.style.overflowY = 'hidden';
    //document.getElementById('container').style.display='block';
    var container = document.createElement('div');
    //var canvas = document.getElementById('canvas');
    container.style.backgroundColor = '#ddd';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.left = 0;
    container.style.top = 0;
    container.style.filter = 'alpha(opacity=50)';
    container.style.opacity = '0.5';
    container.style.position = 'fixed';
    container.style.zIndex = 1050;
    var canvas = document.createElement('canvas');
    body.appendChild(container);
    container.appendChild(canvas);
    var h = window.innerHeight;
    var w = window.innerWidth;
    cubeWidth || (cubeWidth = 30);
    (cubeWidth > 30) && (cubeWidth = 30);
    (cubeWidth < 4) && (cubeWidth = 4);
    canvas.width = w;
    canvas.height = h;
    var offsetH = h%cubeWidth;
    var offsetW = w%cubeWidth;
    var rows = (h-offsetH)/cubeWidth;
    var cols = (w-offsetW)/cubeWidth;
    var context = canvas.getContext('2d');
    context.translate(offsetW,offsetH);
    var gameFlag = [];
    var brick = null;
    var fullRow = [];
    

    /*
     * 方块类型
     */
    var SQUARE_TYPE = 0;
    var STICK_HOR_TYPE = 1;
    var STICK_VERT_TYPE = 2;
    var L_UP_TYPE = 3;
    var L_RIGHT_TYPE = 4;
    var L_DOWN_TYPE = 5;
    var L_LEFT_TYPE = 6;
    var OPL_UP_TYPE = 7;
    var OPL_RIGHT_TYPE = 8;
    var OPL_DOWN_TYPE = 9;
    var OPL_LEFT_TYPE = 10;
    var Z_HOR_TYPE = 11;
    var Z_VERT_TYPE = 12;
    var OPZ_HOR_TYPE = 13;
    var OPZ_VERT_TYPE = 14;
    var T_UP_TYPE=15;
    var T_RIGHT_TYPE=16;
    var T_DOWN_TYPE=17;
    var T_LEFT_TYPE=18;


    /*
     * 游戏状态
     */
    var GAME_NOT_BEGIN=0;
    var GAME_RUNNING=1;
    var GAME_PAUSE=2;
    var GAME_WAIT_ANIMATION=3;
    var GAME_OVER=4;


    var SPEED_INTERVAL = 500;
    var ANIMATION_INTERVAL = 300;

    var gameStatus = GAME_RUNNING;

    var lastAutoDropTime;
    var lastAnimationTime;
    var needDraw = true;
    
    
    function resetGame(){
        for(var col=0; col<cols; col++){
            gameFlag[col]=[];
            for(var row=0; row<rows; row++){
               gameFlag[col][row]=false;
            }
        }
        brick = new Brick(getRandom(0,18));
        brick.position.x = getRandom(4, cols-4);
    };
    
    function Brick(type){
        this.type = type;
        this.position = {
                x: 4,
                y: 0
        };
        switch (type) {
        case SQUARE_TYPE:
            this.pos_X = [0, 1, 0, 1];
            this.pos_Y = [0, 0, 1, 1];
            break;
        case STICK_HOR_TYPE:
            this.pos_X = [0, 1, 2, 3];
            this.pos_Y = [0, 0, 0, 0];
            this.position = {
                    x: 3,
                    y: 0
            }
            break;
        case STICK_VERT_TYPE:
            this.pos_X = [0, 0, 0, 0];
            this.pos_Y = [0, 1, 2, 3];
            break;
        case L_UP_TYPE:
            this.pos_X = [0, 0, 0, 1];
            this.pos_Y = [0, 1, 2, 2];
            break;
        case L_RIGHT_TYPE:
            this.pos_X = [0, 1, 2, 0];
            this.pos_Y = [0, 0, 0, 1];
            break;
        case L_DOWN_TYPE:
            this.pos_X = [0, 1, 1, 1];
            this.pos_Y = [0, 0, 1, 2];
            break;
        case L_LEFT_TYPE:
            this.pos_X = [2, 0, 1, 2];
            this.pos_Y = [0, 1, 1, 1];
            break;
        case OPL_UP_TYPE:
            this.pos_X = [1, 1, 0, 1];
            this.pos_Y = [0, 1, 2, 2];
            break;
        case OPL_RIGHT_TYPE:
            this.pos_X = [0, 0, 1, 2];
            this.pos_Y = [0, 1, 1, 1];
            break;
        case OPL_DOWN_TYPE:
            this.pos_X = [0, 1, 0, 0];
            this.pos_Y = [0, 0, 1, 2];
            break;
        case OPL_LEFT_TYPE:
            this.pos_X = [0, 1, 2, 2];
            this.pos_Y = [0, 0, 0, 1];
            break;
        case Z_HOR_TYPE:
            this.pos_X = [0, 1, 1, 2];
            this.pos_Y = [0, 0, 1, 1];
            break;
        case Z_VERT_TYPE:
            this.pos_X = [1, 0, 1, 0];
            this.pos_Y = [0, 1, 1, 2];
            break;
        case OPZ_HOR_TYPE:
            this.pos_X = [1, 2, 0, 1];
            this.pos_Y = [0, 0, 1, 1];
            break;
        case OPZ_VERT_TYPE:
            this.pos_X = [0, 0, 1, 1];
            this.pos_Y = [0, 1, 1, 2];
            break;
        case T_UP_TYPE:
            this.pos_X = [1, 0, 1, 2];
            this.pos_Y = [0, 1, 1, 1];
            break;
        case T_RIGHT_TYPE:
            this.pos_X = [0, 0, 1, 0];
            this.pos_Y = [0, 1, 1, 2];
            break;
        case T_DOWN_TYPE:
            this.pos_X = [0, 1, 2, 1];
            this.pos_Y = [0, 0, 0, 1];
            break;
        case T_LEFT_TYPE:
            this.pos_X = [1, 0, 1, 1];
            this.pos_Y = [0, 1, 1, 2];
            break;
        };
        
        this.moveDown = function(){
            this.position.y++;
        };
        this.moveLeft = function(){
            this.position.x--;
        };
        this.moveRight = function(){
            this.position.x++;
        }
    }


    function getRandColor(){
        var colors = ['blue','yellow','red','green','gray','purple'];
        return colors[getRandom(0, colors.length-1)];
    }


    function drawPanel(){
        context.clearRect(0, 0, w, h);
        //context.strokeRect(0, 0, 300, 570);
        
        for(var row=0; row<rows; row++){
            for(var col=0; col<cols; col++){
                if(fullRow.indexOf(row)!=-1){
                    context.save();
                    context.fillStyle=getRandColor();
                    context.fillRect(cubeWidth*col+1, cubeWidth*(row)+1,cubeWidth-2, cubeWidth-2);
                    context.restore();
                }else{
                    if(gameFlag[col][row]){
                        context.fillRect(cubeWidth*col+1, cubeWidth*(row)+1,cubeWidth-2, cubeWidth-2);
                    }
                }
            }
        }
        if(brick){
            context.save();
            context.fillStyle='blue';
            var pos_X=brick.pos_X;
            var pos_Y=brick.pos_Y;
            for (var i = 0; i < 4; i++) {
                context.fillRect(cubeWidth*(brick.position.x+pos_X[i]) + 1, cubeWidth * (brick.position.y+pos_Y[i])+1, cubeWidth-2, cubeWidth-2);
            }
            context.restore();
        }
    }

    document.addEventListener('keydown',function(e){
        switch(e.keyCode){
        case 37:
            moveLeft();
            break;
        case 38:
            changeDirection();
            break;
        case 39:
            moveRight();
            break;
        case 40:
            moveDown();
            break;
        }
        redraw();
        e.preventDefault();
    });

    function moveLeft(){
        for(var i=0;i<4;i++){
            if(brick.position.x+ brick.pos_X[i]==0){
                return;
            }
            if(gameFlag[brick.position.x+brick.pos_X[i]-1][brick.position.y+brick.pos_Y[i]]){
                return;
            }
        }
        brick.moveLeft();
    }

    function moveRight(){
        for(var i=0;i<4;i++){
            if(brick.position.x+ brick.pos_X[i]==cols-1){
                return;
            }
            if(gameFlag[brick.position.x+brick.pos_X[i]+1][brick.position.y+brick.pos_Y[i]]){
                return;
            }
        }
        brick.moveRight();
    };

    function moveDown(){
        if(!isDrop()){
            brick.moveDown();
        }
    }

    function nextBrick(){
        brick = new Brick(getRandom(0,18));
        brick.position.x = getRandom(4, cols-4);
        lastAutoDropTime = void 0;
    }

    function isDrop() {
        if(brick==null){
            return true;
        }
        for(var i=0;i<4;i++){
            if(brick.position.y+ brick.pos_Y[i]==rows-1){
                drop();
                return true;
            }
            if(gameFlag[brick.position.x+brick.pos_X[i]][brick.position.y+brick.pos_Y[i]+1]){
                drop();
                return true;
            }
        }
        return false;
    }

    function drop(){
        if(brick==null){
            return;
        }
        for(var i=0;i<4;i++){
            gameFlag[brick.position.x+brick.pos_X[i]][brick.position.y+brick.pos_Y[i]]=true;
        }
        brick=null;
        checkFullRow();
    }

    function checkFullRow(){
        //var fullRow = [];
        row: for(var row=4;row<rows;row++){
            for(var col=0;col<cols;col++){
                if(!gameFlag[col][row]){
                    continue row;
                }
            }
            fullRow.push(row);
        }
        if(fullRow.length>0){
            gameStatus = GAME_WAIT_ANIMATION;
            console.log(gameStatus);
            setTimeout(function(){
                gameStatus = GAME_RUNNING;
                for(var i of fullRow){
                    delRow(i);
                }
                fullRow = [];
                if(!checkGameOver()){
                    nextBrick();
                    redraw();
                }
            },1200);
        }else{
            if(!checkGameOver()){
                nextBrick();
            }
        }
    }

    function delRow(row){
        for(var i=row;i>=4;i--){
            for(var j=0;j<cols;j++){
                gameFlag[j][i]=gameFlag[j][i-1];
            }
        }
    }
    
    function checkGameOver(){
        for(var col=0;col<cols;col++){
            if(gameFlag[col][0]){
                gameOver();
                return true;
            }
        }
        return false;
    }
    
    //simply reset game
    function gameOver(){
        gameStatus = GAME_OVER;
        setTimeout(function(){
            resetGame();
            gameStatus = GAME_RUNNING;
        },3000);
    }

    function changeDirection() {
        if(brick==null){
            return;
        }
        var tempBrick;
        switch(brick.type){
        case SQUARE_TYPE:
            return;
        case STICK_VERT_TYPE:
            tempBrick=new Brick(STICK_HOR_TYPE);
            break;
        case L_LEFT_TYPE:
            tempBrick=new Brick(L_UP_TYPE);
            break;
        case OPL_LEFT_TYPE:
            tempBrick=new Brick(OPL_UP_TYPE);
            break;
        case Z_VERT_TYPE:
            tempBrick=new Brick(Z_HOR_TYPE);
            break;
        case OPZ_VERT_TYPE:
            tempBrick=new Brick(OPZ_HOR_TYPE);
            break;
        case T_LEFT_TYPE:
            tempBrick=new Brick(T_UP_TYPE);
            break;
        default:
            tempBrick=new Brick(brick.type+1);
        }
        tempBrick.position = brick.position;
        if(canDoChange(tempBrick)){
            brick=tempBrick;
        }
    }

    function canDoChange(tempBrick){
        for(var i=0;i<4;i++){
            if(tempBrick.position.x+ tempBrick.pos_X[i]>=cols){
                return false;
            }
            if(tempBrick.position.y+ tempBrick.pos_Y[i]>=rows){
                return false;
            }
            if(gameFlag[tempBrick.position.x+tempBrick.pos_X[i]][tempBrick.position.y+tempBrick.pos_Y[i]]){
                return false;
            }
        }
        return true;
    }


    function redraw(){
        needDraw = true;
    }

    function run(time){
        if(gameStatus == GAME_RUNNING){
            if(!lastAutoDropTime){
                lastAutoDropTime = time;
            }else{
                if(time - lastAutoDropTime > SPEED_INTERVAL){
                    moveDown();
                    redraw();
                    lastAutoDropTime = time;
                }
            }
        }else if(gameStatus == GAME_WAIT_ANIMATION){
            if(!lastAnimationTime){
                lastAnimationTime = time;
            }else{
                if(time - lastAnimationTime > ANIMATION_INTERVAL){
                    redraw();
                    lastAnimationTime = time;
                }
            }
        }
        
        if(needDraw){
            drawPanel();
            needDraw = false;
        }
        
        requestAnimationFrame(run);
    }
    resetGame();
    run();
};

var keyStatck = [];

document.addEventListener('keydown',function(e){
    
    if(e.altKey && e.ctrlKey && e.keyCode >= 37 && e.keyCode <= 40){
        keyStatck.push(e.keyCode);
        if(keyStatck.length>8){
            keyStatck.shift();
        }
        if(keyStatck.join() == '38,38,40,40,37,37,39,39'){
            console.log('bingo!~~~~~~');
            cube(getRandom(1, 6)*5);
        }
        e.preventDefault();
    }else{
        keyStatck = [];
    }
});

function getRandom(min ,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("Press Ctrl+Alt and ↑ ↑ ↓ ↓ ← ← → → , have fun and enjoy it!")
