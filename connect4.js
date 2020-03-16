var board = document.getElementById("chessboard");
var chessboard = new Array();
var currentCol;
var currentRow;
var currentPlayer;
var id = 1;

newgame();

function newgame(){
    chessboard = new Array();
    for(var i=0; i<6; i++){
        chessboard[i] = new Array();
        for(var j=0; j<7; j++){
            chessboard[i].push(0);
        }
    }

    placeDisc(1);
}

function checkForVictory(row,col){
    if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2){
        return true;
    } else {
        if(getAdj(row,col,1,0) > 2){
            return true;
        } else {
            if(getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2){
                return true;
            } else {
                if(getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

function getAdj(row,col,row_inc,col_inc){
    if(cellVal(row,col) === cellVal(row+row_inc,col+col_inc)){
        return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc);
    } else {
        return 0;
    }
}

function cellVal(row,col){
    if(chessboard[row] === undefined || chessboard[row][col] === undefined){
        return -1;
    } else {
        return chessboard[row][col];
    }
}

function firstFreeRow(col,player){
    for(var i = 0; i<6; i++){
        if(chessboard[i][col]!==0){
            break;
        }
    }
    chessboard[i-1][col] = player;
    return i-1;
}

function possibleColumns(){
    var moves_array = new Array();
    for(var i=0; i<7; i++){
        if(chessboard[0][i] === 0){
            moves_array.push(i);
        }
    }
    return moves_array;
}

function think(){
    var possibleMoves = possibleColumns();
    var aiMoves = new Array();
    var blocked;
    var bestBlocked = 0;

    for(var i=0; i<possibleMoves.length; i++){
        for(var j=0; j<6; j++){
            if(chessboard[j][possibleMoves[i]] !== 0){
                break;
            }
        }

        chessboard[j-1][possibleMoves[i]] = 1;
        blocked = getAdj(j-1,possibleMoves[i],0,1)+getAdj(j-1,possibleMoves[i],0,-1);
        blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,0));
        blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],-1,1));
        blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,1)+getAdj(j-1, possibleMoves[i],-1,-1));

        if(blocked >= bestBlocked){
            if(blocked>bestBlocked){
                bestBlocked = blocked;
                aiMoves = new Array();
            }
            aiMoves.push(possibleMoves[i]);
        }
        chessboard[j-1][possibleMoves[i]] = 0;
    }

    return aiMoves;
}

function Disc(player){
    this.player = player;
    this.color = player === 1 ? 'red' : 'yellow';
    this.id = id.toString();
    id++;

    this.addToScene = function(){
        board.innerHTML += '<div id="d'+this.id+'" class="chess '+this.color+'"></div>';
        if(currentPlayer===2){
            //computer move
            var possibleMoves = think();
            var cpuMove = Math.floor( Math.random() * possibleMoves.length);
            currentCol = possibleMoves[cpuMove];
            document.getElementById('d'+this.id).style.left = (14+60*currentCol)+"px";
            dropDisc(this.id,currentPlayer);
        }
    };

    var $this = this;
    document.onmousemove = function(evt){
        if(currentPlayer === 1){
            currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
            if(currentCol<0){currentCol=0;}
            if(currentCol>6){currentCol=6;}
            document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
            document.getElementById('d'+$this.id).style.top = "-55px";
        }
    };

    document.onload = function(evt){
        if(currentPlayer === 1){
            currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
            if(currentCol<0){currentCol=0;}
            if(currentCol>6){currentCol=6;}
            document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
            document.getElementById('d'+$this.id).style.top = "-55px";
        }
    };

    document.onclick = function(evt){
        if(currentPlayer === 1){
            if(possibleColumns().indexOf(currentCol) !== -1){
                dropDisc($this.id,$this.player);
            }
        }
    }
}

function dropDisc(cid,player){
    currentRow = firstFreeRow(currentCol,player);
    document.getElementById('d'+cid).style.top = (14+currentRow*60)+'px';
    currentPlayer = player;
    checkForMoveVictory();
}

function checkForMoveVictory(){
    placeDisc(3-currentPlayer);
    if(checkForVictory(currentRow,currentCol)){
        var winner = currentPlayer === 2 ? 'Computer' : 'Player';
        alert(winner+" win!");
        board.innerHTML = "";
        newgame();
    }
}

function placeDisc(player){
    currentPlayer = player;
    new Disc(player).addToScene();
}