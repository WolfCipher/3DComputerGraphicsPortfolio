// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

let book_texture = new T.TextureLoader().load("../images/skandar_book.png", texture => {
    texture.colorSpace = T.SRGBColorSpace;
});

let carpet = new T.TextureLoader().load("../images/carpet.jpg", texture => {
    texture.colorSpace = T.SRGBColorSpace;
});

class Book extends GrObject {

    constructor() {
        let bookGeom = new T.BufferGeometry();
        let pageGeom = new T.BufferGeometry();

        let vertices = [
            [-1, -.375, 1.5],
            [1, -.375, 1.5],
            [-1, .375, 1.5],
            [1, .375, 1.5],
            [-1, -.375, -1.5],
            [1, -.375, -1.5],
            [-1, .375, -1.5],
            [1, .375, -1.5],
        ];

        let positions = new Float32Array([
            // left 4, 0, 6
            ...vertices[4], ...vertices[0], ...vertices[6],
            // left 0, 2, 6
            ...vertices[0], ...vertices[2], ...vertices[6],
            // top 2, 3, 6
            ...vertices[2], ...vertices[3], ...vertices[6],
            // top 3, 7, 6
            ...vertices[3], ...vertices[7], ...vertices[6],
            // bottom 0, 4, 1
            ...vertices[0], ...vertices[4], ...vertices[1],
            // bottom 1, 4, 5
            ...vertices[1], ...vertices[4], ...vertices[5],
        ]);

        let posPages = new Float32Array([
            // front 0, 1, 2
            ...vertices[0], ...vertices[1], ...vertices[2],
            // front 1, 3, 2
            ...vertices[1], ...vertices[3], ...vertices[2],
            // right 1, 5, 3
            ...vertices[1], ...vertices[5], ...vertices[3],
            // right 5, 7, 3
            ...vertices[5], ...vertices[7], ...vertices[3],
            // back 5, 4, 7
            ...vertices[5], ...vertices[4], ...vertices[7],
            // back 4, 6, 7
            ...vertices[4], ...vertices[6], ...vertices[7],
        ]);

        bookGeom.setAttribute("position", new T.BufferAttribute(positions, 3));
        pageGeom.setAttribute("position", new T.BufferAttribute(posPages, 3));

        let uvs = new Float32Array([
            // left 4, 0, 6 SPINE
            2500/5708, 1,
            2500/5708, 600/4260,
            3200/5708, 1,
            // left 0, 2, 6 SPINE
            2500/5708, 600/4260,
            3200/5708, 600/4260,
            3200/5708, 1,
            // top 2, 3, 6
            3200/5708, 600/4260,
            1, 600/4260,
            3200/5708, 1,
            // top 3, 7, 6
            1, 600/4260,
            1, 1,
            3200/5708, 1,
            // bottom 0, 4, 1
            2500/5708, 600/4260,
            2500/5708, 1,
            0, 600/4260,
            // bottom 1, 4, 5
            0, 600/4260,
            2500/5708, 1,
            0, 1

        ]);

        let uvPages = new Float32Array([
            // front 0, 1, 2 PAGES
            0, 0,
            1/4, 0,
            0, 200/4260,
            // front 1, 3, 2 PAGES
            1/4, 0,
            1/4, 200/4260,
            0, 200/4260,
            // right 1, 5, 3 PAGES
            0, 0,
            1/2, 0,
            0, 200/4260,
            // right 5, 7, 3 PAGES
            1/2, 0,
            1/2, 200/4260,
            0, 200/4260,
            // back 5, 4, 7 PAGES
            0, 0,
            1/4, 0,
            0, 200/4260,
            // back 4, 6, 7 PAGES
            1/4, 0,
            1/4, 200/4260,
            0, 200/4260,
        ]);

        bookGeom.computeVertexNormals();
        bookGeom.setAttribute("uv", new T.BufferAttribute(uvs, 2));
        pageGeom.computeVertexNormals();
        pageGeom.setAttribute("uv", new T.BufferAttribute(uvPages, 2));

        let bookMat = new T.MeshStandardMaterial({ map: book_texture, roughness: 0.4, metalness: 0.5 });
        let bookMesh = new T.Mesh(bookGeom, bookMat);
        let pageMat = new T.MeshStandardMaterial({ map: book_texture, roughness: 0.7});
        let pageMesh = new T.Mesh(pageGeom, pageMat);

        bookMesh.receiveShadow = true;
        bookMesh.castShadow = true;
        pageMesh.receiveShadow = true;
        pageMesh.castShadow = true;

        let bookGroup = new T.Group();
        bookGroup.add(bookMesh);
        bookGroup.add(pageMesh);

        super("Book", bookGroup);

        this.book = bookGroup;
        this.time = 0;
    }

    stepWorld(delta, timeOfDay) {
        this.objects[0].rotateZ(0.01);

        // bob up and down
        this.time += delta/1000;
        let bob = Math.sin(this.time);
        this.objects[0].position.y = 2.25 + bob/5;
    }
}

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas, groundplanecolor: "lightblue" });

world.renderer.shadowMap.enabled = true;

world.groundplane.mesh.receiveShadow = true;
world.groundplane.material.map = carpet;
world.groundplane.material.bumpMap = carpet;
world.groundplane.material.bumpScale = 2;
world.scene.background = new T.Color("#106088");

let directionalLight = new T.DirectionalLight("white", 5);
directionalLight.position.set(0, 5, 3);
directionalLight.castShadow = true;
world.scene.add(directionalLight);

let book = new Book();
book.setScale(1.3,1.3,1.3);
book.objects[0].position.y = 2.25;
book.objects[0].rotateX(Math.PI / 2);
book.objects[0].castShadow = true;
book.objects[0].receiveShadow = true;
world.add(book);

world.go();

