/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { TudorGable, Gazebo, PineTree, Disco, BirdView } from "./08-06-buildings.js";

// your buildings are defined in another file... you should import them
// here

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({where: parentOfCanvas});

world.groundplane.mesh.receiveShadow = true;

world.renderer.shadowMap.enabled = true;
world.renderer.shadowMap.type = T.PCFSoftShadowMap;

let ambient = new T.AmbientLight("#FFB5B5", .5);
world.scene.add(ambient);

let light = new T.DirectionalLight("#FFE5E5", 1);
light.position.set(6, 2, 6);
light.castShadow = true;

light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.top = 20;
light.shadow.camera.bottom = -20;

world.scene.add(light);

// place your buildings and trees into the world here
let tudor = new TudorGable();
tudor.setPos(1, 0, 0);
world.add(tudor);

let gazebo = new Gazebo();
gazebo.setPos(-1, 0, 1);
world.add(gazebo);

let tree = new PineTree();
tree.setPos(-2, 0, -1);
world.add(tree);

let tree2 = new PineTree();
tree2.setPos(-2, 0, 4);
world.add(tree2);

let tree3 = new PineTree();
tree3.setPos(0, 0, -3);
world.add(tree3);

let tree4 = new PineTree();
tree4.setPos(-3, 0, 2);
world.add(tree4);

let tree5 = new PineTree();
tree5.setPos(4, 0, -1);
world.add(tree5);

let tree6 = new PineTree();
tree6.setPos(3.5, 0, -3.5);
world.add(tree6);

let disco = new Disco(world);
disco.setScale(0.25, 0.25, 0.25);
disco.setPos(-1, 1, 1);
world.add(disco);

let bird = new BirdView(8);
bird.setPos(-1,1,2);
world.add(bird);

let world_camera = world.active_camera;

// upon clicking a button, switch cameras
document.addEventListener('keydown', (event) => {
    if (event.key === 'b') {
        if (world.active_camera === world_camera) {
            world.active_camera = bird.camera;
        } else {
            world.active_camera = world_camera;
        }
    }
});

world.go();


