(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{17:function(e,t,n){e.exports=n(36)},23:function(e,t,n){},36:function(e,t,n){"use strict";n.r(t);var r=n(2),a=n(0),i=n(13),o=n.n(i),u=(n(23),n(7)),s=n.n(u),c=n(14),f=n(15),l=n(3),d=n(16),h=n(1);var g=function(e,t){return e(t={exports:{}},t.exports),t.exports}(function(e){!function(t){var n=/^\s+/,r=/\s+$/,a=0,i=t.round,o=t.min,u=t.max,s=t.random;function c(e,s){if(s=s||{},(e=e||"")instanceof c)return e;if(!(this instanceof c))return new c(e,s);var f=function(e){var a={r:0,g:0,b:0},i=1,s=null,c=null,f=null,l=!1,d=!1;"string"==typeof e&&(e=function(e){e=e.replace(n,"").replace(r,"").toLowerCase();var t,a=!1;if(j[e])e=j[e],a=!0;else if("transparent"==e)return{r:0,g:0,b:0,a:0,format:"name"};if(t=D.rgb.exec(e))return{r:t[1],g:t[2],b:t[3]};if(t=D.rgba.exec(e))return{r:t[1],g:t[2],b:t[3],a:t[4]};if(t=D.hsl.exec(e))return{h:t[1],s:t[2],l:t[3]};if(t=D.hsla.exec(e))return{h:t[1],s:t[2],l:t[3],a:t[4]};if(t=D.hsv.exec(e))return{h:t[1],s:t[2],v:t[3]};if(t=D.hsva.exec(e))return{h:t[1],s:t[2],v:t[3],a:t[4]};if(t=D.hex8.exec(e))return{r:C(t[1]),g:C(t[2]),b:C(t[3]),a:I(t[4]),format:a?"name":"hex8"};if(t=D.hex6.exec(e))return{r:C(t[1]),g:C(t[2]),b:C(t[3]),format:a?"name":"hex"};if(t=D.hex4.exec(e))return{r:C(t[1]+""+t[1]),g:C(t[2]+""+t[2]),b:C(t[3]+""+t[3]),a:I(t[4]+""+t[4]),format:a?"name":"hex8"};if(t=D.hex3.exec(e))return{r:C(t[1]+""+t[1]),g:C(t[2]+""+t[2]),b:C(t[3]+""+t[3]),format:a?"name":"hex"};return!1}(e));"object"==typeof e&&(N(e.r)&&N(e.g)&&N(e.b)?(h=e.r,g=e.g,b=e.b,a={r:255*R(h,255),g:255*R(g,255),b:255*R(b,255)},l=!0,d="%"===String(e.r).substr(-1)?"prgb":"rgb"):N(e.h)&&N(e.s)&&N(e.v)?(s=F(e.s),c=F(e.v),a=function(e,n,r){e=6*R(e,360),n=R(n,100),r=R(r,100);var a=t.floor(e),i=e-a,o=r*(1-n),u=r*(1-i*n),s=r*(1-(1-i)*n),c=a%6;return{r:255*[r,u,o,o,s,r][c],g:255*[s,r,r,u,o,o][c],b:255*[o,o,s,r,r,u][c]}}(e.h,s,c),l=!0,d="hsv"):N(e.h)&&N(e.s)&&N(e.l)&&(s=F(e.s),f=F(e.l),a=function(e,t,n){var r,a,i;function o(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+6*(t-e)*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e}if(e=R(e,360),t=R(t,100),n=R(n,100),0===t)r=a=i=n;else{var u=n<.5?n*(1+t):n+t-n*t,s=2*n-u;r=o(s,u,e+1/3),a=o(s,u,e),i=o(s,u,e-1/3)}return{r:255*r,g:255*a,b:255*i}}(e.h,s,f),l=!0,d="hsl"),e.hasOwnProperty("a")&&(i=e.a));var h,g,b;return i=E(i),{ok:l,format:e.format||d,r:o(255,u(a.r,0)),g:o(255,u(a.g,0)),b:o(255,u(a.b,0)),a:i}}(e);this._originalInput=e,this._r=f.r,this._g=f.g,this._b=f.b,this._a=f.a,this._roundA=i(100*this._a)/100,this._format=s.format||f.format,this._gradientType=s.gradientType,this._r<1&&(this._r=i(this._r)),this._g<1&&(this._g=i(this._g)),this._b<1&&(this._b=i(this._b)),this._ok=f.ok,this._tc_id=a++}function f(e,t,n){e=R(e,255),t=R(t,255),n=R(n,255);var r,a,i=u(e,t,n),s=o(e,t,n),c=(i+s)/2;if(i==s)r=a=0;else{var f=i-s;switch(a=c>.5?f/(2-i-s):f/(i+s),i){case e:r=(t-n)/f+(t<n?6:0);break;case t:r=(n-e)/f+2;break;case n:r=(e-t)/f+4}r/=6}return{h:r,s:a,l:c}}function l(e,t,n){e=R(e,255),t=R(t,255),n=R(n,255);var r,a,i=u(e,t,n),s=o(e,t,n),c=i,f=i-s;if(a=0===i?0:f/i,i==s)r=0;else{switch(i){case e:r=(t-n)/f+(t<n?6:0);break;case t:r=(n-e)/f+2;break;case n:r=(e-t)/f+4}r/=6}return{h:r,s:a,v:c}}function d(e,t,n,r){var a=[H(i(e).toString(16)),H(i(t).toString(16)),H(i(n).toString(16))];return r&&a[0].charAt(0)==a[0].charAt(1)&&a[1].charAt(0)==a[1].charAt(1)&&a[2].charAt(0)==a[2].charAt(1)?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0):a.join("")}function h(e,t,n,r){return[H(L(r)),H(i(e).toString(16)),H(i(t).toString(16)),H(i(n).toString(16))].join("")}function g(e,t){t=0===t?0:t||10;var n=c(e).toHsl();return n.s-=t/100,n.s=K(n.s),c(n)}function b(e,t){t=0===t?0:t||10;var n=c(e).toHsl();return n.s+=t/100,n.s=K(n.s),c(n)}function p(e){return c(e).desaturate(100)}function v(e,t){t=0===t?0:t||10;var n=c(e).toHsl();return n.l+=t/100,n.l=K(n.l),c(n)}function m(e,t){t=0===t?0:t||10;var n=c(e).toRgb();return n.r=u(0,o(255,n.r-i(-t/100*255))),n.g=u(0,o(255,n.g-i(-t/100*255))),n.b=u(0,o(255,n.b-i(-t/100*255))),c(n)}function y(e,t){t=0===t?0:t||10;var n=c(e).toHsl();return n.l-=t/100,n.l=K(n.l),c(n)}function x(e,t){var n=c(e).toHsl(),r=(n.h+t)%360;return n.h=r<0?360+r:r,c(n)}function _(e){var t=c(e).toHsl();return t.h=(t.h+180)%360,c(t)}function w(e){var t=c(e).toHsl(),n=t.h;return[c(e),c({h:(n+120)%360,s:t.s,l:t.l}),c({h:(n+240)%360,s:t.s,l:t.l})]}function k(e){var t=c(e).toHsl(),n=t.h;return[c(e),c({h:(n+90)%360,s:t.s,l:t.l}),c({h:(n+180)%360,s:t.s,l:t.l}),c({h:(n+270)%360,s:t.s,l:t.l})]}function A(e){var t=c(e).toHsl(),n=t.h;return[c(e),c({h:(n+72)%360,s:t.s,l:t.l}),c({h:(n+216)%360,s:t.s,l:t.l})]}function O(e,t,n){t=t||6,n=n||30;var r=c(e).toHsl(),a=360/n,i=[c(e)];for(r.h=(r.h-(a*t>>1)+720)%360;--t;)r.h=(r.h+a)%360,i.push(c(r));return i}function S(e,t){t=t||6;for(var n=c(e).toHsv(),r=n.h,a=n.s,i=n.v,o=[],u=1/t;t--;)o.push(c({h:r,s:a,v:i})),i=(i+u)%1;return o}c.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var e=this.toRgb();return(299*e.r+587*e.g+114*e.b)/1e3},getLuminance:function(){var e,n,r,a=this.toRgb();return e=a.r/255,n=a.g/255,r=a.b/255,.2126*(e<=.03928?e/12.92:t.pow((e+.055)/1.055,2.4))+.7152*(n<=.03928?n/12.92:t.pow((n+.055)/1.055,2.4))+.0722*(r<=.03928?r/12.92:t.pow((r+.055)/1.055,2.4))},setAlpha:function(e){return this._a=E(e),this._roundA=i(100*this._a)/100,this},toHsv:function(){var e=l(this._r,this._g,this._b);return{h:360*e.h,s:e.s,v:e.v,a:this._a}},toHsvString:function(){var e=l(this._r,this._g,this._b),t=i(360*e.h),n=i(100*e.s),r=i(100*e.v);return 1==this._a?"hsv("+t+", "+n+"%, "+r+"%)":"hsva("+t+", "+n+"%, "+r+"%, "+this._roundA+")"},toHsl:function(){var e=f(this._r,this._g,this._b);return{h:360*e.h,s:e.s,l:e.l,a:this._a}},toHslString:function(){var e=f(this._r,this._g,this._b),t=i(360*e.h),n=i(100*e.s),r=i(100*e.l);return 1==this._a?"hsl("+t+", "+n+"%, "+r+"%)":"hsla("+t+", "+n+"%, "+r+"%, "+this._roundA+")"},toHex:function(e){return d(this._r,this._g,this._b,e)},toHexString:function(e){return"#"+this.toHex(e)},toHex8:function(e){return function(e,t,n,r,a){var o=[H(i(e).toString(16)),H(i(t).toString(16)),H(i(n).toString(16)),H(L(r))];if(a&&o[0].charAt(0)==o[0].charAt(1)&&o[1].charAt(0)==o[1].charAt(1)&&o[2].charAt(0)==o[2].charAt(1)&&o[3].charAt(0)==o[3].charAt(1))return o[0].charAt(0)+o[1].charAt(0)+o[2].charAt(0)+o[3].charAt(0);return o.join("")}(this._r,this._g,this._b,this._a,e)},toHex8String:function(e){return"#"+this.toHex8(e)},toRgb:function(){return{r:i(this._r),g:i(this._g),b:i(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+i(this._r)+", "+i(this._g)+", "+i(this._b)+")":"rgba("+i(this._r)+", "+i(this._g)+", "+i(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:i(100*R(this._r,255))+"%",g:i(100*R(this._g,255))+"%",b:i(100*R(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+i(100*R(this._r,255))+"%, "+i(100*R(this._g,255))+"%, "+i(100*R(this._b,255))+"%)":"rgba("+i(100*R(this._r,255))+"%, "+i(100*R(this._g,255))+"%, "+i(100*R(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":!(this._a<1)&&(M[d(this._r,this._g,this._b,!0)]||!1)},toFilter:function(e){var t="#"+h(this._r,this._g,this._b,this._a),n=t,r=this._gradientType?"GradientType = 1, ":"";if(e){var a=c(e);n="#"+h(a._r,a._g,a._b,a._a)}return"progid:DXImageTransform.Microsoft.gradient("+r+"startColorstr="+t+",endColorstr="+n+")"},toString:function(e){var t=!!e;e=e||this._format;var n=!1,r=this._a<1&&this._a>=0;return t||!r||"hex"!==e&&"hex6"!==e&&"hex3"!==e&&"hex4"!==e&&"hex8"!==e&&"name"!==e?("rgb"===e&&(n=this.toRgbString()),"prgb"===e&&(n=this.toPercentageRgbString()),"hex"!==e&&"hex6"!==e||(n=this.toHexString()),"hex3"===e&&(n=this.toHexString(!0)),"hex4"===e&&(n=this.toHex8String(!0)),"hex8"===e&&(n=this.toHex8String()),"name"===e&&(n=this.toName()),"hsl"===e&&(n=this.toHslString()),"hsv"===e&&(n=this.toHsvString()),n||this.toHexString()):"name"===e&&0===this._a?this.toName():this.toRgbString()},clone:function(){return c(this.toString())},_applyModification:function(e,t){var n=e.apply(null,[this].concat([].slice.call(t)));return this._r=n._r,this._g=n._g,this._b=n._b,this.setAlpha(n._a),this},lighten:function(){return this._applyModification(v,arguments)},brighten:function(){return this._applyModification(m,arguments)},darken:function(){return this._applyModification(y,arguments)},desaturate:function(){return this._applyModification(g,arguments)},saturate:function(){return this._applyModification(b,arguments)},greyscale:function(){return this._applyModification(p,arguments)},spin:function(){return this._applyModification(x,arguments)},_applyCombination:function(e,t){return e.apply(null,[this].concat([].slice.call(t)))},analogous:function(){return this._applyCombination(O,arguments)},complement:function(){return this._applyCombination(_,arguments)},monochromatic:function(){return this._applyCombination(S,arguments)},splitcomplement:function(){return this._applyCombination(A,arguments)},triad:function(){return this._applyCombination(w,arguments)},tetrad:function(){return this._applyCombination(k,arguments)}},c.fromRatio=function(e,t){if("object"==typeof e){var n={};for(var r in e)e.hasOwnProperty(r)&&(n[r]="a"===r?e[r]:F(e[r]));e=n}return c(e,t)},c.equals=function(e,t){return!(!e||!t)&&c(e).toRgbString()==c(t).toRgbString()},c.random=function(){return c.fromRatio({r:s(),g:s(),b:s()})},c.mix=function(e,t,n){n=0===n?0:n||50;var r=c(e).toRgb(),a=c(t).toRgb(),i=n/100;return c({r:(a.r-r.r)*i+r.r,g:(a.g-r.g)*i+r.g,b:(a.b-r.b)*i+r.b,a:(a.a-r.a)*i+r.a})},c.readability=function(e,n){var r=c(e),a=c(n);return(t.max(r.getLuminance(),a.getLuminance())+.05)/(t.min(r.getLuminance(),a.getLuminance())+.05)},c.isReadable=function(e,t,n){var r,a,i=c.readability(e,t);switch(a=!1,(r=function(e){var t,n;t=((e=e||{level:"AA",size:"small"}).level||"AA").toUpperCase(),n=(e.size||"small").toLowerCase(),"AA"!==t&&"AAA"!==t&&(t="AA");"small"!==n&&"large"!==n&&(n="small");return{level:t,size:n}}(n)).level+r.size){case"AAsmall":case"AAAlarge":a=i>=4.5;break;case"AAlarge":a=i>=3;break;case"AAAsmall":a=i>=7}return a},c.mostReadable=function(e,t,n){var r,a,i,o,u=null,s=0;a=(n=n||{}).includeFallbackColors,i=n.level,o=n.size;for(var f=0;f<t.length;f++)(r=c.readability(e,t[f]))>s&&(s=r,u=c(t[f]));return c.isReadable(e,u,{level:i,size:o})||!a?u:(n.includeFallbackColors=!1,c.mostReadable(e,["#fff","#000"],n))};var j=c.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},M=c.hexNames=function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[e[n]]=n);return t}(j);function E(e){return e=parseFloat(e),(isNaN(e)||e<0||e>1)&&(e=1),e}function R(e,n){(function(e){return"string"==typeof e&&-1!=e.indexOf(".")&&1===parseFloat(e)})(e)&&(e="100%");var r=function(e){return"string"===typeof e&&-1!=e.indexOf("%")}(e);return e=o(n,u(0,parseFloat(e))),r&&(e=parseInt(e*n,10)/100),t.abs(e-n)<1e-6?1:e%n/parseFloat(n)}function K(e){return o(1,u(0,e))}function C(e){return parseInt(e,16)}function H(e){return 1==e.length?"0"+e:""+e}function F(e){return e<=1&&(e=100*e+"%"),e}function L(e){return t.round(255*parseFloat(e)).toString(16)}function I(e){return C(e)/255}var D=function(){var e="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",t="[\\s|\\(]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")\\s*\\)?",n="[\\s|\\(]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")\\s*\\)?";return{CSS_UNIT:new RegExp(e),rgb:new RegExp("rgb"+t),rgba:new RegExp("rgba"+n),hsl:new RegExp("hsl"+t),hsla:new RegExp("hsla"+n),hsv:new RegExp("hsv"+t),hsva:new RegExp("hsva"+n),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();function N(e){return!!D.CSS_UNIT.exec(e)}e.exports?e.exports=c:window.tinycolor=c}(Math)}),b=function(e){switch(e.id%12){case 0:case 2:case 4:case 5:case 7:case 9:case 11:return!0}return!1},p=function(e){switch(e.id%12){case 2:return.35;case 4:return.65;case 7:return.25;case 9:return.5;case 11:return.75}return 0},v=function(e){switch(e.id%12){case 0:return.65;case 2:return.35;case 5:return.75;case 7:return.5;case 9:return.25}return 0},m=function(e){switch(e.id%12){case 2:return.95;case 4:return.85;case 5:return 1.05;case 7:return.9;case 9:return.85}return 1},y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},x=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,a=!1,i=void 0;try{for(var o,u=e[Symbol.iterator]();!(r=(o=u.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(s){a=!0,i=s}finally{try{!r&&u.return&&u.return()}finally{if(a)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},w=Object(a.forwardRef)(function(e,t){var n=e.startKey,r=void 0===n?9:n,i=e.endKey,o=void 0===i?96:i,u=e.style,s=void 0===u?{}:u,c=e.onKeyOn,f=void 0===c?null:c,l=e.onKeyOff,d=void 0===l?null:l,h=e.labels,w=void 0===h?null:h,k=e.keyboardMapping,A=void 0===k?null:k,O=e.accidentalKeyHeight,S=void 0===O?"60%":O,j=e.keyboardVelocity,M=void 0===j?.75:j,E=e.naturalKeyColor,R=void 0===E?"white":E,K=e.accidentalKeyColor,C=void 0===K?"black":K,H=e.notesOn,F=void 0===H?[]:H,L=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["startKey","endKey","style","onKeyOn","onKeyOff","labels","keyboardMapping","accidentalKeyHeight","keyboardVelocity","naturalKeyColor","accidentalKeyColor","notesOn"]),I=t||Object(a.useRef)(null),D=Object(a.useState)([]),N=x(D,2)[1],T=Object(a.useState)({}),z=x(T,2),q=z[0],P=z[1],B=Object(a.useState)({}),U=x(B,2),$=U[0],V=U[1],G=Object(a.useState)([]),X=(x(G,2)[1],Object.entries(q)),J=Object.values(q).reduce(function(e,t){return[].concat(_(e),_(t))},[]).filter(function(e){return b(e)}).length,Y=Object(a.useState)(null),W=(x(Y,2)[1],function(e){return function(t,n){f&&f({target:y({},I.current,{value:y({},t,{velocity:n})}),source:e})}}),Q=function(e){return function(t){d&&d({target:y({},I.current,{value:t}),source:e})}},Z=function(e){return function(t){1===t.buttons&&Q("mouse")(e)}},ee=function(e){return function(t){var n=t.buttons,r=t.clientY,a=t.target,i=r-I.current.getBoundingClientRect().top;1===n&&W("mouse")(e,i/a.offsetHeight)}},te=function(e){return function(t){var n=t.buttons,r=t.clientY,a=t.target,i=r-I.current.getBoundingClientRect().top;1===n&&(t.preventDefault(),I.current.focus(),W("mouse")(e,i/a.offsetHeight))}},ne=function(e){return function(t){t.preventDefault(),Q("mouse")(e)}},re=function(e){var t=e.altKey,n=e.shiftKey,r=e.ctrlKey,a=e.metaKey,i=e.keyCode;t||n||r||a||A&&A[i]&&(e.preventDefault(),N(function(e){var t=A[i];return null!==A&&t&&Q(!1)({id:t}),e.filter(function(e){return e!==i})}))},ae=function(e,t,n){var r=b(e),a=n[0].id===e.id,i=n[n.length-1].id===e.id,o=n.filter(function(e){return b(e)});return{borderRadius:r?"0 0 2% 2%":"0 0 10% 10%",display:"inline-block",verticalAlign:"top",boxSizing:"border-box",borderLeft:"1px solid black",borderBottom:r?null:"1px solid black",marginLeft:r&&!a?"-"+1/n.length*100*m(n[0])*p(e)+"%":null,marginRight:r&&!i?"-"+1/n.length*100*m(n[0])*v(e)+"%":null,width:r?100/o.length+"%":100/o.length/12*7+"%",height:r?"100%":S,cursor:"pointer",position:"relative",zIndex:r?0:1,backgroundColor:"black"}},ie=function(e){return Array.isArray(F)&&F.includes(e.id)},oe=function(e){return ie(e)?function(e){return b(e)?"linear-gradient(to bottom, "+R+", "+g(R).setAlpha(.9).toRgbString()+")":"linear-gradient(to bottom, "+C+", "+g(C).setAlpha(.9).toRgbString()+")"}(e):function(e){return b(e)?"linear-gradient(to bottom, "+R+", "+R+")":"linear-gradient(to bottom, "+C+", "+C+")"}(e)},ue=function(e){return ie(e)?function(e){return b(e)?"0 0 4px 16px rgba(255,255,255,0) inset, 0 0 4px rgba(0,0,0,0.0), 2px -2px 1px -1px rgba(0,0,0,0.25) inset":"0 0 4px rgba(0,0,0,0), 1px -1px 4px rgba(0,0,0,1) inset, -1.5px -2px 1px rgba(0,0,0,0.5) inset, 1.5px -1px 1px rgba(255,255,255,0.75) inset"}(e):function(e){return b(e)?"0 0 4px 16px "+R+" inset, 0 0 4px rgba(0,0,0,0.75), 2px -2px 1px -1px rgba(0,0,0,0.25) inset":"0 0 4px rgba(0,0,0,0.75), 1px -2px 4px "+g(C).darken(12).toRgbString()+" inset, -2px -4px 1px "+g(C).darken(20).toRgbString()+" inset, 2px -4px 1px rgba(255,255,255,0.75) inset"}(e)},se=function(e){return b(e)?"var(--white-key-foreground-color)":"var(--black-key-foreground-color)"},ce=function(e){return ie(e)?"rotateX(10deg)":"rotateX(0deg)"},fe=function(e){return{display:"flex",justifyContent:"center",alignItems:"flex-end",border:0,padding:"0 0 1rem 0",width:"100%",height:"100%",borderRadius:"0 0 2px 2px",backgroundImage:oe(e),boxShadow:ue(e),color:se(e),transform:ce(e),transformOrigin:"top",textAlign:"center",boxSizing:"border-box",position:"relative"}},le=function(e){var t=b(e);return{position:"absolute",bottom:"0.5rem",pointerEvents:"none",filter:t?null:"invert(100%)",transform:t?null:"rotate(90deg)",transformOrigin:t?null:"top right",fontSize:"75%",width:"100%",textAlign:"center",lineHeight:1.5}};return Object(a.useEffect)(function(){for(var e={},t={},n=r;n<=o;n+=1){var a=Math.floor(n/12);a in e||(e[a]=[]),t[n]={id:n,octave:a},e[a].push(t[n])}P(e),V(t)},[r,o]),Object(a.useEffect)(function(){return window.addEventListener("keyup",re,!0),function(){window.removeEventListener("keyup",re,!0)}},[]),Object(a.createElement)("div",y({},L,{style:y({},s,{backgroundColor:"black",boxSizing:"border-box",borderWidth:"1px 0",borderStyle:"solid",userSelect:"none",overflow:"hidden"}),ref:I,tabIndex:0,onKeyDown:function(e){var t=e.altKey,n=e.shiftKey,r=e.ctrlKey,a=e.metaKey,i=e.keyCode;t||n||r||a||A&&A[i]&&(e.preventDefault(),N(function(e){if(e.includes(i))return e;var t=A[i];return null!==A&&t&&W("keyboard")($[t],M),[].concat(_(e),[i])}))}}),X.map(function(e,t,n){var r=x(e,2),i=r[0],o=r[1];return Object(a.createElement)("div",{key:i,style:{display:"inline-block",verticalAlign:"top",height:"100%",whiteSpace:"nowrap",boxSizing:"border-box",marginRight:t===n.length-1?"-1px":null,width:o.filter(function(e){return b(e)}).length/J*100+"%"}},o.map(function(e,t,n){return Object(a.createElement)("div",{key:e.id,style:ae(e,0,n),onMouseDown:te(e),onMouseEnter:ee(e),onMouseLeave:Z(e),onMouseUp:ne(e)},Object(a.createElement)("div",{style:fe(e)}),Object(a.createElement)("div",{style:le(e)},null===w?null:w(e)))}))}))});w.propTypes={startKey:h.number,endKey:h.number,style:Object(h.shape)(),onKeyOn:h.func,onKeyOff:h.func,labels:h.func,keyboardMapping:Object(h.shape)(),accidentalKeyHeight:Object(h.oneOfType)([h.string,h.number]),keyboardVelocity:h.number,naturalKeyColor:h.string,accidentalKeyColor:h.string,notesOn:Object(h.arrayOf)(h.number)};var k=w,A=function(e,t,n){return n*Math.pow(Math.pow(2,1/12),e-t)},O="C C# D D# E F F# G G# A A# B".split(" "),S=function(e){var t=e.startKey,n=void 0===t?21:t,i=e.endKey,o=void 0===i?108:i,u=e.sound,h=void 0===u?0:u,g=(e.sounds,e.generator),b=void 0===g?null:g,p=e.keyboardMapping,v=void 0===p?{}:p,m=a.useState(!1),y=Object(r.a)(m,1)[0],x=a.useState(h),_=Object(r.a)(x,2),w=_[0],S=_[1],j=a.useState(!1),M=Object(r.a)(j,2),E=M[0],R=M[1],K=a.useState(!1),C=Object(r.a)(K,2),H=C[0],F=C[1],L=a.useState(!1),I=Object(r.a)(L,2),D=I[0],N=I[1],T=a.useState([]),z=Object(r.a)(T,2),q=z[0],P=z[1],B=a.useState([]),U=Object(r.a)(B,2)[1],$=a.useState(null),V=Object(r.a)($,2)[1],G=a.useRef(null),X=a.useRef(null),J=a.useRef(null),Y=a.useRef(null),W=a.useRef(null),Q=a.useRef(null),Z=function(){window.setTimeout(function(){Q.current.focus()})},ee=function(){R(0),Z()},te=function(){F(0),Z()},ne=function(){N(0),Z()};return a.useEffect(function(){"sendMessage"in b&&b.sendMessage(64,E)},[E,b]),a.useEffect(function(){"sendMessage"in b&&b.sendMessage(66,H)},[H,b]),a.useEffect(function(){"sendMessage"in b&&b.sendMessage(67,D)},[D,b]),a.useEffect(function(){b.changeSound(w),X.current.value=w},[w,b]),a.useEffect(function(){Z()},[]),a.useEffect(function(){var e=function(e){e.preventDefault(),e.stopPropagation()},t=function(){var e=Object(f.a)(s.a.mark(function e(t){var n,a,i,o,u,f,h,g;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),t.stopPropagation(),n=t.dataTransfer.files,a=Object(r.a)(n,1),i=a[0],null!==G.current&&(window.clearInterval(G.current),"sendMessage"in b&&(b.sendMessage(120,0),b.sendMessage(121,0),P([]))),"audio/mid"===i.type){e.next=7;break}return e.abrupt("return");case 7:return e.next=9,i.arrayBuffer();case 9:o=e.sent,u=new d.Midi(o),console.log(u),f=Object(l.a)(u.tracks.reduce(function(e,t,n){return[].concat(Object(l.a)(e),Object(l.a)(t.notes.map(function(e){return[[e.ticks,n,"noteOn",e.midi,e.velocity],[e.ticks+e.durationTicks,n,"noteOff",e.midi,e.velocity]]})),[Object.keys(t.controlChanges).map(function(e){return Number(e)}).filter(function(e){return![7,10].includes(e)}).reduce(function(e,r){return[].concat(Object(l.a)(e),Object(l.a)(t.controlChanges[r].map(function(e){return[e.ticks,n,r,e.value]})))},[])])},[])).reduce(function(e,t){return[].concat(Object(l.a)(e),Object(l.a)(t))},[]).sort(function(e,t){return e[0]-t[0]}),h=0,g=f,G.current=window.setInterval(function(){h+=u.header.ppq/96,g.filter(function(e){return e[0]<=h}).forEach(function(e){var t=Object(c.a)(e),n=t[2],r=t.slice(3);switch(n){case"noteOn":b.soundOn(r[0],127*r[1],A(r[0],69,440)),P(function(e){return[].concat(Object(l.a)(e),[r[0]])});break;case"noteOff":b.soundOff(r[0]),P(function(e){return e.filter(function(e){return e!==r[0]})});break;default:"sendMessage"in b&&b.sendMessage(n,r[0])}}),g=f.filter(function(e){return e[0]>h}),h>u.durationTicks&&(window.clearInterval(G),"sendMessage"in b&&(b.sendMessage(120,0),b.sendMessage(121,0),P([])))});case 16:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}();return window.document.body.addEventListener("dragover",e),window.document.body.addEventListener("drop",t),function(){window.document.body.removeEventListener("dragover",e),window.document.body.removeEventListener("drop",t)}},[b]),a.createElement(a.Fragment,null,a.createElement("div",{className:"topbar"},a.createElement("div",{className:"group"},a.createElement("label",{className:"sound"},a.createElement("span",{className:"label"},"Sound"),a.createElement("select",{className:"input",name:"sound",onChange:function(e){S(e.target.value),Z()},ref:X},b.getSounds().map(function(e,t){return a.createElement("option",{key:t,value:t},e)}))))),a.createElement("div",{className:"bottombar"},"sendMessage"in b&&a.createElement("div",{className:"pedals"},a.createElement("button",{type:"button",ref:W,onMouseDown:function(){N(127),Z()},onMouseUp:ne,onMouseLeave:ne},"Una Corda"),a.createElement("button",{type:"button",ref:Y,onMouseDown:function(){F(127),Z()},onMouseUp:te,onMouseLeave:te},"Sostenuto"),a.createElement("button",{type:"button",ref:J,onMouseDown:function(){R(127),Z()},onMouseUp:ee,onMouseLeave:ee},"Sustain")),a.createElement("div",{className:"keyboard"},a.createElement(k,{ref:Q,labels:function(e){return y?"".concat(O[e.id%12]).concat(Math.floor(e.id/12)-1):null},onKeyOn:function(e){var t=e.source,n=e.target.value,r=n.id,a=n.velocity;"mouse"===t&&U(function(e){return[].concat(Object(l.a)(e),[r])}),P(function(e){return[].concat(Object(l.a)(e),[r])}),V(function(e){var n=null!==e?e:a;return b.soundOn(r,127*("mouse"===t?n:a),A(r,69,440)),"mouse"===t?n:e})},onKeyOff:function(e){var t=e.source,n=e.target.value.id;P(function(e){return e.filter(function(e){return e!==n})}),"mouse"===t&&window.setTimeout(function(){U(function(e){var t=e.filter(function(e){return e!==n});return V(function(e){return t.length>0?e:null}),t})}),b.soundOff(n)},startKey:n,endKey:o,accidentalKeyHeight:"65%",keyboardMapping:v,naturalKeyColor:"white",accidentalKeyColor:"rgb(25, 25, 25)",notesOn:q}))))},j={81:60,50:61,87:62,51:63,69:64,82:65,53:66,84:67,54:68,89:69,55:70,85:71,73:72,57:73,79:74,48:75,80:76,219:77,61:78,187:78,221:79,90:48,83:49,88:50,68:51,67:52,86:53,71:54,66:55,72:56,78:57,74:58,77:59,188:60,76:61,190:62,59:63,186:63,191:64};Promise.all([n.e(3).then(n.bind(null,37)),n.e(4).then(n.bind(null,38))]).then(function(e){var t=Object(r.a)(e,2),n=t[0],i=t[1].default;"requestMIDIAccess"in window.navigator&&(i=n.default),o.a.render(a.createElement(S,{generator:new i,keyboardMapping:j,startKey:0,endKey:127}),window.document.getElementById("root"))})}},[[17,1,2]]]);
//# sourceMappingURL=main.e3328cb4.chunk.js.map