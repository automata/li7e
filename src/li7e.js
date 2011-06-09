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

// Audio
// -----

// Physical Engine
// ---------------

// DSL
// ---

// Here starts the LI7E DSL

// Editor
// ------
