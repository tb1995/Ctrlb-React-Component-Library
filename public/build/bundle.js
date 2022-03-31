
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign$1(tar, src) {
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
            return noop$1;
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
            ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx)))
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
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space$1() {
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

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop$1;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop$1;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop$1, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
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
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
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

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
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
                block.p(child_ctx, dirty);
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
            update: noop$1,
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
            this.$destroy = noop$1;
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

    const file$v = "src/Components/Hero-Fullscreen.svelte";

    function create_fragment$w(ctx) {
    	let div1;
    	let div0;
    	let h1_1;
    	let t0;
    	let t1;
    	let p_1;
    	let t2;
    	let t3;
    	let a;
    	let t4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1_1 = element("h1");
    			t0 = text(/*h1*/ ctx[0]);
    			t1 = space$1();
    			p_1 = element("p");
    			t2 = text(/*p*/ ctx[1]);
    			t3 = space$1();
    			a = element("a");
    			t4 = text(/*ctaText*/ ctx[2]);
    			attr_dev(h1_1, "class", "hero-heading svelte-1n5p4xo");
    			add_location(h1_1, file$v, 13, 4, 396);
    			attr_dev(p_1, "class", "hero-para svelte-1n5p4xo");
    			add_location(p_1, file$v, 14, 4, 435);
    			attr_dev(a, "href", /*ctaUrl*/ ctx[3]);
    			attr_dev(a, "class", "hero-cta svelte-1n5p4xo");
    			add_location(a, file$v, 15, 4, 468);
    			attr_dev(div0, "class", "text-container svelte-1n5p4xo");
    			add_location(div0, file$v, 12, 4, 363);
    			attr_dev(div1, "class", "hero-1-container svelte-1n5p4xo");
    			set_style(div1, "background-image", "url(" + /*backgroundImageUrl*/ ctx[4] + ")");
    			add_location(div1, file$v, 10, 0, 274);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1_1);
    			append_dev(h1_1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p_1);
    			append_dev(p_1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, a);
    			append_dev(a, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*h1*/ 1) set_data_dev(t0, /*h1*/ ctx[0]);
    			if (dirty & /*p*/ 2) set_data_dev(t2, /*p*/ ctx[1]);
    			if (dirty & /*ctaText*/ 4) set_data_dev(t4, /*ctaText*/ ctx[2]);

    			if (dirty & /*ctaUrl*/ 8) {
    				attr_dev(a, "href", /*ctaUrl*/ ctx[3]);
    			}

    			if (dirty & /*backgroundImageUrl*/ 16) {
    				set_style(div1, "background-image", "url(" + /*backgroundImageUrl*/ ctx[4] + ")");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero_Fullscreen', slots, []);
    	let { h1 = "Bakery. Breakfast. Lunch. Perfection." } = $$props;
    	let { p = "Reinvented Pakistani and Indian flavors in a beautiful ambiance." } = $$props;
    	let { ctaText = "Order Now" } = $$props;
    	let { ctaUrl = "#" } = $$props;
    	let { backgroundImageUrl = "/img/hero-banner.jpg" } = $$props;
    	const writable_props = ['h1', 'p', 'ctaText', 'ctaUrl', 'backgroundImageUrl'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero_Fullscreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('h1' in $$props) $$invalidate(0, h1 = $$props.h1);
    		if ('p' in $$props) $$invalidate(1, p = $$props.p);
    		if ('ctaText' in $$props) $$invalidate(2, ctaText = $$props.ctaText);
    		if ('ctaUrl' in $$props) $$invalidate(3, ctaUrl = $$props.ctaUrl);
    		if ('backgroundImageUrl' in $$props) $$invalidate(4, backgroundImageUrl = $$props.backgroundImageUrl);
    	};

    	$$self.$capture_state = () => ({
    		h1,
    		p,
    		ctaText,
    		ctaUrl,
    		backgroundImageUrl
    	});

    	$$self.$inject_state = $$props => {
    		if ('h1' in $$props) $$invalidate(0, h1 = $$props.h1);
    		if ('p' in $$props) $$invalidate(1, p = $$props.p);
    		if ('ctaText' in $$props) $$invalidate(2, ctaText = $$props.ctaText);
    		if ('ctaUrl' in $$props) $$invalidate(3, ctaUrl = $$props.ctaUrl);
    		if ('backgroundImageUrl' in $$props) $$invalidate(4, backgroundImageUrl = $$props.backgroundImageUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [h1, p, ctaText, ctaUrl, backgroundImageUrl];
    }

    class Hero_Fullscreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			h1: 0,
    			p: 1,
    			ctaText: 2,
    			ctaUrl: 3,
    			backgroundImageUrl: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero_Fullscreen",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get h1() {
    		throw new Error("<Hero_Fullscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h1(value) {
    		throw new Error("<Hero_Fullscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get p() {
    		throw new Error("<Hero_Fullscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set p(value) {
    		throw new Error("<Hero_Fullscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ctaText() {
    		throw new Error("<Hero_Fullscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ctaText(value) {
    		throw new Error("<Hero_Fullscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ctaUrl() {
    		throw new Error("<Hero_Fullscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ctaUrl(value) {
    		throw new Error("<Hero_Fullscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundImageUrl() {
    		throw new Error("<Hero_Fullscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundImageUrl(value) {
    		throw new Error("<Hero_Fullscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Widgets/Buttons/Rectangular-Button.svelte generated by Svelte v3.46.4 */

    const file$u = "src/Widgets/Buttons/Rectangular-Button.svelte";

    function create_fragment$v(ctx) {
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*buttonText*/ ctx[0]);
    			attr_dev(a, "href", /*buttonUrl*/ ctx[1]);
    			attr_dev(a, "class", "hero-cta svelte-9uvq8i");
    			add_location(a, file$u, 5, 4, 77);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { buttonText: 0, buttonUrl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rectangular_Button",
    			options,
    			id: create_fragment$v.name
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
    const file$t = "src/Components/Hero-Halfscreen.svelte";

    function create_fragment$u(ctx) {
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
    			t1 = space$1();
    			p = element("p");
    			t2 = text(/*subheading*/ ctx[1]);
    			t3 = space$1();
    			create_component(rectangularbutton.$$.fragment);
    			attr_dev(h1, "class", "hero-heading svelte-yfo6rw");
    			add_location(h1, file$t, 13, 4, 221);
    			attr_dev(p, "class", "hero-subtext svelte-yfo6rw");
    			add_location(p, file$t, 14, 4, 263);
    			attr_dev(div, "class", "hero-container svelte-yfo6rw");
    			add_location(div, file$t, 12, 0, 188);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			title: 0,
    			subheading: 1,
    			buttonText: 2,
    			buttonUrl: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero_Halfscreen",
    			options,
    			id: create_fragment$u.name
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

    const isUndefined$1 = value => typeof value === "undefined";

    const isFunction$1 = value => typeof value === "function";

    const isNumber$2 = value => typeof value === "number";

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
    function writable(value, start = noop$1) {
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
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
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
            let cleanup = noop$1;
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
                    cleanup = is_function(result) ? result : noop$1;
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
    	const msg = isFunction$1(message) ? message(label) : message;
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

    			if (!isUndefined$1(routeSegment) && isSplat(routeSegment)) {
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

    			if (isUndefined$1(uriSegment)) {
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
    			if (isNumber$2(to)) {
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

    const file$s = "node_modules/svelte-navigator/src/Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$5(ctx) {
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
    			add_location(div, file$s, 195, 1, 5906);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space$1();
    			if (default_slot) default_slot.c();
    			t1 = space$1();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$s, 190, 0, 5750);
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$t($$self, $$props, $$invalidate) {
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
    			instance$t,
    			create_fragment$t,
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
    			id: create_fragment$t.name
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
    		const target = isNumber$2(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules/svelte-navigator/src/Route.svelte generated by Svelte v3.46.4 */
    const file$r = "node_modules/svelte-navigator/src/Route.svelte";

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
    function create_if_block$4(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$5] },
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
    		id: create_if_block$4.name,
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
    function create_if_block_1$3(ctx) {
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
    			switch_instance_props = assign$1(switch_instance_props, switch_instance_spread_levels[i]);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block];
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
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space$1();
    			if (if_block) if_block.c();
    			t1 = space$1();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$r, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$r, 121, 0, 3295);
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
    					if_block = create_if_block$4(ctx);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$s($$self, $$props, $$invalidate) {
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
    		$$invalidate(23, $$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props)));
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
    		$$invalidate(23, $$props = assign$1(assign$1({}, $$props), $$new_props));
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

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$s.name
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
    const file$q = "node_modules/svelte-navigator/src/Link.svelte";

    function create_fragment$r(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign$1(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$q, 63, 0, 1735);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		$$invalidate(18, $$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props)));
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
    		isFunction: isFunction$1,
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
    		$$invalidate(18, $$props = assign$1(assign$1({}, $$props), $$new_props));
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
    			if (isFunction$1(getProps)) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$r.name
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
    				},
    				{
    					title: "Hero Two Columns",
    					description: "Hero with two columns, one for images",
    					url: "/Heroes/TwoColumns",
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
    				},
    				{
                        title: "Info section With Form",
                        description: "Has a form with the info section",
                        url: "/Info/Form",
                        imgUrl: imgDirectory$1 + "info-1.png",
                        dependencies: [],
                        listOfProps: []
    				},
    				{
                        title: "Left Right Sections",
                        description: "Has responsive left right sections",
                        url: "/Info/Left-Right",
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
    				},
    				{
                        title: "Bordered Tabs",
                        description: "Tabs bordered KNC",
                        url: "/Tabs/Bordered",
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
    		},
    		{
    		label: "Forms",
    		list: [
                    {
                        title: "Form-1",
                        description: "Simple Form",
                        url: "/Forms/Form-1",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
    				},
                ]
    		},
    		{
    		label: "Galleries",
    		list: [
                    {
                        title: "Carousel style sliding Gallery",
                        description: "Simple Sliding Gallery",
                        url: "/Galleries/Basic",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
    				},
    				{
                        title: "KnC style 5 columns menu",
                        description: "Simple 5 column Gallery",
                        url: "/Galleries/KNC",
                        imgUrl: imgDirectory$1 + "Centered-Tabs.png",
                        dependencies: [],
                        listOfProps: []
    				},
                ]
    		},
    		{
    			label: "Contentful",
    			list: [
    				{
    					title: "Contentful Events",
                        description: "Events coming from eventful",
                        url: "/contentful/events",
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


    	let images = [
    		{
    			src: "/img/gallery/1.jpg",
    			alt: "image alt",
    			id: 1
    		},
    		{
    			src: "/img/gallery/2.jpg",
    			alt: "image alt",
    			id: 2
    		},
    		{
    			src: "/img/gallery/3.jpg",
    			alt: "image alt",
    			id: 3
    		},
    		{
    			src: "/img/gallery/4.jpg",
    			alt: "image alt",
    			id: 4
    		},
    		{
    			src: "/img/gallery/5.jpg",
    			alt: "image alt",
    			id: 5
    		},
    		{
    			src: "/img/gallery/6.jpg",
    			alt: "image alt",
    			id: 6
    		},
    		{
    			src: "/img/gallery/7.jpg",
    			alt: "image alt",
    			id: 7
    		},
    		{
    			src: "/img/gallery/8.jpg",
    			alt: "image alt",
    			id: 8
    		},
    		{
    			src: "/img/gallery/9.jpg",
    			alt: "image alt",
    			id: 9
    		},
    		{
    			src: "/img/gallery/10.jpg",
    			alt: "image alt",
    			id: 10
    		},
    		{
    			src: "/img/gallery/11.jpg",
    			alt: "image alt",
    			id: 11
    		},
    	];


    	let kncImages = [
    		{
    			src: "/img/sample-images/Santa-Clara.jpg",
    			alt: "image alt",
    			caption: "Santa Clara"
    		},
    		{
    			src: "/img/sample-images/Cupertino.jpg",
    			alt: "image alt",
    			caption: "Cupertino"
    		},
    		{
    			src: "/img/sample-images/MCA-Mosque.jpg",
    			alt: "image alt",
    			caption: "MCA Mosque"
    		},
    		{
    			src: "/img/sample-images/Santa-Clara-Kettlee.jpg",
    			alt: "image alt",
    			caption: "Santa Clara Kettlee"
    		},
    		{
    			src: "/img/sample-images/Catering.jpg",
    			alt: "image alt",
    			caption: "Catering"
    		}
    	];

    /* src/Components/Info-1.svelte generated by Svelte v3.46.4 */

    const file$p = "src/Components/Info-1.svelte";

    function create_fragment$q(ctx) {
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
    			t0 = space$1();
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = `${infoHeading}`;
    			t2 = space$1();
    			p = element("p");
    			p.textContent = `${infoPara}`;
    			t4 = space$1();
    			a = element("a");
    			t5 = text(infoCtaText);
    			if (!src_url_equal(img.src, img_src_value = infoImageUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "info-img");
    			add_location(img, file$p, 11, 4, 543);
    			attr_dev(div0, "class", "img-container svelte-3fpbm4");
    			add_location(div0, file$p, 10, 0, 511);
    			attr_dev(h2, "class", "info-heading svelte-3fpbm4");
    			add_location(h2, file$p, 14, 8, 647);
    			attr_dev(p, "class", "info-para svelte-3fpbm4");
    			add_location(p, file$p, 15, 4, 695);
    			attr_dev(a, "href", infoCtaUrl);
    			attr_dev(a, "class", "info-cta btn-style svelte-3fpbm4");
    			add_location(a, file$p, 16, 4, 735);
    			attr_dev(div1, "class", "info-text-container svelte-3fpbm4");
    			add_location(div1, file$p, 13, 4, 605);
    			attr_dev(div2, "class", "info-container svelte-3fpbm4");
    			add_location(div2, file$p, 9, 0, 482);
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
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
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

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_1",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src/Components/Tabs-Spaced/Tab.svelte generated by Svelte v3.46.4 */
    const file$o = "src/Components/Tabs-Spaced/Tab.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:4) {#each componentArray as item}
    function create_each_block$d(ctx) {
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
    			t1 = space$1();
    			add_location(div, file$o, 14, 8, 350);
    			attr_dev(li, "class", "svelte-1c8kiw3");
    			toggle_class(li, "active", /*item*/ ctx[4].label === /*activeItem*/ ctx[1]);
    			add_location(li, file$o, 13, 4, 243);
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
    				toggle_class(li, "active", /*item*/ ctx[4].label === /*activeItem*/ ctx[1]);
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
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(13:4) {#each componentArray as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div;
    	let ul;
    	let each_value = /*componentArray*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1c8kiw3");
    			add_location(ul, file$o, 11, 0, 199);
    			attr_dev(div, "class", "tabs svelte-1c8kiw3");
    			add_location(div, file$o, 10, 0, 180);
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
    			if (dirty & /*componentArray, activeItem, dispatch*/ 7) {
    				each_value = /*componentArray*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { componentArray: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$p.name
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

    const { console: console_1$8 } = globals;
    const file$n = "src/Components/Product-Grid/Responsive-Grid.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (75:12) <Link to="{obj.url}">
    function create_default_slot_1$4(ctx) {
    	let p;
    	let t_value = /*obj*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "title svelte-i7vgvc");
    			add_location(p, file$n, 74, 34, 1870);
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
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(75:12) <Link to=\\\"{obj.url}\\\">",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#each array as obj}
    function create_each_block$c(ctx) {
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
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space$1();
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space$1();
    			if (!src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "obj-img svelte-i7vgvc");
    			set_style(img, "width", /*gridWidth*/ ctx[1]);
    			set_style(img, "height", /*gridWidth*/ ctx[1]);
    			add_location(img, file$n, 70, 8, 1670);
    			attr_dev(div0, "class", "text-container svelte-i7vgvc");
    			set_style(div0, "width", /*gridWidth*/ ctx[1]);
    			add_location(div0, file$n, 72, 12, 1779);

    			attr_dev(div1, "class", div1_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-i7vgvc");

    			set_style(div1, "flex", "0 1 " + /*flexWidth*/ ctx[2]);
    			add_location(div1, file$n, 68, 8, 1553);
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
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(67:4) {#each array as obj}",
    		ctx
    	});

    	return block;
    }

    // (65:0) <Router>
    function create_default_slot$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*array*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
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
    			add_location(div, file$n, 65, 0, 1459);
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
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
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
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(65:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Responsive_Grid> was created with unknown prop '${key}'`);
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

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			array: 0,
    			numberOfColumns: 3,
    			objWidth: 4,
    			gridWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Responsive_Grid",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*array*/ ctx[0] === undefined && !('array' in props)) {
    			console_1$8.warn("<Responsive_Grid> was created without expected prop 'array'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$8.warn("<Responsive_Grid> was created without expected prop 'numberOfColumns'");
    		}

    		if (/*objWidth*/ ctx[4] === undefined && !('objWidth' in props)) {
    			console_1$8.warn("<Responsive_Grid> was created without expected prop 'objWidth'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$8.warn("<Responsive_Grid> was created without expected prop 'gridWidth'");
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

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (27:0) {#if activeItem === item.label}
    function create_if_block$3(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(27:0) {#if activeItem === item.label}",
    		ctx
    	});

    	return block;
    }

    // (24:0) {#each componentArray as item}
    function create_each_block$b(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*activeItem*/ ctx[0] === /*item*/ ctx[3].label && create_if_block$3(ctx);

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
    					if_block = create_if_block$3(ctx);
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
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(24:0) {#each componentArray as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
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
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    			t = space$1();

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
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const imgDirectory = "/img/component-images/";

    function instance$n($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Library",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/Components/Navbar-Traditional.svelte/navbar.svelte generated by Svelte v3.46.4 */
    const file$m = "src/Components/Navbar-Traditional.svelte/navbar.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (18:8) {#each navbarArray as navItem, index}
    function create_each_block$a(ctx) {
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
    			t1 = space$1();
    			attr_dev(a, "href", /*navItem*/ ctx[2].url);
    			attr_dev(a, "class", "svelte-1qvp7bk");
    			add_location(a, file$m, 19, 16, 509);
    			set_style(li, "animation", "navlinkFade 1.5s ease forwards " + (/*index*/ ctx[4] / 7 + 2.8) + "s");
    			attr_dev(li, "class", "svelte-1qvp7bk");
    			add_location(li, file$m, 18, 4, 419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(18:8) {#each navbarArray as navItem, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
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
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			img = element("img");
    			t0 = space$1();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space$1();
    			div4 = element("div");
    			div1 = element("div");
    			t2 = space$1();
    			div2 = element("div");
    			t3 = space$1();
    			div3 = element("div");
    			attr_dev(img, "class", "logo svelte-1qvp7bk");
    			if (!src_url_equal(img.src, img_src_value = logoUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", logoAlt);
    			add_location(img, file$m, 14, 4, 249);
    			attr_dev(div0, "class", "logo svelte-1qvp7bk");
    			add_location(div0, file$m, 13, 4, 226);
    			attr_dev(ul, "class", ul_class_value = "nav-links " + (/*isActive*/ ctx[0] ? 'nav-active' : '') + " svelte-1qvp7bk");
    			add_location(ul, file$m, 16, 4, 315);
    			attr_dev(div1, "class", " svelte-1qvp7bk");
    			add_location(div1, file$m, 24, 8, 649);
    			attr_dev(div2, "class", " svelte-1qvp7bk");
    			add_location(div2, file$m, 25, 8, 678);
    			attr_dev(div3, "class", " svelte-1qvp7bk");
    			add_location(div3, file$m, 26, 8, 707);
    			attr_dev(div4, "class", "burger svelte-1qvp7bk");
    			add_location(div4, file$m, 23, 0, 597);
    			attr_dev(nav, "class", "svelte-1qvp7bk");
    			add_location(nav, file$m, 12, 0, 216);
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
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const logoUrl = "/img/logo.png";
    const logoAlt = "";

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/Components/Footers/Footer-4-columns/Footer-4-Columns.svelte generated by Svelte v3.46.4 */
    const file$l = "src/Components/Footers/Footer-4-columns/Footer-4-Columns.svelte";

    function get_each_context$9(ctx, list, i) {
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
    			t1 = space$1();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[10].url);
    			attr_dev(a, "class", "svelte-tr0d1k");
    			add_location(a, file$l, 28, 16, 696);
    			attr_dev(li, "class", "svelte-tr0d1k");
    			add_location(li, file$l, 27, 16, 675);
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
    			t1 = space$1();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[10].url);
    			attr_dev(a, "class", "svelte-tr0d1k");
    			add_location(a, file$l, 35, 16, 899);
    			attr_dev(li, "class", "svelte-tr0d1k");
    			add_location(li, file$l, 34, 16, 878);
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
    function create_each_block$9(ctx) {
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
    			t0 = space$1();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space$1();
    			if (!src_url_equal(img.src, img_src_value = /*contact*/ ctx[7].iconUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*contact*/ ctx[7].iconAlt);
    			attr_dev(img, "class", "contact-logo svelte-tr0d1k");
    			add_location(img, file$l, 43, 12, 1119);
    			attr_dev(p, "class", "contact-text svelte-tr0d1k");
    			add_location(p, file$l, 44, 12, 1206);
    			attr_dev(div, "class", "contact-row svelte-tr0d1k");
    			add_location(div, file$l, 42, 12, 1081);
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
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(42:8) {#each contactList as contact}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
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
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space$1();
    			div0 = element("div");
    			t1 = text(/*footerDescription*/ ctx[1]);
    			t2 = space$1();
    			div2 = element("div");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t3 = space$1();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space$1();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space$1();
    			div5 = element("div");
    			p = element("p");
    			t6 = text("Copyright © ");
    			t7 = text(/*CustomerName*/ ctx[5]);
    			if (!src_url_equal(img.src, img_src_value = /*footerLogoUrl*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*footerLogoAlt*/ ctx[3]);
    			attr_dev(img, "class", "logo svelte-tr0d1k");
    			add_location(img, file$l, 18, 4, 404);
    			attr_dev(div0, "class", "description-text svelte-tr0d1k");
    			add_location(div0, file$l, 19, 8, 475);
    			attr_dev(div1, "class", "description svelte-tr0d1k");
    			add_location(div1, file$l, 17, 4, 374);
    			attr_dev(ul0, "class", "links-list svelte-tr0d1k");
    			add_location(ul0, file$l, 25, 8, 597);
    			attr_dev(ul1, "class", "links-list svelte-tr0d1k");
    			add_location(ul1, file$l, 32, 8, 798);
    			attr_dev(div2, "class", "links svelte-tr0d1k");
    			add_location(div2, file$l, 24, 4, 569);
    			attr_dev(div3, "class", "contact svelte-tr0d1k");
    			add_location(div3, file$l, 40, 4, 1008);
    			attr_dev(div4, "class", "footer-container svelte-tr0d1k");
    			add_location(div4, file$l, 16, 0, 339);
    			attr_dev(p, "class", "copyright-text svelte-tr0d1k");
    			add_location(p, file$l, 50, 0, 1327);
    			attr_dev(div5, "class", "copyright svelte-tr0d1k");
    			add_location(div5, file$l, 49, 0, 1303);
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
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
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
    		i: noop$1,
    		o: noop$1,
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
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
    			id: create_fragment$l.name
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

    const file$k = "src/Widgets/Buttons/Arrow-Icon-Button.svelte";

    function create_fragment$k(ctx) {
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
    			t1 = space$1();
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/img/arrow-right-long.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "arrow svelte-15xqoi8");
    			attr_dev(img, "alt", img_alt_value = "Go to " + /*buttonText*/ ctx[0]);
    			add_location(img, file$k, 5, 50, 123);
    			attr_dev(a, "href", /*buttonUrl*/ ctx[1]);
    			attr_dev(a, "class", "button svelte-15xqoi8");
    			add_location(a, file$k, 5, 0, 73);
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
    		i: noop$1,
    		o: noop$1,
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { buttonText: 0, buttonUrl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow_Icon_Button",
    			options,
    			id: create_fragment$k.name
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

    const { console: console_1$7 } = globals;
    const file$j = "src/Components/Product-Grid/Responsive-Grid-More-Info.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (56:12) <Link to="{obj.url}">
    function create_default_slot_1$3(ctx) {
    	let p;
    	let t_value = /*obj*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "title svelte-18hpea5");
    			add_location(p, file$j, 55, 34, 1426);
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
    		source: "(56:12) <Link to=\\\"{obj.url}\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#each array as obj}
    function create_each_block$8(ctx) {
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
    				$$slots: { default: [create_default_slot_1$3] },
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
    			t0 = space$1();
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space$1();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space$1();
    			create_component(arrowiconbutton.$$.fragment);
    			t4 = space$1();
    			if (!src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "obj-img svelte-18hpea5");
    			set_style(img, "width", /*gridWidth*/ ctx[1]);
    			set_style(img, "height", /*gridWidth*/ ctx[1]);
    			add_location(img, file$j, 51, 8, 1226);
    			attr_dev(p, "class", "paragraph svelte-18hpea5");
    			add_location(p, file$j, 56, 12, 1479);
    			attr_dev(div0, "class", "text-container svelte-18hpea5");
    			set_style(div0, "width", /*gridWidth*/ ctx[1]);
    			add_location(div0, file$j, 53, 12, 1335);

    			attr_dev(div1, "class", div1_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-18hpea5");

    			set_style(div1, "flex", "0 1 " + /*flexWidth*/ ctx[2]);
    			add_location(div1, file$j, 49, 8, 1109);
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
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(48:4) {#each array as obj}",
    		ctx
    	});

    	return block;
    }

    // (46:0) <Router>
    function create_default_slot$3(ctx) {
    	let div;
    	let current;
    	let each_value = /*array*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
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
    			add_location(div, file$j, 46, 0, 1015);
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
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
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
    		source: "(46:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
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
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Responsive_Grid_More_Info> was created with unknown prop '${key}'`);
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

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			array: 0,
    			numberOfColumns: 3,
    			objWidth: 4,
    			gridWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Responsive_Grid_More_Info",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*array*/ ctx[0] === undefined && !('array' in props)) {
    			console_1$7.warn("<Responsive_Grid_More_Info> was created without expected prop 'array'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$7.warn("<Responsive_Grid_More_Info> was created without expected prop 'numberOfColumns'");
    		}

    		if (/*objWidth*/ ctx[4] === undefined && !('objWidth' in props)) {
    			console_1$7.warn("<Responsive_Grid_More_Info> was created without expected prop 'objWidth'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$7.warn("<Responsive_Grid_More_Info> was created without expected prop 'gridWidth'");
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
    const file$i = "src/Components/Info-Sections/Info-1-Alt.svelte";

    function create_fragment$i(ctx) {
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
    			t0 = space$1();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(/*tinyTopText*/ ctx[1]);
    			t2 = space$1();
    			h2 = element("h2");
    			t3 = text(/*infoHeading*/ ctx[0]);
    			t4 = space$1();
    			p1 = element("p");
    			t5 = text(/*infoPara*/ ctx[2]);
    			t6 = space$1();
    			create_component(arrowiconbutton.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*imgUrl*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*imgAlt*/ ctx[6]);
    			attr_dev(img, "class", "info-img");
    			add_location(img, file$i, 15, 8, 319);
    			attr_dev(div0, "class", "img-container svelte-ofg0ml");
    			add_location(div0, file$i, 14, 4, 283);
    			attr_dev(p0, "class", "tiny-text svelte-ofg0ml");
    			add_location(p0, file$i, 18, 12, 437);
    			attr_dev(h2, "class", "info-heading svelte-ofg0ml");
    			add_location(h2, file$i, 19, 12, 488);
    			attr_dev(p1, "class", "info-para svelte-ofg0ml");
    			add_location(p1, file$i, 20, 12, 544);
    			attr_dev(div1, "class", "info-text-container svelte-ofg0ml");
    			add_location(div1, file$i, 17, 8, 391);
    			attr_dev(div2, "class", "info-container svelte-ofg0ml");
    			add_location(div2, file$i, 13, 0, 250);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
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
    			id: create_fragment$i.name
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
    const file$h = "src/Components/Info-Sections/Info-1-Alt-2.svelte";

    function create_fragment$h(ctx) {
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
    			t0 = space$1();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(/*tinyTopText*/ ctx[1]);
    			t2 = space$1();
    			h2 = element("h2");
    			t3 = text(/*infoHeading*/ ctx[0]);
    			t4 = space$1();
    			p1 = element("p");
    			t5 = text(/*infoPara*/ ctx[2]);
    			t6 = space$1();
    			create_component(arrowiconbutton.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*imgUrl*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*imgAlt*/ ctx[6]);
    			attr_dev(img, "class", "info-img");
    			add_location(img, file$h, 15, 8, 319);
    			attr_dev(div0, "class", "img-container svelte-1760z9u");
    			add_location(div0, file$h, 14, 4, 283);
    			attr_dev(p0, "class", "tiny-text svelte-1760z9u");
    			add_location(p0, file$h, 18, 12, 437);
    			attr_dev(h2, "class", "info-heading svelte-1760z9u");
    			add_location(h2, file$h, 19, 12, 488);
    			attr_dev(p1, "class", "info-para svelte-1760z9u");
    			add_location(p1, file$h, 20, 12, 544);
    			attr_dev(div1, "class", "info-text-container svelte-1760z9u");
    			add_location(div1, file$h, 17, 8, 391);
    			attr_dev(div2, "class", "info-container svelte-1760z9u");
    			add_location(div2, file$h, 13, 0, 250);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
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
    			id: create_fragment$h.name
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

    const { console: console_1$6 } = globals;
    const file$g = "src/Components/Product-Grid/Responsive-Grid-Icons.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (51:12) <Link to="{obj.url}">
    function create_default_slot_1$2(ctx) {
    	let p;
    	let t_value = /*obj*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "title svelte-1ilif4");
    			add_location(p, file$g, 50, 34, 1093);
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
    		source: "(51:12) <Link to=\\\"{obj.url}\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#each array as obj}
    function create_each_block$7(ctx) {
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
    			div2 = element("div");
    			img = element("img");
    			t0 = space$1();
    			div1 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space$1();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space$1();
    			div0 = element("div");
    			create_component(arrowiconbutton.$$.fragment);
    			t4 = space$1();
    			if (!src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].imgUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "obj-img svelte-1ilif4");
    			add_location(img, file$g, 46, 8, 941);
    			attr_dev(p, "class", "paragraph svelte-1ilif4");
    			add_location(p, file$g, 51, 12, 1146);
    			attr_dev(div0, "class", "absolute svelte-1ilif4");
    			add_location(div0, file$g, 53, 12, 1212);
    			attr_dev(div1, "class", "text-container svelte-1ilif4");
    			set_style(div1, "width", /*gridWidth*/ ctx[1]);
    			add_location(div1, file$g, 48, 12, 1002);

    			attr_dev(div2, "class", div2_class_value = "obj " + (/*obj*/ ctx[6].title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-1ilif4");

    			set_style(div2, "flex", "0 1 " + /*flexWidth*/ ctx[2]);
    			add_location(div2, file$g, 44, 8, 824);
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
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(43:4) {#each array as obj}",
    		ctx
    	});

    	return block;
    }

    // (41:0) <Router>
    function create_default_slot$2(ctx) {
    	let div;
    	let current;
    	let each_value = /*array*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
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
    			add_location(div, file$g, 41, 0, 730);
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
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
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
    		source: "(41:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Responsive_Grid_Icons> was created with unknown prop '${key}'`);
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

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			array: 0,
    			numberOfColumns: 3,
    			objWidth: 4,
    			gridWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Responsive_Grid_Icons",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*array*/ ctx[0] === undefined && !('array' in props)) {
    			console_1$6.warn("<Responsive_Grid_Icons> was created without expected prop 'array'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$6.warn("<Responsive_Grid_Icons> was created without expected prop 'numberOfColumns'");
    		}

    		if (/*objWidth*/ ctx[4] === undefined && !('objWidth' in props)) {
    			console_1$6.warn("<Responsive_Grid_Icons> was created without expected prop 'objWidth'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$6.warn("<Responsive_Grid_Icons> was created without expected prop 'gridWidth'");
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
    const file$f = "src/Components/Info-Sections/Info-4-Grid.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (17:8) {#each fourGrids as grid}
    function create_each_block$6(ctx) {
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
    			t1 = space$1();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space$1();
    			attr_dev(div0, "class", "grid-heading svelte-17yu443");
    			add_location(div0, file$f, 18, 16, 415);
    			attr_dev(div1, "class", "grid-paragraph svelte-17yu443");
    			add_location(div1, file$f, 19, 16, 478);
    			attr_dev(div2, "class", "grid svelte-17yu443");
    			add_location(div2, file$f, 17, 12, 380);
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(17:8) {#each fourGrids as grid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
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
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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

    			t0 = space$1();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(/*tinyTopText*/ ctx[1]);
    			t2 = space$1();
    			h2 = element("h2");
    			t3 = text(/*infoHeading*/ ctx[0]);
    			t4 = space$1();
    			p1 = element("p");
    			t5 = text(/*infoPara*/ ctx[2]);
    			t6 = space$1();
    			create_component(arrowiconbutton.$$.fragment);
    			attr_dev(div0, "class", "grid-container svelte-17yu443");
    			add_location(div0, file$f, 15, 4, 305);
    			attr_dev(p0, "class", "tiny-text svelte-17yu443");
    			add_location(p0, file$f, 24, 12, 629);
    			attr_dev(h2, "class", "info-heading svelte-17yu443");
    			add_location(h2, file$f, 25, 12, 680);
    			attr_dev(p1, "class", "info-para svelte-17yu443");
    			add_location(p1, file$f, 26, 12, 736);
    			attr_dev(div1, "class", "info-text-container svelte-17yu443");
    			add_location(div1, file$f, 23, 8, 583);
    			attr_dev(div2, "class", "info-container svelte-17yu443");
    			add_location(div2, file$f, 14, 0, 272);
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
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
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
    			id: create_fragment$f.name
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
    const file$e = "src/Components/Banners/Only-Button.svelte";

    function create_fragment$e(ctx) {
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
    			add_location(div, file$e, 7, 0, 155);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { buttonText: 0, buttonUrl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Only_Button",
    			options,
    			id: create_fragment$e.name
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
    const file$d = "src/Components/Banners/Paragraph-Button.svelte";

    function create_fragment$d(ctx) {
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
    			t1 = space$1();
    			div1 = element("div");
    			create_component(rectangularbutton.$$.fragment);
    			attr_dev(p, "class", "paragraph svelte-1oek4y6");
    			add_location(p, file$d, 10, 4, 239);
    			attr_dev(div0, "class", "text-container svelte-1oek4y6");
    			add_location(div0, file$d, 9, 4, 206);
    			attr_dev(div1, "class", "button-container svelte-1oek4y6");
    			add_location(div1, file$d, 12, 4, 291);
    			attr_dev(div2, "class", "banner svelte-1oek4y6");
    			add_location(div2, file$d, 8, 0, 181);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			buttonText: 0,
    			buttonUrl: 1,
    			paragraph: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph_Button",
    			options,
    			id: create_fragment$d.name
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

    const emailPattern$2 =     /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern$2 =  /^(\\d{1,3}[- ]?)?\d{10}$/;



    function validateName(name) {
        if(name.length < 1) {
            return false;
        } else {
            return true;
        }
    }

    function validateEmail(email) {
     if(emailPattern$2.test(email)) {
         return true;
     } else {
         return false;
     }
    }

    function validatePhone(phone) {
        if(mobilePattern$2.test(phone)) {
            return true
        } else {
            return false
        }
    }

    /* src/Components/Forms/Form-1.svelte generated by Svelte v3.46.4 */

    const { console: console_1$5 } = globals;
    const file$c = "src/Components/Forms/Form-1.svelte";

    // (117:1) {#if isSuccessVisible}
    function create_if_block_1$2(ctx) {
    	let p;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Data updated successfully";
    			attr_dev(p, "class", "error-alert svelte-14ytybk");
    			add_location(p, file$c, 117, 2, 2441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			current = true;
    		},
    		p: noop$1,
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(117:1) {#if isSuccessVisible}",
    		ctx
    	});

    	return block;
    }

    // (114:0) {#if hasError == true}
    function create_if_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${errMessage$1}`;
    			attr_dev(p, "class", "error-alert svelte-14ytybk");
    			add_location(p, file$c, 114, 2, 2366);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(114:0) {#if hasError == true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div5;
    	let form;
    	let h3;
    	let t1;
    	let t2;
    	let h4;
    	let t3;
    	let t4;
    	let div0;
    	let input0;
    	let input0_class_value;
    	let t5;
    	let div1;
    	let input1;
    	let input1_class_value;
    	let t6;
    	let div2;
    	let input2;
    	let input2_class_value;
    	let t7;
    	let div3;
    	let input3;
    	let input3_class_value;
    	let t8;
    	let div4;
    	let textarea;
    	let t9;
    	let button;
    	let t11;
    	let link;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2];
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
    			if (if_block) if_block.c();
    			t0 = space$1();
    			div5 = element("div");
    			form = element("form");
    			h3 = element("h3");
    			t1 = text(/*formTitle*/ ctx[0]);
    			t2 = space$1();
    			h4 = element("h4");
    			t3 = text(/*formMessage*/ ctx[1]);
    			t4 = space$1();
    			div0 = element("div");
    			input0 = element("input");
    			t5 = space$1();
    			div1 = element("div");
    			input1 = element("input");
    			t6 = space$1();
    			div2 = element("div");
    			input2 = element("input");
    			t7 = space$1();
    			div3 = element("div");
    			input3 = element("input");
    			t8 = space$1();
    			div4 = element("div");
    			textarea = element("textarea");
    			t9 = space$1();
    			button = element("button");
    			button.textContent = "Continue";
    			t11 = space$1();
    			link = element("link");
    			attr_dev(h3, "class", "svelte-14ytybk");
    			add_location(h3, file$c, 123, 4, 2663);
    			attr_dev(h4, "class", "svelte-14ytybk");
    			add_location(h4, file$c, 124, 2, 2686);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", input0_class_value = "form-control " + (/*errorsValid*/ ctx[5].firstNameValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input0, "placeholder", "First name");
    			input0.required = true;
    			add_location(input0, file$c, 126, 4, 2740);
    			attr_dev(div0, "class", "form-group svelte-14ytybk");
    			add_location(div0, file$c, 125, 2, 2711);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", input1_class_value = "form-control " + (/*errorsValid*/ ctx[5].lastNameValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input1, "placeholder", "Last name");
    			input1.required = true;
    			add_location(input1, file$c, 130, 4, 2965);
    			attr_dev(div1, "class", "form-group svelte-14ytybk");
    			add_location(div1, file$c, 129, 2, 2936);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "class", input2_class_value = "form-control " + (/*errorsValid*/ ctx[5].emailValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input2, "placeholder", "Email");
    			input2.required = true;
    			add_location(input2, file$c, 134, 3, 3195);
    			attr_dev(div2, "class", "form-group svelte-14ytybk");
    			add_location(div2, file$c, 133, 4, 3167);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", input3_class_value = "form-control " + (/*errorsValid*/ ctx[5].phoneNumberValid ? '' : 'invalid') + " svelte-14ytybk");
    			attr_dev(input3, "placeholder", "Contact number");
    			input3.required = true;
    			add_location(input3, file$c, 138, 3, 3420);
    			attr_dev(div3, "class", "form-group svelte-14ytybk");
    			add_location(div3, file$c, 137, 4, 3392);
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "class", "form-control svelte-14ytybk");
    			attr_dev(textarea, "placeholder", "Give us the deets");
    			add_location(textarea, file$c, 142, 6, 3667);
    			attr_dev(div4, "class", "form-group svelte-14ytybk");
    			add_location(div4, file$c, 141, 4, 3636);
    			attr_dev(button, "class", "btn btn-full svelte-14ytybk");
    			add_location(button, file$c, 146, 2, 3799);
    			attr_dev(form, "id", "surveyForm");
    			attr_dev(form, "class", "mt-4 svelte-14ytybk");
    			toggle_class(form, "submitted", /*submitted*/ ctx[3]);
    			add_location(form, file$c, 122, 2, 2567);
    			attr_dev(div5, "class", "container svelte-14ytybk");
    			add_location(div5, file$c, 121, 0, 2541);
    			attr_dev(link, "href", "https://gist.githubusercontent.com/Ajax30/08899d40e16069cd517b9756dc900acc/raw/04e4f9997245df079fa8500690d1878311115b20/global.css");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "crossorigin", "anonymous");
    			attr_dev(link, "class", "svelte-14ytybk");
    			add_location(link, file$c, 150, 0, 3898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, form);
    			append_dev(form, h3);
    			append_dev(h3, t1);
    			append_dev(form, t2);
    			append_dev(form, h4);
    			append_dev(h4, t3);
    			append_dev(form, t4);
    			append_dev(form, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*fields*/ ctx[4].firstName);
    			append_dev(form, t5);
    			append_dev(form, div1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*fields*/ ctx[4].lastName);
    			append_dev(form, t6);
    			append_dev(form, div2);
    			append_dev(div2, input2);
    			set_input_value(input2, /*fields*/ ctx[4].email);
    			append_dev(form, t7);
    			append_dev(form, div3);
    			append_dev(div3, input3);
    			set_input_value(input3, /*fields*/ ctx[4].phoneNumber);
    			append_dev(form, t8);
    			append_dev(form, div4);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*fields*/ ctx[4].messageArea);
    			append_dev(form, t9);
    			append_dev(form, button);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, link, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input0, "keyup", /*validateFirstName*/ ctx[7], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input1, "keyup", /*validateLastName*/ ctx[8], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15]),
    					listen_dev(input2, "keyup", /*validateEmailAddress*/ ctx[9], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(input3, "keyup", /*validatePhoneNumber*/ ctx[10], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[17]),
    					listen_dev(button, "click", /*click_handler*/ ctx[18], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[11]), false, true, false)
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
    					if_block.m(t0.parentNode, t0);
    				} else {
    					if_block = null;
    				}
    			}

    			if (!current || dirty & /*formTitle*/ 1) set_data_dev(t1, /*formTitle*/ ctx[0]);
    			if (!current || dirty & /*formMessage*/ 2) set_data_dev(t3, /*formMessage*/ ctx[1]);

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
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(link);
    			mounted = false;
    			run_all(dispose);
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

    const emailPattern$1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern$1 = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    const errMessage$1 = "All the fields are mandatory";

    function instance$c($$self, $$props, $$invalidate) {
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

    	function validateFirstName() {
    		if (validateName(fields.firstName)) {
    			$$invalidate(5, errorsValid.firstNameValid = true, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.firstNameValid = false, errorsValid);
    		}
    	}

    	function validateLastName() {
    		if (validateName(fields.lastName)) {
    			$$invalidate(5, errorsValid.lastNameValid = true, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.lastNameValid = false, errorsValid);
    		}
    	}

    	function validateEmailAddress() {
    		if (validateEmail(fields.email)) {
    			$$invalidate(5, errorsValid.emailValid = true, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.emailValid = false, errorsValid);
    		}
    	}

    	function validatePhoneNumber() {
    		if (validatePhone(fields.phoneNumber)) {
    			$$invalidate(5, errorsValid.phoneNumberValid = true, errorsValid);
    		} else {
    			$$invalidate(5, errorsValid.phoneNumberValid = false, errorsValid);
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

    		if (!emailPattern$1.test(fields.email)) {
    			errors.lastName = "Please enter a valid email address";
    		}

    		if (!mobilePattern$1.test(fields.phoneNumber)) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Form_1> was created with unknown prop '${key}'`);
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
    		if ('sendToEmail' in $$props) $$invalidate(12, sendToEmail = $$props.sendToEmail);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		validateName,
    		validateEmail,
    		validatePhone,
    		formTitle,
    		formMessage,
    		sendToEmail,
    		hasError,
    		isSuccessVisible,
    		submitted,
    		emailPattern: emailPattern$1,
    		mobilePattern: mobilePattern$1,
    		errMessage: errMessage$1,
    		fields,
    		errors,
    		errorsValid,
    		valid,
    		validateFirstName,
    		validateLastName,
    		validateEmailAddress,
    		validatePhoneNumber,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('formTitle' in $$props) $$invalidate(0, formTitle = $$props.formTitle);
    		if ('formMessage' in $$props) $$invalidate(1, formMessage = $$props.formMessage);
    		if ('sendToEmail' in $$props) $$invalidate(12, sendToEmail = $$props.sendToEmail);
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
    		validateFirstName,
    		validateLastName,
    		validateEmailAddress,
    		validatePhoneNumber,
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

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			formTitle: 0,
    			formMessage: 1,
    			sendToEmail: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form_1",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sendToEmail*/ ctx[12] === undefined && !('sendToEmail' in props)) {
    			console_1$5.warn("<Form_1> was created without expected prop 'sendToEmail'");
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

    /* src/Components/Galleries/Full-Length-Gallery.svelte generated by Svelte v3.46.4 */

    const { console: console_1$4 } = globals;
    const file$b = "src/Components/Galleries/Full-Length-Gallery.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (34:4) {#each images as image}
    function create_each_block$5(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space$1();
    			attr_dev(img, "class", "image");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[6].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*image*/ ctx[6].alt);
    			set_style(img, "width", /*gridWidth*/ ctx[1]);
    			set_style(img, "height", /*gridWidth*/ ctx[1]);
    			add_location(img, file$b, 37, 8, 876);

    			attr_dev(div, "class", div_class_value = "image " + (/*image*/ ctx[6].alt === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-1noqgmm");

    			set_style(div, "flex", "0 1 " + /*widthOfImage*/ ctx[2]);
    			add_location(div, file$b, 35, 4, 750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*images*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[6].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*images*/ 1 && img_alt_value !== (img_alt_value = /*image*/ ctx[6].alt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*gridWidth*/ 2) {
    				set_style(img, "width", /*gridWidth*/ ctx[1]);
    			}

    			if (dirty & /*gridWidth*/ 2) {
    				set_style(img, "height", /*gridWidth*/ ctx[1]);
    			}

    			if (dirty & /*images*/ 1 && div_class_value !== (div_class_value = "image " + (/*image*/ ctx[6].alt === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-1noqgmm")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(34:4) {#each images as image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "gallery-container svelte-1noqgmm");
    			set_style(div, "width", /*gridWidth*/ ctx[1]);
    			add_location(div, file$b, 31, 0, 657);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*images, widthOfImage, gridWidth*/ 7) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*gridWidth*/ 2) {
    				set_style(div, "width", /*gridWidth*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Full_Length_Gallery', slots, []);
    	let { images } = $$props;
    	let { gridWidth } = $$props;
    	let { numberOfColumns } = $$props;

    	// numberOfColumns += 1;
    	let flexWidth = 100 / numberOfColumns + "%";

    	let dividor = Math.min(images.length, 4);
    	console.log(dividor);
    	let widthOfImage = 100 / numberOfColumns + "%";

    	beforeUpdate(() => {
    		let remainder = images.length % numberOfColumns;

    		for (let i = 0; i < numberOfColumns - remainder; i++) {
    			console.log("Here " + i);

    			images.push({
    				invisible: true,
    				src: "",
    				alt: "ThisIsInvisible123"
    			});
    		}
    	});

    	const writable_props = ['images', 'gridWidth', 'numberOfColumns'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Full_Length_Gallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		images,
    		gridWidth,
    		numberOfColumns,
    		flexWidth,
    		dividor,
    		widthOfImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('flexWidth' in $$props) flexWidth = $$props.flexWidth;
    		if ('dividor' in $$props) dividor = $$props.dividor;
    		if ('widthOfImage' in $$props) $$invalidate(2, widthOfImage = $$props.widthOfImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [images, gridWidth, widthOfImage, numberOfColumns];
    }

    class Full_Length_Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			images: 0,
    			gridWidth: 1,
    			numberOfColumns: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Full_Length_Gallery",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*images*/ ctx[0] === undefined && !('images' in props)) {
    			console_1$4.warn("<Full_Length_Gallery> was created without expected prop 'images'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$4.warn("<Full_Length_Gallery> was created without expected prop 'gridWidth'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$4.warn("<Full_Length_Gallery> was created without expected prop 'numberOfColumns'");
    		}
    	}

    	get images() {
    		throw new Error("<Full_Length_Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<Full_Length_Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridWidth() {
    		throw new Error("<Full_Length_Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridWidth(value) {
    		throw new Error("<Full_Length_Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfColumns() {
    		throw new Error("<Full_Length_Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfColumns(value) {
    		throw new Error("<Full_Length_Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Galleries/KnC-Style-Gallery.svelte generated by Svelte v3.46.4 */

    const { console: console_1$3 } = globals;
    const file$a = "src/Components/Galleries/KnC-Style-Gallery.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (37:4) {#each images as image}
    function create_each_block$4(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let p;
    	let t1_value = /*image*/ ctx[7].caption + "";
    	let t1;
    	let t2;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space$1();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space$1();
    			attr_dev(img, "class", "image svelte-6o5j69");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[7].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*image*/ ctx[7].alt);
    			set_style(img, "width", "100%");
    			add_location(img, file$a, 40, 8, 986);
    			attr_dev(p, "class", "image-caption svelte-6o5j69");
    			add_location(p, file$a, 42, 0, 1072);

    			attr_dev(div, "class", div_class_value = "image-container " + (/*image*/ ctx[7].alt === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-6o5j69");

    			set_style(div, "flex", "1 1 " + /*widthOfImage*/ ctx[2]);
    			add_location(div, file$a, 38, 4, 850);
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
    			if (dirty & /*images*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[7].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*images*/ 1 && img_alt_value !== (img_alt_value = /*image*/ ctx[7].alt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*images*/ 1 && t1_value !== (t1_value = /*image*/ ctx[7].caption + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*images*/ 1 && div_class_value !== (div_class_value = "image-container " + (/*image*/ ctx[7].alt === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-6o5j69")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(37:4) {#each images as image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "gallery-container svelte-6o5j69");
    			set_style(div, "width", /*gridWidth*/ ctx[1]);
    			add_location(div, file$a, 34, 0, 757);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*images, widthOfImage*/ 5) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*gridWidth*/ 2) {
    				set_style(div, "width", /*gridWidth*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('KnC_Style_Gallery', slots, []);
    	let { images } = $$props;
    	let { gridWidth } = $$props;
    	let { imageWidth } = $$props;
    	let { numberOfColumns } = $$props;
    	console.log(images);
    	numberOfColumns += 1;
    	let flexWidth = 100 / numberOfColumns + "%";
    	let dividor = Math.min(images.length, 4);
    	console.log(dividor);
    	let widthOfImage = 100 / numberOfColumns + "%";

    	beforeUpdate(() => {
    		images.length % numberOfColumns;
    	}); // for(let i = 0; i < (numberOfColumns - remainder); i++) {
    	//     console.log("Here " + i);
    	//     images.push({
    	//     invisible: true,

    	const writable_props = ['images', 'gridWidth', 'imageWidth', 'numberOfColumns'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<KnC_Style_Gallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('imageWidth' in $$props) $$invalidate(4, imageWidth = $$props.imageWidth);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		images,
    		gridWidth,
    		imageWidth,
    		numberOfColumns,
    		flexWidth,
    		dividor,
    		widthOfImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('imageWidth' in $$props) $$invalidate(4, imageWidth = $$props.imageWidth);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('flexWidth' in $$props) flexWidth = $$props.flexWidth;
    		if ('dividor' in $$props) dividor = $$props.dividor;
    		if ('widthOfImage' in $$props) $$invalidate(2, widthOfImage = $$props.widthOfImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [images, gridWidth, widthOfImage, numberOfColumns, imageWidth];
    }

    class KnC_Style_Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			images: 0,
    			gridWidth: 1,
    			imageWidth: 4,
    			numberOfColumns: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KnC_Style_Gallery",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*images*/ ctx[0] === undefined && !('images' in props)) {
    			console_1$3.warn("<KnC_Style_Gallery> was created without expected prop 'images'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1$3.warn("<KnC_Style_Gallery> was created without expected prop 'gridWidth'");
    		}

    		if (/*imageWidth*/ ctx[4] === undefined && !('imageWidth' in props)) {
    			console_1$3.warn("<KnC_Style_Gallery> was created without expected prop 'imageWidth'");
    		}

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$3.warn("<KnC_Style_Gallery> was created without expected prop 'numberOfColumns'");
    		}
    	}

    	get images() {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridWidth() {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridWidth(value) {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageWidth() {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageWidth(value) {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfColumns() {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfColumns(value) {
    		throw new Error("<KnC_Style_Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Forms/Form-2.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$9 = "src/Components/Forms/Form-2.svelte";

    // (117:1) {#if isSuccessVisible}
    function create_if_block_1$1(ctx) {
    	let p;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Data updated successfully";
    			attr_dev(p, "class", "error-alert svelte-157jl6a");
    			add_location(p, file$9, 117, 2, 2441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			current = true;
    		},
    		p: noop$1,
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(117:1) {#if isSuccessVisible}",
    		ctx
    	});

    	return block;
    }

    // (114:0) {#if hasError == true}
    function create_if_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${errMessage}`;
    			attr_dev(p, "class", "error-alert svelte-157jl6a");
    			add_location(p, file$9, 114, 2, 2366);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(114:0) {#if hasError == true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div5;
    	let form;
    	let h4;
    	let t1;
    	let t2;
    	let div0;
    	let input0;
    	let input0_class_value;
    	let t3;
    	let div1;
    	let input1;
    	let input1_class_value;
    	let t4;
    	let div2;
    	let input2;
    	let input2_class_value;
    	let t5;
    	let div3;
    	let input3;
    	let input3_class_value;
    	let t6;
    	let div4;
    	let textarea;
    	let t7;
    	let button;
    	let t9;
    	let link;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_if_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*hasError*/ ctx[5] == true) return 0;
    		if (/*isSuccessVisible*/ ctx[1]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space$1();
    			div5 = element("div");
    			form = element("form");
    			h4 = element("h4");
    			t1 = text(/*formMessage*/ ctx[0]);
    			t2 = space$1();
    			div0 = element("div");
    			input0 = element("input");
    			t3 = space$1();
    			div1 = element("div");
    			input1 = element("input");
    			t4 = space$1();
    			div2 = element("div");
    			input2 = element("input");
    			t5 = space$1();
    			div3 = element("div");
    			input3 = element("input");
    			t6 = space$1();
    			div4 = element("div");
    			textarea = element("textarea");
    			t7 = space$1();
    			button = element("button");
    			button.textContent = "Continue";
    			t9 = space$1();
    			link = element("link");
    			attr_dev(h4, "class", "svelte-157jl6a");
    			add_location(h4, file$9, 124, 2, 2698);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", input0_class_value = "form-control " + (/*errorsValid*/ ctx[4].firstNameValid ? '' : 'invalid') + " svelte-157jl6a");
    			attr_dev(input0, "placeholder", "First name");
    			input0.required = true;
    			add_location(input0, file$9, 126, 4, 2752);
    			attr_dev(div0, "class", "form-group svelte-157jl6a");
    			add_location(div0, file$9, 125, 2, 2723);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", input1_class_value = "form-control " + (/*errorsValid*/ ctx[4].lastNameValid ? '' : 'invalid') + " svelte-157jl6a");
    			attr_dev(input1, "placeholder", "Last name");
    			input1.required = true;
    			add_location(input1, file$9, 130, 4, 2977);
    			attr_dev(div1, "class", "form-group svelte-157jl6a");
    			add_location(div1, file$9, 129, 2, 2948);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "class", input2_class_value = "form-control " + (/*errorsValid*/ ctx[4].emailValid ? '' : 'invalid') + " svelte-157jl6a");
    			attr_dev(input2, "placeholder", "Email");
    			input2.required = true;
    			add_location(input2, file$9, 134, 3, 3207);
    			attr_dev(div2, "class", "form-group svelte-157jl6a");
    			add_location(div2, file$9, 133, 4, 3179);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", input3_class_value = "form-control " + (/*errorsValid*/ ctx[4].phoneNumberValid ? '' : 'invalid') + " svelte-157jl6a");
    			attr_dev(input3, "placeholder", "Contact number");
    			input3.required = true;
    			add_location(input3, file$9, 138, 3, 3432);
    			attr_dev(div3, "class", "form-group svelte-157jl6a");
    			add_location(div3, file$9, 137, 4, 3404);
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "class", "form-control svelte-157jl6a");
    			attr_dev(textarea, "placeholder", "Give us the deets");
    			add_location(textarea, file$9, 142, 6, 3679);
    			attr_dev(div4, "class", "form-group svelte-157jl6a");
    			add_location(div4, file$9, 141, 4, 3648);
    			attr_dev(button, "class", "btn btn-full svelte-157jl6a");
    			add_location(button, file$9, 146, 2, 3811);
    			attr_dev(form, "id", "surveyForm");
    			attr_dev(form, "class", "mt-4 svelte-157jl6a");
    			toggle_class(form, "submitted", /*submitted*/ ctx[2]);
    			add_location(form, file$9, 122, 2, 2570);
    			attr_dev(div5, "class", "form-wrapper svelte-157jl6a");
    			add_location(div5, file$9, 121, 0, 2541);
    			attr_dev(link, "href", "https://gist.githubusercontent.com/Ajax30/08899d40e16069cd517b9756dc900acc/raw/04e4f9997245df079fa8500690d1878311115b20/global.css");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "crossorigin", "anonymous");
    			attr_dev(link, "class", "svelte-157jl6a");
    			add_location(link, file$9, 150, 0, 3910);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, form);
    			append_dev(form, h4);
    			append_dev(h4, t1);
    			append_dev(form, t2);
    			append_dev(form, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*fields*/ ctx[3].firstName);
    			append_dev(form, t3);
    			append_dev(form, div1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*fields*/ ctx[3].lastName);
    			append_dev(form, t4);
    			append_dev(form, div2);
    			append_dev(div2, input2);
    			set_input_value(input2, /*fields*/ ctx[3].email);
    			append_dev(form, t5);
    			append_dev(form, div3);
    			append_dev(div3, input3);
    			set_input_value(input3, /*fields*/ ctx[3].phoneNumber);
    			append_dev(form, t6);
    			append_dev(form, div4);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*fields*/ ctx[3].messageArea);
    			append_dev(form, t7);
    			append_dev(form, button);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, link, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input0, "keyup", /*validateFirstName*/ ctx[6], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input1, "keyup", /*validateLastName*/ ctx[7], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[15]),
    					listen_dev(input2, "keyup", /*validateEmailAddress*/ ctx[8], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(input3, "keyup", /*validatePhoneNumber*/ ctx[9], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[17]),
    					listen_dev(button, "click", /*click_handler*/ ctx[18], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[10]), false, true, false)
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
    					if_block.m(t0.parentNode, t0);
    				} else {
    					if_block = null;
    				}
    			}

    			if (!current || dirty & /*formMessage*/ 1) set_data_dev(t1, /*formMessage*/ ctx[0]);

    			if (!current || dirty & /*errorsValid*/ 16 && input0_class_value !== (input0_class_value = "form-control " + (/*errorsValid*/ ctx[4].firstNameValid ? '' : 'invalid') + " svelte-157jl6a")) {
    				attr_dev(input0, "class", input0_class_value);
    			}

    			if (dirty & /*fields*/ 8 && input0.value !== /*fields*/ ctx[3].firstName) {
    				set_input_value(input0, /*fields*/ ctx[3].firstName);
    			}

    			if (!current || dirty & /*errorsValid*/ 16 && input1_class_value !== (input1_class_value = "form-control " + (/*errorsValid*/ ctx[4].lastNameValid ? '' : 'invalid') + " svelte-157jl6a")) {
    				attr_dev(input1, "class", input1_class_value);
    			}

    			if (dirty & /*fields*/ 8 && input1.value !== /*fields*/ ctx[3].lastName) {
    				set_input_value(input1, /*fields*/ ctx[3].lastName);
    			}

    			if (!current || dirty & /*errorsValid*/ 16 && input2_class_value !== (input2_class_value = "form-control " + (/*errorsValid*/ ctx[4].emailValid ? '' : 'invalid') + " svelte-157jl6a")) {
    				attr_dev(input2, "class", input2_class_value);
    			}

    			if (dirty & /*fields*/ 8 && input2.value !== /*fields*/ ctx[3].email) {
    				set_input_value(input2, /*fields*/ ctx[3].email);
    			}

    			if (!current || dirty & /*errorsValid*/ 16 && input3_class_value !== (input3_class_value = "form-control " + (/*errorsValid*/ ctx[4].phoneNumberValid ? '' : 'invalid') + " svelte-157jl6a")) {
    				attr_dev(input3, "class", input3_class_value);
    			}

    			if (dirty & /*fields*/ 8 && input3.value !== /*fields*/ ctx[3].phoneNumber) {
    				set_input_value(input3, /*fields*/ ctx[3].phoneNumber);
    			}

    			if (dirty & /*fields*/ 8) {
    				set_input_value(textarea, /*fields*/ ctx[3].messageArea);
    			}

    			if (dirty & /*submitted*/ 4) {
    				toggle_class(form, "submitted", /*submitted*/ ctx[2]);
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
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(link);
    			mounted = false;
    			run_all(dispose);
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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    const errMessage = "All the fields are mandatory";

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form_2', slots, []);
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

    	function validateFirstName() {
    		if (validateName(fields.firstName)) {
    			$$invalidate(4, errorsValid.firstNameValid = true, errorsValid);
    		} else {
    			$$invalidate(4, errorsValid.firstNameValid = false, errorsValid);
    		}
    	}

    	function validateLastName() {
    		if (validateName(fields.lastName)) {
    			$$invalidate(4, errorsValid.lastNameValid = true, errorsValid);
    		} else {
    			$$invalidate(4, errorsValid.lastNameValid = false, errorsValid);
    		}
    	}

    	function validateEmailAddress() {
    		if (validateEmail(fields.email)) {
    			$$invalidate(4, errorsValid.emailValid = true, errorsValid);
    		} else {
    			$$invalidate(4, errorsValid.emailValid = false, errorsValid);
    		}
    	}

    	function validatePhoneNumber() {
    		if (validatePhone(fields.phoneNumber)) {
    			$$invalidate(4, errorsValid.phoneNumberValid = true, errorsValid);
    		} else {
    			$$invalidate(4, errorsValid.phoneNumberValid = false, errorsValid);
    		}
    	}

    	function handleSubmit(e) {
    		valid = true;

    		if (fields.firstName.length < 1) {
    			errors.firstName = "Please enter your first name.";
    			$$invalidate(4, errorsValid.firstNameValid = false, errorsValid);
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

    		$$invalidate(1, isSuccessVisible = true);

    		setTimeout(
    			function () {
    				$$invalidate(1, isSuccessVisible = false);
    			},
    			4000
    		);
    	}

    	const writable_props = ['formTitle', 'formMessage', 'sendToEmail'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Form_2> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		fields.firstName = this.value;
    		$$invalidate(3, fields);
    	}

    	function input1_input_handler() {
    		fields.lastName = this.value;
    		$$invalidate(3, fields);
    	}

    	function input2_input_handler() {
    		fields.email = this.value;
    		$$invalidate(3, fields);
    	}

    	function input3_input_handler() {
    		fields.phoneNumber = this.value;
    		$$invalidate(3, fields);
    	}

    	function textarea_input_handler() {
    		fields.messageArea = this.value;
    		$$invalidate(3, fields);
    	}

    	const click_handler = () => $$invalidate(2, submitted = true);

    	$$self.$$set = $$props => {
    		if ('formTitle' in $$props) $$invalidate(11, formTitle = $$props.formTitle);
    		if ('formMessage' in $$props) $$invalidate(0, formMessage = $$props.formMessage);
    		if ('sendToEmail' in $$props) $$invalidate(12, sendToEmail = $$props.sendToEmail);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		validateName,
    		validateEmail,
    		validatePhone,
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
    		validateFirstName,
    		validateLastName,
    		validateEmailAddress,
    		validatePhoneNumber,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('formTitle' in $$props) $$invalidate(11, formTitle = $$props.formTitle);
    		if ('formMessage' in $$props) $$invalidate(0, formMessage = $$props.formMessage);
    		if ('sendToEmail' in $$props) $$invalidate(12, sendToEmail = $$props.sendToEmail);
    		if ('hasError' in $$props) $$invalidate(5, hasError = $$props.hasError);
    		if ('isSuccessVisible' in $$props) $$invalidate(1, isSuccessVisible = $$props.isSuccessVisible);
    		if ('submitted' in $$props) $$invalidate(2, submitted = $$props.submitted);
    		if ('fields' in $$props) $$invalidate(3, fields = $$props.fields);
    		if ('errors' in $$props) errors = $$props.errors;
    		if ('errorsValid' in $$props) $$invalidate(4, errorsValid = $$props.errorsValid);
    		if ('valid' in $$props) valid = $$props.valid;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formMessage,
    		isSuccessVisible,
    		submitted,
    		fields,
    		errorsValid,
    		hasError,
    		validateFirstName,
    		validateLastName,
    		validateEmailAddress,
    		validatePhoneNumber,
    		handleSubmit,
    		formTitle,
    		sendToEmail,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		textarea_input_handler,
    		click_handler
    	];
    }

    class Form_2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			formTitle: 11,
    			formMessage: 0,
    			sendToEmail: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form_2",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sendToEmail*/ ctx[12] === undefined && !('sendToEmail' in props)) {
    			console_1$2.warn("<Form_2> was created without expected prop 'sendToEmail'");
    		}
    	}

    	get formTitle() {
    		throw new Error("<Form_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formTitle(value) {
    		throw new Error("<Form_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formMessage() {
    		throw new Error("<Form_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formMessage(value) {
    		throw new Error("<Form_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sendToEmail() {
    		throw new Error("<Form_2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sendToEmail(value) {
    		throw new Error("<Form_2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Info-Sections/Info-With-Form.svelte generated by Svelte v3.46.4 */
    const file$8 = "src/Components/Info-Sections/Info-With-Form.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let div0;
    	let form_2;
    	let t0;
    	let hr;
    	let t1;
    	let div1;
    	let p0;
    	let t2;
    	let t3;
    	let h2;
    	let t4;
    	let t5;
    	let p1;
    	let t6;
    	let current;
    	form_2 = new Form_2({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(form_2.$$.fragment);
    			t0 = space$1();
    			hr = element("hr");
    			t1 = space$1();
    			div1 = element("div");
    			p0 = element("p");
    			t2 = text(/*tinyTopText*/ ctx[1]);
    			t3 = space$1();
    			h2 = element("h2");
    			t4 = text(/*infoHeading*/ ctx[0]);
    			t5 = space$1();
    			p1 = element("p");
    			t6 = text(/*infoPara*/ ctx[2]);
    			attr_dev(div0, "class", "form-container svelte-1hmxsui");
    			add_location(div0, file$8, 12, 4, 206);
    			attr_dev(hr, "class", "separator svelte-1hmxsui");
    			add_location(hr, file$8, 15, 4, 276);
    			attr_dev(p0, "class", "tiny-text svelte-1hmxsui");
    			add_location(p0, file$8, 17, 12, 353);
    			attr_dev(h2, "class", "info-heading svelte-1hmxsui");
    			add_location(h2, file$8, 18, 12, 404);
    			attr_dev(p1, "class", "info-para svelte-1hmxsui");
    			add_location(p1, file$8, 19, 12, 460);
    			attr_dev(div1, "class", "info-text-container svelte-1hmxsui");
    			add_location(div1, file$8, 16, 8, 307);
    			attr_dev(div2, "class", "info-container svelte-1hmxsui");
    			add_location(div2, file$8, 11, 0, 173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(form_2, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, hr);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, h2);
    			append_dev(h2, t4);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, t6);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*tinyTopText*/ 2) set_data_dev(t2, /*tinyTopText*/ ctx[1]);
    			if (!current || dirty & /*infoHeading*/ 1) set_data_dev(t4, /*infoHeading*/ ctx[0]);
    			if (!current || dirty & /*infoPara*/ 4) set_data_dev(t6, /*infoPara*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form_2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form_2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(form_2);
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
    	validate_slots('Info_With_Form', slots, []);
    	let { infoHeading } = $$props;
    	let { tinyTopText } = $$props;
    	let { infoPara } = $$props;
    	let { imgUrl } = $$props;
    	let { imgAlt } = $$props;
    	const writable_props = ['infoHeading', 'tinyTopText', 'infoPara', 'imgUrl', 'imgAlt'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info_With_Form> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('imgUrl' in $$props) $$invalidate(3, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(4, imgAlt = $$props.imgAlt);
    	};

    	$$self.$capture_state = () => ({
    		Form_2,
    		infoHeading,
    		tinyTopText,
    		infoPara,
    		imgUrl,
    		imgAlt
    	});

    	$$self.$inject_state = $$props => {
    		if ('infoHeading' in $$props) $$invalidate(0, infoHeading = $$props.infoHeading);
    		if ('tinyTopText' in $$props) $$invalidate(1, tinyTopText = $$props.tinyTopText);
    		if ('infoPara' in $$props) $$invalidate(2, infoPara = $$props.infoPara);
    		if ('imgUrl' in $$props) $$invalidate(3, imgUrl = $$props.imgUrl);
    		if ('imgAlt' in $$props) $$invalidate(4, imgAlt = $$props.imgAlt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [infoHeading, tinyTopText, infoPara, imgUrl, imgAlt];
    }

    class Info_With_Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			infoHeading: 0,
    			tinyTopText: 1,
    			infoPara: 2,
    			imgUrl: 3,
    			imgAlt: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_With_Form",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*infoHeading*/ ctx[0] === undefined && !('infoHeading' in props)) {
    			console.warn("<Info_With_Form> was created without expected prop 'infoHeading'");
    		}

    		if (/*tinyTopText*/ ctx[1] === undefined && !('tinyTopText' in props)) {
    			console.warn("<Info_With_Form> was created without expected prop 'tinyTopText'");
    		}

    		if (/*infoPara*/ ctx[2] === undefined && !('infoPara' in props)) {
    			console.warn("<Info_With_Form> was created without expected prop 'infoPara'");
    		}

    		if (/*imgUrl*/ ctx[3] === undefined && !('imgUrl' in props)) {
    			console.warn("<Info_With_Form> was created without expected prop 'imgUrl'");
    		}

    		if (/*imgAlt*/ ctx[4] === undefined && !('imgAlt' in props)) {
    			console.warn("<Info_With_Form> was created without expected prop 'imgAlt'");
    		}
    	}

    	get infoHeading() {
    		throw new Error("<Info_With_Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoHeading(value) {
    		throw new Error("<Info_With_Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tinyTopText() {
    		throw new Error("<Info_With_Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tinyTopText(value) {
    		throw new Error("<Info_With_Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get infoPara() {
    		throw new Error("<Info_With_Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoPara(value) {
    		throw new Error("<Info_With_Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgUrl() {
    		throw new Error("<Info_With_Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgUrl(value) {
    		throw new Error("<Info_With_Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgAlt() {
    		throw new Error("<Info_With_Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgAlt(value) {
    		throw new Error("<Info_With_Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray$5(val) {
      return Array.isArray(val);
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer$1(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return toString.call(val) === '[object FormData]';
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString$2(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber$1(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject$1(val) {
      if (toString.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate$1(val) {
      return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return toString.call(val) === '[object URLSearchParams]';
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray$5(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge$1(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject$1(result[key]) && isPlainObject$1(val)) {
          result[key] = merge$1(result[key], val);
        } else if (isPlainObject$1(val)) {
          result[key] = merge$1({}, val);
        } else if (isArray$5(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    var utils$1 = {
      isArray: isArray$5,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer$1,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString$2,
      isNumber: isNumber$1,
      isObject: isObject,
      isPlainObject: isPlainObject$1,
      isUndefined: isUndefined,
      isDate: isDate$1,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge$1,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };

    function encode$1(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils$1.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils$1.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils$1.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils$1.forEach(val, function parseValue(v) {
            if (utils$1.isDate(v)) {
              v = v.toISOString();
            } else if (utils$1.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode$1(key) + '=' + encode$1(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils$1.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      };
      return error;
    };

    var transitional = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils$1.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils$1.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils$1.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils$1.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils$1.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils$1.trim(line.substr(0, i)).toLowerCase();
        val = utils$1.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils$1.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils$1.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils$1.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional$1 = config.transitional || transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(
            timeoutErrorMessage,
            config,
            transitional$1.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils$1.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils$1.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils$1.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new Cancel_1('canceled') : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils$1.isUndefined(headers) && utils$1.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils$1.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils$1.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults$2 = {

      transitional: transitional,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils$1.isFormData(data) ||
          utils$1.isArrayBuffer(data) ||
          utils$1.isBuffer(data) ||
          utils$1.isStream(data) ||
          utils$1.isFile(data) ||
          utils$1.isBlob(data)
        ) {
          return data;
        }
        if (utils$1.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils$1.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils$1.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults$2.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils$1.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw enhanceError(e, this, 'E_JSON_PARSE');
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils$1.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults$2.headers[method] = {};
    });

    utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults$2.headers[method] = utils$1.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults$2;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils$1.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new Cancel_1('canceled');
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils$1.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils$1.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
          return utils$1.merge(target, source);
        } else if (utils$1.isPlainObject(source)) {
          return utils$1.merge({}, source);
        } else if (utils$1.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils$1.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils$1.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils$1.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils$1.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils$1.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils$1.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var data = {
      "version": "0.26.1"
    };

    var VERSION = data.version;

    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError('option ' + opt + ' must be ' + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error('Unknown option ' + opt);
        }
      }
    }

    var validator = {
      assertOptions: assertOptions,
      validators: validators$1
    };

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return utils$1.isObject(payload) && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils$1.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils$1.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Expose Cancel & CancelToken
    axios$1.Cancel = Cancel_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;
    axios$1.VERSION = data.version;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default$5 = axios$1;
    axios_1.default = _default$5;

    var axios = axios_1;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var fastCopy = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, (function () {
      var toStringFunction = Function.prototype.toString;
      var create = Object.create, defineProperty = Object.defineProperty, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, getOwnPropertyNames = Object.getOwnPropertyNames, getOwnPropertySymbols = Object.getOwnPropertySymbols, getPrototypeOf = Object.getPrototypeOf;
      var _a = Object.prototype, hasOwnProperty = _a.hasOwnProperty, propertyIsEnumerable = _a.propertyIsEnumerable;
      /**
       * @enum
       *
       * @const {Object} SUPPORTS
       *
       * @property {boolean} SYMBOL_PROPERTIES are symbol properties supported
       * @property {boolean} WEAKMAP is WeakMap supported
       */
      var SUPPORTS = {
          SYMBOL_PROPERTIES: typeof getOwnPropertySymbols === 'function',
          WEAKMAP: typeof WeakMap === 'function',
      };
      /**
       * @function createCache
       *
       * @description
       * get a new cache object to prevent circular references
       *
       * @returns the new cache object
       */
      var createCache = function () {
          if (SUPPORTS.WEAKMAP) {
              return new WeakMap();
          }
          // tiny implementation of WeakMap
          var object = create({
              has: function (key) { return !!~object._keys.indexOf(key); },
              set: function (key, value) {
                  object._keys.push(key);
                  object._values.push(value);
              },
              get: function (key) { return object._values[object._keys.indexOf(key)]; },
          });
          object._keys = [];
          object._values = [];
          return object;
      };
      /**
       * @function getCleanClone
       *
       * @description
       * get an empty version of the object with the same prototype it has
       *
       * @param object the object to build a clean clone from
       * @param realm the realm the object resides in
       * @returns the empty cloned object
       */
      var getCleanClone = function (object, realm) {
          if (!object.constructor) {
              return create(null);
          }
          var Constructor = object.constructor;
          var prototype = object.__proto__ || getPrototypeOf(object);
          if (Constructor === realm.Object) {
              return prototype === realm.Object.prototype ? {} : create(prototype);
          }
          if (~toStringFunction.call(Constructor).indexOf('[native code]')) {
              try {
                  return new Constructor();
              }
              catch (_a) { }
          }
          return create(prototype);
      };
      /**
       * @function getObjectCloneLoose
       *
       * @description
       * get a copy of the object based on loose rules, meaning all enumerable keys
       * and symbols are copied, but property descriptors are not considered
       *
       * @param object the object to clone
       * @param realm the realm the object resides in
       * @param handleCopy the function that handles copying the object
       * @returns the copied object
       */
      var getObjectCloneLoose = function (object, realm, handleCopy, cache) {
          var clone = getCleanClone(object, realm);
          // set in the cache immediately to be able to reuse the object recursively
          cache.set(object, clone);
          for (var key in object) {
              if (hasOwnProperty.call(object, key)) {
                  clone[key] = handleCopy(object[key], cache);
              }
          }
          if (SUPPORTS.SYMBOL_PROPERTIES) {
              var symbols = getOwnPropertySymbols(object);
              var length_1 = symbols.length;
              if (length_1) {
                  for (var index = 0, symbol = void 0; index < length_1; index++) {
                      symbol = symbols[index];
                      if (propertyIsEnumerable.call(object, symbol)) {
                          clone[symbol] = handleCopy(object[symbol], cache);
                      }
                  }
              }
          }
          return clone;
      };
      /**
       * @function getObjectCloneStrict
       *
       * @description
       * get a copy of the object based on strict rules, meaning all keys and symbols
       * are copied based on the original property descriptors
       *
       * @param object the object to clone
       * @param realm the realm the object resides in
       * @param handleCopy the function that handles copying the object
       * @returns the copied object
       */
      var getObjectCloneStrict = function (object, realm, handleCopy, cache) {
          var clone = getCleanClone(object, realm);
          // set in the cache immediately to be able to reuse the object recursively
          cache.set(object, clone);
          var properties = SUPPORTS.SYMBOL_PROPERTIES
              ? getOwnPropertyNames(object).concat(getOwnPropertySymbols(object))
              : getOwnPropertyNames(object);
          var length = properties.length;
          if (length) {
              for (var index = 0, property = void 0, descriptor = void 0; index < length; index++) {
                  property = properties[index];
                  if (property !== 'callee' && property !== 'caller') {
                      descriptor = getOwnPropertyDescriptor(object, property);
                      if (descriptor) {
                          // Only clone the value if actually a value, not a getter / setter.
                          if (!descriptor.get && !descriptor.set) {
                              descriptor.value = handleCopy(object[property], cache);
                          }
                          try {
                              defineProperty(clone, property, descriptor);
                          }
                          catch (error) {
                              // Tee above can fail on node in edge cases, so fall back to the loose assignment.
                              clone[property] = descriptor.value;
                          }
                      }
                      else {
                          // In extra edge cases where the property descriptor cannot be retrived, fall back to
                          // the loose assignment.
                          clone[property] = handleCopy(object[property], cache);
                      }
                  }
              }
          }
          return clone;
      };
      /**
       * @function getRegExpFlags
       *
       * @description
       * get the flags to apply to the copied regexp
       *
       * @param regExp the regexp to get the flags of
       * @returns the flags for the regexp
       */
      var getRegExpFlags = function (regExp) {
          var flags = '';
          if (regExp.global) {
              flags += 'g';
          }
          if (regExp.ignoreCase) {
              flags += 'i';
          }
          if (regExp.multiline) {
              flags += 'm';
          }
          if (regExp.unicode) {
              flags += 'u';
          }
          if (regExp.sticky) {
              flags += 'y';
          }
          return flags;
      };

      // utils
      var isArray = Array.isArray;
      var GLOBAL_THIS = (function () {
          if (typeof self !== 'undefined') {
              return self;
          }
          if (typeof window !== 'undefined') {
              return window;
          }
          if (typeof commonjsGlobal !== 'undefined') {
              return commonjsGlobal;
          }
          if (console && console.error) {
              console.error('Unable to locate global object, returning "this".');
          }
      })();
      /**
       * @function copy
       *
       * @description
       * copy an object deeply as much as possible
       *
       * If `strict` is applied, then all properties (including non-enumerable ones)
       * are copied with their original property descriptors on both objects and arrays.
       *
       * The object is compared to the global constructors in the `realm` provided,
       * and the native constructor is always used to ensure that extensions of native
       * objects (allows in ES2015+) are maintained.
       *
       * @param object the object to copy
       * @param [options] the options for copying with
       * @param [options.isStrict] should the copy be strict
       * @param [options.realm] the realm (this) object the object is copied from
       * @returns the copied object
       */
      function copy(object, options) {
          // manually coalesced instead of default parameters for performance
          var isStrict = !!(options && options.isStrict);
          var realm = (options && options.realm) || GLOBAL_THIS;
          var getObjectClone = isStrict
              ? getObjectCloneStrict
              : getObjectCloneLoose;
          /**
           * @function handleCopy
           *
           * @description
           * copy the object recursively based on its type
           *
           * @param object the object to copy
           * @returns the copied object
           */
          var handleCopy = function (object, cache) {
              if (!object || typeof object !== 'object') {
                  return object;
              }
              if (cache.has(object)) {
                  return cache.get(object);
              }
              var Constructor = object.constructor;
              // plain objects
              if (Constructor === realm.Object) {
                  return getObjectClone(object, realm, handleCopy, cache);
              }
              var clone;
              // arrays
              if (isArray(object)) {
                  // if strict, include non-standard properties
                  if (isStrict) {
                      return getObjectCloneStrict(object, realm, handleCopy, cache);
                  }
                  var length_1 = object.length;
                  clone = new Constructor();
                  cache.set(object, clone);
                  for (var index = 0; index < length_1; index++) {
                      clone[index] = handleCopy(object[index], cache);
                  }
                  return clone;
              }
              // dates
              if (object instanceof realm.Date) {
                  return new Constructor(object.getTime());
              }
              // regexps
              if (object instanceof realm.RegExp) {
                  clone = new Constructor(object.source, object.flags || getRegExpFlags(object));
                  clone.lastIndex = object.lastIndex;
                  return clone;
              }
              // maps
              if (realm.Map && object instanceof realm.Map) {
                  clone = new Constructor();
                  cache.set(object, clone);
                  object.forEach(function (value, key) {
                      clone.set(key, handleCopy(value, cache));
                  });
                  return clone;
              }
              // sets
              if (realm.Set && object instanceof realm.Set) {
                  clone = new Constructor();
                  cache.set(object, clone);
                  object.forEach(function (value) {
                      clone.add(handleCopy(value, cache));
                  });
                  return clone;
              }
              // blobs
              if (realm.Blob && object instanceof realm.Blob) {
                  return object.slice(0, object.size, object.type);
              }
              // buffers (node-only)
              if (realm.Buffer && realm.Buffer.isBuffer(object)) {
                  clone = realm.Buffer.allocUnsafe
                      ? realm.Buffer.allocUnsafe(object.length)
                      : new Constructor(object.length);
                  cache.set(object, clone);
                  object.copy(clone);
                  return clone;
              }
              // arraybuffers / dataviews
              if (realm.ArrayBuffer) {
                  // dataviews
                  if (realm.ArrayBuffer.isView(object)) {
                      clone = new Constructor(object.buffer.slice(0));
                      cache.set(object, clone);
                      return clone;
                  }
                  // arraybuffers
                  if (object instanceof realm.ArrayBuffer) {
                      clone = object.slice(0);
                      cache.set(object, clone);
                      return clone;
                  }
              }
              // if the object cannot / should not be cloned, don't
              if (
              // promise-like
              typeof object.then === 'function' ||
                  // errors
                  object instanceof Error ||
                  // weakmaps
                  (realm.WeakMap && object instanceof realm.WeakMap) ||
                  // weaksets
                  (realm.WeakSet && object instanceof realm.WeakSet)) {
                  return object;
              }
              // assume anything left is a custom constructor
              return getObjectClone(object, realm, handleCopy, cache);
          };
          return handleCopy(object, createCache());
      }
      // Adding reference to allow usage in CommonJS libraries compiled using TSC, which
      // expects there to be a default property on the exported object. See
      // [#37](https://github.com/planttheidea/fast-copy/issues/37) for details.
      copy.default = copy;
      /**
       * @function strictCopy
       *
       * @description
       * copy the object with `strict` option pre-applied
       *
       * @param object the object to copy
       * @param [options] the options for copying with
       * @param [options.realm] the realm (this) object the object is copied from
       * @returns the copied object
       */
      copy.strict = function strictCopy(object, options) {
          return copy(object, {
              isStrict: true,
              realm: options ? options.realm : void 0,
          });
      };

      return copy;

    })));

    });

    /* eslint complexity: [2, 18], max-statements: [2, 33] */
    var shams = function hasSymbols() {
    	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
    	if (typeof Symbol.iterator === 'symbol') { return true; }

    	var obj = {};
    	var sym = Symbol('test');
    	var symObj = Object(sym);
    	if (typeof sym === 'string') { return false; }

    	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
    	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

    	// temp disabled per https://github.com/ljharb/object.assign/issues/17
    	// if (sym instanceof Symbol) { return false; }
    	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
    	// if (!(symObj instanceof Symbol)) { return false; }

    	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
    	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

    	var symVal = 42;
    	obj[sym] = symVal;
    	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
    	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

    	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

    	var syms = Object.getOwnPropertySymbols(obj);
    	if (syms.length !== 1 || syms[0] !== sym) { return false; }

    	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

    	if (typeof Object.getOwnPropertyDescriptor === 'function') {
    		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
    	}

    	return true;
    };

    var origSymbol = typeof Symbol !== 'undefined' && Symbol;


    var hasSymbols$1 = function hasNativeSymbols() {
    	if (typeof origSymbol !== 'function') { return false; }
    	if (typeof Symbol !== 'function') { return false; }
    	if (typeof origSymbol('foo') !== 'symbol') { return false; }
    	if (typeof Symbol('bar') !== 'symbol') { return false; }

    	return shams();
    };

    /* eslint no-invalid-this: 1 */

    var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
    var slice = Array.prototype.slice;
    var toStr$1 = Object.prototype.toString;
    var funcType = '[object Function]';

    var implementation = function bind(that) {
        var target = this;
        if (typeof target !== 'function' || toStr$1.call(target) !== funcType) {
            throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);

        var bound;
        var binder = function () {
            if (this instanceof bound) {
                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;
            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );
            }
        };

        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

        if (target.prototype) {
            var Empty = function Empty() {};
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }

        return bound;
    };

    var functionBind = Function.prototype.bind || implementation;

    var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

    var undefined$1;

    var $SyntaxError = SyntaxError;
    var $Function = Function;
    var $TypeError$1 = TypeError;

    // eslint-disable-next-line consistent-return
    var getEvalledConstructor = function (expressionSyntax) {
    	try {
    		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
    	} catch (e) {}
    };

    var $gOPD = Object.getOwnPropertyDescriptor;
    if ($gOPD) {
    	try {
    		$gOPD({}, '');
    	} catch (e) {
    		$gOPD = null; // this is IE 8, which has a broken gOPD
    	}
    }

    var throwTypeError = function () {
    	throw new $TypeError$1();
    };
    var ThrowTypeError = $gOPD
    	? (function () {
    		try {
    			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    			arguments.callee; // IE 8 does not throw here
    			return throwTypeError;
    		} catch (calleeThrows) {
    			try {
    				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
    				return $gOPD(arguments, 'callee').get;
    			} catch (gOPDthrows) {
    				return throwTypeError;
    			}
    		}
    	}())
    	: throwTypeError;

    var hasSymbols = hasSymbols$1();

    var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

    var needsEval = {};

    var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

    var INTRINSICS = {
    	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
    	'%Array%': Array,
    	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
    	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined$1,
    	'%AsyncFromSyncIteratorPrototype%': undefined$1,
    	'%AsyncFunction%': needsEval,
    	'%AsyncGenerator%': needsEval,
    	'%AsyncGeneratorFunction%': needsEval,
    	'%AsyncIteratorPrototype%': needsEval,
    	'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
    	'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
    	'%Boolean%': Boolean,
    	'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
    	'%Date%': Date,
    	'%decodeURI%': decodeURI,
    	'%decodeURIComponent%': decodeURIComponent,
    	'%encodeURI%': encodeURI,
    	'%encodeURIComponent%': encodeURIComponent,
    	'%Error%': Error,
    	'%eval%': eval, // eslint-disable-line no-eval
    	'%EvalError%': EvalError,
    	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
    	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
    	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
    	'%Function%': $Function,
    	'%GeneratorFunction%': needsEval,
    	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
    	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
    	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
    	'%isFinite%': isFinite,
    	'%isNaN%': isNaN,
    	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
    	'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
    	'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
    	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
    	'%Math%': Math,
    	'%Number%': Number,
    	'%Object%': Object,
    	'%parseFloat%': parseFloat,
    	'%parseInt%': parseInt,
    	'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
    	'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
    	'%RangeError%': RangeError,
    	'%ReferenceError%': ReferenceError,
    	'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
    	'%RegExp%': RegExp,
    	'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
    	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
    	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
    	'%String%': String,
    	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined$1,
    	'%Symbol%': hasSymbols ? Symbol : undefined$1,
    	'%SyntaxError%': $SyntaxError,
    	'%ThrowTypeError%': ThrowTypeError,
    	'%TypedArray%': TypedArray,
    	'%TypeError%': $TypeError$1,
    	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
    	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
    	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
    	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
    	'%URIError%': URIError,
    	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
    	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
    	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
    };

    var doEval = function doEval(name) {
    	var value;
    	if (name === '%AsyncFunction%') {
    		value = getEvalledConstructor('async function () {}');
    	} else if (name === '%GeneratorFunction%') {
    		value = getEvalledConstructor('function* () {}');
    	} else if (name === '%AsyncGeneratorFunction%') {
    		value = getEvalledConstructor('async function* () {}');
    	} else if (name === '%AsyncGenerator%') {
    		var fn = doEval('%AsyncGeneratorFunction%');
    		if (fn) {
    			value = fn.prototype;
    		}
    	} else if (name === '%AsyncIteratorPrototype%') {
    		var gen = doEval('%AsyncGenerator%');
    		if (gen) {
    			value = getProto(gen.prototype);
    		}
    	}

    	INTRINSICS[name] = value;

    	return value;
    };

    var LEGACY_ALIASES = {
    	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
    	'%ArrayPrototype%': ['Array', 'prototype'],
    	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
    	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
    	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
    	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
    	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
    	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
    	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
    	'%BooleanPrototype%': ['Boolean', 'prototype'],
    	'%DataViewPrototype%': ['DataView', 'prototype'],
    	'%DatePrototype%': ['Date', 'prototype'],
    	'%ErrorPrototype%': ['Error', 'prototype'],
    	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
    	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
    	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
    	'%FunctionPrototype%': ['Function', 'prototype'],
    	'%Generator%': ['GeneratorFunction', 'prototype'],
    	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
    	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
    	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
    	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
    	'%JSONParse%': ['JSON', 'parse'],
    	'%JSONStringify%': ['JSON', 'stringify'],
    	'%MapPrototype%': ['Map', 'prototype'],
    	'%NumberPrototype%': ['Number', 'prototype'],
    	'%ObjectPrototype%': ['Object', 'prototype'],
    	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
    	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
    	'%PromisePrototype%': ['Promise', 'prototype'],
    	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
    	'%Promise_all%': ['Promise', 'all'],
    	'%Promise_reject%': ['Promise', 'reject'],
    	'%Promise_resolve%': ['Promise', 'resolve'],
    	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
    	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
    	'%RegExpPrototype%': ['RegExp', 'prototype'],
    	'%SetPrototype%': ['Set', 'prototype'],
    	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
    	'%StringPrototype%': ['String', 'prototype'],
    	'%SymbolPrototype%': ['Symbol', 'prototype'],
    	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
    	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
    	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
    	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
    	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
    	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
    	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
    	'%URIErrorPrototype%': ['URIError', 'prototype'],
    	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
    	'%WeakSetPrototype%': ['WeakSet', 'prototype']
    };



    var $concat$1 = functionBind.call(Function.call, Array.prototype.concat);
    var $spliceApply = functionBind.call(Function.apply, Array.prototype.splice);
    var $replace$1 = functionBind.call(Function.call, String.prototype.replace);
    var $strSlice = functionBind.call(Function.call, String.prototype.slice);

    /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
    var stringToPath = function stringToPath(string) {
    	var first = $strSlice(string, 0, 1);
    	var last = $strSlice(string, -1);
    	if (first === '%' && last !== '%') {
    		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
    	} else if (last === '%' && first !== '%') {
    		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
    	}
    	var result = [];
    	$replace$1(string, rePropName, function (match, number, quote, subString) {
    		result[result.length] = quote ? $replace$1(subString, reEscapeChar, '$1') : number || match;
    	});
    	return result;
    };
    /* end adaptation */

    var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
    	var intrinsicName = name;
    	var alias;
    	if (src(LEGACY_ALIASES, intrinsicName)) {
    		alias = LEGACY_ALIASES[intrinsicName];
    		intrinsicName = '%' + alias[0] + '%';
    	}

    	if (src(INTRINSICS, intrinsicName)) {
    		var value = INTRINSICS[intrinsicName];
    		if (value === needsEval) {
    			value = doEval(intrinsicName);
    		}
    		if (typeof value === 'undefined' && !allowMissing) {
    			throw new $TypeError$1('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
    		}

    		return {
    			alias: alias,
    			name: intrinsicName,
    			value: value
    		};
    	}

    	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
    };

    var getIntrinsic = function GetIntrinsic(name, allowMissing) {
    	if (typeof name !== 'string' || name.length === 0) {
    		throw new $TypeError$1('intrinsic name must be a non-empty string');
    	}
    	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    		throw new $TypeError$1('"allowMissing" argument must be a boolean');
    	}

    	var parts = stringToPath(name);
    	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

    	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
    	var intrinsicRealName = intrinsic.name;
    	var value = intrinsic.value;
    	var skipFurtherCaching = false;

    	var alias = intrinsic.alias;
    	if (alias) {
    		intrinsicBaseName = alias[0];
    		$spliceApply(parts, $concat$1([0, 1], alias));
    	}

    	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    		var part = parts[i];
    		var first = $strSlice(part, 0, 1);
    		var last = $strSlice(part, -1);
    		if (
    			(
    				(first === '"' || first === "'" || first === '`')
    				|| (last === '"' || last === "'" || last === '`')
    			)
    			&& first !== last
    		) {
    			throw new $SyntaxError('property names with quotes must have matching quotes');
    		}
    		if (part === 'constructor' || !isOwn) {
    			skipFurtherCaching = true;
    		}

    		intrinsicBaseName += '.' + part;
    		intrinsicRealName = '%' + intrinsicBaseName + '%';

    		if (src(INTRINSICS, intrinsicRealName)) {
    			value = INTRINSICS[intrinsicRealName];
    		} else if (value != null) {
    			if (!(part in value)) {
    				if (!allowMissing) {
    					throw new $TypeError$1('base intrinsic for ' + name + ' exists, but the property is not available.');
    				}
    				return void undefined$1;
    			}
    			if ($gOPD && (i + 1) >= parts.length) {
    				var desc = $gOPD(value, part);
    				isOwn = !!desc;

    				// By convention, when a data property is converted to an accessor
    				// property to emulate a data property that does not suffer from
    				// the override mistake, that accessor's getter is marked with
    				// an `originalValue` property. Here, when we detect this, we
    				// uphold the illusion by pretending to see that original data
    				// property, i.e., returning the value rather than the getter
    				// itself.
    				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
    					value = desc.get;
    				} else {
    					value = value[part];
    				}
    			} else {
    				isOwn = src(value, part);
    				value = value[part];
    			}

    			if (isOwn && !skipFurtherCaching) {
    				INTRINSICS[intrinsicRealName] = value;
    			}
    		}
    	}
    	return value;
    };

    var callBind = createCommonjsModule(function (module) {




    var $apply = getIntrinsic('%Function.prototype.apply%');
    var $call = getIntrinsic('%Function.prototype.call%');
    var $reflectApply = getIntrinsic('%Reflect.apply%', true) || functionBind.call($call, $apply);

    var $gOPD = getIntrinsic('%Object.getOwnPropertyDescriptor%', true);
    var $defineProperty = getIntrinsic('%Object.defineProperty%', true);
    var $max = getIntrinsic('%Math.max%');

    if ($defineProperty) {
    	try {
    		$defineProperty({}, 'a', { value: 1 });
    	} catch (e) {
    		// IE 8 has a broken defineProperty
    		$defineProperty = null;
    	}
    }

    module.exports = function callBind(originalFunction) {
    	var func = $reflectApply(functionBind, $call, arguments);
    	if ($gOPD && $defineProperty) {
    		var desc = $gOPD(func, 'length');
    		if (desc.configurable) {
    			// original length, plus the receiver, minus any additional arguments (after the receiver)
    			$defineProperty(
    				func,
    				'length',
    				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
    			);
    		}
    	}
    	return func;
    };

    var applyBind = function applyBind() {
    	return $reflectApply(functionBind, $apply, arguments);
    };

    if ($defineProperty) {
    	$defineProperty(module.exports, 'apply', { value: applyBind });
    } else {
    	module.exports.apply = applyBind;
    }
    });

    var $indexOf = callBind(getIntrinsic('String.prototype.indexOf'));

    var callBound = function callBoundIntrinsic(name, allowMissing) {
    	var intrinsic = getIntrinsic(name, !!allowMissing);
    	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
    		return callBind(intrinsic);
    	}
    	return intrinsic;
    };

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _nodeResolve_empty
    });

    var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

    var hasMap = typeof Map === 'function' && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === 'function' && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString$2 = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
    // ie, `has-tostringtag/shams
    var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
        ? Symbol.toStringTag
        : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;

    var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
        [].__proto__ === Array.prototype // eslint-disable-line no-proto
            ? function (O) {
                return O.__proto__; // eslint-disable-line no-proto
            }
            : null
    );

    function addNumericSeparator(num, str) {
        if (
            num === Infinity
            || num === -Infinity
            || num !== num
            || (num && num > -1000 && num < 1000)
            || $test.call(/e/, str)
        ) {
            return str;
        }
        var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof num === 'number') {
            var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
            if (int !== num) {
                var intStr = String(int);
                var dec = $slice.call(str, intStr.length + 1);
                return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
            }
        }
        return $replace.call(str, sepRegex, '$&_');
    }

    var inspectCustom = require$$0$1.custom;
    var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;

    var objectInspect = function inspect_(obj, options, depth, seen) {
        var opts = options || {};

        if (has$3(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
            throw new TypeError('option "quoteStyle" must be "single" or "double"');
        }
        if (
            has$3(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
                ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
                : opts.maxStringLength !== null
            )
        ) {
            throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
        }
        var customInspect = has$3(opts, 'customInspect') ? opts.customInspect : true;
        if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
            throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
        }

        if (
            has$3(opts, 'indent')
            && opts.indent !== null
            && opts.indent !== '\t'
            && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
        ) {
            throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
        }
        if (has$3(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
            throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
        }
        var numericSeparator = opts.numericSeparator;

        if (typeof obj === 'undefined') {
            return 'undefined';
        }
        if (obj === null) {
            return 'null';
        }
        if (typeof obj === 'boolean') {
            return obj ? 'true' : 'false';
        }

        if (typeof obj === 'string') {
            return inspectString(obj, opts);
        }
        if (typeof obj === 'number') {
            if (obj === 0) {
                return Infinity / obj > 0 ? '0' : '-0';
            }
            var str = String(obj);
            return numericSeparator ? addNumericSeparator(obj, str) : str;
        }
        if (typeof obj === 'bigint') {
            var bigIntStr = String(obj) + 'n';
            return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
        }

        var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
        if (typeof depth === 'undefined') { depth = 0; }
        if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
            return isArray$4(obj) ? '[Array]' : '[Object]';
        }

        var indent = getIndent(opts, depth);

        if (typeof seen === 'undefined') {
            seen = [];
        } else if (indexOf(seen, obj) >= 0) {
            return '[Circular]';
        }

        function inspect(value, from, noIndent) {
            if (from) {
                seen = $arrSlice.call(seen);
                seen.push(from);
            }
            if (noIndent) {
                var newOpts = {
                    depth: opts.depth
                };
                if (has$3(opts, 'quoteStyle')) {
                    newOpts.quoteStyle = opts.quoteStyle;
                }
                return inspect_(value, newOpts, depth + 1, seen);
            }
            return inspect_(value, opts, depth + 1, seen);
        }

        if (typeof obj === 'function') {
            var name = nameOf(obj);
            var keys = arrObjKeys(obj, inspect);
            return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
        }
        if (isSymbol(obj)) {
            var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
            return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
        }
        if (isElement(obj)) {
            var s = '<' + $toLowerCase.call(String(obj.nodeName));
            var attrs = obj.attributes || [];
            for (var i = 0; i < attrs.length; i++) {
                s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
            }
            s += '>';
            if (obj.childNodes && obj.childNodes.length) { s += '...'; }
            s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
            return s;
        }
        if (isArray$4(obj)) {
            if (obj.length === 0) { return '[]'; }
            var xs = arrObjKeys(obj, inspect);
            if (indent && !singleLineValues(xs)) {
                return '[' + indentedJoin(xs, indent) + ']';
            }
            return '[ ' + $join.call(xs, ', ') + ' ]';
        }
        if (isError(obj)) {
            var parts = arrObjKeys(obj, inspect);
            if ('cause' in obj && !isEnumerable.call(obj, 'cause')) {
                return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
            }
            if (parts.length === 0) { return '[' + String(obj) + ']'; }
            return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
        }
        if (typeof obj === 'object' && customInspect) {
            if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
                return obj[inspectSymbol]();
            } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
                return obj.inspect();
            }
        }
        if (isMap(obj)) {
            var mapParts = [];
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
            return collectionOf('Map', mapSize.call(obj), mapParts, indent);
        }
        if (isSet(obj)) {
            var setParts = [];
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
            return collectionOf('Set', setSize.call(obj), setParts, indent);
        }
        if (isWeakMap(obj)) {
            return weakCollectionOf('WeakMap');
        }
        if (isWeakSet(obj)) {
            return weakCollectionOf('WeakSet');
        }
        if (isWeakRef(obj)) {
            return weakCollectionOf('WeakRef');
        }
        if (isNumber(obj)) {
            return markBoxed(inspect(Number(obj)));
        }
        if (isBigInt(obj)) {
            return markBoxed(inspect(bigIntValueOf.call(obj)));
        }
        if (isBoolean(obj)) {
            return markBoxed(booleanValueOf.call(obj));
        }
        if (isString$1(obj)) {
            return markBoxed(inspect(String(obj)));
        }
        if (!isDate(obj) && !isRegExp$1(obj)) {
            var ys = arrObjKeys(obj, inspect);
            var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
            var protoTag = obj instanceof Object ? '' : 'null prototype';
            var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
            var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
            var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
            if (ys.length === 0) { return tag + '{}'; }
            if (indent) {
                return tag + '{' + indentedJoin(ys, indent) + '}';
            }
            return tag + '{ ' + $join.call(ys, ', ') + ' }';
        }
        return String(obj);
    };

    function wrapQuotes(s, defaultStyle, opts) {
        var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
        return quoteChar + s + quoteChar;
    }

    function quote(s) {
        return $replace.call(String(s), /"/g, '&quot;');
    }

    function isArray$4(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
    function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
    function isRegExp$1(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
    function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
    function isString$1(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
    function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
    function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

    // Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
    function isSymbol(obj) {
        if (hasShammedSymbols) {
            return obj && typeof obj === 'object' && obj instanceof Symbol;
        }
        if (typeof obj === 'symbol') {
            return true;
        }
        if (!obj || typeof obj !== 'object' || !symToString) {
            return false;
        }
        try {
            symToString.call(obj);
            return true;
        } catch (e) {}
        return false;
    }

    function isBigInt(obj) {
        if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
            return false;
        }
        try {
            bigIntValueOf.call(obj);
            return true;
        } catch (e) {}
        return false;
    }

    var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
    function has$3(obj, key) {
        return hasOwn.call(obj, key);
    }

    function toStr(obj) {
        return objectToString$2.call(obj);
    }

    function nameOf(f) {
        if (f.name) { return f.name; }
        var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
        if (m) { return m[1]; }
        return null;
    }

    function indexOf(xs, x) {
        if (xs.indexOf) { return xs.indexOf(x); }
        for (var i = 0, l = xs.length; i < l; i++) {
            if (xs[i] === x) { return i; }
        }
        return -1;
    }

    function isMap(x) {
        if (!mapSize || !x || typeof x !== 'object') {
            return false;
        }
        try {
            mapSize.call(x);
            try {
                setSize.call(x);
            } catch (s) {
                return true;
            }
            return x instanceof Map; // core-js workaround, pre-v2.5.0
        } catch (e) {}
        return false;
    }

    function isWeakMap(x) {
        if (!weakMapHas || !x || typeof x !== 'object') {
            return false;
        }
        try {
            weakMapHas.call(x, weakMapHas);
            try {
                weakSetHas.call(x, weakSetHas);
            } catch (s) {
                return true;
            }
            return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
        } catch (e) {}
        return false;
    }

    function isWeakRef(x) {
        if (!weakRefDeref || !x || typeof x !== 'object') {
            return false;
        }
        try {
            weakRefDeref.call(x);
            return true;
        } catch (e) {}
        return false;
    }

    function isSet(x) {
        if (!setSize || !x || typeof x !== 'object') {
            return false;
        }
        try {
            setSize.call(x);
            try {
                mapSize.call(x);
            } catch (m) {
                return true;
            }
            return x instanceof Set; // core-js workaround, pre-v2.5.0
        } catch (e) {}
        return false;
    }

    function isWeakSet(x) {
        if (!weakSetHas || !x || typeof x !== 'object') {
            return false;
        }
        try {
            weakSetHas.call(x, weakSetHas);
            try {
                weakMapHas.call(x, weakMapHas);
            } catch (s) {
                return true;
            }
            return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
        } catch (e) {}
        return false;
    }

    function isElement(x) {
        if (!x || typeof x !== 'object') { return false; }
        if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
            return true;
        }
        return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
    }

    function inspectString(str, opts) {
        if (str.length > opts.maxStringLength) {
            var remaining = str.length - opts.maxStringLength;
            var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
            return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
        }
        // eslint-disable-next-line no-control-regex
        var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
        return wrapQuotes(s, 'single', opts);
    }

    function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = {
            8: 'b',
            9: 't',
            10: 'n',
            12: 'f',
            13: 'r'
        }[n];
        if (x) { return '\\' + x; }
        return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
    }

    function markBoxed(str) {
        return 'Object(' + str + ')';
    }

    function weakCollectionOf(type) {
        return type + ' { ? }';
    }

    function collectionOf(type, size, entries, indent) {
        var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
        return type + ' (' + size + ') {' + joinedEntries + '}';
    }

    function singleLineValues(xs) {
        for (var i = 0; i < xs.length; i++) {
            if (indexOf(xs[i], '\n') >= 0) {
                return false;
            }
        }
        return true;
    }

    function getIndent(opts, depth) {
        var baseIndent;
        if (opts.indent === '\t') {
            baseIndent = '\t';
        } else if (typeof opts.indent === 'number' && opts.indent > 0) {
            baseIndent = $join.call(Array(opts.indent + 1), ' ');
        } else {
            return null;
        }
        return {
            base: baseIndent,
            prev: $join.call(Array(depth + 1), baseIndent)
        };
    }

    function indentedJoin(xs, indent) {
        if (xs.length === 0) { return ''; }
        var lineJoiner = '\n' + indent.prev + indent.base;
        return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
    }

    function arrObjKeys(obj, inspect) {
        var isArr = isArray$4(obj);
        var xs = [];
        if (isArr) {
            xs.length = obj.length;
            for (var i = 0; i < obj.length; i++) {
                xs[i] = has$3(obj, i) ? inspect(obj[i], obj) : '';
            }
        }
        var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
        var symMap;
        if (hasShammedSymbols) {
            symMap = {};
            for (var k = 0; k < syms.length; k++) {
                symMap['$' + syms[k]] = syms[k];
            }
        }

        for (var key in obj) { // eslint-disable-line no-restricted-syntax
            if (!has$3(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
            if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
            if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
                // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
                continue; // eslint-disable-line no-restricted-syntax, no-continue
            } else if ($test.call(/[^\w$]/, key)) {
                xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
            } else {
                xs.push(key + ': ' + inspect(obj[key], obj));
            }
        }
        if (typeof gOPS === 'function') {
            for (var j = 0; j < syms.length; j++) {
                if (isEnumerable.call(obj, syms[j])) {
                    xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
                }
            }
        }
        return xs;
    }

    var inspect = objectInspect;

    var $TypeError = getIntrinsic('%TypeError%');
    var $WeakMap = getIntrinsic('%WeakMap%', true);
    var $Map = getIntrinsic('%Map%', true);

    var $weakMapGet = callBound('WeakMap.prototype.get', true);
    var $weakMapSet = callBound('WeakMap.prototype.set', true);
    var $weakMapHas = callBound('WeakMap.prototype.has', true);
    var $mapGet = callBound('Map.prototype.get', true);
    var $mapSet = callBound('Map.prototype.set', true);
    var $mapHas = callBound('Map.prototype.has', true);

    /*
     * This function traverses the list returning the node corresponding to the
     * given key.
     *
     * That node is also moved to the head of the list, so that if it's accessed
     * again we don't need to traverse the whole list. By doing so, all the recently
     * used nodes can be accessed relatively quickly.
     */
    var listGetNode = function (list, key) { // eslint-disable-line consistent-return
    	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
    		if (curr.key === key) {
    			prev.next = curr.next;
    			curr.next = list.next;
    			list.next = curr; // eslint-disable-line no-param-reassign
    			return curr;
    		}
    	}
    };

    var listGet = function (objects, key) {
    	var node = listGetNode(objects, key);
    	return node && node.value;
    };
    var listSet = function (objects, key, value) {
    	var node = listGetNode(objects, key);
    	if (node) {
    		node.value = value;
    	} else {
    		// Prepend the new node to the beginning of the list
    		objects.next = { // eslint-disable-line no-param-reassign
    			key: key,
    			next: objects.next,
    			value: value
    		};
    	}
    };
    var listHas = function (objects, key) {
    	return !!listGetNode(objects, key);
    };

    var sideChannel = function getSideChannel() {
    	var $wm;
    	var $m;
    	var $o;
    	var channel = {
    		assert: function (key) {
    			if (!channel.has(key)) {
    				throw new $TypeError('Side channel does not contain ' + inspect(key));
    			}
    		},
    		get: function (key) { // eslint-disable-line consistent-return
    			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
    				if ($wm) {
    					return $weakMapGet($wm, key);
    				}
    			} else if ($Map) {
    				if ($m) {
    					return $mapGet($m, key);
    				}
    			} else {
    				if ($o) { // eslint-disable-line no-lonely-if
    					return listGet($o, key);
    				}
    			}
    		},
    		has: function (key) {
    			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
    				if ($wm) {
    					return $weakMapHas($wm, key);
    				}
    			} else if ($Map) {
    				if ($m) {
    					return $mapHas($m, key);
    				}
    			} else {
    				if ($o) { // eslint-disable-line no-lonely-if
    					return listHas($o, key);
    				}
    			}
    			return false;
    		},
    		set: function (key, value) {
    			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
    				if (!$wm) {
    					$wm = new $WeakMap();
    				}
    				$weakMapSet($wm, key, value);
    			} else if ($Map) {
    				if (!$m) {
    					$m = new $Map();
    				}
    				$mapSet($m, key, value);
    			} else {
    				if (!$o) {
    					/*
    					 * Initialize the linked list as an empty node, so that we don't have
    					 * to special-case handling of the first node: we can always refer to
    					 * it as (previous node).next, instead of something like (list).head
    					 */
    					$o = { key: {}, next: null };
    				}
    				listSet($o, key, value);
    			}
    		}
    	};
    	return channel;
    };

    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;

    var Format = {
        RFC1738: 'RFC1738',
        RFC3986: 'RFC3986'
    };

    var formats = {
        'default': Format.RFC3986,
        formatters: {
            RFC1738: function (value) {
                return replace.call(value, percentTwenties, '+');
            },
            RFC3986: function (value) {
                return String(value);
            }
        },
        RFC1738: Format.RFC1738,
        RFC3986: Format.RFC3986
    };

    var has$2 = Object.prototype.hasOwnProperty;
    var isArray$3 = Array.isArray;

    var hexTable = (function () {
        var array = [];
        for (var i = 0; i < 256; ++i) {
            array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
        }

        return array;
    }());

    var compactQueue = function compactQueue(queue) {
        while (queue.length > 1) {
            var item = queue.pop();
            var obj = item.obj[item.prop];

            if (isArray$3(obj)) {
                var compacted = [];

                for (var j = 0; j < obj.length; ++j) {
                    if (typeof obj[j] !== 'undefined') {
                        compacted.push(obj[j]);
                    }
                }

                item.obj[item.prop] = compacted;
            }
        }
    };

    var arrayToObject = function arrayToObject(source, options) {
        var obj = options && options.plainObjects ? Object.create(null) : {};
        for (var i = 0; i < source.length; ++i) {
            if (typeof source[i] !== 'undefined') {
                obj[i] = source[i];
            }
        }

        return obj;
    };

    var merge = function merge(target, source, options) {
        /* eslint no-param-reassign: 0 */
        if (!source) {
            return target;
        }

        if (typeof source !== 'object') {
            if (isArray$3(target)) {
                target.push(source);
            } else if (target && typeof target === 'object') {
                if ((options && (options.plainObjects || options.allowPrototypes)) || !has$2.call(Object.prototype, source)) {
                    target[source] = true;
                }
            } else {
                return [target, source];
            }

            return target;
        }

        if (!target || typeof target !== 'object') {
            return [target].concat(source);
        }

        var mergeTarget = target;
        if (isArray$3(target) && !isArray$3(source)) {
            mergeTarget = arrayToObject(target, options);
        }

        if (isArray$3(target) && isArray$3(source)) {
            source.forEach(function (item, i) {
                if (has$2.call(target, i)) {
                    var targetItem = target[i];
                    if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                        target[i] = merge(targetItem, item, options);
                    } else {
                        target.push(item);
                    }
                } else {
                    target[i] = item;
                }
            });
            return target;
        }

        return Object.keys(source).reduce(function (acc, key) {
            var value = source[key];

            if (has$2.call(acc, key)) {
                acc[key] = merge(acc[key], value, options);
            } else {
                acc[key] = value;
            }
            return acc;
        }, mergeTarget);
    };

    var assign = function assignSingleSource(target, source) {
        return Object.keys(source).reduce(function (acc, key) {
            acc[key] = source[key];
            return acc;
        }, target);
    };

    var decode = function (str, decoder, charset) {
        var strWithoutPlus = str.replace(/\+/g, ' ');
        if (charset === 'iso-8859-1') {
            // unescape never throws, no try...catch needed:
            return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
        }
        // utf-8
        try {
            return decodeURIComponent(strWithoutPlus);
        } catch (e) {
            return strWithoutPlus;
        }
    };

    var encode = function encode(str, defaultEncoder, charset, kind, format) {
        // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
        // It has been adapted here for stricter adherence to RFC 3986
        if (str.length === 0) {
            return str;
        }

        var string = str;
        if (typeof str === 'symbol') {
            string = Symbol.prototype.toString.call(str);
        } else if (typeof str !== 'string') {
            string = String(str);
        }

        if (charset === 'iso-8859-1') {
            return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
                return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
            });
        }

        var out = '';
        for (var i = 0; i < string.length; ++i) {
            var c = string.charCodeAt(i);

            if (
                c === 0x2D // -
                || c === 0x2E // .
                || c === 0x5F // _
                || c === 0x7E // ~
                || (c >= 0x30 && c <= 0x39) // 0-9
                || (c >= 0x41 && c <= 0x5A) // a-z
                || (c >= 0x61 && c <= 0x7A) // A-Z
                || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
            ) {
                out += string.charAt(i);
                continue;
            }

            if (c < 0x80) {
                out = out + hexTable[c];
                continue;
            }

            if (c < 0x800) {
                out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
                continue;
            }

            if (c < 0xD800 || c >= 0xE000) {
                out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
                continue;
            }

            i += 1;
            c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
            /* eslint operator-linebreak: [2, "before"] */
            out += hexTable[0xF0 | (c >> 18)]
                + hexTable[0x80 | ((c >> 12) & 0x3F)]
                + hexTable[0x80 | ((c >> 6) & 0x3F)]
                + hexTable[0x80 | (c & 0x3F)];
        }

        return out;
    };

    var compact = function compact(value) {
        var queue = [{ obj: { o: value }, prop: 'o' }];
        var refs = [];

        for (var i = 0; i < queue.length; ++i) {
            var item = queue[i];
            var obj = item.obj[item.prop];

            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; ++j) {
                var key = keys[j];
                var val = obj[key];
                if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                    queue.push({ obj: obj, prop: key });
                    refs.push(val);
                }
            }
        }

        compactQueue(queue);

        return value;
    };

    var isRegExp = function isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    };

    var isBuffer = function isBuffer(obj) {
        if (!obj || typeof obj !== 'object') {
            return false;
        }

        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    };

    var combine = function combine(a, b) {
        return [].concat(a, b);
    };

    var maybeMap = function maybeMap(val, fn) {
        if (isArray$3(val)) {
            var mapped = [];
            for (var i = 0; i < val.length; i += 1) {
                mapped.push(fn(val[i]));
            }
            return mapped;
        }
        return fn(val);
    };

    var utils = {
        arrayToObject: arrayToObject,
        assign: assign,
        combine: combine,
        compact: compact,
        decode: decode,
        encode: encode,
        isBuffer: isBuffer,
        isRegExp: isRegExp,
        maybeMap: maybeMap,
        merge: merge
    };

    var has$1 = Object.prototype.hasOwnProperty;

    var arrayPrefixGenerators = {
        brackets: function brackets(prefix) {
            return prefix + '[]';
        },
        comma: 'comma',
        indices: function indices(prefix, key) {
            return prefix + '[' + key + ']';
        },
        repeat: function repeat(prefix) {
            return prefix;
        }
    };

    var isArray$2 = Array.isArray;
    var split = String.prototype.split;
    var push = Array.prototype.push;
    var pushToArray = function (arr, valueOrArray) {
        push.apply(arr, isArray$2(valueOrArray) ? valueOrArray : [valueOrArray]);
    };

    var toISO = Date.prototype.toISOString;

    var defaultFormat = formats['default'];
    var defaults$1 = {
        addQueryPrefix: false,
        allowDots: false,
        charset: 'utf-8',
        charsetSentinel: false,
        delimiter: '&',
        encode: true,
        encoder: utils.encode,
        encodeValuesOnly: false,
        format: defaultFormat,
        formatter: formats.formatters[defaultFormat],
        // deprecated
        indices: false,
        serializeDate: function serializeDate(date) {
            return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
    };

    var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
        return typeof v === 'string'
            || typeof v === 'number'
            || typeof v === 'boolean'
            || typeof v === 'symbol'
            || typeof v === 'bigint';
    };

    var sentinel = {};

    var stringify = function stringify(
        object,
        prefix,
        generateArrayPrefix,
        strictNullHandling,
        skipNulls,
        encoder,
        filter,
        sort,
        allowDots,
        serializeDate,
        format,
        formatter,
        encodeValuesOnly,
        charset,
        sideChannel$1
    ) {
        var obj = object;

        var tmpSc = sideChannel$1;
        var step = 0;
        var findFlag = false;
        while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
            // Where object last appeared in the ref tree
            var pos = tmpSc.get(object);
            step += 1;
            if (typeof pos !== 'undefined') {
                if (pos === step) {
                    throw new RangeError('Cyclic object value');
                } else {
                    findFlag = true; // Break while
                }
            }
            if (typeof tmpSc.get(sentinel) === 'undefined') {
                step = 0;
            }
        }

        if (typeof filter === 'function') {
            obj = filter(prefix, obj);
        } else if (obj instanceof Date) {
            obj = serializeDate(obj);
        } else if (generateArrayPrefix === 'comma' && isArray$2(obj)) {
            obj = utils.maybeMap(obj, function (value) {
                if (value instanceof Date) {
                    return serializeDate(value);
                }
                return value;
            });
        }

        if (obj === null) {
            if (strictNullHandling) {
                return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, 'key', format) : prefix;
            }

            obj = '';
        }

        if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
            if (encoder) {
                var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, 'key', format);
                if (generateArrayPrefix === 'comma' && encodeValuesOnly) {
                    var valuesArray = split.call(String(obj), ',');
                    var valuesJoined = '';
                    for (var i = 0; i < valuesArray.length; ++i) {
                        valuesJoined += (i === 0 ? '' : ',') + formatter(encoder(valuesArray[i], defaults$1.encoder, charset, 'value', format));
                    }
                    return [formatter(keyValue) + '=' + valuesJoined];
                }
                return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults$1.encoder, charset, 'value', format))];
            }
            return [formatter(prefix) + '=' + formatter(String(obj))];
        }

        var values = [];

        if (typeof obj === 'undefined') {
            return values;
        }

        var objKeys;
        if (generateArrayPrefix === 'comma' && isArray$2(obj)) {
            // we need to join elements in
            objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
        } else if (isArray$2(filter)) {
            objKeys = filter;
        } else {
            var keys = Object.keys(obj);
            objKeys = sort ? keys.sort(sort) : keys;
        }

        for (var j = 0; j < objKeys.length; ++j) {
            var key = objKeys[j];
            var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

            if (skipNulls && value === null) {
                continue;
            }

            var keyPrefix = isArray$2(obj)
                ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
                : prefix + (allowDots ? '.' + key : '[' + key + ']');

            sideChannel$1.set(object, step);
            var valueSideChannel = sideChannel();
            valueSideChannel.set(sentinel, sideChannel$1);
            pushToArray(values, stringify(
                value,
                keyPrefix,
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                format,
                formatter,
                encodeValuesOnly,
                charset,
                valueSideChannel
            ));
        }

        return values;
    };

    var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
        if (!opts) {
            return defaults$1;
        }

        if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
            throw new TypeError('Encoder has to be a function.');
        }

        var charset = opts.charset || defaults$1.charset;
        if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
            throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
        }

        var format = formats['default'];
        if (typeof opts.format !== 'undefined') {
            if (!has$1.call(formats.formatters, opts.format)) {
                throw new TypeError('Unknown format option provided.');
            }
            format = opts.format;
        }
        var formatter = formats.formatters[format];

        var filter = defaults$1.filter;
        if (typeof opts.filter === 'function' || isArray$2(opts.filter)) {
            filter = opts.filter;
        }

        return {
            addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
            allowDots: typeof opts.allowDots === 'undefined' ? defaults$1.allowDots : !!opts.allowDots,
            charset: charset,
            charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$1.charsetSentinel,
            delimiter: typeof opts.delimiter === 'undefined' ? defaults$1.delimiter : opts.delimiter,
            encode: typeof opts.encode === 'boolean' ? opts.encode : defaults$1.encode,
            encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults$1.encoder,
            encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
            filter: filter,
            format: format,
            formatter: formatter,
            serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults$1.serializeDate,
            skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults$1.skipNulls,
            sort: typeof opts.sort === 'function' ? opts.sort : null,
            strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$1.strictNullHandling
        };
    };

    var stringify_1$1 = function (object, opts) {
        var obj = object;
        var options = normalizeStringifyOptions(opts);

        var objKeys;
        var filter;

        if (typeof options.filter === 'function') {
            filter = options.filter;
            obj = filter('', obj);
        } else if (isArray$2(options.filter)) {
            filter = options.filter;
            objKeys = filter;
        }

        var keys = [];

        if (typeof obj !== 'object' || obj === null) {
            return '';
        }

        var arrayFormat;
        if (opts && opts.arrayFormat in arrayPrefixGenerators) {
            arrayFormat = opts.arrayFormat;
        } else if (opts && 'indices' in opts) {
            arrayFormat = opts.indices ? 'indices' : 'repeat';
        } else {
            arrayFormat = 'indices';
        }

        var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

        if (!objKeys) {
            objKeys = Object.keys(obj);
        }

        if (options.sort) {
            objKeys.sort(options.sort);
        }

        var sideChannel$1 = sideChannel();
        for (var i = 0; i < objKeys.length; ++i) {
            var key = objKeys[i];

            if (options.skipNulls && obj[key] === null) {
                continue;
            }
            pushToArray(keys, stringify(
                obj[key],
                key,
                generateArrayPrefix,
                options.strictNullHandling,
                options.skipNulls,
                options.encode ? options.encoder : null,
                options.filter,
                options.sort,
                options.allowDots,
                options.serializeDate,
                options.format,
                options.formatter,
                options.encodeValuesOnly,
                options.charset,
                sideChannel$1
            ));
        }

        var joined = keys.join(options.delimiter);
        var prefix = options.addQueryPrefix === true ? '?' : '';

        if (options.charsetSentinel) {
            if (options.charset === 'iso-8859-1') {
                // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
                prefix += 'utf8=%26%2310003%3B&';
            } else {
                // encodeURIComponent('✓')
                prefix += 'utf8=%E2%9C%93&';
            }
        }

        return joined.length > 0 ? prefix + joined : '';
    };

    var has = Object.prototype.hasOwnProperty;
    var isArray$1 = Array.isArray;

    var defaults = {
        allowDots: false,
        allowPrototypes: false,
        allowSparse: false,
        arrayLimit: 20,
        charset: 'utf-8',
        charsetSentinel: false,
        comma: false,
        decoder: utils.decode,
        delimiter: '&',
        depth: 5,
        ignoreQueryPrefix: false,
        interpretNumericEntities: false,
        parameterLimit: 1000,
        parseArrays: true,
        plainObjects: false,
        strictNullHandling: false
    };

    var interpretNumericEntities = function (str) {
        return str.replace(/&#(\d+);/g, function ($0, numberStr) {
            return String.fromCharCode(parseInt(numberStr, 10));
        });
    };

    var parseArrayValue = function (val, options) {
        if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
            return val.split(',');
        }

        return val;
    };

    // This is what browsers will submit when the ✓ character occurs in an
    // application/x-www-form-urlencoded body and the encoding of the page containing
    // the form is iso-8859-1, or when the submitted form has an accept-charset
    // attribute of iso-8859-1. Presumably also with other charsets that do not contain
    // the ✓ character, such as us-ascii.
    var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

    // These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
    var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

    var parseValues = function parseQueryStringValues(str, options) {
        var obj = {};
        var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
        var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
        var parts = cleanStr.split(options.delimiter, limit);
        var skipIndex = -1; // Keep track of where the utf8 sentinel was found
        var i;

        var charset = options.charset;
        if (options.charsetSentinel) {
            for (i = 0; i < parts.length; ++i) {
                if (parts[i].indexOf('utf8=') === 0) {
                    if (parts[i] === charsetSentinel) {
                        charset = 'utf-8';
                    } else if (parts[i] === isoSentinel) {
                        charset = 'iso-8859-1';
                    }
                    skipIndex = i;
                    i = parts.length; // The eslint settings do not allow break;
                }
            }
        }

        for (i = 0; i < parts.length; ++i) {
            if (i === skipIndex) {
                continue;
            }
            var part = parts[i];

            var bracketEqualsPos = part.indexOf(']=');
            var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

            var key, val;
            if (pos === -1) {
                key = options.decoder(part, defaults.decoder, charset, 'key');
                val = options.strictNullHandling ? null : '';
            } else {
                key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
                val = utils.maybeMap(
                    parseArrayValue(part.slice(pos + 1), options),
                    function (encodedVal) {
                        return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                    }
                );
            }

            if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
                val = interpretNumericEntities(val);
            }

            if (part.indexOf('[]=') > -1) {
                val = isArray$1(val) ? [val] : val;
            }

            if (has.call(obj, key)) {
                obj[key] = utils.combine(obj[key], val);
            } else {
                obj[key] = val;
            }
        }

        return obj;
    };

    var parseObject = function (chain, val, options, valuesParsed) {
        var leaf = valuesParsed ? val : parseArrayValue(val, options);

        for (var i = chain.length - 1; i >= 0; --i) {
            var obj;
            var root = chain[i];

            if (root === '[]' && options.parseArrays) {
                obj = [].concat(leaf);
            } else {
                obj = options.plainObjects ? Object.create(null) : {};
                var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
                var index = parseInt(cleanRoot, 10);
                if (!options.parseArrays && cleanRoot === '') {
                    obj = { 0: leaf };
                } else if (
                    !isNaN(index)
                    && root !== cleanRoot
                    && String(index) === cleanRoot
                    && index >= 0
                    && (options.parseArrays && index <= options.arrayLimit)
                ) {
                    obj = [];
                    obj[index] = leaf;
                } else if (cleanRoot !== '__proto__') {
                    obj[cleanRoot] = leaf;
                }
            }

            leaf = obj;
        }

        return leaf;
    };

    var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
        if (!givenKey) {
            return;
        }

        // Transform dot notation to bracket notation
        var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

        // The regex chunks

        var brackets = /(\[[^[\]]*])/;
        var child = /(\[[^[\]]*])/g;

        // Get the parent

        var segment = options.depth > 0 && brackets.exec(key);
        var parent = segment ? key.slice(0, segment.index) : key;

        // Stash the parent if it exists

        var keys = [];
        if (parent) {
            // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
            if (!options.plainObjects && has.call(Object.prototype, parent)) {
                if (!options.allowPrototypes) {
                    return;
                }
            }

            keys.push(parent);
        }

        // Loop through children appending to the array until we hit depth

        var i = 0;
        while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
            i += 1;
            if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
                if (!options.allowPrototypes) {
                    return;
                }
            }
            keys.push(segment[1]);
        }

        // If there's a remainder, just add whatever is left

        if (segment) {
            keys.push('[' + key.slice(segment.index) + ']');
        }

        return parseObject(keys, val, options, valuesParsed);
    };

    var normalizeParseOptions = function normalizeParseOptions(opts) {
        if (!opts) {
            return defaults;
        }

        if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
            throw new TypeError('Decoder has to be a function.');
        }

        if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
            throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
        }
        var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

        return {
            allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
            allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
            allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
            arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
            charset: charset,
            charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
            comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
            decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
            delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
            // eslint-disable-next-line no-implicit-coercion, no-extra-parens
            depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
            ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
            interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
            parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
            parseArrays: opts.parseArrays !== false,
            plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
            strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
        };
    };

    var parse = function (str, opts) {
        var options = normalizeParseOptions(opts);

        if (str === '' || str === null || typeof str === 'undefined') {
            return options.plainObjects ? Object.create(null) : {};
        }

        var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
        var obj = options.plainObjects ? Object.create(null) : {};

        // Iterate over the keys and setup the new object

        var keys = Object.keys(tempObj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
            obj = utils.merge(obj, newObj, options);
        }

        if (options.allowSparse === true) {
            return obj;
        }

        return utils.compact(obj);
    };

    var lib = {
        formats: formats,
        parse: parse,
        stringify: stringify_1$1
    };

    /**
     * lodash 4.0.1 (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * Available under MIT license <https://lodash.com/license>
     */
    /** `Object#toString` result references. */
    var stringTag = '[object String]';

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString$1 = objectProto$1.toString;

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike$1(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike$1(value) && objectToString$1.call(value) == stringTag);
    }

    var lodash_isstring = isString;

    class AbortError extends Error {
    	constructor() {
    		super('Throttled function aborted');
    		this.name = 'AbortError';
    	}
    }

    const pThrottle = ({limit, interval, strict}) => {
    	if (!Number.isFinite(limit)) {
    		throw new TypeError('Expected `limit` to be a finite number');
    	}

    	if (!Number.isFinite(interval)) {
    		throw new TypeError('Expected `interval` to be a finite number');
    	}

    	const queue = new Map();

    	let currentTick = 0;
    	let activeCount = 0;

    	function windowedDelay() {
    		const now = Date.now();

    		if ((now - currentTick) > interval) {
    			activeCount = 1;
    			currentTick = now;
    			return 0;
    		}

    		if (activeCount < limit) {
    			activeCount++;
    		} else {
    			currentTick += interval;
    			activeCount = 1;
    		}

    		return currentTick - now;
    	}

    	const strictTicks = [];

    	function strictDelay() {
    		const now = Date.now();

    		if (strictTicks.length < limit) {
    			strictTicks.push(now);
    			return 0;
    		}

    		const earliestTime = strictTicks.shift() + interval;

    		if (now >= earliestTime) {
    			strictTicks.push(now);
    			return 0;
    		}

    		strictTicks.push(earliestTime);
    		return earliestTime - now;
    	}

    	const getDelay = strict ? strictDelay : windowedDelay;

    	return function_ => {
    		const throttled = function (...args) {
    			if (!throttled.isEnabled) {
    				return (async () => function_.apply(this, args))();
    			}

    			let timeout;
    			return new Promise((resolve, reject) => {
    				const execute = () => {
    					resolve(function_.apply(this, args));
    					queue.delete(timeout);
    				};

    				timeout = setTimeout(execute, getDelay());

    				queue.set(timeout, reject);
    			});
    		};

    		throttled.abort = () => {
    			for (const timeout of queue.keys()) {
    				clearTimeout(timeout);
    				queue.get(timeout)(new AbortError());
    			}

    			queue.clear();
    			strictTicks.splice(0, strictTicks.length);
    		};

    		throttled.isEnabled = true;

    		return throttled;
    	};
    };

    var pThrottle_1 = pThrottle;
    var AbortError_1 = AbortError;
    pThrottle_1.AbortError = AbortError_1;

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */
    /** `Object#toString` result references. */
    var objectTag = '[object Object]';

    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */
    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;
      if (value != null && typeof value.toString != 'function') {
        try {
          result = !!(value + '');
        } catch (e) {}
      }
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Built-in value references. */
    var getPrototype = overArg(Object.getPrototypeOf, Object);

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) ||
          objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return (typeof Ctor == 'function' &&
        Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
    }

    var lodash_isplainobject = isPlainObject;

    function ownKeys$4(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) {
          _defineProperty$4(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }

      return target;
    }

    function _typeof$1(obj) {
      "@babel/helpers - typeof";

      return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof$1(obj);
    }

    function _wrapRegExp() {
      _wrapRegExp = function (re, groups) {
        return new BabelRegExp(re, void 0, groups);
      };

      var _super = RegExp.prototype,
          _groups = new WeakMap();

      function BabelRegExp(re, flags, groups) {
        var _this = new RegExp(re, flags);

        return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
      }

      function buildGroups(result, re) {
        var g = _groups.get(re);

        return Object.keys(g).reduce(function (groups, name) {
          return groups[name] = result[g[name]], groups;
        }, Object.create(null));
      }

      return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
        var result = _super.exec.call(this, str);

        return result && (result.groups = buildGroups(result, this)), result;
      }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
        if ("string" == typeof substitution) {
          var groups = _groups.get(this);

          return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
            return "$" + groups[name];
          }));
        }

        if ("function" == typeof substitution) {
          var _this = this;

          return _super[Symbol.replace].call(this, str, function () {
            var args = arguments;
            return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
          });
        }

        return _super[Symbol.replace].call(this, str, substitution);
      }, _wrapRegExp.apply(this, arguments);
    }

    function _defineProperty$4(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      Object.defineProperty(subClass, "prototype", {
        writable: false
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;

          var F = function () {};

          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function () {
          it = it.call(o);
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    function isNode() {
      /**
       * Polyfills of 'process' might set process.browser === true
       *
       * See:
       * https://github.com/webpack/node-libs-browser/blob/master/mock/process.js#L8
       * https://github.com/defunctzombie/node-process/blob/master/browser.js#L156
       **/
      return typeof process !== 'undefined' && !process.browser;
    }
    function isReactNative() {
      return typeof window !== 'undefined' && 'navigator' in window && 'product' in window.navigator && window.navigator.product === 'ReactNative';
    }
    function getNodeVersion() {
      return process.versions && process.versions.node ? "v".concat(process.versions.node) : process.version;
    }
    function getWindow() {
      return window;
    }
    function noop() {
      return undefined;
    }

    var PERCENTAGE_REGEX = /*#__PURE__*/_wrapRegExp(/(\d+)(%)/, {
      value: 1
    });

    function calculateLimit(type) {
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
      var limit = max;

      if (PERCENTAGE_REGEX.test(type)) {
        var _type$match;

        var groups = (_type$match = type.match(PERCENTAGE_REGEX)) === null || _type$match === void 0 ? void 0 : _type$match.groups;

        if (groups && groups.value) {
          var percentage = parseInt(groups.value) / 100;
          limit = Math.round(max * percentage);
        }
      }

      return Math.min(30, Math.max(1, limit));
    }

    function createThrottle(limit, logger) {
      logger('info', "Throttle request to ".concat(limit, "/s"));
      return pThrottle_1({
        limit: limit,
        interval: 1000,
        strict: false
      });
    }

    var rateLimitThrottle = (function (axiosInstance) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
      var _axiosInstance$defaul = axiosInstance.defaults.logHandler,
          logHandler = _axiosInstance$defaul === void 0 ? noop : _axiosInstance$defaul;
      var limit = lodash_isstring(type) ? calculateLimit(type) : calculateLimit('auto', type);
      var throttle = createThrottle(limit, logHandler);
      var isCalculated = false;
      var requestInterceptorId = axiosInstance.interceptors.request.use(function (config) {
        return throttle(function () {
          return config;
        })();
      }, function (error) {
        return Promise.reject(error);
      });
      var responseInterceptorId = axiosInstance.interceptors.response.use(function (response) {
        if (!isCalculated && lodash_isstring(type) && (type === 'auto' || PERCENTAGE_REGEX.test(type)) && response.headers && response.headers['x-contentful-ratelimit-second-limit']) {
          var rawLimit = parseInt(response.headers['x-contentful-ratelimit-second-limit']);
          var nextLimit = calculateLimit(type, rawLimit);

          if (nextLimit !== limit) {
            if (requestInterceptorId) {
              axiosInstance.interceptors.request.eject(requestInterceptorId);
            }

            limit = nextLimit;
            throttle = createThrottle(nextLimit, logHandler);
            requestInterceptorId = axiosInstance.interceptors.request.use(function (config) {
              return throttle(function () {
                return config;
              })();
            }, function (error) {
              return Promise.reject(error);
            });
          }

          isCalculated = true;
        }

        return response;
      }, function (error) {
        return Promise.reject(error);
      });
      return function () {
        axiosInstance.interceptors.request.eject(requestInterceptorId);
        axiosInstance.interceptors.response.eject(responseInterceptorId);
      };
    });

    var delay = function delay(ms) {
      return new Promise(function (resolve) {
        setTimeout(resolve, ms);
      });
    };

    var defaultWait = function defaultWait(attempts) {
      return Math.pow(Math.SQRT2, attempts);
    };

    function rateLimit(instance) {
      var maxRetry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var _instance$defaults = instance.defaults,
          _instance$defaults$re = _instance$defaults.responseLogger,
          responseLogger = _instance$defaults$re === void 0 ? noop : _instance$defaults$re,
          _instance$defaults$re2 = _instance$defaults.requestLogger,
          requestLogger = _instance$defaults$re2 === void 0 ? noop : _instance$defaults$re2;
      instance.interceptors.request.use(function (config) {
        requestLogger(config);
        return config;
      }, function (error) {
        requestLogger(error);
        return Promise.reject(error);
      });
      instance.interceptors.response.use(function (response) {
        // we don't need to do anything here
        responseLogger(response);
        return response;
      }, function (error) {
        var response = error.response;
        var config = error.config;
        responseLogger(error); // Do not retry if it is disabled or no request config exists (not an axios error)

        if (!config || !instance.defaults.retryOnError) {
          return Promise.reject(error);
        } // Retried already for max attempts


        var doneAttempts = config.attempts || 1;

        if (doneAttempts > maxRetry) {
          error.attempts = config.attempts;
          return Promise.reject(error);
        }

        var retryErrorType = null;
        var wait = defaultWait(doneAttempts); // Errors without response did not receive anything from the server

        if (!response) {
          retryErrorType = 'Connection';
        } else if (response.status >= 500 && response.status < 600) {
          // 5** errors are server related
          retryErrorType = "Server ".concat(response.status);
        } else if (response.status === 429) {
          // 429 errors are exceeded rate limit exceptions
          retryErrorType = 'Rate limit'; // all headers are lowercased by axios https://github.com/mzabriskie/axios/issues/413

          if (response.headers && error.response.headers['x-contentful-ratelimit-reset']) {
            wait = response.headers['x-contentful-ratelimit-reset'];
          }
        }

        if (retryErrorType) {
          // convert to ms and add jitter
          wait = Math.floor(wait * 1000 + Math.random() * 200 + 500);
          instance.defaults.logHandler('warning', "".concat(retryErrorType, " error occurred. Waiting for ").concat(wait, " ms before retrying...")); // increase attempts counter

          config.attempts = doneAttempts + 1;
          /* Somehow between the interceptor and retrying the request the httpAgent/httpsAgent gets transformed from an Agent-like object
           to a regular object, causing failures on retries after rate limits. Removing these properties here fixes the error, but retry
           requests still use the original http/httpsAgent property */

          delete config.httpAgent;
          delete config.httpsAgent;
          return delay(wait).then(function () {
            return instance(config);
          });
        }

        return Promise.reject(error);
      });
    }

    function asyncToken(instance, getToken) {
      instance.interceptors.request.use(function (config) {
        return getToken().then(function (accessToken) {
          config.headers = _objectSpread2(_objectSpread2({}, config.headers), {}, {
            Authorization: "Bearer ".concat(accessToken)
          });
          return config;
        });
      });
    }

    // Also enforces toplevel domain specified, no spaces and no protocol

    var HOST_REGEX = /^(?!\w+:\/\/)([^\s:]+\.?[^\s:]+)(?::(\d+))?(?!:)$/;
    /**
     * Create pre configured axios instance
     * @private
     * @param {AxiosStatic} axios - Axios library
     * @param {CreateHttpClientParams} options - Initialization parameters for the HTTP client
     * @return {ContentfulAxiosInstance} Initialized axios instance
     */

    function createHttpClient(axios, options) {
      var defaultConfig = {
        insecure: false,
        retryOnError: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logHandler: function logHandler(level, data) {
          if (level === 'error' && data) {
            var title = [data.name, data.message].filter(function (a) {
              return a;
            }).join(' - ');
            console.error("[error] ".concat(title));
            console.error(data);
            return;
          }

          console.log("[".concat(level, "] ").concat(data));
        },
        // Passed to axios
        headers: {},
        httpAgent: false,
        httpsAgent: false,
        timeout: 30000,
        throttle: 0,
        proxy: false,
        basePath: '',
        adapter: undefined,
        maxContentLength: 1073741824,
        // 1GB
        maxBodyLength: 1073741824 // 1GB

      };

      var config = _objectSpread2(_objectSpread2({}, defaultConfig), options);

      if (!config.accessToken) {
        var missingAccessTokenError = new TypeError('Expected parameter accessToken');
        config.logHandler('error', missingAccessTokenError);
        throw missingAccessTokenError;
      } // Construct axios baseURL option


      var protocol = config.insecure ? 'http' : 'https';
      var space = config.space ? "".concat(config.space, "/") : '';
      var hostname = config.defaultHostname;
      var port = config.insecure ? 80 : 443;

      if (config.host && HOST_REGEX.test(config.host)) {
        var parsed = config.host.split(':');

        if (parsed.length === 2) {

          var _parsed = _slicedToArray(parsed, 2);

          hostname = _parsed[0];
          port = _parsed[1];
        } else {
          hostname = parsed[0];
        }
      } // Ensure that basePath does start but not end with a slash


      if (config.basePath) {
        config.basePath = "/".concat(config.basePath.split('/').filter(Boolean).join('/'));
      }

      var baseURL = options.baseURL || "".concat(protocol, "://").concat(hostname, ":").concat(port).concat(config.basePath, "/spaces/").concat(space);

      if (!config.headers.Authorization && typeof config.accessToken !== 'function') {
        config.headers.Authorization = 'Bearer ' + config.accessToken;
      } // Set these headers only for node because browsers don't like it when you
      // override user-agent or accept-encoding.
      // The SDKs should set their own X-Contentful-User-Agent.


      if (isNode()) {
        config.headers['user-agent'] = 'node.js/' + getNodeVersion();
        config.headers['Accept-Encoding'] = 'gzip';
      }

      var axiosOptions = {
        // Axios
        baseURL: baseURL,
        headers: config.headers,
        httpAgent: config.httpAgent,
        httpsAgent: config.httpsAgent,
        paramsSerializer: lib.stringify,
        proxy: config.proxy,
        timeout: config.timeout,
        adapter: config.adapter,
        maxContentLength: config.maxContentLength,
        maxBodyLength: config.maxBodyLength,
        // Contentful
        logHandler: config.logHandler,
        responseLogger: config.responseLogger,
        requestLogger: config.requestLogger,
        retryOnError: config.retryOnError
      };
      var instance = axios.create(axiosOptions);
      instance.httpClientParams = options;
      /**
       * Creates a new axios instance with the same default base parameters as the
       * current one, and with any overrides passed to the newParams object
       * This is useful as the SDKs use dependency injection to get the axios library
       * and the version of the library comes from different places depending
       * on whether it's a browser build or a node.js build.
       * @private
       * @param {CreateHttpClientParams} httpClientParams - Initialization parameters for the HTTP client
       * @return {ContentfulAxiosInstance} Initialized axios instance
       */

      instance.cloneWithNewParams = function (newParams) {
        return createHttpClient(axios, _objectSpread2(_objectSpread2({}, fastCopy(options)), newParams));
      };
      /**
       * Apply interceptors.
       * Please note that the order of interceptors is important
       */


      if (config.onBeforeRequest) {
        instance.interceptors.request.use(config.onBeforeRequest);
      }

      if (typeof config.accessToken === 'function') {
        asyncToken(instance, config.accessToken);
      }

      if (config.throttle) {
        rateLimitThrottle(instance, config.throttle);
      }

      rateLimit(instance, config.retryLimit);

      if (config.onError) {
        instance.interceptors.response.use(function (response) {
          return response;
        }, config.onError);
      }

      return instance;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */

    /**
     * Creates request parameters configuration by parsing an existing query object
     * @private
     * @param {Object} query
     * @return {Object} Config object with `params` property, ready to be used in axios
     */
    function createRequestConfig(_ref) {
      var query = _ref.query;
      var config = {};
      delete query.resolveLinks;
      config.params = fastCopy(query);
      return config;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function enforceObjPath(obj, path) {
      if (!(path in obj)) {
        var err = new Error();
        err.name = 'PropertyMissing';
        err.message = "Required property ".concat(path, " missing from:\n\n").concat(JSON.stringify(obj), "\n\n");
        throw err;
      }

      return true;
    }

    // copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
    function deepFreeze(object) {
      var propNames = Object.getOwnPropertyNames(object);

      var _iterator = _createForOfIteratorHelper(propNames),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var name = _step.value;
          var value = object[name];

          if (value && _typeof$1(value) === 'object') {
            deepFreeze(value);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return Object.freeze(object);
    }

    function freezeSys(obj) {
      deepFreeze(obj.sys || {});
      return obj;
    }

    function getBrowserOS() {
      var win = getWindow();

      if (!win) {
        return null;
      }

      var userAgent = win.navigator.userAgent; // TODO: platform is deprecated.

      var platform = win.navigator.platform;
      var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
      var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
      var iosPlatforms = ['iPhone', 'iPad', 'iPod'];

      if (macosPlatforms.indexOf(platform) !== -1) {
        return 'macOS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        return 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        return 'Windows';
      } else if (/Android/.test(userAgent)) {
        return 'Android';
      } else if (/Linux/.test(platform)) {
        return 'Linux';
      }

      return null;
    }

    function getNodeOS() {
      var platform = process.platform || 'linux';
      var version = process.version || '0.0.0';
      var platformMap = {
        android: 'Android',
        aix: 'Linux',
        darwin: 'macOS',
        freebsd: 'Linux',
        linux: 'Linux',
        openbsd: 'Linux',
        sunos: 'Linux',
        win32: 'Windows'
      };

      if (platform in platformMap) {
        return "".concat(platformMap[platform] || 'Linux', "/").concat(version);
      }

      return null;
    }

    function getUserAgentHeader(sdk, application, integration, feature) {
      var headerParts = [];

      if (application) {
        headerParts.push("app ".concat(application));
      }

      if (integration) {
        headerParts.push("integration ".concat(integration));
      }

      if (feature) {
        headerParts.push('feature ' + feature);
      }

      headerParts.push("sdk ".concat(sdk));
      var platform = null;

      try {
        if (isReactNative()) {
          platform = getBrowserOS();
          headerParts.push('platform ReactNative');
        } else if (isNode()) {
          platform = getNodeOS();
          headerParts.push("platform node.js/".concat(getNodeVersion()));
        } else {
          platform = getBrowserOS();
          headerParts.push('platform browser');
        }
      } catch (e) {
        platform = null;
      }

      if (platform) {
        headerParts.push("os ".concat(platform));
      }

      return "".concat(headerParts.filter(function (item) {
        return item !== '';
      }).join('; '), ";");
    }

    /**
     * Mixes in a method to return just a plain object with no additional methods
     * @private
     * @param data - Any plain JSON response returned from the API
     * @return Enhanced object with toPlainObject method
     */

    function toPlainObject(data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return Object.defineProperty(data, 'toPlainObject', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function value() {
          return fastCopy(this);
        }
      });
    }

    /**
     * Handles errors received from the server. Parses the error into a more useful
     * format, places it in an exception and throws it.
     * See https://www.contentful.com/developers/docs/references/errors/
     * for more details on the data received on the errorResponse.data property
     * and the expected error codes.
     * @private
     */
    function errorHandler(errorResponse) {
      var config = errorResponse.config,
          response = errorResponse.response;
      var errorName; // Obscure the Management token

      if (config && config.headers && config.headers['Authorization']) {
        var token = "...".concat(config.headers['Authorization'].toString().substr(-5));
        config.headers['Authorization'] = "Bearer ".concat(token);
      }

      if (!lodash_isplainobject(response) || !lodash_isplainobject(config)) {
        throw errorResponse;
      }

      var data = response === null || response === void 0 ? void 0 : response.data;
      var errorData = {
        status: response === null || response === void 0 ? void 0 : response.status,
        statusText: response === null || response === void 0 ? void 0 : response.statusText,
        message: '',
        details: {}
      };

      if (lodash_isplainobject(config)) {
        errorData.request = {
          url: config.url,
          headers: config.headers,
          method: config.method,
          payloadData: config.data
        };
      }

      if (data && lodash_isplainobject(data)) {
        if ('requestId' in data) {
          errorData.requestId = data.requestId || 'UNKNOWN';
        }

        if ('message' in data) {
          errorData.message = data.message || '';
        }

        if ('details' in data) {
          errorData.details = data.details || {};
        }

        if ('sys' in data) {
          if ('id' in data.sys) {
            errorName = data.sys.id;
          }
        }
      }

      var error = new Error();
      error.name = errorName && errorName !== 'Unknown' ? errorName : "".concat(response === null || response === void 0 ? void 0 : response.status, " ").concat(response === null || response === void 0 ? void 0 : response.statusText);

      try {
        error.message = JSON.stringify(errorData, null, '  ');
      } catch (_unused) {
        var _errorData$message;

        error.message = (_errorData$message = errorData === null || errorData === void 0 ? void 0 : errorData.message) !== null && _errorData$message !== void 0 ? _errorData$message : '';
      }

      throw error;
    }

    var index_esModules = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createHttpClient: createHttpClient,
        createRequestConfig: createRequestConfig,
        enforceObjPath: enforceObjPath,
        errorHandler: errorHandler,
        freezeSys: freezeSys,
        getUserAgentHeader: getUserAgentHeader,
        toPlainObject: toPlainObject
    });

    var _contentfulSdkCore = /*@__PURE__*/getAugmentedNamespace(index_esModules);

    var wrapSpace_1 = wrapSpace;



    /**
     * @memberof Entities
     * @typedef Space
     * @prop {Object} sys - System metadata
     * @prop {string} sys.id - Space id
     * @prop {string} sys.type - Entity type
     * @prop {string} name - Space name
     * @prop {Array<string>} locales - Array with locale codes
     * @prop {function(): Object} toPlainObject() - Returns this Space as a plain JS object
     */

    /**
     * @private
     * @param  {Object} data - API response for a Space
     * @return {Space}
     */
    function wrapSpace(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)(data));
    }

    var space = /*#__PURE__*/Object.defineProperty({
    	wrapSpace: wrapSpace_1
    }, '__esModule', {value: true});

    var stringify_1 = createCommonjsModule(function (module, exports) {
    exports = module.exports = stringify;
    exports.getSerialize = serializer;

    function stringify(obj, replacer, spaces, cycleReplacer) {
      return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
    }

    function serializer(replacer, cycleReplacer) {
      var stack = [], keys = [];

      if (cycleReplacer == null) cycleReplacer = function(key, value) {
        if (stack[0] === value) return "[Circular ~]"
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
      };

      return function(key, value) {
        if (stack.length > 0) {
          var thisPos = stack.indexOf(this);
          ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
          ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
          if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
        }
        else stack.push(value);

        return replacer == null ? value : replacer.call(this, key, value)
      }
    }
    });

    var _default$4 = mixinStringifySafe;

    var _jsonStringifySafe = _interopRequireDefault$9(stringify_1);

    function _interopRequireDefault$9(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function mixinStringifySafe(data) {
      return Object.defineProperty(data, 'stringifySafe', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function () {
          let serializer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          let indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
          return (0, _jsonStringifySafe.default)(this, serializer, indent, (key, value) => {
            return {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: value.sys.id,
                circular: true
              }
            };
          });
        }
      });
    }

    var stringifySafe = /*#__PURE__*/Object.defineProperty({
    	default: _default$4
    }, '__esModule', {value: true});

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

    var UNRESOLVED_LINK = {}; // unique object to avoid polyfill bloat using Symbol()

    /**
     * isLink Function
     * Checks if the object has sys.type "Link"
     * @param object
     */
    var isLink = function isLink(object) {
      return object && object.sys && object.sys.type === 'Link';
    };

    /**
     * Creates a string key for lookup in entityMap
     *
     * @param {*} sys
     * @param {String} sys.type
     * @param {String} sys.id
     * @return {String}
     */
    var makeLookupKey = function makeLookupKey(sys) {
      return sys.type + '!' + sys.id;
    };

    /**
     * getLink Function
     *
     * @param response
     * @param link
     * @return {undefined}
     */
    var getLink = function getLink(entityMap, link) {
      var _link$sys = link.sys,
          type = _link$sys.linkType,
          id = _link$sys.id;

      var lookupKey = makeLookupKey({ type: type, id: id });

      return entityMap.get(lookupKey) || UNRESOLVED_LINK;
    };

    /**
     * cleanUpLinks Function
     * - Removes unresolvable links from Arrays and Objects
     *
     * @param {Object[]|Object} input
     */
    var cleanUpLinks = function cleanUpLinks(input) {
      if (Array.isArray(input)) {
        return input.filter(function (val) {
          return val !== UNRESOLVED_LINK;
        });
      }
      for (var key in input) {
        if (input[key] === UNRESOLVED_LINK) {
          delete input[key];
        }
      }
      return input;
    };

    /**
     * walkMutate Function
     * @param input
     * @param predicate
     * @param mutator
     * @return {*}
     */
    var walkMutate = function walkMutate(input, predicate, mutator, removeUnresolved) {
      if (predicate(input)) {
        return mutator(input);
      }

      if (input && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
        for (var key in input) {
          // eslint-disable-next-line no-prototype-builtins
          if (input.hasOwnProperty(key)) {
            input[key] = walkMutate(input[key], predicate, mutator, removeUnresolved);
          }
        }
        if (removeUnresolved) {
          input = cleanUpLinks(input);
        }
      }
      return input;
    };

    var normalizeLink = function normalizeLink(entityMap, link, removeUnresolved) {
      var resolvedLink = getLink(entityMap, link);
      if (resolvedLink === UNRESOLVED_LINK) {
        return removeUnresolved ? resolvedLink : link;
      }
      return resolvedLink;
    };

    var makeEntryObject = function makeEntryObject(item, itemEntryPoints) {
      if (!Array.isArray(itemEntryPoints)) {
        return item;
      }

      var entryPoints = Object.keys(item).filter(function (ownKey) {
        return itemEntryPoints.indexOf(ownKey) !== -1;
      });

      return entryPoints.reduce(function (entryObj, entryPoint) {
        entryObj[entryPoint] = item[entryPoint];
        return entryObj;
      }, {});
    };

    /**
     * resolveResponse Function
     * Resolves contentful response to normalized form.
     * @param {Object} response Contentful response
     * @param {{removeUnresolved: Boolean, itemEntryPoints: Array<String>}|{}} options
     * @param {Boolean} options.removeUnresolved - Remove unresolved links default:false
     * @param {Array<String>} options.itemEntryPoints - Resolve links only in those item properties
     * @return {Object}
     */
    var resolveResponse = function resolveResponse(response, options) {
      options = options || {};
      if (!response.items) {
        return [];
      }
      var responseClone = fastCopy(response);
      var allIncludes = Object.keys(responseClone.includes || {}).reduce(function (all, type) {
        return [].concat(_toConsumableArray(all), _toConsumableArray(response.includes[type]));
      }, []);

      var allEntries = [].concat(_toConsumableArray(responseClone.items), _toConsumableArray(allIncludes));

      var entityMap = new Map(allEntries.map(function (entity) {
        return [makeLookupKey(entity.sys), entity];
      }));

      allEntries.forEach(function (item) {
        var entryObject = makeEntryObject(item, options.itemEntryPoints);

        Object.assign(item, walkMutate(entryObject, isLink, function (link) {
          return normalizeLink(entityMap, link, options.removeUnresolved);
        }, options.removeUnresolved));
      });

      return responseClone.items;
    };

    var esm = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': resolveResponse
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(esm);

    var wrapEntry_1 = wrapEntry;
    var wrapEntryCollection_1 = wrapEntryCollection;

    var _fastCopy$5 = _interopRequireDefault$8(fastCopy);



    var _stringifySafe$1 = _interopRequireDefault$8(stringifySafe);

    var _contentfulResolveResponse$1 = _interopRequireDefault$8(require$$0);

    function _interopRequireDefault$8(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * Types of fields found in an Entry
     * @namespace EntryFields
     */

    /**
     * @memberof EntryFields
     * @typedef Symbol
     * @type string
     */

    /**
     * @memberof EntryFields
     * @typedef Text
     * @type string
     */

    /**
     * @memberof EntryFields
     * @typedef Integer
     * @type number
     */

    /**
     * @memberof EntryFields
     * @typedef Number
     * @type number
     */

    /**
     * @memberof EntryFields
     * @typedef Date
     * @type string
     */

    /**
     * @memberof EntryFields
     * @typedef Boolean
     * @type boolean
     */

    /**
     * @memberof EntryFields
     * @typedef Location
     * @prop {string} lat - latitude
     * @prop {string} lon - longitude
     */

    /**
     * A Field in an Entry can have one of the following types that can be defined in Contentful. See <a href="https://www.contentful.com/developers/docs/references/field-type/">Field Types</a> for more details.
     * @memberof Entities
     * @typedef Field
     * @type EntryFields.Symbol | EntryFields.Text | EntryFields.Integer | EntryFields.Number | EntryFields.Date | EntryFields.Boolean | EntryFields.Location | Entities.Link | Array<EntryFields.Symbol|Entities.Link> | Object
     */

    /**
     * @memberof Entities
     * @typedef Entry
     * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
     * @prop {Entities.Link} sys.contentType - Content Type used by this Entry
     * @prop {string=} sys.locale - If present, indicates the locale which this entry uses
     * @prop {Object<EntryFields.Field>} fields - Object with content for each field
     * @prop {function(): Object} toPlainObject() - Returns this Entry as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw entry data
     * @return {Entry} Wrapped entry data
     */
    function wrapEntry(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$5.default)(data)));
    }
    /**
     * @memberof Entities
     * @typedef EntryCollection
     * @prop {number} total
     * @prop {number} skip
     * @prop {number} limit
     * @prop {Array<Entities.Entry>} items
     * @prop {Array<Object>=} errors - Array of errors that might occur when retrieving entries.
     * @prop {Object<Array>=} includes - Object with arrays of includes for Entries and Assets. This will be present if resolveLinks is on, and any linked entries or assets exist. Those links will be resolved in the Entries present in the items array, but they are also present here in raw form.
     * @prop {function(): Object} toPlainObject() - Returns this Entry collection as a plain JS object
     * @prop {function(?function=, space=): Object} stringifySafe(replacer,space) - Stringifies the entry collection, accounting for circular references. Circular references will be replaced with just a Link object, with a <code>circular</code> property set to <code>true</code>. See <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">MDN</a> and <a href="https://www.npmjs.com/package/json-stringify-safe">json-stringify-safe</a> for more details on the arguments this method can take.
     */

    /**
     * Data is also mixed in with link getters if links exist and includes were requested
     * @private
     * @param {Object} data - Raw entry collection data
     * @param {Object} options - wrapper options
     * @return {EntryCollection} Wrapped entry collection data
     */


    function wrapEntryCollection(data, _ref) {
      let {
        resolveLinks,
        removeUnresolved
      } = _ref;
      const wrappedData = (0, _stringifySafe$1.default)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$5.default)(data)));

      if (resolveLinks) {
        wrappedData.items = (0, _contentfulResolveResponse$1.default)(wrappedData, {
          removeUnresolved,
          itemEntryPoints: ['fields']
        });
      }

      return (0, _contentfulSdkCore.freezeSys)(wrappedData);
    }

    var entry = /*#__PURE__*/Object.defineProperty({
    	wrapEntry: wrapEntry_1,
    	wrapEntryCollection: wrapEntryCollection_1
    }, '__esModule', {value: true});

    var wrapAsset_1 = wrapAsset;
    var wrapAssetCollection_1 = wrapAssetCollection;

    var _fastCopy$4 = _interopRequireDefault$7(fastCopy);



    function _interopRequireDefault$7(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * @memberof Entities
     * @typedef Asset
     * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
     * @prop {string=} sys.locale - If present, indicates the locale which this asset uses
     * @prop {Object} fields - Object with content for each field
     * @prop {string} fields.title - Title for this asset
     * @prop {string} fields.description - Description for this asset
     * @prop {Object} fields.file - File object for this asset
     * @prop {string} fields.file.fileName - Name for the file
     * @prop {string} fields.file.contentType - Mime type for the file
     * @prop {string} fields.file.url - Url where the file is available at.
     * @prop {Object} fields.file.details - Details for the file, depending on file type (example: image size in bytes, etc)
     * @prop {function(): Object} toPlainObject() - Returns this Asset as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw asset data
     * @return {Asset} Wrapped asset data
     */
    function wrapAsset(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$4.default)(data)));
    }
    /**
     * @memberof Entities
     * @typedef AssetCollection
     * @prop {number} total
     * @prop {number} skip
     * @prop {number} limit
     * @prop {Array<Entities.Asset>} items
     * @prop {function(): Object} toPlainObject() - Returns this Asset collection as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw asset collection data
     * @return {AssetCollection} Wrapped asset collection data
     */


    function wrapAssetCollection(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$4.default)(data)));
    }

    var asset = /*#__PURE__*/Object.defineProperty({
    	wrapAsset: wrapAsset_1,
    	wrapAssetCollection: wrapAssetCollection_1
    }, '__esModule', {value: true});

    var wrapAssetKey_1 = wrapAssetKey;

    var _fastCopy$3 = _interopRequireDefault$6(fastCopy);



    function _interopRequireDefault$6(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * @memberof Entities
     * @typedef AssetKey
     * @prop {string} policy - The asset key's policy
     * @prop {string} secret - The secret for creating a signing token
     * @prop {function(): Object} toPlainObject() - Returns this AssetKey as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw asset key data
     * @return {Asset} Wrapped asset key data
     */
    function wrapAssetKey(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$3.default)(data)));
    }

    var assetKey = /*#__PURE__*/Object.defineProperty({
    	wrapAssetKey: wrapAssetKey_1
    }, '__esModule', {value: true});

    var wrapContentType_1 = wrapContentType;
    var wrapContentTypeCollection_1 = wrapContentTypeCollection;

    var _fastCopy$2 = _interopRequireDefault$5(fastCopy);



    function _interopRequireDefault$5(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * @memberof Entities
     * @typedef ContentType
     * @prop {Entities.Sys} sys - System metadata
     * @prop {string} name
     * @prop {string} description
     * @prop {string} displayField - Field used as the main display field for Entries
     * @prop {string} Array<Field> - All the fields contained in this Content Type
     * @prop {function(): Object} toPlainObject() - Returns this Content Type as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw content type data
     * @return {ContentType} Wrapped content type data
     */
    function wrapContentType(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$2.default)(data)));
    }
    /**
     * @memberof Entities
     * @typedef ContentTypeCollection
     * @prop {number} total
     * @prop {number} skip
     * @prop {number} limit
     * @prop {Array<Entities.ContentType>} items
     * @prop {function(): Object} toPlainObject() - Returns this Content Type collection as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw content type collection data
     * @return {ContentTypeCollection} Wrapped content type collection data
     */


    function wrapContentTypeCollection(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$2.default)(data)));
    }

    var contentType = /*#__PURE__*/Object.defineProperty({
    	wrapContentType: wrapContentType_1,
    	wrapContentTypeCollection: wrapContentTypeCollection_1
    }, '__esModule', {value: true});

    var wrapLocale_1 = wrapLocale;
    var wrapLocaleCollection_1 = wrapLocaleCollection;

    var _fastCopy$1 = _interopRequireDefault$4(fastCopy);



    function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * @memberof Entities
     * @typedef Locale
     * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
     * @prop {string} name - locale name (example: English)
     * @prop {string} code - locale code (example: en-US)
     * @prop {string} fallbackCode - the locale code to fallback to when there is not content for the current locale
     * @prop {boolean} default - If this is the default locale
     * @prop {boolean} optional - If the locale needs to be filled in on entries or not
     * @prop {function(): Object} toPlainObject() - Returns this Locale as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw locale data
     * @return {Locale} Wrapped locale data
     */
    function wrapLocale(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$1.default)(data)));
    }
    /**
     * @memberof Entities
     * @typedef LocaleCollection
     * @prop {number} total
     * @prop {number} skip
     * @prop {number} limit
     * @prop {Array<Entities.Locale>} items
     * @prop {function(): Object} toPlainObject() - Returns this Locale collection as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw locale collection data
     * @return {LocaleCollection} Wrapped locale collection data
     */


    function wrapLocaleCollection(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy$1.default)(data)));
    }

    var locale = /*#__PURE__*/Object.defineProperty({
    	wrapLocale: wrapLocale_1,
    	wrapLocaleCollection: wrapLocaleCollection_1
    }, '__esModule', {value: true});

    var wrapTag_1 = wrapTag;
    var wrapTagCollection_1 = wrapTagCollection;

    var _fastCopy = _interopRequireDefault$3(fastCopy);



    function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * @memberof Entities
     * @typedef Tag
     * @prop {Entities.Sys} sys - Standard system metadata with additional entry specific properties
     * @prop {string} name - Tag name
     * @prop {function(): Object} toPlainObject() - Returns this tag as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw tag data
     * @return {Tag} Wrapped tag data
     */
    function wrapTag(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy.default)(data)));
    }
    /**
     * @memberof Entities
     * @typedef TagCollection
     * @prop {number} total
     * @prop {number} skip
     * @prop {number} limit
     * @prop {Array<Entities.Tag>} items
     * @prop {function(): Object} toPlainObject() - Returns this Tag collection as a plain JS object
     */

    /**
     * @private
     * @param {Object} data - Raw tag collection data
     * @return {TagCollection} Wrapped tag collection data
     */


    function wrapTagCollection(data) {
      return (0, _contentfulSdkCore.freezeSys)((0, _contentfulSdkCore.toPlainObject)((0, _fastCopy.default)(data)));
    }

    var tag = /*#__PURE__*/Object.defineProperty({
    	wrapTag: wrapTag_1,
    	wrapTagCollection: wrapTagCollection_1
    }, '__esModule', {value: true});

    var entities = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;

    var space$1 = _interopRequireWildcard(space);

    var entry$1 = _interopRequireWildcard(entry);

    var asset$1 = _interopRequireWildcard(asset);

    var assetKey$1 = _interopRequireWildcard(assetKey);

    var contentType$1 = _interopRequireWildcard(contentType);

    var locale$1 = _interopRequireWildcard(locale);

    var tag$1 = _interopRequireWildcard(tag);

    function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

    function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

    var _default = {
      space: space$1,
      entry: entry$1,
      asset: asset$1,
      assetKey: assetKey$1,
      contentType: contentType$1,
      locale: locale$1,
      tag: tag$1
    };
    exports.default = _default;
    });

    var _default$3 = pagedSync;



    var _contentfulResolveResponse = _interopRequireDefault$2(require$$0);

    var _stringifySafe = _interopRequireDefault$2(stringifySafe);

    function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty$3(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

    function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    /**
     * @memberof Sync
     * @typedef SyncCollection
     * @prop {Array<Entities.Entry>} entries - All existing entries on first sync. New and updated entries on subsequent syncs.
     * @prop {Array<Entities.Asset>} assets - All existing assets on first sync. New and updated assets on subsequent syncs.
     * @prop {Array<Sync.DeletedEntry>} deletedEntries - List of deleted Entries since last sync
     * @prop {Array<Sync.DeletedAsset>} deletedAssets - List of deleted Assets since last sync
     * @prop {string} nextSyncToken - Token to be sent to the next sync call
     * @prop {function(): Object} toPlainObject() - Returns this Sync collection as a plain JS object
     * @prop {function(?function=, space=): Object} stringifySafe(replacer,space) - Stringifies the Sync collection, accounting for circular references. Circular references will be replaced with just a Link object, with a <code>circular</code> property set to <code>true</code>. See <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">MDN</a> and <a href="https://www.npmjs.com/package/json-stringify-safe">json-stringify-safe</a> for more details on the arguments this method can take.
     */

    /**
     * Deleted Entries are the same as Entries, but only appear on the sync API.
     * @memberof Sync
     * @typedef DeletedEntry
     * @type Entities.Entry
     */

    /**
     * Deleted Assets are the same as Assets, but only appear on the sync API.
     * @memberof Sync
     * @typedef DeletedAsset
     * @type Entities.Asset
     */

    /**
     * This module retrieves all the available pages for a sync operation
     * @private
     * @param {Object} http - HTTP client
     * @param {Object} query - Query object
     * @param {Object} options - Sync options object
     * @param {boolean} [options.resolveLinks = true] - If links should be resolved
     * @param {boolean} [options.removeUnresolved = false] - If unresolvable links should get removed
     * @param {boolean} [options.paginate = true] - If further sync pages should automatically be crawled
     * @return {Promise<SyncCollection>}
     */
    async function pagedSync(http, query) {
      let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!query || !query.initial && !query.nextSyncToken && !query.nextPageToken) {
        throw new Error('Please provide one of `initial`, `nextSyncToken` or `nextPageToken` parameters for syncing');
      }

      if (query && query.content_type && !query.type) {
        query.type = 'Entry';
      } else if (query && query.content_type && query.type && query.type !== 'Entry') {
        throw new Error('When using the `content_type` filter your `type` parameter cannot be different from `Entry`.');
      }

      const defaultOptions = {
        resolveLinks: true,
        removeUnresolved: false,
        paginate: true
      };

      const {
        resolveLinks,
        removeUnresolved,
        paginate
      } = _objectSpread$3(_objectSpread$3({}, defaultOptions), options);

      const syncOptions = {
        paginate
      };
      const response = await getSyncPage(http, [], query, syncOptions); // clones response.items used in includes because we don't want these to be mutated

      if (resolveLinks) {
        response.items = (0, _contentfulResolveResponse.default)(response, {
          removeUnresolved,
          itemEntryPoints: ['fields']
        });
      } // maps response items again after getters are attached


      const mappedResponseItems = mapResponseItems(response.items);

      if (response.nextSyncToken) {
        mappedResponseItems.nextSyncToken = response.nextSyncToken;
      }

      if (response.nextPageToken) {
        mappedResponseItems.nextPageToken = response.nextPageToken;
      }

      return (0, _contentfulSdkCore.freezeSys)((0, _stringifySafe.default)((0, _contentfulSdkCore.toPlainObject)(mappedResponseItems)));
    }
    /**
     * @private
     * @param {Array<Entities.Entry|Entities.Array|Sync.DeletedEntry|Sync.DeletedAsset>} items
     * @return {Object} Entities mapped to an object for each entity type
     */


    function mapResponseItems(items) {
      const reducer = type => {
        return (accumulated, item) => {
          if (item.sys.type === type) {
            accumulated.push((0, _contentfulSdkCore.toPlainObject)(item));
          }

          return accumulated;
        };
      };

      return {
        entries: items.reduce(reducer('Entry'), []),
        assets: items.reduce(reducer('Asset'), []),
        deletedEntries: items.reduce(reducer('DeletedEntry'), []),
        deletedAssets: items.reduce(reducer('DeletedAsset'), [])
      };
    }
    /**
     * If the response contains a nextPageUrl, extracts the sync token to get the
     * next page and calls itself again with that token.
     * Otherwise, if the response contains a nextSyncUrl, extracts the sync token
     * and returns it.
     * On each call of this function, any retrieved items are collected in the
     * supplied items array, which gets returned in the end
     * @private
     * @param {Object} http
     * @param {Array<Entities.Entry|Entities.Array|Sync.DeletedEntry|Sync.DeletedAsset>} items
     * @param {Object} query
     * @param {Object} options - Sync page options object
     * @param {boolean} [options.paginate = true] - If further sync pages should automatically be crawled
     * @return {Promise<{items: Array, nextSyncToken: string}>}
     */


    async function getSyncPage(http, items, query, _ref) {
      let {
        paginate
      } = _ref;

      if (query.nextSyncToken) {
        query.sync_token = query.nextSyncToken;
        delete query.nextSyncToken;
      }

      if (query.nextPageToken) {
        query.sync_token = query.nextPageToken;
        delete query.nextPageToken;
      }

      if (query.sync_token) {
        delete query.initial;
        delete query.type;
        delete query.content_type;
        delete query.limit;
      }

      const response = await http.get('sync', (0, _contentfulSdkCore.createRequestConfig)({
        query: query
      }));
      const data = response.data || {};
      items = items.concat(data.items || []);

      if (data.nextPageUrl) {
        if (paginate) {
          delete query.initial;
          query.sync_token = getToken(data.nextPageUrl);
          return getSyncPage(http, items, query, {
            paginate
          });
        }

        return {
          items: items,
          nextPageToken: getToken(data.nextPageUrl)
        };
      } else if (data.nextSyncUrl) {
        return {
          items: items,
          nextSyncToken: getToken(data.nextSyncUrl)
        };
      } else {
        return {
          items: []
        };
      }
    }
    /**
     * Extracts token out of an url
     * @private
     */


    function getToken(url) {
      const urlParts = url.split('?');
      return urlParts.length > 0 ? urlParts[1].replace('sync_token=', '') : '';
    }

    var pagedSync_1 = /*#__PURE__*/Object.defineProperty({
    	default: _default$3
    }, '__esModule', {value: true});

    var _default$2 = normalizeSelect;

    function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty$2(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

    function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    /*
    * sdk relies heavily on sys metadata
    * so we cannot omit the sys property on sdk level entirely
    * and we have to ensure that at least `id` and `type` are present
    * */
    function normalizeSelect(query) {
      if (!query.select) {
        return query;
      } // The selection of fields for the query is limited
      // Get the different parts that are listed for selection


      const allSelects = Array.isArray(query.select) ? query.select : query.select.split(','); // Move the parts into a set for easy access and deduplication

      const selectedSet = new Set(allSelects); // If we already select all of `sys` we can just return
      // since we're anyway fetching everything that is needed

      if (selectedSet.has('sys')) {
        return query;
      } // We don't select `sys` so we need to ensure the minimum set


      selectedSet.add('sys.id');
      selectedSet.add('sys.type'); // Reassign the normalized sys properties

      return _objectSpread$2(_objectSpread$2({}, query), {}, {
        select: [...selectedSet].join(',')
      });
    }

    var normalizeSelect_1 = /*#__PURE__*/Object.defineProperty({
    	default: _default$2
    }, '__esModule', {value: true});

    var validateTimestamp_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ValidationError = void 0;
    exports.default = validateTimestamp;

    class ValidationError extends Error {
      constructor(name, message) {
        super(`Invalid "${name}" provided, ` + message);
        this.name = 'ValidationError';
      }

    }

    exports.ValidationError = ValidationError;

    function validateTimestamp(name, timestamp, options) {
      options = options || {};

      if (typeof timestamp !== 'number') {
        throw new ValidationError(name, `only numeric values are allowed for timestamps, provided type was "${typeof timestamp}"`);
      }

      if (options.maximum && timestamp > options.maximum) {
        throw new ValidationError(name, `value (${timestamp}) cannot be further in the future than expected maximum (${options.maximum})`);
      }

      if (options.now && timestamp < options.now) {
        throw new ValidationError(name, `value (${timestamp}) cannot be in the past, current time was ${options.now}`);
      }
    }
    });

    var _default$1 = createContentfulApi;



    var _entities = _interopRequireDefault$1(entities);

    var _pagedSync = _interopRequireDefault$1(pagedSync_1);

    var _normalizeSelect = _interopRequireDefault$1(normalizeSelect_1);

    var _validateTimestamp = _interopRequireDefault$1(validateTimestamp_1);

    function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

    function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    const ASSET_KEY_MAX_LIFETIME = 48 * 60 * 60;
    /**
     * Creates API object with methods to access functionality from Contentful's
     * Delivery API
     * @private
     * @param {Object} params - API initialization params
     * @prop {Object} http - HTTP client instance
     * @prop {Object} entities - Object with wrapper methods for each kind of entity
     * @prop {Function} getGlobalOptions - Link resolver preconfigured with global setting
     * @return {ClientAPI}
     */

    function createContentfulApi(_ref) {
      let {
        http,
        getGlobalOptions
      } = _ref;
      const {
        wrapSpace
      } = _entities.default.space;
      const {
        wrapContentType,
        wrapContentTypeCollection
      } = _entities.default.contentType;
      const {
        wrapEntry,
        wrapEntryCollection
      } = _entities.default.entry;
      const {
        wrapAsset,
        wrapAssetCollection
      } = _entities.default.asset;
      const {
        wrapTag,
        wrapTagCollection
      } = _entities.default.tag;
      const {
        wrapAssetKey
      } = _entities.default.assetKey;
      const {
        wrapLocaleCollection
      } = _entities.default.locale;

      const notFoundError = id => {
        const error = new Error('The resource could not be found.');
        error.sys = {
          type: 'Error',
          id: 'NotFound'
        };
        error.details = {
          type: 'Entry',
          id: id,
          environment: getGlobalOptions().environment,
          space: getGlobalOptions().space
        };
        return error;
      };
      /**
       * Gets the Space which the client is currently configured to use
       * @memberof ContentfulClientAPI
       * @return {Promise<Entities.Space>} Promise for a Space
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       * // returns the space object with the above <space-id>
       * const space = await client.getSpace()
       * console.log(space)
       */


      async function getSpace() {
        switchToSpace(http);

        try {
          const response = await http.get('/');
          return wrapSpace(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets a Content Type
       * @memberof ContentfulClientAPI
       * @param  {string} id
       * @return {Promise<Entities.ContentType>} Promise for a Content Type
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const contentType = await client.getContentType('<content_type_id>')
       * console.log(contentType)
       */


      async function getContentType(id) {
        switchToEnvironment(http);

        try {
          const response = await http.get(`content_types/${id}`);
          return wrapContentType(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets a collection of Content Types
       * @memberof ContentfulClientAPI
       * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
       * @return {Promise<Entities.ContentTypeCollection>} Promise for a collection of Content Types
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const response = await client.getContentTypes()
       * console.log(response.items)
       */


      async function getContentTypes() {
        let query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        switchToEnvironment(http);

        try {
          const response = await http.get('content_types', (0, _contentfulSdkCore.createRequestConfig)({
            query: query
          }));
          return wrapContentTypeCollection(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets an Entry
       * @memberof ContentfulClientAPI
       * @param  {string} id
       * @param  {Object=} query - Object with search parameters. In this method it's only useful for `locale`.
       * @return {Promise<Entities.Entry>} Promise for an Entry
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const entry = await client.getEntry('<entry_id>')
       * console.log(entry)
       */


      async function getEntry(id) {
        let query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!id) {
          throw notFoundError(id);
        }

        try {
          const response = await this.getEntries(_objectSpread$1({
            'sys.id': id
          }, query));

          if (response.items.length > 0) {
            return wrapEntry(response.items[0]);
          } else {
            throw notFoundError(id);
          }
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets a collection of Entries
       * @memberof ContentfulClientAPI
       * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
       * @return {Promise<Entities.EntryCollection>} Promise for a collection of Entries
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const response = await client.getEntries()
       * console.log(response.items)
       */


      async function getEntries() {
        let query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        switchToEnvironment(http);
        const {
          resolveLinks,
          removeUnresolved
        } = getGlobalOptions(query);
        query = (0, _normalizeSelect.default)(query);

        try {
          const response = await http.get('entries', (0, _contentfulSdkCore.createRequestConfig)({
            query: query
          }));
          return wrapEntryCollection(response.data, {
            resolveLinks,
            removeUnresolved
          });
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets an Asset
       * @memberof ContentfulClientAPI
       * @param  {string} id
       * @param  {Object=} query - Object with search parameters. In this method it's only useful for `locale`.
       * @return {Promise<Entities.Asset>} Promise for an Asset
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const asset = await client.getAsset('<asset_id>')
       * console.log(asset)
       */


      async function getAsset(id) {
        let query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        switchToEnvironment(http);
        query = (0, _normalizeSelect.default)(query);

        try {
          const response = await http.get(`assets/${id}`, (0, _contentfulSdkCore.createRequestConfig)({
            query: query
          }));
          return wrapAsset(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets a collection of Assets
       * @memberof ContentfulClientAPI
       * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
       * @return {Promise<Entities.AssetCollection>} Promise for a collection of Assets
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const response = await client.getAssets()
       * console.log(response.items)
       */


      async function getAssets() {
        let query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        switchToEnvironment(http);
        query = (0, _normalizeSelect.default)(query);

        try {
          const response = await http.get('assets', (0, _contentfulSdkCore.createRequestConfig)({
            query: query
          }));
          return wrapAssetCollection(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets a Tag
       * @memberof ContentfulClientAPI
       * @param  {string} id
       * @return {Promise<Entities.Tag>} Promise for a Tag
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const tag = await client.getTag('<asset_id>')
       * console.log(tag)
       */


      async function getTag(id) {
        switchToEnvironment(http);

        try {
          const response = await http.get(`tags/${id}`);
          return wrapTag(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets a collection of Tags
       * @memberof ContentfulClientAPI
       * @param  {Object=} query - Object with search parameters.
       * @return {Promise<Entities.TagCollection>} Promise for a collection of Tags
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const response = await client.getTags()
       * console.log(response.items)
       */


      async function getTags() {
        let query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        switchToEnvironment(http);
        query = (0, _normalizeSelect.default)(query);

        try {
          const response = await http.get('tags', (0, _contentfulSdkCore.createRequestConfig)({
            query: query
          }));
          return wrapTagCollection(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Creates an asset key for signing asset URLs (Embargoed Assets)
       * @memberof ContentfulClientAPI
       * @param {number} expiresAt - UNIX timestamp in the future, maximum of 48h from now
       * @return {Promise<Entities.AssetKey>} Promise for an AssetKey
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const assetKey = await client.getAssetKey(<UNIX timestamp>)
       * console.log(assetKey)
       */


      async function createAssetKey(expiresAt) {
        switchToEnvironment(http);

        try {
          const now = Math.floor(Date.now() / 1000);
          const currentMaxLifetime = now + ASSET_KEY_MAX_LIFETIME;
          (0, _validateTimestamp.default)('expiresAt', expiresAt, {
            maximum: currentMaxLifetime,
            now
          });
          const params = {
            expiresAt
          };
          const response = await http.post('asset_keys', params);
          return wrapAssetKey(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Gets a collection of Locale
       * @memberof ContentfulClientAPI
       * @param  {Object=} query - Object with search parameters. Check the <a href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/#retrieving-entries-with-search-parameters">JS SDK tutorial</a> and the <a href="https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters">REST API reference</a> for more details.
       * @return {Promise<Entities.LocaleCollection>} Promise for a collection of Locale
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const response = await client.getLocales()
       * console.log(response.items)
       */


      async function getLocales() {
        let query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        switchToEnvironment(http);

        try {
          const response = await http.get('locales', (0, _contentfulSdkCore.createRequestConfig)({
            query: query
          }));
          return wrapLocaleCollection(response.data);
        } catch (error) {
          (0, _contentfulSdkCore.errorHandler)(error);
        }
      }
      /**
       * Synchronizes either all the content or only new content since last sync
       * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
       * <strong> Important note: </strong> The the sync api endpoint does not support include or link resolution.
       * However contentful.js is doing link resolution client side if you only make an initial sync.
       * For the delta sync (using nextSyncToken) it is not possible since the sdk wont have access to all the data to make such an operation.
       * @memberof ContentfulClientAPI
       * @param  {Object} query - Query object for the sync call. One of initial or nextSyncToken always needs to be specified, but not both.
       * @param  {boolean?} query.initial - Indicates if this is the first sync. Use it if you don't have a sync token.
       * @param  {string?} query.nextSyncToken - The token you got the last time you used this method. Ensures you only get changed content.
       * @param  {string=} query.type - Filter by this type (all (default), Entry, Asset, Deletion, DeletedAsset or DeletedEntry)
       * @param  {string=} query.content_type - Filter by this content type id
       * @param  {boolean=} query.resolveLinks - When true, links to other Entries or Assets are resolved. Default: true.
       * @param  {Object} options
       * @param  {boolean=} [options.paginate = true] - Set to false to disable pagination
       * @return {Promise<Sync.SyncCollection>} Promise for the collection resulting of a sync operation
       * @example
       * const contentful = require('contentful')
       *
       * const client = contentful.createClient({
       *   space: '<space_id>',
       *   accessToken: '<content_delivery_api_key>'
       * })
       *
       * const response = await client.sync({
       *   initial: true
       * })
       * console.log({
       *   entries: response.entries,
       *   assets: response.assets,
       *   nextSyncToken: response.nextSyncToken
       * })
       */


      async function sync() {
        let query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          paginate: true
        };
        const {
          resolveLinks,
          removeUnresolved
        } = getGlobalOptions(query);
        switchToEnvironment(http);
        return (0, _pagedSync.default)(http, query, _objectSpread$1({
          resolveLinks,
          removeUnresolved
        }, options));
      }
      /**
      * Parse raw json data into collection of entry objects.Links will be resolved also
      * @memberof ContentfulClientAPI
      * @param {Object} raw json data
      * @example
      * let data = {items: [
      *    {
      *    sys: {type: 'Entry', locale: 'en-US'},
      *    fields: {
      *      animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}},
      *      anotheranimal: {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}}
      *    }
      *  }
      * ],
      * includes: {
      *  Animal: [
      *    {
      *      sys: {type: 'Animal', id: 'oink', locale: 'en-US'},
      *      fields: {
      *        name: 'Pig',
      *        friend: {sys: {type: 'Link', linkType: 'Animal', id: 'groundhog'}}
      *      }
      *    }
      *   ]
      *  }
      * }
      * console.log( data.items[0].fields.foo ); // undefined
      * let parsedData = client.parseEntries(data);
      * console.log( parsedData.items[0].fields.foo ); // foo
      */


      function parseEntries(data) {
        const {
          resolveLinks,
          removeUnresolved
        } = getGlobalOptions({});
        return wrapEntryCollection(data, {
          resolveLinks,
          removeUnresolved
        });
      }
      /*
       * Switches BaseURL to use /environments path
       * */


      function switchToEnvironment(http) {
        http.defaults.baseURL = getGlobalOptions().environmentBaseUrl;
      }
      /*
       * Switches BaseURL to use /spaces path
       * */


      function switchToSpace(http) {
        http.defaults.baseURL = getGlobalOptions().spaceBaseUrl;
      }

      return {
        getSpace,
        getContentType,
        getContentTypes,
        getEntry,
        getEntries,
        getAsset,
        getAssets,
        getTag,
        getTags,
        createAssetKey,
        getLocales,
        parseEntries,
        sync
      };
    }

    var createContentfulApi_1 = /*#__PURE__*/Object.defineProperty({
    	default: _default$1
    }, '__esModule', {value: true});

    var _default = createGlobalOptions;

    /**
     * Link resolution can be set globally, or it can be turned off for the methods
     * which make use of it. The local setting always overrides the global setting.
     * @private
     * @param {boolean} globalSetting - Global library setting for link resolution
     * @returns {function} Link resolver method preconfigured with global setting
     */
    function createGlobalOptions(globalSettings) {
      /**
       * Link resolver method
       * @param {Object} query - regular query object used for collection endpoints
       */
      return function getGlobalOptions(query) {
        return Object.assign({}, globalSettings, query);
      };
    }

    var createGlobalOptions_1 = /*#__PURE__*/Object.defineProperty({
    	default: _default
    }, '__esModule', {value: true});

    var createClient_1 = createClient;

    var _axios = _interopRequireDefault(axios);



    var _createContentfulApi = _interopRequireDefault(createContentfulApi_1);

    var _createGlobalOptions = _interopRequireDefault(createGlobalOptions_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    /**
     * Create a client instance
     * @func
     * @name createClient
     * @memberof contentful
     * @param {Object} params - Client initialization parameters
     * @prop {string} params.space - Space ID
     * @prop {string} params.accessToken - Contentful CDA Access Token
     * @prop {string} [params.environment="master"] - Contentful Environment ID
     * @prop {boolean=} params.insecure - Requests will be made over http instead of the default https (default: true)
     * @prop {string=} params.host - API host (default: cdn.contentful.com). Also usable with preview.contentful.com.
     * @prop {string=} params.basePath - Path appended to the host to support gateways/proxies with custom urls.
     * @prop {Object=} params.httpAgent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
     * @prop {Object=} params.httpsAgent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
     * @prop {Object=} params.proxy - Optional Axios proxy (see <a href="https://github.com/mzabriskie/axios#request-config"> axios docs </a>)
     * @prop {Object=} params.headers - Optional additional headers
     * @prop {function=} params.adapter - Optional axios request adapter (see <a href="https://github.com/mzabriskie/axios#request-config"> axios docs </a>)
     * @prop {boolean=?} params.resolveLinks - If we should resolve links between entries (default: true)
     * @prop {boolean=?} params.removeUnresolved - If we should remove links to entries which could not be resolved (default: false)
     * @prop {boolean=?} params.retryOnError - If we should retry on errors and 429 rate limit exceptions (default: true)
     * @prop {function=} params.logHandler - A log handler function to process given log messages & errors. Receives the log level (error, warning & info) and the actual log data (Error object or string). (The default can be found at: https://github.com/contentful/contentful-sdk-core/blob/master/src/create-http-client.ts)
     * @prop {string=?} params.application - Application name and version e.g myApp/version
     * @prop {string=?} params.integration - Integration name and version e.g react/version
     * @prop {number=} params.timeout in milliseconds - connection timeout (default:30000)
     * @prop {number=} params.retryLimit - Optional number of retries before failure. Default is 5
     * @returns {ContentfulClientAPI.ClientAPI}
     * @example
     * const contentful = require('contentful')
     * const client = contentful.createClient({
     *  accessToken: 'myAccessToken',
     *  space: 'mySpaceId'
     * })
     */
    function createClient(params) {
      if (!params.accessToken) {
        throw new TypeError('Expected parameter accessToken');
      }

      if (!params.space) {
        throw new TypeError('Expected parameter space');
      }

      const defaultConfig = {
        resolveLinks: true,
        removeUnresolved: false,
        defaultHostname: 'cdn.contentful.com',
        environment: 'master'
      };

      const config = _objectSpread(_objectSpread({}, defaultConfig), params);

      const userAgentHeader = (0, _contentfulSdkCore.getUserAgentHeader)(`contentful.js/${"9.1.13"}`, config.application, config.integration);
      config.headers = _objectSpread(_objectSpread({}, config.headers), {}, {
        'Content-Type': 'application/vnd.contentful.delivery.v1+json',
        'X-Contentful-User-Agent': userAgentHeader
      });
      const http = (0, _contentfulSdkCore.createHttpClient)(_axios.default, config);
      const getGlobalOptions = (0, _createGlobalOptions.default)({
        resolveLinks: config.resolveLinks,
        environment: config.environment,
        removeUnresolved: config.removeUnresolved,
        spaceBaseUrl: http.defaults.baseURL,
        environmentBaseUrl: `${http.defaults.baseURL}environments/${config.environment}`
      }); // Append environment to baseURL

      http.defaults.baseURL = getGlobalOptions().environmentBaseUrl;
      return (0, _createContentfulApi.default)({
        http,
        getGlobalOptions
      });
    }

    /* src/Components/Test-Headless-CMS/Contentful-Events.svelte generated by Svelte v3.46.4 */

    const { console: console_1$1 } = globals;
    const file$7 = "src/Components/Test-Headless-CMS/Contentful-Events.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (91:12) <Link to="">
    function create_default_slot_1$1(ctx) {
    	let p;
    	let t_value = /*obj*/ ctx[6].fields.title + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "title svelte-18hpea5");
    			add_location(p, file$7, 90, 25, 1955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array*/ 2 && t_value !== (t_value = /*obj*/ ctx[6].fields.title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(91:12) <Link to=\\\"\\\">",
    		ctx
    	});

    	return block;
    }

    // (83:4) {#each array as obj}
    function create_each_block$3(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let link;
    	let t1;
    	let p0;
    	let t2_value = /*obj*/ ctx[6].fields.description + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4_value = /*obj*/ ctx[6].fields.dateAndTime + "";
    	let t4;
    	let t5;
    	let p2;
    	let t6_value = /*obj*/ ctx[6].fields.location.lat + "";
    	let t6;
    	let t7;
    	let t8_value = /*obj*/ ctx[6].fields.location.lon + "";
    	let t8;
    	let t9;
    	let arrowiconbutton;
    	let t10;
    	let div1_class_value;
    	let current;

    	link = new Link$1({
    			props: {
    				to: "",
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
    			div1 = element("div");
    			img = element("img");
    			t0 = space$1();
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space$1();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space$1();
    			p1 = element("p");
    			t4 = text(t4_value);
    			t5 = space$1();
    			p2 = element("p");
    			t6 = text(t6_value);
    			t7 = text(", ");
    			t8 = text(t8_value);
    			t9 = space$1();
    			create_component(arrowiconbutton.$$.fragment);
    			t10 = space$1();
    			if (!src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].fields.image.fields.file.url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "obj-img svelte-18hpea5");
    			set_style(img, "width", /*gridWidth*/ ctx[0]);
    			set_style(img, "height", /*gridWidth*/ ctx[0]);
    			add_location(img, file$7, 86, 8, 1742);
    			attr_dev(p0, "class", "paragraph svelte-18hpea5");
    			add_location(p0, file$7, 91, 12, 2015);
    			attr_dev(p1, "small", "");
    			attr_dev(p1, "class", "paragraph svelte-18hpea5");
    			add_location(p1, file$7, 93, 12, 2078);
    			attr_dev(p2, "small", "");
    			attr_dev(p2, "class", "paragraph svelte-18hpea5");
    			add_location(p2, file$7, 95, 12, 2147);
    			attr_dev(div0, "class", "text-container svelte-18hpea5");
    			set_style(div0, "width", /*gridWidth*/ ctx[0]);
    			add_location(div0, file$7, 88, 12, 1873);

    			attr_dev(div1, "class", div1_class_value = "obj " + (/*obj*/ ctx[6].fields.title === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-18hpea5");

    			set_style(div1, "flex", "0 1 " + /*flexWidth*/ ctx[2]);
    			add_location(div1, file$7, 84, 8, 1618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(link, div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(p1, t4);
    			append_dev(div0, t5);
    			append_dev(div0, p2);
    			append_dev(p2, t6);
    			append_dev(p2, t7);
    			append_dev(p2, t8);
    			append_dev(div0, t9);
    			mount_component(arrowiconbutton, div0, null);
    			append_dev(div1, t10);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*array*/ 2 && !src_url_equal(img.src, img_src_value = /*obj*/ ctx[6].fields.image.fields.file.url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*gridWidth*/ 1) {
    				set_style(img, "width", /*gridWidth*/ ctx[0]);
    			}

    			if (!current || dirty & /*gridWidth*/ 1) {
    				set_style(img, "height", /*gridWidth*/ ctx[0]);
    			}

    			const link_changes = {};

    			if (dirty & /*$$scope, array*/ 514) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			if ((!current || dirty & /*array*/ 2) && t2_value !== (t2_value = /*obj*/ ctx[6].fields.description + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*array*/ 2) && t4_value !== (t4_value = /*obj*/ ctx[6].fields.dateAndTime + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*array*/ 2) && t6_value !== (t6_value = /*obj*/ ctx[6].fields.location.lat + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*array*/ 2) && t8_value !== (t8_value = /*obj*/ ctx[6].fields.location.lon + "")) set_data_dev(t8, t8_value);
    			const arrowiconbutton_changes = {};
    			if (dirty & /*array*/ 2) arrowiconbutton_changes.buttonText = /*obj*/ ctx[6].buttonText;
    			if (dirty & /*array*/ 2) arrowiconbutton_changes.buttonUrl = /*obj*/ ctx[6].buttonUrl;
    			arrowiconbutton.$set(arrowiconbutton_changes);

    			if (!current || dirty & /*gridWidth*/ 1) {
    				set_style(div0, "width", /*gridWidth*/ ctx[0]);
    			}

    			if (!current || dirty & /*array*/ 2 && div1_class_value !== (div1_class_value = "obj " + (/*obj*/ ctx[6].fields.title === 'ThisIsInvisible123'
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(83:4) {#each array as obj}",
    		ctx
    	});

    	return block;
    }

    // (81:0) <Router>
    function create_default_slot$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*array*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
    			set_style(div, "width", /*gridWidth*/ ctx[0]);
    			add_location(div, file$7, 81, 0, 1524);
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
    				each_value = /*array*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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

    			if (!current || dirty & /*gridWidth*/ 1) {
    				set_style(div, "width", /*gridWidth*/ ctx[0]);
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
    		source: "(81:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contentful_Events', slots, []);
    	let remainder;

    	onMount(() => {
    		console.log("test");

    		var client = createClient_1({
    			space: 'voutmqui4m2l',
    			accessToken: 'Pch2QB-Irp5JmCIl0DTH_7wCMNWZtNQe5oFsM7CYRo8'
    		});

    		client.getEntries({ content_type: 'events' }).then(function (event) {
    			// logs the entry metadata
    			//   console.log(event.items);
    			$$invalidate(1, array = event.items);

    			// logs the field with ID title
    			console.log(array);

    			// console.log(typeof(["Hello", "World"]))
    			remainder = array.length % numberOfColumns;

    			for (let i = 0; i < numberOfColumns - remainder; i++) {
    				console.log("Here " + i);

    				array.push({
    					title: "ThisIsInvisible123",
    					invisible: true,
    					url: ""
    				});
    			}

    			console.log(event.items.length);
    			console.log(array);
    		});
    	});

    	let array = [];
    	let { numberOfColumns } = $$props;
    	let { objWidth } = $$props;
    	let { gridWidth } = $$props;
    	numberOfColumns += 1;
    	let flexWidth = 100 / numberOfColumns + "%";
    	const writable_props = ['numberOfColumns', 'objWidth', 'gridWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Contentful_Events> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(0, gridWidth = $$props.gridWidth);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		onMount,
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		HeroHalfscreen: Hero_Halfscreen,
    		HeroFullscreen: Hero_Fullscreen,
    		masterComponentArray,
    		Info_1,
    		Tab,
    		ArrowIconButton: Arrow_Icon_Button,
    		createClient: createClient_1,
    		remainder,
    		array,
    		numberOfColumns,
    		objWidth,
    		gridWidth,
    		flexWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('remainder' in $$props) remainder = $$props.remainder;
    		if ('array' in $$props) $$invalidate(1, array = $$props.array);
    		if ('numberOfColumns' in $$props) $$invalidate(3, numberOfColumns = $$props.numberOfColumns);
    		if ('objWidth' in $$props) $$invalidate(4, objWidth = $$props.objWidth);
    		if ('gridWidth' in $$props) $$invalidate(0, gridWidth = $$props.gridWidth);
    		if ('flexWidth' in $$props) $$invalidate(2, flexWidth = $$props.flexWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [gridWidth, array, flexWidth, numberOfColumns, objWidth];
    }

    class Contentful_Events extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			numberOfColumns: 3,
    			objWidth: 4,
    			gridWidth: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contentful_Events",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*numberOfColumns*/ ctx[3] === undefined && !('numberOfColumns' in props)) {
    			console_1$1.warn("<Contentful_Events> was created without expected prop 'numberOfColumns'");
    		}

    		if (/*objWidth*/ ctx[4] === undefined && !('objWidth' in props)) {
    			console_1$1.warn("<Contentful_Events> was created without expected prop 'objWidth'");
    		}

    		if (/*gridWidth*/ ctx[0] === undefined && !('gridWidth' in props)) {
    			console_1$1.warn("<Contentful_Events> was created without expected prop 'gridWidth'");
    		}
    	}

    	get numberOfColumns() {
    		throw new Error("<Contentful_Events>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfColumns(value) {
    		throw new Error("<Contentful_Events>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get objWidth() {
    		throw new Error("<Contentful_Events>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set objWidth(value) {
    		throw new Error("<Contentful_Events>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridWidth() {
    		throw new Error("<Contentful_Events>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridWidth(value) {
    		throw new Error("<Contentful_Events>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Info-Sections/Left-Right-Section.svelte generated by Svelte v3.46.4 */

    const file$6 = "src/Components/Info-Sections/Left-Right-Section.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (29:4) {#each infoArray as info}
    function create_each_block$2(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div0;
    	let h3;
    	let t1_value = /*info*/ ctx[2].title + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*info*/ ctx[2].paragraph + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space$1();
    			div0 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space$1();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space$1();
    			if (!src_url_equal(img.src, img_src_value = /*info*/ ctx[2].imgUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*info*/ ctx[2].imgAlt);
    			attr_dev(img, "class", "info-image svelte-18dvov");
    			add_location(img, file$6, 30, 12, 1434);
    			attr_dev(h3, "class", "info-row-heading svelte-18dvov");
    			add_location(h3, file$6, 32, 16, 1561);
    			attr_dev(p, "class", "info-row-paragraph svelte-18dvov");
    			add_location(p, file$6, 33, 16, 1624);
    			attr_dev(div0, "class", "info-text-container svelte-18dvov");
    			add_location(div0, file$6, 31, 12, 1511);
    			attr_dev(div1, "class", "info-row svelte-18dvov");
    			add_location(div1, file$6, 29, 8, 1399);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*infoArray*/ 1 && !src_url_equal(img.src, img_src_value = /*info*/ ctx[2].imgUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*infoArray*/ 1 && img_alt_value !== (img_alt_value = /*info*/ ctx[2].imgAlt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*infoArray*/ 1 && t1_value !== (t1_value = /*info*/ ctx[2].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*infoArray*/ 1 && t3_value !== (t3_value = /*info*/ ctx[2].paragraph + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(29:4) {#each infoArray as info}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1;
    	let each_value = /*infoArray*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(/*heading*/ ctx[1]);
    			t1 = space$1();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "info-section-heading svelte-18dvov");
    			add_location(h2, file$6, 26, 4, 1312);
    			attr_dev(div, "class", "left-right-container svelte-18dvov");
    			add_location(div, file$6, 25, 4, 1273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*heading*/ 2) set_data_dev(t0, /*heading*/ ctx[1]);

    			if (dirty & /*infoArray*/ 1) {
    				each_value = /*infoArray*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('Left_Right_Section', slots, []);

    	let { infoArray = [
    		{
    			imgUrl: "/img/icon.jpg",
    			imgAlt: "",
    			title: "Where it all started",
    			paragraph: "Kabab and Curry started from humble roots in Santa Clara, with the aim of creating a distinct culinary experience that would bring the flavors of East to the Bay Area."
    		},
    		{
    			imgUrl: "/img/icon.jpg",
    			imgAlt: "",
    			title: "Growing in popularity",
    			paragraph: "Soon after its launch, our humble restaurant caught the attention of the patrons of the Bay Area as well as critics. We soon garnered a fan-following that has made us the preferred dining spot for South Asian culinary delights."
    		},
    		{
    			imgUrl: "/img/icon.jpg",
    			imgAlt: "",
    			title: "Bringing the best of flavor to the Bay Area",
    			paragraph: "Over the last decade our restaurant chain has witnessed a fast expansion, including new branches at the MCA Mosque in Santa Clara, Cupertino and the unique cafe dining experience of Kettle'e Cafe. Our bold flavors have wowed our patrons and made  us a mainstay restaurant for the culinary adventurists."
    		}
    	] } = $$props;

    	let { heading = "Heading Text" } = $$props;
    	const writable_props = ['infoArray', 'heading'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Left_Right_Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('infoArray' in $$props) $$invalidate(0, infoArray = $$props.infoArray);
    		if ('heading' in $$props) $$invalidate(1, heading = $$props.heading);
    	};

    	$$self.$capture_state = () => ({ infoArray, heading });

    	$$self.$inject_state = $$props => {
    		if ('infoArray' in $$props) $$invalidate(0, infoArray = $$props.infoArray);
    		if ('heading' in $$props) $$invalidate(1, heading = $$props.heading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [infoArray, heading];
    }

    class Left_Right_Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { infoArray: 0, heading: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Left_Right_Section",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get infoArray() {
    		throw new Error("<Left_Right_Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set infoArray(value) {
    		throw new Error("<Left_Right_Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<Left_Right_Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Left_Right_Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Heroes/Hero-Two-Columns.svelte generated by Svelte v3.46.4 */

    const file$5 = "src/Components/Heroes/Hero-Two-Columns.svelte";

    // (17:13) {#if isH1}
    function create_if_block_1(ctx) {
    	let h1_1;

    	const block = {
    		c: function create() {
    			h1_1 = element("h1");
    			h1_1.textContent = `${/*h1*/ ctx[3]}`;
    			attr_dev(h1_1, "class", "hero-heading svelte-zqek0v");
    			add_location(h1_1, file$5, 17, 16, 588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1_1, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(17:13) {#if isH1}",
    		ctx
    	});

    	return block;
    }

    // (20:13) {#if !isH1}
    function create_if_block(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = `${/*h1*/ ctx[3]}`;
    			attr_dev(h2, "class", "hero-heading svelte-zqek0v");
    			add_location(h2, file$5, 20, 16, 683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(20:13) {#if !isH1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let p_1;
    	let t3;
    	let a;
    	let t4;
    	let div1_class_value;
    	let t5;
    	let div2;
    	let div2_class_value;
    	let if_block0 = /*isH1*/ ctx[0] && create_if_block_1(ctx);
    	let if_block1 = !/*isH1*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space$1();
    			if (if_block1) if_block1.c();
    			t1 = space$1();
    			p_1 = element("p");
    			p_1.textContent = `${p}`;
    			t3 = space$1();
    			a = element("a");
    			t4 = text(ctaText);
    			t5 = space$1();
    			div2 = element("div");
    			attr_dev(p_1, "class", "hero-para svelte-zqek0v");
    			add_location(p_1, file$5, 23, 12, 762);
    			attr_dev(a, "href", ctaUrl);
    			attr_dev(a, "class", "hero-cta svelte-zqek0v");
    			add_location(a, file$5, 24, 12, 803);
    			attr_dev(div0, "class", "text-container svelte-zqek0v");
    			add_location(div0, file$5, 15, 9, 519);

    			attr_dev(div1, "class", div1_class_value = "column-1 " + (/*isImageFirst*/ ctx[1]
    			? 'text-order-second'
    			: 'text-order-first') + " svelte-zqek0v");

    			add_location(div1, file$5, 14, 0, 429);

    			attr_dev(div2, "class", div2_class_value = "column-2 " + (/*isImageFirst*/ ctx[1]
    			? 'image-order-first'
    			: 'image-order-second') + " svelte-zqek0v");

    			add_location(div2, file$5, 27, 4, 886);
    			attr_dev(div3, "class", "hero-1-container svelte-zqek0v");
    			set_style(div3, "margin-bottom", /*marginBottom*/ ctx[2] + "px");
    			add_location(div3, file$5, 13, 0, 358);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, p_1);
    			append_dev(div0, t3);
    			append_dev(div0, a);
    			append_dev(a, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isH1*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*isH1*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*isImageFirst*/ 2 && div1_class_value !== (div1_class_value = "column-1 " + (/*isImageFirst*/ ctx[1]
    			? 'text-order-second'
    			: 'text-order-first') + " svelte-zqek0v")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*isImageFirst*/ 2 && div2_class_value !== (div2_class_value = "column-2 " + (/*isImageFirst*/ ctx[1]
    			? 'image-order-first'
    			: 'image-order-second') + " svelte-zqek0v")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*marginBottom*/ 4) {
    				set_style(div3, "margin-bottom", /*marginBottom*/ ctx[2] + "px");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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

    const p = "Tasty, simple, and halal Pakistani and Indian Cuisine at the most popular restaurants for the cuisine in the Bay Area.";
    const ctaText = "Order Now";
    const ctaUrl = "#";

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero_Two_Columns', slots, []);
    	const h1 = "Simply \n" + "Delicious Food";
    	let { isH1 = true } = $$props;
    	let { isImageFirst = false } = $$props;
    	let { marginBottom = "0" } = $$props;
    	let { isPrimary = true } = $$props;
    	const writable_props = ['isH1', 'isImageFirst', 'marginBottom', 'isPrimary'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero_Two_Columns> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isH1' in $$props) $$invalidate(0, isH1 = $$props.isH1);
    		if ('isImageFirst' in $$props) $$invalidate(1, isImageFirst = $$props.isImageFirst);
    		if ('marginBottom' in $$props) $$invalidate(2, marginBottom = $$props.marginBottom);
    		if ('isPrimary' in $$props) $$invalidate(4, isPrimary = $$props.isPrimary);
    	};

    	$$self.$capture_state = () => ({
    		h1,
    		p,
    		ctaText,
    		ctaUrl,
    		isH1,
    		isImageFirst,
    		marginBottom,
    		isPrimary
    	});

    	$$self.$inject_state = $$props => {
    		if ('isH1' in $$props) $$invalidate(0, isH1 = $$props.isH1);
    		if ('isImageFirst' in $$props) $$invalidate(1, isImageFirst = $$props.isImageFirst);
    		if ('marginBottom' in $$props) $$invalidate(2, marginBottom = $$props.marginBottom);
    		if ('isPrimary' in $$props) $$invalidate(4, isPrimary = $$props.isPrimary);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isH1, isImageFirst, marginBottom, h1, isPrimary];
    }

    class Hero_Two_Columns extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			isH1: 0,
    			isImageFirst: 1,
    			marginBottom: 2,
    			isPrimary: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero_Two_Columns",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get isH1() {
    		throw new Error("<Hero_Two_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isH1(value) {
    		throw new Error("<Hero_Two_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isImageFirst() {
    		throw new Error("<Hero_Two_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isImageFirst(value) {
    		throw new Error("<Hero_Two_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginBottom() {
    		throw new Error("<Hero_Two_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginBottom(value) {
    		throw new Error("<Hero_Two_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPrimary() {
    		throw new Error("<Hero_Two_Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPrimary(value) {
    		throw new Error("<Hero_Two_Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Tabs-Spaced-Border/Tab-Border.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/Components/Tabs-Spaced-Border/Tab-Border.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:4) {#each componentArray as item}
    function create_each_block$1(ctx) {
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
    			t1 = space$1();
    			attr_dev(div, "class", "svelte-1ja2o2y");
    			add_location(div, file$4, 14, 8, 350);
    			attr_dev(li, "class", "svelte-1ja2o2y");
    			toggle_class(li, "active", /*item*/ ctx[4].label === /*activeItem*/ ctx[1]);
    			add_location(li, file$4, 13, 4, 243);
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
    				toggle_class(li, "active", /*item*/ ctx[4].label === /*activeItem*/ ctx[1]);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(13:4) {#each componentArray as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let ul;
    	let each_value = /*componentArray*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1ja2o2y");
    			add_location(ul, file$4, 11, 0, 199);
    			attr_dev(div, "class", "tabs svelte-1ja2o2y");
    			add_location(div, file$4, 10, 0, 180);
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
    			if (dirty & /*componentArray, activeItem, dispatch*/ 7) {
    				each_value = /*componentArray*/ ctx[0];
    				validate_each_argument(each_value);
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
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('Tab_Border', slots, []);
    	const dispatch = createEventDispatcher();
    	let { componentArray } = $$props;
    	let { activeItem } = $$props;
    	const writable_props = ['componentArray', 'activeItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab_Border> was created with unknown prop '${key}'`);
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

    class Tab_Border extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { componentArray: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab_Border",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*componentArray*/ ctx[0] === undefined && !('componentArray' in props)) {
    			console.warn("<Tab_Border> was created without expected prop 'componentArray'");
    		}

    		if (/*activeItem*/ ctx[1] === undefined && !('activeItem' in props)) {
    			console.warn("<Tab_Border> was created without expected prop 'activeItem'");
    		}
    	}

    	get componentArray() {
    		throw new Error("<Tab_Border>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set componentArray(value) {
    		throw new Error("<Tab_Border>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItem() {
    		throw new Error("<Tab_Border>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItem(value) {
    		throw new Error("<Tab_Border>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* node_modules/svelte-feather-icons/src/icons/ChevronLeftIcon.svelte generated by Svelte v3.46.4 */

    const file$3 = "node_modules/svelte-feather-icons/src/icons/ChevronLeftIcon.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let polyline;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			attr_dev(polyline, "points", "15 18 9 12 15 6");
    			add_location(polyline, file$3, 14, 249, 569);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", /*strokeFill*/ ctx[2]);
    			attr_dev(svg, "stroke-width", /*strokeWidth*/ ctx[1]);
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-chevron-left " + /*customClass*/ ctx[3]);
    			add_location(svg, file$3, 14, 0, 320);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, polyline);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*strokeFill*/ 4) {
    				attr_dev(svg, "stroke", /*strokeFill*/ ctx[2]);
    			}

    			if (dirty & /*strokeWidth*/ 2) {
    				attr_dev(svg, "stroke-width", /*strokeWidth*/ ctx[1]);
    			}

    			if (dirty & /*customClass*/ 8 && svg_class_value !== (svg_class_value = "feather feather-chevron-left " + /*customClass*/ ctx[3])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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
    	validate_slots('ChevronLeftIcon', slots, []);
    	let { size = "100%" } = $$props;
    	let { strokeWidth = 2 } = $$props;
    	let { strokeFill = "white" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === 'x'
    		? size.slice(0, size.length - 1) + 'em'
    		: parseInt(size) + 'px';
    	}

    	const writable_props = ['size', 'strokeWidth', 'strokeFill', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChevronLeftIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('strokeWidth' in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    		if ('strokeFill' in $$props) $$invalidate(2, strokeFill = $$props.strokeFill);
    		if ('class' in $$props) $$invalidate(3, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		strokeWidth,
    		strokeFill,
    		customClass
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('strokeWidth' in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    		if ('strokeFill' in $$props) $$invalidate(2, strokeFill = $$props.strokeFill);
    		if ('customClass' in $$props) $$invalidate(3, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, strokeWidth, strokeFill, customClass];
    }

    class ChevronLeftIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			size: 0,
    			strokeWidth: 1,
    			strokeFill: 2,
    			class: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronLeftIcon",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeFill() {
    		throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeFill(value) {
    		throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/ChevronRightIcon.svelte generated by Svelte v3.46.4 */

    const file$2 = "node_modules/svelte-feather-icons/src/icons/ChevronRightIcon.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let polyline;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			attr_dev(polyline, "points", "9 18 15 12 9 6");
    			add_location(polyline, file$2, 15, 250, 571);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", /*strokeFill*/ ctx[2]);
    			attr_dev(svg, "stroke-width", /*strokeWidth*/ ctx[1]);
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-chevron-right " + /*customClass*/ ctx[3]);
    			add_location(svg, file$2, 15, 0, 321);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, polyline);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*strokeFill*/ 4) {
    				attr_dev(svg, "stroke", /*strokeFill*/ ctx[2]);
    			}

    			if (dirty & /*strokeWidth*/ 2) {
    				attr_dev(svg, "stroke-width", /*strokeWidth*/ ctx[1]);
    			}

    			if (dirty & /*customClass*/ 8 && svg_class_value !== (svg_class_value = "feather feather-chevron-right " + /*customClass*/ ctx[3])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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
    	validate_slots('ChevronRightIcon', slots, []);
    	let { size = "100%" } = $$props;
    	let { strokeWidth = 2 } = $$props;
    	let { strokeFill = "white" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === 'x'
    		? size.slice(0, size.length - 1) + 'em'
    		: parseInt(size) + 'px';
    	}

    	const writable_props = ['size', 'strokeWidth', 'strokeFill', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChevronRightIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('strokeWidth' in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    		if ('strokeFill' in $$props) $$invalidate(2, strokeFill = $$props.strokeFill);
    		if ('class' in $$props) $$invalidate(3, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		strokeWidth,
    		strokeFill,
    		customClass
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('strokeWidth' in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    		if ('strokeFill' in $$props) $$invalidate(2, strokeFill = $$props.strokeFill);
    		if ('customClass' in $$props) $$invalidate(3, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, strokeWidth, strokeFill, customClass];
    }

    class ChevronRightIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			size: 0,
    			strokeWidth: 1,
    			strokeFill: 2,
    			class: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronRightIcon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeFill() {
    		throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeFill(value) {
    		throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Galleries/Slider.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$1 = "src/Components/Galleries/Slider.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (75:4) {#each images as image (image.id)}
    function create_each_block(key_1, ctx) {
    	let img;
    	let img_id_value;
    	let img_class_value;
    	let img_src_value;
    	let img_alt_value;
    	let rect;
    	let stop_animation = noop$1;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "id", img_id_value = "image" + /*image*/ ctx[13].id);

    			attr_dev(img, "class", img_class_value = "image " + (/*image*/ ctx[13].alt === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-xk0kxi");

    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[13].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*image*/ ctx[13].alt);
    			set_style(img, "height", /*gridWidth*/ ctx[1]);
    			add_location(img, file$1, 75, 0, 1935);
    			this.first = img;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "mouseover", /*stopAutoplay*/ ctx[3], false, false, false),
    					listen_dev(img, "mouseout", /*startAutoplay*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*images*/ 1 && img_id_value !== (img_id_value = "image" + /*image*/ ctx[13].id)) {
    				attr_dev(img, "id", img_id_value);
    			}

    			if (dirty & /*images*/ 1 && img_class_value !== (img_class_value = "image " + (/*image*/ ctx[13].alt === 'ThisIsInvisible123'
    			? 'invisible-obj'
    			: '') + " svelte-xk0kxi")) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*images*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[13].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*images*/ 1 && img_alt_value !== (img_alt_value = /*image*/ ctx[13].alt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*gridWidth*/ 2) {
    				set_style(img, "height", /*gridWidth*/ ctx[1]);
    			}
    		},
    		r: function measure() {
    			rect = img.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(img);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(img, rect, flip, {});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(75:4) {#each images as image (image.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*image*/ ctx[13].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "image image-container svelte-xk0kxi");
    			add_location(div0, file$1, 72, 4, 1855);
    			attr_dev(div1, "class", "gallery-container svelte-xk0kxi");
    			set_style(div1, "width", /*gridWidth*/ ctx[1]);
    			add_location(div1, file$1, 69, 0, 1787);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*images, gridWidth, stopAutoplay, startAutoplay*/ 15) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, fix_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    			}

    			if (dirty & /*gridWidth*/ 2) {
    				set_style(div1, "width", /*gridWidth*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
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
    	validate_slots('Slider', slots, []);
    	let { images } = $$props;
    	let { gridWidth } = $$props;
    	let { numberOfColumns } = $$props;
    	let { shouldAutoplay = false } = $$props;
    	let { autoplaySpeed = 3000 } = $$props;
    	let interval;

    	// numberOfColumns += 1;
    	let flexWidth = 100 / numberOfColumns + "%";

    	let dividor = Math.min(images.length, 4);
    	console.log(dividor);
    	let widthOfImage = 100 / numberOfColumns + "%";

    	beforeUpdate(() => {
    		images.length % numberOfColumns;
    	}); // for(let i = 0; i < (numberOfColumns - remainder); i++) {
    	//     console.log("Here " + i);
    	//     images.push({
    	//     invisible: true,

    	//     src: "",
    	//     alt: "ThisIsInvisible123",
    	//     id: images.length + i + 1
    	// })
    	// }
    	function rotateLeft() {
    		// const transitioningImage = images[images.length - 1];
    		console.log(images);

    		const transitioningImage = images[0];
    		console.log("transitioning image: " + transitioningImage.id);
    		document.getElementById("image" + transitioningImage.id).style.opacity = 0;

    		// images = [images[images.length - 1],...images.slice(0, images.length - 1)]
    		$$invalidate(0, images = [...images.slice(1, images.length), images[0]]);

    		setTimeout(
    			() => {
    				document.getElementById("image" + transitioningImage.id).style.opacity = 1;
    				console.log("Happening");
    			},
    			5000
    		);
    	}

    	function rotateRight() {
    		$$invalidate(0, images = [...images.slice(1, images.length), images[0]]);
    	}

    	function startAutoplay() {
    		if (shouldAutoplay) {
    			interval = setInterval(rotateLeft, autoplaySpeed);
    		}
    	}

    	function stopAutoplay() {
    		clearInterval(interval);
    	}

    	if (shouldAutoplay) {
    		startAutoplay();
    	}

    	const writable_props = ['images', 'gridWidth', 'numberOfColumns', 'shouldAutoplay', 'autoplaySpeed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('numberOfColumns' in $$props) $$invalidate(4, numberOfColumns = $$props.numberOfColumns);
    		if ('shouldAutoplay' in $$props) $$invalidate(5, shouldAutoplay = $$props.shouldAutoplay);
    		if ('autoplaySpeed' in $$props) $$invalidate(6, autoplaySpeed = $$props.autoplaySpeed);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		flip,
    		ChevronLeftIcon,
    		ChevronRightIcon,
    		images,
    		gridWidth,
    		numberOfColumns,
    		shouldAutoplay,
    		autoplaySpeed,
    		interval,
    		flexWidth,
    		dividor,
    		widthOfImage,
    		rotateLeft,
    		rotateRight,
    		startAutoplay,
    		stopAutoplay
    	});

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gridWidth' in $$props) $$invalidate(1, gridWidth = $$props.gridWidth);
    		if ('numberOfColumns' in $$props) $$invalidate(4, numberOfColumns = $$props.numberOfColumns);
    		if ('shouldAutoplay' in $$props) $$invalidate(5, shouldAutoplay = $$props.shouldAutoplay);
    		if ('autoplaySpeed' in $$props) $$invalidate(6, autoplaySpeed = $$props.autoplaySpeed);
    		if ('interval' in $$props) interval = $$props.interval;
    		if ('flexWidth' in $$props) flexWidth = $$props.flexWidth;
    		if ('dividor' in $$props) dividor = $$props.dividor;
    		if ('widthOfImage' in $$props) widthOfImage = $$props.widthOfImage;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		images,
    		gridWidth,
    		startAutoplay,
    		stopAutoplay,
    		numberOfColumns,
    		shouldAutoplay,
    		autoplaySpeed
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			images: 0,
    			gridWidth: 1,
    			numberOfColumns: 4,
    			shouldAutoplay: 5,
    			autoplaySpeed: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*images*/ ctx[0] === undefined && !('images' in props)) {
    			console_1.warn("<Slider> was created without expected prop 'images'");
    		}

    		if (/*gridWidth*/ ctx[1] === undefined && !('gridWidth' in props)) {
    			console_1.warn("<Slider> was created without expected prop 'gridWidth'");
    		}

    		if (/*numberOfColumns*/ ctx[4] === undefined && !('numberOfColumns' in props)) {
    			console_1.warn("<Slider> was created without expected prop 'numberOfColumns'");
    		}
    	}

    	get images() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridWidth() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridWidth(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfColumns() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfColumns(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldAutoplay() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldAutoplay(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplaySpeed() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplaySpeed(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    // (81:4) <Route path="/Heroes/Fullscreen">
    function create_default_slot_23(ctx) {
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
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(81:4) <Route path=\\\"/Heroes/Fullscreen\\\">",
    		ctx
    	});

    	return block;
    }

    // (85:1) <Route path="/Heroes/Halfscreen">
    function create_default_slot_22(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(85:1) <Route path=\\\"/Heroes/Halfscreen\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:1) <Route path="/Info/1">
    function create_default_slot_21(ctx) {
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
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(94:1) <Route path=\\\"/Info/1\\\">",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Route path="/Info/1-Alt">
    function create_default_slot_20(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(98:1) <Route path=\\\"/Info/1-Alt\\\">",
    		ctx
    	});

    	return block;
    }

    // (111:1) <Route path="/Info/1-Alt">
    function create_default_slot_19(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(111:1) <Route path=\\\"/Info/1-Alt\\\">",
    		ctx
    	});

    	return block;
    }

    // (123:1) <Route path="/Info/1-Reversed">
    function create_default_slot_18(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(123:1) <Route path=\\\"/Info/1-Reversed\\\">",
    		ctx
    	});

    	return block;
    }

    // (135:1) <Route path="/Info/Grids">
    function create_default_slot_17(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(135:1) <Route path=\\\"/Info/Grids\\\">",
    		ctx
    	});

    	return block;
    }

    // (147:1) <Route path="/Grids/Responsive">
    function create_default_slot_16(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(147:1) <Route path=\\\"/Grids/Responsive\\\">",
    		ctx
    	});

    	return block;
    }

    // (156:1) <Route path="/Tabs/Centered">
    function create_default_slot_15(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				componentArray: masterComponentArray,
    				activeItem: masterComponentArray.at(0).label
    			},
    			$$inline: true
    		});

    	tab.$on("tabChange", /*tabChange*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: noop$1,
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
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(156:1) <Route path=\\\"/Tabs/Centered\\\">",
    		ctx
    	});

    	return block;
    }

    // (164:1) <Route path="/Navbar/Traditional">
    function create_default_slot_14(ctx) {
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
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(164:1) <Route path=\\\"/Navbar/Traditional\\\">",
    		ctx
    	});

    	return block;
    }

    // (168:1) <Route path="/Footers/Column-4">
    function create_default_slot_13(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(168:1) <Route path=\\\"/Footers/Column-4\\\">",
    		ctx
    	});

    	return block;
    }

    // (180:1) <Route path="/Grids/Responsive-Info">
    function create_default_slot_12(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(180:1) <Route path=\\\"/Grids/Responsive-Info\\\">",
    		ctx
    	});

    	return block;
    }

    // (189:1) <Route path="/Grids/Responsive-Info-Icons">
    function create_default_slot_11(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(189:1) <Route path=\\\"/Grids/Responsive-Info-Icons\\\">",
    		ctx
    	});

    	return block;
    }

    // (198:1) <Route path="/Banners/OnlyButton">
    function create_default_slot_10(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(198:1) <Route path=\\\"/Banners/OnlyButton\\\">",
    		ctx
    	});

    	return block;
    }

    // (205:1) <Route path="/Banners/Paragraph-Button">
    function create_default_slot_9(ctx) {
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
    		p: noop$1,
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
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(205:1) <Route path=\\\"/Banners/Paragraph-Button\\\">",
    		ctx
    	});

    	return block;
    }

    // (213:1) <Route path="/Forms/Form-1">
    function create_default_slot_8(ctx) {
    	let form_1;
    	let current;
    	form_1 = new Form_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(form_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(213:1) <Route path=\\\"/Forms/Form-1\\\">",
    		ctx
    	});

    	return block;
    }

    // (217:1) <Route path="/Galleries/Basic">
    function create_default_slot_7(ctx) {
    	let fulllengthgallery;
    	let current;

    	fulllengthgallery = new Full_Length_Gallery({
    			props: {
    				images,
    				numberOfColumns: 4,
    				objWidth: "200px",
    				gridWidth: "90%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fulllengthgallery.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fulllengthgallery, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fulllengthgallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fulllengthgallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fulllengthgallery, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(217:1) <Route path=\\\"/Galleries/Basic\\\">",
    		ctx
    	});

    	return block;
    }

    // (226:1) <Route path="/Galleries/KNC">
    function create_default_slot_6(ctx) {
    	let kncstylegallery;
    	let current;

    	kncstylegallery = new KnC_Style_Gallery({
    			props: {
    				images: kncImages,
    				numberOfColumns: 5,
    				objWidth: "200px",
    				gridWidth: "90%",
    				imageWidth: "300px"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(kncstylegallery.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(kncstylegallery, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(kncstylegallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(kncstylegallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(kncstylegallery, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(226:1) <Route path=\\\"/Galleries/KNC\\\">",
    		ctx
    	});

    	return block;
    }

    // (236:1) <Route path="/Info/Form">
    function create_default_slot_5(ctx) {
    	let infowithform;
    	let current;

    	infowithform = new Info_With_Form({
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
    			create_component(infowithform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(infowithform, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infowithform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infowithform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(infowithform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(236:1) <Route path=\\\"/Info/Form\\\">",
    		ctx
    	});

    	return block;
    }

    // (248:1) <Route path="/Info/Left-Right">
    function create_default_slot_4(ctx) {
    	let leftrightsection;
    	let current;
    	leftrightsection = new Left_Right_Section({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(leftrightsection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(leftrightsection, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leftrightsection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leftrightsection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(leftrightsection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(248:1) <Route path=\\\"/Info/Left-Right\\\">",
    		ctx
    	});

    	return block;
    }

    // (256:1) <Route path="/contentful/events">
    function create_default_slot_3(ctx) {
    	let contentfulevents;
    	let current;

    	contentfulevents = new Contentful_Events({
    			props: {
    				numberOfColumns: 4,
    				objWidth: "200px",
    				gridWidth: "100%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentfulevents.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentfulevents, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentfulevents.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentfulevents.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentfulevents, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(256:1) <Route path=\\\"/contentful/events\\\">",
    		ctx
    	});

    	return block;
    }

    // (265:1) <Route path="/Tabs/Bordered">
    function create_default_slot_2(ctx) {
    	let tabborder;
    	let current;

    	tabborder = new Tab_Border({
    			props: {
    				componentArray: /*componentArray*/ ctx[1],
    				activeItem: /*activeItem*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tabborder.$on("tabChange", /*tabChange*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(tabborder.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabborder, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabborder_changes = {};
    			if (dirty & /*activeItem*/ 1) tabborder_changes.activeItem = /*activeItem*/ ctx[0];
    			tabborder.$set(tabborder_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabborder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabborder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabborder, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(265:1) <Route path=\\\"/Tabs/Bordered\\\">",
    		ctx
    	});

    	return block;
    }

    // (272:1) <Route path="Heroes/TwoColumns">
    function create_default_slot_1(ctx) {
    	let herotwocolumns;
    	let current;
    	herotwocolumns = new Hero_Two_Columns({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(herotwocolumns.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(herotwocolumns, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(herotwocolumns.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(herotwocolumns.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(herotwocolumns, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(272:1) <Route path=\\\"Heroes/TwoColumns\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:0) <Router>
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
    	let t14;
    	let route15;
    	let t15;
    	let route16;
    	let t16;
    	let route17;
    	let t17;
    	let route18;
    	let t18;
    	let route19;
    	let t19;
    	let route20;
    	let t20;
    	let route21;
    	let t21;
    	let route22;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "/Heroes/Fullscreen",
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/Heroes/Halfscreen",
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "/Info/1",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "/Info/1-Alt",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: "/Info/1-Alt",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: {
    				path: "/Info/1-Reversed",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route$1({
    			props: {
    				path: "/Info/Grids",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route$1({
    			props: {
    				path: "/Grids/Responsive",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route8 = new Route$1({
    			props: {
    				path: "/Tabs/Centered",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route9 = new Route$1({
    			props: {
    				path: "/Navbar/Traditional",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route10 = new Route$1({
    			props: {
    				path: "/Footers/Column-4",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route11 = new Route$1({
    			props: {
    				path: "/Grids/Responsive-Info",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route12 = new Route$1({
    			props: {
    				path: "/Grids/Responsive-Info-Icons",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route13 = new Route$1({
    			props: {
    				path: "/Banners/OnlyButton",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route14 = new Route$1({
    			props: {
    				path: "/Banners/Paragraph-Button",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route15 = new Route$1({
    			props: {
    				path: "/Forms/Form-1",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route16 = new Route$1({
    			props: {
    				path: "/Galleries/Basic",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route17 = new Route$1({
    			props: {
    				path: "/Galleries/KNC",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route18 = new Route$1({
    			props: {
    				path: "/Info/Form",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route19 = new Route$1({
    			props: {
    				path: "/Info/Left-Right",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route20 = new Route$1({
    			props: {
    				path: "/contentful/events",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route21 = new Route$1({
    			props: {
    				path: "/Tabs/Bordered",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route22 = new Route$1({
    			props: {
    				path: "Heroes/TwoColumns",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t0 = space$1();
    			create_component(route1.$$.fragment);
    			t1 = space$1();
    			create_component(route2.$$.fragment);
    			t2 = space$1();
    			create_component(route3.$$.fragment);
    			t3 = space$1();
    			create_component(route4.$$.fragment);
    			t4 = space$1();
    			create_component(route5.$$.fragment);
    			t5 = space$1();
    			create_component(route6.$$.fragment);
    			t6 = space$1();
    			create_component(route7.$$.fragment);
    			t7 = space$1();
    			create_component(route8.$$.fragment);
    			t8 = space$1();
    			create_component(route9.$$.fragment);
    			t9 = space$1();
    			create_component(route10.$$.fragment);
    			t10 = space$1();
    			create_component(route11.$$.fragment);
    			t11 = space$1();
    			create_component(route12.$$.fragment);
    			t12 = space$1();
    			create_component(route13.$$.fragment);
    			t13 = space$1();
    			create_component(route14.$$.fragment);
    			t14 = space$1();
    			create_component(route15.$$.fragment);
    			t15 = space$1();
    			create_component(route16.$$.fragment);
    			t16 = space$1();
    			create_component(route17.$$.fragment);
    			t17 = space$1();
    			create_component(route18.$$.fragment);
    			t18 = space$1();
    			create_component(route19.$$.fragment);
    			t19 = space$1();
    			create_component(route20.$$.fragment);
    			t20 = space$1();
    			create_component(route21.$$.fragment);
    			t21 = space$1();
    			create_component(route22.$$.fragment);
    			add_location(main, file, 69, 1, 2771);
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
    			append_dev(main, t14);
    			mount_component(route15, main, null);
    			append_dev(main, t15);
    			mount_component(route16, main, null);
    			append_dev(main, t16);
    			mount_component(route17, main, null);
    			append_dev(main, t17);
    			mount_component(route18, main, null);
    			append_dev(main, t18);
    			mount_component(route19, main, null);
    			append_dev(main, t19);
    			mount_component(route20, main, null);
    			append_dev(main, t20);
    			mount_component(route21, main, null);
    			append_dev(main, t21);
    			mount_component(route22, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    			const route9_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route9_changes.$$scope = { dirty, ctx };
    			}

    			route9.$set(route9_changes);
    			const route10_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route10_changes.$$scope = { dirty, ctx };
    			}

    			route10.$set(route10_changes);
    			const route11_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route11_changes.$$scope = { dirty, ctx };
    			}

    			route11.$set(route11_changes);
    			const route12_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route12_changes.$$scope = { dirty, ctx };
    			}

    			route12.$set(route12_changes);
    			const route13_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route13_changes.$$scope = { dirty, ctx };
    			}

    			route13.$set(route13_changes);
    			const route14_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route14_changes.$$scope = { dirty, ctx };
    			}

    			route14.$set(route14_changes);
    			const route15_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route15_changes.$$scope = { dirty, ctx };
    			}

    			route15.$set(route15_changes);
    			const route16_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route16_changes.$$scope = { dirty, ctx };
    			}

    			route16.$set(route16_changes);
    			const route17_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route17_changes.$$scope = { dirty, ctx };
    			}

    			route17.$set(route17_changes);
    			const route18_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route18_changes.$$scope = { dirty, ctx };
    			}

    			route18.$set(route18_changes);
    			const route19_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route19_changes.$$scope = { dirty, ctx };
    			}

    			route19.$set(route19_changes);
    			const route20_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route20_changes.$$scope = { dirty, ctx };
    			}

    			route20.$set(route20_changes);
    			const route21_changes = {};

    			if (dirty & /*$$scope, activeItem*/ 65) {
    				route21_changes.$$scope = { dirty, ctx };
    			}

    			route21.$set(route21_changes);
    			const route22_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route22_changes.$$scope = { dirty, ctx };
    			}

    			route22.$set(route22_changes);
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
    			transition_in(route15.$$.fragment, local);
    			transition_in(route16.$$.fragment, local);
    			transition_in(route17.$$.fragment, local);
    			transition_in(route18.$$.fragment, local);
    			transition_in(route19.$$.fragment, local);
    			transition_in(route20.$$.fragment, local);
    			transition_in(route21.$$.fragment, local);
    			transition_in(route22.$$.fragment, local);
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
    			transition_out(route15.$$.fragment, local);
    			transition_out(route16.$$.fragment, local);
    			transition_out(route17.$$.fragment, local);
    			transition_out(route18.$$.fragment, local);
    			transition_out(route19.$$.fragment, local);
    			transition_out(route20.$$.fragment, local);
    			transition_out(route21.$$.fragment, local);
    			transition_out(route22.$$.fragment, local);
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
    			destroy_component(route15);
    			destroy_component(route16);
    			destroy_component(route17);
    			destroy_component(route18);
    			destroy_component(route19);
    			destroy_component(route20);
    			destroy_component(route21);
    			destroy_component(route22);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(69:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let library;
    	let t0;
    	let router;
    	let t1;
    	let slider;
    	let current;
    	library = new Library({ $$inline: true });

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	slider = new Slider({
    			props: {
    				images,
    				numberOfColumns: 4,
    				objWidth: "200px",
    				gridWidth: "90%",
    				shouldAutoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(library.$$.fragment);
    			t0 = space$1();
    			create_component(router.$$.fragment);
    			t1 = space$1();
    			create_component(slider.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(library, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(router, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(slider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, activeItem*/ 65) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(library.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(library.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(library, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(slider, detaching);
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
    	let componentArray = masterComponentArray;
    	let events = [];
    	let activeItem = "Heroes";

    	const tabChange = e => {
    		$$invalidate(0, activeItem = e.detail);
    	};

    	var client = createClient_1({
    		space: 'voutmqui4m2l',
    		accessToken: 'Pch2QB-Irp5JmCIl0DTH_7wCMNWZtNQe5oFsM7CYRo8'
    	});

    	const res = client.getEntries({ content_type: 'events' }).then(function (event) {
    		// logs the entry metadata
    		//   console.log(event.items);
    		events = event.items;
    	}); // logs the field with ID title

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
    		images,
    		kncImages,
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
    		FullLengthGallery: Full_Length_Gallery,
    		KnCStyleGallery: KnC_Style_Gallery,
    		InfoWithForm: Info_With_Form,
    		createClient: createClient_1,
    		createContentfulAPI: resolveResponse,
    		ContentfulEvents: Contentful_Events,
    		LeftRightSection: Left_Right_Section,
    		HeroTwoColumns: Hero_Two_Columns,
    		TabBorder: Tab_Border,
    		Slider,
    		componentArray,
    		events,
    		activeItem,
    		tabChange,
    		client,
    		res
    	});

    	$$self.$inject_state = $$props => {
    		if ('componentArray' in $$props) $$invalidate(1, componentArray = $$props.componentArray);
    		if ('events' in $$props) events = $$props.events;
    		if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
    		if ('client' in $$props) client = $$props.client;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeItem, componentArray, tabChange];
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

    // Google maps API key AIzaSyDc-02soqBTsP9KntJ9I5xEdpdMNXeHuFg;

    return app;

})();
//# sourceMappingURL=bundle.js.map
