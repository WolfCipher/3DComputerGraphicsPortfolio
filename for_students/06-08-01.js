// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";


let renderer = new T.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(500, 500);
document.getElementById("div1").appendChild(renderer.domElement);
renderer.domElement.id = "canvas";
renderer.shadowMap.enabled = true;

// student does the rest.

let carrot_texture = new T.TextureLoader().load("../images/carrot_texture.png");

let scene = new T.Scene();
let camera = new T.PerspectiveCamera();
camera.position.set(-12,20,24);
camera.lookAt(0,0,0);

let env = new T.TextureLoader().load("../images/snow.png");
env.mapping = T.EquirectangularReflectionMapping;
scene.background = env;

let controls = new OrbitControls(camera, renderer.domElement);

// light
let ambient = new T.AmbientLight("white",2);
scene.add(ambient);

let point = new T.PointLight("white",1,0,0);
point.castShadow = true;
point.position.set(20,30,20);

// Configure shadow settings
point.shadow.mapSize.width = 2048; // Increase shadow map resolution
point.shadow.mapSize.height = 2048;
point.shadow.camera.near = 1; // Set near clipping plane
point.shadow.camera.far = 100; // Set far clipping plane
point.shadow.bias = 0.0005; // Adjust bias to reduce artifacts

scene.add(point);

// ground base
let baseGeo = new T.BoxGeometry(50,0.5,50);
let snow = new T.MeshStandardMaterial({color: "#FFFFFF", roughness: 0.6});
let base = new T.Mesh(baseGeo, snow);
base.receiveShadow = true;
scene.add(base);

// snowman base
let snowmanBaseGeo = new T.SphereGeometry(4,32,32);
let snowmanBase1 = new T.Mesh(snowmanBaseGeo, snow);
snowmanBase1.receiveShadow = true;
snowmanBase1.castShadow = true;
snowmanBase1.position.set(0,2,0);

let snowmanBase2 = new T.Mesh(snowmanBaseGeo, snow);
snowmanBase2.receiveShadow = true;
snowmanBase2.castShadow = true;
snowmanBase2.position.set(0,6.75,0);
snowmanBase2.scale.set(0.8,0.8,0.8);

let snowmanBase3 = new T.Mesh(snowmanBaseGeo, snow);
snowmanBase3.receiveShadow = true;
snowmanBase3.castShadow = true;
snowmanBase3.position.set(0,10.75,0);
snowmanBase3.scale.set(0.6,0.6,0.6);

// snowman carrot nose
let carrotGeo = new T.ConeGeometry(0.5,2,32);
let carrotMaterial = new T.MeshStandardMaterial({color: "#FF6600", bumpMap: carrot_texture, bumpScale: 2});
let carrot = new T.Mesh(carrotGeo, carrotMaterial);
carrot.castShadow = true;
carrot.receiveShadow = true;
carrot.position.set(0,10.5,3);
carrot.rotation.set(Math.PI/2,0,0);

// snowman eyes
let coal = new T.CylinderGeometry(0.2,0.2,0.4,32);
let coalMaterial = new T.MeshStandardMaterial({color: "#101030"});
let eye1 = new T.Mesh(coal, coalMaterial);
eye1.castShadow = true;
eye1.receiveShadow = true;
eye1.position.set(-.8,11.5,2);
eye1.rotation.set(Math.PI/2,0,0);

let eye2 = new T.Mesh(coal, coalMaterial);
eye2.castShadow = true;
eye2.receiveShadow = true;
eye2.position.set(.8,11.5,2);
eye2.rotation.set(Math.PI/2,0,0);

// snowman mouth
let mouth = new T.Mesh(coal, coalMaterial);
mouth.castShadow = true;
mouth.receiveShadow = true;
mouth.position.set(0,9.75,2.1);
mouth.rotation.set(Math.PI/2,0,0);
mouth.scale.set(1.5,1,1);

// snowman buttons
let button1 = new T.Mesh(coal, coalMaterial);
button1.castShadow = true;
button1.receiveShadow = true;
button1.position.set(0,8.5,2.5);
button1.rotation.set(Math.PI/2-.5,0,0);

let button2 = new T.Mesh(coal, coalMaterial);
button2.castShadow = true;
button2.receiveShadow = true;
button2.position.set(0,7.5,3);
button2.rotation.set(Math.PI/2,0,0);

let button3 = new T.Mesh(coal, coalMaterial);
button3.castShadow = true;
button3.receiveShadow = true;
button3.position.set(0,6.5,3.1);
button3.rotation.set(Math.PI/2+.2,0,0);

// snowman arms
let armGeo = new T.CylinderGeometry(0.5,0.5,8,32);
let armMaterial = new T.MeshStandardMaterial({color: "#8B4513"});
let arm1 = new T.Mesh(armGeo, armMaterial);
arm1.castShadow = true;
arm1.receiveShadow = true;
arm1.position.set(-3,8,0);
arm1.rotation.set(0,0,Math.PI/4);

let arm2 = new T.Mesh(armGeo, armMaterial);
arm2.castShadow = true;
arm2.receiveShadow = true;
arm2.position.set(3,8,0);
arm2.rotation.set(0,0,-Math.PI/4);

// snowman hat
let hatGeo = new T.CylinderGeometry(2,1.75,3,32);
let hatMaterial = new T.MeshStandardMaterial({color: "#303030", side: T.DoubleSide, roughness: 1});
let hatBase = new T.Mesh(hatGeo, hatMaterial);
hatBase.castShadow = true;
hatBase.receiveShadow = true;
hatBase.position.set(0,14,0);

let hatRingGeo = new T.CylinderGeometry(3,3,0.2,32);
let hatRing = new T.Mesh(hatRingGeo, hatMaterial);
hatRing.castShadow = true;
hatRing.receiveShadow = true;
hatRing.position.set(0,12.5,0);

// create animation groups
let hat = new T.Group;
hat.add(hatBase);
hat.add(hatRing);

let head = new T.Group();
head.add(carrot);
head.add(eye1);
head.add(eye2);
head.add(mouth);
head.add(hat);
head.add(snowmanBase3);

let middle = new T.Group();
middle.add(snowmanBase2);
middle.add(arm1);
middle.add(arm2);
middle.add(button1);
middle.add(button2);
middle.add(button3);

let snowman = new T.Group();
snowman.add(snowmanBase1);
snowman.add(middle);
snowman.add(head);
snowman.position.set(-2,0,5);
scene.add(snowman);

// snow dog
let dogBase = new T.Mesh(snowmanBaseGeo, snow);
dogBase.scale.set(1,.75,1.5);
dogBase.receiveShadow = true;
dogBase.castShadow = true;
dogBase.position.set(3,2,7);

let dogMiddle = new T.Mesh(snowmanBaseGeo, snow);
dogMiddle.scale.set(0.6,0.6,0.9);
dogMiddle.receiveShadow = true;
dogMiddle.castShadow = true;
dogMiddle.position.set(0,-1,1);

let dogTop = new T.Mesh(snowmanBaseGeo, snow);
dogTop.scale.set(0.6,0.6,0.6);
dogTop.receiveShadow = true;
dogTop.castShadow = true;

// coal dog eyes
let dogEye1 = new T.Mesh(coal, coalMaterial);
dogEye1.castShadow = true;
dogEye1.receiveShadow = true;
dogEye1.position.set(-1,1.5,1.4);
dogEye1.rotation.set(Math.PI/4,0,Math.PI/4);
dogEye1.scale.set(1.5,1,1.5);

let dogEye2 = new T.Mesh(coal, coalMaterial);
dogEye2.castShadow = true;
dogEye2.receiveShadow = true;
dogEye2.position.set(1,1.5,1.4);
dogEye2.rotation.set(Math.PI/4,0,-Math.PI/4);
dogEye2.scale.set(1.5,1,1.5);

// dog coal nose
let dogNose = new T.Mesh(coal, coalMaterial);
dogNose.castShadow = true;
dogNose.receiveShadow = true;
dogNose.position.set(0,0.25,4);
dogNose.rotation.set(Math.PI/4,0,0);
dogNose.scale.set(1.5,1,1.5);

// dog carrot ears
let ear1 = new T.Mesh(carrotGeo, carrotMaterial);
ear1.castShadow = true;
ear1.receiveShadow = true;
ear1.position.set(-2,2,1);
ear1.rotation.set(Math.PI/4,0,Math.PI/4);

let ear2 = new T.Mesh(carrotGeo, carrotMaterial);
ear2.castShadow = true;
ear2.receiveShadow = true;
ear2.position.set(2,2,1);
ear2.rotation.set(Math.PI/4,0,-Math.PI/4);

// stick tail
let tailStick = new T.Mesh(armGeo, armMaterial);
tailStick.position.set(0, 2.5, -1);
tailStick.scale.set(1, 0.5, 1);
tailStick.castShadow = true;
tailStick.receiveShadow = true;

let tail = new T.Group();
tail.position.set(3,4,4);
tail.rotation.set(-Math.PI/4,0,0);
tail.add(tailStick);

let dogHead = new T.Group();
dogHead.add(dogMiddle);
dogHead.add(dogTop);
dogHead.add(ear1);
dogHead.add(ear2);
dogHead.add(dogEye1);
dogHead.add(dogEye2);
dogHead.add(dogNose);
dogHead.position.set(3,5,9);

let snowDog = new T.Group();
snowDog.add(dogBase);
snowDog.add(dogHead);
snowDog.add(tail);
snowDog.position.set(-14,0,6);
snowDog.rotation.set(0,Math.PI/4,0);
scene.add(snowDog);

function draw() {

    // move snowman in a circle
    let time = performance.now() / 1000;
    let radius = 5;
    let speed = 0.5;
    let angle = speed * time;
    // snowman.position.x = radius * Math.cos(angle);
    // snowman.position.z = radius * Math.sin(angle);
    // snowman.rotation.y = angle;

    // wave arms
    let armAngle = Math.sin(time)/4;
    arm1.rotation.set(0,0,Math.PI/4 + armAngle);
    arm2.rotation.set(0,0,-Math.PI/4 - armAngle);

    // bob hat up and down
    let hatBob = Math.sin(time*2)/8;
    hat.position.y = hatBob;

    // rotate dog tail
    let tailAngle = Math.sin(time*2)/2;
    tail.rotation.set(-Math.PI/4,0,tailAngle);

    // rotate dog head
    let headAngle = Math.sin(time)/2;

    if (headAngle > 0) {
        headAngle = Math.sin(time)/5;
    }

    dogHead.rotation.set(headAngle,0,0);

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
}

draw();


