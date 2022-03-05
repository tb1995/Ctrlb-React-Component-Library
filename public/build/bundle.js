
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
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
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
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
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
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
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
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
            ctx: null,
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
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

    /* src/Components/Hero-Fullscreen.svelte generated by Svelte v3.46.4 */

    const file$k = "src/Components/Hero-Fullscreen.svelte";

    function create_fragment$l(ctx) {
    	let div1;
    	let div0;
    	let h1_1;
    	let t1;
    	let p_1;
    	let t3;
    	let a;
    	let t4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1_1 = element("h1");
    			h1_1.textContent = `${h1}`;
    			t1 = space();
    			p_1 = element("p");
    			p_1.textContent = `${p}`;
    			t3 = space();
    			a = element("a");
    			t4 = text(ctaText);
    			attr_dev(h1_1, "class", "hero-heading svelte-1n5p4xo");
    			add_location(h1_1, file$k, 11, 4, 266);
    			attr_dev(p_1, "class", "hero-para svelte-1n5p4xo");
    			add_location(p_1, file$k, 12, 4, 305);
    			attr_dev(a, "href", ctaUrl);
    			attr_dev(a, "class", "hero-cta svelte-1n5p4xo");
    			add_location(a, file$k, 13, 4, 338);
    			attr_dev(div0, "class", "text-container svelte-1n5p4xo");
    			add_location(div0, file$k, 10, 4, 233);
    			attr_dev(div1, "class", "hero-1-container svelte-1n5p4xo");
    			add_location(div1, file$k, 8, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1_1);
    			append_dev(div0, t1);
    			append_dev(div0, p_1);
    			append_dev(div0, t3);
    			append_dev(div0, a);
    			append_dev(a, t4);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const h1 = "Bakery. Breakfast. Lunch. Perfection.";
    const p = "Reinvented Pakistani and Indian flavors in a beautiful ambiance.";
    const ctaText = "Order Now";
    const ctaUrl = "#";

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero_Fullscreen', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero_Fullscreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ h1, p, ctaText, ctaUrl });
    	return [];
    }

    class Hero_Fullscreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero_Fullscreen",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/Widgets/Buttons/Rectangular-Button.svelte generated by Svelte v3.46.4 */

    const file$j = "src/Widgets/Buttons/Rectangular-Button.svelte";

    function create_fragment$k(ctx) {
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*buttonText*/ ctx[0]);
    			attr_dev(a, "href", /*buttonUrl*/ ctx[1]);
    			attr_dev(a, "class", "hero-cta svelte-9uvq8i");
    			add_location(a, file$j, 5, 4, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*buttonText*/ 1) set_data_dev(t, /*buttonText*/ ctx[0]);

    			if (dirty & /*buttonUrl*/ 2) {
    				attr_dev(a, "href", /*buttonUrl*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Rectangular_Button', slots, []);
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	const writable_props = ['buttonText', 'buttonUrl'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Rectangular_Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    	};

    	$$self.$capture_state = () => ({ buttonText, buttonUrl });

    	$$self.$inject_state = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonText, buttonUrl];
    }

    class Rectangular_Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { buttonText: 0, buttonUrl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rectangular_Button",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*buttonText*/ ctx[0] === undefined && !('buttonText' in props)) {
    			console.warn("<Rectangular_Button> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[1] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Rectangular_Button> was created without expected prop 'buttonUrl'");
    		}
    	}

    	get buttonText() {
    		throw new Error("<Rectangular_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Rectangular_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Rectangular_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Rectangular_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Hero-Halfscreen.svelte generated by Svelte v3.46.4 */
    const file$i = "src/Components/Hero-Halfscreen.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let rectangularbutton;
    	let current;

    	rectangularbutton = new Rectangular_Button({
    			props: {
    				buttonText: /*buttonText*/ ctx[2],
    				buttonUrl: /*buttonUrl*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*subheading*/ ctx[1]);
    			t3 = space();
    			create_component(rectangularbutton.$$.fragment);
    			attr_dev(h1, "class", "hero-heading svelte-yfo6rw");
    			add_location(h1, file$i, 13, 4, 221);
    			attr_dev(p, "class", "hero-subtext svelte-yfo6rw");
    			add_location(p, file$i, 14, 4, 263);
    			attr_dev(div, "class", "hero-container svelte-yfo6rw");
    			add_location(div, file$i, 12, 0, 188);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    			mount_component(rectangularbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*subheading*/ 2) set_data_dev(t2, /*subheading*/ ctx[1]);
    			const rectangularbutton_changes = {};
    			if (dirty & /*buttonText*/ 4) rectangularbutton_changes.buttonText = /*buttonText*/ ctx[2];
    			if (dirty & /*buttonUrl*/ 8) rectangularbutton_changes.buttonUrl = /*buttonUrl*/ ctx[3];
    			rectangularbutton.$set(rectangularbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rectangularbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rectangularbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rectangularbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero_Halfscreen', slots, []);
    	let { title } = $$props;
    	let { subheading } = $$props;
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	const writable_props = ['title', 'subheading', 'buttonText', 'buttonUrl'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero_Halfscreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('subheading' in $$props) $$invalidate(1, subheading = $$props.subheading);
    		if ('buttonText' in $$props) $$invalidate(2, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(3, buttonUrl = $$props.buttonUrl);
    	};

    	$$self.$capture_state = () => ({
    		RectangularButton: Rectangular_Button,
    		title,
    		subheading,
    		buttonText,
    		buttonUrl
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('subheading' in $$props) $$invalidate(1, subheading = $$props.subheading);
    		if ('buttonText' in $$props) $$invalidate(2, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(3, buttonUrl = $$props.buttonUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, subheading, buttonText, buttonUrl];
    }

    class Hero_Halfscreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			title: 0,
    			subheading: 1,
    			buttonText: 2,
    			buttonUrl: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero_Halfscreen",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Hero_Halfscreen> was created without expected prop 'title'");
    		}

    		if (/*subheading*/ ctx[1] === undefined && !('subheading' in props)) {
    			console.warn("<Hero_Halfscreen> was created without expected prop 'subheading'");
    		}

    		if (/*buttonText*/ ctx[2] === undefined && !('buttonText' in props)) {
    			console.warn("<Hero_Halfscreen> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[3] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Hero_Halfscreen> was created without expected prop 'buttonUrl'");
    		}
    	}

    	get title() {
    		throw new Error("<Hero_Halfscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Hero_Halfscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subheading() {
    		throw new Error("<Hero_Halfscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subheading(value) {
    		throw new Error("<Hero_Halfscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonText() {
    		throw new Error("<Hero_Halfscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Hero_Halfscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Hero_Halfscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Hero_Halfscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
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
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules/svelte-navigator/src/Router.svelte generated by Svelte v3.46.4 */

    const file$h = "node_modules/svelte-navigator/src/Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$h, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$h, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
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
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$i($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$i,
    			create_fragment$i,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules/svelte-navigator/src/Route.svelte generated by Svelte v3.46.4 */
    const file$g = "node_modules/svelte-navigator/src/Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$2(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
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
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$g, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$g, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$h($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules/svelte-navigator/src/Link.svelte generated by Svelte v3.46.4 */
    const file$f = "node_modules/svelte-navigator/src/Link.svelte";

    function create_fragment$g(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$f, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
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
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    const imgDirectory$1 = "/img/component-images/";

    		let masterComponentArray = [
    		{
    		label: "Heroes",
    		list: [
    				{
    					title: "Hero Fullscreen",
    					description: "Hero with 100vh and with a CTA",
    					url: "/Heroes/Fullscreen",
    					imgUrl: imgDirectory$1 + "hero-fullscreen.png",
    					dependencies: [],
    					listOfProps: []
                    },
                    {
    					title: "Hero Halfscreen",
    					description: "Hero with 50vh and with a CTA",
    					url: "/Heroes/Halfscreen",
    					imgUrl: imgDirectory$1 + "hero-halfscreen.png",
    					dependencies: [],
    					listOfProps: []
    				}
    			],
    		},
    		{
    		label: "Grids",
    		list: [
    			{
    				title: "Responsive Grid",
    				description: "Specify the number of columns and item width via the props",
    				url: "/Grids/Responsive",
    				imgUrl: imgDirectory$1 + "responsive-grid.png",
    				dependencies: [],
    				listOfProps: []
    			},
    			{
    				title: "Responsive Grid More Info",
    				description: "Specify the number of columns and item width via the props",
    				url: "/Grids/Responsive-Info",
    				imgUrl: imgDirectory$1 + "responsive-grid.png",
    				dependencies: [],
    				listOfProps: []
    			},
    			{
    				title: "Responsive Grid Icons",
    				description: "Specify the number of columns and item width via the props, uses fixed icon size",
    				url: "/Grids/Responsive-Info-Icons",
    				imgUrl: imgDirectory$1 + "responsive-grid.png",
    				dependencies: [],
    				listOfProps: []
    			}
    		],
            },
            {
                label: "Info Sections",
                list: [
                    {
                        title: "Info section 1",
                        description: "image on the left, text block and btn on the right",
                        url: "/Info/1",
                        imgUrl: imgDirectory$1 + "info-1.png",
                        dependencies: [],
                        listOfProps: []
    				},
    				 {
                        title: "Info section 1 Alternate",
                        description: "Has tiny text and different styled button",
                        url: "/Info/1-Alt",
                        imgUrl: imgDirectory$1 + "info-1.png",
                        dependencies: [],
                        listOfProps: []
    				},
    				 {
                        title: "Info section 1 Laterally Reversed",
                        description: "Has tiny text and different styled button, but the orders are switched around",
                        url: "/Info/1-Reversed",
                        imgUrl: imgDirectory$1 + "info-1.png",
                        dependencies: [],
                        listOfProps: []
    				},
    				 {
                        title: "Info section 2x2 Grids",
                        description: "Has tiny text and different styled button, with 2x2 Grid",
                        url: "/Info/Grids",
                        imgUrl: imgDirectory$1 + "info-1.png",
                        dependencies: [],
                        listOfProps: []
                    }
                ]
    		},
    		{
                label: "Tabs",
                list: [
                    {
                        title: "Centered Tabs",
                        description: "Tabs",
                        url: "/Tabs/Centered",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
                    }
                ]
    		},
    		{
    		label: "Navbars",
    		list: [
                    {
                        title: "Top Traditional",
                        description: "Top traditional",
                        url: "/Navbar/Traditional",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
                    }
                ]
    		},
    		{
    		label: "Footers",
    		list: [
                    {
                        title: "Four Column Footer",
                        description: "Four Column Footer",
                        url: "/Footers/Column-4",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
                    }
                ]
    		},
    		{
    		label: "Banners",
    		list: [
                    {
                        title: "Only Button",
                        description: "Contains only a singular button",
                        url: "/Banners/OnlyButton",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
    				},
    				{
                        title: "Paragraph and Button",
                        description: "Contains a paragraph and a button",
                        url: "/Banners/Paragraph-Button",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
                    }
                ]
            }

    	];
    	
    	let navbarArray = [
    		{
    			label: "About",
    			url: ""
    		},
    		{
    			label: "Locations",
    			url: ""
    		},
    		{
    			label: "Private Dining",
    			url: ""
    		},
    		{
    			label: "Galleries",
    			url: ""
    		},
    		{
    			label: "Menus",
    			url: ""
    		},
    		{
    			label: "Contact",
    			url: ""
    		},
    	];

    	let iconList = [
    		{
    			label: "090078601",
    			iconUrl: "/img/logo.png",
    			iconAlt: ""

    		},
    		{
    			label: "holmes@consultingdetective.com",
    			iconUrl: "/img/logo.png",
    			iconAlt: ""
    		},
    		{
    			label: "22B Baker Street, ",
    			iconUrl: "/img/logo.png",
    			iconAlt: ""
    		},
    	];


    	let responsiveListMoreInfoList =  [
    				{
    					title: "Hero Fullscreen",
    					description: "Hero with 100vh and with a CTA",
    					url: "",
    					imgUrl: imgDirectory$1 + "hero-fullscreen.png",
    					buttonText: "Go to Hero Fullscreen",
    					buttonUrl: "#",
    					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    },
                    {
    					title: "Hero Fullscreen 2",
    					description: "Hero with 100vh and with a CTA",
    					url: "",
    					imgUrl: imgDirectory$1 + "hero-fullscreen.png",
    					buttonText: "Go to Hero Fullscreen 2",
    					buttonUrl: "#",
    					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    				},
    				
    			];

    	let responsiveListIconList =  [
    				{
    					title: "Hero Fullscreen",
    					description: "Hero with 100vh and with a CTA",
    					url: "",
    					imgUrl: "/img/logo.png",
    					buttonText: "Go to Hero Fullscreen",
    					buttonUrl: "#",
    					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    },
                    {
    					title: "Hero Fullscreen 2",
    					description: "Hero with 100vh and with a CTA",
    					url: "",
    					imgUrl: "/img/logo.png",
    					buttonText: "Go to Hero Fullscreen 2",
    					buttonUrl: "#",
    					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    				},
    				{
    					title: "Hero Fullscreen 3",
    					description: "Hero with 100vh and with a CTA",
    					url: "",
    					imgUrl: "/img/logo.png",
    					buttonText: "Go to Hero Fullscreen 3",
    					buttonUrl: "#",
    					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    				},
    				
    			];

    	let fourGrids = [
    		{
    			heading: "I am a fact",
    			paragraph: "Lorem ipsum dolor sit amet"
    		},
    		{
    			heading: "I am a fact",
    			paragraph: "Lorem ipsum dolor sit amet"
    		},
    		{
    			heading: "I am a fact",
    			paragraph: "Lorem ipsum dolor sit amet"
    		},
    		{
    			heading: "I am a fact",
    			paragraph: "Lorem ipsum dolor sit amet"
    		},
    	];

    /* src/Components/Info-1.svelte generated by Svelte v3.46.4 */

    const file$e = "src/Components/Info-1.svelte";

    function create_fragment$f(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h2;
    	let t2;
    	let p;
    	let t4;
    	let a;
    	let t5;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = `${infoHeading}`;
    			t2 = space();
    			p = element("p");
    			p.textContent = `${infoPara}`;
    			t4 = space();
    			a = element("a");
    			t5 = text(infoCtaText);
    			if (!src_url_equal(img.src, img_src_value = infoImageUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "info-img");
    			add_location(img, file$e, 11, 4, 543);
    			attr_dev(div0, "class", "img-container svelte-3fpbm4");
    			add_location(div0, file$e, 10, 0, 511);
    			attr_dev(h2, "class", "info-heading svelte-3fpbm4");
    			add_location(h2, file$e, 14, 8, 647);
    			attr_dev(p, "class", "info-para svelte-3fpbm4");
    			add_location(p, file$e, 15, 4, 695);
    			attr_dev(a, "href", infoCtaUrl);
    			attr_dev(a, "class", "info-cta btn-style svelte-3fpbm4");
    			add_location(a, file$e, 16, 4, 735);
    			attr_dev(div1, "class", "info-text-container svelte-3fpbm4");
    			add_location(div1, file$e, 13, 4, 605);
    			attr_dev(div2, "class", "info-container svelte-3fpbm4");
    			add_location(div2, file$e, 9, 0, 482);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(div1, t4);
    			append_dev(div1, a);
    			append_dev(a, t5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const infoHeading = "So much more than just a cafe";
    const infoPara = "Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following.";
    const infoCtaText = "About Us";
    const infoCtaUrl = "#";
    const infoImageUrl = "/img/icon.jpg";

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info_1', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info_1> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		infoHeading,
    		infoPara,
    		infoCtaText,
    		infoCtaUrl,
    		infoImageUrl
    	});

    	return [];
    }

    class Info_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_1",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/Components/Tabs-Spaced/Tab.svelte generated by Svelte v3.46.4 */
    const file$d = "src/Components/Tabs-Spaced/Tab.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:4) {#each componentArray as item}
    function create_each_block$7(ctx) {
    	let li;
    	let div;
    	let t0_value = /*item*/ ctx[4].label + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*item*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "svelte-1btoajm");
    			toggle_class(div, "active", /*item*/ ctx[4].label === /*activeItem*/ ctx[1]);
    			add_location(div, file$d, 14, 8, 309);
    			attr_dev(li, "class", "svelte-1btoajm");
    			add_location(li, file$d, 13, 4, 243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*componentArray*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*componentArray, activeItem*/ 3) {
    				toggle_class(div, "active", /*item*/ ctx[4].label === /*activeItem*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(13:4) {#each componentArray as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let ul;
    	let each_value = /*componentArray*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1btoajm");
    			add_location(ul, file$d, 11, 0, 199);
    			attr_dev(div, "class", "tabs svelte-1btoajm");
    			add_location(div, file$d, 10, 0, 180);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, componentArray, activeItem*/ 7) {
    				each_value = /*componentArray*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, []);
    	const dispatch = createEventDispatcher();
    	let { componentArray } = $$props;
    	let { activeItem } = $$props;
    	const writable_props = ['componentArray', 'activeItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => dispatch('tabChange', item.label);

    	$$self.$$set = $$props => {
    		if ('componentArray' in $$props) $$invalidate(0, componentArray = $$props.componentArray);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		componentArray,
    		activeItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('componentArray' in $$props) $$invalidate(0, componentArray = $$props.componentArray);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [componentArray, activeItem, dispatch, click_handler];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { componentArray: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*componentArray*/ ctx[0] === undefined && !('componentArray' in props)) {
    			console.warn("<Tab> was created without expected prop 'componentArray'");
    		}

    		if (/*activeItem*/ ctx[1] === undefined && !('activeItem' in props)) {
    			console.warn("<Tab> was created without expected prop 'activeItem'");
    		}
    	}

    	get componentArray() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set componentArray(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItem() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItem(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Product-Grid/Responsive-Grid.svelte generated by Svelte v3.46.4 */

    const { console: console_1$3 } = globals;
    const file$c = "src/Components/Product-Grid/Responsive-Grid.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (75:12) <Link to="{obj.url}">
    function create_default_slot_1$3(ctx) {
    	let p;
    	let t_value = /*obj*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "title svelte-i7vgvc");
    			add_location(p, file$c, 74, 34, 1870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array*/ 1 && t_value !== (t_value = /*obj*/ ctx[6].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(75:12) <Link to=\\\"{obj.url}\\\">",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#each array as obj}
    function create_each_block$6(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let link;
    	let t1;
    	let div1_class_value;
    	let current;

    	link = new Link$1({
    			props: {
    				to: /*obj*/ ctx[6].url,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space();
    			if (!src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "obj-img svelte-i7vgvc");
    			set_style(img, "width", /*gridWidth*/ ctx[1]);
    			set_style(img, "height", /*gridWidth*/ ctx[1]);
    			add_location(img, file$c, 70, 8, 1670);
    			attr_dev(div0, "class", "text-container svelte-i7vgvc");
    			set_style(div0, "width", /*gridWidth*/ ctx[1]);
    			add_location(div0, file$c, 72, 12, 1779);

    			attr_dev(div1, "class", div1_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-i7vgvc");

    			set_style(div1, "flex", "0 1 " + /*flexWidth*/ ctx[2]);
    			add_location(div1, file$c, 68, 8, 1553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(link, div0, null);
    			append_dev(div1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*array*/ 1 && !src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(img, "width", /*gridWidth*/ ctx[1]);
    			}

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(img, "height", /*gridWidth*/ ctx[1]);
    			}

    			const link_changes = {};
    			if (dirty & /*array*/ 1) link_changes.to = /*obj*/ ctx[6].url;

    			if (dirty & /*$$scope, array*/ 513) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(div0, "width", /*gridWidth*/ ctx[1]);
    			}

    			if (!current || dirty & /*array*/ 1 && div1_class_value !== (div1_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-i7vgvc")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(67:4) {#each array as obj}",
    		ctx
    	});

    	return block;
    }

    // (65:0) <Router>
    function create_default_slot$3(ctx) {
    	let div;
    	let current;
    	let each_value = /*array*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid-container svelte-i7vgvc");
    			set_style(div, "width", /*gridWidth*/ ctx[1]);
    			add_location(div, file$c, 65, 0, 1459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array, flexWidth, gridWidth*/ 7) {
    				each_value = /*array*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(div, "width", /*gridWidth*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(65:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, gridWidth, array*/ 515) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Responsive_Grid', slots, []);

    	const tabChange = e => {
    		activeItem = e.detail;
    	};

    	let { array } = $$props;
    	let { numberOfColumns } = $$props;
    	let { objWidth } = $$props;
    	let { gridWidth } = $$props;
    	numberOfColumns += 1;
    	let flexWidth = 100 / numberOfColumns + "%";

    	//         if(array.length % 4 === 2) {
    	//             console.log("Here");
    	//     array.push({
    	//         title: "ThisIsInvisible123",
    	//         imgUrl: "/img/icon.jpg",
    	//         invisible: true
    	//     })
    	//     console.log("Array length: " + array.length)
    	// } else if(array.length % 3 === 1) {
    	//     for(let i=0; i<2; i++) {
    	//         console.log("Here " + i);
    	//         array.push({
    	//         title: "ThisIsInvisible123",
    	//         imgUrl: "/img/icon.jpg",
    	//         invisible: true
    	//     })
    	//     }
    	// }
    	beforeUpdate(() => {
    		let remainder = array.length % numberOfColumns;

    		for (let i = 0; i < numberOfColumns - remainder; i++) {
    			console.log("Here " + i);

    			array.push({
    				title: "ThisIsInvisible123",
    				invisible: true,
    				url: ""
    			});
    		}
    	});

    	const writable_props = ['array', 'numberOfColumns', 'objWidth', 'gridWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Responsive_Grid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('array' in $$props) $$invalidate(0, array = $$props.array);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		HeroHalfscreen: Hero_Halfscreen,
    		HeroFullscreen: Hero_Fullscreen,
    		masterComponentArray,
    		Info_1,
    		Tab,
    		tabChange,
    		array,
    		numberOfColumns,
    		objWidth,
    		gridWidth,
    		flexWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('array' in $$props) $$invalidate(0, array = $$props.array);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('flexWidth' in $$props) $$invalidate(2, flexWidth = $$props.flexWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [array, gridWidth, flexWidth, numberOfColumns, objWidth];
    }

    class Responsive_Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			array: 0,
    			numberOfColumns: 3,
    			objWidth: 4,
    			gridWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Responsive_Grid",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*array*/ ctx[0] === undefined && !('array' in props)) {
    			console_1$3.warn("<Responsive_Grid> was created without expected prop 'array'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$3.warn("<Responsive_Grid> was created without expected prop 'numberOfColumns'");
    		}

    		if (/*objWidth*/ ctx[4] === undefined && !('objWidth' in props)) {
    			console_1$3.warn("<Responsive_Grid> was created without expected prop 'objWidth'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$3.warn("<Responsive_Grid> was created without expected prop 'gridWidth'");
    		}
    	}

    	get array() {
    		throw new Error("<Responsive_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set array(value) {
    		throw new Error("<Responsive_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfColumns() {
    		throw new Error("<Responsive_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfColumns(value) {
    		throw new Error("<Responsive_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get objWidth() {
    		throw new Error("<Responsive_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set objWidth(value) {
    		throw new Error("<Responsive_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridWidth() {
    		throw new Error("<Responsive_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridWidth(value) {
    		throw new Error("<Responsive_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Library.svelte generated by Svelte v3.46.4 */

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (27:0) {#if activeItem === item.label}
    function create_if_block$1(ctx) {
    	let responsivegrid;
    	let current;

    	responsivegrid = new Responsive_Grid({
    			props: {
    				array: /*item*/ ctx[3].list,
    				numberOfColumns: 2,
    				objWidth: "200px",
    				gridWidth: "100%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivegrid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivegrid, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivegrid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(27:0) {#if activeItem === item.label}",
    		ctx
    	});

    	return block;
    }

    // (24:0) {#each componentArray as item}
    function create_each_block$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*activeItem*/ ctx[0] === /*item*/ ctx[3].label && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*activeItem*/ ctx[0] === /*item*/ ctx[3].label) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*activeItem*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
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
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(24:0) {#each componentArray as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let tab;
    	let t;
    	let each_1_anchor;
    	let current;

    	tab = new Tab({
    			props: {
    				componentArray: /*componentArray*/ ctx[2],
    				activeItem: /*activeItem*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tab.$on("tabChange", /*tabChange*/ ctx[1]);
    	let each_value = /*componentArray*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tab_changes = {};
    			if (dirty & /*activeItem*/ 1) tab_changes.activeItem = /*activeItem*/ ctx[0];
    			tab.$set(tab_changes);

    			if (dirty & /*componentArray, activeItem*/ 5) {
    				each_value = /*componentArray*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const imgDirectory = "/img/component-images/";

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Library', slots, []);
    	let activeItem = "Heroes";

    	const tabChange = e => {
    		$$invalidate(0, activeItem = e.detail);
    	};

    	let componentArray = masterComponentArray;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Library> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ResponsiveGrid: Responsive_Grid,
    		Tab,
    		masterComponentArray,
    		imgDirectory,
    		activeItem,
    		tabChange,
    		componentArray
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
    		if ('componentArray' in $$props) $$invalidate(2, componentArray = $$props.componentArray);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeItem, tabChange, componentArray];
    }

    class Library extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Library",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Components/Navbar-Traditional.svelte/navbar.svelte generated by Svelte v3.46.4 */
    const file$b = "src/Components/Navbar-Traditional.svelte/navbar.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (18:8) {#each navbarArray as navItem, index}
    function create_each_block$4(ctx) {
    	let li;
    	let a;
    	let t0_value = /*navItem*/ ctx[2].label + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", /*navItem*/ ctx[2].url);
    			attr_dev(a, "class", "svelte-1qvp7bk");
    			add_location(a, file$b, 19, 16, 509);
    			set_style(li, "animation", "navlinkFade 1.5s ease forwards " + (/*index*/ ctx[4] / 7 + 2.8) + "s");
    			attr_dev(li, "class", "svelte-1qvp7bk");
    			add_location(li, file$b, 18, 4, 419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(18:8) {#each navbarArray as navItem, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let nav;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let ul;
    	let ul_class_value;
    	let t1;
    	let div4;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let mounted;
    	let dispose;
    	let each_value = navbarArray;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			attr_dev(img, "class", "logo svelte-1qvp7bk");
    			if (!src_url_equal(img.src, img_src_value = logoUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", logoAlt);
    			add_location(img, file$b, 14, 4, 249);
    			attr_dev(div0, "class", "logo svelte-1qvp7bk");
    			add_location(div0, file$b, 13, 4, 226);
    			attr_dev(ul, "class", ul_class_value = "nav-links " + (/*isActive*/ ctx[0] ? 'nav-active' : '') + " svelte-1qvp7bk");
    			add_location(ul, file$b, 16, 4, 315);
    			attr_dev(div1, "class", " svelte-1qvp7bk");
    			add_location(div1, file$b, 24, 8, 649);
    			attr_dev(div2, "class", " svelte-1qvp7bk");
    			add_location(div2, file$b, 25, 8, 678);
    			attr_dev(div3, "class", " svelte-1qvp7bk");
    			add_location(div3, file$b, 26, 8, 707);
    			attr_dev(div4, "class", "burger svelte-1qvp7bk");
    			add_location(div4, file$b, 23, 0, 597);
    			attr_dev(nav, "class", "svelte-1qvp7bk");
    			add_location(nav, file$b, 12, 0, 216);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			append_dev(div0, img);
    			append_dev(nav, t0);
    			append_dev(nav, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(nav, t1);
    			append_dev(nav, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);

    			if (!mounted) {
    				dispose = listen_dev(div4, "click", /*navToggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*navbarArray*/ 0) {
    				each_value = navbarArray;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*isActive*/ 1 && ul_class_value !== (ul_class_value = "nav-links " + (/*isActive*/ ctx[0] ? 'nav-active' : '') + " svelte-1qvp7bk")) {
    				attr_dev(ul, "class", ul_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const logoUrl = "/img/logo.png";
    const logoAlt = "";

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let isActive = false;

    	function navToggle(e) {
    		$$invalidate(0, isActive = !isActive);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		navbarArray,
    		logoUrl,
    		logoAlt,
    		isActive,
    		navToggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('isActive' in $$props) $$invalidate(0, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isActive, navToggle];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/Components/Footers/Footer-4-columns/Footer-4-Columns.svelte generated by Svelte v3.46.4 */
    const file$a = "src/Components/Footers/Footer-4-columns/Footer-4-Columns.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (27:12) {#each linkList1 as link}
    function create_each_block_2(ctx) {
    	let li;
    	let a;
    	let t0_value = /*link*/ ctx[10].label + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[10].url);
    			attr_dev(a, "class", "svelte-tr0d1k");
    			add_location(a, file$a, 28, 16, 696);
    			attr_dev(li, "class", "svelte-tr0d1k");
    			add_location(li, file$a, 27, 16, 675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*linkList1*/ 1 && t0_value !== (t0_value = /*link*/ ctx[10].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*linkList1*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[10].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(27:12) {#each linkList1 as link}",
    		ctx
    	});

    	return block;
    }

    // (34:14) {#each linkList1 as link}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*link*/ ctx[10].label + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[10].url);
    			attr_dev(a, "class", "svelte-tr0d1k");
    			add_location(a, file$a, 35, 16, 899);
    			attr_dev(li, "class", "svelte-tr0d1k");
    			add_location(li, file$a, 34, 16, 878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*linkList1*/ 1 && t0_value !== (t0_value = /*link*/ ctx[10].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*linkList1*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[10].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(34:14) {#each linkList1 as link}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#each contactList as contact}
    function create_each_block$3(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let p;
    	let t1_value = /*contact*/ ctx[7].label + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			if (!src_url_equal(img.src, img_src_value = /*contact*/ ctx[7].iconUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*contact*/ ctx[7].iconAlt);
    			attr_dev(img, "class", "contact-logo svelte-tr0d1k");
    			add_location(img, file$a, 43, 12, 1119);
    			attr_dev(p, "class", "contact-text svelte-tr0d1k");
    			add_location(p, file$a, 44, 12, 1206);
    			attr_dev(div, "class", "contact-row svelte-tr0d1k");
    			add_location(div, file$a, 42, 12, 1081);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contactList*/ 16 && !src_url_equal(img.src, img_src_value = /*contact*/ ctx[7].iconUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*contactList*/ 16 && img_alt_value !== (img_alt_value = /*contact*/ ctx[7].iconAlt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*contactList*/ 16 && t1_value !== (t1_value = /*contact*/ ctx[7].label + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(42:8) {#each contactList as contact}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div4;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let div2;
    	let ul0;
    	let t3;
    	let ul1;
    	let t4;
    	let div3;
    	let t5;
    	let div5;
    	let p;
    	let t6;
    	let t7;
    	let each_value_2 = /*linkList1*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*linkList1*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*contactList*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(/*footerDescription*/ ctx[1]);
    			t2 = space();
    			div2 = element("div");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t3 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div5 = element("div");
    			p = element("p");
    			t6 = text("Copyright © ");
    			t7 = text(/*CustomerName*/ ctx[5]);
    			if (!src_url_equal(img.src, img_src_value = /*footerLogoUrl*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*footerLogoAlt*/ ctx[3]);
    			attr_dev(img, "class", "logo svelte-tr0d1k");
    			add_location(img, file$a, 18, 4, 404);
    			attr_dev(div0, "class", "description-text svelte-tr0d1k");
    			add_location(div0, file$a, 19, 8, 475);
    			attr_dev(div1, "class", "description svelte-tr0d1k");
    			add_location(div1, file$a, 17, 4, 374);
    			attr_dev(ul0, "class", "links-list svelte-tr0d1k");
    			add_location(ul0, file$a, 25, 8, 597);
    			attr_dev(ul1, "class", "links-list svelte-tr0d1k");
    			add_location(ul1, file$a, 32, 8, 798);
    			attr_dev(div2, "class", "links svelte-tr0d1k");
    			add_location(div2, file$a, 24, 4, 569);
    			attr_dev(div3, "class", "contact svelte-tr0d1k");
    			add_location(div3, file$a, 40, 4, 1008);
    			attr_dev(div4, "class", "footer-container svelte-tr0d1k");
    			add_location(div4, file$a, 16, 0, 339);
    			attr_dev(p, "class", "copyright-text svelte-tr0d1k");
    			add_location(p, file$a, 50, 0, 1327);
    			attr_dev(div5, "class", "copyright svelte-tr0d1k");
    			add_location(div5, file$a, 49, 0, 1303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, ul0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(ul0, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, ul1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul1, null);
    			}

    			append_dev(div4, t4);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			insert_dev(target, t5, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, p);
    			append_dev(p, t6);
    			append_dev(p, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*footerLogoUrl*/ 4 && !src_url_equal(img.src, img_src_value = /*footerLogoUrl*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*footerLogoAlt*/ 8) {
    				attr_dev(img, "alt", /*footerLogoAlt*/ ctx[3]);
    			}

    			if (dirty & /*footerDescription*/ 2) set_data_dev(t1, /*footerDescription*/ ctx[1]);

    			if (dirty & /*linkList1*/ 1) {
    				each_value_2 = /*linkList1*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*linkList1*/ 1) {
    				each_value_1 = /*linkList1*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*contactList*/ 16) {
    				each_value = /*contactList*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*CustomerName*/ 32) set_data_dev(t7, /*CustomerName*/ ctx[5]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer_4_Columns', slots, []);
    	let { linkList1 = navbarArray } = $$props;
    	let { linkList2 = navbarArray } = $$props;
    	let { footerDescription } = $$props;
    	let { footerLogoUrl = "/img/logo.png" } = $$props;
    	let { footerLogoAlt = "" } = $$props;
    	let { contactList = iconList } = $$props;
    	let { CustomerName } = $$props;

    	const writable_props = [
    		'linkList1',
    		'linkList2',
    		'footerDescription',
    		'footerLogoUrl',
    		'footerLogoAlt',
    		'contactList',
    		'CustomerName'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer_4_Columns> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('linkList1' in $$props) $$invalidate(0, linkList1 = $$props.linkList1);
    		if ('linkList2' in $$props) $$invalidate(6, linkList2 = $$props.linkList2);
    		if ('footerDescription' in $$props) $$invalidate(1, footerDescription = $$props.footerDescription);
    		if ('footerLogoUrl' in $$props) $$invalidate(2, footerLogoUrl = $$props.footerLogoUrl);
    		if ('footerLogoAlt' in $$props) $$invalidate(3, footerLogoAlt = $$props.footerLogoAlt);
    		if ('contactList' in $$props) $$invalidate(4, contactList = $$props.contactList);
    		if ('CustomerName' in $$props) $$invalidate(5, CustomerName = $$props.CustomerName);
    	};

    	$$self.$capture_state = () => ({
    		navbarArray,
    		iconList,
    		linkList1,
    		linkList2,
    		footerDescription,
    		footerLogoUrl,
    		footerLogoAlt,
    		contactList,
    		CustomerName
    	});

    	$$self.$inject_state = $$props => {
    		if ('linkList1' in $$props) $$invalidate(0, linkList1 = $$props.linkList1);
    		if ('linkList2' in $$props) $$invalidate(6, linkList2 = $$props.linkList2);
    		if ('footerDescription' in $$props) $$invalidate(1, footerDescription = $$props.footerDescription);
    		if ('footerLogoUrl' in $$props) $$invalidate(2, footerLogoUrl = $$props.footerLogoUrl);
    		if ('footerLogoAlt' in $$props) $$invalidate(3, footerLogoAlt = $$props.footerLogoAlt);
    		if ('contactList' in $$props) $$invalidate(4, contactList = $$props.contactList);
    		if ('CustomerName' in $$props) $$invalidate(5, CustomerName = $$props.CustomerName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		linkList1,
    		footerDescription,
    		footerLogoUrl,
    		footerLogoAlt,
    		contactList,
    		CustomerName,
    		linkList2
    	];
    }

    class Footer_4_Columns extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			linkList1: 0,
    			linkList2: 6,
    			footerDescription: 1,
    			footerLogoUrl: 2,
    			footerLogoAlt: 3,
    			contactList: 4,
    			CustomerName: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer_4_Columns",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*footerDescription*/ ctx[1] === undefined && !('footerDescription' in props)) {
    			console.warn("<Footer_4_Columns> was created without expected prop 'footerDescription'");
    		}

    		if (/*CustomerName*/ ctx[5] === undefined && !('CustomerName' in props)) {
    			console.warn("<Footer_4_Columns> was created without expected prop 'CustomerName'");
    		}
    	}

    	get linkList1() {
    		throw new Error("<Footer_4_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkList1(value) {
    		throw new Error("<Footer_4_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkList2() {
    		throw new Error("<Footer_4_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkList2(value) {
    		throw new Error("<Footer_4_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get footerDescription() {
    		throw new Error("<Footer_4_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set footerDescription(value) {
    		throw new Error("<Footer_4_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get footerLogoUrl() {
    		throw new Error("<Footer_4_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set footerLogoUrl(value) {
    		throw new Error("<Footer_4_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get footerLogoAlt() {
    		throw new Error("<Footer_4_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set footerLogoAlt(value) {
    		throw new Error("<Footer_4_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contactList() {
    		throw new Error("<Footer_4_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contactList(value) {
    		throw new Error("<Footer_4_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get CustomerName() {
    		throw new Error("<Footer_4_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set CustomerName(value) {
    		throw new Error("<Footer_4_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Widgets/Buttons/Arrow-Icon-Button.svelte generated by Svelte v3.46.4 */

    const file$9 = "src/Widgets/Buttons/Arrow-Icon-Button.svelte";

    function create_fragment$9(ctx) {
    	let a;
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(/*buttonText*/ ctx[0]);
    			t1 = space();
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/img/arrow-right-long.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "arrow svelte-15xqoi8");
    			attr_dev(img, "alt", img_alt_value = "Go to " + /*buttonText*/ ctx[0]);
    			add_location(img, file$9, 5, 50, 123);
    			attr_dev(a, "href", /*buttonUrl*/ ctx[1]);
    			attr_dev(a, "class", "button svelte-15xqoi8");
    			add_location(a, file$9, 5, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*buttonText*/ 1) set_data_dev(t0, /*buttonText*/ ctx[0]);

    			if (dirty & /*buttonText*/ 1 && img_alt_value !== (img_alt_value = "Go to " + /*buttonText*/ ctx[0])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*buttonUrl*/ 2) {
    				attr_dev(a, "href", /*buttonUrl*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow_Icon_Button', slots, []);
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	const writable_props = ['buttonText', 'buttonUrl'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow_Icon_Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    	};

    	$$self.$capture_state = () => ({ buttonText, buttonUrl });

    	$$self.$inject_state = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonText, buttonUrl];
    }

    class Arrow_Icon_Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { buttonText: 0, buttonUrl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow_Icon_Button",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*buttonText*/ ctx[0] === undefined && !('buttonText' in props)) {
    			console.warn("<Arrow_Icon_Button> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[1] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Arrow_Icon_Button> was created without expected prop 'buttonUrl'");
    		}
    	}

    	get buttonText() {
    		throw new Error("<Arrow_Icon_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Arrow_Icon_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Arrow_Icon_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Arrow_Icon_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Product-Grid/Responsive-Grid-More-Info.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$8 = "src/Components/Product-Grid/Responsive-Grid-More-Info.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (56:12) <Link to="{obj.url}">
    function create_default_slot_1$2(ctx) {
    	let p;
    	let t_value = /*obj*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "title svelte-18hpea5");
    			add_location(p, file$8, 55, 34, 1426);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array*/ 1 && t_value !== (t_value = /*obj*/ ctx[6].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(56:12) <Link to=\\\"{obj.url}\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#each array as obj}
    function create_each_block$2(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let link;
    	let t1;
    	let p;
    	let t2_value = /*obj*/ ctx[6].paragraph + "";
    	let t2;
    	let t3;
    	let arrowiconbutton;
    	let t4;
    	let div1_class_value;
    	let current;

    	link = new Link$1({
    			props: {
    				to: /*obj*/ ctx[6].url,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	arrowiconbutton = new Arrow_Icon_Button({
    			props: {
    				buttonText: /*obj*/ ctx[6].buttonText,
    				buttonUrl: /*obj*/ ctx[6].buttonUrl
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(arrowiconbutton.$$.fragment);
    			t4 = space();
    			if (!src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "obj-img svelte-18hpea5");
    			set_style(img, "width", /*gridWidth*/ ctx[1]);
    			set_style(img, "height", /*gridWidth*/ ctx[1]);
    			add_location(img, file$8, 51, 8, 1226);
    			attr_dev(p, "class", "paragraph svelte-18hpea5");
    			add_location(p, file$8, 56, 12, 1479);
    			attr_dev(div0, "class", "text-container svelte-18hpea5");
    			set_style(div0, "width", /*gridWidth*/ ctx[1]);
    			add_location(div0, file$8, 53, 12, 1335);

    			attr_dev(div1, "class", div1_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-18hpea5");

    			set_style(div1, "flex", "0 1 " + /*flexWidth*/ ctx[2]);
    			add_location(div1, file$8, 49, 8, 1109);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(link, div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(div0, t3);
    			mount_component(arrowiconbutton, div0, null);
    			append_dev(div1, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*array*/ 1 && !src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(img, "width", /*gridWidth*/ ctx[1]);
    			}

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(img, "height", /*gridWidth*/ ctx[1]);
    			}

    			const link_changes = {};
    			if (dirty & /*array*/ 1) link_changes.to = /*obj*/ ctx[6].url;

    			if (dirty & /*$$scope, array*/ 513) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			if ((!current || dirty & /*array*/ 1) && t2_value !== (t2_value = /*obj*/ ctx[6].paragraph + "")) set_data_dev(t2, t2_value);
    			const arrowiconbutton_changes = {};
    			if (dirty & /*array*/ 1) arrowiconbutton_changes.buttonText = /*obj*/ ctx[6].buttonText;
    			if (dirty & /*array*/ 1) arrowiconbutton_changes.buttonUrl = /*obj*/ ctx[6].buttonUrl;
    			arrowiconbutton.$set(arrowiconbutton_changes);

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(div0, "width", /*gridWidth*/ ctx[1]);
    			}

    			if (!current || dirty & /*array*/ 1 && div1_class_value !== (div1_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-18hpea5")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(arrowiconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(arrowiconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(link);
    			destroy_component(arrowiconbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(48:4) {#each array as obj}",
    		ctx
    	});

    	return block;
    }

    // (46:0) <Router>
    function create_default_slot$2(ctx) {
    	let div;
    	let current;
    	let each_value = /*array*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid-container svelte-18hpea5");
    			set_style(div, "width", /*gridWidth*/ ctx[1]);
    			add_location(div, file$8, 46, 0, 1015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array, flexWidth, gridWidth*/ 7) {
    				each_value = /*array*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(div, "width", /*gridWidth*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(46:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, gridWidth, array*/ 515) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Responsive_Grid_More_Info', slots, []);

    	const tabChange = e => {
    		activeItem = e.detail;
    	};

    	let { array } = $$props;
    	let { numberOfColumns } = $$props;
    	let { objWidth } = $$props;
    	let { gridWidth } = $$props;
    	numberOfColumns += 1;
    	let flexWidth = 100 / numberOfColumns + "%";

    	beforeUpdate(() => {
    		let remainder = array.length % numberOfColumns;

    		for (let i = 0; i < numberOfColumns - remainder; i++) {
    			console.log("Here " + i);

    			array.push({
    				title: "ThisIsInvisible123",
    				invisible: true,
    				url: ""
    			});
    		}
    	});

    	const writable_props = ['array', 'numberOfColumns', 'objWidth', 'gridWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Responsive_Grid_More_Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('array' in $$props) $$invalidate(0, array = $$props.array);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		HeroHalfscreen: Hero_Halfscreen,
    		HeroFullscreen: Hero_Fullscreen,
    		masterComponentArray,
    		Info_1,
    		Tab,
    		ArrowIconButton: Arrow_Icon_Button,
    		tabChange,
    		array,
    		numberOfColumns,
    		objWidth,
    		gridWidth,
    		flexWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('array' in $$props) $$invalidate(0, array = $$props.array);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('flexWidth' in $$props) $$invalidate(2, flexWidth = $$props.flexWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [array, gridWidth, flexWidth, numberOfColumns, objWidth];
    }

    class Responsive_Grid_More_Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			array: 0,
    			numberOfColumns: 3,
    			objWidth: 4,
    			gridWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Responsive_Grid_More_Info",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*array*/ ctx[0] === undefined && !('array' in props)) {
    			console_1$2.warn("<Responsive_Grid_More_Info> was created without expected prop 'array'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$2.warn("<Responsive_Grid_More_Info> was created without expected prop 'numberOfColumns'");
    		}

    		if (/*objWidth*/ ctx[4] === undefined && !('objWidth' in props)) {
    			console_1$2.warn("<Responsive_Grid_More_Info> was created without expected prop 'objWidth'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$2.warn("<Responsive_Grid_More_Info> was created without expected prop 'gridWidth'");
    		}
    	}

    	get array() {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set array(value) {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfColumns() {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfColumns(value) {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get objWidth() {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set objWidth(value) {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridWidth() {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridWidth(value) {
    		throw new Error("<Responsive_Grid_More_Info>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Info-Sections/Info-1-Alt.svelte generated by Svelte v3.46.4 */
    const file$7 = "src/Components/Info-Sections/Info-1-Alt.svelte";

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let p0;
    	let t1;
    	let t2;
    	let h2;
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6;
    	let arrowiconbutton;
    	let current;

    	arrowiconbutton = new Arrow_Icon_Button({
    			props: {
    				buttonText: /*buttonText*/ ctx[3],
    				buttonUrl: /*buttonUrl*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(/*tinyTopText*/ ctx[1]);
    			t2 = space();
    			h2 = element("h2");
    			t3 = text(/*infoHeading*/ ctx[0]);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(/*infoPara*/ ctx[2]);
    			t6 = space();
    			create_component(arrowiconbutton.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*imgUrl*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*imgAlt*/ ctx[6]);
    			attr_dev(img, "class", "info-img");
    			add_location(img, file$7, 15, 8, 319);
    			attr_dev(div0, "class", "img-container svelte-ofg0ml");
    			add_location(div0, file$7, 14, 4, 283);
    			attr_dev(p0, "class", "tiny-text svelte-ofg0ml");
    			add_location(p0, file$7, 18, 12, 437);
    			attr_dev(h2, "class", "info-heading svelte-ofg0ml");
    			add_location(h2, file$7, 19, 12, 488);
    			attr_dev(p1, "class", "info-para svelte-ofg0ml");
    			add_location(p1, file$7, 20, 12, 544);
    			attr_dev(div1, "class", "info-text-container svelte-ofg0ml");
    			add_location(div1, file$7, 17, 8, 391);
    			attr_dev(div2, "class", "info-container svelte-ofg0ml");
    			add_location(div2, file$7, 13, 0, 250);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(div1, t6);
    			mount_component(arrowiconbutton, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*imgUrl*/ 32 && !src_url_equal(img.src, img_src_value = /*imgUrl*/ ctx[5])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*imgAlt*/ 64) {
    				attr_dev(img, "alt", /*imgAlt*/ ctx[6]);
    			}

    			if (!current || dirty & /*tinyTopText*/ 2) set_data_dev(t1, /*tinyTopText*/ ctx[1]);
    			if (!current || dirty & /*infoHeading*/ 1) set_data_dev(t3, /*infoHeading*/ ctx[0]);
    			if (!current || dirty & /*infoPara*/ 4) set_data_dev(t5, /*infoPara*/ ctx[2]);
    			const arrowiconbutton_changes = {};
    			if (dirty & /*buttonText*/ 8) arrowiconbutton_changes.buttonText = /*buttonText*/ ctx[3];
    			if (dirty & /*buttonUrl*/ 16) arrowiconbutton_changes.buttonUrl = /*buttonUrl*/ ctx[4];
    			arrowiconbutton.$set(arrowiconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrowiconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrowiconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(arrowiconbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info_1_Alt', slots, []);
    	let { infoHeading } = $$props;
    	let { tinyTopText } = $$props;
    	let { infoPara } = $$props;
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	let { imgUrl } = $$props;
    	let { imgAlt } = $$props;

    	const writable_props = [
    		'infoHeading',
    		'tinyTopText',
    		'infoPara',
    		'buttonText',
    		'buttonUrl',
    		'imgUrl',
    		'imgAlt'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info_1_Alt> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('buttonText' in $$props) $$invalidate(3, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(4, buttonUrl = $$props.buttonUrl);
    		if ('imgUrl' in $$props) $$invalidate(5, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(6, imgAlt = $$props.imgAlt);
    	};

    	$$self.$capture_state = () => ({
    		ArrowIconButton: Arrow_Icon_Button,
    		infoHeading,
    		tinyTopText,
    		infoPara,
    		buttonText,
    		buttonUrl,
    		imgUrl,
    		imgAlt
    	});

    	$$self.$inject_state = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('buttonText' in $$props) $$invalidate(3, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(4, buttonUrl = $$props.buttonUrl);
    		if ('imgUrl' in $$props) $$invalidate(5, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(6, imgAlt = $$props.imgAlt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [infoHeading, tinyTopText, infoPara, buttonText, buttonUrl, imgUrl, imgAlt];
    }

    class Info_1_Alt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			infoHeading: 0,
    			tinyTopText: 1,
    			infoPara: 2,
    			buttonText: 3,
    			buttonUrl: 4,
    			imgUrl: 5,
    			imgAlt: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_1_Alt",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*infoHeading*/ ctx[0] === undefined && !('infoHeading' in props)) {
    			console.warn("<Info_1_Alt> was created without expected prop 'infoHeading'");
    		}

    		if (/*tinyTopText*/ ctx[1] === undefined && !('tinyTopText' in props)) {
    			console.warn("<Info_1_Alt> was created without expected prop 'tinyTopText'");
    		}

    		if (/*infoPara*/ ctx[2] === undefined && !('infoPara' in props)) {
    			console.warn("<Info_1_Alt> was created without expected prop 'infoPara'");
    		}

    		if (/*buttonText*/ ctx[3] === undefined && !('buttonText' in props)) {
    			console.warn("<Info_1_Alt> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[4] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Info_1_Alt> was created without expected prop 'buttonUrl'");
    		}

    		if (/*imgUrl*/ ctx[5] === undefined && !('imgUrl' in props)) {
    			console.warn("<Info_1_Alt> was created without expected prop 'imgUrl'");
    		}

    		if (/*imgAlt*/ ctx[6] === undefined && !('imgAlt' in props)) {
    			console.warn("<Info_1_Alt> was created without expected prop 'imgAlt'");
    		}
    	}

    	get infoHeading() {
    		throw new Error("<Info_1_Alt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoHeading(value) {
    		throw new Error("<Info_1_Alt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tinyTopText() {
    		throw new Error("<Info_1_Alt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tinyTopText(value) {
    		throw new Error("<Info_1_Alt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get infoPara() {
    		throw new Error("<Info_1_Alt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoPara(value) {
    		throw new Error("<Info_1_Alt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonText() {
    		throw new Error("<Info_1_Alt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Info_1_Alt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Info_1_Alt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Info_1_Alt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgUrl() {
    		throw new Error("<Info_1_Alt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgUrl(value) {
    		throw new Error("<Info_1_Alt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgAlt() {
    		throw new Error("<Info_1_Alt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgAlt(value) {
    		throw new Error("<Info_1_Alt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Info-Sections/Info-1-Alt-2.svelte generated by Svelte v3.46.4 */
    const file$6 = "src/Components/Info-Sections/Info-1-Alt-2.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let p0;
    	let t1;
    	let t2;
    	let h2;
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6;
    	let arrowiconbutton;
    	let current;

    	arrowiconbutton = new Arrow_Icon_Button({
    			props: {
    				buttonText: /*buttonText*/ ctx[3],
    				buttonUrl: /*buttonUrl*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(/*tinyTopText*/ ctx[1]);
    			t2 = space();
    			h2 = element("h2");
    			t3 = text(/*infoHeading*/ ctx[0]);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(/*infoPara*/ ctx[2]);
    			t6 = space();
    			create_component(arrowiconbutton.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*imgUrl*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*imgAlt*/ ctx[6]);
    			attr_dev(img, "class", "info-img");
    			add_location(img, file$6, 15, 8, 319);
    			attr_dev(div0, "class", "img-container svelte-1760z9u");
    			add_location(div0, file$6, 14, 4, 283);
    			attr_dev(p0, "class", "tiny-text svelte-1760z9u");
    			add_location(p0, file$6, 18, 12, 437);
    			attr_dev(h2, "class", "info-heading svelte-1760z9u");
    			add_location(h2, file$6, 19, 12, 488);
    			attr_dev(p1, "class", "info-para svelte-1760z9u");
    			add_location(p1, file$6, 20, 12, 544);
    			attr_dev(div1, "class", "info-text-container svelte-1760z9u");
    			add_location(div1, file$6, 17, 8, 391);
    			attr_dev(div2, "class", "info-container svelte-1760z9u");
    			add_location(div2, file$6, 13, 0, 250);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(div1, t6);
    			mount_component(arrowiconbutton, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*imgUrl*/ 32 && !src_url_equal(img.src, img_src_value = /*imgUrl*/ ctx[5])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*imgAlt*/ 64) {
    				attr_dev(img, "alt", /*imgAlt*/ ctx[6]);
    			}

    			if (!current || dirty & /*tinyTopText*/ 2) set_data_dev(t1, /*tinyTopText*/ ctx[1]);
    			if (!current || dirty & /*infoHeading*/ 1) set_data_dev(t3, /*infoHeading*/ ctx[0]);
    			if (!current || dirty & /*infoPara*/ 4) set_data_dev(t5, /*infoPara*/ ctx[2]);
    			const arrowiconbutton_changes = {};
    			if (dirty & /*buttonText*/ 8) arrowiconbutton_changes.buttonText = /*buttonText*/ ctx[3];
    			if (dirty & /*buttonUrl*/ 16) arrowiconbutton_changes.buttonUrl = /*buttonUrl*/ ctx[4];
    			arrowiconbutton.$set(arrowiconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrowiconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrowiconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(arrowiconbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info_1_Alt_2', slots, []);
    	let { infoHeading } = $$props;
    	let { tinyTopText } = $$props;
    	let { infoPara } = $$props;
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	let { imgUrl } = $$props;
    	let { imgAlt } = $$props;

    	const writable_props = [
    		'infoHeading',
    		'tinyTopText',
    		'infoPara',
    		'buttonText',
    		'buttonUrl',
    		'imgUrl',
    		'imgAlt'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info_1_Alt_2> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('buttonText' in $$props) $$invalidate(3, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(4, buttonUrl = $$props.buttonUrl);
    		if ('imgUrl' in $$props) $$invalidate(5, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(6, imgAlt = $$props.imgAlt);
    	};

    	$$self.$capture_state = () => ({
    		ArrowIconButton: Arrow_Icon_Button,
    		infoHeading,
    		tinyTopText,
    		infoPara,
    		buttonText,
    		buttonUrl,
    		imgUrl,
    		imgAlt
    	});

    	$$self.$inject_state = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('buttonText' in $$props) $$invalidate(3, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(4, buttonUrl = $$props.buttonUrl);
    		if ('imgUrl' in $$props) $$invalidate(5, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(6, imgAlt = $$props.imgAlt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [infoHeading, tinyTopText, infoPara, buttonText, buttonUrl, imgUrl, imgAlt];
    }

    class Info_1_Alt_2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			infoHeading: 0,
    			tinyTopText: 1,
    			infoPara: 2,
    			buttonText: 3,
    			buttonUrl: 4,
    			imgUrl: 5,
    			imgAlt: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_1_Alt_2",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*infoHeading*/ ctx[0] === undefined && !('infoHeading' in props)) {
    			console.warn("<Info_1_Alt_2> was created without expected prop 'infoHeading'");
    		}

    		if (/*tinyTopText*/ ctx[1] === undefined && !('tinyTopText' in props)) {
    			console.warn("<Info_1_Alt_2> was created without expected prop 'tinyTopText'");
    		}

    		if (/*infoPara*/ ctx[2] === undefined && !('infoPara' in props)) {
    			console.warn("<Info_1_Alt_2> was created without expected prop 'infoPara'");
    		}

    		if (/*buttonText*/ ctx[3] === undefined && !('buttonText' in props)) {
    			console.warn("<Info_1_Alt_2> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[4] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Info_1_Alt_2> was created without expected prop 'buttonUrl'");
    		}

    		if (/*imgUrl*/ ctx[5] === undefined && !('imgUrl' in props)) {
    			console.warn("<Info_1_Alt_2> was created without expected prop 'imgUrl'");
    		}

    		if (/*imgAlt*/ ctx[6] === undefined && !('imgAlt' in props)) {
    			console.warn("<Info_1_Alt_2> was created without expected prop 'imgAlt'");
    		}
    	}

    	get infoHeading() {
    		throw new Error("<Info_1_Alt_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoHeading(value) {
    		throw new Error("<Info_1_Alt_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tinyTopText() {
    		throw new Error("<Info_1_Alt_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tinyTopText(value) {
    		throw new Error("<Info_1_Alt_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get infoPara() {
    		throw new Error("<Info_1_Alt_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoPara(value) {
    		throw new Error("<Info_1_Alt_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonText() {
    		throw new Error("<Info_1_Alt_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Info_1_Alt_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Info_1_Alt_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Info_1_Alt_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgUrl() {
    		throw new Error("<Info_1_Alt_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgUrl(value) {
    		throw new Error("<Info_1_Alt_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgAlt() {
    		throw new Error("<Info_1_Alt_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgAlt(value) {
    		throw new Error("<Info_1_Alt_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Product-Grid/Responsive-Grid-Icons.svelte generated by Svelte v3.46.4 */

    const { console: console_1$1 } = globals;
    const file$5 = "src/Components/Product-Grid/Responsive-Grid-Icons.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (51:12) <Link to="{obj.url}">
    function create_default_slot_1$1(ctx) {
    	let p;
    	let t_value = /*obj*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "title svelte-1ilif4");
    			add_location(p, file$5, 50, 34, 1093);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array*/ 1 && t_value !== (t_value = /*obj*/ ctx[6].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(51:12) <Link to=\\\"{obj.url}\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#each array as obj}
    function create_each_block$1(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let link;
    	let t1;
    	let p;
    	let t2_value = /*obj*/ ctx[6].paragraph + "";
    	let t2;
    	let t3;
    	let div0;
    	let arrowiconbutton;
    	let t4;
    	let div2_class_value;
    	let current;

    	link = new Link$1({
    			props: {
    				to: /*obj*/ ctx[6].url,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	arrowiconbutton = new Arrow_Icon_Button({
    			props: {
    				buttonText: /*obj*/ ctx[6].buttonText,
    				buttonUrl: /*obj*/ ctx[6].buttonUrl
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			create_component(arrowiconbutton.$$.fragment);
    			t4 = space();
    			if (!src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "obj-img svelte-1ilif4");
    			add_location(img, file$5, 46, 8, 941);
    			attr_dev(p, "class", "paragraph svelte-1ilif4");
    			add_location(p, file$5, 51, 12, 1146);
    			attr_dev(div0, "class", "absolute svelte-1ilif4");
    			add_location(div0, file$5, 53, 12, 1212);
    			attr_dev(div1, "class", "text-container svelte-1ilif4");
    			set_style(div1, "width", /*gridWidth*/ ctx[1]);
    			add_location(div1, file$5, 48, 12, 1002);

    			attr_dev(div2, "class", div2_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-1ilif4");

    			set_style(div2, "flex", "0 1 " + /*flexWidth*/ ctx[2]);
    			add_location(div2, file$5, 44, 8, 824);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(link, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			mount_component(arrowiconbutton, div0, null);
    			append_dev(div2, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*array*/ 1 && !src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const link_changes = {};
    			if (dirty & /*array*/ 1) link_changes.to = /*obj*/ ctx[6].url;

    			if (dirty & /*$$scope, array*/ 513) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			if ((!current || dirty & /*array*/ 1) && t2_value !== (t2_value = /*obj*/ ctx[6].paragraph + "")) set_data_dev(t2, t2_value);
    			const arrowiconbutton_changes = {};
    			if (dirty & /*array*/ 1) arrowiconbutton_changes.buttonText = /*obj*/ ctx[6].buttonText;
    			if (dirty & /*array*/ 1) arrowiconbutton_changes.buttonUrl = /*obj*/ ctx[6].buttonUrl;
    			arrowiconbutton.$set(arrowiconbutton_changes);

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(div1, "width", /*gridWidth*/ ctx[1]);
    			}

    			if (!current || dirty & /*array*/ 1 && div2_class_value !== (div2_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-1ilif4")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(arrowiconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(arrowiconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(link);
    			destroy_component(arrowiconbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(43:4) {#each array as obj}",
    		ctx
    	});

    	return block;
    }

    // (41:0) <Router>
    function create_default_slot$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*array*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid-container svelte-1ilif4");
    			set_style(div, "width", /*gridWidth*/ ctx[1]);
    			add_location(div, file$5, 41, 0, 730);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array, flexWidth, gridWidth*/ 7) {
    				each_value = /*array*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*gridWidth*/ 2) {
    				set_style(div, "width", /*gridWidth*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(41:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, gridWidth, array*/ 515) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
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

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Responsive_Grid_Icons', slots, []);

    	const tabChange = e => {
    		activeItem = e.detail;
    	};

    	let { array } = $$props;
    	let { numberOfColumns } = $$props;
    	let { objWidth } = $$props;
    	let { gridWidth } = $$props;
    	numberOfColumns += 1;
    	let flexWidth = 100 / numberOfColumns + "%";

    	beforeUpdate(() => {
    		let remainder = array.length % numberOfColumns;

    		for (let i = 0; i < numberOfColumns - remainder; i++) {
    			console.log("Here " + i);

    			array.push({
    				title: "ThisIsInvisible123",
    				invisible: true,
    				url: ""
    			});
    		}
    	});

    	const writable_props = ['array', 'numberOfColumns', 'objWidth', 'gridWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Responsive_Grid_Icons> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('array' in $$props) $$invalidate(0, array = $$props.array);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		ArrowIconButton: Arrow_Icon_Button,
    		tabChange,
    		array,
    		numberOfColumns,
    		objWidth,
    		gridWidth,
    		flexWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('array' in $$props) $$invalidate(0, array = $$props.array);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('flexWidth' in $$props) $$invalidate(2, flexWidth = $$props.flexWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [array, gridWidth, flexWidth, numberOfColumns, objWidth];
    }

    class Responsive_Grid_Icons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			array: 0,
    			numberOfColumns: 3,
    			objWidth: 4,
    			gridWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Responsive_Grid_Icons",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*array*/ ctx[0] === undefined && !('array' in props)) {
    			console_1$1.warn("<Responsive_Grid_Icons> was created without expected prop 'array'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$1.warn("<Responsive_Grid_Icons> was created without expected prop 'numberOfColumns'");
    		}

    		if (/*objWidth*/ ctx[4] === undefined && !('objWidth' in props)) {
    			console_1$1.warn("<Responsive_Grid_Icons> was created without expected prop 'objWidth'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$1.warn("<Responsive_Grid_Icons> was created without expected prop 'gridWidth'");
    		}
    	}

    	get array() {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set array(value) {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfColumns() {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfColumns(value) {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get objWidth() {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set objWidth(value) {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridWidth() {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridWidth(value) {
    		throw new Error("<Responsive_Grid_Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Info-Sections/Info-4-Grid.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/Components/Info-Sections/Info-4-Grid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (17:8) {#each fourGrids as grid}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*grid*/ ctx[8].heading + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*grid*/ ctx[8].paragraph + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(div0, "class", "grid-heading svelte-17yu443");
    			add_location(div0, file$4, 18, 16, 415);
    			attr_dev(div1, "class", "grid-paragraph svelte-17yu443");
    			add_location(div1, file$4, 19, 16, 478);
    			attr_dev(div2, "class", "grid svelte-17yu443");
    			add_location(div2, file$4, 17, 12, 380);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fourGrids*/ 32 && t0_value !== (t0_value = /*grid*/ ctx[8].heading + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*fourGrids*/ 32 && t2_value !== (t2_value = /*grid*/ ctx[8].paragraph + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:8) {#each fourGrids as grid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let p0;
    	let t1;
    	let t2;
    	let h2;
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6;
    	let arrowiconbutton;
    	let current;
    	let each_value = /*fourGrids*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	arrowiconbutton = new Arrow_Icon_Button({
    			props: {
    				buttonText: /*buttonText*/ ctx[3],
    				buttonUrl: /*buttonUrl*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(/*tinyTopText*/ ctx[1]);
    			t2 = space();
    			h2 = element("h2");
    			t3 = text(/*infoHeading*/ ctx[0]);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(/*infoPara*/ ctx[2]);
    			t6 = space();
    			create_component(arrowiconbutton.$$.fragment);
    			attr_dev(div0, "class", "grid-container svelte-17yu443");
    			add_location(div0, file$4, 15, 4, 305);
    			attr_dev(p0, "class", "tiny-text svelte-17yu443");
    			add_location(p0, file$4, 24, 12, 629);
    			attr_dev(h2, "class", "info-heading svelte-17yu443");
    			add_location(h2, file$4, 25, 12, 680);
    			attr_dev(p1, "class", "info-para svelte-17yu443");
    			add_location(p1, file$4, 26, 12, 736);
    			attr_dev(div1, "class", "info-text-container svelte-17yu443");
    			add_location(div1, file$4, 23, 8, 583);
    			attr_dev(div2, "class", "info-container svelte-17yu443");
    			add_location(div2, file$4, 14, 0, 272);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(div1, t6);
    			mount_component(arrowiconbutton, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fourGrids*/ 32) {
    				each_value = /*fourGrids*/ ctx[5];
    				validate_each_argument(each_value);
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

    			if (!current || dirty & /*tinyTopText*/ 2) set_data_dev(t1, /*tinyTopText*/ ctx[1]);
    			if (!current || dirty & /*infoHeading*/ 1) set_data_dev(t3, /*infoHeading*/ ctx[0]);
    			if (!current || dirty & /*infoPara*/ 4) set_data_dev(t5, /*infoPara*/ ctx[2]);
    			const arrowiconbutton_changes = {};
    			if (dirty & /*buttonText*/ 8) arrowiconbutton_changes.buttonText = /*buttonText*/ ctx[3];
    			if (dirty & /*buttonUrl*/ 16) arrowiconbutton_changes.buttonUrl = /*buttonUrl*/ ctx[4];
    			arrowiconbutton.$set(arrowiconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrowiconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrowiconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			destroy_component(arrowiconbutton);
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
    	validate_slots('Info_4_Grid', slots, []);
    	let { infoHeading } = $$props;
    	let { tinyTopText } = $$props;
    	let { infoPara } = $$props;
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	let { imgUrl } = $$props;
    	let { imgAlt } = $$props;
    	let { fourGrids } = $$props;

    	const writable_props = [
    		'infoHeading',
    		'tinyTopText',
    		'infoPara',
    		'buttonText',
    		'buttonUrl',
    		'imgUrl',
    		'imgAlt',
    		'fourGrids'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info_4_Grid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('buttonText' in $$props) $$invalidate(3, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(4, buttonUrl = $$props.buttonUrl);
    		if ('imgUrl' in $$props) $$invalidate(6, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(7, imgAlt = $$props.imgAlt);
    		if ('fourGrids' in $$props) $$invalidate(5, fourGrids = $$props.fourGrids);
    	};

    	$$self.$capture_state = () => ({
    		ArrowIconButton: Arrow_Icon_Button,
    		infoHeading,
    		tinyTopText,
    		infoPara,
    		buttonText,
    		buttonUrl,
    		imgUrl,
    		imgAlt,
    		fourGrids
    	});

    	$$self.$inject_state = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('buttonText' in $$props) $$invalidate(3, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(4, buttonUrl = $$props.buttonUrl);
    		if ('imgUrl' in $$props) $$invalidate(6, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(7, imgAlt = $$props.imgAlt);
    		if ('fourGrids' in $$props) $$invalidate(5, fourGrids = $$props.fourGrids);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		infoHeading,
    		tinyTopText,
    		infoPara,
    		buttonText,
    		buttonUrl,
    		fourGrids,
    		imgUrl,
    		imgAlt
    	];
    }

    class Info_4_Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			infoHeading: 0,
    			tinyTopText: 1,
    			infoPara: 2,
    			buttonText: 3,
    			buttonUrl: 4,
    			imgUrl: 6,
    			imgAlt: 7,
    			fourGrids: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_4_Grid",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*infoHeading*/ ctx[0] === undefined && !('infoHeading' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'infoHeading'");
    		}

    		if (/*tinyTopText*/ ctx[1] === undefined && !('tinyTopText' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'tinyTopText'");
    		}

    		if (/*infoPara*/ ctx[2] === undefined && !('infoPara' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'infoPara'");
    		}

    		if (/*buttonText*/ ctx[3] === undefined && !('buttonText' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[4] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'buttonUrl'");
    		}

    		if (/*imgUrl*/ ctx[6] === undefined && !('imgUrl' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'imgUrl'");
    		}

    		if (/*imgAlt*/ ctx[7] === undefined && !('imgAlt' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'imgAlt'");
    		}

    		if (/*fourGrids*/ ctx[5] === undefined && !('fourGrids' in props)) {
    			console.warn("<Info_4_Grid> was created without expected prop 'fourGrids'");
    		}
    	}

    	get infoHeading() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoHeading(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tinyTopText() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tinyTopText(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get infoPara() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoPara(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonText() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgUrl() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgUrl(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgAlt() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgAlt(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fourGrids() {
    		throw new Error("<Info_4_Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fourGrids(value) {
    		throw new Error("<Info_4_Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Banners/Only-Button.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/Components/Banners/Only-Button.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let rectangularbutton;
    	let current;

    	rectangularbutton = new Rectangular_Button({
    			props: {
    				buttonText: /*buttonText*/ ctx[0],
    				buttonUrl: /*buttonUrl*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rectangularbutton.$$.fragment);
    			attr_dev(div, "class", "banner svelte-dfizjr");
    			add_location(div, file$3, 7, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rectangularbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const rectangularbutton_changes = {};
    			if (dirty & /*buttonText*/ 1) rectangularbutton_changes.buttonText = /*buttonText*/ ctx[0];
    			if (dirty & /*buttonUrl*/ 2) rectangularbutton_changes.buttonUrl = /*buttonUrl*/ ctx[1];
    			rectangularbutton.$set(rectangularbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rectangularbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rectangularbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rectangularbutton);
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
    	validate_slots('Only_Button', slots, []);
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	const writable_props = ['buttonText', 'buttonUrl'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Only_Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    	};

    	$$self.$capture_state = () => ({ RectangularButton: Rectangular_Button, buttonText, buttonUrl });

    	$$self.$inject_state = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonText, buttonUrl];
    }

    class Only_Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { buttonText: 0, buttonUrl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Only_Button",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*buttonText*/ ctx[0] === undefined && !('buttonText' in props)) {
    			console.warn("<Only_Button> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[1] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Only_Button> was created without expected prop 'buttonUrl'");
    		}
    	}

    	get buttonText() {
    		throw new Error("<Only_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Only_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Only_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Only_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Banners/Paragraph-Button.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/Components/Banners/Paragraph-Button.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div0;
    	let p;
    	let t0;
    	let t1;
    	let div1;
    	let rectangularbutton;
    	let current;

    	rectangularbutton = new Rectangular_Button({
    			props: {
    				buttonText: /*buttonText*/ ctx[0],
    				buttonUrl: /*buttonUrl*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(/*paragraph*/ ctx[2]);
    			t1 = space();
    			div1 = element("div");
    			create_component(rectangularbutton.$$.fragment);
    			attr_dev(p, "class", "paragraph svelte-1oek4y6");
    			add_location(p, file$2, 10, 4, 239);
    			attr_dev(div0, "class", "text-container svelte-1oek4y6");
    			add_location(div0, file$2, 9, 4, 206);
    			attr_dev(div1, "class", "button-container svelte-1oek4y6");
    			add_location(div1, file$2, 12, 4, 291);
    			attr_dev(div2, "class", "banner svelte-1oek4y6");
    			add_location(div2, file$2, 8, 0, 181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(rectangularbutton, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*paragraph*/ 4) set_data_dev(t0, /*paragraph*/ ctx[2]);
    			const rectangularbutton_changes = {};
    			if (dirty & /*buttonText*/ 1) rectangularbutton_changes.buttonText = /*buttonText*/ ctx[0];
    			if (dirty & /*buttonUrl*/ 2) rectangularbutton_changes.buttonUrl = /*buttonUrl*/ ctx[1];
    			rectangularbutton.$set(rectangularbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rectangularbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rectangularbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(rectangularbutton);
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
    	validate_slots('Paragraph_Button', slots, []);
    	let { buttonText } = $$props;
    	let { buttonUrl } = $$props;
    	let { paragraph } = $$props;
    	const writable_props = ['buttonText', 'buttonUrl', 'paragraph'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paragraph_Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    		if ('paragraph' in $$props) $$invalidate(2, paragraph = $$props.paragraph);
    	};

    	$$self.$capture_state = () => ({
    		RectangularButton: Rectangular_Button,
    		buttonText,
    		buttonUrl,
    		paragraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    		if ('buttonUrl' in $$props) $$invalidate(1, buttonUrl = $$props.buttonUrl);
    		if ('paragraph' in $$props) $$invalidate(2, paragraph = $$props.paragraph);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonText, buttonUrl, paragraph];
    }

    class Paragraph_Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			buttonText: 0,
    			buttonUrl: 1,
    			paragraph: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph_Button",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*buttonText*/ ctx[0] === undefined && !('buttonText' in props)) {
    			console.warn("<Paragraph_Button> was created without expected prop 'buttonText'");
    		}

    		if (/*buttonUrl*/ ctx[1] === undefined && !('buttonUrl' in props)) {
    			console.warn("<Paragraph_Button> was created without expected prop 'buttonUrl'");
    		}

    		if (/*paragraph*/ ctx[2] === undefined && !('paragraph' in props)) {
    			console.warn("<Paragraph_Button> was created without expected prop 'paragraph'");
    		}
    	}

    	get buttonText() {
    		throw new Error("<Paragraph_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Paragraph_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonUrl() {
    		throw new Error("<Paragraph_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonUrl(value) {
    		throw new Error("<Paragraph_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paragraph() {
    		throw new Error("<Paragraph_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paragraph(value) {
    		throw new Error("<Paragraph_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/Components/Forms/Form-1.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$1 = "src/Components/Forms/Form-1.svelte";

    // (102:1) {#if isSuccessVisible}
    function create_if_block_1(ctx) {
    	let p;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Data updated successfully";
    			attr_dev(p, "class", "error-alert svelte-14ytybk");
    			add_location(p, file$1, 102, 2, 2246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 150 }, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 150 }, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(102:1) {#if isSuccessVisible}",
    		ctx
    	});

    	return block;
    }

    // (99:0) {#if hasError == true}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${errMessage}`;
    			attr_dev(p, "class", "error-alert svelte-14ytybk");
    			add_location(p, file$1, 99, 2, 2171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(99:0) {#if hasError == true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let h2;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let div5;
    	let form;
    	let h3;
    	let t3;
    	let t4;
    	let h4;
    	let t5;
    	let t6;
    	let div0;
    	let input0;
    	let input0_class_value;
    	let t7;
    	let div1;
    	let input1;
    	let input1_class_value;
    	let t8;
    	let div2;
    	let input2;
    	let input2_class_value;
    	let t9;
    	let div3;
    	let input3;
    	let input3_class_value;
    	let t10;
    	let div4;
    	let textarea;
    	let t11;
    	let button;
    	let t13;
    	let link;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*hasError*/ ctx[6] == true) return 0;
    		if (/*isSuccessVisible*/ ctx[2]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Take survey";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			div5 = element("div");
    			form = element("form");
    			h3 = element("h3");
    			t3 = text(/*formTitle*/ ctx[0]);
    			t4 = space();
    			h4 = element("h4");
    			t5 = text(/*formMessage*/ ctx[1]);
    			t6 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t7 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t8 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t9 = space();
    			div3 = element("div");
    			input3 = element("input");
    			t10 = space();
    			div4 = element("div");
    			textarea = element("textarea");
    			t11 = space();
    			button = element("button");
    			button.textContent = "Continue";
    			t13 = space();
    			link = element("link");
    			attr_dev(h2, "class", "svelte-14ytybk");
    			add_location(h2, file$1, 96, 0, 2123);
    			attr_dev(h3, "class", "svelte-14ytybk");
    			add_location(h3, file$1, 109, 4, 2469);
    			attr_dev(h4, "class", "svelte-14ytybk");
    			add_location(h4, file$1, 110, 2, 2492);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", input0_class_value = "form-control " + (/*errorsValid*/ ctx[5].firstNameValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input0, "placeholder", "First name");
    			input0.required = true;
    			add_location(input0, file$1, 112, 4, 2546);
    			attr_dev(div0, "class", "form-group svelte-14ytybk");
    			add_location(div0, file$1, 111, 2, 2517);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", input1_class_value = "form-control " + (/*errorsValid*/ ctx[5].lastNameValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input1, "placeholder", "Last name");
    			input1.required = true;
    			add_location(input1, file$1, 116, 4, 2762);
    			attr_dev(div1, "class", "form-group svelte-14ytybk");
    			add_location(div1, file$1, 115, 2, 2733);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "class", input2_class_value = "form-control " + (/*errorsValid*/ ctx[5].emailValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input2, "placeholder", "Email");
    			input2.required = true;
    			add_location(input2, file$1, 120, 3, 2984);
    			attr_dev(div2, "class", "form-group svelte-14ytybk");
    			add_location(div2, file$1, 119, 4, 2956);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", input3_class_value = "form-control " + (/*errorsValid*/ ctx[5].phoneNumberValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input3, "placeholder", "Contact number");
    			input3.required = true;
    			add_location(input3, file$1, 124, 3, 3197);
    			attr_dev(div3, "class", "form-group svelte-14ytybk");
    			add_location(div3, file$1, 123, 4, 3169);
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "class", "form-control svelte-14ytybk");
    			attr_dev(textarea, "placeholder", "Give us the deets");
    			add_location(textarea, file$1, 128, 6, 3433);
    			attr_dev(div4, "class", "form-group svelte-14ytybk");
    			add_location(div4, file$1, 127, 4, 3402);
    			attr_dev(button, "class", "btn btn-full svelte-14ytybk");
    			add_location(button, file$1, 132, 2, 3565);
    			attr_dev(form, "id", "surveyForm");
    			attr_dev(form, "class", "mt-4 svelte-14ytybk");
    			toggle_class(form, "submitted", /*submitted*/ ctx[3]);
    			add_location(form, file$1, 108, 2, 2373);
    			attr_dev(div5, "class", "container svelte-14ytybk");
    			add_location(div5, file$1, 106, 0, 2346);
    			attr_dev(link, "href", "https://gist.githubusercontent.com/Ajax30/08899d40e16069cd517b9756dc900acc/raw/04e4f9997245df079fa8500690d1878311115b20/global.css");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "crossorigin", "anonymous");
    			attr_dev(link, "class", "svelte-14ytybk");
    			add_location(link, file$1, 136, 0, 3664);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, form);
    			append_dev(form, h3);
    			append_dev(h3, t3);
    			append_dev(form, t4);
    			append_dev(form, h4);
    			append_dev(h4, t5);
    			append_dev(form, t6);
    			append_dev(form, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*fields*/ ctx[4].firstName);
    			append_dev(form, t7);
    			append_dev(form, div1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*fields*/ ctx[4].lastName);
    			append_dev(form, t8);
    			append_dev(form, div2);
    			append_dev(div2, input2);
    			set_input_value(input2, /*fields*/ ctx[4].email);
    			append_dev(form, t9);
    			append_dev(form, div3);
    			append_dev(div3, input3);
    			set_input_value(input3, /*fields*/ ctx[4].phoneNumber);
    			append_dev(form, t10);
    			append_dev(form, div4);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*fields*/ ctx[4].messageArea);
    			append_dev(form, t11);
    			append_dev(form, button);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, link, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input0, "keyup", /*validate*/ ctx[7], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input1, "keyup", /*validate*/ ctx[7], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[12]),
    					listen_dev(input2, "keyup", /*validate*/ ctx[7], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13]),
    					listen_dev(input3, "keyup", /*validate*/ ctx[7], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[14]),
    					listen_dev(button, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[8]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(t2.parentNode, t2);
    				} else {
    					if_block = null;
    				}
    			}

    			if (!current || dirty & /*formTitle*/ 1) set_data_dev(t3, /*formTitle*/ ctx[0]);
    			if (!current || dirty & /*formMessage*/ 2) set_data_dev(t5, /*formMessage*/ ctx[1]);

    			if (!current || dirty & /*errorsValid*/ 32 && input0_class_value !== (input0_class_value = "form-control " + (/*errorsValid*/ ctx[5].firstNameValid ? '' : 'invalid') + " svelte-14ytybk")) {
    				attr_dev(input0, "class", input0_class_value);
    			}

    			if (dirty & /*fields*/ 16 && input0.value !== /*fields*/ ctx[4].firstName) {
    				set_input_value(input0, /*fields*/ ctx[4].firstName);
    			}

    			if (!current || dirty & /*errorsValid*/ 32 && input1_class_value !== (input1_class_value = "form-control " + (/*errorsValid*/ ctx[5].lastNameValid ? '' : 'invalid') + " svelte-14ytybk")) {
    				attr_dev(input1, "class", input1_class_value);
    			}

    			if (dirty & /*fields*/ 16 && input1.value !== /*fields*/ ctx[4].lastName) {
    				set_input_value(input1, /*fields*/ ctx[4].lastName);
    			}

    			if (!current || dirty & /*errorsValid*/ 32 && input2_class_value !== (input2_class_value = "form-control " + (/*errorsValid*/ ctx[5].emailValid ? '' : 'invalid') + " svelte-14ytybk")) {
    				attr_dev(input2, "class", input2_class_value);
    			}

    			if (dirty & /*fields*/ 16 && input2.value !== /*fields*/ ctx[4].email) {
    				set_input_value(input2, /*fields*/ ctx[4].email);
    			}

    			if (!current || dirty & /*errorsValid*/ 32 && input3_class_value !== (input3_class_value = "form-control " + (/*errorsValid*/ ctx[5].phoneNumberValid ? '' : 'invalid') + " svelte-14ytybk")) {
    				attr_dev(input3, "class", input3_class_value);
    			}

    			if (dirty & /*fields*/ 16 && input3.value !== /*fields*/ ctx[4].phoneNumber) {
    				set_input_value(input3, /*fields*/ ctx[4].phoneNumber);
    			}

    			if (dirty & /*fields*/ 16) {
    				set_input_value(textarea, /*fields*/ ctx[4].messageArea);
    			}

    			if (dirty & /*submitted*/ 8) {
    				toggle_class(form, "submitted", /*submitted*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(link);
    			mounted = false;
    			run_all(dispose);
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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^(\\d{1,3}[- ]?)?\d{10}$/;
    const errMessage = "All the fields are mandatory";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form_1', slots, []);
    	let { formTitle = "Form Title" } = $$props;
    	let { formMessage = "Send us a message and our team will be in touch" } = $$props;
    	let { sendToEmail } = $$props;
    	let hasError = false;
    	let isSuccessVisible = false;
    	let submitted = false;

    	let fields = {
    		firstName: '',
    		lastName: '',
    		email: '',
    		phoneNumber: '',
    		messageArea: ''
    	};

    	let errors = {
    		firstName: '',
    		lastName: '',
    		email: '',
    		phoneNumber: '',
    		messageArea: ''
    	};

    	let errorsValid = {
    		firstNameValid: true,
    		lastNameValid: true,
    		emailValid: true,
    		phoneNumberValid: true,
    		messageAreaValid: true
    	};

    	let valid = false;

    	function validate() {
    		if (fields.firstName.length < 1) {
    			$$invalidate(5, errorsValid.firstNameValid = false, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.firstNameValid = true, errorsValid);
    		}

    		if (fields.lastName.length < 1) {
    			$$invalidate(5, errorsValid.lastNameValid = false, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.lastNameValid = true, errorsValid);
    		}

    		if (!emailPattern.test(fields.email)) {
    			$$invalidate(5, errorsValid.emailValid = false, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.emailValid = true, errorsValid);
    		}

    		if (!mobilePattern.test(fields.phoneNumber)) {
    			$$invalidate(5, errorsValid.phoneNumberValid = false, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.phoneNumberValid = true, errorsValid);
    		}
    	}

    	function handleSubmit(e) {
    		valid = true;

    		if (fields.firstName.length < 1) {
    			errors.firstName = "Please enter your first name.";
    			$$invalidate(5, errorsValid.firstNameValid = false, errorsValid);
    		}

    		if (fields.lastName.length < 1) {
    			errors.lastName = "Please enter your last name";
    		}

    		if (!emailPattern.test(fields.email)) {
    			errors.lastName = "Please enter a valid email address";
    		}

    		if (!mobilePattern.test(fields.phoneNumber)) {
    			console.log('incorrect number');
    			errors.lastName = "Please enter a valid contact number";
    		}

    		$$invalidate(2, isSuccessVisible = true);

    		setTimeout(
    			function () {
    				$$invalidate(2, isSuccessVisible = false);
    			},
    			4000
    		);
    	}

    	const writable_props = ['formTitle', 'formMessage', 'sendToEmail'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Form_1> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		fields.firstName = this.value;
    		$$invalidate(4, fields);
    	}

    	function input1_input_handler() {
    		fields.lastName = this.value;
    		$$invalidate(4, fields);
    	}

    	function input2_input_handler() {
    		fields.email = this.value;
    		$$invalidate(4, fields);
    	}

    	function input3_input_handler() {
    		fields.phoneNumber = this.value;
    		$$invalidate(4, fields);
    	}

    	function textarea_input_handler() {
    		fields.messageArea = this.value;
    		$$invalidate(4, fields);
    	}

    	const click_handler = () => $$invalidate(3, submitted = true);

    	$$self.$$set = $$props => {
    		if ('formTitle' in $$props) $$invalidate(0, formTitle = $$props.formTitle);
    		if ('formMessage' in $$props) $$invalidate(1, formMessage = $$props.formMessage);
    		if ('sendToEmail' in $$props) $$invalidate(9, sendToEmail = $$props.sendToEmail);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		formTitle,
    		formMessage,
    		sendToEmail,
    		hasError,
    		isSuccessVisible,
    		submitted,
    		emailPattern,
    		mobilePattern,
    		errMessage,
    		fields,
    		errors,
    		errorsValid,
    		valid,
    		validate,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('formTitle' in $$props) $$invalidate(0, formTitle = $$props.formTitle);
    		if ('formMessage' in $$props) $$invalidate(1, formMessage = $$props.formMessage);
    		if ('sendToEmail' in $$props) $$invalidate(9, sendToEmail = $$props.sendToEmail);
    		if ('hasError' in $$props) $$invalidate(6, hasError = $$props.hasError);
    		if ('isSuccessVisible' in $$props) $$invalidate(2, isSuccessVisible = $$props.isSuccessVisible);
    		if ('submitted' in $$props) $$invalidate(3, submitted = $$props.submitted);
    		if ('fields' in $$props) $$invalidate(4, fields = $$props.fields);
    		if ('errors' in $$props) errors = $$props.errors;
    		if ('errorsValid' in $$props) $$invalidate(5, errorsValid = $$props.errorsValid);
    		if ('valid' in $$props) valid = $$props.valid;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formTitle,
    		formMessage,
    		isSuccessVisible,
    		submitted,
    		fields,
    		errorsValid,
    		hasError,
    		validate,
    		handleSubmit,
    		sendToEmail,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		textarea_input_handler,
    		click_handler
    	];
    }

    class Form_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			formTitle: 0,
    			formMessage: 1,
    			sendToEmail: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form_1",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sendToEmail*/ ctx[9] === undefined && !('sendToEmail' in props)) {
    			console_1.warn("<Form_1> was created without expected prop 'sendToEmail'");
    		}
    	}

    	get formTitle() {
    		throw new Error("<Form_1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formTitle(value) {
    		throw new Error("<Form_1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formMessage() {
    		throw new Error("<Form_1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formMessage(value) {
    		throw new Error("<Form_1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sendToEmail() {
    		throw new Error("<Form_1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sendToEmail(value) {
    		throw new Error("<Form_1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    // (52:4) <Route path="/Heroes/Fullscreen">
    function create_default_slot_15(ctx) {
    	let herofullscreen;
    	let current;
    	herofullscreen = new Hero_Fullscreen({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(herofullscreen.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(herofullscreen, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(herofullscreen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(herofullscreen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(herofullscreen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(52:4) <Route path=\\\"/Heroes/Fullscreen\\\">",
    		ctx
    	});

    	return block;
    }

    // (56:1) <Route path="/Heroes/Halfscreen">
    function create_default_slot_14(ctx) {
    	let herohalfscreen;
    	let current;

    	herohalfscreen = new Hero_Halfscreen({
    			props: {
    				title: "CtrlB Component Library",
    				subheading: "Racking up the components, baby",
    				buttonText: "I am a Button",
    				buttonUrl: "#"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(herohalfscreen.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(herohalfscreen, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(herohalfscreen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(herohalfscreen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(herohalfscreen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(56:1) <Route path=\\\"/Heroes/Halfscreen\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:1) <Route path="/Info/1">
    function create_default_slot_13(ctx) {
    	let info_1;
    	let current;
    	info_1 = new Info_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(info_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(info_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(info_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(65:1) <Route path=\\\"/Info/1\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:1) <Route path="/Info/1-Alt">
    function create_default_slot_12(ctx) {
    	let info_1alt;
    	let current;

    	info_1alt = new Info_1_Alt({
    			props: {
    				infoHeading: "So much more than just a cafe",
    				tinyTopText: "odd little bit of text",
    				infoPara: "Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following.",
    				buttonText: "About Us",
    				buttonUrl: "#",
    				imgUrl: "/img/icon.jpg",
    				imgAlt: ""
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(info_1alt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(info_1alt, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_1alt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_1alt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(info_1alt, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(69:1) <Route path=\\\"/Info/1-Alt\\\">",
    		ctx
    	});

    	return block;
    }

    // (82:1) <Route path="/Info/1-Alt">
    function create_default_slot_11(ctx) {
    	let info_1alt;
    	let current;

    	info_1alt = new Info_1_Alt({
    			props: {
    				infoHeading: "So much more than just a cafe",
    				tinyTopText: "odd little bit of text",
    				infoPara: "Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following.",
    				buttonText: "About Us",
    				buttonUrl: "#",
    				imgUrl: "/img/icon.jpg",
    				imgAlt: ""
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(info_1alt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(info_1alt, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_1alt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_1alt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(info_1alt, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(82:1) <Route path=\\\"/Info/1-Alt\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:1) <Route path="/Info/1-Reversed">
    function create_default_slot_10(ctx) {
    	let info_1alt_2;
    	let current;

    	info_1alt_2 = new Info_1_Alt_2({
    			props: {
    				infoHeading: "So much more than just a cafe",
    				tinyTopText: "odd little bit of text",
    				infoPara: "Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following.",
    				buttonText: "About Us",
    				buttonUrl: "#",
    				imgUrl: "/img/icon.jpg",
    				imgAlt: ""
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(info_1alt_2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(info_1alt_2, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_1alt_2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_1alt_2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(info_1alt_2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(94:1) <Route path=\\\"/Info/1-Reversed\\\">",
    		ctx
    	});

    	return block;
    }

    // (106:1) <Route path="/Info/Grids">
    function create_default_slot_9(ctx) {
    	let info_4grid;
    	let current;

    	info_4grid = new Info_4_Grid({
    			props: {
    				infoHeading: "So much more than just a cafe",
    				tinyTopText: "odd little bit of text",
    				infoPara: "Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following.",
    				buttonText: "About Us",
    				buttonUrl: "#",
    				fourGrids
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(info_4grid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(info_4grid, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_4grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_4grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(info_4grid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(106:1) <Route path=\\\"/Info/Grids\\\">",
    		ctx
    	});

    	return block;
    }

    // (118:1) <Route path="/Grids/Responsive">
    function create_default_slot_8(ctx) {
    	let responsivegrid;
    	let current;

    	responsivegrid = new Responsive_Grid({
    			props: {
    				array: masterComponentArray.at(0).list,
    				numberOfColumns: 2,
    				objWidth: "200px",
    				gridWidth: "100%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivegrid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivegrid, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivegrid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(118:1) <Route path=\\\"/Grids/Responsive\\\">",
    		ctx
    	});

    	return block;
    }

    // (127:1) <Route path="/Tabs/Centered">
    function create_default_slot_7(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				componentArray: masterComponentArray,
    				activeItem: masterComponentArray.at(0).label
    			},
    			$$inline: true
    		});

    	tab.$on("tabChange", /*tabChange*/ ctx[0]);

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(127:1) <Route path=\\\"/Tabs/Centered\\\">",
    		ctx
    	});

    	return block;
    }

    // (135:1) <Route path="/Navbar/Traditional">
    function create_default_slot_6(ctx) {
    	let navbar;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(135:1) <Route path=\\\"/Navbar/Traditional\\\">",
    		ctx
    	});

    	return block;
    }

    // (139:1) <Route path="/Footers/Column-4">
    function create_default_slot_5(ctx) {
    	let footer_4columns;
    	let current;

    	footer_4columns = new Footer_4_Columns({
    			props: {
    				linkList1: navbarArray,
    				linkList2: navbarArray,
    				footerLogoUrl: "/img/logo.png",
    				footerLogoAlt: "",
    				contactList: iconList,
    				footerDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    				CustomerName: "Shia Labeouf"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(footer_4columns.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footer_4columns, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_4columns.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_4columns.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footer_4columns, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(139:1) <Route path=\\\"/Footers/Column-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (151:1) <Route path="/Grids/Responsive-Info">
    function create_default_slot_4(ctx) {
    	let responsivegridmoreinfo;
    	let current;

    	responsivegridmoreinfo = new Responsive_Grid_More_Info({
    			props: {
    				array: responsiveListMoreInfoList,
    				numberOfColumns: 2,
    				objWidth: "200px",
    				gridWidth: "100%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivegridmoreinfo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivegridmoreinfo, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivegridmoreinfo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivegridmoreinfo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivegridmoreinfo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(151:1) <Route path=\\\"/Grids/Responsive-Info\\\">",
    		ctx
    	});

    	return block;
    }

    // (160:1) <Route path="/Grids/Responsive-Info-Icons">
    function create_default_slot_3(ctx) {
    	let responsivegridicons;
    	let current;

    	responsivegridicons = new Responsive_Grid_Icons({
    			props: {
    				array: responsiveListIconList,
    				numberOfColumns: 3,
    				objWidth: "200px",
    				gridWidth: "100%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivegridicons.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivegridicons, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivegridicons.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivegridicons.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivegridicons, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(160:1) <Route path=\\\"/Grids/Responsive-Info-Icons\\\">",
    		ctx
    	});

    	return block;
    }

    // (169:1) <Route path="/Banners/OnlyButton">
    function create_default_slot_2(ctx) {
    	let onlybutton;
    	let current;

    	onlybutton = new Only_Button({
    			props: { buttonText: "I am a CTA", buttonUrl: "#" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(onlybutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(onlybutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(onlybutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(onlybutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(onlybutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(169:1) <Route path=\\\"/Banners/OnlyButton\\\">",
    		ctx
    	});

    	return block;
    }

    // (176:1) <Route path="/Banners/Paragraph-Button">
    function create_default_slot_1(ctx) {
    	let paragraphbutton;
    	let current;

    	paragraphbutton = new Paragraph_Button({
    			props: {
    				buttonText: "I am a CTA",
    				buttonUrl: "#",
    				paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paragraphbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paragraphbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paragraphbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paragraphbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paragraphbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(176:1) <Route path=\\\"/Banners/Paragraph-Button\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:0) <Router>
    function create_default_slot(ctx) {
    	let main;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let t4;
    	let route5;
    	let t5;
    	let route6;
    	let t6;
    	let route7;
    	let t7;
    	let route8;
    	let t8;
    	let route9;
    	let t9;
    	let route10;
    	let t10;
    	let route11;
    	let t11;
    	let route12;
    	let t12;
    	let route13;
    	let t13;
    	let route14;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "/Heroes/Fullscreen",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/Heroes/Halfscreen",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "/Info/1",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "/Info/1-Alt",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: "/Info/1-Alt",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: {
    				path: "/Info/1-Reversed",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route$1({
    			props: {
    				path: "/Info/Grids",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route$1({
    			props: {
    				path: "/Grids/Responsive",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route8 = new Route$1({
    			props: {
    				path: "/Tabs/Centered",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route9 = new Route$1({
    			props: {
    				path: "/Navbar/Traditional",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route10 = new Route$1({
    			props: {
    				path: "/Footers/Column-4",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route11 = new Route$1({
    			props: {
    				path: "/Grids/Responsive-Info",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route12 = new Route$1({
    			props: {
    				path: "/Grids/Responsive-Info-Icons",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route13 = new Route$1({
    			props: {
    				path: "/Banners/OnlyButton",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route14 = new Route$1({
    			props: {
    				path: "/Banners/Paragraph-Button",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			t4 = space();
    			create_component(route5.$$.fragment);
    			t5 = space();
    			create_component(route6.$$.fragment);
    			t6 = space();
    			create_component(route7.$$.fragment);
    			t7 = space();
    			create_component(route8.$$.fragment);
    			t8 = space();
    			create_component(route9.$$.fragment);
    			t9 = space();
    			create_component(route10.$$.fragment);
    			t10 = space();
    			create_component(route11.$$.fragment);
    			t11 = space();
    			create_component(route12.$$.fragment);
    			t12 = space();
    			create_component(route13.$$.fragment);
    			t13 = space();
    			create_component(route14.$$.fragment);
    			add_location(main, file, 40, 1, 1596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t0);
    			mount_component(route1, main, null);
    			append_dev(main, t1);
    			mount_component(route2, main, null);
    			append_dev(main, t2);
    			mount_component(route3, main, null);
    			append_dev(main, t3);
    			mount_component(route4, main, null);
    			append_dev(main, t4);
    			mount_component(route5, main, null);
    			append_dev(main, t5);
    			mount_component(route6, main, null);
    			append_dev(main, t6);
    			mount_component(route7, main, null);
    			append_dev(main, t7);
    			mount_component(route8, main, null);
    			append_dev(main, t8);
    			mount_component(route9, main, null);
    			append_dev(main, t9);
    			mount_component(route10, main, null);
    			append_dev(main, t10);
    			mount_component(route11, main, null);
    			append_dev(main, t11);
    			mount_component(route12, main, null);
    			append_dev(main, t12);
    			mount_component(route13, main, null);
    			append_dev(main, t13);
    			mount_component(route14, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    			const route9_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route9_changes.$$scope = { dirty, ctx };
    			}

    			route9.$set(route9_changes);
    			const route10_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route10_changes.$$scope = { dirty, ctx };
    			}

    			route10.$set(route10_changes);
    			const route11_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route11_changes.$$scope = { dirty, ctx };
    			}

    			route11.$set(route11_changes);
    			const route12_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route12_changes.$$scope = { dirty, ctx };
    			}

    			route12.$set(route12_changes);
    			const route13_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route13_changes.$$scope = { dirty, ctx };
    			}

    			route13.$set(route13_changes);
    			const route14_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route14_changes.$$scope = { dirty, ctx };
    			}

    			route14.$set(route14_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			transition_in(route11.$$.fragment, local);
    			transition_in(route12.$$.fragment, local);
    			transition_in(route13.$$.fragment, local);
    			transition_in(route14.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			transition_out(route11.$$.fragment, local);
    			transition_out(route12.$$.fragment, local);
    			transition_out(route13.$$.fragment, local);
    			transition_out(route14.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    			destroy_component(route8);
    			destroy_component(route9);
    			destroy_component(route10);
    			destroy_component(route11);
    			destroy_component(route12);
    			destroy_component(route13);
    			destroy_component(route14);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(40:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let library;
    	let t0;
    	let router;
    	let t1;
    	let form_1;
    	let current;
    	library = new Library({ $$inline: true });

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form_1 = new Form_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(library.$$.fragment);
    			t0 = space();
    			create_component(router.$$.fragment);
    			t1 = space();
    			create_component(form_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(library, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(router, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(form_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(library.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(form_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(library.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(form_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(library, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(form_1, detaching);
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

    	const tabChange = e => {
    		activeItem = e.detail;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Hero_Fullscreen,
    		HeroHalfscreen: Hero_Halfscreen,
    		HeroFullscreen: Hero_Fullscreen,
    		Library,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		masterComponentArray,
    		navbarArray,
    		iconList,
    		responsiveListMoreInfoList,
    		responsiveListIconList,
    		fourGrids,
    		Info_1,
    		ResponsiveGrid: Responsive_Grid,
    		Tab,
    		Navbar,
    		Footer_4Columns: Footer_4_Columns,
    		ResponsiveGridMoreInfo: Responsive_Grid_More_Info,
    		Info_1Alt: Info_1_Alt,
    		Info_1Alt_2: Info_1_Alt_2,
    		ResponsiveGridIcons: Responsive_Grid_Icons,
    		Info_4Grid: Info_4_Grid,
    		OnlyButton: Only_Button,
    		ParagraphButton: Paragraph_Button,
    		Form_1,
    		tabChange
    	});

    	return [tabChange];
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
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
