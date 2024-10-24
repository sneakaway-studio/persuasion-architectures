
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
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
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
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
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
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
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
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
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
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
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
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
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
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
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Title.svelte generated by Svelte v3.59.2 */

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
    			h1.textContent = "How Likely Would You be to Join a Cult?";
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
    			if (detaching) detach_dev(div1);
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
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
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
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
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

    /* src\components\ItemList.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\components\\ItemList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (28:2) {#each options as opt (opt.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let label;
    	let img;
    	let img_src_value;
    	let t0;
    	let br;
    	let t1;
    	let input;
    	let input_id_value;
    	let input_checked_value;
    	let t2;
    	let t3_value = /*opt*/ ctx[3].text + "";
    	let t3;
    	let label_for_value;
    	let t4;
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
    			img = element("img");
    			t0 = space();
    			br = element("br");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			if (!src_url_equal(img.src, img_src_value = /*opt*/ ctx[3].img_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "mb-2 svelte-1sxzebm");
    			add_location(img, file$3, 30, 8, 888);
    			add_location(br, file$3, 31, 8, 936);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", input_id_value = `item` + /*opt*/ ctx[3].id);
    			input.checked = input_checked_value = checkedStates[/*opt*/ ctx[3].id] || false;
    			attr_dev(input, "class", "svelte-1sxzebm");
    			add_location(input, file$3, 32, 8, 952);
    			attr_dev(label, "for", label_for_value = `item` + /*opt*/ ctx[3].id);
    			attr_dev(label, "class", "svelte-1sxzebm");
    			add_location(label, file$3, 29, 6, 849);
    			attr_dev(div, "class", "checkbox-item svelte-1sxzebm");
    			add_location(div, file$3, 28, 4, 814);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, img);
    			append_dev(label, t0);
    			append_dev(label, br);
    			append_dev(label, t1);
    			append_dev(label, input);
    			append_dev(label, t2);
    			append_dev(label, t3);
    			append_dev(div, t4);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*options*/ 1 && !src_url_equal(img.src, img_src_value = /*opt*/ ctx[3].img_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*options*/ 1 && input_id_value !== (input_id_value = `item` + /*opt*/ ctx[3].id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*options*/ 1 && input_checked_value !== (input_checked_value = checkedStates[/*opt*/ ctx[3].id] || false)) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*options*/ 1 && t3_value !== (t3_value = /*opt*/ ctx[3].text + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*options*/ 1 && label_for_value !== (label_for_value = `item` + /*opt*/ ctx[3].id)) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(28:2) {#each options as opt (opt.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*options*/ ctx[0];
    	validate_each_argument(each_value);
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

    			attr_dev(div, "class", "grid-container svelte-1sxzebm");
    			add_location(div, file$3, 26, 0, 745);
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
    			if (dirty & /*options, checkedStates, updateCheckedState*/ 3) {
    				each_value = /*options*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

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

    // list items data (12 total)

    const items = {
      category1: [
        {
          text: "You are under 25",
          id:"1",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/4d8cacf28af2/enhanced-buzz-993-1588103233-0.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "You are a perfectionist",
          id:"2",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/a51b300e382c/enhanced-buzz-1518-1588103246-4.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "You have dealt with an anxiety or a mood disorder",
          id:"3",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/a51b300e382c/enhanced-buzz-1522-1588103259-0.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "You have a problematic familial relationship",
          id:"4",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/db28b57bc4fd/enhanced-buzz-973-1588103265-22.jpg?output-format=jpg&output-quality=auto",
        },
      ],
      category2: [
        {
          text: "You blame others for your failures",
          id:"5",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/9b28760df41c/enhanced-buzz-1515-1588103279-8.jpg?output-format=jpg&output-quality=auto",
        },

        {
          text: "You have dealt with an addictive disorder",
          id:"6",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/54fabedce698/enhanced-buzz-994-1588103289-0.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "You have attained high financial success",
          id:"7",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/43a9b3f2fa54/enhanced-buzz-1501-1588103456-0.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "A weaker spiritual background/ upbringing",
          id:"8",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/9b28760df41c/enhanced-buzz-1515-1588103465-27.jpg?output-format=jpg&output-quality=auto",
        },
      ],
      category3: [
        {
          text: "You have high educational attainment",
          id:"9",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/1593bcadc012/enhanced-buzz-1518-1588103476-18.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "People call you open-minded",
          id:"10",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/d195d67ecbe0/enhanced-buzz-1479-1588103561-1.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "You are going through a major life change",
          id:"11",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/a51b300e382c/enhanced-buzz-1535-1588103576-7.jpg?output-format=jpg&output-quality=auto",
        },
        {
          text: "You rarely question authority",
          id:"12",
          img_url:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/36517ba3257e/enhanced-buzz-1597-1588103625-0.jpg?output-format=jpg&output-quality=auto",
        },
      ],
    };

    // result text and image data (3 total)
    const results = [
      {
        id: "1",
        title: "You are an independent thinker!",
        score_min: 0,
        score_max: 33,
        description: "It would be hard to persuade you to change your beliefs.",
        media: {
          image:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/4d8cacf28af2/enhanced-1014-1588103815-5.jpg",
        },
        credit: "TODO",
        credit_url: "TODO",
      },
      {
        id: "2",
        title: "You are easily persuaded.",
        score_min: 34,
        score_max: 67,
        description: "Remember to stick to your gut!",
        media: {
          image:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/54fabedce698/enhanced-1025-1588103823-1.jpg",
        },
        credit: "TODO",
        credit_url: "TODO",
      },
      {
        id: "3",
        title:
          "You could be persuaded to do something you don't feel comfortable with!",
        score_min: 68,
        score_max: 100,
        description: "Stay strong!",
        media: {
          image:
            "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/28/19/enhanced/db28b57bc4fd/enhanced-1009-1588103829-19.jpg",
        },
        credit: "TODO",
        credit_url: "TODO",
      },
    ];

    /* src\components\Results.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\components\\Results.svelte";

    // (31:40) 
    function create_if_block_2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let small;
    	let a;
    	let t1;
    	let t2;
    	let t3_value = results[2].credit + "";
    	let t3;
    	let t4;
    	let h2;
    	let t6;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			small = element("small");
    			a = element("a");
    			t1 = text("Media Credits:");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			h2 = element("h2");
    			h2.textContent = `${results[2].title}`;
    			t6 = space();
    			p = element("p");
    			p.textContent = `${results[2].description}`;
    			if (!src_url_equal(img.src, img_src_value = results[2].media.image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1gqi23h");
    			add_location(img, file$2, 32, 6, 847);
    			attr_dev(a, "href", results[2].credit_url);
    			add_location(a, file$2, 35, 8, 932);
    			set_style(small, "clear", "right");
    			add_location(small, file$2, 34, 6, 893);
    			attr_dev(div, "class", "wrap");
    			add_location(div, file$2, 31, 4, 821);
    			attr_dev(h2, "class", "svelte-1gqi23h");
    			add_location(h2, file$2, 40, 4, 1047);
    			attr_dev(p, "class", "svelte-1gqi23h");
    			add_location(p, file$2, 41, 4, 1080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, small);
    			append_dev(small, a);
    			append_dev(a, t1);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(31:40) ",
    		ctx
    	});

    	return block;
    }

    // (19:39) 
    function create_if_block_1$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let small;
    	let a;
    	let t1;
    	let t2;
    	let t3_value = results[1].credit + "";
    	let t3;
    	let t4;
    	let h2;
    	let t6;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			small = element("small");
    			a = element("a");
    			t1 = text("Media Credits:");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			h2 = element("h2");
    			h2.textContent = `${results[1].title}`;
    			t6 = space();
    			p = element("p");
    			p.textContent = `${results[1].description}`;
    			if (!src_url_equal(img.src, img_src_value = results[1].media.image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1gqi23h");
    			add_location(img, file$2, 20, 6, 509);
    			attr_dev(a, "href", results[1].credit_url);
    			add_location(a, file$2, 23, 8, 594);
    			set_style(small, "clear", "right");
    			add_location(small, file$2, 22, 6, 555);
    			attr_dev(div, "class", "wrap");
    			add_location(div, file$2, 19, 4, 483);
    			attr_dev(h2, "class", "svelte-1gqi23h");
    			add_location(h2, file$2, 28, 4, 709);
    			attr_dev(p, "class", "svelte-1gqi23h");
    			add_location(p, file$2, 29, 4, 742);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, small);
    			append_dev(small, a);
    			append_dev(a, t1);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(19:39) ",
    		ctx
    	});

    	return block;
    }

    // (7:2) {#if $count >= 0 && $count <= 4}
    function create_if_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let small;
    	let a;
    	let t1;
    	let t2;
    	let t3_value = results[0].credit + "";
    	let t3;
    	let t4;
    	let h2;
    	let t6;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			small = element("small");
    			a = element("a");
    			t1 = text("Media Credits:");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			h2 = element("h2");
    			h2.textContent = `${results[0].title}`;
    			t6 = space();
    			p = element("p");
    			p.textContent = `${results[0].description}`;
    			if (!src_url_equal(img.src, img_src_value = results[0].media.image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1gqi23h");
    			add_location(img, file$2, 8, 6, 172);
    			attr_dev(a, "href", results[0].credit_url);
    			add_location(a, file$2, 11, 8, 257);
    			set_style(small, "clear", "right");
    			add_location(small, file$2, 10, 6, 218);
    			attr_dev(div, "class", "wrap");
    			add_location(div, file$2, 7, 4, 146);
    			attr_dev(h2, "class", "svelte-1gqi23h");
    			add_location(h2, file$2, 16, 4, 372);
    			attr_dev(p, "class", "svelte-1gqi23h");
    			add_location(p, file$2, 17, 4, 405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, small);
    			append_dev(small, a);
    			append_dev(a, t1);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(7:2) {#if $count >= 0 && $count <= 4}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*$count*/ ctx[0] >= 0 && /*$count*/ ctx[0] <= 4) return create_if_block$1;
    		if (/*$count*/ ctx[0] >= 5 && /*$count*/ ctx[0] <= 8) return create_if_block_1$1;
    		if (/*$count*/ ctx[0] >= 9 && /*$count*/ ctx[0] <= 12) return create_if_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$2, 5, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
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
    			if (detaching) detach_dev(div);

    			if (if_block) {
    				if_block.d();
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
    	component_subscribe($$self, count, $$value => $$invalidate(0, $count = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Results', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Results> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ count, results, $count });
    	return [$count];
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

    /* src\components\Carousel.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\components\\Carousel.svelte";

    // (82:10) {#if submitState}
    function create_if_block_1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-target", "#carouselExampleCaptions");
    			attr_dev(button, "data-bs-slide-to", "3");
    			attr_dev(button, "aria-label", "Slide 4");
    			add_location(button, file$1, 82, 12, 2684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(82:10) {#if submitState}",
    		ctx
    	});

    	return block;
    }

    // (112:10) {#if submitState}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let h5;
    	let t1;
    	let results;
    	let current;
    	results = new Results({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Your Result is...";
    			t1 = space();
    			create_component(results.$$.fragment);
    			add_location(h5, file$1, 114, 16, 3699);
    			attr_dev(div0, "class", "carousel-captions svelte-jty5i7");
    			add_location(div0, file$1, 113, 14, 3650);
    			attr_dev(div1, "class", "carousel-item");
    			add_location(div1, file$1, 112, 12, 3607);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			append_dev(div1, t1);
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
    			if (detaching) detach_dev(div1);
    			destroy_component(results);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(112:10) {#if submitState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div9;
    	let div8;
    	let div7;
    	let div6;
    	let div0;
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let button2;
    	let t2;
    	let t3;
    	let div5;
    	let div1;
    	let itemlist0;
    	let t4;
    	let div2;
    	let itemlist1;
    	let t5;
    	let div4;
    	let itemlist2;
    	let t6;
    	let div3;
    	let button3;
    	let t8;
    	let t9;
    	let button4;
    	let span0;
    	let t10;
    	let span1;
    	let t12;
    	let button5;
    	let span2;
    	let t13;
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

    	let if_block1 = /*submitState*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			t1 = space();
    			button2 = element("button");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div5 = element("div");
    			div1 = element("div");
    			create_component(itemlist0.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			create_component(itemlist1.$$.fragment);
    			t5 = space();
    			div4 = element("div");
    			create_component(itemlist2.$$.fragment);
    			t6 = space();
    			div3 = element("div");
    			button3 = element("button");
    			button3.textContent = "Submit";
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			button4 = element("button");
    			span0 = element("span");
    			t10 = space();
    			span1 = element("span");
    			span1.textContent = "Previous";
    			t12 = space();
    			button5 = element("button");
    			span2 = element("span");
    			t13 = space();
    			span3 = element("span");
    			span3.textContent = "Next";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-target", "#carouselExampleCaptions");
    			attr_dev(button0, "data-bs-slide-to", "0");
    			attr_dev(button0, "class", "active");
    			attr_dev(button0, "aria-current", "true");
    			attr_dev(button0, "aria-label", "Slide 1");
    			add_location(button0, file$1, 57, 10, 1962);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-bs-target", "#carouselExampleCaptions");
    			attr_dev(button1, "data-bs-slide-to", "1");
    			attr_dev(button1, "aria-label", "Slide 2");
    			add_location(button1, file$1, 66, 10, 2216);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "data-bs-target", "#carouselExampleCaptions");
    			attr_dev(button2, "data-bs-slide-to", "2");
    			attr_dev(button2, "aria-label", "Slide 3");
    			add_location(button2, file$1, 73, 10, 2409);
    			attr_dev(div0, "class", "carousel-indicators");
    			add_location(div0, file$1, 56, 8, 1917);
    			attr_dev(div1, "class", "carousel-item active");
    			add_location(div1, file$1, 92, 10, 2958);
    			attr_dev(div2, "class", "carousel-item");
    			add_location(div2, file$1, 96, 10, 3076);
    			attr_dev(button3, "class", "btn btn-primary btn-lg mt-3");
    			add_location(button3, file$1, 103, 14, 3336);
    			attr_dev(div3, "class", "d-grid gap-2 col-4 mx-auto");
    			add_location(div3, file$1, 102, 12, 3280);
    			attr_dev(div4, "class", "carousel-item");
    			add_location(div4, file$1, 100, 10, 3187);
    			attr_dev(div5, "class", "carousel-inner");
    			add_location(div5, file$1, 91, 8, 2918);
    			attr_dev(span0, "class", "carousel-control-prev-icon");
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$1, 128, 10, 4066);
    			attr_dev(span1, "class", "visually-hidden");
    			add_location(span1, file$1, 129, 10, 4145);
    			attr_dev(button4, "class", "carousel-control-prev svelte-jty5i7");
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "data-bs-target", "#carouselExampleCaptions");
    			attr_dev(button4, "data-bs-slide", "prev");
    			add_location(button4, file$1, 122, 8, 3885);
    			attr_dev(span2, "class", "carousel-control-next-icon");
    			attr_dev(span2, "aria-hidden", "true");
    			add_location(span2, file$1, 139, 10, 4444);
    			attr_dev(span3, "class", "visually-hidden");
    			add_location(span3, file$1, 140, 10, 4523);
    			attr_dev(button5, "class", "carousel-control-next svelte-jty5i7");
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "data-bs-target", "#carouselExampleCaptions");
    			attr_dev(button5, "data-bs-slide", "next");
    			add_location(button5, file$1, 133, 8, 4263);
    			attr_dev(div6, "id", "carouselExampleCaptions");
    			attr_dev(div6, "class", "carousel slide pb-5");
    			add_location(div6, file$1, 55, 6, 1845);
    			attr_dev(div7, "class", "col-12 col-md-12 col-lg-8");
    			add_location(div7, file$1, 54, 4, 1798);
    			attr_dev(div8, "class", "row justify-content-center");
    			add_location(div8, file$1, 53, 2, 1752);
    			attr_dev(div9, "class", "container text-left");
    			add_location(div9, file$1, 52, 0, 1715);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t0);
    			append_dev(div0, button1);
    			append_dev(div0, t1);
    			append_dev(div0, button2);
    			append_dev(div0, t2);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div1);
    			mount_component(itemlist0, div1, null);
    			append_dev(div5, t4);
    			append_dev(div5, div2);
    			mount_component(itemlist1, div2, null);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			mount_component(itemlist2, div4, null);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, button3);
    			append_dev(div5, t8);
    			if (if_block1) if_block1.m(div5, null);
    			append_dev(div6, t9);
    			append_dev(div6, button4);
    			append_dev(button4, span0);
    			append_dev(button4, t10);
    			append_dev(button4, span1);
    			append_dev(div6, t12);
    			append_dev(div6, button5);
    			append_dev(button5, span2);
    			append_dev(button5, t13);
    			append_dev(button5, span3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button3, "click", /*handleSubmit*/ ctx[1], false, false, false, false);
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
    					if_block1.m(div5, null);
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
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemlist0.$$.fragment, local);
    			transition_out(itemlist1.$$.fragment, local);
    			transition_out(itemlist2.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (if_block0) if_block0.d();
    			destroy_component(itemlist0);
    			destroy_component(itemlist1);
    			destroy_component(itemlist2);
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
    		const carouselElement = document.getElementById("carouselExampleCaptions");

    		carouselElement.addEventListener("slid.bs.carousel", updateArrows);
    	});

    	function handleSubmit() {
    		// dispatch("submit"); // pass event details to app.svelte
    		$$invalidate(0, submitState = true);
    	}

    	// trigger results slide when submitState changes
    	afterUpdate(() => {
    		if (submitState) {
    			const carousel = new bootstrap.Carousel(document.getElementById("carouselExampleCaptions"));
    			carousel.to(3);
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

    /* src\App.svelte generated by Svelte v3.59.2 */
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
    			attr_dev(h4, "class", "svelte-1uknuvc");
    			add_location(h4, file, 12, 6, 287);
    			attr_dev(div0, "class", "row");
    			add_location(div0, file, 11, 4, 262);
    			attr_dev(div1, "class", "container d-none d-md-block text-center");
    			add_location(div1, file, 10, 2, 203);
    			attr_dev(main, "class", "svelte-1uknuvc");
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
    			destroy_component(title, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
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