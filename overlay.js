"use strict";(()=>{var R="bill0d41-host";var d={clients:"bill:clients",entries:"bill:entries",timer:"bill:timer",settings:"bill:settings",license:"zovo_license"};var G=1e3,k=36e5;var w=100,T=1e7,A=60;var q=120;function W(e,t,n){try{return new Intl.NumberFormat(n,{style:"currency",currency:t}).format(e/100)}catch{return`${(e/100).toFixed(2)} ${t}`}}function K(e){let t=Math.max(0,Math.floor(e/1e3)),n=Math.floor(t/3600),i=Math.floor(t%3600/60),o=t%60,m=g=>String(g).padStart(2,"0");return`${n}:${m(i)}:${m(o)}`}function V(e,t){return e.accumulatedMs+Math.max(0,t-e.startedAt)}function Z(e,t){return Math.round(e*t/k)}function E(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function P(e,t){if(typeof e!="string")return"";let n=e.replace(/[\x00-\x1F\x7F-\x9F]/g,"");return n.length>t?n.slice(0,t):n}function de(e){if(typeof e!="string")return null;let t=P(e,A).trim();return t.length>=1?t:null}function Q(e){if(typeof e!="string")return null;let t=e.trim();return t.length<1||t.length>64||/[\x00-\x1F\x7F-\x9F]/.test(t)?null:t}function J(e){return typeof e!="number"||!Number.isInteger(e)?null:e>=0&&e<=T?e:null}function ee(e){if(typeof e!="string"||!/^[A-Z]{3}$/.test(e))return null;try{return new Intl.NumberFormat("en",{style:"currency",currency:e}),e}catch{return null}}function te(e){return typeof e!="string"?null:/^#[0-9a-f]{6}$/.test(e)?e:null}function _(e){return typeof e!="number"||!Number.isInteger(e)||e<0?null:Number.isSafeInteger(e)?e:null}function ne(e){if(!E(e))return null;let t=Q(e.id),n=de(e.name),i=J(e.rateCentsPerHour),o=ee(e.currency),m=te(e.color),g=_(e.createdAt);return t===null||n===null||i===null||o===null||m===null||g===null?null:{id:t,name:n,rateCentsPerHour:i,currency:o,color:m,createdAt:g}}function re(e){if(!Array.isArray(e))return[];let t=[],n=e.length>w?e.slice(0,w):e;for(let i of n){let o=ne(i);o!==null&&t.push(o)}return t}function oe(e){if(!E(e))return null;let t=Q(e.clientId),n=_(e.startedAt),i=_(e.accumulatedMs);return t===null||n===null||i===null?null:{clientId:t,startedAt:n,accumulatedMs:i}}var pe=new Set(["none","6min","15min"]);function ie(){return{rounding:"none",overlayPos:null,invoiceSender:""}}function I(e){let t=ie();if(!E(e))return t;if(typeof e.rounding=="string"&&pe.has(e.rounding)&&(t.rounding=e.rounding),E(e.overlayPos)){let{x:n,y:i}=e.overlayPos;typeof n=="number"&&Number.isFinite(n)&&typeof i=="number"&&Number.isFinite(i)&&(t.overlayPos={x:n,y:i})}return typeof e.invoiceSender=="string"&&(t.invoiceSender=P(e.invoiceSender,q)),t}function fe(e){let t=e instanceof Error?e.message:String(e);return/quota/i.test(t)}function me(e){return fe(e)?{error:"quota-exceeded"}:{error:"storage-failure"}}async function N(e){try{return(await chrome.storage.local.get(e))[e]}catch{return}}async function ge(e,t){try{return await chrome.storage.local.set({[e]:t}),{ok:!0}}catch(n){return me(n)}}function le(e){let t=(n,i)=>{i==="local"&&e(n)};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}async function v(){return re(await N(d.clients))}async function L(){return oe(await N(d.timer))}async function H(){return I(await N(d.settings))}var se=Promise.resolve();function xe(e){let t=se.then(e);return se=t.then(()=>{},()=>{}),t}async function ae(e){return xe(async()=>{let t=await H(),n=I({...t,...e});return ge(d.settings,n)})}function b(e,t){e.textContent=t}function D(e,t=""){try{let n=chrome.i18n.getMessage(e);if(n!=="")return n}catch{}return t}var O=`
:host {
  all: initial;
}

.bill0d41-card {
  /* The mini money ticker. Fixed size context: host is position:fixed with
     inline left/top; this card fills the host. ~220px wide mini card. */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 220px;
  min-height: 56px;
  padding: 10px 10px 10px 12px;
  border-radius: 12px;
  border: 1px solid #e8e8e3;
  background: #ffffff;
  color: #1c1e10;
  box-shadow: 0 1px 3px rgba(51, 54, 14, 0.14), 0 8px 24px -8px rgba(51, 54, 14, 0.28);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none; /* pointer drag owns the gesture */
  transition: box-shadow 150ms ease-in-out;
}
.bill0d41-card--dragging {
  cursor: grabbing;
  box-shadow: 0 2px 6px rgba(51, 54, 14, 0.18), 0 16px 36px -10px rgba(51, 54, 14, 0.36);
}

.bill0d41-dot {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #c4d039; /* hue-65 primaryDark until TS paints the client color */
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.14);
}

.bill0d41-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.bill0d41-amount {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #1c1e10;
  white-space: nowrap;
}

.bill0d41-name {
  font-size: 11px;
  font-weight: 600;
  color: #565a44;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bill0d41-elapsed {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  color: #565a44;
  white-space: nowrap;
}

/* Idle state (no bill:timer record): honest, does NOT auto-remove. */
.bill0d41-idle {
  font-size: 12px;
  font-weight: 600;
  color: #565a44;
  white-space: nowrap;
}
.bill0d41-card--idle .bill0d41-dot {
  background: transparent;
  box-shadow: inset 0 0 0 2px #cfcfc4;
}

.bill0d41-close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #565a44;
  font: inherit;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
}
.bill0d41-close:hover {
  background: #fafbee; /* hue-65 primary50 */
  color: #33360e;      /* hue-65 on-primary dark olive */
}
.bill0d41-close:focus-visible {
  outline: 2px solid #475ed1; /* hue-65 accent */
  outline-offset: 1px;
}
.bill0d41-close svg {
  width: 12px;
  height: 12px;
  display: block;
}

/* Dark pages: opaque dark card, same hue-65 tint family. */
@media (prefers-color-scheme: dark) {
  .bill0d41-card {
    background: #1a1c0f;
    border-color: #2e3320;
    color: #f2f5e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5), 0 8px 24px -8px rgba(0, 0, 0, 0.65);
  }
  .bill0d41-card--dragging {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.55), 0 16px 36px -10px rgba(0, 0, 0, 0.75);
  }
  .bill0d41-amount {
    color: #f2f5e0;
  }
  .bill0d41-name,
  .bill0d41-elapsed,
  .bill0d41-idle {
    color: #b3b8a0;
  }
  .bill0d41-card--idle .bill0d41-dot {
    box-shadow: inset 0 0 0 2px #3d4226;
  }
  .bill0d41-close {
    color: #b3b8a0;
  }
  .bill0d41-close:hover {
    background: #23260f;
    color: #dce48b;
  }
  .bill0d41-close:focus-visible {
    outline-color: #dce48b;
  }
}

/* The overlay never animates under reduced-motion (fleet law). */
@media (prefers-reduced-motion: reduce) {
  .bill0d41-card,
  .bill0d41-card * {
    transition: none !important;
    animation: none !important;
  }
}
`;var M=globalThis;M.__bill0d41Overlay===void 0&&(M.__bill0d41Overlay={injectedAt:Date.now()},Ee().catch(()=>{try{document.getElementById(R)?.remove()}catch{}M.__bill0d41Overlay=void 0}));var p=8,ye=4,be=220,he=56,S=(e,t,n)=>Math.min(Math.max(e,t),Math.max(t,n));function f(e,t){let n=document.createElement(e);return n.className=t,n}function Ce(e){try{let t=new CSSStyleSheet;t.replaceSync(O),e.adoptedStyleSheets=[t]}catch{let t=document.createElement("style");t.textContent=O,e.appendChild(t)}}function we(e){let t="http://www.w3.org/2000/svg";e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.setAttribute("stroke","currentColor"),e.setAttribute("stroke-width","2.5"),e.setAttribute("stroke-linecap","round");let n=document.createElementNS(t,"path");n.setAttribute("d","M6 6l12 12M18 6L6 18"),e.appendChild(n)}async function Ee(){let[e,t,n]=await Promise.all([L(),v(),H()]),i={timer:e,clients:t},o=document.createElement("div");o.id=R,o.style.position="fixed",o.style.zIndex="2147483647";let m=n.overlayPos?.x??window.innerWidth-236,g=n.overlayPos?.y??window.innerHeight-96;o.style.left=`${S(m,p,window.innerWidth-be-p)}px`,o.style.top=`${S(g,p,window.innerHeight-he-p)}px`,document.documentElement.appendChild(o);let F=o.attachShadow({mode:"closed"});Ce(F);let l=f("div","bill0d41-card");l.setAttribute("role","status"),l.setAttribute("aria-live","off");let h=f("div","bill0d41-dot"),u=f("div","bill0d41-body"),x=f("button","bill0d41-close");x.type="button",x.setAttribute("aria-label",D("ovlCloseAria","Close overlay"));let $=document.createElementNS("http://www.w3.org/2000/svg","svg");we($),x.appendChild($),l.appendChild(h),l.appendChild(u),l.appendChild(x),F.appendChild(l);let s={card:l,dot:h,body:u,close:x,amount:null,name:null,elapsed:null,idle:null},U=()=>{for(;u.firstChild!==null;)u.removeChild(u.firstChild);s.amount=null,s.name=null,s.elapsed=null,s.idle=null;let r=z();i.timer!==null&&r!==void 0?(l.classList.remove("bill0d41-card--idle"),h.style.backgroundColor=r.color,s.amount=f("div","bill0d41-amount"),s.name=f("div","bill0d41-name"),s.elapsed=f("div","bill0d41-elapsed"),b(s.name,r.name),u.appendChild(s.amount),u.appendChild(s.name),u.appendChild(s.elapsed),B()):(l.classList.add("bill0d41-card--idle"),h.style.backgroundColor="",s.idle=f("div","bill0d41-idle"),b(s.idle,D("ovlIdle","No timer running")),u.appendChild(s.idle))},z=()=>{let r=i.timer;if(r!==null)return i.clients.find(c=>c.id===r.clientId)},B=()=>{let r=z();if(i.timer===null||r===void 0)return;let c=V(i.timer,Date.now());s.amount!==null&&b(s.amount,W(Z(c,r.rateCentsPerHour),r.currency)),s.elapsed!==null&&b(s.elapsed,K(c))},y=null,X=()=>{y===null&&(y=window.setInterval(B,G))},Y=()=>{y!==null&&(window.clearInterval(y),y=null)};window.addEventListener("pagehide",Y),window.addEventListener("pageshow",()=>{o.isConnected&&X()});let ce=le(r=>{!(d.timer in r)&&!(d.clients in r)||(async()=>{let[c,C]=await Promise.all([L(),v()]);i.timer=c,i.clients=C,U()})()}),a=null;l.addEventListener("pointerdown",r=>{r.button===0&&(r.target instanceof Element&&r.target.closest(".bill0d41-close")!==null||(l.setPointerCapture(r.pointerId),a={pointerId:r.pointerId,startX:r.clientX,startY:r.clientY,baseLeft:o.offsetLeft,baseTop:o.offsetTop,active:!1}))}),l.addEventListener("pointermove",r=>{if(a===null||r.pointerId!==a.pointerId)return;let c=r.clientX-a.startX,C=r.clientY-a.startY;if(!a.active){if(Math.hypot(c,C)<ye)return;a.active=!0,l.classList.add("bill0d41-card--dragging")}o.style.left=`${S(a.baseLeft+c,p,window.innerWidth-o.offsetWidth-p)}px`,o.style.top=`${S(a.baseTop+C,p,window.innerHeight-o.offsetHeight-p)}px`});let j=r=>{if(a===null||r.pointerId!==a.pointerId)return;let c=a.active;a=null,l.classList.remove("bill0d41-card--dragging"),c&&ae({overlayPos:{x:o.offsetLeft,y:o.offsetTop}})};l.addEventListener("pointerup",j),l.addEventListener("pointercancel",j),x.addEventListener("click",()=>{Y(),ce(),o.remove(),M.__bill0d41Overlay=void 0}),U(),X()}})();
