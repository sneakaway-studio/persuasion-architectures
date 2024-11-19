
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

	/* src/components/Title.svelte generated by Svelte v4.2.19 */
	const file$4 = "src/components/Title.svelte";

	function create_fragment$4(ctx) {
		let div1;
		let div0;
		let h3;
		let t1;
		let div3;
		let div2;
		let h4;

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				h3 = element("h3");
				h3.textContent = "Celebrity Matching Game";
				t1 = space();
				div3 = element("div");
				div2 = element("div");
				h4 = element("h4");
				h4.textContent = "Match the celebrity on the magazine cover to the celebrity pictured in\n      the streets!";
				attr_dev(h3, "class", "svelte-98h1gn");
				add_location(h3, file$4, 3, 4, 114);
				attr_dev(div0, "class", "row header svelte-98h1gn");
				add_location(div0, file$4, 2, 2, 85);
				attr_dev(div1, "class", "container");
				add_location(div1, file$4, 1, 0, 59);
				attr_dev(h4, "class", "svelte-98h1gn");
				add_location(h4, file$4, 9, 4, 242);
				attr_dev(div2, "class", "row");
				add_location(div2, file$4, 8, 2, 220);
				attr_dev(div3, "class", "container d-none d-md-block text-center");
				add_location(div3, file$4, 7, 0, 164);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, h3);
				insert_dev(target, t1, anchor);
				insert_dev(target, div3, anchor);
				append_dev(div3, div2);
				append_dev(div2, h4);
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
					detach_dev(t1);
					detach_dev(div3);
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

	/* src/components/Modal.svelte generated by Svelte v4.2.19 */
	const file$3 = "src/components/Modal.svelte";

	// (7:0) {#if gameCompleted}
	function create_if_block$1(ctx) {
		let div1;
		let div0;
		let h2;
		let t1;
		let p;
		let t3;
		let button0;
		let t5;
		let button1;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				h2 = element("h2");
				h2.textContent = "Congratulations!";
				t1 = space();
				p = element("p");
				p.textContent = "You successfully completed the game!";
				t3 = space();
				button0 = element("button");
				button0.textContent = "Close";
				t5 = space();
				button1 = element("button");
				button1.textContent = "Restart Game";
				attr_dev(h2, "class", "svelte-gx23od");
				add_location(h2, file$3, 10, 6, 428);
				attr_dev(p, "class", "svelte-gx23od");
				add_location(p, file$3, 11, 6, 460);
				attr_dev(button0, "class", "svelte-gx23od");
				add_location(button0, file$3, 12, 6, 510);
				attr_dev(button1, "class", "svelte-gx23od");
				add_location(button1, file$3, 13, 6, 560);
				attr_dev(div0, "class", "content svelte-gx23od");
				add_location(div0, file$3, 9, 4, 400);
				attr_dev(div1, "class", "overlay svelte-gx23od");
				add_location(div1, file$3, 8, 2, 374);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, h2);
				append_dev(div0, t1);
				append_dev(div0, p);
				append_dev(div0, t3);
				append_dev(div0, button0);
				append_dev(div0, t5);
				append_dev(div0, button1);

				if (!mounted) {
					dispose = [
						listen_dev(
							button0,
							"click",
							function () {
								if (is_function(/*closeOnly*/ ctx[2])) /*closeOnly*/ ctx[2].apply(this, arguments);
							},
							false,
							false,
							false,
							false
						),
						listen_dev(
							button1,
							"click",
							function () {
								if (is_function(/*resetBoard*/ ctx[1])) /*resetBoard*/ ctx[1].apply(this, arguments);
							},
							false,
							false,
							false,
							false
						)
					];

					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$1.name,
			type: "if",
			source: "(7:0) {#if gameCompleted}",
			ctx
		});

		return block;
	}

	function create_fragment$3(ctx) {
		let if_block_anchor;
		let if_block = /*gameCompleted*/ ctx[0] && create_if_block$1(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
			},
			p: function update(ctx, [dirty]) {
				if (/*gameCompleted*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$1(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

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
		validate_slots('Modal', slots, []);
		let { gameCompleted = false } = $$props;
		let { resetBoard } = $$props;
		let { closeOnly } = $$props;

		$$self.$$.on_mount.push(function () {
			if (resetBoard === undefined && !('resetBoard' in $$props || $$self.$$.bound[$$self.$$.props['resetBoard']])) {
				console.warn("<Modal> was created without expected prop 'resetBoard'");
			}

			if (closeOnly === undefined && !('closeOnly' in $$props || $$self.$$.bound[$$self.$$.props['closeOnly']])) {
				console.warn("<Modal> was created without expected prop 'closeOnly'");
			}
		});

		const writable_props = ['gameCompleted', 'resetBoard', 'closeOnly'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('gameCompleted' in $$props) $$invalidate(0, gameCompleted = $$props.gameCompleted);
			if ('resetBoard' in $$props) $$invalidate(1, resetBoard = $$props.resetBoard);
			if ('closeOnly' in $$props) $$invalidate(2, closeOnly = $$props.closeOnly);
		};

		$$self.$capture_state = () => ({ gameCompleted, resetBoard, closeOnly });

		$$self.$inject_state = $$props => {
			if ('gameCompleted' in $$props) $$invalidate(0, gameCompleted = $$props.gameCompleted);
			if ('resetBoard' in $$props) $$invalidate(1, resetBoard = $$props.resetBoard);
			if ('closeOnly' in $$props) $$invalidate(2, closeOnly = $$props.closeOnly);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [gameCompleted, resetBoard, closeOnly];
	}

	class Modal extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$3, create_fragment$3, safe_not_equal, {
				gameCompleted: 0,
				resetBoard: 1,
				closeOnly: 2
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Modal",
				options,
				id: create_fragment$3.name
			});
		}

		get gameCompleted() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set gameCompleted(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get resetBoard() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set resetBoard(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get closeOnly() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set closeOnly(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

	// celebrity images (16img; 8 celebs)
	//writable to change image reveal status

	let images = writable([
	  {
	    id: "01",
	    img_url: "images/anniston_real.jpeg",
	    title: "Jennifer Anniston - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "11",
	    img_url: "images/anniston_magazine.jpg",
	    title: "Jennifer Anniston - Magazine",
	    isRevealed: false,
	    matched: false,
	  },

	  {
	    id: "02",
	    img_url: "images/gaga_real.jpeg",
	    title: "Gaga - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "12",
	    img_url: "images/gaga_magazine.jpeg",
	    title: "Gaga - Magazine",
	    isRevealed: false,
	    matched: false,
	  },

	  {
	    id: "03",
	    img_url: "images/gomez_real.jpeg",
	    title: "Selena Gomez - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "13",
	    img_url: "images/gomez_magazine.jpeg",
	    title: "Selena Gomez - Magazine",
	    isRevealed: false,
	    matched: false,
	  },

	  {
	    id: "04",
	    img_url: "images/lively_real.jpeg",
	    title: "Blake Lively - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "14",
	    img_url: "images/lively_magazine.jpeg",
	    title: "Blake Lively - Magazine",
	    isRevealed: false,
	    matched: false,
	  },

	  {
	    id: "05",
	    img_url: "images/lohan_real.jpeg",
	    title: "Lindsey Lohan - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "15",
	    img_url: "images/lohan_magazine.jpeg",
	    title: "Lindsey Lohan - Magazine",
	    isRevealed: false,
	    matched: false,
	  },

	  {
	    id: "06",
	    img_url: "images/morgan_real.jpg",
	    title: "Morgan - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "16",
	    img_url: "images/morgan_magazine.jpeg",
	    title: "Morgan - Magazine",
	    isRevealed: false,
	    matched: false,
	  },

	  {
	    id: "07",
	    img_url: "images/underwood_real.jpeg",
	    title: "Underwood - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "17",
	    img_url: "images/underwood_magazine.jpeg",
	    title: "Underwood - Magazine",
	    isRevealed: false,
	    matched: false,
	  },

	  {
	    id: "08",
	    img_url: "images/witherspoon_real.jpeg",
	    title: "Witherspoon - Real",
	    isRevealed: false,
	    matched: false,
	  },
	  {
	    id: "18",
	    img_url: "images/witherspoon_magazine.jpeg",
	    title: "Witherspoon - Magazine",
	    isRevealed: false,
	    matched: false,
	  },
	]);

	const randomIndices = writable([]);

	// Generate shuffled indices
	function IndexGenerator() {
	  const indices = Array.from({ length: 16 }, (_, i) => i);
	  return indices.sort(() => Math.random() - 0.5);
	}

	// Shuffle the indices and update the store
	function shuffleIndices() {
	  randomIndices.set(IndexGenerator());
	}

	/* src/components/gameLogic.svelte generated by Svelte v4.2.19 */

	const { console: console_1 } = globals;
	const file$2 = "src/components/gameLogic.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[8] = list[i];
		return child_ctx;
	}

	// (123:6) {#if $images[index].isRevealed}
	function create_if_block(ctx) {
		let div;

		const block = {
			c: function create() {
				div = element("div");
				attr_dev(div, "class", "card-image svelte-m3zavg");
				set_style(div, "background-image", "url(" + /*$images*/ ctx[0][/*index*/ ctx[8]].img_url + ")");
				set_style(div, "width", "100%");
				add_location(div, file$2, 123, 7, 3156);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*$images, $randomIndices*/ 3) {
					set_style(div, "background-image", "url(" + /*$images*/ ctx[0][/*index*/ ctx[8]].img_url + ")");
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(123:6) {#if $images[index].isRevealed}",
			ctx
		});

		return block;
	}

	// (108:2) {#each $randomIndices as index}
	function create_each_block(ctx) {
		let div1;
		let button;
		let div0;
		let div0_class_value;
		let button_disabled_value;
		let t;
		let div1_class_value;
		let mounted;
		let dispose;
		let if_block = /*$images*/ ctx[0][/*index*/ ctx[8]].isRevealed && create_if_block(ctx);

		function click_handler() {
			return /*click_handler*/ ctx[5](/*index*/ ctx[8]);
		}

		const block = {
			c: function create() {
				div1 = element("div");
				button = element("button");
				div0 = element("div");
				if (if_block) if_block.c();
				t = space();

				attr_dev(div0, "class", div0_class_value = "card " + (/*$images*/ ctx[0][/*index*/ ctx[8]].isRevealed
				? 'revealed'
				: '') + " " + (/*$images*/ ctx[0][/*index*/ ctx[8]].matched
				? 'matched'
				: '') + " mb-1" + " svelte-m3zavg");

				add_location(div0, file$2, 117, 5, 2973);
				attr_dev(button, "class", "btn btn-link p-1 no-border svelte-m3zavg");
				button.disabled = button_disabled_value = /*$images*/ ctx[0][/*index*/ ctx[8]].matched;
				add_location(button, file$2, 112, 4, 2818);
				attr_dev(div1, "class", div1_class_value = "col-3 col" + /*$images*/ ctx[0][/*index*/ ctx[8]].id + " d-flex justify-content-center g-0 colClass" + " svelte-m3zavg");
				add_location(div1, file$2, 108, 3, 2714);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, button);
				append_dev(button, div0);
				if (if_block) if_block.m(div0, null);
				append_dev(div1, t);

				if (!mounted) {
					dispose = listen_dev(button, "click", click_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (/*$images*/ ctx[0][/*index*/ ctx[8]].isRevealed) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						if_block.m(div0, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (dirty & /*$images, $randomIndices*/ 3 && div0_class_value !== (div0_class_value = "card " + (/*$images*/ ctx[0][/*index*/ ctx[8]].isRevealed
				? 'revealed'
				: '') + " " + (/*$images*/ ctx[0][/*index*/ ctx[8]].matched
				? 'matched'
				: '') + " mb-1" + " svelte-m3zavg")) {
					attr_dev(div0, "class", div0_class_value);
				}

				if (dirty & /*$images, $randomIndices*/ 3 && button_disabled_value !== (button_disabled_value = /*$images*/ ctx[0][/*index*/ ctx[8]].matched)) {
					prop_dev(button, "disabled", button_disabled_value);
				}

				if (dirty & /*$images, $randomIndices*/ 3 && div1_class_value !== (div1_class_value = "col-3 col" + /*$images*/ ctx[0][/*index*/ ctx[8]].id + " d-flex justify-content-center g-0 colClass" + " svelte-m3zavg")) {
					attr_dev(div1, "class", div1_class_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				if (if_block) if_block.d();
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(108:2) {#each $randomIndices as index}",
			ctx
		});

		return block;
	}

	function create_fragment$2(ctx) {
		let div1;
		let div0;
		let each_value = ensure_array_like_dev(/*$randomIndices*/ ctx[1]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(div0, "class", "row justify-content-center");
				add_location(div0, file$2, 106, 1, 2636);
				attr_dev(div1, "class", "container-fluid");
				add_location(div1, file$2, 105, 0, 2605);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div0, null);
					}
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*$images, $randomIndices, handleTileClick*/ 7) {
					each_value = ensure_array_like_dev(/*$randomIndices*/ ctx[1]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div0, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				destroy_each(each_blocks, detaching);
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
		let $images;
		let $randomIndices;
		validate_store(images, 'images');
		component_subscribe($$self, images, $$value => $$invalidate(0, $images = $$value));
		validate_store(randomIndices, 'randomIndices');
		component_subscribe($$self, randomIndices, $$value => $$invalidate(1, $randomIndices = $$value));
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('GameLogic', slots, []);
		let { onGameCompleted } = $$props;
		let { matchCount } = $$props;
		let selectedTiles = [];

		//showing tile +
		//logging tile selections
		function handleTileClick(tileId) {
			console.log($images[tileId]);

			// Prevent double-clicking on the same tile
			if (selectedTiles.includes(tileId)) return;

			//update reveal status
			images.update(currentTiles => currentTiles.map(tile => tile.id === tileId
			? { ...tile, isRevealed: !tile.isRevealed }
			: tile));

			// record selected tile for match
			selectedTiles.push(tileId);

			// check for match when 2 tiles selected
			if (selectedTiles.length === 2) {
				checkForMatch(selectedTiles);
			}
		}

		// checking for tile matches
		function checkForMatch(tiles) {
			const [firstTile, secondTile] = tiles;

			//second digit in ID to match
			const firstMatchId = firstTile.toString().slice(1);

			const secondMatchId = secondTile.toString().slice(1);

			if (firstMatchId === secondMatchId) {
				images.update(currentTiles => currentTiles.map(tile => tile.id === firstTile || tile.id === secondTile
				? { ...tile, matched: true }
				: tile));

				$$invalidate(3, matchCount += 1);

				if (matchCount === 8) {
					onGameCompleted(); // triggers pop up
				}
			} else {
				// hide tiles
				setTimeout(
					() => {
						images.update(currentTiles => currentTiles.map(tile => tile.id === firstTile || tile.id === secondTile
						? { ...tile, isRevealed: false }
						: tile));
					},
					500
				);
			}

			// reset selection record
			selectedTiles = [];
		}

		$$self.$$.on_mount.push(function () {
			if (onGameCompleted === undefined && !('onGameCompleted' in $$props || $$self.$$.bound[$$self.$$.props['onGameCompleted']])) {
				console_1.warn("<GameLogic> was created without expected prop 'onGameCompleted'");
			}

			if (matchCount === undefined && !('matchCount' in $$props || $$self.$$.bound[$$self.$$.props['matchCount']])) {
				console_1.warn("<GameLogic> was created without expected prop 'matchCount'");
			}
		});

		const writable_props = ['onGameCompleted', 'matchCount'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<GameLogic> was created with unknown prop '${key}'`);
		});

		const click_handler = index => handleTileClick($images[index].id);

		$$self.$$set = $$props => {
			if ('onGameCompleted' in $$props) $$invalidate(4, onGameCompleted = $$props.onGameCompleted);
			if ('matchCount' in $$props) $$invalidate(3, matchCount = $$props.matchCount);
		};

		$$self.$capture_state = () => ({
			images,
			randomIndices,
			onGameCompleted,
			matchCount,
			selectedTiles,
			handleTileClick,
			checkForMatch,
			$images,
			$randomIndices
		});

		$$self.$inject_state = $$props => {
			if ('onGameCompleted' in $$props) $$invalidate(4, onGameCompleted = $$props.onGameCompleted);
			if ('matchCount' in $$props) $$invalidate(3, matchCount = $$props.matchCount);
			if ('selectedTiles' in $$props) selectedTiles = $$props.selectedTiles;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			$images,
			$randomIndices,
			handleTileClick,
			matchCount,
			onGameCompleted,
			click_handler
		];
	}

	class GameLogic extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { onGameCompleted: 4, matchCount: 3 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "GameLogic",
				options,
				id: create_fragment$2.name
			});
		}

		get onGameCompleted() {
			throw new Error("<GameLogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set onGameCompleted(value) {
			throw new Error("<GameLogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get matchCount() {
			throw new Error("<GameLogic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set matchCount(value) {
			throw new Error("<GameLogic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/gameUI.svelte generated by Svelte v4.2.19 */
	const file$1 = "src/components/gameUI.svelte";

	function create_fragment$1(ctx) {
		let modal;
		let t0;
		let gamelogic;
		let t1;
		let div;
		let button;
		let i;
		let t2;
		let current;
		let mounted;
		let dispose;

		modal = new Modal({
				props: {
					gameCompleted: /*gameCompleted*/ ctx[0],
					resetBoard: /*restartGame*/ ctx[2],
					closeOnly: /*func*/ ctx[4]
				},
				$$inline: true
			});

		gamelogic = new GameLogic({
				props: {
					onGameCompleted: /*handleGameCompleted*/ ctx[3],
					matchCount: /*matchCount*/ ctx[1]
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(modal.$$.fragment);
				t0 = space();
				create_component(gamelogic.$$.fragment);
				t1 = space();
				div = element("div");
				button = element("button");
				i = element("i");
				t2 = text("\n\t\t Restart Game");
				attr_dev(i, "class", "bi bi-arrow-clockwise");
				add_location(i, file$1, 50, 2, 1105);
				attr_dev(button, "class", "btn btn-primary");
				attr_dev(button, "aria-label", "Restart Game");
				add_location(button, file$1, 49, 1, 1021);
				attr_dev(div, "class", "text-center mt-2");
				add_location(div, file$1, 48, 0, 989);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(modal, target, anchor);
				insert_dev(target, t0, anchor);
				mount_component(gamelogic, target, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, div, anchor);
				append_dev(div, button);
				append_dev(button, i);
				append_dev(button, t2);
				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", /*restartGame*/ ctx[2], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				const modal_changes = {};
				if (dirty & /*gameCompleted*/ 1) modal_changes.gameCompleted = /*gameCompleted*/ ctx[0];
				if (dirty & /*gameCompleted*/ 1) modal_changes.closeOnly = /*func*/ ctx[4];
				modal.$set(modal_changes);
				const gamelogic_changes = {};
				if (dirty & /*matchCount*/ 2) gamelogic_changes.matchCount = /*matchCount*/ ctx[1];
				gamelogic.$set(gamelogic_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(modal.$$.fragment, local);
				transition_in(gamelogic.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(modal.$$.fragment, local);
				transition_out(gamelogic.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t0);
					detach_dev(t1);
					detach_dev(div);
				}

				destroy_component(modal, detaching);
				destroy_component(gamelogic, detaching);
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

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('GameUI', slots, []);
		let gameCompleted = false;
		let matchCount = 0;

		function restartGame() {
			// reset match count, and completion flag
			$$invalidate(1, matchCount = 0);

			$$invalidate(0, gameCompleted = false);

			// reset image properties
			images.update(currentTiles => currentTiles.map(tile => ({
				...tile,
				isRevealed: false,
				matched: false
			})));

			//reshuffle images/ tiles
			shuffleIndices();
		}

		function handleGameCompleted() {
			$$invalidate(0, gameCompleted = true);
		}

		//initial randomize
		shuffleIndices();

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameUI> was created with unknown prop '${key}'`);
		});

		const func = () => $$invalidate(0, gameCompleted = false);

		$$self.$capture_state = () => ({
			Modal,
			GameLogic,
			shuffleIndices,
			images,
			gameCompleted,
			matchCount,
			restartGame,
			handleGameCompleted
		});

		$$self.$inject_state = $$props => {
			if ('gameCompleted' in $$props) $$invalidate(0, gameCompleted = $$props.gameCompleted);
			if ('matchCount' in $$props) $$invalidate(1, matchCount = $$props.matchCount);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [gameCompleted, matchCount, restartGame, handleGameCompleted, func];
	}

	class GameUI extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "GameUI",
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src/App.svelte generated by Svelte v4.2.19 */
	const file = "src/App.svelte";

	function create_fragment(ctx) {
		let title;
		let t;
		let main;
		let gameui;
		let current;
		title = new Title({ $$inline: true });
		gameui = new GameUI({ $$inline: true });

		const block = {
			c: function create() {
				create_component(title.$$.fragment);
				t = space();
				main = element("main");
				create_component(gameui.$$.fragment);
				attr_dev(main, "class", "svelte-1yegch1");
				add_location(main, file, 7, 0, 157);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(title, target, anchor);
				insert_dev(target, t, anchor);
				insert_dev(target, main, anchor);
				mount_component(gameui, main, null);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(title.$$.fragment, local);
				transition_in(gameui.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(title.$$.fragment, local);
				transition_out(gameui.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t);
					detach_dev(main);
				}

				destroy_component(title, detaching);
				destroy_component(gameui);
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

		$$self.$capture_state = () => ({ Title, GameUI });
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
