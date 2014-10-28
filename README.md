# render-q

Schedule rendering operations for future batch application with `requestAnimationFrame()`.

## API

#### `q = renderq(window)`

Create a new queue bound to `window`.

#### `q(fn)`

Enqueue render function `fn` to be called inside the next `requestAnimationFrame()` callback. If a rendering batch is currently in process the function will be invoked immediately.

#### `q.after(fn)`

Enqueue `fn` to be called after the current batch of render callbacks (i.e. those enqueued via `q()`) have been completed.

#### `q.later(fn)`

Enqueue render function `fn` to be called later inside a `requestAnimationFrame()` callback. `q.later()` differs from `q()` in that it will never invoke `fn` immediately, and always schedule it for the next batch - even if a rendering batch is currently active. Useful for scheduling animations.

#### `q.isRendering()`

Returns `true` if this queue is currently processing a batch of render callbacks.