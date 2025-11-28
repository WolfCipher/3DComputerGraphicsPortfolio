/*jshint esversion: 6 */
// @ts-check

// get things we need
import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";
import { GrForklift, GrBulldozer } from "./07-09-constructionobjects.js";
// students should not use the example objects in the portfolio
// import { GrCrane, GrExcavator } from "./07-09-constructionobjects.js";

let floor_texture = new T.TextureLoader().load("../images/rubble.jpg");

let cDiv = document.getElementById("div1");
let world = new GrWorld({ groundplanecolor: "white", groundplanesize: 10, where: cDiv, renderparams: {preserveDrawingBuffer:true}, id:"canvas" });

world.groundplane.mesh.receiveShadow = true;
world.groundplane.material.map = floor_texture;

world.renderer.shadowMap.enabled = true;

// add light
let light = new T.DirectionalLight("lightblue", 2);
light.position.set(0, 10, 0);
light.castShadow = true;
world.scene.add(light);

light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 100;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;

// add construction vehicles
let forklift = new GrForklift({ x: 2, z: 2 });
world.add(forklift);
let f_ui = new AutoUI(forklift, 300, cDiv, 1, true);
f_ui.set("x", -2);
f_ui.set("z",3);

let bulldozer = new GrBulldozer({ x: -2, z: -4 });
world.add(bulldozer);
let b_ui = new AutoUI(bulldozer, 300, cDiv, 1, true);
b_ui.set("x", 5);
b_ui.set("z",0);

/* students should not use the example objects in the portfolio 

let crane = new GrCrane({ x: 2, z: -2 });
world.add(crane);
let c_ui = new AutoUI(crane, 300, cDiv, 1, true);

let excavator = new GrExcavator({ x: -2, z: 2 });
world.add(excavator);
let e_ui = new AutoUI(excavator, 300, cDiv, 1, true);
e_ui.set("x", 6);
e_ui.set("z", 3);
e_ui.set("theta", 36);
*/

world.go();
