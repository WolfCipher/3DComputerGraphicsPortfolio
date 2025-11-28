/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

class Bug {
    constructor(scale, rotation, position, matBody, 
        matEye, matPropeller, tailSize, func, propellerPos, propellerRot) {
        this.scale = scale;
        this.rotation = rotation;
        this.position = position;
        this.matBody = matBody;
        this.matEye = matEye;
        this.matPropeller = matPropeller;
        this.tailSize = tailSize;
        this.func = func;
        this.propellerPos = propellerPos;
        this.propellerRot = propellerRot;
    }
}

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";

let bee_texture = new T.TextureLoader().load("../images/bee.png");
let fly_eye = new T.TextureLoader().load("../images/cubes.png");

let renderer = new T.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(600, 400);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = "canvas";

let scene = new T.Scene();

scene.background = new T.Color("lightblue");

let camera = new T.PerspectiveCamera(
        40,
        renderer.domElement.width / renderer.domElement.height,
        1,
        1000
    );

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 5;
camera.lookAt(0, 0, 0);

// since we're animating, add OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);

scene.add(new T.AmbientLight("white", 0.2));

// two lights - both a little off white to give some contrast
let dirLight1 = new T.DirectionalLight(0xf0e0d0, 1);
dirLight1.position.set(1, 1, 0);
scene.add(dirLight1);

let dirLight2 = new T.DirectionalLight(0xd0e0f0, 1);
dirLight2.position.set(-1, 1, -0.2);
scene.add(dirLight2);

// make a ground plane
let groundBox = new T.BoxGeometry(10, 0.1, 10);
let groundMesh = new T.Mesh(
        groundBox,
        new T.MeshStandardMaterial({ color: 0x88b888, roughness: 0.9 })
    );
// put the top of the box at the ground level (0)
groundMesh.position.y = -0.05;
scene.add(groundMesh);

// this is the part the student should change
let currTime = 0;

let scale = [0.5,0.5,0.5];
let rotation = [0,0,Math.PI / 2];
let position = [0,2,0];
let bee_mat = new T.MeshStandardMaterial({ map: bee_texture });
let eye_mat = new T.MeshStandardMaterial({ color: "black" });
let propeller_pos = [[.9,.5,-.5],[.9,.5,.5], [.7,.5,.5],[.7,.5,-.5]];
let propeller_rot = [[Math.PI/4,0,0],[-Math.PI/4,0,0], [-Math.PI/4,0,0],[Math.PI/4,0,0]];

let bee = new Bug(scale, rotation, position, bee_mat, eye_mat, eye_mat, 0.5, makePropellerWing, propeller_pos, propeller_rot);

let bug = makeBug(bee);

let flowerVectors = [new T.Vector2(1,1), new T.Vector2(0.9,0.9), new T.Vector2(0.8,0.8), new T.Vector2(0.7,0.7), new T.Vector2(0.6,0.6), new T.Vector2(0.5,0.5), new T.Vector2(0.4,0.4), new T.Vector2(0.3,0.3), new T.Vector2(0.2,0.2), new T.Vector2(0.1,0.1), new T.Vector2(0,0)];

let flowerGroup = new T.Group();
flowerGroup.position.y = 1;
scene.add(flowerGroup);

let flower_scale = [0.5,0.5,0.5];
let flower_rot = [Math.PI/2,0,0];
let stem_mat = new T.MeshStandardMaterial({ color: "green", side: T.DoubleSide });

let flower = makeFlower(flower_scale, flower_rot, stem_mat, flowerVectors, 3);

flowerGroup.add(flower);

let scaleFly = [0.25,0.25,0.25];
let rotationFly = [0,0,Math.PI / 2];
let positionFly = [4,1,-2];
let fly_mat = new T.MeshPhongMaterial({ color: "#AEB5D8", shininess: 10 });
let fly_eye_mat = new T.MeshPhongMaterial({ color: "red", normalMap: fly_eye, shininess: 10});
let fly_propeller_pos = [[0,-1,-1],[0,-1,1], [0,1,-1],[0,1,1]];
let fly_propeller_rot = [[Math.PI/4,0,0],[-Math.PI/4,0,0], [Math.PI*3/4,0,0],[-Math.PI*3/4,0,0]];

let fly = new Bug(scaleFly, rotationFly, positionFly, fly_mat, fly_eye_mat, fly_eye_mat, .8, makePropellerArm, fly_propeller_pos, fly_propeller_rot);

let bug2 = makeBug(fly);

let flowerGroup2 = new T.Group();
flowerGroup2.position.set(1,0.5,-2.5);
scene.add(flowerGroup2);
let flower2 = makeFlower(scaleFly, flower_rot, stem_mat, flowerVectors, 3);
flowerGroup2.add(flower2);

/**
 * 
 * @param {Bug} bugInfo 
 * @returns 
 */
function makeBug(bugInfo) {

    let scale = bugInfo.scale;
    let rotation = bugInfo.rotation;
    let position = bugInfo.position;
    let material = bugInfo.matBody;
    let eyeMaterial = bugInfo.matEye;
    let propellerMaterial = bugInfo.matPropeller;
    let tailSize = bugInfo.tailSize;
    let func = bugInfo.func;
    let pos1 = bugInfo.propellerPos[0];
    let pos2 = bugInfo.propellerPos[1];
    let pos3 = bugInfo.propellerPos[2];
    let pos4 = bugInfo.propellerPos[3];
    let rot1 = bugInfo.propellerRot[0];
    let rot2 = bugInfo.propellerRot[1];
    let rot3 = bugInfo.propellerRot[2];
    let rot4 = bugInfo.propellerRot[3];

    let bugGeom = new T.CapsuleGeometry(1,2);
    let bug = new T.Mesh(bugGeom, material);
    scene.add(bug);
    bug.scale.set(scale[0], scale[1], scale[2]);
    bug.rotation.set(rotation[0], rotation[1], rotation[2]);
    bug.position.set(position[0], position[1], position[2]);

    // add propellers
    func(bug, pos1, rot1);
    func(bug, pos2, rot2);
    func(bug, pos3, rot3);
    func(bug, pos4, rot4);

    // add tail
    let tailGeom = new T.ConeGeometry(tailSize, 1);
    let tailMaterial = new T.MeshStandardMaterial({ color: "black" , metalness: 0.5, roughness: 0.5});
    let tail = new T.Mesh(tailGeom, tailMaterial);
    bug.add(tail);
    tail.rotation.set(Math.PI,0,0);
    tail.position.set(0,-2,0);

    // add black eyes
    let eyeGeom = new T.SphereGeometry(0.4, 32, 32);
    let eye1 = new T.Mesh(eyeGeom, eyeMaterial);
    bug.add(eye1);
    eye1.position.set(0.5,1.75,0.5);
    eye1.rotateX(Math.PI/2);
    let eye2 = new T.Mesh(eyeGeom, eyeMaterial);
    bug.add(eye2);
    eye2.position.set(0.5,1.75,-0.5);
    eye2.rotateX(Math.PI/2);

    // attenae
    let attenaeGeom = new T.CylinderGeometry(0.1, 0.1, 2);
    let attenaeMaterial = new T.MeshStandardMaterial({ color: "black" });
    let attenae1 = new T.Mesh(attenaeGeom, attenaeMaterial);
    bug.add(attenae1);
    attenae1.position.set(.25,2,0.15);
    attenae1.rotation.set(Math.PI/8,0,Math.PI/8);
    let attenae2 = new T.Mesh(attenaeGeom, attenaeMaterial);
    bug.add(attenae2);
    attenae2.position.set(.25,2,-0.15);
    attenae2.rotation.set(-Math.PI/8,0,Math.PI/8);

    // wings
    let wingGeom = new T.CylinderGeometry(1, 1, 0.1, 32);
    let wingMaterial = new T.MeshStandardMaterial({ color: "#F0F070", transparent: true, opacity: 0.5 });
    let wing1 = new T.Mesh(wingGeom, wingMaterial);
    bug.add(wing1);
    wing1.position.set(.75,0,1);
    wing1.rotation.set(-Math.PI/4,0,Math.PI/2);
    wing1.scale.set(1,1,0.5);
    let wing2 = new T.Mesh(wingGeom, wingMaterial);
    bug.add(wing2);
    wing2.position.set(.75,0,-1);
    wing2.rotation.set(Math.PI/4,0,Math.PI/2);
    wing2.scale.set(1,1,0.5);

    return bug;
}

function makePropellerArm(bug, position, rotation) {
    let propGeom = new T.CylinderGeometry(0.1, 0.1, 2.2);
    let propMaterial = new T.MeshStandardMaterial({ color: "blue" });
    let prop1 = new T.Mesh(propGeom, propMaterial);
    bug.add(prop1);
    prop1.position.set(position[0], position[1], position[2]);
    prop1.rotation.set(rotation[0], rotation[1], rotation[2]);

    let group = new T.Group();
    prop1.add(group);
    group.position.set(-0.1, -1.2, 0);

    let bladeGeom = new T.BoxGeometry(0.1, 1, 0.2);
    let bladeMaterial = new T.MeshStandardMaterial({ color: "black" });
    let blade = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade);
    blade.position.set(0, -0.5, 0);
    let blade2 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade2);
    blade2.rotateX(Math.PI / 2);
    blade2.position.set(0, 0, -0.5);
    let blade3 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade3);
    blade3.position.set(0, 0.5, 0);
    let blade4 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade4);
    blade4.rotateX(Math.PI / 2);
    blade4.position.set(0, 0, 0.5);
}

function makePropellerWing(bug, position, rotation) {
    let prop1 = new T.Group();
    bug.add(prop1);
    prop1.position.set(position[0], position[1], position[2]);
    prop1.rotation.set(rotation[0], rotation[1], rotation[2]);

    let group = new T.Group();
    prop1.add(group);
    group.position.set(-0.1, -1.2, 0);

    let bladeGeom = new T.BoxGeometry(0.1, .4, 0.2);
    let bladeMaterial = new T.MeshStandardMaterial({ color: "black" });
    let blade = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade);
    blade.position.set(0, -0.35, 0);
    let blade2 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade2);
    blade2.rotateX(Math.PI / 2);
    blade2.position.set(0, 0, -0.35);
    let blade3 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade3);
    blade3.position.set(0, 0.35, 0);
    let blade4 = new T.Mesh(bladeGeom, bladeMaterial);
    group.add(blade4);
    blade4.rotateX(Math.PI / 2);
    blade4.position.set(0, 0, 0.35);
}

function makeFlower(scale, rotation,  material, flowerVectors, stemLength) {

    let flowerGroup = new T.Group();
    flowerGroup.scale.set(scale[0], scale[1], scale[2]);
    flowerGroup.rotation.set(rotation[0], rotation[1], rotation[2]);

    let flowerGeom = new T.LatheGeometry(flowerVectors, 32);
    let flower = new T.Mesh(flowerGeom, material);
    flower.position.set(0,0,0);

    // add stem
    let stemGeom = new T.CylinderGeometry(0.1, 0.1, stemLength, 32);
    let stem = new T.Mesh(stemGeom, material);
    stem.position.set(0, -scale[1]/2, stemLength/2 - 0.1);
    stem.rotation.set(-rotation[0]+0.3, -rotation[1], -rotation[2]);
    flowerGroup.add(stem);

    // add petals
    let petalGeom = new T.CylinderGeometry(1, 1, 0.2, 32);
    let petalMaterial = new T.MeshStandardMaterial({ color: "#F0F040", side: T.DoubleSide });

    for (let i = 0; i < 8; i++) {
        let petal = new T.Mesh(petalGeom, petalMaterial);
        petal.scale.set(1, 1, 0.75); // Scale petals to be thinner
        petal.position.set(0, 1.5, 0); // Position petals at the correct height
        petal.rotation.set(0, i*Math.PI/4,0); // Rotate petals to face outward
        petal.rotateX(Math.PI/4); // Rotate petals to face outward
        petal.translateX(1); // Move petals outward from the center
        flowerGroup.add(petal);
    }

    flowerGroup.add(flower);

    return flowerGroup;
}


// animation loop
function animateLoop(timestamp) {
    if (currTime == 0) {
        currTime = timestamp;
    }

    let delta = (timestamp - currTime) / 1000;

    // move bug1 in a circle
    let theta = timestamp / 1000;
    let x = 3 * Math.cos(theta);
    let z = 3 * Math.sin(theta);
    bug.position.x = x;
    bug.position.z = z;
    bug.rotation.y = -theta+Math.PI/2;
    flowerGroup.lookAt(bug.position);

    // move bug's propellers
    for (let i = 0; i < 4; i++) {
        let prop = bug.children[i];
        let direction = 1;
        if (i % 2 == 1) {
            direction = -1;
        }

        prop.children[0].rotation.x = -4*direction * theta;
    }

    
    // move bug2 in a sine wave pattern
    bug2.position.y = 1.5 + Math.sin(theta * 2) * 0.5
    bug2.rotation.y += delta;
    bug2.position.x = -4 * Math.cos(bug2.rotation.y/2);
    bug2.position.z = -4 * Math.cos(bug2.rotation.y);
    flowerGroup2.lookAt(bug2.position);

    // move bug2's propellers
    for (let i = 0; i < 4; i++) {
        let prop = bug2.children[i];
        let direction = 1;
        if (i % 2 == 1) {
            direction = -1;
        }

        prop.children[0].rotation.x = -4*direction * theta;
    }

    currTime = timestamp;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animateLoop);
  }
window.requestAnimationFrame(animateLoop);