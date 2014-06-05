var slider = (function(){
  
  var screen;
  var slides = [];
  var cache = -1000;
  var render, renderfns, ival;

  /* Effects */
  
  function slideDown (elem, end, p) { 
    end = parseInt(end, 10);
    var top = parseInt(elem.style.top, 10);
    var factor = (end - top) * p;
    var current = top + factor;
    elem.style.top =  current + "px";
    cache = current;
  }
  
  renderfns = {
    "dropdown" : slideDown
  };
  
  /* Slide functions */  

  function interval(currentSlide){
    ival = setInterval(function(){
      if(currentSlide > slides.length - 1) {
        currentSlide = 0;
      }
      showSlide(slides[currentSlide]);
      activateBullet(currentSlide);
      currentSlide++;
    }, 7000);
    
  }

  function animate (conf) {
    setTimeout(function(){
      var start = Date.now();
      (function loop () {
        var p = (Date.now()-start)/conf.duration;
        if (p > 0.5) {
          render(
            conf.elem, 
            conf.end, 
            1
          );
          addSlideHTML(conf.html);
        }
        else {
          requestAnimationFrame(loop);
          render(
            conf.elem, 
            conf.end, 
            BezierEasing.type["ease-out"](p)
          );
        }
      }());
    }, conf.delay);  
  }

  function showSlide(conf) {
    
    var slide_img = document.getElementById('slide_img') || false;
    if(slide_img) {
      slide_img.parentNode.removeChild(slide_img);      
    }
    var slide_html = document.getElementById('slide_html') || false;
    if(slide_html) {
      slide_html.parentNode.removeChild(slide_html);      
    }

    var img = document.createElement('img');
    img.id = "slide_img";
    img.src = conf.src;
    img.style.position = "absolute";
    img.style.top = "-500px";
    img.style.left = conf.left;
    conf.animation.elem = img;
    img.onload = function(){
      animate(conf.animation);    
    };
    screen.appendChild(img);
  }
  
  function addSlide(slide) {
    slides.push(slide);
  }

  function changeSlide(num){
    var currentSlide = num + 1;
    clearInterval(ival);  
    showSlide(slides[num]);
    interval(currentSlide);
  }
    
  function addSlideHTML(html) {
    var div = document.createElement('div');
    div.id = "slide_html";
    div.innerHTML = html.content;
    div.style.position = "absolute";
    div.style.top = html.position.top;
    div.style.left = html.position.left;
		if(html.className) {
			div.className = html.className;
		}
    screen.appendChild(div);          
  }

  /*  Control functions */  

  function addBulletContainer() {
    var bullets = document.createElement('div');
    bullets.id = "bullets";
    screen.appendChild(bullets);
    for(var i = 0; i < slides.length; i++) {
      addBullet(i);
    }  
  }
  
  function addBullet(num) {
    var bullets = document.getElementById('bullets');
    var link = document.createElement('a');
    if(num === 0) {
      link.className = "slide_active";      
    }
    link.onclick = function(){
      changeSlide(num-1);
      activateBullet(num-1);
    };
    num = num + 1;
    link.title = "Slide " + num;
    // link.href = "#slide-" + num;
    link.href = "javascript:;";
    link.innerHTML = "Slide " + num;
    bullets.appendChild(link);
  }
  
  function activateBullet(currentSlide) {
    var bullets = document.querySelectorAll('#bullets a');    
    for(var i = 0; i < bullets.length; i++) {
      if(currentSlide === i) {
        bullets[i].className = "slide_active";      
      } else {
        bullets[i].className = "";      
      }
    }  
  }
  
  /*  Start animation */  
  
  function initAnimation(conf){
    var currentSlide = 1;
    screen = document.querySelector(conf.id);
    addBulletContainer();
    render = (conf.type && renderfns[conf.type] !== undefined) ? renderfns[conf.type] : renderfns.dropdown;
    showSlide(slides[0]);
    interval(currentSlide);   
  }
  
  /*  Public methods */  

  return {
    add: addSlide,
    init: initAnimation
  };
  
}());
