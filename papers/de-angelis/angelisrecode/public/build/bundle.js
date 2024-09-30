
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	/**
	 * @template T
	 * @template S
	 * @param {T} tar
	 * @param {S} src
	 * @returns {T & S}
	 */
	function assign(tar, src) {
		// @ts-ignore
		for (const k in src) tar[k] = src[k];
		return /** @type {T & S} */ (tar);
	}

	/** @returns {void} */
	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	function create_slot(definition, ctx, $$scope, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, $$scope, fn) {
		return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
	}

	function get_slot_changes(definition, $$scope, dirty, fn) {
		if (definition[2] && fn) {
			const lets = definition[2](fn(dirty));
			if ($$scope.dirty === undefined) {
				return lets;
			}
			if (typeof lets === 'object') {
				const merged = [];
				const len = Math.max($$scope.dirty.length, lets.length);
				for (let i = 0; i < len; i += 1) {
					merged[i] = $$scope.dirty[i] | lets[i];
				}
				return merged;
			}
			return $$scope.dirty | lets;
		}
		return $$scope.dirty;
	}

	/** @returns {void} */
	function update_slot_base(
		slot,
		slot_definition,
		ctx,
		$$scope,
		slot_changes,
		get_slot_context_fn
	) {
		if (slot_changes) {
			const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
			slot.p(slot_context, slot_changes);
		}
	}

	/** @returns {any[] | -1} */
	function get_all_dirty_from_scope($$scope) {
		if ($$scope.ctx.length > 32) {
			const dirty = [];
			const length = $$scope.ctx.length / 32;
			for (let i = 0; i < length; i++) {
				dirty[i] = -1;
			}
			return dirty;
		}
		return -1;
	}

	function null_to_empty(value) {
		return value == null ? '' : value;
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @returns {Text} */
	function empty() {
		return text('');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
	}

	/**
	 * @returns {void} */
	function toggle_class(element, name, toggle) {
		// The `!!` is required because an `undefined` flag means flipping the current state.
		element.classList.toggle(name, !!toggle);
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * https://svelte.dev/docs/svelte#ondestroy
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	// keyed each functions:

	/** @returns {void} */
	function destroy_block(block, lookup) {
		block.d(1);
		lookup.delete(block.key);
	}

	/** @returns {any[]} */
	function update_keyed_each(
		old_blocks,
		dirty,
		get_key,
		dynamic,
		ctx,
		list,
		lookup,
		node,
		destroy,
		create_each_block,
		next,
		get_context
	) {
		let o = old_blocks.length;
		let n = list.length;
		let i = o;
		const old_indexes = {};
		while (i--) old_indexes[old_blocks[i].key] = i;
		const new_blocks = [];
		const new_lookup = new Map();
		const deltas = new Map();
		const updates = [];
		i = n;
		while (i--) {
			const child_ctx = get_context(ctx, list, i);
			const key = get_key(child_ctx);
			let block = lookup.get(key);
			if (!block) {
				block = create_each_block(key, child_ctx);
				block.c();
			} else if (dynamic) {
				// defer updates until all the DOM shuffling is done
				updates.push(() => block.p(child_ctx, dirty));
			}
			new_lookup.set(key, (new_blocks[i] = block));
			if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
		}
		const will_move = new Set();
		const did_move = new Set();
		/** @returns {void} */
		function insert(block) {
			transition_in(block, 1);
			block.m(node, next);
			lookup.set(block.key, block);
			next = block.first;
			n--;
		}
		while (o && n) {
			const new_block = new_blocks[n - 1];
			const old_block = old_blocks[o - 1];
			const new_key = new_block.key;
			const old_key = old_block.key;
			if (new_block === old_block) {
				// do nothing
				next = new_block.first;
				o--;
				n--;
			} else if (!new_lookup.has(old_key)) {
				// remove old block
				destroy(old_block, lookup);
				o--;
			} else if (!lookup.has(new_key) || will_move.has(new_key)) {
				insert(new_block);
			} else if (did_move.has(old_key)) {
				o--;
			} else if (deltas.get(new_key) > deltas.get(old_key)) {
				did_move.add(new_key);
				insert(new_block);
			} else {
				will_move.add(old_key);
				o--;
			}
		}
		while (o--) {
			const old_block = old_blocks[o];
			if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
		}
		while (n) insert(new_blocks[n - 1]);
		run_all(updates);
		return new_blocks;
	}

	/** @returns {void} */
	function validate_each_keys(ctx, list, get_context, get_key) {
		const keys = new Map();
		for (let i = 0; i < list.length; i++) {
			const key = get_key(get_context(ctx, list, i));
			if (keys.has(key)) {
				let value = '';
				try {
					value = `with value '${String(key)}' `;
				} catch (e) {
					// can't stringify
				}
				throw new Error(
					`Cannot have duplicate keys in a keyed each: Keys at index ${keys.get(
					key
				)} and ${i} ${value}are duplicates`
				);
			}
			keys.set(key, i);
		}
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION = '4.2.19';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	/**
	 * @param {Element} node
	 * @param {string} property
	 * @param {any} [value]
	 * @returns {void}
	 */
	function prop_dev(node, property, value) {
		node[property] = value;
		dispatch_dev('SvelteDOMSetProperty', { node, property, value });
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.data === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = /** @type {string} */ (data);
	}

	function ensure_array_like_dev(arg) {
		if (
			typeof arg !== 'string' &&
			!(arg && typeof arg === 'object' && 'length' in arg) &&
			!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
		) {
			throw new Error('{#each} only works with iterable values.');
		}
		return ensure_array_like(arg);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src\components\InteractiveTitle.svelte generated by Svelte v4.2.19 */
	const file$5 = "src\\components\\InteractiveTitle.svelte";

	function create_fragment$5(ctx) {
		let header;
		let h1;

		const block = {
			c: function create() {
				header = element("header");
				h1 = element("h1");
				h1.textContent = "How Does Social Proof Affect Your Life?";
				attr_dev(h1, "class", "svelte-rg02g4");
				add_location(h1, file$5, 8, 4, 118);
				attr_dev(header, "class", "svelte-rg02g4");
				add_location(header, file$5, 7, 0, 104);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, header, anchor);
				append_dev(header, h1);
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(header);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$5.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$5($$self, $$props) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('InteractiveTitle', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InteractiveTitle> was created with unknown prop '${key}'`);
		});

		return [];
	}

	class InteractiveTitle extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "InteractiveTitle",
				options,
				id: create_fragment$5.name
			});
		}
	}

	/* src\sharedComps\Carousel.svelte generated by Svelte v4.2.19 */
	const file$4 = "src\\sharedComps\\Carousel.svelte";
	const get_slide_3_slot_changes = dirty => ({});
	const get_slide_3_slot_context = ctx => ({});
	const get_slide_2_slot_changes = dirty => ({});
	const get_slide_2_slot_context = ctx => ({});
	const get_slide_1_slot_changes = dirty => ({});
	const get_slide_1_slot_context = ctx => ({});
	const get_slide_0_slot_changes = dirty => ({});
	const get_slide_0_slot_context = ctx => ({});

	function get_each_context$2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[8] = list[i];
		child_ctx[10] = i;
		return child_ctx;
	}

	// (24:8) {#each items as item, index}
	function create_each_block$2(ctx) {
		let li;
		let t0_value = /*item*/ ctx[8] + "";
		let t0;
		let t1;
		let li_class_value;
		let mounted;
		let dispose;

		function click_handler() {
			return /*click_handler*/ ctx[7](/*index*/ ctx[10]);
		}

		const block = {
			c: function create() {
				li = element("li");
				t0 = text(t0_value);
				t1 = space();

				attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*item*/ ctx[8] === /*items*/ ctx[0][/*currentSlide*/ ctx[1]]
				? "active"
				: "") + " svelte-qsd49x"));

				add_location(li, file$4, 24, 10, 656);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);
				append_dev(li, t0);
				append_dev(li, t1);

				if (!mounted) {
					dispose = listen_dev(li, "click", click_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[8] + "")) set_data_dev(t0, t0_value);

				if (dirty & /*items, currentSlide*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(/*item*/ ctx[8] === /*items*/ ctx[0][/*currentSlide*/ ctx[1]]
				? "active"
				: "") + " svelte-qsd49x"))) {
					attr_dev(li, "class", li_class_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(li);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$2.name,
			type: "each",
			source: "(24:8) {#each items as item, index}",
			ctx
		});

		return block;
	}

	// (42:33) 
	function create_if_block_4(ctx) {
		let current;
		const slide_3_slot_template = /*#slots*/ ctx[6]["slide-3"];
		const slide_3_slot = create_slot(slide_3_slot_template, ctx, /*$$scope*/ ctx[5], get_slide_3_slot_context);

		const block = {
			c: function create() {
				if (slide_3_slot) slide_3_slot.c();
			},
			m: function mount(target, anchor) {
				if (slide_3_slot) {
					slide_3_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (slide_3_slot) {
					if (slide_3_slot.p && (!current || dirty & /*$$scope*/ 32)) {
						update_slot_base(
							slide_3_slot,
							slide_3_slot_template,
							ctx,
							/*$$scope*/ ctx[5],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
							: get_slot_changes(slide_3_slot_template, /*$$scope*/ ctx[5], dirty, get_slide_3_slot_changes),
							get_slide_3_slot_context
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(slide_3_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(slide_3_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (slide_3_slot) slide_3_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_4.name,
			type: "if",
			source: "(42:33) ",
			ctx
		});

		return block;
	}

	// (40:33) 
	function create_if_block_3(ctx) {
		let current;
		const slide_2_slot_template = /*#slots*/ ctx[6]["slide-2"];
		const slide_2_slot = create_slot(slide_2_slot_template, ctx, /*$$scope*/ ctx[5], get_slide_2_slot_context);

		const block = {
			c: function create() {
				if (slide_2_slot) slide_2_slot.c();
			},
			m: function mount(target, anchor) {
				if (slide_2_slot) {
					slide_2_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (slide_2_slot) {
					if (slide_2_slot.p && (!current || dirty & /*$$scope*/ 32)) {
						update_slot_base(
							slide_2_slot,
							slide_2_slot_template,
							ctx,
							/*$$scope*/ ctx[5],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
							: get_slot_changes(slide_2_slot_template, /*$$scope*/ ctx[5], dirty, get_slide_2_slot_changes),
							get_slide_2_slot_context
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(slide_2_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(slide_2_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (slide_2_slot) slide_2_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_3.name,
			type: "if",
			source: "(40:33) ",
			ctx
		});

		return block;
	}

	// (38:33) 
	function create_if_block_2$1(ctx) {
		let current;
		const slide_1_slot_template = /*#slots*/ ctx[6]["slide-1"];
		const slide_1_slot = create_slot(slide_1_slot_template, ctx, /*$$scope*/ ctx[5], get_slide_1_slot_context);

		const block = {
			c: function create() {
				if (slide_1_slot) slide_1_slot.c();
			},
			m: function mount(target, anchor) {
				if (slide_1_slot) {
					slide_1_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (slide_1_slot) {
					if (slide_1_slot.p && (!current || dirty & /*$$scope*/ 32)) {
						update_slot_base(
							slide_1_slot,
							slide_1_slot_template,
							ctx,
							/*$$scope*/ ctx[5],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
							: get_slot_changes(slide_1_slot_template, /*$$scope*/ ctx[5], dirty, get_slide_1_slot_changes),
							get_slide_1_slot_context
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(slide_1_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(slide_1_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (slide_1_slot) slide_1_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2$1.name,
			type: "if",
			source: "(38:33) ",
			ctx
		});

		return block;
	}

	// (36:4) {#if currentSlide === 0}
	function create_if_block_1$1(ctx) {
		let current;
		const slide_0_slot_template = /*#slots*/ ctx[6]["slide-0"];
		const slide_0_slot = create_slot(slide_0_slot_template, ctx, /*$$scope*/ ctx[5], get_slide_0_slot_context);

		const block = {
			c: function create() {
				if (slide_0_slot) slide_0_slot.c();
			},
			m: function mount(target, anchor) {
				if (slide_0_slot) {
					slide_0_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (slide_0_slot) {
					if (slide_0_slot.p && (!current || dirty & /*$$scope*/ 32)) {
						update_slot_base(
							slide_0_slot,
							slide_0_slot_template,
							ctx,
							/*$$scope*/ ctx[5],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
							: get_slot_changes(slide_0_slot_template, /*$$scope*/ ctx[5], dirty, get_slide_0_slot_changes),
							get_slide_0_slot_context
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(slide_0_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(slide_0_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (slide_0_slot) slide_0_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1$1.name,
			type: "if",
			source: "(36:4) {#if currentSlide === 0}",
			ctx
		});

		return block;
	}

	// (47:4) {#if currentSlide === items.length - 1}
	function create_if_block$3(ctx) {
		let div;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				button = element("button");
				button.textContent = "Submit";
				attr_dev(button, "class", "svelte-qsd49x");
				add_location(button, file$4, 48, 8, 1413);
				attr_dev(div, "class", "submit-container svelte-qsd49x");
				add_location(div, file$4, 47, 6, 1373);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, button);

				if (!mounted) {
					dispose = listen_dev(button, "click", handleSubmit, false, false, false, false);
					mounted = true;
				}
			},
			p: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$3.name,
			type: "if",
			source: "(47:4) {#if currentSlide === items.length - 1}",
			ctx
		});

		return block;
	}

	function create_fragment$4(ctx) {
		let div2;
		let button0;
		let t1;
		let div1;
		let div0;
		let ul;
		let t2;
		let current_block_type_index;
		let if_block0;
		let t3;
		let t4;
		let button1;
		let current;
		let mounted;
		let dispose;
		let each_value = ensure_array_like_dev(/*items*/ ctx[0]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		const if_block_creators = [create_if_block_1$1, create_if_block_2$1, create_if_block_3, create_if_block_4];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*currentSlide*/ ctx[1] === 0) return 0;
			if (/*currentSlide*/ ctx[1] === 1) return 1;
			if (/*currentSlide*/ ctx[1] === 2) return 2;
			if (/*currentSlide*/ ctx[1] === 3) return 3;
			return -1;
		}

		if (~(current_block_type_index = select_block_type(ctx))) {
			if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		}

		let if_block1 = /*currentSlide*/ ctx[1] === /*items*/ ctx[0].length - 1 && create_if_block$3(ctx);

		const block = {
			c: function create() {
				div2 = element("div");
				button0 = element("button");
				button0.textContent = "❮";
				t1 = space();
				div1 = element("div");
				div0 = element("div");
				ul = element("ul");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t2 = space();
				if (if_block0) if_block0.c();
				t3 = space();
				if (if_block1) if_block1.c();
				t4 = space();
				button1 = element("button");
				button1.textContent = "❯";
				attr_dev(button0, "class", "arrow prev-arrow svelte-qsd49x");
				add_location(button0, file$4, 17, 2, 444);
				attr_dev(ul, "class", "svelte-qsd49x");
				add_location(ul, file$4, 22, 6, 602);
				attr_dev(div0, "class", "tabs-header svelte-qsd49x");
				add_location(div0, file$4, 21, 4, 569);
				attr_dev(div1, "class", "slide svelte-qsd49x");
				add_location(div1, file$4, 19, 2, 514);
				attr_dev(button1, "class", "arrow next-arrow svelte-qsd49x");
				add_location(button1, file$4, 53, 2, 1501);
				attr_dev(div2, "class", "carousel svelte-qsd49x");
				add_location(div2, file$4, 16, 0, 418);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, button0);
				append_dev(div2, t1);
				append_dev(div2, div1);
				append_dev(div1, div0);
				append_dev(div0, ul);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(ul, null);
					}
				}

				append_dev(div1, t2);

				if (~current_block_type_index) {
					if_blocks[current_block_type_index].m(div1, null);
				}

				append_dev(div1, t3);
				if (if_block1) if_block1.m(div1, null);
				append_dev(div2, t4);
				append_dev(div2, button1);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*prevSlide*/ ctx[3], false, false, false, false),
						listen_dev(button1, "click", /*nextSlide*/ ctx[2], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*items, currentSlide*/ 3) {
					each_value = ensure_array_like_dev(/*items*/ ctx[0]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}

				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if (~current_block_type_index) {
						if_blocks[current_block_type_index].p(ctx, dirty);
					}
				} else {
					if (if_block0) {
						group_outros();

						transition_out(if_blocks[previous_block_index], 1, 1, () => {
							if_blocks[previous_block_index] = null;
						});

						check_outros();
					}

					if (~current_block_type_index) {
						if_block0 = if_blocks[current_block_type_index];

						if (!if_block0) {
							if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
							if_block0.c();
						} else {
							if_block0.p(ctx, dirty);
						}

						transition_in(if_block0, 1);
						if_block0.m(div1, t3);
					} else {
						if_block0 = null;
					}
				}

				if (/*currentSlide*/ ctx[1] === /*items*/ ctx[0].length - 1) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block$3(ctx);
						if_block1.c();
						if_block1.m(div1, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block0);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block0);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}

				destroy_each(each_blocks, detaching);

				if (~current_block_type_index) {
					if_blocks[current_block_type_index].d();
				}

				if (if_block1) if_block1.d();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$4.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Carousel', slots, ['slide-0','slide-1','slide-2','slide-3']);
		let currentSlide = 0;
		let { items = [] } = $$props;
		let { itemLists = [] } = $$props;

		// Show the next slide
		function nextSlide() {
			$$invalidate(1, currentSlide = (currentSlide + 1) % items.length);
		}

		// Show the previous slide
		function prevSlide() {
			$$invalidate(1, currentSlide = (currentSlide - 1 + items.length) % items.length);
		}

		const writable_props = ['items', 'itemLists'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
		});

		const click_handler = index => $$invalidate(1, currentSlide = index);

		$$self.$$set = $$props => {
			if ('items' in $$props) $$invalidate(0, items = $$props.items);
			if ('itemLists' in $$props) $$invalidate(4, itemLists = $$props.itemLists);
			if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({
			currentSlide,
			items,
			itemLists,
			nextSlide,
			prevSlide
		});

		$$self.$inject_state = $$props => {
			if ('currentSlide' in $$props) $$invalidate(1, currentSlide = $$props.currentSlide);
			if ('items' in $$props) $$invalidate(0, items = $$props.items);
			if ('itemLists' in $$props) $$invalidate(4, itemLists = $$props.itemLists);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			items,
			currentSlide,
			nextSlide,
			prevSlide,
			itemLists,
			$$scope,
			slots,
			click_handler
		];
	}

	class Carousel extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { items: 0, itemLists: 4 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Carousel",
				options,
				id: create_fragment$4.name
			});
		}

		get items() {
			throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set items(value) {
			throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get itemLists() {
			throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set itemLists(value) {
			throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\sharedComps\Tabs.svelte generated by Svelte v4.2.19 */
	const file$3 = "src\\sharedComps\\Tabs.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[7] = list[i];
		return child_ctx;
	}

	// (18:4) {#each items as item}
	function create_each_block$1(ctx) {
		let li;
		let div;
		let t0_value = /*item*/ ctx[7] + "";
		let t0;
		let t1;
		let mounted;
		let dispose;

		function click_handler() {
			return /*click_handler*/ ctx[6](/*item*/ ctx[7]);
		}

		const block = {
			c: function create() {
				li = element("li");
				div = element("div");
				t0 = text(t0_value);
				t1 = space();
				attr_dev(div, "class", "svelte-1nycdwd");
				toggle_class(div, "active", /*item*/ ctx[7] === /*activeItem*/ ctx[0]);
				add_location(div, file$3, 23, 8, 493);
				attr_dev(li, "class", "svelte-1nycdwd");
				add_location(li, file$3, 18, 6, 392);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);
				append_dev(li, div);
				append_dev(div, t0);
				append_dev(li, t1);

				if (!mounted) {
					dispose = listen_dev(li, "click", click_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty & /*items*/ 2 && t0_value !== (t0_value = /*item*/ ctx[7] + "")) set_data_dev(t0, t0_value);

				if (dirty & /*items, activeItem*/ 3) {
					toggle_class(div, "active", /*item*/ ctx[7] === /*activeItem*/ ctx[0]);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(li);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$1.name,
			type: "each",
			source: "(18:4) {#each items as item}",
			ctx
		});

		return block;
	}

	// (35:0) {#if activeItem === items[items.length - 1]}
	function create_if_block$2(ctx) {
		let div;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				button = element("button");
				button.textContent = "Submit";
				attr_dev(button, "class", "svelte-1nycdwd");
				add_location(button, file$3, 36, 4, 811);
				attr_dev(div, "class", "submit-container svelte-1nycdwd");
				add_location(div, file$3, 35, 2, 775);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, button);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*handleSubmit*/ ctx[3], false, false, false, false);
					mounted = true;
				}
			},
			p: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$2.name,
			type: "if",
			source: "(35:0) {#if activeItem === items[items.length - 1]}",
			ctx
		});

		return block;
	}

	function create_fragment$3(ctx) {
		let div0;
		let ul;
		let t0;
		let div1;
		let t1;
		let if_block_anchor;
		let current;
		let each_value = ensure_array_like_dev(/*items*/ ctx[1]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		const default_slot_template = /*#slots*/ ctx[5].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
		let if_block = /*activeItem*/ ctx[0] === /*items*/ ctx[1][/*items*/ ctx[1].length - 1] && create_if_block$2(ctx);

		const block = {
			c: function create() {
				div0 = element("div");
				ul = element("ul");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t0 = space();
				div1 = element("div");
				if (default_slot) default_slot.c();
				t1 = space();
				if (if_block) if_block.c();
				if_block_anchor = empty();
				attr_dev(ul, "class", "svelte-1nycdwd");
				add_location(ul, file$3, 16, 2, 353);
				attr_dev(div0, "class", "tabs-header svelte-1nycdwd");
				add_location(div0, file$3, 15, 0, 324);
				attr_dev(div1, "class", "item-list");
				add_location(div1, file$3, 29, 0, 592);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div0, anchor);
				append_dev(div0, ul);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(ul, null);
					}
				}

				insert_dev(target, t0, anchor);
				insert_dev(target, div1, anchor);

				if (default_slot) {
					default_slot.m(div1, null);
				}

				insert_dev(target, t1, anchor);
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*dispatch, items, activeItem*/ 7) {
					each_value = ensure_array_like_dev(/*items*/ ctx[1]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}

				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[4],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
							null
						);
					}
				}

				if (/*activeItem*/ ctx[0] === /*items*/ ctx[1][/*items*/ ctx[1].length - 1]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$2(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div0);
					detach_dev(t0);
					detach_dev(div1);
					detach_dev(t1);
					detach_dev(if_block_anchor);
				}

				destroy_each(each_blocks, detaching);
				if (default_slot) default_slot.d(detaching);
				if (if_block) if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Tabs', slots, ['default']);
		let { activeItem } = $$props;
		let { items } = $$props;
		const dispatch = createEventDispatcher();

		// Function to handle the submit action
		function handleSubmit() {
			dispatch("submit"); // Dispatch a submit event
		}

		$$self.$$.on_mount.push(function () {
			if (activeItem === undefined && !('activeItem' in $$props || $$self.$$.bound[$$self.$$.props['activeItem']])) {
				console.warn("<Tabs> was created without expected prop 'activeItem'");
			}

			if (items === undefined && !('items' in $$props || $$self.$$.bound[$$self.$$.props['items']])) {
				console.warn("<Tabs> was created without expected prop 'items'");
			}
		});

		const writable_props = ['activeItem', 'items'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
		});

		const click_handler = item => {
			dispatch("changeTab", item);
		};

		$$self.$$set = $$props => {
			if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
			if ('items' in $$props) $$invalidate(1, items = $$props.items);
			if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			activeItem,
			items,
			dispatch,
			handleSubmit
		});

		$$self.$inject_state = $$props => {
			if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
			if ('items' in $$props) $$invalidate(1, items = $$props.items);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [activeItem, items, dispatch, handleSubmit, $$scope, slots, click_handler];
	}

	class Tabs extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { activeItem: 0, items: 1 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Tabs",
				options,
				id: create_fragment$3.name
			});
		}

		get activeItem() {
			throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set activeItem(value) {
			throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get items() {
			throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set items(value) {
			throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	const subscriber_queue = [];

	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#writable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Writable<T>}
	 */
	function writable(value, start = noop) {
		/** @type {import('./public.js').Unsubscriber} */
		let stop;
		/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
		const subscribers = new Set();
		/** @param {T} new_value
		 * @returns {void}
		 */
		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (stop) {
					// store is ready
					const run_queue = !subscriber_queue.length;
					for (const subscriber of subscribers) {
						subscriber[1]();
						subscriber_queue.push(subscriber, value);
					}
					if (run_queue) {
						for (let i = 0; i < subscriber_queue.length; i += 2) {
							subscriber_queue[i][0](subscriber_queue[i + 1]);
						}
						subscriber_queue.length = 0;
					}
				}
			}
		}

		/**
		 * @param {import('./public.js').Updater<T>} fn
		 * @returns {void}
		 */
		function update(fn) {
			set(fn(value));
		}

		/**
		 * @param {import('./public.js').Subscriber<T>} run
		 * @param {import('./private.js').Invalidator<T>} [invalidate]
		 * @returns {import('./public.js').Unsubscriber}
		 */
		function subscribe(run, invalidate = noop) {
			/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
			const subscriber = [run, invalidate];
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set, update) || noop;
			}
			run(value);
			return () => {
				subscribers.delete(subscriber);
				if (subscribers.size === 0 && stop) {
					stop();
					stop = null;
				}
			};
		}
		return { set, update, subscribe };
	}

	// stores.js

	// Create a writable store for the checkbox count
	const count = writable(0);

	// Create a writable store to track checked states
	const checkedStates = writable({});

	/* src\components\ItemList.svelte generated by Svelte v4.2.19 */

	const { Object: Object_1 } = globals;

	const file$2 = "src\\components\\ItemList.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[5] = list[i];
		return child_ctx;
	}

	// (49:2) {#each options as opt (opt.id)}
	function create_each_block(key_1, ctx) {
		let div;
		let input;
		let input_id_value;
		let input_checked_value;
		let t0;
		let label;
		let t1_value = /*opt*/ ctx[5].text + "";
		let t1;
		let label_for_value;
		let t2;
		let mounted;
		let dispose;

		function change_handler(...args) {
			return /*change_handler*/ ctx[3](/*opt*/ ctx[5], ...args);
		}

		const block = {
			key: key_1,
			first: null,
			c: function create() {
				div = element("div");
				input = element("input");
				t0 = space();
				label = element("label");
				t1 = text(t1_value);
				t2 = space();
				attr_dev(input, "type", "checkbox");
				attr_dev(input, "id", input_id_value = `item` + /*opt*/ ctx[5].id);
				input.checked = input_checked_value = /*localCheckedStates*/ ctx[1][/*opt*/ ctx[5].id] || false;
				attr_dev(input, "class", "svelte-1jijr7y");
				add_location(input, file$2, 50, 6, 1534);
				attr_dev(label, "for", label_for_value = `item` + /*opt*/ ctx[5].id);
				attr_dev(label, "class", "svelte-1jijr7y");
				add_location(label, file$2, 56, 6, 1725);
				attr_dev(div, "class", "checkbox-item svelte-1jijr7y");
				add_location(div, file$2, 49, 4, 1499);
				this.first = div;
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, input);
				append_dev(div, t0);
				append_dev(div, label);
				append_dev(label, t1);
				append_dev(div, t2);

				if (!mounted) {
					dispose = listen_dev(input, "change", change_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty & /*options*/ 1 && input_id_value !== (input_id_value = `item` + /*opt*/ ctx[5].id)) {
					attr_dev(input, "id", input_id_value);
				}

				if (dirty & /*localCheckedStates, options*/ 3 && input_checked_value !== (input_checked_value = /*localCheckedStates*/ ctx[1][/*opt*/ ctx[5].id] || false)) {
					prop_dev(input, "checked", input_checked_value);
				}

				if (dirty & /*options*/ 1 && t1_value !== (t1_value = /*opt*/ ctx[5].text + "")) set_data_dev(t1, t1_value);

				if (dirty & /*options*/ 1 && label_for_value !== (label_for_value = `item` + /*opt*/ ctx[5].id)) {
					attr_dev(label, "for", label_for_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(49:2) {#each options as opt (opt.id)}",
			ctx
		});

		return block;
	}

	function create_fragment$2(ctx) {
		let div;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let each_value = ensure_array_like_dev(/*options*/ ctx[0]);
		const get_key = ctx => /*opt*/ ctx[5].id;
		validate_each_keys(ctx, each_value, get_each_context, get_key);

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		const block = {
			c: function create() {
				div = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(div, "class", "table-body svelte-1jijr7y");
				add_location(div, file$2, 47, 0, 1434);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div, null);
					}
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*options, localCheckedStates, updateCheckedState*/ 7) {
					each_value = ensure_array_like_dev(/*options*/ ctx[0]);
					validate_each_keys(ctx, each_value, get_each_context, get_key);
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ItemList', slots, []);
		let { options = [] } = $$props;

		// Local variable to track current checkbox states
		let localCheckedStates = {};

		// Subscribe to the global checkedStates store to keep track of checked items
		let unsubscribe;

		onMount(() => {
			unsubscribe = checkedStates.subscribe(value => {
				$$invalidate(1, localCheckedStates = value); // Update local state based on the store
			});
		});

		onDestroy(() => {
			unsubscribe();
		});

		// Function to update the global count and local checked states
		function updateCheckedState(opt, event) {
			const isChecked = event.target.checked;
			$$invalidate(1, localCheckedStates[opt.id] = isChecked, localCheckedStates); // Update local state

			// Update the checked states in the store
			checkedStates.update(currentStates => {
				const newState = { ...currentStates, [opt.id]: isChecked };

				// Calculate the new count of checked boxes
				const newCount = Object.values(newState).filter(Boolean).length;

				// Update the global count store
				count.set(newCount);

				return newState;
			});
		}

		const writable_props = ['options'];

		Object_1.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemList> was created with unknown prop '${key}'`);
		});

		const change_handler = (opt, e) => updateCheckedState(opt, e);

		$$self.$$set = $$props => {
			if ('options' in $$props) $$invalidate(0, options = $$props.options);
		};

		$$self.$capture_state = () => ({
			count,
			checkedStates,
			onMount,
			options,
			localCheckedStates,
			unsubscribe,
			onDestroy,
			updateCheckedState
		});

		$$self.$inject_state = $$props => {
			if ('options' in $$props) $$invalidate(0, options = $$props.options);
			if ('localCheckedStates' in $$props) $$invalidate(1, localCheckedStates = $$props.localCheckedStates);
			if ('unsubscribe' in $$props) unsubscribe = $$props.unsubscribe;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [options, localCheckedStates, updateCheckedState, change_handler];
	}

	class ItemList extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { options: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ItemList",
				options,
				id: create_fragment$2.name
			});
		}

		get options() {
			throw new Error("<ItemList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set options(value) {
			throw new Error("<ItemList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\Results.svelte generated by Svelte v4.2.19 */

	const file$1 = "src\\components\\Results.svelte";

	// (71:53) 
	function create_if_block_2(ctx) {
		let h2;
		let t1;
		let p;
		let t3;
		let img;
		let img_src_value;

		const block = {
			c: function create() {
				h2 = element("h2");
				h2.textContent = `${/*resultText*/ ctx[1][2].title}`;
				t1 = space();
				p = element("p");
				p.textContent = `${/*resultText*/ ctx[1][2].description}`;
				t3 = space();
				img = element("img");
				attr_dev(h2, "class", "svelte-i0zbor");
				add_location(h2, file$1, 71, 4, 3939);
				attr_dev(p, "class", "svelte-i0zbor");
				add_location(p, file$1, 72, 4, 3975);
				if (!src_url_equal(img.src, img_src_value = /*resultText*/ ctx[1][2].media.image)) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "68% + score result");
				add_location(img, file$1, 73, 4, 4015);
			},
			m: function mount(target, anchor) {
				insert_dev(target, h2, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, p, anchor);
				insert_dev(target, t3, anchor);
				insert_dev(target, img, anchor);
			},
			p: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(h2);
					detach_dev(t1);
					detach_dev(p);
					detach_dev(t3);
					detach_dev(img);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2.name,
			type: "if",
			source: "(71:53) ",
			ctx
		});

		return block;
	}

	// (67:53) 
	function create_if_block_1(ctx) {
		let h2;
		let t1;
		let p;
		let t3;
		let img;
		let img_src_value;

		const block = {
			c: function create() {
				h2 = element("h2");
				h2.textContent = `${/*resultText*/ ctx[1][1].title}`;
				t1 = space();
				p = element("p");
				p.textContent = `${/*resultText*/ ctx[1][1].description}`;
				t3 = space();
				img = element("img");
				attr_dev(h2, "class", "svelte-i0zbor");
				add_location(h2, file$1, 67, 4, 3738);
				attr_dev(p, "class", "svelte-i0zbor");
				add_location(p, file$1, 68, 4, 3774);
				if (!src_url_equal(img.src, img_src_value = /*resultText*/ ctx[1][1].media.image)) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "34%+% score result");
				add_location(img, file$1, 69, 4, 3814);
			},
			m: function mount(target, anchor) {
				insert_dev(target, h2, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, p, anchor);
				insert_dev(target, t3, anchor);
				insert_dev(target, img, anchor);
			},
			p: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(h2);
					detach_dev(t1);
					detach_dev(p);
					detach_dev(t3);
					detach_dev(img);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1.name,
			type: "if",
			source: "(67:53) ",
			ctx
		});

		return block;
	}

	// (62:2) {#if currentCount >= 0 && currentCount <= 9}
	function create_if_block$1(ctx) {
		let h2;
		let t1;
		let p;
		let t3;
		let img;
		let img_src_value;

		const block = {
			c: function create() {
				h2 = element("h2");
				h2.textContent = `${/*resultText*/ ctx[1][0].title}`;
				t1 = space();
				p = element("p");
				p.textContent = `${/*resultText*/ ctx[1][0].description}`;
				t3 = space();
				img = element("img");
				attr_dev(h2, "class", "svelte-i0zbor");
				add_location(h2, file$1, 62, 4, 3495);
				attr_dev(p, "class", "svelte-i0zbor");
				add_location(p, file$1, 63, 4, 3531);
				if (!src_url_equal(img.src, img_src_value = /*resultText*/ ctx[1][0].media.image)) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "33% score result");
				add_location(img, file$1, 65, 4, 3615);
			},
			m: function mount(target, anchor) {
				insert_dev(target, h2, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, p, anchor);
				insert_dev(target, t3, anchor);
				insert_dev(target, img, anchor);
			},
			p: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(h2);
					detach_dev(t1);
					detach_dev(p);
					detach_dev(t3);
					detach_dev(img);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$1.name,
			type: "if",
			source: "(62:2) {#if currentCount >= 0 && currentCount <= 9}",
			ctx
		});

		return block;
	}

	function create_fragment$1(ctx) {
		let p;
		let t0;
		let t1;
		let t2;
		let div;

		function select_block_type(ctx, dirty) {
			if (/*currentCount*/ ctx[0] >= 0 && /*currentCount*/ ctx[0] <= 9) return create_if_block$1;
			if (/*currentCount*/ ctx[0] >= 10 && /*currentCount*/ ctx[0] <= 19) return create_if_block_1;
			if (/*currentCount*/ ctx[0] >= 20 && /*currentCount*/ ctx[0] <= 28) return create_if_block_2;
		}

		let current_block_type = select_block_type(ctx);
		let if_block = current_block_type && current_block_type(ctx);

		const block = {
			c: function create() {
				p = element("p");
				t0 = text("Total checked boxes: ");
				t1 = text(/*currentCount*/ ctx[0]);
				t2 = space();
				div = element("div");
				if (if_block) if_block.c();
				set_style(p, "color", "azure");
				attr_dev(p, "class", "svelte-i0zbor");
				add_location(p, file$1, 58, 0, 3368);
				add_location(div, file$1, 60, 0, 3436);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, p, anchor);
				append_dev(p, t0);
				append_dev(p, t1);
				insert_dev(target, t2, anchor);
				insert_dev(target, div, anchor);
				if (if_block) if_block.m(div, null);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*currentCount*/ 1) set_data_dev(t1, /*currentCount*/ ctx[0]);

				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(ctx, dirty);
				} else {
					if (if_block) if_block.d(1);
					if_block = current_block_type && current_block_type(ctx);

					if (if_block) {
						if_block.c();
						if_block.m(div, null);
					}
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(p);
					detach_dev(t2);
					detach_dev(div);
				}

				if (if_block) {
					if_block.d();
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Results', slots, []);
		let currentCount;

		// Subscribe to the count store to get updates
		const unsubscribe = count.subscribe(value => {
			$$invalidate(0, currentCount = value); // Update the local variable with the store value
		});

		onDestroy(() => {
			unsubscribe();
		});

		let resultText = [
			{
				id: "1",
				title: "You do not seem to be impacted by social proof to a significant extent",
				score_min: 0,
				score_max: 33,
				description: 'You do not really pay attention to the number of comments, likes and reviews on online platforms. Or maybe you do, but they are not the factors that control your actions online. You would rather watch something without hearing how other people react to it, and you would rather not follow the crowd just because "everyone else is doing it."',
				media: {
					image: "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/23/17/enhanced/6bcbd806692c/enhanced-392-1587661661-2.jpg"
				}
			},
			{
				id: "2",
				title: "You navigate your actions with a good balance between being driven by social proof and not being affected by it",
				score_min: 34,
				score_max: 67,
				description: "Of course you use social media and look at how people react to the content, buy products online and read their reviews. But, you are able to not get influenced too much by the way others use online platform, and can often decide what to do based on what you believe is best. Aside from the online space, you visit popular places, do activities recommended by many, and follow trends, but not just merely because the majority of people suggest doing so, also if you personally think they are worthy.",
				media: {
					image: "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/23/17/enhanced/bc71f6de0007/enhanced-360-1587661566-3.jpg"
				}
			},
			{
				id: "3",
				title: "Social proof is the reason why you do most of your actions",
				score_min: 68,
				score_max: 100,
				description: "Posts, images, videos and products seem less interesting and less valid to you if the number of likes, or similar positive reinforcement, is low. You consider the numbers on different online platform to be the main indication of the quality of the content posted there. You are more likely to engage in activities if you see that many other people, especially if they are your friends or similar to you, are also doing them. Additionally, you would feel lost watching a sitcom without the laugh track, and appreciate shows with a live audience, so that the jokes sound funnier and you get a sense of when it is the right time to laugh. In real life, you think lines outside of stores are a clear symbol of good quality and you always try the new trend if many people around you are recommending it.",
				media: {
					image: "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/30/20/enhanced/98bcd8c28f1d/enhanced-831-1588279128-25.jpg"
				}
			}
		];

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Results> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({
			count,
			currentCount,
			unsubscribe,
			onDestroy,
			resultText
		});

		$$self.$inject_state = $$props => {
			if ('currentCount' in $$props) $$invalidate(0, currentCount = $$props.currentCount);
			if ('resultText' in $$props) $$invalidate(1, resultText = $$props.resultText);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [currentCount, resultText];
	}

	class Results extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Results",
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src\App.svelte generated by Svelte v4.2.19 */
	const file = "src\\App.svelte";

	// (155:4) 
	function create_slide_0_slot(ctx) {
		let div;
		let itemlist;
		let current;

		itemlist = new ItemList({
				props: { options: /*cat1*/ ctx[2] },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				create_component(itemlist.$$.fragment);
				attr_dev(div, "slot", "slide-0");
				add_location(div, file, 154, 4, 4591);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(itemlist, div, null);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(itemlist.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(itemlist.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(itemlist);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_slide_0_slot.name,
			type: "slot",
			source: "(155:4) ",
			ctx
		});

		return block;
	}

	// (158:4) 
	function create_slide_1_slot(ctx) {
		let div;
		let itemlist;
		let current;

		itemlist = new ItemList({
				props: { options: /*cat2*/ ctx[3] },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				create_component(itemlist.$$.fragment);
				attr_dev(div, "slot", "slide-1");
				add_location(div, file, 157, 4, 4661);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(itemlist, div, null);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(itemlist.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(itemlist.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(itemlist);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_slide_1_slot.name,
			type: "slot",
			source: "(158:4) ",
			ctx
		});

		return block;
	}

	// (161:4) 
	function create_slide_2_slot(ctx) {
		let div;
		let itemlist;
		let current;

		itemlist = new ItemList({
				props: { options: /*cat3*/ ctx[4] },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				create_component(itemlist.$$.fragment);
				attr_dev(div, "slot", "slide-2");
				add_location(div, file, 160, 4, 4731);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(itemlist, div, null);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(itemlist.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(itemlist.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(itemlist);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_slide_2_slot.name,
			type: "slot",
			source: "(161:4) ",
			ctx
		});

		return block;
	}

	// (164:4) 
	function create_slide_3_slot(ctx) {
		let div;
		let itemlist;
		let current;

		itemlist = new ItemList({
				props: { options: /*cat4*/ ctx[5] },
				$$inline: true
			});

		const block = {
			c: function create() {
				div = element("div");
				create_component(itemlist.$$.fragment);
				attr_dev(div, "slot", "slide-3");
				add_location(div, file, 163, 4, 4801);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(itemlist, div, null);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(itemlist.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(itemlist.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(itemlist);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_slide_3_slot.name,
			type: "slot",
			source: "(164:4) ",
			ctx
		});

		return block;
	}

	// (170:0) {#if showResults}
	function create_if_block(ctx) {
		let results;
		let current;
		results = new Results({ $$inline: true });

		const block = {
			c: function create() {
				create_component(results.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(results, target, anchor);
				current = true;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(results.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(results.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(results, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(170:0) {#if showResults}",
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let interactivetitle;
		let t0;
		let main;
		let h4;
		let t2;
		let carousel;
		let t3;
		let if_block_anchor;
		let current;
		interactivetitle = new InteractiveTitle({ $$inline: true });

		carousel = new Carousel({
				props: {
					items: /*items*/ ctx[1],
					$$slots: {
						"slide-3": [create_slide_3_slot],
						"slide-2": [create_slide_2_slot],
						"slide-1": [create_slide_1_slot],
						"slide-0": [create_slide_0_slot]
					},
					$$scope: { ctx }
				},
				$$inline: true
			});

		carousel.$on("submit", /*submit_handler*/ ctx[6]);
		let if_block = /*showResults*/ ctx[0] && create_if_block(ctx);

		const block = {
			c: function create() {
				create_component(interactivetitle.$$.fragment);
				t0 = space();
				main = element("main");
				h4 = element("h4");
				h4.textContent = "There are countless examples of situations that take advantage of social\n    proof. From the situations below, select boxes of ones you relate with or\n    have experienced to discover the impact this phenomenon has on you.";
				t2 = space();
				create_component(carousel.$$.fragment);
				t3 = space();
				if (if_block) if_block.c();
				if_block_anchor = empty();
				set_style(h4, "color", "whitesmoke");
				attr_dev(h4, "class", "svelte-nya7uv");
				add_location(h4, file, 147, 2, 4249);
				attr_dev(main, "class", "svelte-nya7uv");
				add_location(main, file, 145, 0, 4239);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(interactivetitle, target, anchor);
				insert_dev(target, t0, anchor);
				insert_dev(target, main, anchor);
				append_dev(main, h4);
				append_dev(main, t2);
				mount_component(carousel, main, null);
				insert_dev(target, t3, anchor);
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const carousel_changes = {};

				if (dirty & /*$$scope*/ 8192) {
					carousel_changes.$$scope = { dirty, ctx };
				}

				carousel.$set(carousel_changes);

				if (/*showResults*/ ctx[0]) {
					if (if_block) {
						if (dirty & /*showResults*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(interactivetitle.$$.fragment, local);
				transition_in(carousel.$$.fragment, local);
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(interactivetitle.$$.fragment, local);
				transition_out(carousel.$$.fragment, local);
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t0);
					detach_dev(main);
					detach_dev(t3);
					detach_dev(if_block_anchor);
				}

				destroy_component(interactivetitle, detaching);
				destroy_component(carousel);
				if (if_block) if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('App', slots, []);

		let items = [
			"1. Popularity and Trends",
			"2. Reviews, Ratings and Sales",
			"3. Herd Mentality",
			"4. Social Cues and Situational Norms"
		];

		let slides = [
			{
				id: 1,
				content: "1. Popularity and Trends"
			},
			{
				id: 2,
				content: "2. Reviews, Ratings and Sales"
			},
			{ id: 3, content: "3. Herd Mentality" },
			{
				id: 4,
				content: "4. Social Cues and Situational Norms"
			}
		];

		let activeItem = items[0];

		const changeTab = e => {
			activeItem = e.detail;
		};

		//TODO: shift to file or alternative
		//data
		let cat1 = [
			{
				text: "Followed a trend just because a lot of people were doing it",
				id: "11"
			},
			{
				text: "Watched a movie/tv show everyone had been talking about",
				id: "12"
			},
			{
				text: "Recreated a recipe have seen a lot of people try",
				id: "13"
			},
			{
				text: "Visited a not-so-exciting but trendy place",
				id: "14"
			},
			{
				text: "Watched a video just because it was trending",
				id: "15"
			},
			{
				text: 'Bought an item because it was a "best-seller" or "fastest growing"',
				id: "16"
			},
			{
				text: 'Watched a movie/tv show that appeared in the "most popular" list',
				id: "17"
			},
			{
				text: 'Bought an item from the "recommended to me" section',
				id: "18"
			}
		];

		let cat2 = [
			{
				text: "Filtered out items with ratings of three stars or less",
				id: "21"
			},
			{
				text: "Chose to buy something online based on the number and quality of its reviews",
				id: "22"
			},
			{
				text: "Considered a restaurant/store good because it always had a line outside the door",
				id: "23"
			},
			{
				text: "Liked a post just because it already had a lot of likes",
				id: "24"
			},
			{
				text: "Bought something because it had many likes",
				id: "25"
			},
			{
				text: "Thought something was worth buying because it was almost sold out",
				id: "26"
			},
			{
				text: "Bought an item in the stores many people were recommending",
				id: "27"
			},
			{
				text: "Signed up for a service based on the number of people already using it",
				id: "28"
			}
		];

		let cat3 = [
			{
				text: "Thanked a bus driver after hearing most of the other passengers doing the same",
				id: "31"
			},
			{
				text: "Stayed quiet about a concerning situation in a public place because no one else was saying anything",
				id: "32"
			},
			{
				text: "Joined a line even though did not know what it was for",
				id: "33"
			},
			{
				text: "Clapped at a live show following the rest of the audience's example",
				id: "34"
			},
			{
				text: "Did not comment an interesting post because no one else had commented it",
				id: "35"
			},
			{
				text: "Adhered to an opinion because it was shared by a lot of people",
				id: "36"
			}
		];

		let cat4 = [
			{
				text: "Thought a waiter was deserving but did not put money in an empty tip jar",
				id: "41"
			},
			{
				text: "Ate something at a buffet because it was almost gone",
				id: "42"
			},
			{
				text: "Got convinced by the sign to reuse the towel in a hotel",
				id: "43"
			},
			{
				text: "Donated to a charity after getting told a lot of people were donating",
				id: "44"
			},
			{
				text: "Found a show funnier thanks to canned laughter",
				id: "45"
			},
			{
				text: "Ate at a restaurant many people were recommending",
				id: "46"
			}
		];

		let open = false;
		const toggle = () => open = !open;
		let showResults = false; // State to track if results should be shown

		// Function to handle submit event
		function handleSubmit() {
			$$invalidate(0, showResults = true); // Set to true when submit is clicked
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
		});

		const submit_handler = () => alert("Submit button clicked");

		$$self.$capture_state = () => ({
			InteractiveTitle,
			Carousel,
			Tabs,
			ItemList,
			Results,
			items,
			slides,
			activeItem,
			changeTab,
			cat1,
			cat2,
			cat3,
			cat4,
			open,
			toggle,
			showResults,
			handleSubmit
		});

		$$self.$inject_state = $$props => {
			if ('items' in $$props) $$invalidate(1, items = $$props.items);
			if ('slides' in $$props) slides = $$props.slides;
			if ('activeItem' in $$props) activeItem = $$props.activeItem;
			if ('cat1' in $$props) $$invalidate(2, cat1 = $$props.cat1);
			if ('cat2' in $$props) $$invalidate(3, cat2 = $$props.cat2);
			if ('cat3' in $$props) $$invalidate(4, cat3 = $$props.cat3);
			if ('cat4' in $$props) $$invalidate(5, cat4 = $$props.cat4);
			if ('open' in $$props) open = $$props.open;
			if ('showResults' in $$props) $$invalidate(0, showResults = $$props.showResults);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [showResults, items, cat1, cat2, cat3, cat4, submit_handler];
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "App",
				options,
				id: create_fragment.name
			});
		}
	}

	const app = new App({
		target: document.body,
	});

	return app;

})();
//# sourceMappingURL=bundle.js.map
