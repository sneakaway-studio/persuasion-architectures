var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function l(e){e.forEach(t)}function i(e){return"function"==typeof e}function o(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(t,n,l){t.$$.on_destroy.push(function(t,...n){if(null==t){for(const e of n)e(void 0);return e}const l=t.subscribe(...n);return l.unsubscribe?()=>l.unsubscribe():l}(n,l))}function s(e,t){e.appendChild(t)}function r(e,t,n){e.insertBefore(t,n||null)}function c(e){e.parentNode&&e.parentNode.removeChild(e)}function d(e){return document.createElement(e)}function u(e){return document.createTextNode(e)}function m(){return u(" ")}function g(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function f(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function h(e,t,n,l){null==n?e.style.removeProperty(t):e.style.setProperty(t,n,l?"important":"")}let p;function v(e){p=e}const $=[],_=[];let b=[];const y=[],w=Promise.resolve();let R=!1;function x(e){b.push(e)}const z=new Set;let j=0;function k(){if(0!==j)return;const e=p;do{try{for(;j<$.length;){const e=$[j];j++,v(e),C(e.$$)}}catch(e){throw $.length=0,j=0,e}for(v(null),$.length=0,j=0;_.length;)_.pop()();for(let e=0;e<b.length;e+=1){const t=b[e];z.has(t)||(z.add(t),t())}b.length=0}while($.length);for(;y.length;)y.pop()();R=!1,z.clear(),v(e)}function C(e){if(null!==e.fragment){e.update(),l(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(x)}}const M=new Set;function L(e,t){e&&e.i&&(M.delete(e),e.i(t))}function q(e,t,n,l){if(e&&e.o){if(M.has(e))return;M.add(e),undefined.c.push((()=>{M.delete(e),l&&(n&&e.d(1),l())})),e.o(t)}else l&&l()}function E(e){return void 0!==e?.length?e:Array.from(e)}function A(e){e&&e.c()}function O(e,n,o){const{fragment:a,after_update:s}=e.$$;a&&a.m(n,o),x((()=>{const n=e.$$.on_mount.map(t).filter(i);e.$$.on_destroy?e.$$.on_destroy.push(...n):l(n),e.$$.on_mount=[]})),s.forEach(x)}function S(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];b.forEach((l=>-1===e.indexOf(l)?t.push(l):n.push(l))),n.forEach((e=>e())),b=t}(n.after_update),l(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function B(e,t){-1===e.$$.dirty[0]&&($.push(e),R||(R=!0,w.then(k)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function G(t,i,o,a,s,r,d=null,u=[-1]){const m=p;v(t);const g=t.$$={fragment:null,ctx:[],props:r,update:e,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i.context||(m?m.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:i.target||m.$$.root};d&&d(g.root);let f=!1;if(g.ctx=o?o(t,i.props||{},((e,n,...l)=>{const i=l.length?l[0]:n;return g.ctx&&s(g.ctx[e],g.ctx[e]=i)&&(!g.skip_bound&&g.bound[e]&&g.bound[e](i),f&&B(t,e)),n})):[],g.update(),f=!0,l(g.before_update),g.fragment=!!a&&a(g.ctx),i.target){if(i.hydrate){const e=function(e){return Array.from(e.childNodes)}(i.target);g.fragment&&g.fragment.l(e),e.forEach(c)}else g.fragment&&g.fragment.c();i.intro&&L(t.$$.fragment),O(t,i.target,i.anchor),k()}v(m)}class N{$$=void 0;$$set=void 0;$destroy(){S(this,1),this.$destroy=e}$on(t,n){if(!i(n))return e;const l=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return l.push(n),()=>{const e=l.indexOf(n);-1!==e&&l.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function T(t){let n,l,i;return{c(){n=d("div"),n.innerHTML='<div class="row header svelte-lidqbq"><h2 class="svelte-lidqbq">Celebrity Matching Game</h2></div>',l=m(),i=d("div"),i.innerHTML='<div class="row"><h4 class="svelte-lidqbq">Match the celebrity on the magazine cover to the celebrity pictured in\n      the streets!</h4></div>',f(n,"class","container"),f(i,"class","container d-none d-md-block text-center")},m(e,t){r(e,n,t),r(e,l,t),r(e,i,t)},p:e,i:e,o:e,d(e){e&&(c(n),c(l),c(i))}}}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");class H extends N{constructor(e){super(),G(this,e,null,T,o,{})}}const P=[];let J=function(t,n=e){let l;const i=new Set;function a(e){if(o(t,e)&&(t=e,l)){const e=!P.length;for(const e of i)e[1](),P.push(e,t);if(e){for(let e=0;e<P.length;e+=2)P[e][0](P[e+1]);P.length=0}}}function s(e){a(e(t))}return{set:a,update:s,subscribe:function(o,r=e){const c=[o,r];return i.add(c),1===i.size&&(l=n(a,s)||e),o(t),()=>{i.delete(c),0===i.size&&l&&(l(),l=null)}}}}([{id:"01",img_url:"images/anniston_real.jpeg",title:"Jennifer Anniston - Real",isRevealed:!1,matched:!1},{id:"11",img_url:"images/anniston_magazine.jpg",title:"Jennifer Anniston - Magazine",isRevealed:!1,matched:!1},{id:"02",img_url:"images/gaga_real.jpeg",title:"Gaga - Real",isRevealed:!1,matched:!1},{id:"12",img_url:"images/gaga_magazine.jpeg",title:"Gaga - Magazine",isRevealed:!1,matched:!1},{id:"03",img_url:"images/gomez_real.jpeg",title:"Selena Gomez - Real",isRevealed:!1,matched:!1},{id:"13",img_url:"images/gomez_magazine.jpeg",title:"Selena Gomez - Magazine",isRevealed:!1,matched:!1},{id:"04",img_url:"images/lively_real.jpeg",title:"Blake Lively - Real",isRevealed:!1,matched:!1},{id:"14",img_url:"images/lively_magazine.jpeg",title:"Blake Lively - Magazine",isRevealed:!1,matched:!1},{id:"05",img_url:"images/lohan_real.jpeg",title:"Lindsey Lohan - Real",isRevealed:!1,matched:!1},{id:"15",img_url:"images/lohan_magazine.jpeg",title:"Lindsey Lohan - Magazine",isRevealed:!1,matched:!1},{id:"06",img_url:"images/morgan_real.jpg",title:"Morgan - Real",isRevealed:!1,matched:!1},{id:"16",img_url:"images/morgan_magazine.jpeg",title:"Morgan - Magazine",isRevealed:!1,matched:!1},{id:"07",img_url:"images/underwood_real.jpeg",title:"Underwood - Real",isRevealed:!1,matched:!1},{id:"17",img_url:"images/underwood_magazine.jpeg",title:"Underwood - Magazine",isRevealed:!1,matched:!1},{id:"08",img_url:"images/witherspoon_real.jpeg",title:"Witherspoon - Real",isRevealed:!1,matched:!1},{id:"18",img_url:"images/witherspoon_magazine.jpeg",title:"Witherspoon - Magazine",isRevealed:!1,matched:!1}]);function U(e){let t,n,o,a,u,h,p,v,$,_,b;return{c(){t=d("div"),n=d("div"),o=d("h2"),o.textContent="Congratulations!",a=m(),u=d("p"),u.textContent="You successfully completed the game!",h=m(),p=d("button"),p.textContent="Close",v=m(),$=d("button"),$.textContent="Restart Game",f(o,"class","svelte-haablb"),f(u,"class","svelte-haablb"),f(p,"class","svelte-haablb"),f($,"class","svelte-haablb"),f(n,"class","content svelte-haablb"),f(t,"class","overlay svelte-haablb")},m(l,c){r(l,t,c),s(t,n),s(n,o),s(n,a),s(n,u),s(n,h),s(n,p),s(n,v),s(n,$),_||(b=[g(p,"click",(function(){i(e[2])&&e[2].apply(this,arguments)})),g($,"click",(function(){i(e[1])&&e[1].apply(this,arguments)}))],_=!0)},p(t,n){e=t},d(e){e&&c(t),_=!1,l(b)}}}function W(t){let n,l=t[0]&&U(t);return{c(){l&&l.c(),n=u("")},m(e,t){l&&l.m(e,t),r(e,n,t)},p(e,[t]){e[0]?l?l.p(e,t):(l=U(e),l.c(),l.m(n.parentNode,n)):l&&(l.d(1),l=null)},i:e,o:e,d(e){e&&c(n),l&&l.d(e)}}}function Y(e,t,n){let{gameCompleted:l=!1}=t,{resetBoard:i}=t,{closeOnly:o}=t;return e.$$set=e=>{"gameCompleted"in e&&n(0,l=e.gameCompleted),"resetBoard"in e&&n(1,i=e.resetBoard),"closeOnly"in e&&n(2,o=e.closeOnly)},[l,i,o]}class D extends N{constructor(e){super(),G(this,e,Y,W,o,{gameCompleted:0,resetBoard:1,closeOnly:2})}}function F(e,t,n){const l=e.slice();return l[11]=t[n],l}function I(e){let t;return{c(){t=d("div"),f(t,"class","image svelte-1cl3qwp"),h(t,"background-image","url("+e[2][e[11]].img_url+")"),h(t,"width","100%")},m(e,n){r(e,t,n)},p(e,n){6&n&&h(t,"background-image","url("+e[2][e[11]].img_url+")")},d(e){e&&c(t)}}}function K(e){let t,n,l,i,o,a,u,h,p=e[2][e[11]].isRevealed&&I(e);function v(){return e[6](e[11])}return{c(){t=d("div"),n=d("button"),l=d("div"),p&&p.c(),o=m(),f(l,"class",i="card "+(e[2][e[11]].isRevealed?"revealed":"")+" "+(e[2][e[11]].matched?"matched":"")+" mb-1 svelte-1cl3qwp"),f(n,"class","btn btn-link p-1 no-border svelte-1cl3qwp"),f(t,"class",a="col-12 col-sm-4 col-md-3 col-lg-3 col"+e[2][e[11]].id+" d-flex justify-content-center g-0 colClass svelte-1cl3qwp")},m(e,i){r(e,t,i),s(t,n),s(n,l),p&&p.m(l,null),s(t,o),u||(h=g(n,"click",v),u=!0)},p(n,o){(e=n)[2][e[11]].isRevealed?p?p.p(e,o):(p=I(e),p.c(),p.m(l,null)):p&&(p.d(1),p=null),6&o&&i!==(i="card "+(e[2][e[11]].isRevealed?"revealed":"")+" "+(e[2][e[11]].matched?"matched":"")+" mb-1 svelte-1cl3qwp")&&f(l,"class",i),6&o&&a!==(a="col-12 col-sm-4 col-md-3 col-lg-3 col"+e[2][e[11]].id+" d-flex justify-content-center g-0 colClass svelte-1cl3qwp")&&f(t,"class",a)},d(e){e&&c(t),p&&p.d(),u=!1,h()}}}function Q(e){let t,n,l,i,o;t=new D({props:{gameCompleted:e[0],resetBoard:e[4],closeOnly:e[5]}});let a=E(e[1]),u=[];for(let t=0;t<a.length;t+=1)u[t]=K(F(e,a,t));return{c(){A(t.$$.fragment),n=m(),l=d("div"),i=d("div");for(let e=0;e<u.length;e+=1)u[e].c();f(i,"class","row justify-content-center"),f(l,"class","container-fluid")},m(e,a){O(t,e,a),r(e,n,a),r(e,l,a),s(l,i);for(let e=0;e<u.length;e+=1)u[e]&&u[e].m(i,null);o=!0},p(e,[n]){const l={};if(1&n&&(l.gameCompleted=e[0]),t.$set(l),14&n){let t;for(a=E(e[1]),t=0;t<a.length;t+=1){const l=F(e,a,t);u[t]?u[t].p(l,n):(u[t]=K(l),u[t].c(),u[t].m(i,null))}for(;t<u.length;t+=1)u[t].d(1);u.length=a.length}},i(e){o||(L(t.$$.fragment,e),o=!0)},o(e){q(t.$$.fragment,e),o=!1},d(e){e&&(c(n),c(l)),S(t,e),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}(u,e)}}}function V(e){let t=document.querySelectorAll(".colClass");e.matches?t.forEach(((e,t)=>{e.classList.remove("col-6"),e.classList.add("col-12")})):t.forEach(((e,t)=>{e.classList.add("col-6"),e.classList.remove("col-12")}))}function X(e,t,n){let l,i;a(e,J,(e=>n(2,i=e)));let o=[],s=0,r=!1;function c(e){o.includes(e)||(J.update((t=>t.map((t=>t.id===e?{...t,isRevealed:!t.isRevealed}:t)))),console.log("tile clicked logic.svelte"),o.push(e),2===o.length&&function(e){const[t,l]=e,i=t.toString().slice(1),a=l.toString().slice(1);i===a?(console.log("Match found!"),J.update((e=>e.map((e=>e.id===t||e.id===l?{...e,matched:!0}:e)))),s+=1,8===s&&n(0,r=!0)):(console.log("No match. Hiding tiles."),setTimeout((()=>{J.update((e=>e.map((e=>e.id===t||e.id===l?{...e,isRevealed:!1}:e))))}),500));o=[]}(o))}var d=window.matchMedia("(max-width: 400px)");V(d),d.addEventListener("change",(function(){V(d)}));return n(1,l=Array.from({length:16},((e,t)=>t)).sort((()=>Math.random()-.5))),[r,l,i,c,function(){o=[],s=0,n(0,r=!1),J.update((e=>e.map((e=>({...e,isRevealed:!1,matched:!1})))))},function(){n(0,r=!1)},e=>c(i[e].id)]}class Z extends N{constructor(e){super(),G(this,e,X,Q,o,{})}}function ee(t){let n,l,i,o,a;return n=new H({}),o=new Z({}),{c(){A(n.$$.fragment),l=m(),i=d("main"),A(o.$$.fragment),f(i,"class","svelte-1yegch1")},m(e,t){O(n,e,t),r(e,l,t),r(e,i,t),O(o,i,null),a=!0},p:e,i(e){a||(L(n.$$.fragment,e),L(o.$$.fragment,e),a=!0)},o(e){q(n.$$.fragment,e),q(o.$$.fragment,e),a=!1},d(e){e&&(c(l),c(i)),S(n,e),S(o)}}}return new class extends N{constructor(e){super(),G(this,e,null,ee,o,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
