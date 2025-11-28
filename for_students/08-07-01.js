/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { SpiritTrain, Wagon, MotorCycle } from "./08-07-car.js";

// your vehicles are defined in another file... you should import them
// here

let env = new T.TextureLoader().load("../images/dirt_road.png");
env.mapping = T.EquirectangularReflectionMapping;

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({where: parentOfCanvas, groundplane: false});
world.scene.background = env;

world.renderer.shadowMap.enabled = true;
world.renderer.shadowMap.type = T.PCFSoftShadowMap;

let light = new T.DirectionalLight("white", 1);
light.position.set(0, 15, 0);
world.scene.add(light);
light.castShadow = true;

// Configure shadow properties for the light
light.shadow.mapSize.width = 2048; // Optional: Increase shadow map resolution
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 1000;
light.shadow.camera.left = -50; // Increase the left boundary
light.shadow.camera.right = 50; // Increase the right boundary
light.shadow.camera.top = 50; // Increase the top boundary
light.shadow.camera.bottom = -50; // Increase the bottom boundary

let groundGeom = new T.BoxGeometry(20, 20, 0.1);
let groundMat = new T.MeshStandardMaterial({ color: "#308030" });
let ground = new T.Mesh(groundGeom, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
ground.receiveShadow = true; // Enable shadow receiving for the ground
world.scene.add(ground);

// place your vehicles into the world here
let wagon = new Wagon(1.5,2, world); //cubeRenderer.texture);
world.add(wagon);

// add traffic mirror
let cube = new T.BoxGeometry(.75, 5, .75);
let cubeMat = new T.MeshStandardMaterial({ color: "darkblue" });
let cubeMesh = new T.Mesh(cube, cubeMat);
cubeMesh.position.set(0, 2.5, 0);
cubeMesh.castShadow = true;
cubeMesh.receiveShadow = true;
world.scene.add(cubeMesh);

// reflective part
let cubeR2 = new T.WebGLCubeRenderTarget(128);
cubeR2.fromEquirectangularTexture(world.renderer, env);
let cubeCamera2 = new T.CubeCamera(1, 1000, cubeR2);

let reflectiveGeom = new T.SphereGeometry(.5);
let reflectiveMat = new T.MeshStandardMaterial({ metalness: 1, roughness: 0, envMap: cubeR2.texture });
let reflectiveBox = new T.Mesh(reflectiveGeom, reflectiveMat);
reflectiveBox.position.set(0, 5, 0);
reflectiveBox.castShadow = true;
reflectiveBox.receiveShadow = true;
cubeCamera2.position.copy(reflectiveBox.position);
world.scene.add(reflectiveBox);

// camera of the world
let camera = world.camera;
let wagonCamera = new T.PerspectiveCamera(45, 1, 0.1, 1000);
// wagonCamera.position.copy(wagon.wagon.position);
// wagonCamera.position.y += 2;
// wagonCamera.position.z += 5;
// wagonCamera.lookAt(wagon.wagon.position);

// switch between cameras
document.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        if (world.active_camera === camera) {
            world.active_camera = wagonCamera; // Switch to the wagon camera
        } else {
            world.active_camera = camera; // Switch to the default camera
        }
    }
});

world.go({
    predraw: () => {

        // Calculate the position in front of the reflectiveBox
        let offset = new T.Vector3(0, 2, 0); // Adjust the offset as needed
        let reflectiveBoxWorldPosition = new T.Vector3();
        wagon.reflectiveBox.getWorldPosition(reflectiveBoxWorldPosition);
        let cameraPosition = reflectiveBoxWorldPosition.clone().add(offset);

        // Update the wagon camera's position and orientation
        wagonCamera.position.copy(cameraPosition);
        wagonCamera.lookAt(reflectiveBoxWorldPosition);

        // Temporarily remove the reflective objects from the scene to avoid infinite reflections
        let allChildren = world.scene.children;
        let nonReflectiveChildren = allChildren.filter(child => child != wagon.frontWheelBar && child != wagon.backWheelBar && child != wagon.reflectiveBox); 
        nonReflectiveChildren = nonReflectiveChildren.filter(child => child != reflectiveBox);
        world.scene.children = nonReflectiveChildren;

        // Update the cube camera
        cubeCamera2.update(world.renderer, world.scene);

        // Restore the original scene children
        world.scene.children = allChildren;
        

    }
});

