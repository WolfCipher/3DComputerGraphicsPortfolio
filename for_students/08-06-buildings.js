/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let tudorTexture = new T.TextureLoader().load("../images/tudorRefined.jpg");
let tudor_bump = new T.TextureLoader().load("../images/tudorRefinedBump.jpg");
let tudor_back = new T.TextureLoader().load("../images/tudorBack.png");
let tudor_back_bump = new T.TextureLoader().load("../images/tudorBackBump.png");
let tudorWall = new T.TextureLoader().load("../images/tudor_wall.jpg");
let roof = new T.TextureLoader().load("../images/redShingles.jpg");
let blueRoof = new T.TextureLoader().load("../images/blueShingles.jpg");
let treeTexture = new T.TextureLoader().load("../images/tree_depth.png");
let trunkTexture = new T.TextureLoader().load("../images/carrot_texture.png");
let cubes = new T.TextureLoader().load("../images/cubes.png");
let wood = new T.TextureLoader().load("../images/wagon_wood.jpg");

wood.colorSpace = T.SRGBColorSpace;

export class BirdView extends GrObject {
    constructor(pathRadius = 10) {
        
        let bird = new T.Group();

        let body = new T.Group();
        bird.add(body);
 
        let head = new T.SphereGeometry(.25, 32, 32);
        //let headMesh = new T.Mesh(head, material);
        let headMesh = new T.Group();
        headMesh.position.set(0.3, -.25, -0.75);
        body.add(headMesh);

        let camera = new T.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 10, 0);

        super("Bird's Eye View", bird);

        this.bird = body;
        this.head = headMesh;
        this.camera = camera;
        this.pathRadius = pathRadius;
    }

    stepWorld(delta, timeOfDay) {
        // move the camera around the scene
        let time = performance.now() / 1000;
        this.bird.position.set(this.pathRadius * Math.sin(time/3), 5+Math.sin(time/2), this.pathRadius * Math.cos(time/3));
        this.bird.rotation.set(0, time/3, 0);

        let birdCoord = new T.Vector3();
        this.bird.getWorldPosition(birdCoord);
        let headCoord = new T.Vector3();
        this.bird.children[0].getWorldPosition(headCoord);


        this.camera.position.copy(birdCoord);
        this.camera.lookAt(headCoord);
    }
}

let discoCtr = 0;
export class Disco extends GrObject {

    constructor(world) {

        let renderTarget = new T.WebGLCubeRenderTarget(128);
        let camera = new T.CubeCamera(0.1, 1000, renderTarget);

        // sphere with a disco ball texture
        let sphere = new T.SphereGeometry(1, 32, 32);
        let material = new T.MeshStandardMaterial({ normalMap: cubes, roughness: 0.2, metalness: 0.8, envMap: renderTarget.texture });
        let mesh = new T.Mesh(sphere, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // string to hang the disco ball
        let string = new T.CylinderGeometry(.05, .05, 4, 32);
        let stringMat = new T.MeshStandardMaterial({color: "#000000"});
        let stringMesh = new T.Mesh(string, stringMat);
        stringMesh.position.set(0, 2.9, 0);
        stringMesh.castShadow = true;
        stringMesh.receiveShadow = true;
        mesh.add(stringMesh); // add the string to the disco ball while keeping the reflection on the ball

        // using a group like this does not work due to the GrObject framework
        // the groundplane will not be reflected in the camera if you use this and add it to the super() call
        // let group = new T.Group();
        // group.add(mesh);
        // group.add(stringMesh);

        super(`Disco-${discoCtr++}`, mesh);

        camera.position.copy(mesh.position);

        this.camera = camera;
        this.world = world;
        this.disco = mesh;
    }

    stepWorld(delta, timeOfDay) {
        // make the disco ball reflect the scene
        let allChildren = this.world.scene.children;
        this.world.scene.children = allChildren.filter(x => x !== this.disco);

        this.camera.position.copy(this.disco.position);
        this.camera.update(this.world.renderer, this.world.scene);

        this.world.scene.children = allChildren;
    }
}

let pineTreeCtr = 0;
export class PineTree extends GrObject {

    constructor() {

        let tree = new T.Group();

        let trunk = new T.Mesh(new T.CylinderGeometry(.1, .1, 1, 32), new T.MeshStandardMaterial({color: "#8B4513", bumpMap: trunkTexture, bumpScale: 1}));
        trunk.position.set(0, .5, 0);
        trunk.receiveShadow = true;
        trunk.castShadow = true;

        let top = new T.Mesh(new T.ConeGeometry(.5, 1.5, 32), new T.MeshStandardMaterial({color: "#228B22", bumpMap: treeTexture, bumpScale: 2}));
        top.position.set(0, 1.5, 0);
        top.receiveShadow = true;
        top.castShadow = true;

        tree.add(trunk);
        tree.add(top);

        super(`Pine Tree-${pineTreeCtr++}`, tree);

    }

}

let gazeboCtr = 0;
export class Gazebo extends GrObject {
    constructor() {

        // cylindrical base
        let baseGeom = new T.CylinderGeometry(1, 1, .25, 32);
        let baseMat = new T.MeshStandardMaterial({color: "#FEFCF2", bumpMap: wood, bumpScale: 2});
        let base = new T.Mesh(baseGeom, baseMat);
        base.castShadow = true;
        base.receiveShadow = true;

        // add pillars evenly spaced around the base
        let pillarGeom = new T.CylinderGeometry(.1, .1, 1.25, 32);
        let pillarMat = new T.MeshStandardMaterial({color: "#FEFCF2", bumpMap: wood, bumpScale: 2});

        let pillar1 = new T.Mesh(pillarGeom, pillarMat);
        pillar1.position.set(1-.1, 0.75, 0);
        pillar1.castShadow = true;
        pillar1.receiveShadow = true;

        let pillar2 = new T.Mesh(pillarGeom, pillarMat);
        pillar2.position.set(-1+.1, 0.75, 0);
        pillar2.castShadow = true;
        pillar2.receiveShadow = true;

        let pillar3 = new T.Mesh(pillarGeom, pillarMat);
        pillar3.position.set(0, 0.75, 1-.1);
        pillar3.castShadow = true;
        pillar3.receiveShadow = true;

        let pillar4 = new T.Mesh(pillarGeom, pillarMat);
        pillar4.position.set(0, 0.75, -1+.1);
        pillar4.castShadow = true;
        pillar4.receiveShadow = true;

        // add railings between the pillars
        let railingGeom = new T.BoxGeometry(.1, .05, 1.25, 32);

        let railing1 = new T.Mesh(railingGeom, pillarMat);
        railing1.rotation.set(0, Math.PI/4, 0);
        railing1.position.set(1-.5, 0.6, -.4);
        pillar1.add(railing1);

        let railing1_below = new T.Mesh(railingGeom, pillarMat);
        railing1.add(railing1_below);
        railing1_below.position.set(0, -.4, 0);

        let railing2 = new T.Mesh(railingGeom, pillarMat);
        railing2.rotation.set(0, -Math.PI/4, 0);
        railing2.position.set(-1+.5, 0.6, -.4);
        pillar2.add(railing2);

        let railing2_below = new T.Mesh(railingGeom, pillarMat);
        railing2.add(railing2_below);
        railing2_below.position.set(0, -.4, 0);

        let railing3 = new T.Mesh(railingGeom, pillarMat);
        railing3.rotation.set(0, Math.PI/4, 0);
        railing3.position.set(-0.5, 0.6, 1-.6);
        pillar3.add(railing3);

        let railing3_below = new T.Mesh(railingGeom, pillarMat);
        railing3.add(railing3_below);
        railing3_below.position.set(0, -.4, 0);

        // add fences to the railings
        let fenceGeom = new T.BoxGeometry(.1, .35, .05, 32);

        let fence1_1 = new T.Mesh(fenceGeom, pillarMat);
        fence1_1.position.set(0, -.2, -.075);
        railing1.add(fence1_1);
        let fence1_2 = new T.Mesh(fenceGeom, pillarMat);
        fence1_2.position.set(0, -.2, -.075+.4);
        railing1.add(fence1_2);
        let fence1_3 = new T.Mesh(fenceGeom, pillarMat);
        fence1_3.position.set(0, -.2, -.075-.4);
        railing1.add(fence1_3);
        let fence1_4 = new T.Mesh(fenceGeom, pillarMat);
        fence1_4.position.set(0, -.2, -.075+.2);
        railing1.add(fence1_4);
        let fence1_5 = new T.Mesh(fenceGeom, pillarMat);
        fence1_5.position.set(0, -.2, -.075-.2);
        railing1.add(fence1_5);

        let fence2_1 = new T.Mesh(fenceGeom, pillarMat);
        fence2_1.position.set(0, -.2, -.075);
        railing2.add(fence2_1);
        let fence2_2 = new T.Mesh(fenceGeom, pillarMat);
        fence2_2.position.set(0, -.2, -.075+.4);
        railing2.add(fence2_2);
        let fence2_3 = new T.Mesh(fenceGeom, pillarMat);
        fence2_3.position.set(0, -.2, -.075-.4);
        railing2.add(fence2_3);
        let fence2_4 = new T.Mesh(fenceGeom, pillarMat);
        fence2_4.position.set(0, -.2, -.075+.2);
        railing2.add(fence2_4);
        let fence2_5 = new T.Mesh(fenceGeom, pillarMat);
        fence2_5.position.set(0, -.2, -.075-.2);
        railing2.add(fence2_5);

        let fence3_1 = new T.Mesh(fenceGeom, pillarMat);
        fence3_1.position.set(0, -.2, 0.075);
        railing3.add(fence3_1);
        let fence3_2 = new T.Mesh(fenceGeom, pillarMat);
        fence3_2.position.set(0, -.2, 0.075+.4);
        railing3.add(fence3_2);
        let fence3_3 = new T.Mesh(fenceGeom, pillarMat);
        fence3_3.position.set(0, -.2, 0.075-.4);
        railing3.add(fence3_3);
        let fence3_4 = new T.Mesh(fenceGeom, pillarMat);
        fence3_4.position.set(0, -.2, 0.075+.2);
        railing3.add(fence3_4);
        let fence3_5 = new T.Mesh(fenceGeom, pillarMat);
        fence3_5.position.set(0, -.2, 0.075-.2);
        railing3.add(fence3_5);

        // cast and receive shadows for the fences
        railing1.children.forEach(function(fence) {
            fence.castShadow = true;
            fence.receiveShadow = true;
        });

        railing1.castShadow = true;
        railing1.receiveShadow = true;

        railing2.children.forEach(function(fence) {
            fence.castShadow = true;
            fence.receiveShadow = true;
        });

        railing2.castShadow = true;
        railing2.receiveShadow = true;

        railing3.children.forEach(function(fence) {
            fence.castShadow = true;
            fence.receiveShadow = true;
        });

        railing3.castShadow = true;
        railing3.receiveShadow = true;
        

        // draw triangular roofs between the pillars
        let roofGeom = new T.BufferGeometry();
        const roofVertices = [
            [1.2, 1, 0],
            [0, 1, 1.2],
            [-1.2, 1, 0],
            [0, 1, -1.2],
            [0, 2, 0]
        ];
        const roofPositions = new Float32Array([
            // roof 1, 0, 4
            ...roofVertices[1],
            ...roofVertices[0],
            ...roofVertices[4],

            // roof 0, 3, 4
            ...roofVertices[0],
            ...roofVertices[3],
            ...roofVertices[4],

            // roof 3, 2, 4
            ...roofVertices[3],
            ...roofVertices[2],
            ...roofVertices[4],

            // roof 2, 1, 4
            ...roofVertices[2],
            ...roofVertices[1],
            ...roofVertices[4]

        ]);

        roofGeom.setAttribute('position', new T.BufferAttribute(roofPositions, 3));

        const roofUv = new Float32Array([
            // roof 0, 1, 4
            0, 0,
            1, 0,
            1/2, 1,

            // roof 0, 3, 4
            0, 0,
            1, 0,
            1/2, 1,

            // roof 3, 2, 4
            0, 0,
            1, 0,
            1/2, 1,

            // roof 2, 1, 4
            0, 0,
            1, 0,
            1/2, 1

        ])

        roofGeom.setAttribute('uv', new T.BufferAttribute(roofUv, 2));

        roofGeom.computeVertexNormals();

        let roofMat = new T.MeshStandardMaterial({map: blueRoof, bumpMap: blueRoof, bumpScale: 5, color: "#6FD9FF", side: T.DoubleSide});

        let roof = new T.Mesh(roofGeom, roofMat);
        roof.position.set(0, .25, 0);
        roof.castShadow = true;
        roof.receiveShadow = true;

        let group = new T.Group();
        group.add(base);
        group.add(pillar1);
        group.add(pillar2);
        group.add(pillar3);
        group.add(pillar4);
        group.add(railing1);
        group.add(railing2);
        group.add(railing3);
        group.add(roof);

        super(`Gazebo-${gazeboCtr++}`, group);
    }
}

let tudorCtr = 0;
export class TudorGable extends GrObject {
    constructor() {

        let length = 2;
        let depth = .25;

        let front = tudorFront();

        let side1 = tudorSide();
        side1.rotateY(Math.PI / 2);
        side1.position.set(length-depth+.01, 0, depth);

        let side2 = tudorSide();
        side2.rotateY(-Math.PI / 2);
        side2.position.set(depth-0.01, 0, -length+depth);

        let back = tudorBack();
        back.position.set(0, 0, -length+depth);

        let group = new T.Group();
        group.add(front);
        group.add(side1);
        group.add(side2);
        group.add(back);

        super(`Tudor Gable-${tudorCtr++}`, group);
    }
}

function tudorFront() {

    let material = new T.MeshStandardMaterial({ map: tudorTexture, bumpMap: tudor_bump, bumpScale: 5 });

        let houseBuf = new T.BufferGeometry();

        const vertices = [
            [0, 0, .25],
            [2, 0, .25],
            [0, 2, .25],
            [2, 2, .25],
            [0, 0, 0],
            [2, 0, 0],
            [0, 2, 0],
            [2, 2, 0],
            [1, 3, .25],
            [1, 3, 0]
        ];

        const positions = new Float32Array([
            // front 0, 1, 2
            ...vertices[0],
            ...vertices[1],
            ...vertices[2],

            // front 1, 3, 2
            ...vertices[1],
            ...vertices[3],
            ...vertices[2],

            // right 1, 5, 3
            ...vertices[1],
            ...vertices[5],
            ...vertices[3],

            // right 5, 7, 3
            ...vertices[5],
            ...vertices[7],
            ...vertices[3],

            // back 5, 4, 7
            ...vertices[5],
            ...vertices[4],
            ...vertices[7],

            // back 4, 6, 7
            ...vertices[4],
            ...vertices[6],
            ...vertices[7],

            // left 4, 0, 6
            ...vertices[4],
            ...vertices[0],
            ...vertices[6],

            // left 0, 2, 6
            ...vertices[0],
            ...vertices[2],
            ...vertices[6],

            // bottom 0, 4, 1
            ...vertices[0],
            ...vertices[4],
            ...vertices[1],

            // bottom 4, 5, 1
            ...vertices[4],
            ...vertices[5],
            ...vertices[1],

            // tip front 2, 3, 8
            ...vertices[2],
            ...vertices[3],
            ...vertices[8],

            // tip back 7, 6, 9
            ...vertices[7],
            ...vertices[6],
            ...vertices[9],

            // tip right 3, 7, 8
            ...vertices[3],
            ...vertices[7],
            ...vertices[8],

            // tip right 7, 9, 8
            ...vertices[7],
            ...vertices[9],
            ...vertices[8],

            // tip left 6, 2, 9
            ...vertices[6],
            ...vertices[2],
            ...vertices[9],

            // tip left 2, 8, 9
            ...vertices[2],
            ...vertices[8],
            ...vertices[9]

        ]);

        const uv = new Float32Array([
            // front 0, 1, 2
            130/649, 0/649,
            575/649, 0/649,
            130/649, 400/649,

            // front 1, 3, 2
            575/649, 0/649,
            575/649, 400/649,
            130/649, 400/649,

            // right 1, 5, 3
            130/649, 200/649,
            280/649, 200/649,
            130/649, 300/649,

            // right 5, 7, 3
            280/649, 200/649,
            280/649, 300/649,
            130/649, 300/649,

            // back 5, 4, 7
            130/649, 0/649,
            575/649, 0/649,
            130/649, 400/649,

            // back 4, 6, 7
            575/649, 0/649,
            575/649, 400/649,
            130/649, 400/649,

            // left 4, 0, 6
            130/649, 200/649,
            280/649, 200/649,
            130/649, 300/649,

            // left 0, 2, 6
            280/649, 200/649,
            280/649, 300/649,
            130/649, 300/649,

            // bottom 0, 4, 1
            130/649, 200/649,
            280/649, 200/649,
            130/649, 300/649,

            // bottom 4, 5, 1
            280/649, 200/649,
            280/649, 300/649,
            130/649, 300/649,

            // tip front 2, 3, 8
            130/649, 400/649,
            575/649, 400/649,
            350/649, 649/649,

            // tip back 7, 6, 9
            130/649, 400/649,
            575/649, 400/649,
            350/649, 649/649,

            // tip right 3, 7, 8

            // tip right 7, 9, 8

            // tip left 6, 2, 9

            // tip left 2, 8, 9

        ]);

        houseBuf.setAttribute('position', new T.BufferAttribute(positions, 3));
        houseBuf.setAttribute('uv', new T.BufferAttribute(uv, 2));

        houseBuf.computeVertexNormals();

        let house = new T.Mesh(houseBuf, material);
        house.receiveShadow = true;
        house.castShadow = true;

        return house;

}

function tudorBack() {

    let material = new T.MeshStandardMaterial({ map: tudor_back, bumpMap: tudor_back_bump, bumpScale: 5 });

        let houseBuf = new T.BufferGeometry();

        const vertices = [
            [0, 0, .25],
            [2, 0, .25],
            [0, 2, .25],
            [2, 2, .25],
            [0, 0, 0],
            [2, 0, 0],
            [0, 2, 0],
            [2, 2, 0],
            [1, 3, .25],
            [1, 3, 0]
        ];

        const positions = new Float32Array([
            // front 0, 1, 2
            ...vertices[0],
            ...vertices[1],
            ...vertices[2],

            // front 1, 3, 2
            ...vertices[1],
            ...vertices[3],
            ...vertices[2],

            // right 1, 5, 3
            ...vertices[1],
            ...vertices[5],
            ...vertices[3],

            // right 5, 7, 3
            ...vertices[5],
            ...vertices[7],
            ...vertices[3],

            // back 5, 4, 7
            ...vertices[5],
            ...vertices[4],
            ...vertices[7],

            // back 4, 6, 7
            ...vertices[4],
            ...vertices[6],
            ...vertices[7],

            // left 4, 0, 6
            ...vertices[4],
            ...vertices[0],
            ...vertices[6],

            // left 0, 2, 6
            ...vertices[0],
            ...vertices[2],
            ...vertices[6],

            // bottom 0, 4, 1
            ...vertices[0],
            ...vertices[4],
            ...vertices[1],

            // bottom 4, 5, 1
            ...vertices[4],
            ...vertices[5],
            ...vertices[1],

            // tip front 2, 3, 8
            ...vertices[2],
            ...vertices[3],
            ...vertices[8],

            // tip back 7, 6, 9
            ...vertices[7],
            ...vertices[6],
            ...vertices[9],

            // tip right 3, 7, 8
            ...vertices[3],
            ...vertices[7],
            ...vertices[8],

            // tip right 7, 9, 8
            ...vertices[7],
            ...vertices[9],
            ...vertices[8],

            // tip left 6, 2, 9
            ...vertices[6],
            ...vertices[2],
            ...vertices[9],

            // tip left 2, 8, 9
            ...vertices[2],
            ...vertices[8],
            ...vertices[9]

        ]);

        const uv = new Float32Array([
            // front 0, 1, 2
            130/649, 0/649,
            575/649, 0/649,
            130/649, 400/649,

            // front 1, 3, 2
            575/649, 0/649,
            575/649, 400/649,
            130/649, 400/649,

            // right 1, 5, 3
            130/649, 200/649,
            280/649, 200/649,
            130/649, 300/649,

            // right 5, 7, 3
            280/649, 200/649,
            280/649, 300/649,
            130/649, 300/649,

            // back 5, 4, 7
            130/649, 0/649,
            575/649, 0/649,
            130/649, 400/649,

            // back 4, 6, 7
            575/649, 0/649,
            575/649, 400/649,
            130/649, 400/649,

            // left 4, 0, 6
            130/649, 200/649,
            280/649, 200/649,
            130/649, 300/649,

            // left 0, 2, 6
            280/649, 200/649,
            280/649, 300/649,
            130/649, 300/649,

            // bottom 0, 4, 1
            130/649, 200/649,
            280/649, 200/649,
            130/649, 300/649,

            // bottom 4, 5, 1
            280/649, 200/649,
            280/649, 300/649,
            130/649, 300/649,

            // tip front 2, 3, 8
            130/649, 400/649,
            575/649, 400/649,
            350/649, 649/649,

            // tip back 7, 6, 9
            130/649, 400/649,
            575/649, 400/649,
            350/649, 649/649,

            // tip right 3, 7, 8

            // tip right 7, 9, 8

            // tip left 6, 2, 9

            // tip left 2, 8, 9

        ]);

        houseBuf.setAttribute('position', new T.BufferAttribute(positions, 3));
        houseBuf.setAttribute('uv', new T.BufferAttribute(uv, 2));

        houseBuf.computeVertexNormals();

        let house = new T.Mesh(houseBuf, material);
        house.receiveShadow = true;
        house.castShadow = true;

        return house;

}

function tudorSide() {
    let material = new T.MeshStandardMaterial({color: "#FEFCF2", map: tudorWall, bumpMap: tudorWall, bumpScale: 5});

    let houseBuf = new T.BufferGeometry();

    const vertices = [
        [0, 0, .25],
        [2, 0, .25],
        [0, 2, .25],
        [2, 2, .25],
    ];

    const positions = new Float32Array([
        // front 0, 1, 2
        ...vertices[0],
        ...vertices[1],
        ...vertices[2],

        // front 1, 3, 2
        ...vertices[1],
        ...vertices[3],
        ...vertices[2]
    ]);

    const uv = new Float32Array([
        // front 0, 1, 2
        0/649, 0/649,
        649/649, 0/649,
        0/649, 649/649,

        // front 1, 3, 2
        649/649, 0/649,
        649/649, 649/649,
        0/649, 649/649,

    ]);

    houseBuf.setAttribute('position', new T.BufferAttribute(positions, 3));
    houseBuf.setAttribute('uv', new T.BufferAttribute(uv, 2));

    houseBuf.computeVertexNormals();

    let house = new T.Mesh(houseBuf, material);
    house.receiveShadow = true;
    house.castShadow = true;

    let roofMat = new T.MeshStandardMaterial({ map: roof, bumpMap: roof, bumpScale: 5, color: "#FF6E6F" });

    let roofBuf = new T.BufferGeometry();

    const roofVertices = [
        [0, 2, .25],
        [2, 2, .25],
        [2, 3, -.76],
        [0, 3, -.76],
    ];

    const roofPositions = new Float32Array([
        // roof 0, 1, 2
        ...roofVertices[0],
        ...roofVertices[1],
        ...roofVertices[2],

        // roof 2, 3, 0
        ...roofVertices[2],
        ...roofVertices[3],
        ...roofVertices[0],

    ]);

    const roofUV = new Float32Array([
        // roof 0, 1, 2
        0/649, 0/649,
        575/649, 0/649,
        575/649, 400/649,

        // roof 2, 3, 0
        575/649, 400/649,
        0/649, 400/649,
        0/649, 0/649,

    ]);

    roofBuf.setAttribute('position', new T.BufferAttribute(roofPositions, 3));
    roofBuf.setAttribute('uv', new T.BufferAttribute(roofUV, 2));

    roofBuf.computeVertexNormals();

    let roofMesh = new T.Mesh(roofBuf, roofMat);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;

    let group = new T.Group();
    group.add(house);
    group.add(roofMesh);

    return group;
}