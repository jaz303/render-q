!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.renderq=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(win) {

    var rendering   = false;
    var sched       = false;
    var queue       = [];
    var aft         = [];
    
    function error(phase, error) {
        console.error(phase, error);
    }

    function drain() {

        sched = false;

        //
        // 1. render

        var now = queue;
        queue = [];

        rendering = true;
        for (var i = 0, len = now.length; i < len; ++i) {
            try {
                now[i]();
            } catch (e) {
                error('render', e);
            }
        }
        rendering = false;

        //
        // 2. after callbacks

        var now = aft;
        aft = [];

        for (var i = 0, len = now.length; i < len; ++i) {
            try {
                now[i]();
            } catch (e) {
                error('after', e);
            }
        }

    }

    function enqueue(cb) {
        if (rendering) {
            try {
                cb();    
            } catch (e) {
                error('render', e);
            }
        } else {
            later(cb);
        }
    }

    function later(cb) {
        queue.push(cb);
        if (!sched) {
            sched = true;
            win.requestAnimationFrame(drain);
        }
    }

    function after(cb) {
        aft.push(cb);
    }

    enqueue.later = later;
    enqueue.after = after;
    enqueue.isRendering = function() { return rendering; }

    return enqueue;

}
},{}]},{},[1])(1)
});