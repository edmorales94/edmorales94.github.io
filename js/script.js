let canvas = document.getElementById('particles'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');

const widthofhtml = document.documentElement.clientWidth;
let totalParticles = 60;
if(widthofhtml < 500){
    totalParticles = 38;
}
console.log("width: " + widthofhtml);
console.log("total particles:" + totalParticles);

let
    ball_color = {
       r: 255,
       g: 255,
       b: 255
   },
   R = 2,
   balls = [],
   alpha_f = 0.03,

// Line
   link_line_width = 1.5,
   dis_limit = 260,
    mouse_in = false,
   mouse_ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
   };

// Random speed
function getRandomSpeed(pos){
    let min = -0.5,
       max = 0.5;
    if (pos === 'top') {
        return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
    } else if (pos === 'right') {
        return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
    } else if (pos === 'bottom') {
        return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
    } else if (pos === 'left') {
        return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}
// Random Ball
function getRandomBall(){
    let pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    if (pos === 'top') {
        return {
            x: randomSidePos(can_w),
            y: -R,
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        }
    } else if (pos === 'right') {
        return {
            x: can_w + R,
            y: randomSidePos(can_h),
            vx: getRandomSpeed('right')[0],
            vy: getRandomSpeed('right')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        }
    } else if (pos === 'bottom') {
        return {
            x: randomSidePos(can_w),
            y: can_h + R,
            vx: getRandomSpeed('bottom')[0],
            vy: getRandomSpeed('bottom')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        }
    } else if (pos === 'left') {
        return {
            x: -R,
            y: randomSidePos(can_h),
            vx: getRandomSpeed('left')[0],
            vy: getRandomSpeed('left')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        }
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    //Here's the code for the width of the particles
    Array.prototype.forEach.call(balls, function(b){
       if(!b.hasOwnProperty('type')){
           ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           ctx.beginPath();
           ctx.arc(b.x, b.y, 6, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
       }
    });
}

// Update balls
function updateBalls(){
    let new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;

        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           new_balls.push(b);
        }

        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });

    balls = new_balls.slice(0);
}

// Draw lines
function renderLines(){
    let fraction, alpha;
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {

           fraction = getDisOf(balls[i], balls[j]) / dis_limit;

           if(fraction < 1){
               alpha = (1 - fraction).toString();

               ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
               ctx.lineWidth = link_line_width;

               ctx.beginPath();
               ctx.moveTo(balls[i].x, balls[i].y);
               ctx.lineTo(balls[j].x, balls[j].y);
               ctx.stroke();
               ctx.closePath();
           }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    let  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);

    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < totalParticles){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);

    renderBalls();

    renderLines();

    updateBalls();

    addBallIfy();

    const size = window.innerWidth/20;
    ctx.font = "900 " + size + "px Open Sans";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Software Developer".toUpperCase(), canvas.width/2, canvas.height/2);

    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(let i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(){
    console.log('Window Resize...');
    initCanvas();
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
});

function goMovie(){
    initCanvas();
    initBalls(30);
    window.requestAnimationFrame(render);
}
goMovie();

// Mouse effect
canvas.addEventListener('mouseenter', function(){
    console.log('mouseenter');
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    console.log('mouseleave');
    mouse_in = false;
    let new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    let site = e || window.event;
    mouse_ball.x = site.pageX;
    mouse_ball.y = site.pageY;
    // console.log(mouse_ball);
});

(function($){
    "use strict";

    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if(location.pathname.replace(/^\//, '')== this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: (target.offset().top - 54)
                }, 1000, "easeInOutExpo");
                return false;
            }
        }
    });

    $('body').scrollspy({
        target: '#navigationBar',
        offset: 0
    });
})(jQuery);

let navBar = document.getElementById("navigationBar");
let links = navBar.getElementsByClassName("nav-item");

for(let i = 0; i < links.length; i++){
    links[i].addEventListener("click", function () {
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active"
    });
}














