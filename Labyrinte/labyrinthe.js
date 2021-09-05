
//imports
import * as THREE from './three.js-master/build/three.module.js';
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';
import { PLYExporter } from './three.js-master/examples/jsm/exporters/PLYExporter.js';


//create scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
var camera = new THREE.PerspectiveCamera(75, 1080 / 720, 0.1, 1000);


//render 
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// code

let gridLab, width, height;

const buttoncreateGrid = document.getElementById('creteGrid');
buttoncreateGrid.addEventListener('click', createGrid);

function createGrid() {

    // get values from inputs width and height
    // and store in let width, height

    width = document.getElementById('width').value;
    height = document.getElementById('height').value;
    console.log(width, height);


}

//animate 

//function animate() {
//    requestAnimationFrame(animate);
//    controls.update();
//    renderer.render(scene, camera);
//}
//animate();
//





//exporter 

let exporter
exporter = new PLYExporter();

const buttonExportASCII = document.getElementById('exportASCII');
buttonExportASCII.addEventListener('click', exportASCII);

function exportASCII() {
    console.log("ascii")

    exporter.parse(mesh, function (result) {

        saveString(result, 'box.ply');

    });

}

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