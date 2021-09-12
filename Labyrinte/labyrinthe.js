//imports
import * as THREE from "./three.js-master/build/three.module.js";
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls.js";
import { PLYExporter } from "./three.js-master/examples/jsm/exporters/PLYExporter.js";

//create scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
var camera = new THREE.PerspectiveCamera(75, 1080 / 720, 0.1, 1000);

//render
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

camera.position.z = 5;
camera.position.y = 5;
camera.rotateX(-0.6);

const grid = new THREE.GridHelper(20, 200, 0x00000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

//Create a WebGLRenderer and turn on shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 1, 0 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default















// code

let gridLab = [[]],
  width = 20,
  height = 20;

const buttoncreateGrid = document.getElementById("creteGrid");
buttoncreateGrid.addEventListener("click", ButtoncreateGrid);

function ButtoncreateGrid(){
  createGrid();
}

function createGrid() {
  // get values from inputs width and height
  // and store in let width, height

  width = document.getElementById("width").value;
  height = document.getElementById("height").value;
  console.log(width, height);

  //store one's in gridLab in a 2D array of width and height

  let temporay_line = [];

  for (let j = 0; j < width; j++) {
    temporay_line.push(1);
  } // temporay_line = [1,1,1,...,1,1,1]
  gridLab[0] = temporay_line;
  for (let i = 0; i < height - 1; i++) {
    //console.log("tempIN:",temporay_line);
    gridLab.push([...temporay_line]);
  } // gridLab :
  /*    [1,1,1,...,1,1,1],
         [1,1,1,...,1,1,1],
         .
         .
         .
         [1,1,1,...,1,1,1],
         [1,1,1,...,1,1,1]
   */

  // get valueAtPos = gridLab[x][y]

  //algo that crave in the grid

  gridLab = algo1([...gridLab]);

  //console.log(gridLab);
  showGrid(gridLab);
}
//createGrid(1);

// algo remove random bits
function random(Grid) {
  for (let k = 0; k < 50; k++) {
    let x = randomNum(1, width - 1);
    //let x = randomNum(0, width);
    let y = randomNum(1, height - 1);
    //console.log("removed",k,":",x,",",y,"prevValue =",gridLab);

    Grid[x][y] = 0;
    //console.log("after :",gridLab);
  }
  return Grid;
}

//algo function
function algo1(Grid) {
  let fille_d_attente = [];
  let x = randomNum(1, width - 1);
  let y = randomNum(1, height - 1);
  Grid[x][y] = 0;
  let tuple_to_add = getWall(x, y, Grid[0].length, Grid.length);
  for (let k = 0; k < tuple_to_add.length; k++) {
    fille_d_attente.push(tuple_to_add[k]);
  }

  let loops = 0;
  while (fille_d_attente.length > 0 && loops < 5000) {
    loops++;
    x = fille_d_attente[0][0];
    y = fille_d_attente[0][1];
    Grid[x][y] = 0;
    tuple_to_add = getWall(x, y, Grid[0].length, Grid.length);
    for (let k = 0; k < tuple_to_add.length; k++) {
      if (Grid[tuple_to_add[k][0]][tuple_to_add[k][1]] == 1) {
        if (checkWall(tuple_to_add[k][0], tuple_to_add[k][1], Grid)) {
          fille_d_attente.push(tuple_to_add[k]);
        }
      }
    }
    fille_d_attente.splice(0, 1);
    fille_d_attente = uniq_fast([...fille_d_attente]);
    //console.log(fille_d_attente);
  }

  return Grid;
}

function uniq_fast(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for (var i = 0; i < len; i++) {
    var item = a[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}
function checkWall(x, y, Grid) {
  let countSides = 0;

  //Right
  if (Grid[x + 1][y] == 0) {
    countSides++;
  }
  //Left
  if (Grid[x - 1][y] == 0) {
    countSides++;
  }
  //Down
  if (Grid[x][y + 1] == 0) {
    countSides++;
  }
  //Up
  if (Grid[x][y - 1] == 0) {
    countSides++;
  }

  let countALL = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      //console.log("g[",x+i,"]","[",y+j,"]  =", Grid[x+i][y+j])
      if (Grid[x+i][y+j] == 0 && !(x == i && y == j)) {
        countALL++;
      }
    }
  }
  let countDiagnols = countALL - countSides;

 
  let diagnos = false;
  if (countSides <= 1 && countDiagnols <= 1) {
    diagnos = true;
  }
  console.log("A ", countALL, "  S ", countSides, "  D ", countDiagnols, "result", diagnos);
  return diagnos;
}

function getWall(x, y, width, height) {
  let tupleToReturn = []; // push([x-1, y])
  //test for x+1, y
  if (x + 1 < width - 1) {
    tupleToReturn.push([x + 1, y]);
  }
  //
  if (x - 1 >= 1) {
    tupleToReturn.push([x - 1, y]);
  }
  if (y - 1 >= 1) {
    tupleToReturn.push([x, y - 1]);
  }
  if (y + 1 < height - 1) {
    tupleToReturn.push([x, y + 1]);
  }
  return tupleToReturn;
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

let heightCube = 0.1,
  widthCube = 0.1,
  depthCube = 0.15;

function showGrid(Grid) {
  let orginX = (widthCube * width) / 2,
    orginZ = (heightCube * height) / 2;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (Grid[i][j] == 1) {
        //console.log(i*widthCube,j*depthCube)
        var geometry = new THREE.BoxGeometry(widthCube, depthCube, heightCube);
        var material = new THREE.MeshBasicMaterial({
          color: 0xf1c251,
          opacity: 1,
          transparent: true,
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.castShadow = false;
        cube.receiveShadow = true;
        scene.add(cube);
        cube.position.x = j * widthCube - orginX;
        cube.position.y = depthCube / 2;
        cube.position.z = i * heightCube - orginZ;
      }
    }
  }
  var geometry_plat = new THREE.BoxGeometry(
    widthCube * width,
    0,
    heightCube * height
  );
  var material_plat = new THREE.MeshBasicMaterial({
    color: 0x00000,
    opacity: 1,
    transparent: true,
  });
  var platform = new THREE.Mesh(geometry_plat, material_plat);
  scene.add(platform);
  platform.position.x = 0 - widthCube / 2;
  platform.position.y = 0;
  platform.position.z = 0 - heightCube / 2;
}

//animate

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

//exporter

let exporter;
exporter = new PLYExporter();

const buttonExportASCII = document.getElementById("exportASCII");
buttonExportASCII.addEventListener("click", exportASCII);

function exportASCII() {
  console.log("ascii");

  exporter.parse(mesh, function (result) {
    saveString(result, "box.ply");
  });
}

const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

function save(blob, filename) {
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function saveString(text, filename) {
  save(new Blob([text], { type: "text/plain" }), filename);
}




