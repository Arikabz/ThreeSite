import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
})


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(6);
camera.position.setY(-3);

renderer.render(scene, camera)

//torus
const geometry = new THREE.TorusKnotGeometry(5,0.99,39,20, 8, 2)
const material = new THREE.MeshStandardMaterial({ color: 0x5D3FD3 })
const torus = new THREE.Mesh( geometry, material)

scene.add(torus);

//astronaut
var model;
const loader = new GLTFLoader();
loader.load('models/simple_spaceship/scene.gltf', function (gltf){
    gltf.scene.position.setZ(1)
    gltf.scene.position.setY(-4)
    gltf.scene.position.setX(9)
    gltf.scene.scale.setX(0.5)
    gltf.scene.scale.setZ(0.5)
    gltf.scene.scale.setY(0.5)
    model = gltf.scene;
    console.log(gltf.scene)
}, undefined, function(error){
    console.error(error)
})

//planet
var planet
loader.load('models/little_planet/scene.gltf', function (gltf){
    gltf.scene.position.setZ(17)
    gltf.scene.position.setY(-6)
    gltf.scene.position.setX(-10)
    gltf.scene.scale.setX(0.49)
    gltf.scene.scale.setZ(0.49)
    gltf.scene.scale.setY(0.49)
    planet = gltf.scene
    scene.add(planet)
}, undefined, function(error){
    console.error(error)
})

//station
var station
loader.load('models/space_station/scene.gltf', function (gltf){
    gltf.scene.position.setZ(7)
    gltf.scene.position.setY(-6)
    gltf.scene.position.setX(20)
    gltf.scene.scale.setX(1)
    gltf.scene.scale.setZ(1)
    gltf.scene.scale.setY(1)
    station = gltf.scene
    scene.add(station)
}, undefined, function(error){
    console.error(error)
})

//ship
var ship
loader.load('models/space_ranger_sr1/scene.gltf', function (gltf){
    gltf.scene.position.setZ(9)
    gltf.scene.position.setY(2)
    gltf.scene.position.setX(-8)
    gltf.scene.scale.setX(0.3)
    gltf.scene.scale.setZ(0.3)
    gltf.scene.scale.setY(0.3)
    ship = gltf.scene
    scene.add(ship)
}, undefined, function(error){
    console.error(error)
})


//Avatar
const ArtTexture = new THREE.TextureLoader().load('mesh2.jpg');

const Art = new THREE.Mesh(
    new THREE.OctahedronGeometry(1),
    //new THREE.MeshStandardMaterial({color:0xf5f7f4})
    new THREE.MeshBasicMaterial({map:ArtTexture})
)

scene.add(Art)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(18,-1.5,18)

const ambienLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambienLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50);
//scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24)
    const material = new THREE.MeshStandardMaterial({color: 0xE0B0FF})
    //0xE0B0FF -> light violet
    const star = new THREE.Mesh( geometry, material);

    const [x, y , z ] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x,y,z)
    scene.add(star)
}

Array(200).fill().forEach(addStar)

const bgTexture = new THREE.TextureLoader().load('space5.jpg');
scene.background = bgTexture


function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    Art.rotation.x += 0.015;
    Art.rotation.y += 0.0175;
    Art.rotation.z += 0.05;

    if(model) model.position.z = t * -0.0051 +9
    if(ship) ship.position.x = t * -0.0061 - 8

    if(ship) ship.rotation.x += t * 0.000015


    camera.position.z = t * -0.00333 +6;
    camera.position.x = t * -0.0066;
    camera.position.y = t * -0.00066 -3;

}

document.body.onscroll = moveCamera

function animate () {
    requestAnimationFrame(animate)

    torus.rotation.z += 0.0089;
    torus.rotation.y += 0.0009

    
    if(ship) ship.rotation.x -= 0.002

    if(planet) planet.rotation.y += -0.0029
    if(planet) planet.rotation.z += 0.0035

    if(station) station.rotation.z -= 0.0011

    controls.update();

    renderer.render(scene,camera);
}
 animate()
