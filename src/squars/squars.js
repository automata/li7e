var flapLength = 16; // Number of squares in the grid
var padding = 6;
var fps = 15; // fastest fps to allow (to prevent less cpu usage)
var squarsWidth = 450; // Width of canvas
var color = true; // Use colours or Black + White
var rounded = false; // Use rounded corners?
var smoke = false;
var palette = false; // paletted colors or random
var pitchOffset = 0;

var browserwidth;
var browserheight;
var canvas;
var canvasSquars;
var animation;
var outBounds;
var clicked = {pressed:false, out:false};
var oldd = new Date();
var flaps;
var gridwidth;
var elements= []; 
var padswitches = [];
var waves = []; // Push 'wave' particles here.
var interval = Math.round(1000/fps);

function init() {
    canvas = document.getElementById('squars'); //$('#squars')[0]
    canvas.width = canvas.style.width = squarsWidth;
    canvas.height = canvas.style.height = squarsWidth;
    canvas.onselectstart = function () { return false; }
    
    if (!canvas.getContext){ 
	alert("Sorry, your browser does not support html 5 canvas. Please try with another browser!!");
	return;
    }
    canvasSquars = canvas.getContext("2d");
    
    // ie canvas.onmousedown = function () { return false; } // mozilla
    
    var h = canvas.height;
    gridwidth = (h - (flapLength+1)*padding)/flapLength;

    var tx=0, ty=0,z =0;
    for (var foo=0; foo<flapLength; foo++) {
	tx = padding;
	ty += padding;
	for (var bar=0; bar<flapLength; bar++) {
	    elements.push({x:Math.round(tx), y:Math.round(ty), gx:bar, gy:foo, o:z});			
	    tx += gridwidth + padding;
	    z++;
	}
	ty += gridwidth;
    }
    
    paintGrids();
    
    for (var i=0; i<flapLength*flapLength; i++) {
	padswitches[i] = false;
    }


}

var row=0;
function paintRow() {
    row++;
    row%=16;
    paintRow2(row);
    return false;
}

//var strokeButtonBorder = "rgba(100,100,100,1)";
var strokeButtonBorder = "rgba(20,20,20,0)";
var fillClickedButton = "rgba(100,100,100,0.8)";
var fillUnclickedButton = "rgba(60,60,60,0.5)";
var fillBackground = "rgba(0,0,0,1)";
var fillHighlightColor = "rgba(255,255,255,1)"

// This paintRow function is called when Beat is made.
function paintRow2(row) {
    canvasSquars.globalCompositeOperation = "source-over";
    var i,te;
    for (i=row; row<elements.length; i+= 16) {
	te = elements[i];
	
	// Show a bright highlight
	if (padswitches[te.o]) {
	    canvasSquars.fillStyle = fillHighlightColor;
	    if (rounded) {
		roundedRect(canvasSquars,te.x,te.y,  gridwidth,gridwidth,5);
		canvasSquars.fill();
	    } else {
		canvasSquars.fillRect(te.x,te.y, gridwidth,gridwidth);
	    }
	    if (smoke) {
		waves.push({g:te.o, t:0});
	    }
	} 	 
    }
}

function roundedRect(canvasSquars,x,y,width,height,radius){  
    canvasSquars.beginPath();  
    canvasSquars.moveTo(x,y+radius);  
    canvasSquars.lineTo(x,y+height-radius);  
    canvasSquars.quadraticCurveTo(x,y+height,x+radius,y+height);  
    canvasSquars.lineTo(x+width-radius,y+height);  
    canvasSquars.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
    canvasSquars.lineTo(x+width,y+radius);  
    canvasSquars.quadraticCurveTo(x+width,y,x+width-radius,y);  
    canvasSquars.lineTo(x+radius,y);  
    canvasSquars.quadraticCurveTo(x,y,x,y+radius);  
} 

function paintOneGrid(e) {
    var te;
    te = elements[e];
    canvasSquars.globalCompositeOperation = "source-over";
    canvasSquars.strokeStyle = strokeButtonBorder;
    
    if (rounded) {
	roundedRect(canvasSquars,te.x,te.y, gridwidth,gridwidth,5);
	canvasSquars.stroke();
    } else {
	canvasSquars.strokeRect(te.x,te.y, gridwidth,gridwidth);
    }

    if (padswitches[te.o]) { // if the button is clicked			
	canvasSquars.fillStyle = fillClickedButton;
	if (rounded) {
	    canvasSquars.restore();
	    roundedRect(canvasSquars,te.x,te.y,gridwidth,gridwidth,5);
	    canvasSquars.fill();
	} else {
	    canvasSquars.fillRect(te.x,te.y,gridwidth,gridwidth);
	}
    } else { // if the button isnt clicked
	canvasSquars.fillStyle = fillUnclickedButton; 
	if (rounded) {
	    canvasSquars.restore();
	    roundedRect(canvasSquars,te.x,te.y,gridwidth,gridwidth,5);
	    canvasSquars.fill();
	} else {
	    canvasSquars.fillRect(te.x,te.y, gridwidth,gridwidth);
	} 	 
    }
}

// Clear and paint background
function paintGrids() {
    
    canvasSquars.globalCompositeOperation = "source-over";
    canvasSquars.fillStyle = fillBackground;
    canvasSquars.fillRect(0,0,canvas.width,canvas.height);
    
    for (var e in elements) {
	paintOneGrid(e);
    }
    
    /*	 if (smoke) {
	 canvasSquars.globalCompositeOperation = "lighter";
	 
	 var ttl = 15;
	 var p,e; //partiripple
	 
	 for (w in waves) {
	 p = waves[w];
	 e = elements[p.g];
	 var r,g,b,a, l, d;
	 
	 d = (ttl- p.t)/ttl; // amptitude based on decay 
	 //- kind of lineaer (expr as fraction)
	 l  =  p.t * 25; // size of wave based on time.
	 
	 
	 // Non-linear particle animation
	 //d = Math.exp(-(ttl- p.t)/ttl) / Math.exp(1); // e^-x graph
	 //l = Math.exp(1) / Math.exp((ttl - p.t)/ttl) * 75;  // ln(x) graph
	 
	 
	 var ex=e.x+gridwidth/2, ey=e.y+gridwidth/2;
	 
	 var gradblur = canvasSquars.createRadialGradient(ex, ey, 0, ex, ey, l);
	 canvasSquars.beginPath();
	 
	 if (color) {
	 
	 if (palette) {
	 // Palette style
	 r = 255-42.5*e.gx;
	 g = 255-42.5*e.gy; //(flapLength- gy)
	 b = 5* p.t  ; //  255-	
	 } else { 
	 // random colors mutiplied by decay factor
	 r = (Math.random()*255) *  d * 1.8;
	 g = (Math.random()*255) *  d * 1.8;
	 b = (Math.random()*255) *  d * 1.8;
	 // note *1 gives a little unsaturated colors
	 // but *2 creates too much white outs
	 // probably a sine curve can normalize the values
	 }
	 
	 r = r >> 0;
	 g = g >> 0;
	 b = b >> 0;
	 
	 a =1; // alpha

	 } else {
	 r = g= b= Math.round( d *    100);
	 a =1 ;
	 }
	 
	 var edgecolor1 = "rgba(" + r + "," + g + "," + b + ",0.45)";
	 var edgecolor2 = "rgba("  + r + "," + g + "," + b + ",0.3)";
	 var edgecolor3 = "rgba("  + r + "," + g + "," + b +",0.15)";
	 var edgecolor4 = "rgba(" + r + "," + g + "," + b + ",0)";
	 
	 gradblur.addColorStop(0,edgecolor4);

	 gradblur.addColorStop(0.15,edgecolor3);
	 gradblur.addColorStop(0.3,edgecolor2);
	 gradblur.addColorStop(0.5,edgecolor1);
	 gradblur.addColorStop(0.7,edgecolor2);
	 gradblur.addColorStop(0.85,edgecolor3);
	 gradblur.addColorStop(1,edgecolor4);
	 
	 canvasSquars.fillStyle = gradblur;
	 canvasSquars.arc(ex, ey, l, 0, Math.PI*2, false);
	 canvasSquars.fill();
	 
	 p.t++;
	 if (p.t>ttl) {
	 waves.splice(w,1);
	 }
	 
	 }
	 }
    */	 // $('#jdebug').html(JSON.stringify(elements));  
}

// Render Ripple..
function ripple() {
    paintGrids();
    return false;
}

function getGrid(x,y) {
    var te;
    for (var e in elements) {
	te = elements[e];
	if (te.x <= x && x <= (te.x+gridwidth) && te.y <= y && y <= (te.y+gridwidth)) {
	    return te;
	} 
    }
    return null;
}

function squareClicked(x,y) {
    var clickgrid;
    if (clickgrid = getGrid(x,y)) {

	//$('#jdebug').html(x+" "+y + JSON.stringify(getGrid(x,y)));
	if (clicked.lastGrid && (clickgrid.gx == clicked.lastGrid.gx)&&(clickgrid.gy == clicked.lastGrid.gy)) {
	    // Still on the last grid
	}else {// BUGGY!
	    if (clicked.toggle == null ) {
		clicked.toggle = !padswitches[clickgrid.o];
	    }
	    
	    if (clicked.toggle != padswitches[clickgrid.o]){
		// Call AS3
		//if (!$('#sionProject')[0].as_toggle) {
		//	$('#jdebug').html("Error, flash bridge is not loaded");
		//}
		//var ret = $('#sionProject')[0].as_toggle(clickgrid.gx, clickgrid.gy);
		
		padswitches[clickgrid.o]= clicked.toggle;

		var tmp = patterns[clickgrid.gy].pattern;
		//$('#jdebug').html(clicked.toggle+" " +padswitches[clickgrid.o] +" "+ clickgrid.gx + " "+ clickgrid.gy);
                //console.log(clickgrid.gx, clickgrid.gy);
		// start the audio
		if(clicked.toggle){
		    //$('#jdebug').html("Clicked");
                    console.log("entrei");
		    var note = majorScale[(Math.abs(clickgrid.gx - 7))];
		    tmp.list[clickgrid.gx] = note; 
		    //socket.send(id[1] + ' ' + id[2] + ' 127');
		}
		// cancel the audio
		if(!clicked.toggle){
		    //$('#jdebug').html("UnClicked");
		    tmp.list[clickgrid.gx] = 0;
		    //socket.send(id[1] + ' ' + id[2] + ' 0');
		}

		patterns[clickgrid.gy].pattern = tmp;
		paintOneGrid(clickgrid.o);				  
		clicked.lastGrid = clickgrid;   
	    }
	}
    } else {
	clicked.lastGrid = null;
	//$('#jdebug').html("no hit"); 
    }
}

// Options Setters

// Clear grids 
function clearClicks() {
    /*
      var ee;
      for (var e in elements) {
      ee = elements[e];
      if (padswitches[ee.o]) {
      var ret = $('#sionProject')[0].as_toggle(ee.gx, ee.gy);
      // we should use a single clear all call to AS
      }		
      } */
    //$('#sionProject')[0].as_clearall();
    padswitches = [];
    paintGrids();
}

function toggleColor(v) {
    color = v;
}

function toggleRounded(v) {
    rounded = v;
}

function toggleSmoke(v) {
    smoke = v;
}

function toggleRandom(v) {
    palette = !v;
}

function pitchUp() {
    pitchOffset ++;
    //$('#sionProject')[0].as_pitch(pitchOffset);
}

function pitchDown() {
    pitchOffset --;
    //$('#sionProject')[0].as_pitch(pitchOffset);
}

$(document).ready(function(){
    // Audiolet
    majorScale = [ 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];
    audiolet = new Audiolet();
    audiolet.scheduler.setTempo(120);
    
    // creating an instrument    // borrowed from @o_amp_o's code
    HighSynth = new Class({
	Extends: AudioletGroup,
	initialize: function(audiolet) {
	    AudioletGroup.prototype.initialize.apply(this, [audiolet, 0, 1]);
            
	    // Triangle base oscillator
	    this.triangle = new Triangle(audiolet);
            
	    // Note on trigger
	    this.trigger = new TriggerControl(audiolet);
            
	    // Gain envelope
	    this.gainEnv = new PercussiveEnvelope(audiolet, 0, 0.2, 0.2);
	    this.gainEnvMulAdd = new MulAdd(audiolet, 0.3);
	    this.gain = new Gain(audiolet);
            
	    // Connect oscillator
	    this.triangle.connect(this.gain);

	    // Connect trigger and envelope
	    this.trigger.connect(this.gainEnv);
	    this.gainEnv.connect(this.gainEnvMulAdd);
	    this.gainEnvMulAdd.connect(this.gain, 0, 1);
	    this.gain.connect(this.outputs[0]);
	}
    });

    synths = [];
    patterns = [];
    duration = new PProxy(new PSequence([1], Infinity));

    for (i=0; i<16; i++) {
	synths[i] = new HighSynth(audiolet)
	synths[i].connect(audiolet.output);
	patterns[i] = new PProxy(new PSequence([0, 0, 0, 0, 0, 0, 0, 0], Infinity));
	audiolet.scheduler.play([patterns[i]], duration,
				function (frequency) {
				    this.trigger.trigger.setValue(1);
                                    
				    this.triangle.frequency.setValue(frequency);
				}.bind(synths[i]));
    }

    init();

    $(canvas).mousedown(function(e) {
	var x = e.pageX - $(this).offset().left;
	var y = e.pageY - $(this).offset().top  ;

	// Check if clicked
	clicked.pressed = true;
	squareClicked(x,y);
    }).mouseup(function(e) {
	clicked.pressed = false;
	clicked.out = false;
	clicked.x = 0;
	clicked.y = 0;
	clicked.lastGrid = null;
	clicked.toggle = null;
	
    }).mousemove(function(e) {
	/* 

	   var newd = new Date();
	   if ((newd.getTime()-oldd.getTime())<interval) {
	   return ;
	   // this prevents using too much cpu cycles
	   }	
	   oldd = newd;
	*/

	var x = e.pageX - $(this).offset().left ;
	var y = e.pageY - $(this).offset().top ;

	//$('#jdebug').html(x+" "+y + getGrid(x,y));

	if (clicked.out && !outBounds) {				
	    //$('#jdebug').html("in and dragged" + clicked.out + "outBounds"+outBounds);
	    clicked.pressed = true;
	    clicked.out = false
	    
	} else if (clicked.pressed && outBounds){
	    clicked.pressed = false;
	    clicked.out = true;
	    //$('#jdebug').html("stop drag");
	}

	if (clicked.pressed) {
	    squareClicked(x,y);
	    
	} else {

	    if (getGrid(x,y)!=null) {
		// If mouse over draggable box change cursor
		$('body').css({cursor:'pointer'}); // Or move
	    } else {
		$('body').css({cursor:'auto'}); //#squars
	    }
	}
	
	
    }).mouseout(function(e) {
	
	if (clicked.pressed) clicked.out = true;
	clicked.pressed = false;
	
    }).mouseenter(function(e) {
	
	if (clicked.out) {
	    clicked.pressed = true;
	    clicked.out = false;
	}
	
    });
    
    //animation = setInterval(ripple, interval);                            

});


function initDim(){
    /* Do not touch*/
    browserwidth = $(window).width();
    browserheight = $(window).height();
    
}

function play(){
    //$('#sionProject')[0].as_pitch(15);
    if (!animation) {
	animation = setInterval(ripple, interval);
	//animationStarted=  true;
    }
    //$('#sionProject')[0].as_play();
    
}

function stop() {
    //$('#sionProject')[0].as_shutup();
    if (animation) {
	clearInterval(animation);
	//animationStarted = false;
	animation = null;
    }
    
}
