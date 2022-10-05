"use strict";function e(){}function t(e){return e()}function a(){return Object.create(null)}function n(e){e.forEach(t)}function r(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function s(e,t){e.appendChild(t)}function o(e){e.parentNode.removeChild(e)}function l(e){return document.createElement(e)}function c(e){return document.createTextNode(e)}function d(e,t,a){null==a?e.removeAttribute(t):e.getAttribute(t)!==a&&e.setAttribute(t,a)}function h(e,t,a){e.classList[a?"add":"remove"](t)}let u;function y(e){u=e}function p(){if(!u)throw new Error("Function called outside component initialization");return u}function f(){const e=p();return(t,a,{cancelable:n=!1}={})=>{const r=e.$$.callbacks[t];if(r){const i=function(e,t,{bubbles:a=!1,cancelable:n=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(e,a,n,t),r}(t,a,{cancelable:n});return r.slice().forEach((t=>{t.call(e,i)})),!i.defaultPrevented}return!0}}const _=[],k=[],D=[],v=[],g=Promise.resolve();let m=!1;function M(e){D.push(e)}const C=new Set;let b=0;function S(){const e=u;do{for(;b<_.length;){const e=_[b];b++,y(e),Y(e.$$)}for(y(null),_.length=0,b=0;k.length;)k.pop()();for(let e=0;e<D.length;e+=1){const t=D[e];C.has(t)||(C.add(t),t())}D.length=0}while(_.length);for(;v.length;)v.pop()();m=!1,C.clear(),y(e)}function Y(e){if(null!==e.fragment){e.update(),n(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(M)}}const w=new Set;function P(e,t){-1===e.$$.dirty[0]&&(_.push(e),m||(m=!0,g.then(S)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function $(i,s,l,c,d,h,p,f=[-1]){const _=u;y(i);const k=i.$$={fragment:null,ctx:null,props:h,update:e,not_equal:d,bound:a(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(_?_.$$.context:[])),callbacks:a(),dirty:f,skip_bound:!1,root:s.target||_.$$.root};p&&p(k.root);let D=!1;if(k.ctx=l?l(i,s.props||{},((e,t,...a)=>{const n=a.length?a[0]:t;return k.ctx&&d(k.ctx[e],k.ctx[e]=n)&&(!k.skip_bound&&k.bound[e]&&k.bound[e](n),D&&P(i,e)),t})):[],k.update(),D=!0,n(k.before_update),k.fragment=!!c&&c(k.ctx),s.target){if(s.hydrate){const e=function(e){return Array.from(e.childNodes)}(s.target);k.fragment&&k.fragment.l(e),e.forEach(o)}else k.fragment&&k.fragment.c();s.intro&&((v=i.$$.fragment)&&v.i&&(w.delete(v),v.i(g))),function(e,a,i,s){const{fragment:o,on_mount:l,on_destroy:c,after_update:d}=e.$$;o&&o.m(a,i),s||M((()=>{const a=l.map(t).filter(r);c?c.push(...a):n(a),e.$$.on_mount=[]})),d.forEach(M)}(i,s.target,s.anchor,s.customElement),S()}var v,g;y(_)}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var T=function(e){var t={exports:{}};return e(t,t.exports),t.exports}((function(e,t){e.exports=function(){function e(e){let t=!1;return this.start&&this.currentDate&&this.start.getFullYear()==this.currentDate.getFullYear()&&e<this.start.getMonth()&&(t=!0),this.end&&this.currentDate&&this.end.getFullYear()==this.currentDate.getFullYear()&&e>this.end.getMonth()&&(t=!0),t}class t{constructor(e={}){var t,a,n,r,i,s,o,l,c,d,h,u,y,p;if(this.CAL_NAME="color-calendar",this.DAYS_TO_DISPLAY=42,this.weekdayDisplayTypeOptions={short:["S","M","T","W","T","F","S"],"long-lower":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"long-upper":["SUN","MON","TUE","WED","THU","FRI","SAT"]},this.stepInfo={next:{year:!0,month:!0},previous:{year:!0,month:!0}},this.id=null!==(t=e.id)&&void 0!==t?t:"#color-calendar",this.selectInitialDate=null===(a=e.selectInitialDate)||void 0===a||a,this.calendarSize=null!==(n=e.calendarSize)&&void 0!==n?n:"large",this.layoutModifiers=null!==(r=e.layoutModifiers)&&void 0!==r?r:[],this.eventsData=null!==(i=e.eventsData)&&void 0!==i?i:[],this.theme=null!==(s=e.theme)&&void 0!==s?s:"basic",this.primaryColor=e.primaryColor,this.headerColor=e.headerColor,this.headerBackgroundColor=e.headerBackgroundColor,this.weekdaysColor=e.weekdaysColor,this.weekdayDisplayType=null!==(o=e.weekdayDisplayType)&&void 0!==o?o:"long-lower",this.monthDisplayType=null!==(l=e.monthDisplayType)&&void 0!==l?l:"long",this.startWeekday=null!==(c=e.startWeekday)&&void 0!==c?c:0,this.fontFamilyHeader=e.fontFamilyHeader,this.fontFamilyWeekdays=e.fontFamilyWeekdays,this.fontFamilyBody=e.fontFamilyBody,this.dropShadow=e.dropShadow,this.border=e.border,this.borderRadius=e.borderRadius,this.disableMonthYearPickers=null!==(d=e.disableMonthYearPickers)&&void 0!==d&&d,this.disableDayClick=null!==(h=e.disableDayClick)&&void 0!==h&&h,this.disableMonthArrowClick=null!==(u=e.disableMonthArrowClick)&&void 0!==u&&u,this.customMonthValues=e.customMonthValues,this.customWeekdayValues=e.customWeekdayValues,this.monthChanged=e.monthChanged,this.dateChanged=e.dateChanged,this.selectedDateClicked=e.selectedDateClicked,this.customWeekdayValues&&7===this.customWeekdayValues.length?this.weekdays=this.customWeekdayValues:this.weekdays=null!==(y=this.weekdayDisplayTypeOptions[this.weekdayDisplayType])&&void 0!==y?y:this.weekdayDisplayTypeOptions.short,this.today=new Date,this.currentDate=e.currentDate||new Date,this.start=e.startMonth?new Date(e.startMonth.getFullYear(),e.startMonth.getMonth()-1,1):void 0,this.end=e.endMonth?new Date(e.endMonth.getFullYear(),e.endMonth.getMonth(),0):void 0,this.start&&this.start>this.currentDate)throw new Error("The current date cannot be less than the starting point");if(this.end&&this.end<this.currentDate)throw new Error("The current date cannot be greater than the endpoint");if(["start","end"].forEach((e=>{const t=e;if(this[t]&&this.currentDate.getFullYear()==this[t].getFullYear()){const e="start"==t?"previous":"next";this.stepInfo[e].year=!1,this.currentDate.getMonth()==this[t].getMonth()&&(this.stepInfo[e].month=!1)}}),this),this.pickerType="month",this.eventDayMap={},this.oldSelectedNode=null,this.filteredEventsThisMonth=[],this.daysIn_PrevMonth=[],this.daysIn_CurrentMonth=[],this.daysIn_NextMonth=[],this.firstDay_PrevMonth=0,this.firstDay_CurrentMonth=0,this.firstDay_NextMonth=0,this.numOfDays_PrevMonth=0,this.numOfDays_CurrentMonth=0,this.numOfDays_NextMonth=0,this.yearPickerOffset=0,this.yearPickerOffsetTemporary=0,this.calendar=document.querySelector(this.id),!this.calendar)throw new Error(`[COLOR-CALENDAR] Element with selector '${this.id}' not found`);this.calendar.innerHTML=`\n      <div class="${this.CAL_NAME} ${this.theme} color-calendar--${this.calendarSize}">\n        <div class="calendar__header">\n          <div class="calendar__arrow calendar__arrow-prev ${this.stepInfo.previous.month?"":"disable"}"><div class="calendar__arrow-inner"></div></div>\n          <div class="calendar__monthyear">\n            <span class="calendar__month"></span>&nbsp;\n            <span class="calendar__year"></span>\n          </div>\n          <div class="calendar__arrow calendar__arrow-next ${this.stepInfo.next.month?"":"disable"}"><div class="calendar__arrow-inner"></div></div>\n        </div>\n        <div class="calendar__body">\n          <div class="calendar__weekdays"></div>\n          <div class="calendar__days"></div>\n          <div class="calendar__picker">\n            <div class="calendar__picker-month">\n              ${(null!==(p=this.customMonthValues)&&void 0!==p?p:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]).map(((e,t)=>{let a="";return this.start&&this.currentDate&&this.start.getFullYear()==this.currentDate.getFullYear()&&t<this.start.getMonth()&&(a=" disable"),this.end&&this.currentDate&&this.end.getFullYear()==this.currentDate.getFullYear()&&t>this.end.getMonth()&&(a=" disable"),`<div class="calendar__picker-month-option${a}" data-value="${t}">${e}</div>`})).join("")}\n            </div>\n            <div class="calendar__picker-year">\n              ${new Array(12).fill(0).map(((e,t)=>`<div class="calendar__picker-year-option" data-value="${t}"></div>`)).join("")}\n              <div class="calendar__picker-year-arrow calendar__picker-year-arrow-left">\n                <div class="chevron-thin chevron-thin-left"></div>\n              </div>\n              <div class="calendar__picker-year-arrow calendar__picker-year-arrow-right">\n                <div class="chevron-thin chevron-thin-right"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    `,this.calendarRoot=document.querySelector(`${this.id} .${this.CAL_NAME}`),this.calendarHeader=document.querySelector(this.id+" .calendar__header"),this.calendarWeekdays=document.querySelector(this.id+" .calendar__weekdays"),this.calendarDays=document.querySelector(this.id+" .calendar__days"),this.pickerContainer=document.querySelector(this.id+" .calendar__picker"),this.pickerMonthContainer=document.querySelector(this.id+" .calendar__picker-month"),this.pickerYearContainer=document.querySelector(this.id+" .calendar__picker-year"),this.yearPickerChevronLeft=document.querySelector(this.id+" .calendar__picker-year-arrow-left"),this.yearPickerChevronRight=document.querySelector(this.id+" .calendar__picker-year-arrow-right"),this.pickerMonthContainer.children[this.today.getMonth()].classList.add("calendar__picker-month-today"),this.layoutModifiers.forEach((e=>{this.calendarRoot.classList.add(e)})),this.layoutModifiers.includes("month-left-align")&&(this.calendarHeader.innerHTML=`\n        <div class="calendar__monthyear">\n          <span class="calendar__month"></span>&nbsp;\n          <span class="calendar__year"></span>\n        </div>\n        <div class="calendar__arrow calendar__arrow-prev"><div class="calendar__arrow-inner ${this.stepInfo.previous.month?"":"disable"}"></div></div>\n        <div class="calendar__arrow calendar__arrow-next"><div class="calendar__arrow-inner ${this.stepInfo.next.month?"":"disable"}"></div></div>\n      `),this.monthyearDisplay=document.querySelector(this.id+" .calendar__monthyear"),this.monthDisplay=document.querySelector(this.id+" .calendar__month"),this.yearDisplay=document.querySelector(this.id+" .calendar__year"),this.prevButton=document.querySelector(this.id+" .calendar__arrow-prev .calendar__arrow-inner"),this.nextButton=document.querySelector(this.id+" .calendar__arrow-next .calendar__arrow-inner"),this.togglePicker(!1),this.configureStylePreferences(),this.addEventListeners(),this.reset(this.currentDate)}reset(e){this.currentDate=e||new Date,this.clearCalendarDays(),this.updateMonthYear(),this.updateMonthPickerSelection(this.currentDate.getMonth()),this.generatePickerYears(),this.updateYearPickerSelection(this.currentDate.getFullYear(),4),this.updateYearPickerTodaySelection(),this.generateWeekdays(),this.generateDays(),this.selectDayInitial(!!e),this.renderDays(),this.setOldSelectedNode(),this.dateChanged&&this.dateChanged(this.currentDate,this.getDateEvents(this.currentDate)),this.monthChanged&&this.monthChanged(this.currentDate,this.getMonthEvents())}}return t.prototype.addEventListeners=function(){this.prevButton.addEventListener("click",this.handlePrevMonthButtonClick.bind(this)),this.nextButton.addEventListener("click",this.handleNextMonthButtonClick.bind(this)),this.monthyearDisplay.addEventListener("click",this.handleMonthYearDisplayClick.bind(this)),this.calendarDays.addEventListener("click",this.handleCalendarDayClick.bind(this)),this.pickerMonthContainer.addEventListener("click",this.handleMonthPickerClick.bind(this)),this.pickerYearContainer.addEventListener("click",this.handleYearPickerClick.bind(this)),this.yearPickerChevronLeft.addEventListener("click",this.handleYearChevronLeftClick.bind(this)),this.yearPickerChevronRight.addEventListener("click",this.handleYearChevronRightClick.bind(this))},t.prototype.configureStylePreferences=function(){let e=this.calendarRoot;this.primaryColor&&e.style.setProperty("--cal-color-primary",this.primaryColor),this.fontFamilyHeader&&e.style.setProperty("--cal-font-family-header",this.fontFamilyHeader),this.fontFamilyWeekdays&&e.style.setProperty("--cal-font-family-weekdays",this.fontFamilyWeekdays),this.fontFamilyBody&&e.style.setProperty("--cal-font-family-body",this.fontFamilyBody),this.dropShadow&&e.style.setProperty("--cal-drop-shadow",this.dropShadow),this.border&&e.style.setProperty("--cal-border",this.border),this.borderRadius&&e.style.setProperty("--cal-border-radius",this.borderRadius),this.headerColor&&e.style.setProperty("--cal-header-color",this.headerColor),this.headerBackgroundColor&&e.style.setProperty("--cal-header-background-color",this.headerBackgroundColor),this.weekdaysColor&&e.style.setProperty("--cal-weekdays-color",this.weekdaysColor)},t.prototype.togglePicker=function(e){!0===e?(this.pickerContainer.style.visibility="visible",this.pickerContainer.style.opacity="1","year"===this.pickerType&&this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear())):!1===e?(this.pickerContainer.style.visibility="hidden",this.pickerContainer.style.opacity="0",this.monthDisplay&&this.yearDisplay&&(this.monthDisplay.style.opacity="1",this.yearDisplay.style.opacity="1"),this.yearPickerOffsetTemporary=0):"hidden"===this.pickerContainer.style.visibility?(this.pickerContainer.style.visibility="visible",this.pickerContainer.style.opacity="1","year"===this.pickerType&&this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear())):(this.pickerContainer.style.visibility="hidden",this.pickerContainer.style.opacity="0",this.monthDisplay&&this.yearDisplay&&(this.monthDisplay.style.opacity="1",this.yearDisplay.style.opacity="1"),this.yearPickerOffsetTemporary=0)},t.prototype.handleMonthPickerClick=function(e){if(!e.target.classList.contains("calendar__picker-month-option"))return;const t=parseInt(e.target.dataset.value,10);this.updateMonthPickerSelection(t),this.updateCurrentDate(0,void 0,t),this.togglePicker(!1)},t.prototype.updateMonthPickerSelection=function(e){e<0?e=11:e%=12,this.removeMonthPickerSelection(),this.pickerMonthContainer.children[e].classList.add("calendar__picker-month-selected")},t.prototype.removeMonthPickerSelection=function(){for(let e=0;e<12;e++)this.pickerMonthContainer.children[e].classList.contains("calendar__picker-month-selected")&&this.pickerMonthContainer.children[e].classList.remove("calendar__picker-month-selected")},t.prototype.handleYearPickerClick=function(e){if(!e.target.classList.contains("calendar__picker-year-option"))return;this.yearPickerOffset+=this.yearPickerOffsetTemporary;const t=parseInt(e.target.innerText),a=parseInt(e.target.dataset.value);this.updateYearPickerSelection(t,a),this.updateCurrentDate(0,void 0,void 0,t),this.togglePicker(!1)},t.prototype.updateYearPickerSelection=function(e,t){if(void 0===t){for(let a=0;a<12;a++){let n=this.pickerYearContainer.children[a],r=parseInt(n.innerHTML);if(t=parseInt(n.dataset.value),this.start||this.end){const e=this.start&&r<this.start.getFullYear()||this.end&&r>this.start.getFullYear()+1;console.log(this.end&&r>this.start.getFullYear()),this.pickerYearContainer.children[t].classList[e?"add":"remove"]("disable")}if(r===e&&n.dataset.value&&(t=parseInt(n.dataset.value),this.removeYearPickerSelection(),this.pickerYearContainer.children[t].classList.add("calendar__picker-year-selected"),!this.start&&!this.end))break}if(void 0===t)return}},t.prototype.updateYearPickerTodaySelection=function(){parseInt(this.pickerYearContainer.children[4].innerHTML)===this.today.getFullYear()?this.pickerYearContainer.children[4].classList.add("calendar__picker-year-today"):this.pickerYearContainer.children[4].classList.remove("calendar__picker-year-today")},t.prototype.removeYearPickerSelection=function(){for(let e=0;e<12;e++)this.pickerYearContainer.children[e].classList.contains("calendar__picker-year-selected")&&this.pickerYearContainer.children[e].classList.remove("calendar__picker-year-selected")},t.prototype.generatePickerYears=function(){const e=this.today.getFullYear()+this.yearPickerOffset+this.yearPickerOffsetTemporary;let t=0;for(let a=e-4;a<=e+7;a++)this.pickerYearContainer.children[t].innerText=a.toString(),t++;this.updateYearPickerTodaySelection()},t.prototype.handleYearChevronLeftClick=function(){this.yearPickerOffsetTemporary-=12,this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear()),this.updateYearPickerTodaySelection()},t.prototype.handleYearChevronRightClick=function(){this.yearPickerOffsetTemporary+=12,this.generatePickerYears(),this.removeYearPickerSelection(),this.updateYearPickerSelection(this.currentDate.getFullYear()),this.updateYearPickerTodaySelection()},t.prototype.setMonthDisplayType=function(e){this.monthDisplayType=e,this.updateMonthYear()},t.prototype.handleMonthYearDisplayClick=function(t){if(!t.target.classList.contains("calendar__month")&&!t.target.classList.contains("calendar__year"))return;if(this.disableMonthYearPickers)return;const a=this.pickerType,n=t.target.classList;n.contains("calendar__month")?(this.pickerType="month",this.monthDisplay.style.opacity="1",this.yearDisplay.style.opacity="0.7",this.pickerMonthContainer.style.display="grid",this.pickerYearContainer.style.display="none",[].slice.call(this.pickerMonthContainer.querySelectorAll(".calendar__picker-month-option")).forEach(((t,a)=>{const n=e.bind(this)(+(t.dataset.value||a));t.classList[n?"add":"remove"]("disable");const r=this.currentDate.getFullYear()==this.today.getFullYear()&&+(t.dataset.value||a)==this.today.getMonth();t.classList[r?"add":"remove"]("calendar__picker-month-today")}),this)):n.contains("calendar__year")&&(this.pickerType="year",this.monthDisplay.style.opacity="0.7",this.yearDisplay.style.opacity="1",this.pickerMonthContainer.style.display="none",this.pickerYearContainer.style.display="grid"),a===this.pickerType?this.togglePicker():this.togglePicker(!0)},t.prototype.handlePrevMonthButtonClick=function(){if(this.disableMonthArrowClick)return;const e=this.currentDate.getMonth()-1;this.currentDate.getFullYear()<=this.today.getFullYear()+this.yearPickerOffset-4&&e<0&&(this.yearPickerOffset-=12,this.generatePickerYears()),e<0&&this.updateYearPickerSelection(this.currentDate.getFullYear()-1),this.updateMonthPickerSelection(e),this.updateCurrentDate(-1),this.togglePicker(!1)},t.prototype.handleNextMonthButtonClick=function(){if(this.disableMonthArrowClick)return;const e=this.currentDate.getMonth()+1;this.currentDate.getFullYear()>=this.today.getFullYear()+this.yearPickerOffset+7&&e>11&&(this.yearPickerOffset+=12,this.generatePickerYears()),e>11&&this.updateYearPickerSelection(this.currentDate.getFullYear()+1),this.updateMonthPickerSelection(e),this.updateCurrentDate(1),this.togglePicker(!1)},t.prototype.updateMonthYear=function(){this.oldSelectedNode=null,this.customMonthValues?this.monthDisplay.innerHTML=this.customMonthValues[this.currentDate.getMonth()]:this.monthDisplay.innerHTML=new Intl.DateTimeFormat("default",{month:this.monthDisplayType}).format(this.currentDate),this.yearDisplay.innerHTML=this.currentDate.getFullYear().toString()},t.prototype.setWeekdayDisplayType=function(e){var t;this.weekdayDisplayType=e,this.weekdays=null!==(t=this.weekdayDisplayTypeOptions[this.weekdayDisplayType])&&void 0!==t?t:this.weekdayDisplayTypeOptions.short,this.generateWeekdays()},t.prototype.generateWeekdays=function(){let e="";for(let t=0;t<7;t++)e+=`\n      <div class="calendar__weekday">${this.weekdays[(t+this.startWeekday)%7]}</div>\n    `;this.calendarWeekdays.innerHTML=e},t.prototype.setDate=function(e){e&&(e instanceof Date?this.reset(e):this.reset(new Date(e)))},t.prototype.getSelectedDate=function(){return this.currentDate},t.prototype.clearCalendarDays=function(){this.daysIn_PrevMonth=[],this.daysIn_CurrentMonth=[],this.daysIn_NextMonth=[]},t.prototype.updateCalendar=function(e){e&&(this.updateMonthYear(),this.clearCalendarDays(),this.generateDays(),this.selectDayInitial()),this.renderDays(),e&&this.setOldSelectedNode()},t.prototype.setOldSelectedNode=function(){if(!this.oldSelectedNode){let e;for(let t=1;t<this.calendarDays.childNodes.length;t+=2){let a=this.calendarDays.childNodes[t];if(a.classList&&a.classList.contains("calendar__day-active")&&a.innerText&&a.innerText.trim()===this.currentDate.getDate().toString()){e=a;break}}e&&(this.oldSelectedNode=[e,parseInt(e.innerText)])}},t.prototype.selectDayInitial=function(e){if(e)this.daysIn_CurrentMonth[this.currentDate.getDate()-1].selected=!0;else{let e=this.today.getMonth()===this.currentDate.getMonth(),t=this.today.getDate()===this.currentDate.getDate();e&&t?this.daysIn_CurrentMonth[this.today.getDate()-1].selected=!0:this.daysIn_CurrentMonth[0].selected=!0}},t.prototype.handleCalendarDayClick=function(e){if(!(e.target.classList.contains("calendar__day-box")||e.target.classList.contains("calendar__day-text")||e.target.classList.contains("calendar__day-box-today")||e.target.classList.contains("calendar__day-bullet")))return;if(this.disableDayClick)return;if(this.oldSelectedNode&&!this.oldSelectedNode[0])return;let t,a;e.target.parentElement.classList.contains("calendar__day-selected")||e.target.parentElement.classList.contains("calendar__day__no__selected")?this.selectedDateClicked&&this.selectedDateClicked(this.currentDate,this.getDateEvents(this.currentDate)):this.removeOldDaySelection(),t=e.target.parentElement.innerText,a=parseInt(t,10),t&&(this.updateCurrentDate(0,a),Object.assign(this.daysIn_CurrentMonth[a-1],{selected:!0}),this.rerenderSelectedDay(e.target.parentElement,a,!0))},t.prototype.removeOldDaySelection=function(){if(this.oldSelectedNode)return Object.assign(this.daysIn_CurrentMonth[this.oldSelectedNode[1]-1],{selected:!1}),this.rerenderSelectedDay(this.oldSelectedNode[0],this.oldSelectedNode[1]),!0},t.prototype.updateCurrentDate=function(e,t,a,n){if(this.currentDate=new Date(n||this.currentDate.getFullYear(),null!=a?a:this.currentDate.getMonth()+e,0===e&&t?t:1),0!==e||null!=a||n){this.updateCalendar(!0),this.monthChanged&&this.monthChanged(this.currentDate,this.getMonthEvents());const t=".calendar__arrow.calendar__arrow-",[a,n,[r]]=e>0?["next","prev",["end"]]:["prev","next",["start"]];["getFullYear","getMonth"].reduce(((e,t)=>e&&this.currentDate[t]()===this[r][t]()),!0)&&document.querySelector(t+a).classList.add("disable"),document.querySelector(t+n).classList.remove("disable")}this.dateChanged&&this.dateChanged(this.currentDate,this.getDateEvents(this.currentDate))},t.prototype.generateDays=function(){this.numOfDays_PrevMonth=new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),0).getDate(),this.firstDay_CurrentMonth=new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),1).getDay(),this.numOfDays_CurrentMonth=new Date(this.currentDate.getFullYear(),this.currentDate.getMonth()+1,0).getDate();for(let e=0;e<this.numOfDays_CurrentMonth;e++)this.daysIn_CurrentMonth.push({day:e+1,selected:!1})},t.prototype.renderDays=function(){let e=0;const t=this.currentDate.getFullYear(),a=this.currentDate.getMonth();let n;this.filteredEventsThisMonth=this.eventsData.filter((e=>{const n=new Date(e.start);return n.getFullYear()===t&&n.getMonth()===a})),this.eventDayMap={},this.filteredEventsThisMonth.forEach((e=>{const t=new Date(e.start).getDate(),a=new Date(e.end).getDate();for(let e=t;e<=a;e++)this.eventDayMap[e]=!0})),n=this.firstDay_CurrentMonth<this.startWeekday?7+this.firstDay_CurrentMonth-this.startWeekday:this.firstDay_CurrentMonth-this.startWeekday;let r="";for(let t=0;t<n;t++)r+=`\n      <div class="calendar__day calendar__day-other">${this.numOfDays_PrevMonth+1-n+t}</div>\n    `,e++;let i=this.today.getFullYear()===this.currentDate.getFullYear(),s=this.today.getMonth()===this.currentDate.getMonth()&&i;this.daysIn_CurrentMonth.forEach((t=>{let a=s&&t.day===this.today.getDate();r+=`\n      <div class="calendar__day calendar__day-active${a?" calendar__day-today":""}${this.eventDayMap[t.day]?" calendar__day-event":" calendar__day-no-event"}${t.selected?this.selectInitialDate?" calendar__day-selected":" calendar__day__no__selected":""}">\n        <span class="calendar__day-text">${t.day}</span>\n        <div class="calendar__day-bullet"></div>\n        <div class="calendar__day-box"></div>\n      </div>\n    `,e++}));for(let t=0;t<this.DAYS_TO_DISPLAY-e;t++)r+=`\n      <div class="calendar__day calendar__day-other">${t+1}</div>\n    `;this.calendarDays.innerHTML=r},t.prototype.rerenderSelectedDay=function(e,t,a){let n=e.previousElementSibling,r=this.today.getFullYear()===this.currentDate.getFullYear(),i=this.today.getMonth()===this.currentDate.getMonth()&&r&&t===this.today.getDate(),s=document.createElement("div");s.className+=`calendar__day calendar__day-active${i?" calendar__day-today":""}${this.eventDayMap[t]?" calendar__day-event":" calendar__day-no-event"}${this.daysIn_CurrentMonth[t-1].selected?" calendar__day-selected":""}`,s.innerHTML=`\n    <span class="calendar__day-text">${t}</span>\n    <div class="calendar__day-bullet"></div>\n    <div class="calendar__day-box"></div>\n  `,n?n.parentElement?n.parentElement.insertBefore(s,n.nextSibling):console.log("Previous element does not have parent"):this.calendarDays.insertBefore(s,e),a&&(this.oldSelectedNode=[s,t]),e.remove()},t.prototype.getEventsData=function(){return JSON.parse(JSON.stringify(this.eventsData))},t.prototype.setEventsData=function(e){return this.eventsData=JSON.parse(JSON.stringify(e)),this.setDate(this.currentDate),this.eventsData.length},t.prototype.addEventsData=function(e=[]){const t=this.eventsData.push(...e);return this.setDate(this.currentDate),t},t.prototype.getDateEvents=function(e){return this.filteredEventsThisMonth.filter((t=>{const a=new Date(t.start).getDate(),n=new Date(t.end).getDate();return e.getDate()>=a&&e.getDate()<=n}))},t.prototype.getMonthEvents=function(){return this.filteredEventsThisMonth},t}()}));function L(t){let a,n,r,i,u,y,p,f=(t[2]||t[1])+"";return{c(){a=l("div"),n=l("div"),r=c(f),i=c(" "),u=l("div"),d(n,"class","input svelte-1v60mtd"),d(u,"id","calendar"),d(u,"class","svelte-1v60mtd"),h(u,"opened",t[0]),d(a,"class","container svelte-1v60mtd")},m(e,o){var l,c,d,h;!function(e,t,a){e.insertBefore(t,a||null)}(e,a,o),s(a,n),s(n,r),s(a,i),s(a,u),y||(l=n,c="click",d=t[11],l.addEventListener(c,d,h),p=()=>l.removeEventListener(c,d,h),y=!0)},p(e,[t]){6&t&&f!==(f=(e[2]||e[1])+"")&&function(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}(r,f),1&t&&h(u,"opened",e[0])},i:e,o:e,d(e){e&&o(a),y=!1,p()}}}function E(e,t,a){let n,{placeholder:r="-"}=t,{selectedDate:i=null}=t,{opened:s=!1}=t,{blank:o=!0}=t,{startMonth:l=null}=t,{endMonth:c=null}=t,{selectInitialDate:d=!0}=t,{shortMonthValues:h=null}=t,{weekdayValues:u=null}=t,{onSelect:y=null}=t,_=!1,k=!1;const D=f();var v;v=()=>{new T({id:"#calendar",calendarSize:"small",currentDate:i||new Date,selectInitialDate:d,startMonth:l,endMonth:c,customMonthValues:h,customWeekdayValues:u,dateChanged:(e,t)=>{if(_)return _=!1;s&&a(4,o=!1),a(3,i=e),a(0,s=!1),y&&y(e),D("select",{selectedDate:i})},monthChanged:(e,t)=>{k?_=!0:k=!0},selectedDateClicked:(e,t)=>{}})},p().$$.on_mount.push(v);return e.$$set=e=>{"placeholder"in e&&a(1,r=e.placeholder),"selectedDate"in e&&a(3,i=e.selectedDate),"opened"in e&&a(0,s=e.opened),"blank"in e&&a(4,o=e.blank),"startMonth"in e&&a(5,l=e.startMonth),"endMonth"in e&&a(6,c=e.endMonth),"selectInitialDate"in e&&a(7,d=e.selectInitialDate),"shortMonthValues"in e&&a(8,h=e.shortMonthValues),"weekdayValues"in e&&a(9,u=e.weekdayValues),"onSelect"in e&&a(10,y=e.onSelect)},e.$$.update=()=>{26&e.$$.dirty&&a(2,n=o?r:i?i.toLocaleDateString():"")},[s,r,n,i,o,l,c,d,h,u,y,()=>a(0,s=!s)]}module.exports=class extends class{$destroy(){!function(e,t){const a=e.$$;null!==a.fragment&&(n(a.on_destroy),a.fragment&&a.fragment.d(t),a.on_destroy=a.fragment=null,a.ctx=[])}(this,1),this.$destroy=e}$on(e,t){const a=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return a.push(t),()=>{const e=a.indexOf(t);-1!==e&&a.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}{constructor(e){super(),$(this,e,E,L,i,{placeholder:1,selectedDate:3,opened:0,blank:4,startMonth:5,endMonth:6,selectInitialDate:7,shortMonthValues:8,weekdayValues:9,onSelect:10})}};
//# sourceMappingURL=bundle.cjs.js.map