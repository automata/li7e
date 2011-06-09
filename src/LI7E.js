/* 
 * LI7E - a 
 * 
 */

// or maybe we can claim just one global var: var LI7E = (function () {})(); ??
(function () {
    var LI7E;

    LI7E.debug = function (msg) {
        console.log("LI7E DEBUG", msg);
    };
})();