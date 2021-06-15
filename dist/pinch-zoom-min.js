!function(){"use strict";!function(){class t{constructor(t){this.id=-1,this.nativePointer=t,this.pageX=t.pageX,this.pageY=t.pageY,this.clientX=t.clientX,this.clientY=t.clientY,self.Touch&&t instanceof Touch?this.id=t.identifier:e(t)&&(this.id=t.pointerId)}getCoalesced(){return"getCoalescedEvents"in this.nativePointer?this.nativePointer.getCoalescedEvents().map(e=>new t(e)):[this]}}const e=t=>self.PointerEvent&&t instanceof PointerEvent,i=()=>{};class n{constructor(t,e){this._element=t,this.startPointers=[],this.currentPointers=[];const{start:n=(()=>!0),move:s=i,end:r=i}=e;this._startCallback=n,this._moveCallback=s,this._endCallback=r,this._pointerStart=this._pointerStart.bind(this),this._touchStart=this._touchStart.bind(this),this._move=this._move.bind(this),this._triggerPointerEnd=this._triggerPointerEnd.bind(this),this._pointerEnd=this._pointerEnd.bind(this),this._touchEnd=this._touchEnd.bind(this),self.PointerEvent?this._element.addEventListener("pointerdown",this._pointerStart):(this._element.addEventListener("mousedown",this._pointerStart),this._element.addEventListener("touchstart",this._touchStart),this._element.addEventListener("touchmove",this._move),this._element.addEventListener("touchend",this._touchEnd))}_triggerPointerStart(t,e){return!!this._startCallback(t,e)&&(this.currentPointers.push(t),this.startPointers.push(t),!0)}_pointerStart(i){0===i.button&&this._triggerPointerStart(new t(i),i)&&(e(i)?(this._element.setPointerCapture(i.pointerId),this._element.addEventListener("pointermove",this._move),this._element.addEventListener("pointerup",this._pointerEnd)):(window.addEventListener("mousemove",this._move),window.addEventListener("mouseup",this._pointerEnd)))}_touchStart(e){for(const i of Array.from(e.changedTouches))this._triggerPointerStart(new t(i),e)}_move(e){const i=this.currentPointers.slice(),n="changedTouches"in e?Array.from(e.changedTouches).map(e=>new t(e)):[new t(e)],s=[];for(const t of n){const e=this.currentPointers.findIndex(e=>e.id===t.id);-1!==e&&(s.push(t),this.currentPointers[e]=t)}0!==s.length&&this._moveCallback(i,s,e)}_triggerPointerEnd(t,e){const i=this.currentPointers.findIndex(e=>e.id===t.id);return-1!==i&&(this.currentPointers.splice(i,1),this.startPointers.splice(i,1),this._endCallback(t,e),!0)}_pointerEnd(i){if(this._triggerPointerEnd(new t(i),i))if(e(i)){if(this.currentPointers.length)return;this._element.removeEventListener("pointermove",this._move),this._element.removeEventListener("pointerup",this._pointerEnd)}else window.removeEventListener("mousemove",this._move),window.removeEventListener("mouseup",this._pointerEnd)}_touchEnd(e){for(const i of Array.from(e.changedTouches))this._triggerPointerEnd(new t(i),e)}}!function(t,e){void 0===e&&(e={});var i=e.insertAt;if(t&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.type="text/css","top"===i&&n.firstChild?n.insertBefore(s,n.firstChild):n.appendChild(s),s.styleSheet?s.styleSheet.cssText=t:s.appendChild(document.createTextNode(t))}}("pinch-zoom {\r\n    display: block;\r\n    overflow: hidden;\r\n    touch-action: none;\r\n    --scale: 1;\r\n    --x: 0;\r\n    --y: 0;\r\n}");const s="min-scale",r="max-scale",o="report-moving";function h(t,e){return e?Math.sqrt((e.clientX-t.clientX)**2+(e.clientY-t.clientY)**2):0}function a(t,e){return e?{clientX:(t.clientX+e.clientX)/2,clientY:(t.clientY+e.clientY)/2}:t}function l(t,e){return"number"==typeof t?t:t.trim().endsWith("%")?e*parseFloat(t)/100:parseFloat(t)}let c;function d(){return c||(c=document.createElementNS("http://www.w3.org/2000/svg","svg"))}function g(){return d().createSVGMatrix()}function u(){return d().createSVGPoint()}const m=.01,p=999;class _ extends HTMLElement{constructor(){super(),this._transform=g(),this._moving=!1,this._reportMoving=!1,this.stopIndicatingMoving=function(t,e){let i;return(...n)=>{clearTimeout(i),i=setTimeout(()=>t(...n),e)}}(()=>{this._moving=!1,this.classList.remove("moving")},400),new MutationObserver(()=>this._stageElChange()).observe(this,{childList:!0});const t=new n(this,{start:(e,i)=>!(2===t.currentPointers.length||!this._positioningEl)&&(i.preventDefault(),!0),move:e=>{this._onPointerMove(e,t.currentPointers)},end:(t,e)=>{this._reportMoving&&this.stopIndicatingMoving()}});this._reportMoving="yes"==this.getAttribute(o),this.addEventListener("wheel",t=>this._onWheel(t))}static get observedAttributes(){return[s,r,o]}async attributeChangedCallback(t,e,i){t===s&&this.scale<this.minScale&&this.setTransform({scale:this.minScale}),t===r&&this.scale>this.maxScale&&this.setTransform({scale:this.maxScale}),t==o&&(this._reportMoving="yes"==i,this._reportMoving||this.classList.remove("moving"))}get minScale(){const t=this.getAttribute(s);if(!t)return m;const e=parseFloat(t);return Number.isFinite(e)?Math.max(m,e):m}set minScale(t){this.setAttribute(s,String(t))}get maxScale(){const t=this.getAttribute(r);if(!t)return p;const e=parseFloat(t);return Number.isFinite(e)?Math.min(p,e):p}set maxScale(t){this.setAttribute(r,String(t))}connectedCallback(){this._stageElChange()}get x(){return this._transform.e}get y(){return this._transform.f}get scale(){return this._transform.a}scaleTo(t,e={}){let{originX:i=0,originY:n=0}=e;const{relativeTo:s="content",allowChangeEvent:r=!1}=e;t<this.minScale&&(t=this.minScale),t>this.maxScale&&(t=this.maxScale);const o="content"===s?this._positioningEl:this;if(!o||!this._positioningEl)return void this.setTransform({scale:t,allowChangeEvent:r});const h=o.getBoundingClientRect();if(i=l(i,h.width),n=l(n,h.height),"content"===s)i+=this.x,n+=this.y;else{const t=this._positioningEl.getBoundingClientRect(),e=this.getBoundingClientRect();i-=t.left-e.left,n-=t.top-e.top}this._applyChange({allowChangeEvent:r,originX:i,originY:n,scaleDiff:t/this.scale})}setTransform(t={}){const{scale:e=this.scale,allowChangeEvent:i=!1}=t;let{x:n=this.x,y:s=this.y}=t;if(!this._positioningEl)return void this._updateTransform(e,n,s,i);const r=this.getBoundingClientRect(),o=this._positioningEl.getBoundingClientRect();if(!r.width||!r.height)return void this._updateTransform(e,n,s,i);let h=u();h.x=o.left-r.left,h.y=o.top-r.top;let a=u();a.x=o.width+h.x,a.y=o.height+h.y;const l=g().translate(n,s).scale(e).multiply(this._transform.inverse());h=h.matrixTransform(l),a=a.matrixTransform(l),h.x>r.width?n+=r.width-h.x:a.x<0&&(n+=-a.x),h.y>r.height?s+=r.height-h.y:a.y<0&&(s+=-a.y),this._updateTransform(e,n,s,i)}_updateTransform(t,e,i,n){let s=t;if(!((s=Math.round(100*(s+Number.EPSILON))/100)<this.minScale)&&!(s>this.maxScale)&&(s!==this.scale||e!==this.x||i!==this.y)&&(this._transform.e=e,this._transform.f=i,this._transform.d=this._transform.a=s,this._reportMoving&&n&&this.indicateMoving(),this.style.setProperty("--x",this.x+"px"),this.style.setProperty("--y",this.y+"px"),this.style.setProperty("--scale",this.scale+""),n)){const t=new Event("change",{bubbles:!0});this.dispatchEvent(t)}}_stageElChange(){this._positioningEl=void 0,0!==this.children.length&&(this._positioningEl=this.children[0],this.children.length>1&&console.warn("<pinch-zoom> must not have more than one child."),this.setTransform({allowChangeEvent:!0}))}_onWheel(t){if(!this._positioningEl)return;t.preventDefault();const e=this._positioningEl.getBoundingClientRect();let{deltaY:i}=t;const{ctrlKey:n,deltaMode:s}=t;1===s&&(i*=15);const r=1-i/(n?100:300);this._applyChange({scaleDiff:r,originX:t.clientX-e.left,originY:t.clientY-e.top,allowChangeEvent:!0}),this._reportMoving&&this.stopIndicatingMoving()}indicateMoving(){0==this._moving&&(this._moving=!0,this.classList.add("moving"))}_onPointerMove(t,e){if(!this._positioningEl)return;const i=this._positioningEl.getBoundingClientRect(),n=a(t[0],t[1]),s=a(e[0],e[1]),r=n.clientX-i.left,o=n.clientY-i.top,l=h(t[0],t[1]),c=h(e[0],e[1]),d=l?c/l:1;this._applyChange({originX:r,originY:o,scaleDiff:d,panX:s.clientX-n.clientX,panY:s.clientY-n.clientY,allowChangeEvent:!0})}_applyChange(t={}){const{panX:e=0,panY:i=0,originX:n=0,originY:s=0,scaleDiff:r=1,allowChangeEvent:o=!1}=t,h=g().translate(e,i).translate(n,s).translate(this.x,this.y).scale(r).translate(-n,-s).scale(this.scale);this.setTransform({allowChangeEvent:o,scale:h.a,x:h.e,y:h.f})}}customElements.define("pinch-zoom",_)}()}();
