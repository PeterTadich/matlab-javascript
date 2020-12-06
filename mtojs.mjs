//mtojs = matlab to javascript port

//ECMAScript module

import * as hlao from 'matrix-computations';

//reshape(A,sz); See nnCostFunction.js
//Reshape array.
//   - A (vector or matrix (IMPORTANT: not a multi dimensional array.)
//   - sz (size vector)
//   IMPORTANT: The elements in B preserve their columnwise ordering from A.
/*
var A = [
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
    [7],
    [8],
    [9],
    [10]
];
var B = reshape(A,[2,5]);
console.log(B);
[
    [1,3,5,7,9],
    [2,4,6,8,10]
];
var B = reshape(A,[5,2]);
console.log(B);
[
    [1,6],
    [2,7],
    [3,8],
    [4,9],
    [5,10]
];
*/
function reshape(A,sz){
    //Get the dimension of 'A'.
    var m = A.length;
    var n = A[0].length;
    
    //Get the dimension of 'B'. The matrix to be created.
    var r = sz[0]; //Number of rows.
    var t = sz[1]; //Number of columns.
    
    var B = [];
    var cnt_row = 0;
    var cnt_col = 0;
    for(var i=0;i<m;i=i+1){
        for(var j=0;j<n;j=j+1){
            if(cnt_col == 0) B[cnt_row] = []; //Populating the first column.
            B[cnt_row][cnt_col] = A[i][j];
            cnt_row = cnt_row + 1; //Row counter of 'B'.
            if(cnt_row == r){
                cnt_row = 0; //Reset the row counter.
                cnt_col = cnt_col + 1;
            }
        }
    }
    
    return B;
}

//Turn matrix into a column vector.
/*
var A = [
    [1,2,3,4,5],
    [6,7,8,9,10]
];
var B = unroll(A);
console.log(B);
*/
function unroll(A){
    //Get the dimension of 'A'.
    var m = A.length;
    var n = A[0].length;
    
    var B = [];
    for(var j=0;j<n;j=j+1){ //By column of 'A'.
        for(var i=0;i<m;i=i+1){ //By row of 'A'.
            B.push([A[i][j]]);
        }
    }
    
    return B;
}

function repmat(A,M,N){
    //var A = [[1,3],[4,2]];
    //var B = repmat(A, 2, 3);
    //console.log(B);
    var dim = size(A);
    var m = dim[0];
    var n = dim[1];
    
    var B = hlao.zeros_matrix(m*M,n*N);
    
    var ii = 0;
    var jj = 0;
    for(var i=0;i<m*M;i=i+1){ //rows
        if(ii == m) var ii = 0;
        for(var j=0;j<n*N;j=j+1){ //cols
            if(jj == n) var jj = 0;
            B[i][j] = A[ii][jj];
            jj = jj + 1;
        }
        ii = ii + 1;
    }
    
    return B;
}

function isequal(A,B){
    var dim = size(A);
    var mA = dim[0];
    var nA = dim[1];
    if(mA == 1){ //row vector hence convert to column vector
        A = hlao.vector_transpose(A);
        var dim = size(A);
        var mA = dim[0];
        var nA = dim[1];
    }
    
    var dim = size(B);
    var mB = dim[0];
    var nB = dim[1];
    if(mB == 1){ //row vector hence convert to column vector
        B = hlao.vector_transpose(B);
        var dim = size(B);
        var mB = dim[0];
        var nB = dim[1];
    }
    
    //same dimension
    if(mA != mB) return 0;
    if(nA != nB) return 0;
    
    //same element values
    for(var i=0;i<mA;i=i+1){ //rows
        for(var j=0;j<nA;j=j+1){ //cols
            if(A[i][j] != B[i][j]) return 0;
        }
    }
    
    return 1;
}

function any(A){
    //return 'true' if any element of a vector is a nonzero number.
    //works on the columns of 'A'

    var dim = size(A);
    var m = dim[0];
    var n = dim[1];
    
    if(m == 1){ //row vector hence convert to column vector
        A = hlao.vector_transpose(A);
        var dim = size(A);
        var m = dim[0];
        var n = dim[1];
    }
    
    var nonzero = [];
    for(var j=0;j<n;j=j+1){ //cols
        nonzero[j] = 0; //assume all elements zero
        for(var i=0;i<m;i=i+1){ //rows
            if(Math.abs(A[i][j]) != 0.0) nonzero[j] = 1;
        }
    }
    
    return nonzero;
}

function diag(a){
    //var a = [5,10,13];
    //console.log(diag(a));
    //returns --> 
    var dim = size(a);
    var m = dim[0];
    var n = dim[1];
    
    hlao.assert((m == 1),'Assertion failed: 1 x n vector only - diag().');
    
    var A = hlao.zeros_matrix(n,n); //create a zereos square matrix
    
    for(var i=0;i<n;i=i+1){ //rows
        for(var j=0;j<n;j=j+1){ //cols
            if(i == j) A[i][j] = a[i];
        }
    }
    
    return A;
}

function matrix_norms(A,normType){
    var dim = size(A);
    var m = dim[0];
    var n = dim[1];

    if(arguments.length == 1) normType = '2';
    if(m == 1){ //row vector hence convert to column vector
        A = hlao.vector_transpose(A);
        var dim = size(A);
        var m = dim[0];
        var n = dim[1];
    }
    
    var max = 0.0;
    switch(normType){
        case '1': //1-norm
            //var A = [[5,-4,2],[-1,2,3],[-2,1,0]];
            //console.log(matrix_norms(A,'1'));
            //--> returns 8
            //sum abs of all columns
            for(var j=0;j<n;j=j+1){ //cols
                var sum = 0.0;
                for(var i=0;i<m;i=i+1){ //rows
                    sum = sum + Math.abs(A[i][j]);
                }
                if(max < sum) max = sum; //take the max.
            }
            break;
            
        case 'inf': //inf-norm
            //var A = [[5,-4,2],[-1,2,3],[-2,1,0]];
            //console.log(matrix_norms(A,'inf'));
            //--> returns 11
            //sum abs of all rows
            for(var i=0;i<m;i=i+1){ //rows
                var sum = 0.0;
                for(var j=0;j<n;j=j+1){ //cols
                    sum = sum + Math.abs(A[i][j]);
                }
                if(max < sum) max = sum; //take the max.
            }
            break;
            
        case '2': //2-norm (Euclidean distance (default) ref: https://au.mathworks.com/matlabcentral/answers/117178-what-does-the-function-norm-do)
            //var A = [[5],[-1],[-2]];
            //console.log(matrix_norms(A,'2'));
            //--> returns 5.4772
            hlao.assert((n == 1),'Assertion failed: m x 1 or 1 x n vector only - matrix_norms(A,"2").');
            for(var j=0;j<n;j=j+1){ //cols
                var sum = 0.0;
                for(var i=0;i<m;i=i+1){ //rows
                    sum = sum + Math.pow(A[i][j],2.0);
                }
            }
            max = Math.sqrt(sum);
            break;
    
        default:
            hlao.assert(false,'Assertion failed: unknown "normType" specified in function matrix_norms().');
    }
    
    return max;
}

function trace(A){
    //sum of diagonal elements
    //var A = [[5,-4,2],[-1,2,3],[-2,1,0]];
    //console.log(trace(A));
    //--> returns 
    var dim = size(A);
    var m = dim[0];
    var n = dim[1];
    
    hlao.assert((m == n),'Assertion failed: m x n must be a square matrix - trace().');
    var sum = 0.0;
    for(var i=0;i<m;i=i+1){ //rows
        for(var j=0;j<n;j=j+1){ //cols
            if(i == j) sum = sum + A[i][j];
        }
    }
    
    return sum;
    
}

function size(X,DIM){
    if(typeof X[0].length == 'undefined'){ //row vector
        var m = 1;
        var n = X.length;
    }
    else{
        var m = X.length;
        var n = X[0].length;
    }
    
    if(typeof DIM == 'undefined') return [m,n];
    else {
        switch(DIM){
            case 1: //number of rows
                return m;
                break;
                
            case 2: //number of columns
                return n;
                break;
                
            default:
                hlao.assert(false,'Assertion failed: unknown dimension specified in function size().');
        }
    }
}

function all(X,DIM){
    var m = X.length;
    var n = X[0].length;
    var allElements_defined = true;
    var v = []; //row vector
    
    if(typeof DIM == 'undefined') var DIM = 2;
    switch(DIM){
        case 1: //m - check row by row
            for(var i=0;i<m;i=i+1){
                allElements_defined = true;
                for(var j=0;j<n;j=j+1){
                    if(typeof X[i][j] == 'undefined') allElements_defined = false;
                }
                if(allElements_defined) v.push(1);
                else v.push(0);
            }
            break;
            
        case 2: //n - check column by column
            for(var i=0;i<n;i=i+1){ //col
                allElements_defined = true;
                for(var j=0;j<m;j=j+1){ //row
                    if(typeof X[j][i] == 'undefined') allElements_defined = false;
                }
                if(allElements_defined) v.push(1);
                else v.push(0);
            }
            break;
            
        default:
            hlao.assert(false,'Assertion failed: unknown dimension specified in function all().');
    }
    
    return v;
}

export {
    reshape,
    unroll,
    repmat,
    isequal,
    any,
    diag,
    matrix_norms,
    trace,
    size,
    all
};