let board = document.getElementById("chessboard");
let row = 6;
let col = 7;
let chessboard = [];
let id = 0;
let current_player = OP;

init();

function init(){
    for(let i=0; i<row; ++i){
        chessboard[i] = [];
        for(let j=0; j<col; ++j){
            chessboard[i][j] = 0;
        }
    }
    preprocess();
    event_listener();
}

function preprocess(){
    id = 0;
    current_player = OP;
    board.innerHTML = "";
    for(let i=0; i<42; ++i){
        if(i % 2 === 0){
            board.innerHTML += '<div id="d'+i+'" class="chess '+"red"+'"></div>';
        }else{
            board.innerHTML += '<div id="d'+i+'" class="chess '+"yellow"+'"></div>';
        }
        document.getElementById('d'+i).hidden = true;
    }
}

function draw_chess(left, top){
    document.getElementById('d'+id).style.left = left;
    document.getElementById('d'+id).style.top = top;
    document.getElementById('d'+id).hidden = false;
}

function get_currentCol(evt){
    let currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=0;}
    if(currentCol>6){currentCol=6;}
    return currentCol;
}


function event_listener(){
    document.onmousemove = function(evt){
        let currentCol = get_currentCol(evt);
        draw_chess((14 + 60 * currentCol) + "px", "-55px");
    };

    document.onclick = function(evt){
        if(current_player === OP){
            current_player = AI;
            let currentCol = get_currentCol(evt);
            draw_chess((14+60*currentCol)+"px", "-55px");

            for (let i = 0; i <row; ++i) {
                if (chessboard[i][currentCol] === 0) {
                    chessboard[i][currentCol] = OP;
                    document.getElementById('d'+id).style.transition = "0s";
                    draw_chess((14+60*currentCol)+"px", (14+60*(5-i))+"px");
                    if(is_win() || id === 42) {
                        terminate();
                        return;
                    }
                    id += 1;
                    min_max();
                    break;
                }
            }
            current_player = OP;
        }
    };
}

function terminate(){
    let msg = "";
    if(id % 2 !== 0) msg = "Computer Win!";
    else msg = "Player Win!";
    setTimeout("alert('" + msg + "');init()", 0);
}

function min_max(){
    let [i, j] = get_move(chessboard);
    chessboard[i][j] = AI;
    draw_chess((14+60*j)+"px", (14+60*(5-i))+"px");
    if(is_win() || id===42) {
        terminate();
        return;
    }
    id += 1;
}

function is_win() {
    for(let i=0; i<chessboard.length; ++i){
        for(let j=0; j<chessboard[0].length; ++j){
            if(chessboard[i][j] === 0) continue;
            if(j+3<chessboard[0].length &&
                chessboard[i][j] === chessboard[i][j+1] &&
                chessboard[i][j] === chessboard[i][j+2] &&
                chessboard[i][j] === chessboard[i][j+3]) return true;
            if(j-3>=0 &&
                chessboard[i][j] === chessboard[i][j-1] &&
                chessboard[i][j] === chessboard[i][j-2] &&
                chessboard[i][j] === chessboard[i][j-3]) return true;

            if(i+3<chessboard.length &&
                chessboard[i][j] === chessboard[i+1][j] &&
                chessboard[i][j] === chessboard[i+2][j] &&
                chessboard[i][j] === chessboard[i+3][j]) return true;

            if(i-3>=0 &&
                chessboard[i][j] === chessboard[i-1][j] &&
                chessboard[i][j] === chessboard[i-2][j] &&
                chessboard[i][j] === chessboard[i-3][j]) return true;

            if(i+3<chessboard.length && j-3>=0 &&
                chessboard[i][j] === chessboard[i+1][j-1] &&
                chessboard[i][j] === chessboard[i+2][j-2] &&
                chessboard[i][j] === chessboard[i+3][j-3]) return true;

            if(i-3>=0 && j+3<chessboard[0].length &&
                chessboard[i][j] === chessboard[i-1][j+1] &&
                chessboard[i][j] === chessboard[i-2][j+2] &&
                chessboard[i][j] === chessboard[i-3][j+3]) return true;

            if(i+3<chessboard.length && j+3<chessboard[0].length &&
                chessboard[i][j] === chessboard[i+1][j+1] &&
                chessboard[i][j] === chessboard[i+2][j+2] &&
                chessboard[i][j] === chessboard[i+3][j+3]) return true;

            if(i-3>=0 && j-3>=0 &&
                chessboard[i][j] === chessboard[i-1][j-1] &&
                chessboard[i][j] === chessboard[i-2][j-2] &&
                chessboard[i][j] === chessboard[i-3][j-3]) return true;
        }
    }
    return false;
}
