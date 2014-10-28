var test 	= require('tape');
var renderq	= require('..');

window.init = function() {

	function t(msg, cb) {
		test(msg, function(assert) {
			document.body.innerHTML = '';
			var render = renderq(window);
			cb(assert, render);
		});
	}

	t('enqueued function is called asynchronously', function(assert, q) {
		
		var out = [];
		
		q(function() { out.push(1); });
		assert.deepEquals(out, []);

		setTimeout(function() {
			assert.deepEquals(out, [1]);
			assert.end();
		}, 200);

	});

	t('after() function is called after rendering', function(assert, q) {

		var out = [];

		q.after(function() {
			assert.deepEquals(out, [1]);
			out.push(2);
		});
		
		q(function() { out.push(1); });

		setTimeout(function() {
			assert.deepEquals(out, [1,2]);
			assert.end();	
		}, 200);

	});

	t('enqueued functions are called in order', function(assert, q) {

		var out = [];
		
		q(function() { out.push(1); });
		q(function() { out.push(2); });

		q.after(function() {
			assert.deepEquals(out, [1,2]);
			assert.end();
		});

	});

	t('enqueuing during rendering is called immediately', function(assert, q) {
		var out = [];
		q(function() {
			q(function() { out.push(1); });
			assert.deepEquals(out, [1]);
			assert.end();
		});
	});

	t('q.later() outwith rendering will be applied by first render loop', function(assert, q) {

		var out = [];
		
		q.later(function() { out.push(1); });

		q.after(function() {
			assert.deepEquals(out, [1]);
			assert.end();
		});

	});

	t('q.later() during rendering is deferred until next render loop', function(assert, q) {
		
		var out = [];
		q(function() {
			out.push(1);
			q.later(function() { out.push(3); });
			q.after(function() { out.push(2); });
		});

		setTimeout(function() {
			assert.deepEquals(out, [1,2,3]);
			assert.end();
		}, 200);
	});

	t('isRendering() is false when not rendering', function(assert, q) {
		assert.notOk(q.isRendering());
		assert.end();
	});

	t('isRendering() is true when rendering', function(assert, q) {
		q(function() {
			assert.ok(q.isRendering());
			assert.end();
		});
	});

	t('isRendering() is false when in after callback', function(assert, q) {
		q.after(function() {
			assert.notOk(q.isRendering());
			assert.end();
		});
	});

}