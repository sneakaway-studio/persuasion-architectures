
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

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

	/** @returns {void} */
	function validate_store(store, name) {
		if (store != null && typeof store.subscribe !== 'function') {
			throw new Error(`'${name}' is not a store with a 'subscribe' method`);
		}
	}

	function subscribe(store, ...callbacks) {
		if (store == null) {
			for (const callback of callbacks) {
				callback(undefined);
			}
			return noop;
		}
		const unsub = store.subscribe(...callbacks);
		return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}

	/** @returns {void} */
	function component_subscribe(component, store, callback) {
		component.$$.on_destroy.push(subscribe(store, callback));
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
	 * Schedules a callback to run immediately after the component has been updated.
	 *
	 * The first time the callback runs will be after the initial `onMount`
	 *
	 * https://svelte.dev/docs/svelte#afterupdate
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function afterUpdate(fn) {
		get_current_component().$$.after_update.push(fn);
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

	/* src\components\Title.svelte generated by Svelte v4.2.19 */
	const file$4 = "src\\components\\Title.svelte";

	function create_fragment$4(ctx) {
		let div1;
		let div0;
		let h1;

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				h1 = element("h1");
				h1.textContent = "How Does Social Proof Affect Your Life?";
				attr_dev(h1, "class", "svelte-1re6lw");
				add_location(h1, file$4, 3, 4, 117);
				attr_dev(div0, "class", "row header svelte-1re6lw");
				add_location(div0, file$4, 2, 2, 87);
				attr_dev(div1, "class", "container");
				add_location(div1, file$4, 1, 0, 60);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, h1);
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}
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

	function instance$4($$self, $$props) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Title', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
		});

		return [];
	}

	class Title extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Title",
				options,
				id: create_fragment$4.name
			});
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
	const file$3 = "src\\components\\ItemList.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[3] = list[i];
		return child_ctx;
	}

	// (27:2) {#each options as opt (opt.id)}
	function create_each_block(key_1, ctx) {
		let div;
		let label;
		let input;
		let input_id_value;
		let input_checked_value;
		let t0;
		let t1_value = /*opt*/ ctx[3].text + "";
		let t1;
		let label_for_value;
		let t2;
		let mounted;
		let dispose;

		function change_handler(...args) {
			return /*change_handler*/ ctx[2](/*opt*/ ctx[3], ...args);
		}

		const block = {
			key: key_1,
			first: null,
			c: function create() {
				div = element("div");
				label = element("label");
				input = element("input");
				t0 = space();
				t1 = text(t1_value);
				t2 = space();
				attr_dev(input, "type", "checkbox");
				attr_dev(input, "id", input_id_value = `item` + /*opt*/ ctx[3].id);
				input.checked = input_checked_value = checkedStates[/*opt*/ ctx[3].id] || false;
				attr_dev(input, "class", "svelte-2s1lok");
				add_location(input, file$3, 29, 8, 846);
				attr_dev(label, "for", label_for_value = `item` + /*opt*/ ctx[3].id);
				attr_dev(label, "class", "svelte-2s1lok");
				add_location(label, file$3, 28, 6, 807);
				attr_dev(div, "class", "checkbox-item svelte-2s1lok");
				add_location(div, file$3, 27, 4, 772);
				this.first = div;
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, label);
				append_dev(label, input);
				append_dev(label, t0);
				append_dev(label, t1);
				append_dev(div, t2);

				if (!mounted) {
					dispose = listen_dev(input, "change", change_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty & /*options*/ 1 && input_id_value !== (input_id_value = `item` + /*opt*/ ctx[3].id)) {
					attr_dev(input, "id", input_id_value);
				}

				if (dirty & /*options*/ 1 && input_checked_value !== (input_checked_value = checkedStates[/*opt*/ ctx[3].id] || false)) {
					prop_dev(input, "checked", input_checked_value);
				}

				if (dirty & /*options*/ 1 && t1_value !== (t1_value = /*opt*/ ctx[3].text + "")) set_data_dev(t1, t1_value);

				if (dirty & /*options*/ 1 && label_for_value !== (label_for_value = `item` + /*opt*/ ctx[3].id)) {
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
			source: "(27:2) {#each options as opt (opt.id)}",
			ctx
		});

		return block;
	}

	function create_fragment$3(ctx) {
		let div;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let each_value = ensure_array_like_dev(/*options*/ ctx[0]);
		const get_key = ctx => /*opt*/ ctx[3].id;
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

				attr_dev(div, "class", "table-body svelte-2s1lok");
				add_location(div, file$3, 25, 0, 707);
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
				if (dirty & /*options, updateCheckedState*/ 3) {
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
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ItemList', slots, []);
		let { options = [] } = $$props;

		// Function to update the global count and checked states
		function updateCheckedState(opt, event) {
			const isChecked = event.target.checked;

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
			options,
			updateCheckedState
		});

		$$self.$inject_state = $$props => {
			if ('options' in $$props) $$invalidate(0, options = $$props.options);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [options, updateCheckedState, change_handler];
	}

	class ItemList extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { options: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ItemList",
				options,
				id: create_fragment$3.name
			});
		}

		get options() {
			throw new Error("<ItemList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set options(value) {
			throw new Error("<ItemList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	// list items data (28 total)
	const items = {
	  category1: [
	    {
	      text: "Bought an item in the stores many people were recommending",
	      id: "1",
	    },
	    {
	      text: "Followed a trend just because a lot of people were doing it",
	      id: "2",
	    },
	    { text: "Filtered out items with ratings of three stars or less", id: "3" },
	    {
	      text: "Adhered to an opinion because it was shared by a lot of people",
	      id: "4",
	    },
	    {
	      text: "Thought something was worth buying because it was almost sold out",
	      id: "5",
	    },
	    {
	      text: "Watched a movie/tv show everyone had been talking about",
	      id: "6",
	    },
	    {
	      text: "Thought a waiter was deserving but did not put money in an empty tip jar",
	      id: "7",
	    },
	  ],
	  category2: [
	    {
	      text: "Chose to buy something online based on the number and quality of its reviews",
	      id: "8",
	    },
	    {
	      text: "Thanked a bus driver after hearing most of the other passengers doing the same",
	      id: "9",
	    },
	    {
	      text: "Stayed quiet about a concerning situation in a public place because no one else was saying anything",
	      id: "10",
	    },
	    { text: "Ate something at a buffet because it was almost gone", id: "11" },
	    {
	      text: "Signed up for a service based on the number of people already using it",
	      id: "12",
	    },
	    {
	      text: "Considered a restaurant/store good because it always had a line outside the door",
	      id: "13",
	    },
	    {
	      text: "Liked a post just because it already had a lot of likes",
	      id: "14",
	    },
	  ],
	  category3: [
	    {
	      text: "Bought an item because it was a 'best-seller' or 'fastest growing'",
	      id: "15",
	    },
	    { text: "Recreated a recipe have seen a lot of people try", id: "16" },
	    {
	      text: "Joined a line even though did not know what it was for",
	      id: "17",
	    },
	    { text: "Found a show funnier thanks to canned laughter", id: "18" },
	    { text: "Visited a not-so-exciting but trendy place", id: "19" },
	    { text: "Watched a video just because it was trending", id: "20" },
	    { text: "Bought something because it had many likes", id: "21" },
	  ],
	  category4: [
	    {
	      text: "Got convinced by the sign to reuse the towel in a hotel",
	      id: "22",
	    },
	    {
	      text: "Donated to a charity after getting told a lot of people were donating",
	      id: "23",
	    },
	    {
	      text: "Did not comment an interesting post because no one else had commented it",
	      id: "24",
	    },
	    { text: "Bought an item from the 'recommended to me' section", id: "25" },
	    {
	      text: "Clapped at a live show following the rest of the audience's example",
	      id: "26",
	    },
	    {
	      text: "Watched a movie/tv show that appeared in the 'most popular' list",
	      id: "27",
	    },
	    { text: "Ate at a restaurant many people were recommending", id: "28" },
	  ],
	};

	// result text and image data (3 total)
	const results = [
	  {
	    id: "1",
	    title:
	      "You do not seem to be impacted by social proof to a significant extent",
	    score_min: 0,
	    score_max: 33,
	    description:
	      'You do not really pay attention to the number of comments, likes and reviews on online platforms. Or maybe you do, but they are not the factors that control your actions online. You would rather watch something without hearing how other people react to it, and you would rather not follow the crowd just because "everyone else is doing it."',
	    media: {
	      image: "images/arrow-by-people.jpg",
	    },
	    credit: "axerosolutions.com / Via axerosolutions.com",
	    credit_url:
	      "https://axerosolutions.com/blogs/timeisenhauer/pulse/829/social-proof-at-work-how-to-master-persuasion-in-your-workplace",
	  },
	  {
	    id: "2",
	    title:
	      "You navigate your actions with a good balance between being driven by social proof and not being affected by it",
	    score_min: 34,
	    score_max: 67,
	    description:
	      "Of course you use social media and look at how people react to the content, buy products online and read their reviews. But, you are able to not get influenced too much by the way others use online platform, and can often decide what to do based on what you believe is best. Aside from the online space, you visit popular places, do activities recommended by many, and follow trends, but not just merely because the majority of people suggest doing so, also if you personally think they are worthy.",
	    media: {
	      image: "images/group-huddle-social-feed.jpg",
	    },
	    credit: "dreamhost.com / Via dreamhost.com",
	    credit_url:
	      "https://www.dreamhost.com/blog/customer-testimonials-social-proof/",
	  },
	  {
	    id: "3",
	    title: "Social proof is the reason why you do most of your actions",
	    score_min: 68,
	    score_max: 100,
	    description:
	      "Posts, images, videos and products seem less interesting and less valid to you if the number of likes, or similar positive reinforcement, is low. You consider the numbers on different online platform to be the main indication of the quality of the content posted there. You are more likely to engage in activities if you see that many other people, especially if they are your friends or similar to you, are also doing them. Additionally, you would feel lost watching a sitcom without the laugh track, and appreciate shows with a live audience, so that the jokes sound funnier and you get a sense of when it is the right time to laugh. In real life, you think lines outside of stores are a clear symbol of good quality and you always try the new trend if many people around you are recommending it.",
	    media: {
	      image: "images/icons-surround-person.jpg",
	    },
	    credit:
	      "sehealthcarequalityconsulting.com / Via sehealthcarequalityconsulting.com",
	    credit_url:
	      "https://www.sehealthcarequalityconsulting.com/2018/01/09/principles-influence-healthcare-marketing-social-proof/",
	  },
	];

	/* src\components\Results.svelte generated by Svelte v4.2.19 */
	const file$2 = "src\\components\\Results.svelte";

	function create_fragment$2(ctx) {
		let div2;
		let div0;
		let h2;
		let t0_value = results[/*resultId*/ ctx[0]].title + "";
		let t0;
		let t1;
		let p;
		let t2_value = results[/*resultId*/ ctx[0]].description + "";
		let t2;
		let t3;
		let div1;
		let img;
		let img_src_value;
		let img_alt_value;
		let t4;
		let small;
		let a;
		let t5;
		let a_href_value;
		let t6;
		let t7_value = results[/*resultId*/ ctx[0]].credit + "";
		let t7;

		const block = {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				h2 = element("h2");
				t0 = text(t0_value);
				t1 = space();
				p = element("p");
				t2 = text(t2_value);
				t3 = space();
				div1 = element("div");
				img = element("img");
				t4 = space();
				small = element("small");
				a = element("a");
				t5 = text("Media Credits:");
				t6 = space();
				t7 = text(t7_value);
				attr_dev(h2, "class", "svelte-1kxxdxa");
				add_location(h2, file$2, 19, 4, 504);
				attr_dev(p, "class", "svelte-1kxxdxa");
				add_location(p, file$2, 20, 4, 544);
				attr_dev(div0, "class", "col-12 col-md-6");
				add_location(div0, file$2, 18, 2, 469);
				if (!src_url_equal(img.src, img_src_value = results[/*resultId*/ ctx[0]].media.image)) attr_dev(img, "src", img_src_value);
				attr_dev(img, "class", "img-fluid svelte-1kxxdxa");
				attr_dev(img, "alt", img_alt_value = "image " + results[/*resultId*/ ctx[0]].title);
				add_location(img, file$2, 24, 4, 657);
				attr_dev(a, "href", a_href_value = results[/*resultId*/ ctx[0]].credit_url);
				add_location(a, file$2, 30, 6, 803);
				add_location(small, file$2, 29, 4, 788);
				attr_dev(div1, "class", "col-12 col-md-6");
				add_location(div1, file$2, 23, 2, 622);
				attr_dev(div2, "class", "row");
				add_location(div2, file$2, 16, 0, 423);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div0);
				append_dev(div0, h2);
				append_dev(h2, t0);
				append_dev(div0, t1);
				append_dev(div0, p);
				append_dev(p, t2);
				append_dev(div2, t3);
				append_dev(div2, div1);
				append_dev(div1, img);
				append_dev(div1, t4);
				append_dev(div1, small);
				append_dev(small, a);
				append_dev(a, t5);
				append_dev(small, t6);
				append_dev(small, t7);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*resultId*/ 1 && t0_value !== (t0_value = results[/*resultId*/ ctx[0]].title + "")) set_data_dev(t0, t0_value);
				if (dirty & /*resultId*/ 1 && t2_value !== (t2_value = results[/*resultId*/ ctx[0]].description + "")) set_data_dev(t2, t2_value);

				if (dirty & /*resultId*/ 1 && !src_url_equal(img.src, img_src_value = results[/*resultId*/ ctx[0]].media.image)) {
					attr_dev(img, "src", img_src_value);
				}

				if (dirty & /*resultId*/ 1 && img_alt_value !== (img_alt_value = "image " + results[/*resultId*/ ctx[0]].title)) {
					attr_dev(img, "alt", img_alt_value);
				}

				if (dirty & /*resultId*/ 1 && a_href_value !== (a_href_value = results[/*resultId*/ ctx[0]].credit_url)) {
					attr_dev(a, "href", a_href_value);
				}

				if (dirty & /*resultId*/ 1 && t7_value !== (t7_value = results[/*resultId*/ ctx[0]].credit + "")) set_data_dev(t7, t7_value);
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
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
		let $count;
		validate_store(count, 'count');
		component_subscribe($$self, count, $$value => $$invalidate(1, $count = $$value));
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Results', slots, []);
		let resultId = 0;
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Results> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ count, results, resultId, $count });

		$$self.$inject_state = $$props => {
			if ('resultId' in $$props) $$invalidate(0, resultId = $$props.resultId);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*$count*/ 2) {
				// logic for result display:
				// as reactive block to allow change after
				// submission if user changes count
				{
					if ($count >= 0 && $count <= 9) $$invalidate(0, resultId = 0); else if ($count >= 10 && $count <= 19) $$invalidate(0, resultId = 1); else $$invalidate(0, resultId = 2); // if $count >= 20 && $count <= 28}
				}
			}
		};

		return [resultId, $count];
	}

	class Results extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Results",
				options,
				id: create_fragment$2.name
			});
		}
	}

	/* src\components\Carousel.svelte generated by Svelte v4.2.19 */
	const file$1 = "src\\components\\Carousel.svelte";

	// (87:10) {#if submitState}
	function create_if_block_1(ctx) {
		let button;

		const block = {
			c: function create() {
				button = element("button");
				attr_dev(button, "type", "button");
				attr_dev(button, "data-bs-target", "#carousel-quiz");
				attr_dev(button, "data-bs-slide-to", "4");
				attr_dev(button, "aria-label", "Slide 5");
				add_location(button, file$1, 87, 12, 2738);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(button);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1.name,
			type: "if",
			source: "(87:10) {#if submitState}",
			ctx
		});

		return block;
	}

	// (121:10) {#if submitState}
	function create_if_block(ctx) {
		let div1;
		let div0;
		let t;
		let results;
		let current;
		results = new Results({ $$inline: true });

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				t = space();
				create_component(results.$$.fragment);
				attr_dev(div0, "class", "carousel-captions");
				add_location(div0, file$1, 122, 14, 3805);
				attr_dev(div1, "class", "carousel-item");
				add_location(div1, file$1, 121, 12, 3762);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div1, t);
				mount_component(results, div1, null);
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
				if (detaching) {
					detach_dev(div1);
				}

				destroy_component(results);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(121:10) {#if submitState}",
			ctx
		});

		return block;
	}

	function create_fragment$1(ctx) {
		let div10;
		let div9;
		let div8;
		let div7;
		let div0;
		let button0;
		let t0;
		let button1;
		let t1;
		let button2;
		let t2;
		let button3;
		let t3;
		let t4;
		let div6;
		let div1;
		let itemlist0;
		let t5;
		let div2;
		let itemlist1;
		let t6;
		let div3;
		let itemlist2;
		let t7;
		let div5;
		let itemlist3;
		let t8;
		let div4;
		let button4;
		let t10;
		let t11;
		let button5;
		let span0;
		let t12;
		let span1;
		let t14;
		let button6;
		let span2;
		let t15;
		let span3;
		let current;
		let mounted;
		let dispose;
		let if_block0 = /*submitState*/ ctx[0] && create_if_block_1(ctx);

		itemlist0 = new ItemList({
				props: { options: items.category1 },
				$$inline: true
			});

		itemlist1 = new ItemList({
				props: { options: items.category2 },
				$$inline: true
			});

		itemlist2 = new ItemList({
				props: { options: items.category3 },
				$$inline: true
			});

		itemlist3 = new ItemList({
				props: { options: items.category4 },
				$$inline: true
			});

		let if_block1 = /*submitState*/ ctx[0] && create_if_block(ctx);

		const block = {
			c: function create() {
				div10 = element("div");
				div9 = element("div");
				div8 = element("div");
				div7 = element("div");
				div0 = element("div");
				button0 = element("button");
				t0 = space();
				button1 = element("button");
				t1 = space();
				button2 = element("button");
				t2 = space();
				button3 = element("button");
				t3 = space();
				if (if_block0) if_block0.c();
				t4 = space();
				div6 = element("div");
				div1 = element("div");
				create_component(itemlist0.$$.fragment);
				t5 = space();
				div2 = element("div");
				create_component(itemlist1.$$.fragment);
				t6 = space();
				div3 = element("div");
				create_component(itemlist2.$$.fragment);
				t7 = space();
				div5 = element("div");
				create_component(itemlist3.$$.fragment);
				t8 = space();
				div4 = element("div");
				button4 = element("button");
				button4.textContent = "Submit";
				t10 = space();
				if (if_block1) if_block1.c();
				t11 = space();
				button5 = element("button");
				span0 = element("span");
				t12 = space();
				span1 = element("span");
				span1.textContent = "Previous";
				t14 = space();
				button6 = element("button");
				span2 = element("span");
				t15 = space();
				span3 = element("span");
				span3.textContent = "Next";
				attr_dev(button0, "type", "button");
				attr_dev(button0, "data-bs-target", "#carousel-quiz");
				attr_dev(button0, "data-bs-slide-to", "0");
				attr_dev(button0, "class", "active");
				attr_dev(button0, "aria-current", "true");
				attr_dev(button0, "aria-label", "Slide 1");
				add_location(button0, file$1, 55, 10, 1863);
				attr_dev(button1, "type", "button");
				attr_dev(button1, "data-bs-target", "#carousel-quiz");
				attr_dev(button1, "data-bs-slide-to", "1");
				attr_dev(button1, "aria-label", "Slide 2");
				add_location(button1, file$1, 64, 10, 2107);
				attr_dev(button2, "type", "button");
				attr_dev(button2, "data-bs-target", "#carousel-quiz");
				attr_dev(button2, "data-bs-slide-to", "2");
				attr_dev(button2, "aria-label", "Slide 3");
				add_location(button2, file$1, 71, 10, 2290);
				attr_dev(button3, "type", "button");
				attr_dev(button3, "data-bs-target", "#carousel-quiz");
				attr_dev(button3, "data-bs-slide-to", "3");
				attr_dev(button3, "aria-label", "Slide 4");
				add_location(button3, file$1, 78, 10, 2473);
				attr_dev(div0, "class", "carousel-indicators");
				add_location(div0, file$1, 54, 8, 1818);
				attr_dev(div1, "class", "carousel-item active");
				add_location(div1, file$1, 97, 10, 3002);
				attr_dev(div2, "class", "carousel-item");
				add_location(div2, file$1, 101, 10, 3120);
				attr_dev(div3, "class", "carousel-item");
				add_location(div3, file$1, 105, 10, 3231);
				attr_dev(button4, "class", "btn btn-primary btn-lg mt-3");
				add_location(button4, file$1, 112, 14, 3491);
				attr_dev(div4, "class", "d-grid gap-2 col-4 mx-auto");
				add_location(div4, file$1, 111, 12, 3435);
				attr_dev(div5, "class", "carousel-item");
				add_location(div5, file$1, 109, 10, 3342);
				attr_dev(div6, "class", "carousel-inner");
				add_location(div6, file$1, 96, 8, 2962);
				attr_dev(span0, "class", "carousel-control-prev-icon");
				attr_dev(span0, "aria-hidden", "true");
				add_location(span0, file$1, 135, 10, 4151);
				attr_dev(span1, "class", "visually-hidden");
				add_location(span1, file$1, 136, 10, 4230);
				attr_dev(button5, "class", "carousel-control-prev svelte-118215r");
				attr_dev(button5, "type", "button");
				attr_dev(button5, "data-bs-target", "#carousel-quiz");
				attr_dev(button5, "data-bs-slide", "prev");
				add_location(button5, file$1, 129, 8, 3980);
				attr_dev(span2, "class", "carousel-control-next-icon");
				attr_dev(span2, "aria-hidden", "true");
				add_location(span2, file$1, 146, 10, 4519);
				attr_dev(span3, "class", "visually-hidden");
				add_location(span3, file$1, 147, 10, 4598);
				attr_dev(button6, "class", "carousel-control-next svelte-118215r");
				attr_dev(button6, "type", "button");
				attr_dev(button6, "data-bs-target", "#carousel-quiz");
				attr_dev(button6, "data-bs-slide", "next");
				add_location(button6, file$1, 140, 8, 4348);
				attr_dev(div7, "id", "carousel-quiz");
				attr_dev(div7, "class", "carousel slide pb-5");
				add_location(div7, file$1, 53, 6, 1756);
				attr_dev(div8, "class", "col-12 col-md-12 col-lg-8");
				add_location(div8, file$1, 52, 4, 1709);
				attr_dev(div9, "class", "row justify-content-center");
				add_location(div9, file$1, 51, 2, 1663);
				attr_dev(div10, "class", "container text-left");
				add_location(div10, file$1, 50, 0, 1626);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div10, anchor);
				append_dev(div10, div9);
				append_dev(div9, div8);
				append_dev(div8, div7);
				append_dev(div7, div0);
				append_dev(div0, button0);
				append_dev(div0, t0);
				append_dev(div0, button1);
				append_dev(div0, t1);
				append_dev(div0, button2);
				append_dev(div0, t2);
				append_dev(div0, button3);
				append_dev(div0, t3);
				if (if_block0) if_block0.m(div0, null);
				append_dev(div7, t4);
				append_dev(div7, div6);
				append_dev(div6, div1);
				mount_component(itemlist0, div1, null);
				append_dev(div6, t5);
				append_dev(div6, div2);
				mount_component(itemlist1, div2, null);
				append_dev(div6, t6);
				append_dev(div6, div3);
				mount_component(itemlist2, div3, null);
				append_dev(div6, t7);
				append_dev(div6, div5);
				mount_component(itemlist3, div5, null);
				append_dev(div5, t8);
				append_dev(div5, div4);
				append_dev(div4, button4);
				append_dev(div6, t10);
				if (if_block1) if_block1.m(div6, null);
				append_dev(div7, t11);
				append_dev(div7, button5);
				append_dev(button5, span0);
				append_dev(button5, t12);
				append_dev(button5, span1);
				append_dev(div7, t14);
				append_dev(div7, button6);
				append_dev(button6, span2);
				append_dev(button6, t15);
				append_dev(button6, span3);
				current = true;

				if (!mounted) {
					dispose = listen_dev(button4, "click", /*handleSubmit*/ ctx[1], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (/*submitState*/ ctx[0]) {
					if (if_block0) ; else {
						if_block0 = create_if_block_1(ctx);
						if_block0.c();
						if_block0.m(div0, null);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*submitState*/ ctx[0]) {
					if (if_block1) {
						if (dirty & /*submitState*/ 1) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(div6, null);
					}
				} else if (if_block1) {
					group_outros();

					transition_out(if_block1, 1, 1, () => {
						if_block1 = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(itemlist0.$$.fragment, local);
				transition_in(itemlist1.$$.fragment, local);
				transition_in(itemlist2.$$.fragment, local);
				transition_in(itemlist3.$$.fragment, local);
				transition_in(if_block1);
				current = true;
			},
			o: function outro(local) {
				transition_out(itemlist0.$$.fragment, local);
				transition_out(itemlist1.$$.fragment, local);
				transition_out(itemlist2.$$.fragment, local);
				transition_out(itemlist3.$$.fragment, local);
				transition_out(if_block1);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div10);
				}

				if (if_block0) if_block0.d();
				destroy_component(itemlist0);
				destroy_component(itemlist1);
				destroy_component(itemlist2);
				destroy_component(itemlist3);
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
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

	function updateArrows() {
		const totalSlides = document.querySelectorAll(".carousel-item").length;
		const activeIndex = [...document.querySelectorAll(".carousel-item")].findIndex(item => item.classList.contains("active"));
		const prevArrow = document.querySelector(".carousel-control-prev");
		const nextArrow = document.querySelector(".carousel-control-next");

		// Show/hide arrows based on the active index
		prevArrow.style.display = activeIndex === 0 ? "none" : "block";

		nextArrow.style.display = activeIndex === totalSlides - 1 ? "none" : "block";
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Carousel', slots, []);
		let submitState = false;

		// Update arrows on initial load and when sliding
		onMount(() => {
			updateArrows();

			// Event listener for slide event
			const carouselElement = document.getElementById("carousel-quiz");

			carouselElement.addEventListener("slid.bs.carousel", updateArrows);
		});

		function handleSubmit() {
			// dispatch("submit"); // pass event details to app.svelte
			$$invalidate(0, submitState = true);
		}

		// trigger results slide when submitState changes
		afterUpdate(() => {
			if (submitState) {
				const carousel = new bootstrap.Carousel(document.getElementById("carousel-quiz"));
				carousel.to(4); // Move to the fifth slide (i=4)
			}
		});

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({
			onMount,
			afterUpdate,
			ItemList,
			items,
			Results,
			submitState,
			updateArrows,
			handleSubmit
		});

		$$self.$inject_state = $$props => {
			if ('submitState' in $$props) $$invalidate(0, submitState = $$props.submitState);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [submitState, handleSubmit];
	}

	class Carousel extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Carousel",
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src\App.svelte generated by Svelte v4.2.19 */
	const file = "src\\App.svelte";

	function create_fragment(ctx) {
		let title;
		let t0;
		let main;
		let div1;
		let div0;
		let h4;
		let t2;
		let carousel;
		let current;
		title = new Title({ $$inline: true });
		carousel = new Carousel({ $$inline: true });

		const block = {
			c: function create() {
				create_component(title.$$.fragment);
				t0 = space();
				main = element("main");
				div1 = element("div");
				div0 = element("div");
				h4 = element("h4");
				h4.textContent = "Select items that reflect your experience(s) to discover the impact this\r\n        phenomenon has on you.";
				t2 = space();
				create_component(carousel.$$.fragment);
				set_style(h4, "color", "whitesmoke");
				attr_dev(h4, "class", "svelte-28thvs");
				add_location(h4, file, 12, 6, 287);
				attr_dev(div0, "class", "row");
				add_location(div0, file, 11, 4, 262);
				attr_dev(div1, "class", "container d-none d-md-block text-center");
				add_location(div1, file, 10, 2, 203);
				attr_dev(main, "class", "svelte-28thvs");
				add_location(main, file, 9, 0, 193);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(title, target, anchor);
				insert_dev(target, t0, anchor);
				insert_dev(target, main, anchor);
				append_dev(main, div1);
				append_dev(div1, div0);
				append_dev(div0, h4);
				append_dev(main, t2);
				mount_component(carousel, main, null);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(title.$$.fragment, local);
				transition_in(carousel.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(title.$$.fragment, local);
				transition_out(carousel.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t0);
					detach_dev(main);
				}

				destroy_component(title, detaching);
				destroy_component(carousel);
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
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ Title, Carousel });
		return [];
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
