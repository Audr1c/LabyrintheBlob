import * as THREE from './three.js-master/build/three.module.js';
//import { saveAs } from 'file-saver';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';
import { PLYExporter } from './three.js-master/examples/jsm/exporters/PLYExporter.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
var camera = new THREE.PerspectiveCamera(75, 1080 / 720, 0.1, 1000);


//create Box for exporting
let mesh, exporter
exporter = new PLYExporter();
const geometrym = new THREE.BoxGeometry(1, 1, 1);
const materialm = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

mesh = new THREE.Mesh(geometrym, materialm);
mesh.castShadow = false;
mesh.position.y = 10;
scene.add(mesh);
//ceci est un commentaire



//V3

const geometryt = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array([
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,

    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0
]);

// itemSize = 3 because there are 3 values (components) per vertex
geometryt.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const materialt = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesht = new THREE.Mesh(geometryt, materialt);
scene.add(mesht)


//V2 puis extrude
const length = 2, width = 2;
let posX = 5, posY = 5;

const shape = new THREE.Shape();
shape.moveTo(posX, posY);
shape.lineTo(posX, width + posY);
shape.lineTo(length + posX, width + posY);
shape.lineTo(length + posX, posY);
shape.lineTo(posX, posY);

const extrudeSettings = {
    steps: 2,
    depth: 4,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1
};

const geometryv = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const materialv = new THREE.MeshBasicMaterial({ color: 0xaa224b });
const meshv = new THREE.Mesh(geometryv, materialv);
scene.add(meshv);

// camera.lookAt(0,0,0)

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
let orientationX = 1;

//Ground
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
    color: 0x999999,
    depthWrite: false
}));
//ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
//scene.add(ground);

const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);


var geometry = new THREE.BoxGeometry(2, 2, 2, 2);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
let cubes = []
for (let i = 0; i < 5; i++) {
    var geometrycubes = new THREE.BoxGeometry(2 * Math.random(), 2 * Math.random(), 2 * Math.random(), 1);
    var materialcubes = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: Math.random(), transparent: true });
    cubes.push(new THREE.Mesh(geometrycubes, materialcubes));
    cubes[i].position.x = Math.random() * 3;
    cubes[i].position.y = Math.random() * 3;
    cubes[i].position.z = Math.random() * 3;
    scene.add(cubes[i]);

}


camera.position.z = 5;
camera.position.y = 5;
camera.rotateX(-.6)

function sign(number) {
    if (number >= 0) {
        return 1
    }
    return -1
}

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.05 * orientationX * sign(cube.position.x);
    //cube.rotation.y += 0.01;
    if (Math.abs(cube.position.x) > 8) {
        orientationX *= -1;
    }
    cube.position.x += 0.05 * orientationX;
    //console.log(cube.position.x)
    controls.update();
    renderer.render(scene, camera);
}

animate();
const buttonExportASCII = document.getElementById('exportASCII');
buttonExportASCII.addEventListener('click', exportASCII);

function exportASCII() {
    console.log("ascii")

    exporter.parse(mesh, function (result) {

        saveString(result, 'box.ply');

    });

}

/*
function exportBinaryBigEndian() {

    exporter.parse(mesh, function (result) {

        saveArrayBuffer(result, 'box.ply');

    }, {binary: true});

}
*/
const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function save(blob, filename) {

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

}

function saveString(text, filename) {

    save(new Blob([text], { type: 'text/plain' }), filename);

}

function saveArrayBuffer(buffer, filename) {

    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

}

/*
var exporter = new THREE.STLExporter();
var str = exporter.parse(scene); // Export the scene
var blob = new Blob([str], {type: 'text/plain'}); // Generate Blob from the string
//saveAs( blob, 'file.stl' ); //Save the Blob to file.stl

//Following code will help you to save the file without FileSaver.js
var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);
link.href = URL.createObjectURL(blob);
link.download = 'Scene.stl';
link.click();
// */
//C:\Users\Audric\WebstormProjects\Labyrinte