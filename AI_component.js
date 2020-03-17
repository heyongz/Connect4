let AI = 1;
let OP = 2;
let WIN = 5000;
let MAX = 10**9;
let MIN = -MAX;

function get_move(chessboard){
    let res = max_val(chessboard, MIN, MAX, 7);
    return res[0];
}

function available_move(chessboard){
    let res = [];
    for(let j=Math.floor(col/2); j<col; ++j){
        for(let i=0; i<row; ++i){
            if(chessboard[i][j] === 0){
                res.push([i, j]);
                break;
            }
        }
    }

    for(let j=Math.floor(col/2)-1; j>=0; --j){
        for(let i=0; i<row; ++i){
            if(chessboard[i][j] === 0){
                res.push([i, j]);
                break;
            }
        }
    }
    return res;
}

function max_val(chessboard, alpha, beta, deep){
    if(deep === 0){
        return [[0, 0], heuristic(chessboard, AI)];
    }

    let val = MIN;

    let res = [[0,0], 0];
    let moves = available_move(chessboard);

    for(let i=0; i<moves.length; ++i){
        let mv = moves[i];
        chessboard[mv[0]][mv[1]] = AI;
        let tmp = min_val(chessboard, alpha, beta, deep-1);
        chessboard[mv[0]][mv[1]] = 0;
        let score = tmp[1];

        if(score > val){
            val = score;
            res = [mv, score];
            if(val >= WIN) break;
        }

        alpha = Math.max(alpha, val);
        if(alpha >= beta) break;
    }
    return res;
}


function min_val(chessboard, alpha, beta, deep){
    if(deep === 0){
        return [[0, 0], heuristic(chessboard, OP)];
    }

    let val = MAX;

    let res = [[0,0], 0];
    let moves = available_move(chessboard);

    for(let i=0; i<moves.length; ++i){
        let mv = moves[i];
        chessboard[mv[0]][mv[1]] = OP;
        let tmp = max_val(chessboard, alpha, beta, deep-1);
        chessboard[mv[0]][mv[1]] = 0;
        let score = tmp[1];

        if(score < val){
            val = score;
            res = [mv, score];
            if(val <= -WIN) break;
        }

        beta = Math.min(beta, val);
        if(alpha >= beta) break;
    }
    return res;
}

function heuristic(board1, player){
    function transpose(A){
        let TA = [];
        for(let i=0; i<A[0].length; ++i){
            TA.push([]);
        }
        for(let i = 0; i < A.length; i++) {
            for(let j = 0; j < A[0].length; j++) {
                TA[j][i] = A[i][j];
            }
        }
        return TA;
    }

    let board2 = transpose(board1);

    let val1 = eval(board1, AI) + eval(board2, AI);
    let val2 = eval(board1, OP) + eval(board2, OP);

    if(val1 >= WIN && val2 >= WIN){
        if(player === AI) return WIN;
        return -WIN;
    }

    if(val1 >= WIN || val2 >= WIN){
        if(val1 >= WIN) return WIN;
        return -WIN;
    }
    return val1-val2;
}

function eval(chessboard, player){
    let val = 0;

    for(let i=0; i<chessboard.length; ++i){
        let row = chessboard[i];
        let col = row.length;
        let j1 = 0;
        let j2 = 0;

        while(j2 < col){
            let space = 0;
            while(j1 < col && row[j1] !== player) j1+=1;
            j2 = j1;
            while(j2 < col && row[j2] === player) j2+=1;

            if(j1 < col && j2 < col){
                let diff = j2 - j1;
                if(j1-1>0 && row[j1-1] === 0) space += 1;
                if(row[j2] === 0) space += 1;
                if(space !== 0) val += 10 ** diff;
                else if(diff === 4) val += 10 ** diff;
            }else if(j1 < col && col <= j2){
                let diff = col - j1;
                if(j1-1>=0 && row[j1-1] === 0) space += 1;
                if(space !== 0) val += 10 ** diff;
                else if(diff === 4) val += 10 ** diff;
            }else break;
            j1 = j2;
        }
    }
    return val;
}