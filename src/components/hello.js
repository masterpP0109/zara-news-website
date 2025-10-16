var canvas = document.createElement('canvas');

canvas.width = 500;
canvas.height = 250;

var ctx = canvas.getContext('2d')

ctx.font = '30px Cursive';
ctx.fillText("Hello world!", 50, 50 );

document.body.appendChild(canvas);