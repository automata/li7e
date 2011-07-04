//     LI7E - A framework for creative code on the Web

// Starting...
// -----------

// This is the only var globally visible outside. Every class
// is attached to this.
var LI7E = {};

// Auxiliary Functions
// -------------------

// Show debug messages to appropriated output
LI7E.debug = function (msg) {
    console.log("LI7E DEBUG", msg);
};

// Graphics
// --------

// A list to store instances of Processing/Raphael/Three/... associated
// with their canvas DOM id.
LI7E.canvas = [];

// Attach a Processing instance to the canvas list.
LI7E.startProcessing = function (canvasId) {
    // We just create a canvas if it doesn't exists yet.
    if (LI7E.canvas[canvasId] === undefined) {
        var c = document.getElementById(canvasId);
        LI7E.canvas[canvasId] = new Processing(c);
    }
};

// Or we can use a more POO approach...
LI7E.ProcessingCanvas = function (canvasId) {
    this.canvasId = canvasId;
    this.canvasElement = document.getElementById(canvasId);
    this.processing = new Processing(this.canvasElement);
};

// Audio
// -----

// A list to store instances of audio outputs
LI7E.audioOutputs = []

LI7E.startAudiolet = function (audioOutputId) {
    if (LI7E.audioOutputs[audioOutputId] === undefined) {
        LI7E.audioOutputs[audioOutputId] = new Audiolet();
    }
};

// Physical Engine
// ---------------

// Scheduller
// ----------

// Evaluator
// ---------

LI7E.eval = function (script) {
    var audiolet = new Audiolet();
    // Just checking if the first element of the script parse list is 'Script'
    if (script[0] !== 'Script') {
        return false;
    } else {
        // Evaluating each line of the script
        var lines = script[1];
        for (var i=0; i<lines.length; i++) {
            // Each line is a list of the kind ['Type', [{Exp1}, {Exp2}, ...]]
            var type = lines[i][0];
            var exprs = lines[i][1];

            // Let's analyze each type of expressions...

            // DspExpressions (e.g. foo -> bar -> baz)
            if (type === 'DspExpressions') {
                for (var j=0; j<exprs.length-1; j++) {
                    // They have to be evaluated by connection pairs: from -> to
                    var from = exprs[j];
                    var to = exprs[j+1];

                    // Every element on the connection pair must be an Instance
                    // of some JS class
                    if ((from[0] === 'Instance') && (to[0] === 'Instance')) {
                        var fromObj = from[1].obj.toString();
                        var fromClass = from[1].class.toString();
                        var toObj = to[1].obj.toString();
                        var toClass = to[1].class.toString();

                        // First we have to create objects for 'from' and 'to'
                        eval(fromObj + ' = new ' + fromClass + '(audiolet);');

                        // FIXME: maybe it's better to have just toObj == 'output'
                        // Output is a special case, we don't need to create that,
                        // just connect the fromObj to the audiolet.output
                        if (toClass === 'Output') {
                            eval(fromObj + '.connect(audiolet.output);');
                        } else {
                            eval(toObj + ' = new ' + toClass + '(audiolet);');
                            // Now let's connect the objects!
                            eval(fromObj + '.connect(' + toObj + ');');
                            console.log(eval(fromObj));
                        }

                    }
                }
            // CtrlExpressions (e.g. foo.frequency = [42 42] ^ Infinity)
            } else if (type === 'CtrlExpressions') {
                for (var j=0; j<exprs.length; j++) {
                    var ctrl = exprs[j];
                    
                    // Every ctrl expression is a message sent to a target obj
                    // previously instantiated
                    if (ctrl[0] === 'Message') {
                        var target = ctrl[1].target;
                        var message = ctrl[1].message;
                        
                        // Checking which kind of message we are sending
                        if (message[0] === 'Attrib') {
                            var attribute = message[1].attribute.toString();
                            var pattern = message[1].pattern.toString();
                            var time = message[1].at.toString();
                            // FIXME: we could have attributions without schedulling!
                            // First we have to create a pattern
                            eval('var p = new PSequence(['+pattern+'], '+time+');');
                            // So now we can put the event on the scheduler
                            eval('audiolet.scheduler.play([p], 1, function (v) { '+target+'.'+attribute+'.setValue(v); });');
                        }
                    }
                }
            }
        }
    }
};

// Editor
// ------
