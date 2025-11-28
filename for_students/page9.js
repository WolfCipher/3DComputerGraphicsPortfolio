/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// your buildings are defined in another file... you should import them
// here
let body_knit = new T.TextureLoader().load("../images/body_knit_2.png");
let sweater_front_knit = new T.TextureLoader().load("../images/sweater_knit_front.png");
let brown_knit = new T.TextureLoader().load("../images/brown_knit.png");
let brown_small_knit = new T.TextureLoader().load("../images/brown_knit_small.png");
let cream_knit = new T.TextureLoader().load("../images/cream_knit2.png");
let dark_knit = new T.TextureLoader().load("../images/dark_knit.png");
let sleeve_knit = new T.TextureLoader().load("../images/sleeves.png");
let carpet = new T.TextureLoader().load("../images/carpet.jpg");

body_knit.colorSpace = T.SRGBColorSpace;
sweater_front_knit.colorSpace = T.SRGBColorSpace;
brown_knit.colorSpace = T.SRGBColorSpace;
brown_small_knit.colorSpace = T.SRGBColorSpace;
cream_knit.colorSpace = T.SRGBColorSpace;
dark_knit.colorSpace = T.SRGBColorSpace;
sleeve_knit.colorSpace = T.SRGBColorSpace;

class DogToy extends GrObject {
    constructor(x = 0, y = 0, z = 0) {
        let brown_knit_mat = new T.MeshStandardMaterial({ map: brown_knit });
        
        // Body
        let body_mid = new T.CylinderGeometry(1, 1, 2.5, 16);
        let body_mid_mat = new T.MeshStandardMaterial({ map: body_knit });
        let body_mid_mesh = new T.Mesh(body_mid, body_mid_mat);
        body_mid_mesh.castShadow = true;
        body_mid_mesh.receiveShadow = true;

        let rear = new T.SphereGeometry(1, 16, 16);
        let rear_mesh = new T.Mesh(rear, brown_knit_mat);
        rear_mesh.position.y = -1.25;
        rear_mesh.castShadow = true;
        rear_mesh.receiveShadow = true;

        let chest = new T.SphereGeometry(1, 16, 16);
        let chest_mat = new T.MeshStandardMaterial({ map: sweater_front_knit });
        let chest_mesh = new T.Mesh(chest, chest_mat);
        chest_mesh.position.y = 1.25;
        chest_mesh.castShadow = true;
        chest_mesh.receiveShadow = true;

        // head
        let head = new T.SphereGeometry(1, 16, 16);
        let head_mesh = new T.Mesh(head, brown_knit_mat);
        head_mesh.position.y = 2.25;
        head_mesh.position.z = -1.25;
        head_mesh.castShadow = true;
        head_mesh.receiveShadow = true;

        // snout
        let snout = new T.CapsuleGeometry(.6, .5, 1, 16);
        let snout_mat = new T.MeshStandardMaterial({ map: cream_knit });
        let snout_mesh = new T.Mesh(snout, snout_mat);
        snout_mesh.position.y = 1;
        snout_mesh.position.z = 0.45;
        snout_mesh.rotation.x = Math.PI/6;
        snout_mesh.castShadow = true;
        snout_mesh.receiveShadow = true

        // nose
        let nose = new T.SphereGeometry(.3, 16, 16);
        let nose_mat = new T.MeshStandardMaterial({ color: "#707070", map: dark_knit });
        let nose_mesh = new T.Mesh(nose, nose_mat);
        nose_mesh.position.y = 1.6;
        nose_mesh.position.z = 0.45;
        nose_mesh.castShadow = true;
        nose_mesh.receiveShadow = true;

        // tail
        let tail = new T.SphereGeometry(.3, 16, 16);
        let small_knit = new T.MeshStandardMaterial({ map: brown_small_knit });
        let tail_mesh = new T.Mesh(tail, small_knit);
        tail_mesh.position.y = -1.6;
        tail_mesh.position.z = -0.85;
        tail_mesh.castShadow = true;
        tail_mesh.receiveShadow = true;

        // ears
        let earRight = ear(-1);
        earRight.position.x = -1.05;
        let earLeft = ear(1);
        earLeft.position.x = 1.05;

        //eyes
        let eyeRight = eye(1);
        eyeRight.position.x = -.35;
        let eyeLeft = eye(-1);
        eyeLeft.position.x = .35;

        // legs
        let forelegRight = leg(1, true);
        forelegRight.position.y = 1.5;
        forelegRight.position.x = -.5;

        let forelegLeft = leg(-1, true);
        forelegLeft.position.y = 1.5;
        forelegLeft.position.x = .5;

        let backlegRight = leg(1);
        backlegRight.position.y = -1.5;
        backlegRight.position.x = -.5;

        let backlegLeft = leg(-1);
        backlegLeft.position.y = -1.5;
        backlegLeft.position.x = .5;

        head_mesh.add(snout_mesh);
        head_mesh.add(nose_mesh);
        head_mesh.add(earRight);
        head_mesh.add(earLeft);
        head_mesh.add(eyeRight);
        head_mesh.add(eyeLeft);

        let dog = new T.Group();
        dog.add(body_mid_mesh);
        dog.add(rear_mesh);
        dog.add(chest_mesh);
        dog.add(head_mesh);
        dog.add(tail_mesh);
        dog.add(forelegRight);
        dog.add(forelegLeft);
        dog.add(backlegRight);
        dog.add(backlegLeft);
        dog.position.set(x, y, z);
        dog.rotation.set(Math.PI/2, 0, 0);

        super("Dog Toy", dog);

        this.dog = dog;
        this.head = head_mesh;
        this.tail = tail_mesh;
        this.time = 0;
    }

    stepWorld(delta, timeOfDay) {
        // rotate the head up and down
        this.time += delta/1000;
        let bob = Math.sin(this.time/1.5);
        this.head.rotation.x = bob/5;

        // swish the tail
        let tailSwish = Math.sin(this.time*2);
        this.tail.rotation.y = tailSwish/4;
        let tailSwish2 = Math.sin(this.time);
        this.tail.position.x = -tailSwish/20;
    }
}

function ear(earDirection) {

    let ear = new T.CylinderGeometry(.5, .5, .2, 16);
    let ear_mat = new T.MeshStandardMaterial({ map: brown_small_knit });
    let ear_mesh = new T.Mesh(ear, ear_mat);

    ear_mesh.position.y = -.25;
    ear_mesh.position.z = .25;
    ear_mesh.rotation.z = Math.PI*11/24*earDirection;
    ear_mesh.rotation.y = earDirection*Math.PI/12;
    ear_mesh.scale.set(1, 1, 1.75);

    ear_mesh.castShadow = true;
    ear_mesh.receiveShadow = true;

    return ear_mesh;
}

function eye(eyeDirection) {

    let white = new T.CylinderGeometry(.12, .12, .05, 16);
    let white_mat = new T.MeshStandardMaterial({ color: "#E0E0D0" });
    let white_mesh = new T.Mesh(white, white_mat);
    white_mesh.position.y = .9;
    white_mesh.position.z = -0.25;
    white_mesh.rotation.z = eyeDirection*Math.PI/8;
    white_mesh.rotation.x = -Math.PI/24;
    white_mesh.castShadow = true;
    white_mesh.receiveShadow = true;

    let eye = new T.SphereGeometry(.11, 16, 16);
    let eye_mat = new T.MeshStandardMaterial({ color: "black", roughness: 0.4 });
    let eye_mesh = new T.Mesh(eye, eye_mat);
    eye_mesh.position.y = .89;
    eye_mesh.position.z = -0.25;
    eye_mesh.castShadow = true;
    eye_mesh.receiveShadow = true;

    let eye_group = new T.Group();
    eye_group.add(white_mesh);
    eye_group.add(eye_mesh);

    return eye_group;
}

function leg(direction, withSleeves=false) {
    let leg = new T.CapsuleGeometry(.5, 1, 1, 16);
    let leg_mat = new T.MeshStandardMaterial({ map: brown_knit });
    let leg_mesh = new T.Mesh(leg, leg_mat);
    leg_mesh.position.z = 1.25;
    leg_mesh.rotation.x = Math.PI/2;
    leg_mesh.rotation.y = -direction*Math.PI/4;
    leg_mesh.rotation.z = direction*Math.PI/12;
    leg_mesh.castShadow = true;
    leg_mesh.receiveShadow = true;

    if (withSleeves) {
        let sleeve = new T.CylinderGeometry(.55, .55, .5, 16);
        let sleeve_mat = new T.MeshStandardMaterial({ map: sleeve_knit });
        let sleeve_mesh = new T.Mesh(sleeve, sleeve_mat);
        sleeve_mesh.position.y = -.55;
        sleeve_mesh.castShadow = true;
        sleeve_mesh.receiveShadow = true;
        leg_mesh.add(sleeve_mesh);
    }

    return leg_mesh;
}

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({where: parentOfCanvas, groundplanecolor: "white"});

world.scene.background = new T.Color("lightblue");

world.renderer.shadowMap.enabled = true;
world.renderer.shadowMap.type = T.PCFSoftShadowMap;
world.groundplane.mesh.receiveShadow = true;
world.groundplane.material.map = carpet;
world.groundplane.material.bumpMap = carpet;
world.groundplane.material.bumpScale = 2;

// light
let light = new T.DirectionalLight("white", 1);
light.position.set(0, 10, 0);
light.castShadow = true;
world.scene.add(light);

let dog = new DogToy(0, 2, 0);
world.add(dog);

world.go();


