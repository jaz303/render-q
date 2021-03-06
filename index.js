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