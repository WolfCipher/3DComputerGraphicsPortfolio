/*jshint esversion: 6 */
// @ts-check

// get things we need
import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
import {
  GrTireSwing,
  GrCarousel,
  GrFlyingSwing
} from "./07-08-parkobjects.js";

let parkDiv = document.getElementById("div1");
let world = new GrWorld({ groundplanesize: 20, where: parkDiv, renderparams: {preserveDrawingBuffer:true}, id:"canvas" });

let loader = new OBJLoader();
let horse1 = loader.loadAsync("../objects/horse.obj");
horse1.then(function (obj) {
  obj.position.set(0, -0.5, 0);
  obj.scale.set(0.015, 0.015, 0.015);

  let horse2 = loader.loadAsync("../objects/horse2.obj");
  horse2.then(function (obj2) {
    obj2.position.set(0, -0.5, 0.4);
    obj2.scale.set(0.09, 0.09, 0.09);

    let carousel = new GrCarousel({size: 1.5, x: 0, z: -2, h1: obj, h2: obj2});
    world.add(carousel);
  });
});

let tireSwing = new GrTireSwing({x: 10, z: 10, ry: -Math.PI/4});
world.add(tireSwing);

let flyingSwing = new GrFlyingSwing({x: -10, z: 10});
world.add(flyingSwing);

let light = new T.DirectionalLight("white", 1);
light.position.set(1, 1, 1);
world.scene.add(light);

world.go();
