var createCalendar = (function () {
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /**
     * color-calendar
     * v1.0.7
     * by Pawan Kolhe <contact@pawankolhe.com> (https://pawankolhe.com/)
     */

    var bundle = createCommonjsModule(function (module, exports) {
    !function(e,t){module.exports=t();}(commonjsGlobal,(function(){function e(e){let t=!1;return this.start&&this.currentDate&&this.start.getFullYear()==this.currentDate.getFullYear()&&e<this.start.getMonth()&&(t=!0),this.end&&this.currentDate&&this.end.getFullYear()==this.currentDate.getFullYear()&&e>this.end.getMonth()&&(t=!0),t}class t{constructor(e={}){var t,a,i,r,n,s,o,l,h,d,c,y,u,p;if(this.CAL_NAME="color-calendar",this.DAYS_TO_DISPLAY=42,this.weekdayDisplayTypeOptions={short:["S","M","T","W","T","F","S"],"long-lower":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"long-upper":["SUN","MON","TUE","WED","THU","FRI","SAT"]},this.stepInfo={next:{year:!0,month:!0},previous:{year:!0,month:!0}},this.id=null!==(t=e.id)&&void 0!==t?t:"#color-calendar",this.selectInitialDate=null===(a=e.selectInitialDate)||void 0===a||a,this.calendarSize=null!==(i=e.calendarSize)&&void 0!==i?i:"large",this.layoutModifiers=null!==(r=e.layoutModifiers)&&void 0!==r?r:[],this.eventsData=null!==(n=e.eventsData)&&void 0!==n?n:[],this.theme=null!==(s=e.theme)&&void 0!==s?s:"basic",this.primaryColor=e.primaryColor,this.headerColor=e.headerColor,this.headerBackgroundColor=e.headerBackgroundColor,this.weekdaysColor=e.weekdaysColor,this.weekdayDisplayType=null!==(o=e.weekdayDisplayType)&&void 0!==o?o:"long-lower",this.monthDisplayType=null!==(l=e.monthDisplayType)&&void 0!==l?l:"long",this.startWeekday=null!==(h=e.startWeekday)&&void 0!==h?h:0,this.fontFamilyHeader=e.fontFamilyHeader,this.fontFamilyWeekdays=e.fontFamilyWeekdays,this.fontFamilyBody=e.fontFamilyBody,this.dropShadow=e.dropShadow,this.border=e.border,this.borderRadius=e.borderRadius,this.disableMonthYearPickers=null!==(d=e.disableMonthYearPickers)&&void 0!==d&&d,this.disableDayClick=null!==(c=e.disableDayClick)&&void 0!==c&&c,this.disableMonthArrowClick=null!==(y=e.disableMonthArrowClick)&&void 0!==y&&y,this.customMonthValues=e.customMonthValues,this.customWeekdayValues=e.customWeekdayValues,this.monthChanged=e.monthChanged,this.dateChanged=e.dateChanged,this.selectedDateClicked=e.selectedDateClicked,this.customWeekdayValues&&7===this.customWeekdayValues.length?this.weekdays=this.customWeekdayValues:this.weekdays=null!==(u=this.weekdayDisplayTypeOptions[this.weekdayDisplayType])&&void 0!==u?u:this.weekdayDisplayTypeOptions.short,this.today=new Date,this.currentDate=e.currentDate||new Date,this.start=e.startMonth?new Date(e.startMonth.getFullYear(),e.startMonth.getMonth()-1,1):void 0,this.end=e.endMonth?new Date(e.endMonth.getFullYear(),e.endMonth.getMonth(),0):void 0,this.start&&this.start>this.currentDate)throw new Error("The current date cannot be less than the starting point");if(this.end&&this.end<this.currentDate)throw new Error("The current date cannot be greater than the endpoint");if(["start","end"].forEach(e=>{const t=e;if(this[t]&&this.currentDate.getFullYear()==this[t].getFullYear()){const e="start"==t?"previous":"next";this.stepInfo[e].year=!1,this.currentDate.getMonth()==this[t].getMonth()&&(this.stepInfo[e].month=!1);}},this),this.pickerType="month",this.eventDayMap={},this.oldSelectedNode=null,this.filteredEventsThisMonth=[],this.daysIn_PrevMonth=[],this.daysIn_CurrentMonth=[],this.daysIn_NextMonth=[],this.firstDay_PrevMonth=0,this.firstDay_CurrentMonth=0,this.firstDay_NextMonth=0,this.numOfDays_PrevMonth=0,this.numOfDays_CurrentMonth=0,this.numOfDays_NextMonth=0,this.yearPickerOffset=0,this.yearPickerOffsetTemporary=0,this.calendar=document.querySelector(this.id),!this.calendar)throw new Error(`[COLOR-CALENDAR] Element with selector '${this.id}' not found`);this.calendar.innerHTML=`\n      <div class="${this.CAL_NAME} ${this.theme} color-calendar--${this.calendarSize}">\n        <div class="calendar__header">\n          <div class="calendar__arrow calendar__arrow-prev ${this.stepInfo.previous.month?"":"disable"}"><div class="calendar__arrow-inner"></div></div>\n          <div class="calendar__monthyear">\n            <span class="calendar__month"></span>&nbsp;\n            <span class="calendar__year"></span>\n          </div>\n          <div class="calendar__arrow calendar__arrow-next ${this.stepInfo.next.month?"":"disable"}"><div class="calendar__arrow-inner"></div></div>\n        </div>\n        <div class="calendar__body">\n          <div class="calendar__weekdays"></div>\n          <div class="calendar__days"></div>\n          <div class="calendar__picker">\n            <div class="calendar__picker-month">\n              ${(null!==(p=this.customMonthValues)&&void 0!==p?p:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]).map((e,t)=>{let a="";return this.start&&this.currentDate&&this.start.getFullYear()==this.currentDate.getFullYear()&&t<this.start.getMonth()&&(a=" disable"),this.end&&this.currentDate&&this.end.getFullYear()==this.currentDate.getFullYear()&&t>this.end.getMonth()&&(a=" disable"),`<div class="calendar__picker-month-option${a}" data-value="${t}">${e}</div>`}).join("")}\n            </div>\n            <div class="calendar__picker-year">\n              ${new Array(12).fill(0).map((e,t)=>`<div class="calendar__picker-year-option" data-value="${t}"></div>`).join("")}\n              <div class="calendar__picker-year-arrow calendar__picker-year-arrow-left">\n                <div class="chevron-thin chevron-thin-left"></div>\n              </div>\n              <div class="calendar__picker-year-arrow calendar__picker-year-arrow-right">\n                <div class="chevron-thin chevron-thin-right"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    `,this.calendarRoot=document.querySelector(`${this.id} .${this.CAL_NAME}`),this.calendarHeader=document.querySelector(this.id+" .calendar__header"),this.calendarWeekdays=document.querySelector(this.id+" .calendar__weekdays"),this.calendarDays=document.querySelector(this.id+" .calendar__days"),this.pickerContainer=document.querySelector(this.id+" .calendar__picker"),this.pickerMonthContainer=document.querySelector(this.id+" .calendar__picker-month"),this.pickerYearContainer=document.querySelector(this.id+" .calendar__picker-year"),this.yearPickerChevronLeft=document.querySelector(this.id+" .calendar__picker-year-arrow-left"),this.yearPickerChevronRight=document.querySelector(this.id+" .calendar__picker-year-arrow-right"),this.pickerMonthContainer.children[this.today.getMonth()].classList.add("calendar__picker-month-today"),this.layoutModifiers.forEach(e=>{this.calendarRoot.classList.add(e);}),this.layoutModifiers.includes("month-left-align")&&(this.calendarHeader.innerHTML=`\n        <div class="calendar__monthyear">\n          <span class="calendar__month"></span>&nbsp;\n          <span class="calendar__year"></span>\n        </div>\n        <div class="calendar__arrow calendar__arrow-prev"><div class="calendar__arrow-inner ${this.stepInfo.previous.month?"":"disable"}"></div></div>\n        <div class="calendar__arrow calendar__arrow-next"><div class="calendar__arrow-inner ${this.stepInfo.next.month?"":"disable"}"></div></div>\n      `),this.monthyearDisplay=document.querySelector(this.id+" .calendar__monthyear"),this.monthDisplay=document.querySelector(this.id+" .calendar__month"),this.yearDisplay=document.querySelector(this.id+" .calendar__year"),this.prevButton=document.querySelector(this.id+" .calendar__arrow-prev .calendar__arrow-inner"),this.nextButton=document.querySelector(this.id+" .calendar__arrow-next .calendar__arrow-inner"),this.togglePicker(!1),this.configureStylePreferences(),this.addEventListeners(),this.reset(this.currentDate);}reset(e){this.currentDate=e||new Date,this.clearCalendarDays(),this.updateMonthYear(),this.updateMonthPickerSelection(this.currentDate.getMonth()),this.generatePickerYears(),this.updateYearPickerSelection(this.currentDate.getFullYear(),4),this.updateYearPickerTodaySelection(),this.generateWeekdays(),this.generateDays(),this.selectDayInitial(!!e),this.renderDays(),this.setOldSelectedNode(),this.dateChanged&&this.dateChanged(this.currentDate,this.getDateEvents(this.currentDate)),this.monthChanged&&this.monthChanged(this.currentDate,this.getMonthEvents());}}return t.prototype.addEventListeners=function(){this.prevButton.addEventListener("click",this.handlePrevMonthButtonClick.bind(this)),this.nextButton.addEventListener("click",this.handleNextMonthButtonClick.bind(this)),this.monthyearDisplay.addEventListener("click",this.handleMonthYearDisplayClick.bind(this)),this.calendarDays.addEventListener("click",this.handleCalendarDayClick.bind(this)),this.pickerMonthContainer.addEventListener("click",this.handleMonthPickerClick.bind(this)),this.pickerYearContainer.addEventListener("click",this.handleYearPickerClick.bind(this)),this.yearPickerChevronLeft.addEventListener("click",this.handleYearChevronLeftClick.bind(this)),this.yearPickerChevronRight.addEventListener("click",this.handleYearChevronRightClick.bind(this));},t.prototype.configureStylePreferences=function(){let e=this.calendarRoot;this.primaryColor&&e.style.setProperty("--cal-color-primary",this.primaryColor),this.fontFamilyHeader&&e.style.setProperty("--cal-font-family-header",this.fontFamilyHeader),this.fontFamilyWeekdays&&e.style.setProperty("--cal-font-family-weekdays",this.fontFamilyWeekdays),this.fontFamilyBody&&e.style.setProperty("--cal-font-family-body",this.fontFamilyBody),this.dropShadow&&e.style.setProperty("--cal-drop-shadow",this.dropShadow),this.border&&e.style.setProperty("--cal-border",this.border),this.borderRadius&&e.style.setProperty("--cal-border-radius",this.borderRadius),this.headerColor&&e.style.setProperty("--cal-header-color",this.headerColor),this.headerBackgroundColor&&e.style.setProperty("--cal-header-background-color",this.headerBackgroundColor),this.weekdaysColor&&e.style.setProperty("--cal-weekdays-color",this.weekdaysColor);},t.prototype.togglePicker=function(e){!0===e?(this.pickerContainer.style.visibility="visible",this.pickerContainer.style.opacity="1","year"===this.pickerType&&this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear())):!1===e?(this.pickerContainer.style.visibility="hidden",this.pickerContainer.style.opacity="0",this.monthDisplay&&this.yearDisplay&&(this.monthDisplay.style.opacity="1",this.yearDisplay.style.opacity="1"),this.yearPickerOffsetTemporary=0):"hidden"===this.pickerContainer.style.visibility?(this.pickerContainer.style.visibility="visible",this.pickerContainer.style.opacity="1","year"===this.pickerType&&this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear())):(this.pickerContainer.style.visibility="hidden",this.pickerContainer.style.opacity="0",this.monthDisplay&&this.yearDisplay&&(this.monthDisplay.style.opacity="1",this.yearDisplay.style.opacity="1"),this.yearPickerOffsetTemporary=0);},t.prototype.handleMonthPickerClick=function(e){if(!e.target.classList.contains("calendar__picker-month-option"))return;const t=parseInt(e.target.dataset.value,10);this.updateMonthPickerSelection(t),this.updateCurrentDate(0,void 0,t),this.togglePicker(!1);},t.prototype.updateMonthPickerSelection=function(e){e<0?e=11:e%=12,this.removeMonthPickerSelection(),this.pickerMonthContainer.children[e].classList.add("calendar__picker-month-selected");},t.prototype.removeMonthPickerSelection=function(){for(let e=0;e<12;e++)this.pickerMonthContainer.children[e].classList.contains("calendar__picker-month-selected")&&this.pickerMonthContainer.children[e].classList.remove("calendar__picker-month-selected");},t.prototype.handleYearPickerClick=function(e){if(!e.target.classList.contains("calendar__picker-year-option"))return;this.yearPickerOffset+=this.yearPickerOffsetTemporary;const t=parseInt(e.target.innerText),a=parseInt(e.target.dataset.value);this.updateYearPickerSelection(t,a),this.updateCurrentDate(0,void 0,void 0,t),this.togglePicker(!1);},t.prototype.updateYearPickerSelection=function(e,t){if(void 0===t){for(let a=0;a<12;a++){let i=this.pickerYearContainer.children[a],r=parseInt(i.innerHTML);if(t=parseInt(i.dataset.value),this.start||this.end){const e=this.start&&r<this.start.getFullYear()||this.end&&r>this.start.getFullYear()+1;console.log(this.end&&r>this.start.getFullYear()),this.pickerYearContainer.children[t].classList[e?"add":"remove"]("disable");}if(r===e&&i.dataset.value&&(t=parseInt(i.dataset.value),this.removeYearPickerSelection(),this.pickerYearContainer.children[t].classList.add("calendar__picker-year-selected"),!this.start&&!this.end))break}if(void 0===t)return}},t.prototype.updateYearPickerTodaySelection=function(){parseInt(this.pickerYearContainer.children[4].innerHTML)===this.today.getFullYear()?this.pickerYearContainer.children[4].classList.add("calendar__picker-year-today"):this.pickerYearContainer.children[4].classList.remove("calendar__picker-year-today");},t.prototype.removeYearPickerSelection=function(){for(let e=0;e<12;e++)this.pickerYearContainer.children[e].classList.contains("calendar__picker-year-selected")&&this.pickerYearContainer.children[e].classList.remove("calendar__picker-year-selected");},t.prototype.generatePickerYears=function(){const e=this.today.getFullYear()+this.yearPickerOffset+this.yearPickerOffsetTemporary;let t=0;for(let a=e-4;a<=e+7;a++){this.pickerYearContainer.children[t].innerText=a.toString(),t++;}this.updateYearPickerTodaySelection();},t.prototype.handleYearChevronLeftClick=function(){this.yearPickerOffsetTemporary-=12,this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear()),this.updateYearPickerTodaySelection();},t.prototype.handleYearChevronRightClick=function(){this.yearPickerOffsetTemporary+=12,this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear()),this.updateYearPickerTodaySelection();},t.prototype.setMonthDisplayType=function(e){this.monthDisplayType=e,this.updateMonthYear();},t.prototype.handleMonthYearDisplayClick=function(t){if(!t.target.classList.contains("calendar__month")&&!t.target.classList.contains("calendar__year"))return;if(this.disableMonthYearPickers)return;const a=this.pickerType,i=t.target.classList;i.contains("calendar__month")?(this.pickerType="month",this.monthDisplay.style.opacity="1",this.yearDisplay.style.opacity="0.7",this.pickerMonthContainer.style.display="grid",this.pickerYearContainer.style.display="none",[].slice.call(this.pickerMonthContainer.querySelectorAll(".calendar__picker-month-option")).forEach((t,a)=>{const i=e.bind(this)(+(t.dataset.value||a));t.classList[i?"add":"remove"]("disable");const r=this.currentDate.getFullYear()==this.today.getFullYear()&&+(t.dataset.value||a)==this.today.getMonth();t.classList[r?"add":"remove"]("calendar__picker-month-today");},this)):i.contains("calendar__year")&&(this.pickerType="year",this.monthDisplay.style.opacity="0.7",this.yearDisplay.style.opacity="1",this.pickerMonthContainer.style.display="none",this.pickerYearContainer.style.display="grid"),a===this.pickerType?this.togglePicker():this.togglePicker(!0);},t.prototype.handlePrevMonthButtonClick=function(){if(this.disableMonthArrowClick)return;const e=this.currentDate.getMonth()-1;this.currentDate.getFullYear()<=this.today.getFullYear()+this.yearPickerOffset-4&&e<0&&(this.yearPickerOffset-=12,this.generatePickerYears()),e<0&&this.updateYearPickerSelection(this.currentDate.getFullYear()-1),this.updateMonthPickerSelection(e),this.updateCurrentDate(-1),this.togglePicker(!1);},t.prototype.handleNextMonthButtonClick=function(){if(this.disableMonthArrowClick)return;const e=this.currentDate.getMonth()+1;this.currentDate.getFullYear()>=this.today.getFullYear()+this.yearPickerOffset+7&&e>11&&(this.yearPickerOffset+=12,this.generatePickerYears()),e>11&&this.updateYearPickerSelection(this.currentDate.getFullYear()+1),this.updateMonthPickerSelection(e),this.updateCurrentDate(1),this.togglePicker(!1);},t.prototype.updateMonthYear=function(){this.oldSelectedNode=null,this.customMonthValues?this.monthDisplay.innerHTML=this.customMonthValues[this.currentDate.getMonth()]:this.monthDisplay.innerHTML=new Intl.DateTimeFormat("default",{month:this.monthDisplayType}).format(this.currentDate),this.yearDisplay.innerHTML=this.currentDate.getFullYear().toString();},t.prototype.setWeekdayDisplayType=function(e){var t;this.weekdayDisplayType=e,this.weekdays=null!==(t=this.weekdayDisplayTypeOptions[this.weekdayDisplayType])&&void 0!==t?t:this.weekdayDisplayTypeOptions.short,this.generateWeekdays();},t.prototype.generateWeekdays=function(){let e="";for(let t=0;t<7;t++)e+=`\n      <div class="calendar__weekday">${this.weekdays[(t+this.startWeekday)%7]}</div>\n    `;this.calendarWeekdays.innerHTML=e;},t.prototype.setDate=function(e){e&&(e instanceof Date?this.reset(e):this.reset(new Date(e)));},t.prototype.getSelectedDate=function(){return this.currentDate},t.prototype.clearCalendarDays=function(){this.daysIn_PrevMonth=[],this.daysIn_CurrentMonth=[],this.daysIn_NextMonth=[];},t.prototype.updateCalendar=function(e){e&&(this.updateMonthYear(),this.clearCalendarDays(),this.generateDays(),this.selectDayInitial()),this.renderDays(),e&&this.setOldSelectedNode();},t.prototype.setOldSelectedNode=function(){if(!this.oldSelectedNode){let e=void 0;for(let t=1;t<this.calendarDays.childNodes.length;t+=2){let a=this.calendarDays.childNodes[t];if(a.classList&&a.classList.contains("calendar__day-active")&&a.innerText&&a.innerText.trim()===this.currentDate.getDate().toString()){e=a;break}}e&&(this.oldSelectedNode=[e,parseInt(e.innerText)]);}},t.prototype.selectDayInitial=function(e){if(e)this.daysIn_CurrentMonth[this.currentDate.getDate()-1].selected=!0;else {let e=this.today.getMonth()===this.currentDate.getMonth(),t=this.today.getDate()===this.currentDate.getDate();e&&t?this.daysIn_CurrentMonth[this.today.getDate()-1].selected=!0:this.daysIn_CurrentMonth[0].selected=!0;}},t.prototype.handleCalendarDayClick=function(e){if(!(e.target.classList.contains("calendar__day-box")||e.target.classList.contains("calendar__day-text")||e.target.classList.contains("calendar__day-box-today")||e.target.classList.contains("calendar__day-bullet")))return;if(this.disableDayClick)return;if(this.oldSelectedNode&&!this.oldSelectedNode[0])return;let t,a;e.target.parentElement.classList.contains("calendar__day-selected")||e.target.parentElement.classList.contains("calendar__day__no__selected")?this.selectedDateClicked&&this.selectedDateClicked(this.currentDate,this.getDateEvents(this.currentDate)):this.removeOldDaySelection(),t=e.target.parentElement.innerText,a=parseInt(t,10),t&&(this.updateCurrentDate(0,a),Object.assign(this.daysIn_CurrentMonth[a-1],{selected:!0}),this.rerenderSelectedDay(e.target.parentElement,a,!0));},t.prototype.removeOldDaySelection=function(){if(this.oldSelectedNode)return Object.assign(this.daysIn_CurrentMonth[this.oldSelectedNode[1]-1],{selected:!1}),this.rerenderSelectedDay(this.oldSelectedNode[0],this.oldSelectedNode[1]),!0},t.prototype.updateCurrentDate=function(e,t,a,i){if(this.currentDate=new Date(i||this.currentDate.getFullYear(),null!=a?a:this.currentDate.getMonth()+e,0===e&&t?t:1),0!==e||null!=a||i){this.updateCalendar(!0),this.monthChanged&&this.monthChanged(this.currentDate,this.getMonthEvents());const t=".calendar__arrow.calendar__arrow-",[a,i,[r]]=e>0?["next","prev",["end"]]:["prev","next",["start"]];["getFullYear","getMonth"].reduce((e,t)=>e&&this.currentDate[t]()===this[r][t](),!0)&&document.querySelector(t+a).classList.add("disable"),document.querySelector(t+i).classList.remove("disable");}this.dateChanged&&this.dateChanged(this.currentDate,this.getDateEvents(this.currentDate));},t.prototype.generateDays=function(){this.numOfDays_PrevMonth=new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),0).getDate(),this.firstDay_CurrentMonth=new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),1).getDay(),this.numOfDays_CurrentMonth=new Date(this.currentDate.getFullYear(),this.currentDate.getMonth()+1,0).getDate();for(let e=0;e<this.numOfDays_CurrentMonth;e++)this.daysIn_CurrentMonth.push({day:e+1,selected:!1});},t.prototype.renderDays=function(){let e=0;const t=this.currentDate.getFullYear(),a=this.currentDate.getMonth();let i;this.filteredEventsThisMonth=this.eventsData.filter(e=>{const i=new Date(e.start);return i.getFullYear()===t&&i.getMonth()===a}),this.eventDayMap={},this.filteredEventsThisMonth.forEach(e=>{const t=new Date(e.start).getDate(),a=new Date(e.end).getDate();for(let e=t;e<=a;e++)this.eventDayMap[e]=!0;}),i=this.firstDay_CurrentMonth<this.startWeekday?7+this.firstDay_CurrentMonth-this.startWeekday:this.firstDay_CurrentMonth-this.startWeekday;let r="";for(let t=0;t<i;t++)r+=`\n      <div class="calendar__day calendar__day-other">${this.numOfDays_PrevMonth+1-i+t}</div>\n    `,e++;let n=this.today.getFullYear()===this.currentDate.getFullYear(),s=this.today.getMonth()===this.currentDate.getMonth()&&n;this.daysIn_CurrentMonth.forEach(t=>{let a=s&&t.day===this.today.getDate();r+=`\n      <div class="calendar__day calendar__day-active${a?" calendar__day-today":""}${this.eventDayMap[t.day]?" calendar__day-event":" calendar__day-no-event"}${t.selected?this.selectInitialDate?" calendar__day-selected":" calendar__day__no__selected":""}">\n        <span class="calendar__day-text">${t.day}</span>\n        <div class="calendar__day-bullet"></div>\n        <div class="calendar__day-box"></div>\n      </div>\n    `,e++;});for(let t=0;t<this.DAYS_TO_DISPLAY-e;t++)r+=`\n      <div class="calendar__day calendar__day-other">${t+1}</div>\n    `;this.calendarDays.innerHTML=r;},t.prototype.rerenderSelectedDay=function(e,t,a){let i=e.previousElementSibling,r=this.today.getFullYear()===this.currentDate.getFullYear(),n=this.today.getMonth()===this.currentDate.getMonth()&&r&&t===this.today.getDate(),s=document.createElement("div");s.className+=`calendar__day calendar__day-active${n?" calendar__day-today":""}${this.eventDayMap[t]?" calendar__day-event":" calendar__day-no-event"}${this.daysIn_CurrentMonth[t-1].selected?" calendar__day-selected":""}`,s.innerHTML=`\n    <span class="calendar__day-text">${t}</span>\n    <div class="calendar__day-bullet"></div>\n    <div class="calendar__day-box"></div>\n  `,i?i.parentElement?i.parentElement.insertBefore(s,i.nextSibling):console.log("Previous element does not have parent"):this.calendarDays.insertBefore(s,e),a&&(this.oldSelectedNode=[s,t]),e.remove();},t.prototype.getEventsData=function(){return JSON.parse(JSON.stringify(this.eventsData))},t.prototype.setEventsData=function(e){return this.eventsData=JSON.parse(JSON.stringify(e)),this.setDate(this.currentDate),this.eventsData.length},t.prototype.addEventsData=function(e=[]){const t=this.eventsData.push(...e);return this.setDate(this.currentDate),t},t.prototype.getDateEvents=function(e){return this.filteredEventsThisMonth.filter(t=>{const a=new Date(t.start).getDate(),i=new Date(t.end).getDate();return e.getDate()>=a&&e.getDate()<=i})},t.prototype.getMonthEvents=function(){return this.filteredEventsThisMonth},t}));
    });

    /* src\Calendar.svelte generated by Svelte v3.50.1 */
    const file = "src\\Calendar.svelte";

    function create_fragment(ctx) {
    	let div2;
    	let div0;
    	let t0_value = (/*value*/ ctx[2] || /*placeholder*/ ctx[1]) + "";
    	let t0;
    	let t1;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "input svelte-9kqzu9");
    			add_location(div0, file, 77, 1, 2430);
    			attr_dev(div1, "id", "calendar");
    			attr_dev(div1, "class", "svelte-9kqzu9");
    			toggle_class(div1, "opened", /*opened*/ ctx[0]);
    			add_location(div1, file, 78, 1, 2514);
    			attr_dev(div2, "class", "container svelte-9kqzu9");
    			add_location(div2, file, 75, 0, 2333);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value, placeholder*/ 6 && t0_value !== (t0_value = (/*value*/ ctx[2] || /*placeholder*/ ctx[1]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*opened*/ 1) {
    				toggle_class(div1, "opened", /*opened*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
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
    	let value;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);
    	let { placeholder = '-' } = $$props;
    	let { selectedDate = null } = $$props;
    	let { opened = false } = $$props;
    	let { blank = true } = $$props;
    	let { startMonth = null } = $$props;
    	let { endMonth = null } = $$props;
    	let { selectInitialDate = true } = $$props;
    	let { onSelect = null } = $$props;
    	let calendar = null;
    	let monthChanged = false;
    	let inited = false;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		calendar = new bundle({
    				id: "#calendar",
    				calendarSize: "small",
    				currentDate: selectedDate || new Date(),
    				startMonth,
    				endMonth,
    				selectInitialDate,
    				// eventsData:[
    				// 	{
    				// 		start: '2022-09-17T06:00:00',
    				// 		end: '2022-09-18T20:30:00',
    				// 		name: 'Blockchain 101'
    				// 	}
    				// ],
    				dateChanged: (currentDate, filteredDateEvents) => {
    					if (monthChanged) return monthChanged = false;
    					if (opened) $$invalidate(4, blank = false);
    					$$invalidate(3, selectedDate = currentDate);
    					$$invalidate(0, opened = false);
    					onSelect && onSelect(currentDate);
    					dispatch('select', { selectedDate });
    				},
    				monthChanged: (currentDate, filteredDateEvents) => {
    					if (inited) monthChanged = true; else {
    						inited = true;
    					}
    				},
    				selectedDateClicked: (currentDate, filteredDateEvents) => {
    					
    				}
    			});
    	});

    	const writable_props = [
    		'placeholder',
    		'selectedDate',
    		'opened',
    		'blank',
    		'startMonth',
    		'endMonth',
    		'selectInitialDate',
    		'onSelect'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, opened = !opened);

    	$$self.$$set = $$props => {
    		if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ('selectedDate' in $$props) $$invalidate(3, selectedDate = $$props.selectedDate);
    		if ('opened' in $$props) $$invalidate(0, opened = $$props.opened);
    		if ('blank' in $$props) $$invalidate(4, blank = $$props.blank);
    		if ('startMonth' in $$props) $$invalidate(5, startMonth = $$props.startMonth);
    		if ('endMonth' in $$props) $$invalidate(6, endMonth = $$props.endMonth);
    		if ('selectInitialDate' in $$props) $$invalidate(7, selectInitialDate = $$props.selectInitialDate);
    		if ('onSelect' in $$props) $$invalidate(8, onSelect = $$props.onSelect);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Calendar: bundle,
    		createEventDispatcher,
    		placeholder,
    		selectedDate,
    		opened,
    		blank,
    		startMonth,
    		endMonth,
    		selectInitialDate,
    		onSelect,
    		calendar,
    		monthChanged,
    		inited,
    		dispatch,
    		value
    	});

    	$$self.$inject_state = $$props => {
    		if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ('selectedDate' in $$props) $$invalidate(3, selectedDate = $$props.selectedDate);
    		if ('opened' in $$props) $$invalidate(0, opened = $$props.opened);
    		if ('blank' in $$props) $$invalidate(4, blank = $$props.blank);
    		if ('startMonth' in $$props) $$invalidate(5, startMonth = $$props.startMonth);
    		if ('endMonth' in $$props) $$invalidate(6, endMonth = $$props.endMonth);
    		if ('selectInitialDate' in $$props) $$invalidate(7, selectInitialDate = $$props.selectInitialDate);
    		if ('onSelect' in $$props) $$invalidate(8, onSelect = $$props.onSelect);
    		if ('calendar' in $$props) calendar = $$props.calendar;
    		if ('monthChanged' in $$props) monthChanged = $$props.monthChanged;
    		if ('inited' in $$props) inited = $$props.inited;
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*blank, placeholder, selectedDate*/ 26) {
    			$$invalidate(2, value = blank
    			? placeholder
    			: selectedDate ? selectedDate.toLocaleDateString() : '');
    		}
    	};

    	return [
    		opened,
    		placeholder,
    		value,
    		selectedDate,
    		blank,
    		startMonth,
    		endMonth,
    		selectInitialDate,
    		onSelect,
    		click_handler
    	];
    }

    class Calendar_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			placeholder: 1,
    			selectedDate: 3,
    			opened: 0,
    			blank: 4,
    			startMonth: 5,
    			endMonth: 6,
    			selectInitialDate: 7,
    			onSelect: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar_1",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get placeholder() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedDate() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedDate(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opened() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opened(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blank() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blank(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startMonth() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startMonth(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get endMonth() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endMonth(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectInitialDate() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectInitialDate(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const createCalendar = (target, { placeholder = '-', blank, selectedDate, startMonth, endMonth, selectInitialDate = false, onSelect }) => new Calendar_1({
        target: target,
        props: {
            onSelect,
            placeholder,
            blank,
            selectedDate: selectedDate || new Date,
            startMonth,
            endMonth,
            selectInitialDate
        }
    });

    return createCalendar;

})();
//# sourceMappingURL=bundle.js.map
