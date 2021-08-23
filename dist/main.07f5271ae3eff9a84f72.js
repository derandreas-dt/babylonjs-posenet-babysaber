(()=>{var e,t={3607:function(e,t,i){"use strict";var o=this&&this.__awaiter||function(e,t,i,o){return new(i||(i=Promise))((function(r,n){function s(e){try{l(o.next(e))}catch(e){n(e)}}function a(e){try{l(o.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(s,a)}l((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=i(4588),n=i(661),s=i(6182),a=i(559),l=i(221),c=i(2973),d=i(9018),h=i(3749),u=i(2080),g=i(4690),p=i(2749),w=i(1422),f=i(7344),v=i(4635),m=i(140),x=i(1168),y=i(4781);i(354);const b=i(1560),C=i(6388),S=i(6642),O=i(7243),E=i(6140),V=(i(2575).throttle(console.log,500),window.innerWidth),M=window.innerHeight;o(void 0,void 0,void 0,(function*(){try{const e=document.querySelector("#output"),t=document.querySelector("#camera"),i=yield w.setupCamera(t,800,600),o=new y.KeypointStore;o.set("outputEl",e),o.set("cameraEl",t),o.set("videoWidth",800),o.set("videoHeight",600),o.set("drawAxis",!1),o.set("drawOutput",!1),o.set("drawSkeleton",!1),o.set("fullScreen",!0),o.set("score",0);const A=new x.Posenet(i,e,o);yield A.load(),A.detect();const P=document.getElementById("view");P.width=V,P.height=M;const T=new n.Engine(P,!0),W=((e,t,i)=>{const o=new l.Scene(e),n=new r.ArcRotateCamera("camera",Math.PI/2,Math.PI/2,-20,new c.Vector3(0,0,0),o),w=(new s.HemisphericLight("light",new c.Vector3(0,1,0),o),new h.Sound("hit","hit28.wav",o));n.attachControl(t),o.onKeyboardObservable.add((e=>{if(e.type===b.KeyboardEventTypes.KEYDOWN){const r=e.event.key;"a"===r&&(i.set("drawAxis",!i.get("drawAxis")),u.toggleWorldAxis(o,i.get("drawAxis"))),"o"===r&&(i.set("drawOutput",!i.get("drawOutput")),i.get("outputEl").style.visible=i.get("drawOutput")?"visible":"hidden",i.get("outputEl").style.display=i.get("drawOutput")?"block":"none"),"s"===r&&i.set("drawSkeleton",!i.get("drawSkeleton")),"f"===r&&(i.set("fullScreen",!i.get("fullScreen")),i.get("fullScreen")?(i.set("videoWidth",800),i.set("videoHeight",600),t.width=window.innerWidth,t.height=window.innerHeight):(t.width=800,t.height=600))}})),p.createStage(o),g.addFreeCameraScroll(o),f.drawSkeleton(o,i,n);const x=[new b.Color3(0,0,1),new b.Color3(1,0,0),new b.Color3(0,1,0),new b.Color3(1,1,0),new b.Color3(0,1,1),new b.Color3(1,0,1)];new b.GlowLayer("glow",o).customEmissiveColorSelector=function(e,t,i,o){"box1"===e.name?o.copyFrom(e.material.emissiveColor.clone().toColor4(1)):"leftBox"===e.name||"rightBox"===e.name?o.set(1,1,1,1):o.set(0,0,0,0)};const y=C.AdvancedDynamicTexture.CreateFullscreenUI("UI"),V=new E.Rectangle;V.width=.2,V.height="40px",V.color="black",V.thickness=0,V.horizontalAlignment=S.Control.HORIZONTAL_ALIGNMENT_LEFT,V.verticalAlignment=S.Control.VERTICAL_ALIGNMENT_TOP,V.top="0px",V.left="0px";const M=new O.TextBlock("score");return M.text="Score 0",M.color="white",M.fontSize=24,V.addControl(M),y.addControl(V),function e(){var t=Math.round(4500*Math.random())+500;setTimeout((function(){(()=>{const e=a.MeshBuilder.CreateBox("box1",{width:1,height:1,depth:1},o);e.position=new c.Vector3(0,0,0),e.scaling=new c.Vector3(0,0,0);var t=new b.StandardMaterial("texture1",o);t.emissiveColor=x[Math.floor(Math.random()*x.length)].clone(),e.material=t;var r=new c.Vector3(d.Scalar.RandomRange(-3,3),d.Scalar.RandomRange(-3,3),-15);const n=new c.Vector3(1,1,1),s=new m.CircleEase;s.setEasingMode(m.EasingFunction.EASINGMODE_EASEIN),v.Animation.CreateAndStartAnimation("anim",e,"position",10,120,e.position,r,v.Animation.ANIMATIONLOOPMODE_CONSTANT,s),v.Animation.CreateAndStartAnimation("anim",e,"scaling",10,120,e.scaling,n,v.Animation.ANIMATIONLOOPMODE_CONSTANT,s),o.registerBeforeRender((()=>{const t=i.get("leftBox"),o=i.get("rightBox");e.isAlreadyHit||!e.intersectsMesh(t)&&!e.intersectsMesh(o)||(i.set("score",i.get("score")+1),M.text="Score "+i.get("score"),w.play(),e.isAlreadyHit=!0,e.setEnabled(!1),e.isVisible=!1,e.dispose()),e.position.z<-14&&(e.setEnabled(!1),e.dispose())}))})(),e()}),t)}(),o})(T,P,o);T.runRenderLoop((()=>{W.render()}))}catch(e){}}))},7344:(e,t,i)=>{"use strict";i.r(t),i.d(t,{drawSkeleton:()=>c});var o=i(1560),r=i(2973),n=i(2575);(0,n.throttle)(console.log,500),(0,n.throttle)(console.log,500);const s=new r.Vector3.Zero;let a=800,l=600;const c=(e,t,i)=>{t.set("scale",s.clone()),a=t.get("videoWidth"),l=t.get("videoHeight"),e.registerBeforeRender((()=>{const[r,n]=t.adjacent("leftShoulder","rightShoulder"),[s,a]=t.adjacent("leftHip","rightHip");t.set("scale",d(100,150,r,n,s,a,e,i)),o.MeshBuilder.CreateLines(null,{points:p(r,n,s,a),instance:h(e,t,"spline")}),u(e,t,"shoulders","leftShoulder","rightShoulder"),u(e,t,"basin","leftHip","rightHip"),u(e,t,"leftupperarm","leftShoulder","leftElbow"),u(e,t,"leftforearm","leftElbow","leftWrist"),u(e,t,"rightupperarm","rightShoulder","rightElbow"),u(e,t,"rightforearm","rightElbow","rightWrist"),u(e,t,"leftupperleg","leftHip","leftKnee"),u(e,t,"leftlowerleg","leftKnee","leftAnkle"),u(e,t,"rightupperleg","rightHip","rightKnee"),u(e,t,"rightlowerleg","rightKnee","rightAnkle");const l=h(e,t,"leftBox",!0),c=h(e,t,"rightBox",!0),[g,f]=t.adjacent("leftWrist","rightWrist");g&&f&&(l.position=w(g.x,g.y).multiply(t.get("scale")),c.position=w(f.x,f.y).multiply(t.get("scale")))}))},d=(e,t,i,o,n,s,a,l)=>{const c=a.getEngine(),d=a.getTransformMatrix(),h=l.viewport.toGlobal(c.getRenderWidth(),c.getRenderHeight()),u=r.Matrix.Identity(),p=g(i,o),w=g(n,s),f=r.Vector3.Project(p[0],u,d,h),v=r.Vector3.Project(p[1],u,d,h),m=r.Vector3.Project(w[1],u,d,h),x=f.subtract(v),y=f.subtract(m);return new r.Vector3(Math.abs(e/x.x),Math.abs(t/y.y),1)},h=(e,t,i,r=!1)=>{const n=t.get("scale");let a=t.get(i);return a||(r?(a=o.MeshBuilder.CreateBox(i,{size:.5,updatable:!0},e),a.visibility=.4,a.position=s):(a=o.MeshBuilder.CreateLines(i,{points:[s,s],updatable:!0},e),a.scaling=n.clone()),t.set(i,a)),r||(a.scaling=n.clone(),a.setEnabled(t.get("drawSkeleton"))),a},u=(e,t,i,r,n)=>{const[s,a]=t.adjacent(r,n);o.MeshBuilder.CreateLines(null,{points:g(s,a),instance:h(e,t,i)})},g=(e,t)=>e&&t?[w(e.x,e.y),w(t.x,t.y)]:[s,s],p=(e,t,i,o)=>e&&t&&i&&o?[w(e.x+(t.x-e.x)/2,e.y+(t.y-e.y)/2),w(i.x+(o.x-i.x)/2,i.y+(o.y-i.y)/2)]:g(),w=(e,t,i=-8)=>new r.Vector3(.5+(1-e)/a,.5+(1-t)/l,i)},2749:(e,t,i)=>{"use strict";i.r(t),i.d(t,{createStage:()=>n});var o=i(559),r=i(2973);const n=e=>{a(e,3),a(e,15,-15),s(e,3,15,-15)},s=(e,t,i,n)=>{o.MeshBuilder.CreateLines("l1",{points:[new r.Vector3(t/-2,t/-2,0),new r.Vector3(i/-2,i/-2,n)]},e,!0),o.MeshBuilder.CreateLines("l2",{points:[new r.Vector3(t/2,t/-2,0),new r.Vector3(i/2,i/-2,n)]},e,!0),o.MeshBuilder.CreateLines("l3",{points:[new r.Vector3(t/2,t/2,0),new r.Vector3(i/2,i/2,n)]},e,!0),o.MeshBuilder.CreateLines("l4",{points:[new r.Vector3(t/-2,t/2,0),new r.Vector3(i/-2,i/2,n)]},e,!0)},a=(e,t=1,i=0)=>{const n=o.MeshBuilder.CreateLines("fquad",{points:[new r.Vector3(0,0,i),new r.Vector3(t,0,i),new r.Vector3(t,t,i),new r.Vector3(0,t,i),new r.Vector3(0,0,i)]},e);return n.position=new r.Vector3(t/-2,t/-2,0),n}},2080:(e,t,i)=>{"use strict";i.r(t),i.d(t,{showWorldAxis:()=>l,toggleWorldAxis:()=>c});var o=i(7376),r=i(2131),n=i(2031),s=i(8362),a=i(2973);const l=(e,t)=>{const i=r.Kj.CreateSphere("axisCenterPoint",.01,0,e,!0),l=(t,i,a)=>{const l=new o.c("DynamicTexture",50,e,!0);l.hasAlpha=!0,l.drawText(t,5,40,"bold 36px Arial",i,"transparent",!0);const c=r.Kj.CreatePlane("TextPlane",a,e,!0);return c.material=new n.K("TextPlaneMaterial",e),c.material.backFaceCulling=!1,c.material.specularColor=new s.Wo(0,0,0),c.material.diffuseTexture=l,c},c=r.Kj.CreateLines("axisX",[a.Vector3.Zero(),new a.Vector3(t,0,0),new a.Vector3(.95*t,.05*t,0),new a.Vector3(t,0,0),new a.Vector3(.95*t,-.05*t,0)],e);c.color=new s.Wo(1,0,0);const d=l("X","red",t/10);d.position=new a.Vector3(.9*t,-.05*t,0);const h=r.Kj.CreateLines("axisY",[a.Vector3.Zero(),new a.Vector3(0,t,0),new a.Vector3(-.05*t,.95*t,0),new a.Vector3(0,t,0),new a.Vector3(.05*t,.95*t,0)],e);h.color=new s.Wo(0,1,0);const u=l("Y","green",t/10);u.position=new a.Vector3(0,.9*t,-.05*t);const g=r.Kj.CreateLines("axisZ",[a.Vector3.Zero(),new a.Vector3(0,0,t),new a.Vector3(0,-.05*t,.95*t),new a.Vector3(0,0,t),new a.Vector3(0,.05*t,.95*t)],e);g.color=new s.Wo(0,0,1);const p=l("Z","blue",t/10);p.position=new a.Vector3(0,.05*t,.9*t),c.parent=i,h.parent=i,g.parent=i,d.parent=i,u.parent=i,p.parent=i},c=(e,t=!1)=>{let i=e.getMeshByName("axisCenterPoint");i||(l(e,5),i=e.getMeshByName("axisCenterPoint")),i.visible=t?1:0,i.setEnabled(t)}},1422:(e,t,i)=>{"use strict";i.r(t),i.d(t,{setupCamera:()=>o});const o=async(e,t,i)=>{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");e.width=t,e.height=i;const o=await navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"user",width:t,height:i}});return e.srcObject=o,new Promise((t=>{e.onloadedmetadata=()=>{e.play(),t(e)}}))}},4690:(e,t,i)=>{"use strict";i.r(t),i.d(t,{addFreeCameraScroll:()=>n});var o=i(5441),r=i(9068);const n=e=>{e.onPrePointerObservable.add(((t,i)=>{const o=t.event;let n=0;if(o.wheelDelta?n=o.wheelDelta:o.detail&&(n=-o.detail),n){const t=e.activeCamera.getDirection(r.RD.Z);n>0?e.activeCamera.position.addInPlace(t):e.activeCamera.position.subtractInPlace(t)}}),o.kD.POINTERWHEEL,!1)}},1168:(e,t,i)=>{"use strict";i.r(t),i.d(t,{Posenet:()=>r});var o=i(6452);i(1241);class r{constructor(e,t,i){this.net=null,this.outputStride=16,this.imageScaleFactor=.5,this.minPoseConfidence=.2,this.minPartConfidence=.8,this.flipHorizontal=!0,this.videoWidth=i.get("videoWidth"),this.videoHeight=i.get("videoHeight"),this.video=e,this.output=t,this.output.width=this.videoWidth,this.output.height=this.videoHeight,this.ctxOutput=this.output.getContext("2d"),this.ctxOutput.width=this.videoWidth,this.ctxOutput.height=this.videoHeight,this.store=i}async load(){this.net=await o.zD()}async detect(){const e=async()=>{let t=[];const i=await this.net.estimateSinglePose(this.video,this.imageScaleFactor,this.flipHorizontal,this.outputStride);t.push(i),this.ctxOutput.clearRect(0,0,this.videoWidth,this.videoHeight),this.ctxOutput.save(),this.ctxOutput.drawImage(this.video,0,0,this.videoWidth,this.videoHeight),this.ctxOutput.restore(),t.forEach((({score:e,keypoints:t})=>{e>=this.minPoseConfidence?(this.updateStore(t),this.drawKeypoints(t)):this.updateStore(t,!0)})),requestAnimationFrame(e)};e()}updateStore(e,t){e.forEach((e=>this.store.set(e.part,t?0:e.position)))}drawPoint(e,t,i,o){this.ctxOutput.beginPath(),this.ctxOutput.arc(e,t,i,0,2*Math.PI),this.ctxOutput.fillStyle=o,this.ctxOutput.fill()}drawLine([e,t],[i,o],r,n){this.ctxOutput.beginPath(),this.ctxOutput.moveTo(e,t),this.ctxOutput.lineTo(i,o),this.ctxOutput.lineWidth=r,this.ctxOutput.strokeStyle=n,this.ctxOutput.stroke()}drawKeypoints(e){for(let t=0,i=e.length;t<i;++t){let i=e[t];if(i.score<this.minPartConfidence)continue;let{y:o,x:r}=i.position;this.drawPoint(r,o,5,"red")}}drawSkeleton(e){o._X(e,this.minPartConfidence).forEach((e=>{this.drawLine(n(e[0].position),n(e[1].position),5,"green")}))}}const n=({y:e,x:t})=>[t,e]},4781:(e,t,i)=>{"use strict";i.r(t),i.d(t,{KeypointStore:()=>o});class o{constructor(){this.data={nose:0,leftEye:0,rightEye:0,leftEar:0,rightEar:0,leftShoulder:0,rightShoulder:0,leftElbow:0,rightElbow:0,leftWrist:0,rightWrist:0,leftHip:0,rightHip:0,leftKnee:0,rightKnee:0,leftAnkle:0,rightAnkle:0}}set(e,t){this.data[e]=t}get(e){return this.data[e]}adjacent(e,t){const i=this.get(e),o=this.get(t);return i&&o?[i,o]:[]}findLeftRight(e){if("nose"===e)return this.get("nose");const t=e.charAt(0).toUpperCase()+e.slice(1).toLowerCase(),i=this.get("left"+t),o=this.get("right"+t);return i&&o?[i,o]:void 0}}},2575:(e,t,i)=>{"use strict";i.r(t),i.d(t,{throttle:()=>o});const o=(e,t)=>{var i=0;return function(...o){var r=new Date;r-i>=t&&(e(...o),i=r)}}},5410:()=>{},8628:()=>{},5042:()=>{}},i={};function o(e){var r=i[e];if(void 0!==r)return r.exports;var n=i[e]={id:e,loaded:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.loaded=!0,n.exports}o.m=t,o.amdD=function(){throw new Error("define cannot be used indirect")},o.amdO={},e=[],o.O=(t,i,r,n)=>{if(!i){var s=1/0;for(c=0;c<e.length;c++){for(var[i,r,n]=e[c],a=!0,l=0;l<i.length;l++)(!1&n||s>=n)&&Object.keys(o.O).every((e=>o.O[e](i[l])))?i.splice(l--,1):(a=!1,n<s&&(s=n));a&&(e.splice(c--,1),t=r())}return t}n=n||0;for(var c=e.length;c>0&&e[c-1][2]>n;c--)e[c]=e[c-1];e[c]=[i,r,n]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var i in t)o.o(t,i)&&!o.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={179:0};o.O.j=t=>0===e[t];var t=(t,i)=>{var r,n,[s,a,l]=i,c=0;for(r in a)o.o(a,r)&&(o.m[r]=a[r]);for(l&&l(o),t&&t(i);c<s.length;c++)n=s[c],o.o(e,n)&&e[n]&&e[n][0](),e[s[c]]=0;o.O()},i=self.webpackChunkbabylonjs_babysaber=self.webpackChunkbabylonjs_babysaber||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var r=o.O(void 0,[782],(()=>o(3607)));r=o.O(r)})();