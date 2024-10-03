var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function s(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let i,r;function l(e,t){return e===t||(i||(i=document.createElement("a")),i.href=t,e===i.href)}function c(t,n,o){t.$$.on_destroy.push(function(t,...n){if(null==t){for(const e of n)e(void 0);return e}const o=t.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}function d(e,t){e.appendChild(t)}function u(e,t,n){e.insertBefore(t,n||null)}function f(e){e.parentNode&&e.parentNode.removeChild(e)}function h(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function m(){return p(" ")}function g(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function b(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function y(e,t){t=""+t,e.data!==t&&(e.data=t)}function v(e,t,n,o){null==n?e.style.removeProperty(t):e.style.setProperty(t,n,o?"important":"")}function $(e){r=e}function w(){if(!r)throw new Error("Function called outside component initialization");return r}function x(e){w().$$.on_mount.push(e)}const k=[],z=[];let _=[];const C=[],E=Promise.resolve();let S=!1;function j(e){_.push(e)}const T=new Set;let L=0;function M(){if(0!==L)return;const e=r;do{try{for(;L<k.length;){const e=k[L];L++,$(e),A(e.$$)}}catch(e){throw k.length=0,L=0,e}for($(null),k.length=0,L=0;z.length;)z.pop()();for(let e=0;e<_.length;e+=1){const t=_[e];T.has(t)||(T.add(t),t())}_.length=0}while(k.length);for(;C.length;)C.pop()();S=!1,T.clear(),$(e)}function A(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(j)}}const H=new Set;let q;function B(e,t){e&&e.i&&(H.delete(e),e.i(t))}function Y(e,t,n,o){if(e&&e.o){if(H.has(e))return;H.add(e),q.c.push((()=>{H.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}else o&&o()}function O(e){return void 0!==e?.length?e:Array.from(e)}function P(e,t){e.d(1),t.delete(e.key)}function N(e){e&&e.c()}function F(e,n,a){const{fragment:i,after_update:r}=e.$$;i&&i.m(n,a),j((()=>{const n=e.$$.on_mount.map(t).filter(s);e.$$.on_destroy?e.$$.on_destroy.push(...n):o(n),e.$$.on_mount=[]})),r.forEach(j)}function I(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];_.forEach((o=>-1===e.indexOf(o)?t.push(o):n.push(o))),n.forEach((e=>e())),_=t}(n.after_update),o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function R(e,t){-1===e.$$.dirty[0]&&(k.push(e),S||(S=!0,E.then(M)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function D(t,s,a,i,l,c,d=null,u=[-1]){const h=r;$(t);const p=t.$$={fragment:null,ctx:[],props:c,update:e,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(h?h.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:s.target||h.$$.root};d&&d(p.root);let m=!1;if(p.ctx=a?a(t,s.props||{},((e,n,...o)=>{const s=o.length?o[0]:n;return p.ctx&&l(p.ctx[e],p.ctx[e]=s)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](s),m&&R(t,e)),n})):[],p.update(),m=!0,o(p.before_update),p.fragment=!!i&&i(p.ctx),s.target){if(s.hydrate){const e=function(e){return Array.from(e.childNodes)}(s.target);p.fragment&&p.fragment.l(e),e.forEach(f)}else p.fragment&&p.fragment.c();s.intro&&B(t.$$.fragment),F(t,s.target,s.anchor),M()}$(h)}class W{$$=void 0;$$set=void 0;$destroy(){I(this,1),this.$destroy=e}$on(t,n){if(!s(n))return e;const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(n),()=>{const e=o.indexOf(n);-1!==e&&o.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function G(t){let n;return{c(){n=h("header"),n.innerHTML='<h1 class="svelte-19pe6zz">How Does Social Proof Affect Your Life?</h1>',b(n,"class","svelte-19pe6zz")},m(e,t){u(e,n,t)},p:e,i:e,o:e,d(e){e&&f(n)}}}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");class J extends W{constructor(e){super(),D(this,e,null,G,a,{})}}const V=[];function K(t,n=e){let o;const s=new Set;function i(e){if(a(t,e)&&(t=e,o)){const e=!V.length;for(const e of s)e[1](),V.push(e,t);if(e){for(let e=0;e<V.length;e+=2)V[e][0](V[e+1]);V.length=0}}}function r(e){i(e(t))}return{set:i,update:r,subscribe:function(a,l=e){const c=[a,l];return s.add(c),1===s.size&&(o=n(i,r)||e),a(t),()=>{s.delete(c),0===s.size&&o&&(o(),o=null)}}}}const Q=K(0),U=K({});function X(e,t,n){const o=e.slice();return o[6]=t[n],o}function Z(e,t){let n,o,s,a,i,r,l,c,v,$,w,x=t[6].text+"";function k(...e){return t[4](t[6],...e)}return{key:e,first:null,c(){n=h("div"),o=h("input"),i=m(),r=h("label"),l=p(x),v=m(),b(o,"type","checkbox"),b(o,"id",s="item"+t[6].id),o.checked=a=t[2][t[6].id]||!1,o.disabled=t[1],b(o,"class","svelte-hwdjw3"),b(r,"for",c="item"+t[6].id),b(r,"class","svelte-hwdjw3"),b(n,"class","checkbox-item svelte-hwdjw3"),this.first=n},m(e,t){u(e,n,t),d(n,o),d(n,i),d(n,r),d(r,l),d(n,v),$||(w=g(o,"change",k),$=!0)},p(e,n){t=e,1&n&&s!==(s="item"+t[6].id)&&b(o,"id",s),5&n&&a!==(a=t[2][t[6].id]||!1)&&(o.checked=a),2&n&&(o.disabled=t[1]),1&n&&x!==(x=t[6].text+"")&&y(l,x),1&n&&c!==(c="item"+t[6].id)&&b(r,"for",c)},d(e){e&&f(n),$=!1,w()}}}function ee(t){let n,s=[],a=new Map,i=O(t[0]);const r=e=>e[6].id;for(let e=0;e<i.length;e+=1){let n=X(t,i,e),o=r(n);a.set(o,s[e]=Z(o,n))}return{c(){n=h("div");for(let e=0;e<s.length;e+=1)s[e].c();b(n,"class","table-body svelte-hwdjw3")},m(e,t){u(e,n,t);for(let e=0;e<s.length;e+=1)s[e]&&s[e].m(n,null)},p(e,[t]){15&t&&(i=O(e[0]),s=function(e,t,n,s,a,i,r,l,c,d,u,f){let h=e.length,p=i.length,m=h;const g={};for(;m--;)g[e[m].key]=m;const b=[],y=new Map,v=new Map,$=[];for(m=p;m--;){const e=f(a,i,m),o=n(e);let l=r.get(o);l?s&&$.push((()=>l.p(e,t))):(l=d(o,e),l.c()),y.set(o,b[m]=l),o in g&&v.set(o,Math.abs(m-g[o]))}const w=new Set,x=new Set;function k(e){B(e,1),e.m(l,u),r.set(e.key,e),u=e.first,p--}for(;h&&p;){const t=b[p-1],n=e[h-1],o=t.key,s=n.key;t===n?(u=t.first,h--,p--):y.has(s)?!r.has(o)||w.has(o)?k(t):x.has(s)?h--:v.get(o)>v.get(s)?(x.add(o),k(t)):(w.add(s),h--):(c(n,r),h--)}for(;h--;){const t=e[h];y.has(t.key)||c(t,r)}for(;p;)k(b[p-1]);return o($),b}(s,t,r,1,e,i,a,n,P,Z,null,X))},i:e,o:e,d(e){e&&f(n);for(let e=0;e<s.length;e+=1)s[e].d()}}}function te(e,t,n){let o,{options:s=[]}=t,{disabled:a=!1}=t,i={};var r;function l(e,t){const o=t.target.checked;n(2,i[e.id]=o,i),U.update((t=>{const n={...t,[e.id]:o},s=Object.values(n).filter(Boolean).length;return Q.set(s),n}))}x((()=>{o=U.subscribe((e=>{n(2,i=e)}))})),r=()=>{o()},w().$$.on_destroy.push(r);return e.$$set=e=>{"options"in e&&n(0,s=e.options),"disabled"in e&&n(1,a=e.disabled)},[s,a,i,l,(e,t)=>!a&&l(e,t)]}class ne extends W{constructor(e){super(),D(this,e,te,ee,a,{options:0,disabled:1})}}const oe={category1:[{text:"Followed a trend just because a lot of people were doing it",id:"11"},{text:"Watched a movie/tv show everyone had been talking about",id:"12"},{text:"Recreated a recipe have seen a lot of people try",id:"13"},{text:"Visited a not-so-exciting but trendy place",id:"14"},{text:"Watched a video just because it was trending",id:"15"},{text:'Bought an item because it was a "best-seller" or "fastest growing"',id:"16"},{text:'Watched a movie/tv show that appeared in the "most popular" list',id:"17"},{text:'Bought an item from the "recommended to me" section',id:"18"}],category2:[{text:"Filtered out items with ratings of three stars or less",id:"21"},{text:"Chose to buy something online based on the number and quality of its reviews",id:"22"},{text:"Considered a restaurant/store good because it always had a line outside the door",id:"23"},{text:"Liked a post just because it already had a lot of likes",id:"24"},{text:"Bought something because it had many likes",id:"25"},{text:"Thought something was worth buying because it was almost sold out",id:"26"},{text:"Bought an item in the stores many people were recommending",id:"27"},{text:"Signed up for a service based on the number of people already using it",id:"28"}],category3:[{text:"Thanked a bus driver after hearing most of the other passengers doing the same",id:"31"},{text:"Stayed quiet about a concerning situation in a public place because no one else was saying anything",id:"32"},{text:"Joined a line even though did not know what it was for",id:"33"},{text:"Clapped at a live show following the rest of the audience's example",id:"34"},{text:"Did not comment an interesting post because no one else had commented it",id:"35"},{text:"Adhered to an opinion because it was shared by a lot of people",id:"36"}],category4:[{text:"Thought a waiter was deserving but did not put money in an empty tip jar",id:"41"},{text:"Ate something at a buffet because it was almost gone",id:"42"},{text:"Got convinced by the sign to reuse the towel in a hotel",id:"43"},{text:"Donated to a charity after getting told a lot of people were donating",id:"44"},{text:"Found a show funnier thanks to canned laughter",id:"45"},{text:"Ate at a restaurant many people were recommending",id:"46"}]},se=[{id:"1",title:"You do not seem to be impacted by social proof to a significant extent",score_min:0,score_max:33,description:'You do not really pay attention to the number of comments, likes and reviews on online platforms. Or maybe you do, but they are not the factors that control your actions online. You would rather watch something without hearing how other people react to it, and you would rather not follow the crowd just because "everyone else is doing it."',media:{image:"https://img.buzzfeed.com/buzzfeed-static/static/2020-04/23/17/enhanced/6bcbd806692c/enhanced-392-1587661661-2.jpg"}},{id:"2",title:"You navigate your actions with a good balance between being driven by social proof and not being affected by it",score_min:34,score_max:67,description:"Of course you use social media and look at how people react to the content, buy products online and read their reviews. But, you are able to not get influenced too much by the way others use online platform, and can often decide what to do based on what you believe is best. Aside from the online space, you visit popular places, do activities recommended by many, and follow trends, but not just merely because the majority of people suggest doing so, also if you personally think they are worthy.",media:{image:"https://img.buzzfeed.com/buzzfeed-static/static/2020-04/23/17/enhanced/bc71f6de0007/enhanced-360-1587661566-3.jpg"}},{id:"3",title:"Social proof is the reason why you do most of your actions",score_min:68,score_max:100,description:"Posts, images, videos and products seem less interesting and less valid to you if the number of likes, or similar positive reinforcement, is low. You consider the numbers on different online platform to be the main indication of the quality of the content posted there. You are more likely to engage in activities if you see that many other people, especially if they are your friends or similar to you, are also doing them. Additionally, you would feel lost watching a sitcom without the laugh track, and appreciate shows with a live audience, so that the jokes sound funnier and you get a sense of when it is the right time to laugh. In real life, you think lines outside of stores are a clear symbol of good quality and you always try the new trend if many people around you are recommending it.",media:{image:"https://img.buzzfeed.com/buzzfeed-static/static/2020-04/30/20/enhanced/98bcd8c28f1d/enhanced-831-1588279128-25.jpg"}}];function ae(e){let t,n,o,s,a,i;return{c(){t=h("h2"),t.textContent=`${se[2].title}`,n=m(),o=h("p"),o.textContent=`${se[2].description}`,s=m(),a=h("img"),b(t,"class","svelte-1g1bg1m"),b(o,"class","svelte-1g1bg1m"),l(a.src,i=se[2].media.image)||b(a,"src",i),b(a,"alt","68% + score result"),b(a,"class","svelte-1g1bg1m")},m(e,i){u(e,t,i),u(e,n,i),u(e,o,i),u(e,s,i),u(e,a,i)},d(e){e&&(f(t),f(n),f(o),f(s),f(a))}}}function ie(e){let t,n,o,s,a,i;return{c(){t=h("h2"),t.textContent=`${se[1].title}`,n=m(),o=h("p"),o.textContent=`${se[1].description}`,s=m(),a=h("img"),b(t,"class","svelte-1g1bg1m"),b(o,"class","svelte-1g1bg1m"),l(a.src,i=se[1].media.image)||b(a,"src",i),b(a,"alt","34%+% score result"),b(a,"class","svelte-1g1bg1m")},m(e,i){u(e,t,i),u(e,n,i),u(e,o,i),u(e,s,i),u(e,a,i)},d(e){e&&(f(t),f(n),f(o),f(s),f(a))}}}function re(e){let t,n,o,s,a,i;return{c(){t=h("h2"),t.textContent=`${se[0].title}`,n=m(),o=h("p"),o.textContent=`${se[0].description}`,s=m(),a=h("img"),b(t,"class","svelte-1g1bg1m"),b(o,"class","svelte-1g1bg1m"),l(a.src,i=se[0].media.image)||b(a,"src",i),b(a,"alt","33% score result"),b(a,"class","svelte-1g1bg1m")},m(e,i){u(e,t,i),u(e,n,i),u(e,o,i),u(e,s,i),u(e,a,i)},d(e){e&&(f(t),f(n),f(o),f(s),f(a))}}}function le(t){let n,o,s,a,i;function r(e,t){return e[0]>=0&&e[0]<=9?re:e[0]>=10&&e[0]<=19?ie:e[0]>=20&&e[0]<=28?ae:void 0}let l=r(t),c=l&&l(t);return{c(){n=h("p"),o=p("Total checked boxes: "),s=p(t[0]),a=m(),i=h("div"),c&&c.c(),v(n,"color","azure"),b(n,"class","svelte-1g1bg1m")},m(e,t){u(e,n,t),d(n,o),d(n,s),u(e,a,t),u(e,i,t),c&&c.m(i,null)},p(e,[t]){1&t&&y(s,e[0]),l!==(l=r(e))&&(c&&c.d(1),c=l&&l(e),c&&(c.c(),c.m(i,null)))},i:e,o:e,d(e){e&&(f(n),f(a),f(i)),c&&c.d()}}}function ce(e,t,n){let o;return c(e,Q,(e=>n(0,o=e))),[o]}class de extends W{constructor(e){super(),D(this,e,ce,le,a,{})}}function ue(e){let t;return{c(){t=h("button"),b(t,"type","button"),b(t,"data-bs-target","#carouselExampleCaptions"),b(t,"data-bs-slide-to","4"),b(t,"aria-label","Slide 5")},m(e,n){u(e,t,n)},d(e){e&&f(t)}}}function fe(e){let t,n,o,s,a;return s=new de({}),{c(){t=h("div"),n=h("div"),n.innerHTML="<h5>Your Result is...</h5>",o=m(),N(s.$$.fragment),b(n,"class","carousel-captions svelte-zz8u02"),b(t,"class","carousel-item")},m(e,i){u(e,t,i),d(t,n),d(t,o),F(s,t,null),a=!0},i(e){a||(B(s.$$.fragment,e),a=!0)},o(e){Y(s.$$.fragment,e),a=!1},d(e){e&&f(t),I(s)}}}function he(e){let t,n,s,a,i,r,l,c,p,y,v,$,w,x,k,z,_,C,E,S,j,T,L,M,A,H,O,P,R,D,W,G,J,V,K,Q,U,X,Z,ee,te,se,ae,ie,re=e[0]&&ue();E=new ne({props:{options:oe.category1,disabled:e[0]}}),M=new ne({props:{options:oe.category2,disabled:e[0]}}),R=new ne({props:{options:oe.category3,disabled:e[0]}}),V=new ne({props:{options:oe.category4,disabled:e[0]}});let le=e[0]&&fe();return{c(){t=h("div"),n=h("div"),s=h("div"),a=h("div"),i=h("div"),r=h("button"),l=m(),c=h("button"),p=m(),y=h("button"),v=m(),$=h("button"),w=m(),re&&re.c(),x=m(),k=h("div"),z=h("div"),_=h("div"),_.innerHTML="<h5>Popularity and Trends</h5>",C=m(),N(E.$$.fragment),S=m(),j=h("div"),T=h("div"),T.innerHTML="<h5>Reviews, Ratings and Sales</h5>",L=m(),N(M.$$.fragment),A=m(),H=h("div"),O=h("div"),O.innerHTML="<h5>Herd Mentality</h5>",P=m(),N(R.$$.fragment),D=m(),W=h("div"),G=h("div"),G.innerHTML="<h5>Social Cues and Situational Norms</h5>",J=m(),N(V.$$.fragment),K=m(),Q=h("button"),Q.textContent="Submit",U=m(),le&&le.c(),X=m(),Z=h("button"),Z.innerHTML='<span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="visually-hidden">Previous</span>',ee=m(),te=h("button"),te.innerHTML='<span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="visually-hidden">Next</span>',b(r,"type","button"),b(r,"data-bs-target","#carouselExampleCaptions"),b(r,"data-bs-slide-to","0"),b(r,"class","active"),b(r,"aria-current","true"),b(r,"aria-label","Slide 1"),b(c,"type","button"),b(c,"data-bs-target","#carouselExampleCaptions"),b(c,"data-bs-slide-to","1"),b(c,"aria-label","Slide 2"),b(y,"type","button"),b(y,"data-bs-target","#carouselExampleCaptions"),b(y,"data-bs-slide-to","2"),b(y,"aria-label","Slide 3"),b($,"type","button"),b($,"data-bs-target","#carouselExampleCaptions"),b($,"data-bs-slide-to","3"),b($,"aria-label","Slide 4"),b(i,"class","carousel-indicators svelte-zz8u02"),b(_,"class","carousel-captions svelte-zz8u02"),b(z,"class","carousel-item active"),b(T,"class","carousel-captions svelte-zz8u02"),b(j,"class","carousel-item"),b(O,"class","carousel-captions svelte-zz8u02"),b(H,"class","carousel-item"),b(G,"class","carousel-captions svelte-zz8u02"),b(Q,"class","btn btn-primary btn-lg svelte-zz8u02"),b(W,"class","carousel-item"),b(k,"class","carousel-inner"),b(Z,"class","carousel-control-prev svelte-zz8u02"),b(Z,"type","button"),b(Z,"data-bs-target","#carouselExampleCaptions"),b(Z,"data-bs-slide","prev"),b(te,"class","carousel-control-next svelte-zz8u02"),b(te,"type","button"),b(te,"data-bs-target","#carouselExampleCaptions"),b(te,"data-bs-slide","next"),b(a,"id","carouselExampleCaptions"),b(a,"class","carousel slide"),b(s,"class","col-12 col-md-8"),b(n,"class","row justify-content-center"),b(t,"class","container")},m(o,f){u(o,t,f),d(t,n),d(n,s),d(s,a),d(a,i),d(i,r),d(i,l),d(i,c),d(i,p),d(i,y),d(i,v),d(i,$),d(i,w),re&&re.m(i,null),d(a,x),d(a,k),d(k,z),d(z,_),d(z,C),F(E,z,null),d(k,S),d(k,j),d(j,T),d(j,L),F(M,j,null),d(k,A),d(k,H),d(H,O),d(H,P),F(R,H,null),d(k,D),d(k,W),d(W,G),d(W,J),F(V,W,null),d(W,K),d(W,Q),d(k,U),le&&le.m(k,null),d(a,X),d(a,Z),d(a,ee),d(a,te),se=!0,ae||(ie=g(Q,"click",e[1]),ae=!0)},p(e,[t]){e[0]?re||(re=ue(),re.c(),re.m(i,null)):re&&(re.d(1),re=null);const n={};1&t&&(n.disabled=e[0]),E.$set(n);const s={};1&t&&(s.disabled=e[0]),M.$set(s);const a={};1&t&&(a.disabled=e[0]),R.$set(a);const r={};1&t&&(r.disabled=e[0]),V.$set(r),e[0]?le?1&t&&B(le,1):(le=fe(),le.c(),B(le,1),le.m(k,null)):le&&(q={r:0,c:[],p:q},Y(le,1,1,(()=>{le=null})),q.r||o(q.c),q=q.p)},i(e){se||(B(E.$$.fragment,e),B(M.$$.fragment,e),B(R.$$.fragment,e),B(V.$$.fragment,e),B(le),se=!0)},o(e){Y(E.$$.fragment,e),Y(M.$$.fragment,e),Y(R.$$.fragment,e),Y(V.$$.fragment,e),Y(le),se=!1},d(e){e&&f(t),re&&re.d(),I(E),I(M),I(R),I(V),le&&le.d(),ae=!1,ie()}}}function pe(){const e=document.querySelectorAll(".carousel-item").length,t=[...document.querySelectorAll(".carousel-item")].findIndex((e=>e.classList.contains("active"))),n=document.querySelector(".carousel-control-prev"),o=document.querySelector(".carousel-control-next");n.style.display=0===t?"none":"block",o.style.display=t===e-1?"none":"block"}function me(e,t,n){let o=!1;var s;return x((()=>{pe();document.getElementById("carouselExampleCaptions").addEventListener("slid.bs.carousel",pe)})),s=()=>{o&&new bootstrap.Carousel(document.getElementById("carouselExampleCaptions")).to(4)},w().$$.after_update.push(s),[o,function(){n(0,o=!0)}]}class ge extends W{constructor(e){super(),D(this,e,me,he,a,{})}}function be(t){let n,o,s,a,i,r,l;return n=new J({}),r=new ge({}),{c(){N(n.$$.fragment),o=m(),s=h("main"),a=h("h4"),a.textContent="There are countless examples of situations that take advantage of social\n    proof. From the situations below, select boxes of ones you relate with or\n    have experienced to discover the impact this phenomenon has on you.",i=m(),N(r.$$.fragment),v(a,"color","whitesmoke"),b(a,"class","svelte-nya7uv"),b(s,"class","svelte-nya7uv")},m(e,t){F(n,e,t),u(e,o,t),u(e,s,t),d(s,a),d(s,i),F(r,s,null),l=!0},p:e,i(e){l||(B(n.$$.fragment,e),B(r.$$.fragment,e),l=!0)},o(e){Y(n.$$.fragment,e),Y(r.$$.fragment,e),l=!1},d(e){e&&(f(o),f(s)),I(n,e),I(r)}}}return new class extends W{constructor(e){super(),D(this,e,null,be,a,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
