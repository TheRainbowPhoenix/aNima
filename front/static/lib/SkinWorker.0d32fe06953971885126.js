!function(e){var r={};function t(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var a in e)t.d(n,a,function(r){return e[r]}.bind(null,a));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="/lib/",t(t.s=88)}({88:function(e,r,t){e.exports=t(89)},89:function(e,r,t){"use strict";var n=[],a=[],o={},f={eq:function(e,r,t){if(!e&&r||e&&!r)t(!1);else if(e.length==r.length){for(var n=e.length,a=0;a<n;a++)if(e[a]!==r[a])return void t(!1);t(!0)}else t(!1)},buildLoToHiIndex:function(e,r,t){for(var n=r.length/2,a=e.length/4,o=0,f=new Uint32Array(n),i=0;i<n;i++)for(var u=r[o++],l=r[o++],s=0,c=0;c<a;c++){var v=e[s++],d=e[s++],g=Math.abs(u-v),h=Math.abs(l-d);if(g<1e-5&&h<1e-5){f[i]=c;break}s+=2}t(f)},deformLo:function(e,r,t,n,a,o,f){for(var i=t.length/2,u=new Float32Array(2*i),l=0,s=0,c=0;c<i;c++){for(var v=t[l++],d=t[l++],g=e[0]*v+e[2]*d+e[4],h=e[1]*v+e[3]*d+e[5],b=new Float32Array(6),p=0;p<4;p++)for(var y=8*a[c],m=n[y+p],w=n[y+p+4],A=6*m,M=0;M<6;M++)b[M]+=o[A+M]*w;v=b[0]*g+b[2]*h+b[4],d=b[1]*g+b[3]*h+b[5],u[s++]=r[0]*v+r[2]*d+r[4],u[s++]=r[1]*v+r[3]*d+r[5]}f(u)},dbv:function(e,r){a||(a=new Float32Array(n));for(var t=n,o=n.length/4,f=0,i=0;i<o;i++){var u=t[f],l=t[f+1];a[f]=e[0]*u+e[2]*l+e[4],a[f+1]=e[1]*u+e[3]*l+e[5],f+=4}r()},sbv:function(e,r,t){if(n=e,a=new Float32Array(n),r)for(var o=n.length/4,f=0,i=0;i<o;i++){var u=e[f],l=e[f+1];a[f]=r[0]*u+r[2]*l+r[4],a[f+1]=r[1]*u+r[3]*l+r[5],f+=4}t()},fbv:function(e,r,t,n,o){for(var f=[],i=[],u=n-t,l=a,s=a.length/4,c=0,v=0;v<s;v++){var d=l[c]-e,g=l[c+1]-r,h=Math.sqrt(d*d+g*g);if(h>n)c+=4;else{var b=1;if(h>t&&u>0)b=1-(h-t)/u;f.push(v),i.push(b),c+=4}}o({index:new Uint16Array(f),weights:new Float32Array(i)})},setBaseWeightData:function(e,r,t){o.verts=e,o.wd=r,t()},recalcWeightData:function(e,r){var t=e.length/4,n=o.verts;if(n){for(var a=o.wd,f=n.length/4,i=new Float32Array(8*t),u=0,l=0,s=0;s<t;s++){for(var c=e[u],v=e[u+1],d=0,g=Number.MAX_VALUE,h=0,b=0;b<f;b++){var p=n[d]-c,y=n[d+1]-v,m=p*p+y*y;if(m<g&&(g=m,h=b,m<.01))break;d+=4}var w=8*h;for(b=0;b<8;b++)i[l+b]=a[w+b];u+=4,l+=8}r(i)}else r(null)}};addEventListener("message",(function(e){var r=f[e.data.call];if(r&&e.data.arguments&&e.data.arguments.length){var t=e.data.arguments[e.data.arguments.length-1];e.data.arguments[e.data.arguments.length-1]=function(e){postMessage({id:t,response:e})},r.apply(this,e.data.arguments)}}))}});
//# sourceMappingURL=SkinWorker.0d32fe06953971885126.js.map