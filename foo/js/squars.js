var flapLength = 16; // Number of squares in the grid
var padding = 6;
var squarsWidth = 450; // Width of canvas
var canvas;
var canvasSquars;
var outBounds;
var clicked = {pressed:false, out:false};
var gridwidth;
var rounded = false; // Use rounded corners?
var elements= []; 
var padswitches = [];
var patterns = [];
var tmp = [];
function init() {
    canvas = document.getElementById('squars'); 
    canvas.width = canvas.style.width = squarsWidth;
    canvas.height = canvas.style.height = squarsWidth;
    canvas.onselectstart = function () { return false; }
    
    if (!canvas.getContext){ 
	alert("Sorry, your browser does not support html 5 canvas. Please try with another browser!!");
	return;
    }
    canvasSquars = canvas.getContext("2d");

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

var strokeButtonBorder = "rgba(20,20,20,0)";
var fillClickedButton = "rgba(100,100,100,0.8)";
var fillUnclickedButton = "rgba(60,60,60,0.5)";
var fillBackground = "rgba(0,0,0,1)";
var fillHighlightColor = "rgba(255,255,255,1)"

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
	if (clicked.lastGrid && (clickgrid.gx == clicked.lastGrid.gx)&&(clickgrid.gy == clicked.lastGrid.gy)) {
	    // Still on the last grid
	} else {
	    if (clicked.toggle == null ) {
		clicked.toggle = !padswitches[clickgrid.o];
	    }
	    if (clicked.toggle != padswitches[clickgrid.o]){
		padswitches[clickgrid.o]= clicked.toggle;
		tmp = patterns[clickgrid.gy].pattern;
		// start the audio
		if(clicked.toggle){

		    var note = majorScale[(Math.abs(clickgrid.gx - 7))];
		    tmp.list[clickgrid.gy] = 240;
		   console.log(note); 

		}
		// cancel the audio
		if(!clicked.toggle){
		    tmp.list[clickgrid.gy] = 0;
		}

		patterns[clickgrid.gy].pattern = tmp;
                console.log(patterns[clickgrid.gy]);
		paintOneGrid(clickgrid.o);				  
		clicked.lastGrid = clickgrid;   
	    }
	}
    } else {
	clicked.lastGrid = null;
	}
}

function clearClicks() {
    padswitches = [];
    paintGrids();
}

$(document).ready(function(){
    // Audiolet
    majorScale = [ 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];
    audiolet = new Audiolet();
    audiolet.scheduler.setTempo(128);
    
    var HighSynth = function(audiolet) {
		AudioletGroup.apply(this, [audiolet, 0, 1]);

		// Triangle base oscillator
		this.triangle = new Triangle(audiolet);

		// Note on trigger
		this.trigger = new TriggerControl(audiolet);

		// Gain envelope
		this.gainEnv = new PercussiveEnvelope(audiolet, 0, 0.1, 0.15);
		this.gainEnvMulAdd = new MulAdd(audiolet, 0.1);
		this.gain = new Gain(audiolet);

		// Feedback delay
		this.delay = new Delay(audiolet, 0.1, 0.1);
		this.feedbackLimiter = new Gain(audiolet, 0.5);

		// Stereo panner
		this.pan = new Pan(audiolet);
		this.panLFO = new Sine(audiolet, 1 / 8);

		// Connect oscillator
		this.triangle.connect(this.gain);

		// Connect trigger and envelope
		this.trigger.connect(this.gainEnv);
		this.gainEnv.connect(this.gainEnvMulAdd);
		this.gainEnvMulAdd.connect(this.gain, 0, 1);
		this.gain.connect(this.delay);

		// Connect delay
		this.delay.connect(this.feedbackLimiter);
		this.feedbackLimiter.connect(this.delay);
		this.gain.connect(this.pan);
		this.delay.connect(this.pan);

		// Connect panner
		this.panLFO.connect(this.pan, 0, 1);
		this.pan.connect(this.outputs[0]);
    }
    extend(HighSynth, AudioletGroup);

    synths = [];
    patterns = [];
    duration = new PProxy(new PSequence([1], Infinity));

    for (i=0; i<16; i++) {
		synths[i] = new HighSynth(audiolet);
		patterns[i] = new PProxy(new PSequence([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], Infinity));
		audiolet.scheduler.play([patterns[i]], duration,function (frequency) {
														this.trigger.trigger.setValue(1);
														this.triangle.frequency.setValue(frequency);
													}.bind(synths[i]));
		synths[i].connect(audiolet.output);
    }

    init();

    $(canvas).mousedown(function(e) {
	var x = e.pageX - $(this).offset().left;
	var y = e.pageY - $(this).offset().top  ;

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

	var x = e.pageX - $(this).offset().left ;
	var y = e.pageY - $(this).offset().top ;

	if (clicked.out && !outBounds) {				
	    clicked.pressed = true;
	    clicked.out = false
	    
	} else if (clicked.pressed && outBounds){
	    clicked.pressed = false;
	    clicked.out = true;
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
});


function play(){    
}

function stop() {
this.audiolet.scheduler.remove();
}
