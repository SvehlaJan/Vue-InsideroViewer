(function(e){function t(t){for(var n,a,i=t[0],c=t[1],u=t[2],l=0,f=[];l<i.length;l++)a=i[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);d&&d(t);while(f.length)f.shift()();return s.push.apply(s,u||[]),r()}function r(){for(var e,t=0;t<s.length;t++){for(var r=s[t],n=!0,a=1;a<r.length;a++){var i=r[a];0!==o[i]&&(n=!1)}n&&(s.splice(t--,1),e=c(c.s=r[0]))}return e}var n={},a={app:0},o={app:0},s=[];function i(e){return c.p+"js/"+({login:"login",settings:"settings"}[e]||e)+"."+{login:"b70ae18f",settings:"ced20d85"}[e]+".js"}function c(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,c),r.l=!0,r.exports}c.e=function(e){var t=[],r={settings:1};a[e]?t.push(a[e]):0!==a[e]&&r[e]&&t.push(a[e]=new Promise((function(t,r){for(var n="css/"+({login:"login",settings:"settings"}[e]||e)+"."+{login:"31d6cfe0",settings:"5b2d6e0c"}[e]+".css",o=c.p+n,s=document.getElementsByTagName("link"),i=0;i<s.length;i++){var u=s[i],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===n||l===o))return t()}var f=document.getElementsByTagName("style");for(i=0;i<f.length;i++){u=f[i],l=u.getAttribute("data-href");if(l===n||l===o)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var n=t&&t.target&&t.target.src||o,s=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");s.code="CSS_CHUNK_LOAD_FAILED",s.request=n,delete a[e],d.parentNode.removeChild(d),r(s)},d.href=o;var p=document.getElementsByTagName("head")[0];p.appendChild(d)})).then((function(){a[e]=0})));var n=o[e];if(0!==n)if(n)t.push(n[2]);else{var s=new Promise((function(t,r){n=o[e]=[t,r]}));t.push(n[2]=s);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,c.nc&&l.setAttribute("nonce",c.nc),l.src=i(e);var f=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(d);var r=o[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+n+": "+a+")",f.name="ChunkLoadError",f.type=n,f.request=a,r[1](f)}o[e]=void 0}};var d=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},c.m=e,c.c=n,c.d=function(e,t,r){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(c.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(r,n,function(t){return e[t]}.bind(null,n));return r},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/Vue-InsideroViewer/",c.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var f=0;f<u.length;f++)t(u[f]);var d=l;s.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"405e":function(e,t,r){},"56d7":function(e,t,r){"use strict";r.r(t);var n=r("1da1"),a=(r("e260"),r("e6cf"),r("cca6"),r("a79d"),r("96cf"),r("2b0e")),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("SiteNav"),r("router-view")],1)},s=[],i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-sidebar",{attrs:{id:"sidebar-nav","backdrop-variant":"dark","no-close-on-route-change":!this.$isMobile(),title:"Insidero Viewer",shadow:""}},[r("div",{staticClass:"p-2"},[r("b-button-group",{staticClass:"mt-1 ml-3"},e._l(e.propertyStates,(function(t){return r("b-button",{key:t.text,staticClass:"py-1 px-2",attrs:{variant:"outline-primary",pressed:t.value===e.activeFilter||null==e.activeFilter&&"all"===t.value},on:{click:function(r){return e.setState(t)}}},[e._v(" "+e._s(t.text)+" ")])})),1),r("b-button-group",{staticClass:"mt-2 ml-3"},e._l(e.propertyTypes,(function(t){return r("b-button",{key:t.text,staticClass:"py-1 px-2",attrs:{variant:"outline-primary",pressed:t.value===e.propertyType||null==e.propertyType&&"all"===t.value},on:{click:function(r){return e.setCategory(t)}}},[e._v(" "+e._s(t.text)+" ")])})),1),r("b-form-group",{staticClass:"mt-3 ml-3 mr-4",attrs:{label:"Min space","label-for":"space_min"}},[r("b-form-input",{attrs:{id:"space_min",placeholder:"Min m2",type:"number",min:"0"},model:{value:e.spaceMin,callback:function(t){e.spaceMin=t},expression:"spaceMin"}})],1),e.hasSavedLocations?r("nav",{staticClass:"mt-4"},[r("b-nav",{attrs:{vertical:"",pills:""}},e._l(e.savedLocationsArray,(function(t){return r("b-nav-item",{key:t.city.value,attrs:{active:e.isLocationActive(t)},on:{click:function(r){return e.setLocation(t)}}},[e._v(" "+e._s(e.getLocationDisplayName(t))+" ")])})),1)],1):e._e(),r("hr",{staticClass:"my-3"}),e.isAuthenticated?r("nav",{staticClass:"mt-4"},[r("b-nav",{attrs:{vertical:"",pills:""}},[r("b-nav-item",{attrs:{to:{path:"settings"},active:"/settings"===e.$route.path}},[e._v(" Settings ")]),r("b-nav-item",{directives:[{name:"b-toggle",rawName:"v-b-toggle:sidebar-nav",arg:"sidebar-nav"}],on:{click:function(t){return e.logout()}}},[e._v("Sign Out")])],1)],1):e._e()],1)]),r("b-navbar",{attrs:{toggleable:"md",type:"dark",variant:"primary"}},[r("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle.sidebar-nav",modifiers:{"sidebar-nav":!0}}],staticClass:"mr-4",attrs:{variant:"outline-light"}},[r("b-icon",{attrs:{icon:"list"}})],1),r("b-navbar-brand",{attrs:{to:{path:"/"}}},[e._v("Insidero Viewer")])],1)],1)},c=[],u=r("5530"),l=(r("99af"),r("2f62")),f=r("2ef0"),d=r.n(f),p={data:function(){return{propertyTypes:[{text:"House",value:"house"},{text:"Flat",value:"flat"},{text:"Land",value:"land"},{text:"All",value:"all"}],propertyStates:[{text:"Active",value:"true"},{text:"Inactive",value:"false"},{text:"All",value:"all"}],spaceMin:this.$store.getters.spaceMin}},computed:Object(u["a"])({},Object(l["b"])(["savedLocationsArray","hasSavedLocations","isAuthenticated","isAnonymousUser","activeFilter","propertyType"])),watch:{spaceMin:function(e,t){this.setSpaceMinDebounced(e)}},methods:{setSpaceMinDebounced:d.a.debounce(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$store.dispatch("setSearchParams",{spaceMin:t});case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),500),setLocation:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("setSearchParams",{country:e.country.value,region:e.region.value,city:e.city.value,neighborhood:null===(n=e.neighborhood)||void 0===n?void 0:n.value});case 2:case"end":return r.stop()}}),r)})))()},setCategory:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("setSearchParams",{propertyType:e.value});case 2:case"end":return r.stop()}}),r)})))()},setState:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("setSearchParams",{activeFilter:e.value});case 2:case"end":return r.stop()}}),r)})))()},logout:function(){this.$store.dispatch("logout")},isLocationActive:function(e){var t,r,n,a,o=!0,s=this.$store.getters.searchParams;(s.country||e.country)&&(o=o&&(null===(t=e.country)||void 0===t?void 0:t.value)==s.country);(s.region||e.region)&&(o=o&&(null===(r=e.region)||void 0===r?void 0:r.value)==s.region);(s.city||e.city)&&(o=o&&(null===(n=e.city)||void 0===n?void 0:n.value)==s.city);(s.neighborhood||e.neighborhood)&&(o=o&&(null===(a=e.neighborhood)||void 0===a?void 0:a.value)==s.neighborhood);return o},getLocationDisplayName:function(e){return e.neighborhood?"".concat(e.city.text," -> ").concat(e.neighborhood.text):e.city?"".concat(e.city.text):e.region?"".concat(e.region.text):"".concat(e.country.text)}}},h=p,v=r("2877"),m=Object(v["a"])(h,i,c,!1,null,null,null),g=m.exports,b={name:"App",components:{SiteNav:g}},y=b,w=Object(v["a"])(y,o,s,!1,null,null,null),O=w.exports,x=(r("4ec9"),r("d3b7"),r("3ca3"),r("ddb0"),r("e9c4"),r("159b"),r("b64b"),r("25f0"),r("9861"),r("07ac"),r("a630"),r("4e82"),r("d81d"),r("fb6a"),r("ac1f"),r("1276"),r("b0c0"),r("dc59")),k=r("8c4f"),S=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("b-container",[r("b-modal",{attrs:{id:"modalEmbed",size:"xl","ok-only":"","hide-header":""},scopedSlots:e._u([{key:"modal-footer",fn:function(){return[null!=e.selectedOffer?r("b-button",{attrs:{variant:e.selectedOffer.archived?"dark":"outline-dark",size:"sm"},on:{click:function(t){return e.toggleArchive(e.selectedOffer)}}},[r("b-icon",{attrs:{icon:"archive"}})],1):e._e(),null!=e.selectedOffer?r("b-button",{attrs:{variant:e.selectedOffer.favorite?"primary":"outline-primary",size:"sm"},on:{click:function(t){return e.toggleFavorite(e.selectedOffer)}}},[r("b-icon",{attrs:{icon:"heart"}})],1):e._e(),null!=e.selectedOffer?r("b-button",{attrs:{variant:"primary",size:"sm"},on:{click:function(t){return e.closeModal()}}},[e._v(" OK ")]):e._e()]},proxy:!0}])},[r("b-embed",{attrs:{type:"iframe",aspect:"16by9",src:e.selectedOfferUrl,allowfullscreen:""}})],1),(e.parsedOffers.favorites||[]).length>0?r("h5",{staticClass:"mt-4"},[e._v("Favorites")]):e._e(),(e.parsedOffers.favorites||[]).length>0?r("OffersTable",{attrs:{offers:e.parsedOffers.favorites}}):e._e(),(e.parsedOffers.new||[]).length>0?r("h5",{staticClass:"mt-4"},[e._v("New")]):e._e(),(e.parsedOffers.new||[]).length>0?r("OffersTable",{attrs:{offers:e.parsedOffers.new}}):e._e(),(e.parsedOffers.seen||[]).length>0?r("h5",{staticClass:"mt-4"},[e._v("Seen")]):e._e(),(e.parsedOffers.seen||[]).length>0?r("OffersTable",{attrs:{offers:e.parsedOffers.seen}}):e._e(),(e.parsedOffers.trash||[]).length>0?r("h5",{staticClass:"mt-4"},[e._v("Trash")]):e._e(),(e.parsedOffers.trash||[]).length>0?r("OffersTable",{attrs:{offers:e.parsedOffers.trash}}):e._e()],1)},R=[],j=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("b-table",{ref:"table",attrs:{items:e.offers,fields:e.fields,"sort-by":e.sortBy,"sort-desc":e.sortDesc,busy:e.offersLoading,selectable:"","select-mode":"single",small:"",hover:"",striped:"",stacked:"sm"},on:{"update:sortBy":function(t){e.sortBy=t},"update:sort-by":function(t){e.sortBy=t},"update:sortDesc":function(t){e.sortDesc=t},"update:sort-desc":function(t){e.sortDesc=t},"row-clicked":function(t){return e.$set(t,"_showDetails",!t._showDetails)}},scopedSlots:e._u([{key:"cell(address)",fn:function(t){return[t.item.urls.length>0?r("b-link",{attrs:{href:t.item.urls[0].url}},[e._v(" "+e._s(t.item.address))]):e._e()]}},{key:"cell(controls)",fn:function(t){return[r("b-button",{attrs:{size:"sm",variant:t.item.favorite?"primary":"outline-primary"},on:{click:function(r){return e.toggleFavorite(t.item)}}},[r("b-icon",{attrs:{icon:"heart"}})],1),r("b-button",{staticClass:"ml-2",attrs:{size:"sm",variant:t.item.trash?"dark":"outline-dark"},on:{click:function(r){return e.toggleTrash(t.item)}}},[r("b-icon",{attrs:{icon:"trash"}})],1)]}},{key:"row-details",fn:function(t){return[r("b-row",[e.getUrls(t.item).length>0?r("b-col",{attrs:{cols:"12",sm:"6","no-gutters":""}},[r("b-card",[r("b-table",{attrs:{items:e.getUrls(t.item),fields:[{key:"url",name:"url",tdClass:"truncate"}]},scopedSlots:e._u([{key:"cell(url)",fn:function(t){return[r("b-link",{attrs:{target:"_blank",rel:"noopener noreferrer",href:""+t.value}},[e._v(e._s(t.value)+" ")])]}}],null,!0)})],1)],1):e._e(),t.item.prices?r("b-col",{attrs:{cols:"12",sm:"6","no-gutters":""}},[r("b-card",[r("b-table",{attrs:{items:t.item.prices,"thead-class":"hidden_header"}})],1)],1):e._e(),t.item.updates?r("b-col",{attrs:{cols:"12",sm:"6","no-gutters":""}},[r("b-card",[r("b-table",{attrs:{items:t.item.updates,"thead-class":"hidden_header"}})],1)],1):e._e()],1)]}}])})},P=[],_={name:"OffersTable",props:{offers:{}},data:function(){return{sortBy:"updated",sortDesc:!0,fields:[{key:"address",sortable:!1},{key:"current_price",sortable:!0,label:"Price"},{key:"published",sortable:!0},{key:"updated",sortable:!0},{key:"type",sortable:!1},{key:"rooms",sortable:!1},{key:"space",sortable:!0},{key:"land",sortable:!0},{key:"controls",sortable:!1,label:""}]}},computed:Object(u["a"])({},Object(l["b"])(["offersLoading"])),methods:{getUrls:function(e){return console.log(e),e.urls.length>0?e.urls:e.allUrls},showEmbeddedPage:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:t.$refs.table.selectRow(t.$refs.table.sortedItems.indexOf(e)),t.$store.dispatch("setSelectedOffer",e);case 2:case"end":return r.stop()}}),r)})))()},toggleFavorite:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("insertOrUpdateOfferState",{id:e.id,favorite:!e.favorite});case 2:case"end":return r.stop()}}),r)})))()},toggleTrash:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("insertOrUpdateOfferState",{id:e.id,trash:!e.trash});case 2:case"end":return r.stop()}}),r)})))()}}},L=_,A=(r("83ae"),Object(v["a"])(L,j,P,!1,null,null,null)),U=A.exports,C={name:"Offers",components:{OffersTable:U},data:function(){return{selectedOfferUrl:""}},computed:Object(u["a"])(Object(u["a"])({},Object(l["c"])(["userProfile"])),Object(l["b"])(["parsedOffers","offersLoading","selectedOffer"])),watch:{selectedOffer:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:window.open(t.urls[0].url,"_blank");case 1:case"end":return e.stop()}}),e)})));function t(t,r){return e.apply(this,arguments)}return t}()},mounted:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$store.dispatch("fetchOffers");case 2:case"end":return t.stop()}}),t)})))()},methods:{hasSelectedOfferMoreUrls:function(e){},getSelectedOfferSortedUrls:function(e){},navigateToSelectedOfferNextUrl:function(e){},toggleFavorite:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("insertOrUpdateOfferState",{id:e.id,favorite:!e.favorite});case 2:return r.next=4,t.closeModal();case 4:case"end":return r.stop()}}),r)})))()},toggleTrash:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("insertOrUpdateOfferState",{id:e.id,trash:!e.trash});case 2:return r.next=4,t.closeModal();case 4:case"end":return r.stop()}}),r)})))()},closeModal:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$store.dispatch("setSelectedOffer",null);case 2:case"end":return t.stop()}}),t)})))()}}},M=C,T=Object(v["a"])(M,S,R,!1,null,null,null),E=T.exports;a["default"].use(k["a"]);var F=[{path:"/",name:"Dashboard",component:E,meta:{requiresAuth:!0}},{path:"/offers",name:"Dashboard",component:E,meta:{requiresAuth:!0}},{path:"/login",name:"Login",component:function(){return r.e("login").then(r.bind(null,"013f"))}},{path:"/settings",name:"settings",component:function(){return r.e("settings").then(r.bind(null,"b41f"))},meta:{requiresAuth:!0}}],$=new k["a"]({mode:"history",base:"/Vue-InsideroViewer/",routes:F});$.beforeEach((function(e,t,r){var n=e.matched.some((function(e){return e.meta.requiresAuth})),a=null!=x["a"].currentUser;!n||a?"/"===e.path&&a?N.getters.hasSavedLocations?r({path:"/offers"}):r({path:"/settings"}):r():r("/login")}));var K=r("bc3a"),D=r.n(K);a["default"].use(l["a"]);var N=new l["a"].Store({state:{apiKey:"",searchParams:{country:"",region:"",city:"",neighborhood:"",spaceMin:75,propertyType:"all",activeFilter:"all"},offersLoading:!1,offersHistory:new Map,savedLocations:new Map,browsingHistory:new Map,rawOffers:{},parsedOffers:{favorites:[],new:[],seen:[],trash:[]},selectedOffer:{},locationSearchCountries:[],locationSearchRegions:[],locationSearchCities:[],locationSearchNeighborhoods:[]},mutations:{setApiKey:function(e,t){e.apiKey=t},setSearchParams:function(e,t){a["default"].set(e,"searchParams",t)},setOffersLoading:function(e,t){e.offersLoading=t},setOffersHistory:function(e,t){a["default"].set(e,"offersHistory",t)},setSavedLocations:function(e,t){a["default"].set(e,"savedLocations",t)},setBrowsingHistory:function(e,t){a["default"].set(e,"browsingHistory",t)},setRawOffers:function(e,t){a["default"].set(e,"rawOffers",t)},setParsedOffers:function(e,t){a["default"].set(e,"parsedOffers",t)},setSelectedOffer:function(e,t){e.selectedOffer=t},setLocationSearchCountries:function(e,t){a["default"].set(e,"locationSearchCountries",t)},setLocationSearchRegions:function(e,t){a["default"].set(e,"locationSearchRegions",t)},setLocationSearchCities:function(e,t){a["default"].set(e,"locationSearchCities",t)},setLocationSearchNeighborhoods:function(e,t){a["default"].set(e,"locationSearchNeighborhoods",t)}},actions:{signInAnonymously:function(e){return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.dispatch,t.next=3,x["a"].signInAnonymously();case 3:n=t.sent,n.user,r("fetchUserProfile");case 6:case"end":return t.stop()}}),t)})))()},signInWithEmailAndPassword:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.dispatch,r.next=3,x["a"].signInWithEmailAndPassword(t.email,t.password);case 3:a=r.sent,a.user,n("fetchUserProfile");case 6:case"end":return r.stop()}}),r)})))()},signUpWithEmailAndPassword:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.dispatch,r.next=3,x["a"].createUserWithEmailAndPassword(t.email,t.password);case 3:a=r.sent,a.user,n("fetchUserProfile");case 6:case"end":return r.stop()}}),r)})))()},createAccountForAnonymousUser:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.dispatch,a=x["b"].EmailAuthProvider.credential(t.email,t.password),r.next=4,x["a"].currentUser.linkWithCredential(a);case 4:o=r.sent,o.user,n("fetchUserProfile");case 7:case"end":return r.stop()}}),r)})))()},changeUserPassword:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return e.dispatch,e.state,n=x["b"].EmailAuthProvider.credential(x["a"].currentUser.email,t.currentPassword),r.next=4,x["a"].currentUser.reauthenticateWithCredential(n);case 4:case"end":return r.stop()}}),r)})))()},fetchUserProfile:function(e){return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,n,a,o,s,i,c,u,l,f,d;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return u=e.commit,l=e.dispatch,t.next=3,x["c"]().get();case 3:return f=t.sent,u("setApiKey",f.data().apiKey),t.next=7,l("fetchOffersHistory");case 7:return t.next=9,l("fetchSavedLocations");case 9:if(d={spaceMin:(null===(r=f.data().searchParams)||void 0===r?void 0:r.spaceMin)||80,propertyType:(null===(n=f.data().searchParams)||void 0===n?void 0:n.propertyType)||"all",activeFilter:(null===(a=f.data().searchParams)||void 0===a?void 0:a.activeFilter)||"all",country:(null===(o=f.data().searchParams)||void 0===o?void 0:o.country)||"",region:(null===(s=f.data().searchParams)||void 0===s?void 0:s.region)||"",city:(null===(i=f.data().searchParams)||void 0===i?void 0:i.city)||"",neighborhood:(null===(c=f.data().searchParams)||void 0===c?void 0:c.neighborhood)||""},u("setSearchParams",d),"/login"!==$.currentRoute.path){t.next=14;break}return t.next=14,$.push("/");case 14:case"end":return t.stop()}}),t)})))()},logout:function(e){return Object(n["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.commit,t.next=3,x["a"].signOut();case 3:return r("setApiKey",""),r("setSearchParams",{}),t.next=7,$.push("/login");case 7:case"end":return t.stop()}}),t)})))()},setApiKey:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.commit,n("setApiKey",t),r.next=4,x["c"]().set({apiKey:t},{merge:!0});case 4:case"end":return r.stop()}}),r)})))()},setSearchParams:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o,s;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.commit,a=e.dispatch,o=e.state,console.log("setSearchParams action: ".concat(JSON.stringify(t))),s=Object(u["a"])(Object(u["a"])({},o.searchParams),t),n("setSearchParams",s),Object.keys(t).forEach((function(e){return(null==t[e]||void 0===t[e])&&delete t[e]})),r.next=7,x["c"]().set({searchParams:t},{merge:!0});case 7:return r.next=9,a("fetchOffers");case 9:case"end":return r.stop()}}),r)})))()},setSelectedOffer:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:n=e.commit,n("setSelectedOffer",t);case 2:case"end":return r.stop()}}),r)})))()},insertOrUpdateOfferState:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o,s,i,c,u,l,f,d;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return o=e.dispatch,s=e.commit,i=e.state,c=e.getters,s("setOffersLoading",!0),r.next=4,x["h"]().doc("".concat(t.id)).set(t,{merge:!0});case 4:return r.next=6,o("fetchOffersHistory");case 6:return u=I(c.searchParams),r.next=9,x["g"]().doc(u).get();case 9:l=r.sent,f=null!==(n=null===l||void 0===l||null===(a=l.data())||void 0===a?void 0:a.lastOpened)&&void 0!==n?n:0,d=z(i.rawOffers,i.offersHistory,f),s("setParsedOffers",d),s("setOffersLoading",!1);case 14:case"end":return r.stop()}}),r)})))()},fetchOffersHistory:function(e){return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.commit,t.next=3,x["e"]();case 3:n=t.sent,r("setOffersHistory",n);case 5:case"end":return t.stop()}}),t)})))()},insertOrUpdateSavedLocation:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o,s,i,c;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return i=e.dispatch,c="".concat(null===(n=t.country)||void 0===n?void 0:n.value,"-").concat(null===(a=t.region)||void 0===a?void 0:a.value,"-").concat(null===(o=t.city)||void 0===o?void 0:o.value,"-").concat(null===(s=t.neighborhood)||void 0===s?void 0:s.value),r.next=4,x["i"]().doc(c).set(t,{merge:!0});case 4:return r.next=6,i("fetchSavedLocations");case 6:case"end":return r.stop()}}),r)})))()},fetchSavedLocations:function(e){return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.commit,t.next=3,x["f"]();case 3:n=t.sent,r("setSavedLocations",n);case 5:case"end":return t.stop()}}),t)})))()},deleteSavedLocation:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o,s,i,c;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return i=e.dispatch,c="".concat(null===(n=t.country)||void 0===n?void 0:n.value,"-").concat(null===(a=t.region)||void 0===a?void 0:a.value,"-").concat(null===(o=t.city)||void 0===o?void 0:o.value,"-").concat(null===(s=t.neighborhood)||void 0===s?void 0:s.value),r.next=4,x["d"](c);case 4:return r.next=6,i("fetchSavedLocations");case 6:case"end":return r.stop()}}),r)})))()},fetchOffers:function(e){return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,n,a,o,s,i,c,u,l,f,d,p,h,v,m;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(r=e.commit,n=e.state,a=e.getters,!n.apiKey){t.next=27;break}return r("setOffersLoading",!0),o={api_key:n.apiKey,country:n.searchParams.country,region:n.searchParams.region,city:n.searchParams.city,neighborhood:n.searchParams.neighborhood,type:"all"===n.searchParams.propertyType?null:n.searchParams.propertyType,active:"all"===n.searchParams.activeFilter?null:n.searchParams.activeFilter,spaceMin:n.searchParams.spaceMin,limit:250,sortBy:"id",offer:"sell"},Object.keys(o).forEach((function(e){return(null==o[e]||void 0==o[e]||""==o[e])&&delete o[e]})),s=new URLSearchParams(o).toString(),i="/offers?"+s,t.prev=7,l=Date.now(),t.next=11,D.a.get(i);case 11:return f=t.sent,d=f["data"]["results"],console.log("New offers received: ".concat(Object.keys(d).length," and it took ").concat(Date.now()-l,"ms")),l=Date.now(),p=I(a.searchParams),t.next=18,x["g"]().doc(p).get();case 18:h=t.sent,v=null!==(c=null===h||void 0===h||null===(u=h.data())||void 0===u?void 0:u.lastOpened)&&void 0!==c?c:0,m=z(Object.values(d),n.offersHistory,v),r("setRawOffers",Object.values(d)),r("setParsedOffers",m),x["g"]().doc(p).set({lastOpened:Date.now()},{merge:!0});case 24:return t.prev=24,r("setOffersLoading",!1),t.finish(24);case 27:case"end":return t.stop()}}),t,null,[[7,,24,27]])})))()},fetchCountries:function(e){return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.commit,n=e.state,t.next=3,H("/countries",{api_key:n.apiKey});case 3:a=t.sent,a&&r("setLocationSearchCountries",a);case 5:case"end":return t.stop()}}),t)})))()},fetchRegions:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.commit,a=e.state,r.next=3,H("/regions",Object(u["a"])({api_key:a.apiKey},t));case 3:o=r.sent,o&&n("setLocationSearchRegions",o);case 5:case"end":return r.stop()}}),r)})))()},fetchCities:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.commit,a=e.state,r.next=3,H("/cities",Object(u["a"])({api_key:a.apiKey},t));case 3:o=r.sent,o&&n("setLocationSearchCities",o);case 5:case"end":return r.stop()}}),r)})))()},fetchNeighborhoods:function(e,t){return Object(n["a"])(regeneratorRuntime.mark((function r(){var n,a,o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return n=e.commit,a=e.state,r.next=3,H("/neighborhoods",Object(u["a"])({api_key:a.apiKey},t));case 3:o=r.sent,o&&n("setLocationSearchNeighborhoods",o);case 5:case"end":return r.stop()}}),r)})))()}},getters:{userApiKey:function(e){return e.apiKey},searchParams:function(e){return e.searchParams},offersLoading:function(e){return e.offersLoading},selectedOffer:function(e){return e.selectedOffer},spaceMin:function(e){return e.searchParams.spaceMin},propertyType:function(e){return e.searchParams.propertyType},activeFilter:function(e){return e.searchParams.activeFilter},hasSavedLocations:function(e){return e.savedLocations.size>0},savedLocations:function(e){return e.savedLocations||new Map},savedLocationsArray:function(e){var t=Array.from(e.savedLocations.values());return t.sort((function(e,t){return e.order-t.order})),t},parsedOffers:function(e){return e.parsedOffers},isAuthenticated:function(e){return""!=e.apiKey&&null!=x["a"].currentUser},isAnonymousUser:function(e){var t;return""!=e.apiKey&&(null===(t=x["a"].currentUser)||void 0===t?void 0:t.isAnonymous)}}});function I(e){var t,r,n,a,o,s;return"".concat(null!==(t=e.country)&&void 0!==t?t:"","-").concat(null!==(r=e.region)&&void 0!==r?r:"","-").concat(null!==(n=e.city)&&void 0!==n?n:"","-").concat(null!==(a=e.neighborhood)&&void 0!==a?a:"","-").concat(null!==(o=e.propertyType)&&void 0!==o?o:"","-").concat(null!==(s=e.activeFilter)&&void 0!==s?s:"")}function H(e,t){return B.apply(this,arguments)}function B(){return B=Object(n["a"])(regeneratorRuntime.mark((function e(t,r){var n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return Object.keys(r).forEach((function(e){return null==r[e]&&delete r[e]})),n=new URLSearchParams(r).toString(),e.next=4,D.a.get(t+"?"+n);case 4:return a=e.sent,e.abrupt("return",Object.values(a.data.results).map((function(e){return{value:e["general"]["id"],text:e["general"]["name"]}})));case 6:case"end":return e.stop()}}),e)}))),B.apply(this,arguments)}function z(e,t,r){var n={favorites:[],new:[],seen:[],trash:[]};return e.forEach((function(e){var a,o,s,i,c,u,l,f,d,p,h,v,m,g,b=e["general"]["id"],y=e["general"]["subtype"]||e["general"]["type"];"commercial"===y?y="comm":"parkingSpot"===y&&(y="parking");var w=e["price"],O=w?"".concat(w["current"]," ").concat(w["currency"]):"",x=w?w["max"]-w["current"]:null,k=x?"(-".concat(Math.round(x/w["max"]*1e3)/10,"%)"):"",S=w?[{type:"Min",price:"".concat(w["min"]," ").concat(w["currency"])},{type:"Max",price:"".concat(w["max"]," ").concat(w["currency"])},{type:"Current",price:"".concat(O," ").concat(k)},{type:"PSQ",price:"".concat(w["perSquareMeter"]," ").concat(w["currency"])}]:null,R=e["events"],j=R?R["visibility"]["0"]["date"]:null,P=R&&R["dataUpdates"]?R["dataUpdates"].map((function(e){return{date:e.date,type:e.type,value:"".concat(e.value.old," -> ").concat(e.value.new)}})):[],_=P.length>0?P.slice(-1)[0]["date"]:j,L=e["space"],A=(null===L||void 0===L||null===(a=L.room)||void 0===a?void 0:a.full)||"",U=null!==L&&void 0!==L&&L.room?"".concat((null===L||void 0===L||null===(o=L.room)||void 0===o?void 0:o.min)||"","/").concat((null===L||void 0===L||null===(s=L.room)||void 0===s?void 0:s.max)||"","/").concat(A):null,C=null!==L&&void 0!==L&&L.usable?"".concat(L["usable"]["min"],"m2"):null,M=null!==L&&void 0!==L&&L.land?"".concat(L["land"]["min"],"m2"):null,T=e["geography"]?e["geography"]["coordinates"][0]:null,E=T?{lat:parseFloat(T.split(",")[0]),lng:parseFloat(T.split(",")[1])}:null,F=E?{id:b,position:E}:null,$=null===(i=e["geography"])||void 0===i||null===(c=i.readable)||void 0===c?void 0:c.street,K=null===(u=e["geography"])||void 0===u||null===(l=u.readable)||void 0===l?void 0:l.neighborhood,D=null===(f=e["geography"])||void 0===f||null===(d=f.readable)||void 0===d?void 0:d.city,N="".concat(K||$||D||""),I=null!==(p=e["urls"]["activeUrls"].map((function(e){return{url:e}})))&&void 0!==p?p:[],H=null!==(h=e["urls"]["allUrls"].map((function(e){return{url:e}})))&&void 0!==h?h:[],B=t.get("".concat(b)),z={id:b,current_price:O,published:j,updated:_,updates:P,type:y,rooms:U,space:C,land:M,favorite:null!==(v=null===B||void 0===B?void 0:B.favorite)&&void 0!==v&&v,archived:null!==(m=null===B||void 0===B?void 0:B.archived)&&void 0!==m&&m,trash:null!==(g=null===B||void 0===B?void 0:B.trash)&&void 0!==g&&g,prices:S,marker:F,address:N,urls:I,allUrls:H};z.favorite?n.favorites.push(z):z.trash?n.trash.push(z):r-new Date(_).getTime()<0?n.new.push(z):n.seen.push(z)})),n}var q,V=r("ba48"),W=r.n(V),Z=r("5f5b"),J=r("b1e0"),G=(r("de82"),r("9955")),Q=r.n(G);a["default"].use(Z["a"]),a["default"].use(J["a"]),D.a.defaults.baseURL="https://api.insidero.com/v3",D.a.defaults.timeout=3e4,a["default"].use(W.a),a["default"].use(Q.a,{lodash:d.a}),a["default"].config.productionTip=!1,x["a"].onAuthStateChanged(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t){e.next=3;break}return e.next=3,N.dispatch("fetchUserProfile",t);case 3:q||(q=new a["default"]({router:$,store:N,render:function(e){return e(O)}}).$mount("#app"));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())},"83ae":function(e,t,r){"use strict";r("405e")},dc59:function(e,t,r){"use strict";r.d(t,"a",(function(){return i})),r.d(t,"b",(function(){return c})),r.d(t,"c",(function(){return u})),r.d(t,"h",(function(){return l})),r.d(t,"e",(function(){return p})),r.d(t,"i",(function(){return f})),r.d(t,"f",(function(){return v})),r.d(t,"d",(function(){return g})),r.d(t,"g",(function(){return d}));var n=r("1da1"),a=(r("96cf"),r("4ec9"),r("d3b7"),r("3ca3"),r("ddb0"),r("159b"),r("260b")),o=(r("ea7b"),r("e71f"),{apiKey:"AIzaSyBZwhyuBZh0IpaZRSIv5N0FFYqCtZBSMVE",authDomain:"insideroviewer.firebaseapp.com",projectId:"insideroviewer",storageBucket:"insideroviewer.appspot.com",messagingSenderId:"72743309203",appId:"1:72743309203:web:01134561f8400403082266",measurementId:"G-PT3FG19EPZ"});a["a"].initializeApp(o);var s=a["a"].firestore(),i=a["a"].auth(),c=a["a"].auth;function u(){return s.collection("users").doc(i.currentUser.uid)}function l(){return u().collection("offersHistory")}function f(){return u().collection("savedLocations")}function d(){return u().collection("browsingHistory")}function p(){return h.apply(this,arguments)}function h(){return h=Object(n["a"])(regeneratorRuntime.mark((function e(){var t,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,l().get();case 2:return t=e.sent,r=new Map,t.forEach((function(e){r.set(e.id,e.data())})),e.abrupt("return",r);case 6:case"end":return e.stop()}}),e)}))),h.apply(this,arguments)}function v(){return m.apply(this,arguments)}function m(){return m=Object(n["a"])(regeneratorRuntime.mark((function e(){var t,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,f().get();case 2:return t=e.sent,r=new Map,t.forEach((function(e){r.set(e.id,e.data())})),e.abrupt("return",r);case 6:case"end":return e.stop()}}),e)}))),m.apply(this,arguments)}function g(e){return b.apply(this,arguments)}function b(){return b=Object(n["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,f().doc(t).delete();case 2:case"end":return e.stop()}}),e)}))),b.apply(this,arguments)}},de82:function(e,t,r){}});
//# sourceMappingURL=app.1b3d9063.js.map