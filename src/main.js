import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

import * as CANNON from "cannon-es";
import { Player } from "./components/Player";
import { Kirby } from "./components/Kirby";
import { Coin } from "./components/Coin";
import { Loader } from "./components/Loader";
import { Spot, Pointer, Text } from "./components/SpotMesh";
// import { Sound } from "Sound";
import { CarEvent } from "./module/CarEvent";
import { PianoEvent } from "./module/PianoEvent";

import { kirby_random, kirby_run } from "./Kirby";
import gsap from "gsap";

//
// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("/images/grid.png");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 10;
floorTexture.repeat.y = 10;

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/** CSS2DRenderer */
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight); //이거 중복아닌가?

labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

/** HTML Element ___________________________________________*/
const bodyTag = document.querySelector("body");

const popupDiv = document.createElement("div");
popupDiv.classList.add("popup");
let popVisible = false;

const list = [
  { check: false, title: "자동차 탑승하기" },
  { check: false, title: "동전 모으기" },
  { check: false, title: "커비 따라가기" },
];

/** 할일목록 구역 */
const todoDiv = document.createElement("div");
const titleDiv = document.createElement("p");

titleDiv.innerText = "🚩 Todo List";
titleDiv.classList.add("title");
bodyTag.appendChild(todoDiv);
todoDiv.appendChild(titleDiv);

list.forEach((item) => {
  const containerDiv = document.createElement("div"); // 체크 + 할 일 담는 div
  const checkDiv = document.createElement("p"); //체크아이콘
  const listDiv = document.createElement("p"); //할 일 타이틀
  checkDiv.innerHTML = item.check ? `✔` : ``;
  listDiv.innerText = item.title;
  containerDiv.classList.add("containerDiv");

  containerDiv.appendChild(checkDiv);
  containerDiv.appendChild(listDiv);
  todoDiv.appendChild(containerDiv);
});

// todoDiv.innerText = "TO DO LIST";
todoDiv.classList.add("todo");

// Scene
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();

//그리드
// const axesHelper = new THREE.AxesHelper(100);
// const grid = new THREE.GridHelper(100, 100);
// scene.add(grid, axesHelper);

// Camera
const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight), // left
  window.innerWidth / window.innerHeight, // right,
  1, // top
  -1, // bottom
  -1000,
  1000
);

const cameraPosition = new THREE.Vector3(1, 4, 5);
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
camera.zoom = 0.2;
camera.updateProjectionMatrix();
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 0.5);
const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
directionalLight.position.x = directionalLightOriginPosition.x;
directionalLight.position.y = directionalLightOriginPosition.y;
directionalLight.position.z = directionalLightOriginPosition.z;
directionalLight.castShadow = true;

// mapSize 세팅으로 그림자 퀄리티 설정
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 그림자 범위
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = -100;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);

// Mesh
const meshes = [];

/* 바닥 격자무늬 */
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(75, 75),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
  })
);
floorMesh.name = "floor";
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);

/* 마우스 클릭 포인터 */
const pointerMesh = new THREE.Mesh(
  new THREE.CircleGeometry(0.3, 32),
  new THREE.MeshBasicMaterial({
    color: "crimson",
    transparent: true,
    opacity: 0.5,
  })
);
pointerMesh.rotation.x = -Math.PI / 2;
pointerMesh.position.y = 0.01;
pointerMesh.receiveShadow = true;
scene.add(pointerMesh);

/* 이벤트 스팟 포인터 ____________________________________________*/
const car_spotMesh = new Spot({
  size: { x: 0.6, y: 32 },
  position: { x: 0, y: 0.005, z: -2 },
});
const car_pointer = new Pointer({
  size: { x: 1, y: 2 },
  position: { x: 1.5, y: 0.01, z: -1 },
  source: "images/pointer_2.png",
  scene,
});

const piano_spotMesh = new Spot({
  size: { x: 0.6, y: 32 },
  position: { x: 20, y: 0.005, z: 0 },
});
const piano_pointer = new Pointer({
  size: { x: 1, y: 2 },
  position: { x: 20, y: 0.01, z: -2 },
  rotationZ: Math.PI,
  source: "images/pointer.png",
  scene,
});

const coin_spotMesh = new Spot({
  size: { x: 0.6, y: 32 },
  position: { x: 20, y: 0.05, z: 5 },
});

const kirby_spotMesh = new Spot({
  size: { x: 0.6, y: 32 },
  position: { x: 0, y: 0.05, z: 3 },
});
scene.add(car_spotMesh, piano_spotMesh, coin_spotMesh, kirby_spotMesh);

// Cannon(물리 엔진) + 성능을 위한 세팅
const cannonWorld = new CANNON.World();
cannonWorld.gravity.set(0, -20, 0);
// cannonWorld.allowSleep = true;
cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

// Contact Material
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.5,
    restitution: 0.3,
  }
);
cannonWorld.defaultContactMaterial = defaultContactMaterial;

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, 0, 0),
  shape: floorShape,
  material: defaultMaterial,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
cannonWorld.addBody(floorBody);

//__________________________________________________________________________
/* piano 스팟에 가면 노래 재생 */
// let piano_play = false; // true면 이미 재생중
// function piano_sound(state) {dd
//   if (piano_play) {
//     return;
//   } else {
//     return Sound("/sounds/whistling.mp3", state);
//   }
// }
const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/ilbuni.glb",
});

//Player Tag ___________________________________________________
const playerDiv = document.createElement("div");
playerDiv.className = "label";
playerDiv.innerText = "Player";
const playerLabel = new CSS2DObject(playerDiv);
playerLabel.position.set(0, -2, 0);
playerLabel.layers.set(0);

const pianoDiv = document.createElement("div");
pianoDiv.className = "label";
pianoDiv.innerText = "클릭하면 사이트가 열려요";
const pianoLabel = new CSS2DObject(pianoDiv);
pianoLabel.position.set(0, -0.5, 0);
pianoLabel.layers.set(0);

const moneyDiv = document.createElement("div");
moneyDiv.className = "label";
moneyDiv.innerText = `동전을 주워주세요.`;
const moneyLabel = new CSS2DObject(moneyDiv);
moneyLabel.position.set(0, -0.5, 0);
moneyLabel.layers.set(0);

//_________________________________________________
const kirby = new Kirby({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/kirby/kirby.glb",
  scale: 0.005,
  // position: { x: 23, y: 0, z: 9 },
  position: { x: 2, y: 0.5, z: 0 },
  CSS2DObject,
  container: new THREE.Object3D(),
  name_label: "커비",
});
/* 박스 배열 */
const coins = []; //물리 주기위해 배열에 담음
let fallingCoins = false; // 코인 추락 이벤트 발생
let catching = false; //코인 수집 가능 여부(돼지 클릭 시점부터 시작)

let totalCoin = 7; //코인 총 수

let catchCoin = []; //닿은 코인 이름 전부
let catchList; // 중복 제거

function coinEvent(state) {
  if (state) {
    let box;
    for (let i = 0; i < totalCoin; i++) {
      box = new Coin({
        index: i,
        scene,
        cannonWorld,
        gltfLoader,
        position: { x: 20 + (i % 2), y: 5 + i * 5, z: 6 + (i % 2) },
      });
      coins.push(box);
    }
  }
}

//
const cafe = new Loader({
  scene,
  gltfLoader,
  root: "/models/Cafe/scene.gltf",
  name: "cafe",
  scale: 0.4,
  rotation: { z: Math.PI / 1 },
  position: { x: 0, y: 0, z: 6 },
  meshes: meshes,
});

const moneybox = new Loader({
  scene,
  gltfLoader,
  root: "/models/moneybox/scene.gltf",
  name: "moneybox",
  scale: 0.005,
  position: { x: 23, y: 0, z: 6 },
  meshes: meshes,
});

const car = new Loader({
  scene,
  gltfLoader,
  root: "/models/car/scene.gltf",
  name: "car",
  scale: 0.0075,
  position: { x: 0, y: 0, z: -4 },
  meshes: meshes,
  CSS2DObject,
  container: new THREE.Object3D(),
  name_label: "자동차에 탑승해주세요",
  // speech_label: "자동차에 탑승해주세요",
});
const piano = new Loader({
  scene,
  gltfLoader,
  rotation: { z: Math.PI / 1 },
  root: "/models/piano/scene.gltf",
  name: "piano",
  scale: 5,
  position: { x: 23, y: -1.5, z: 0 },
  meshes: meshes,
  // CSS2DObject,
  // container: new THREE.Object3D(),
  // name_label: "클릭하면 사이트로 이동합니다",
});

let grasses = [];
const grass_1 = new Loader({
  scene,
  gltfLoader,
  root: "/models/grass/scene.gltf",
  name: "grass",
  scale: 2,
  position: { x: 24, y: -3, z: 2 },
});
const grass_2 = new Loader({
  scene,
  gltfLoader,
  root: "/models/grass/scene.gltf",
  name: "grass",
  scale: 1,
  position: { x: 21.5, y: -3, z: 1.5 },
});
grasses.push(grass_1, grass_2);

// ________________________________________________
const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let angle = 0;
let isPressed = false; // 마우스를 누르고 있는 상태

// 그리기 _________________________________________________
const clock = new THREE.Clock();

/** 커비의 방향, 진행중인 상태 표시 */
let dirX = true; //true : 오른쪽, false : 왼쪽
let dirZ = true; //true : 전진, false : 후진
let run = false;
let lookX;
let lookZ;

let moneyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xf88379,
  clearcoatRoughness: 0.2,
});
function draw() {
  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  /** ADD Label  */
  player.modelMesh?.add(playerLabel);
  piano.modelMesh?.add(pianoLabel);
  moneybox.modelMesh?.add(moneyLabel);

  if (catchList?.length === totalCoin) {
    let pigObj = moneybox.modelMesh?.getObjectByName("Pig2");

    pigObj.children[0].material = moneyMaterial;
    pigObj.children[1].material = moneyMaterial;

    moneyDiv.innerText = `동전을 다 모았어요!
    ${
      catchList?.length
        ? catchList.length + "/" + totalCoin
        : "0 / " + totalCoin
    }
    `;
  } else {
    moneyDiv.innerText = `동전을 모아주세요.
    ${
      catchList?.length
        ? catchList.length + "/" + totalCoin
        : "0 / " + totalCoin
    }`;
  }

  /** 중력설정 */
  cannonWorld.step(1 / 20, delta, 3); //원래는 1/60인데 코인이 너무 튀어서 줄임

  /** 동전 물리적 낙하 설정 */
  if (fallingCoins) {
    coins.forEach((item) => {
      if (item.cannonBody) {
        item.modelMesh.position.copy(item.cannonBody.position);
        item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
      }
    });
  }

  if (player.mixer) player.mixer.update(delta);

  if (player.modelMesh) {
    camera.lookAt(player.modelMesh.position);
  }

  if (player.modelMesh) {
    if (isPressed) {
      raycasting();
    }

    if (player.moving) {
      // 걸어가는 상태
      angle = Math.atan2(
        destinationPoint.z - player.modelMesh.position.z,
        destinationPoint.x - player.modelMesh.position.x
      );
      player.modelMesh.position.x += Math.cos(angle) * 0.05;
      player.modelMesh.position.z += Math.sin(angle) * 0.05;

      camera.position.x = cameraPosition.x + player.modelMesh.position.x;
      camera.position.z = cameraPosition.z + player.modelMesh.position.z;

      player.actions[0].stop();
      player.actions[1].play();

      /* 목적지와 플레이어 거리를 보고 정지 */
      if (
        Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 &&
        Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03
      ) {
        player.moving = false;
        console.log("멈춤");
      }

      CarEvent({
        car,
        car_spotMesh,
        player,
        gsap,
        camera,
      });

      PianoEvent({
        piano,
        piano_spotMesh,
        pianoLabel,
        grasses,
        player,
        gsap,
        camera,
      });

      /* coin spot event */
      if (
        Math.abs(coin_spotMesh.position.x - player.modelMesh.position.x) <
          0.5 &&
        Math.abs(coin_spotMesh.position.z - player.modelMesh.position.z) < 0.5
      ) {
        if (fallingCoins == false) {
          fallingCoins = true;

          coinEvent(true);

          setTimeout(() => {
            catching = true;
          }, 3000);

          gsap.to(camera.position, {
            duration: 1,
            y: 3,
          });
        }
        coin_spotMesh.material.color.set("seagreen");
      } else {
        coin_spotMesh.material.color.set("yellow");
        // fallingCoins = false;
        gsap.to(camera.position, {
          duration: 1,
          y: 5,
        });
      }

      /* catch coin event */
      if (fallingCoins && catching) {
        let targetName;

        coins.forEach((coin) => {
          if (
            Math.abs(coin.modelMesh?.position.x - player.modelMesh.position.x) <
              0.5 &&
            Math.abs(coin.modelMesh?.position.z - player.modelMesh.position.z) <
              0.5
          ) {
            catchCoin.push(coin.modelMesh.name);
            catchList = Array.from(new Set(catchCoin));

            targetName = scene.getObjectByName(coin.modelMesh.name);

            scene.remove(targetName);
          }
        });
      }

      /** kirby spot running event */
      if (
        Math.abs(kirby_spotMesh.position.x - player.modelMesh.position.x) <
          0.5 &&
        Math.abs(kirby_spotMesh.position.z - player.modelMesh.position.z) < 0.5
      ) {
        kirby_spotMesh.material.color.set("seagreen");
      } else {
        kirby_spotMesh.material.color.set("yellow");
      }
      //
    } else {
      // 서 있는 상태
      player.actions[1].stop();
      player.actions[0].play();
    }
  }

  /** 커비 애니메이션 함수 */
  /**
   * Position
   *  1. 정방향인지 역방향인지 확인하기 위해 moving 값 사용.
   *    - true 인 경우 : 순방향 (좌 -> 우 / 전진)
   *    - false 인 경우 : 역방향 (우-> 좌/ 후진)
   *
   * Rotation
   *  1. 끝에 도달하면 회전
   */

  /** kirby.animation */
  // if (time != 0) {
  //   switch (Math.ceil(time % 10)) {
  //     case 0:
  //       kirby.actions[1].stop();
  //       kirby.actions[2].play();
  //       speed = 2;
  //       break;
  //     case 5:
  //       kirby.actions[2].stop();
  //       kirby.actions[1].play();
  //       speed = 0.5;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  /** kirby. random moving */
  // X축 이동
  if (Math.ceil(kirby.modelMesh?.position.x) >= 3) {
    dirX = false;
  } else if (Math.ceil(kirby.modelMesh?.position.x) <= -3) {
    dirX = true;
  }

  // Z축 이동
  if (Math.ceil(kirby.modelMesh?.position.z) < 0) {
    dirZ = true;
  } else if (Math.ceil(kirby.modelMesh?.position.z) >= 3) {
    dirZ = false;
  }
  // kirby_random, kirby_run(kirby, delta, dirX, dirZ, speed);

  if (run) {
    kirby.modelMesh.lookAt(10, 20, 0);
    kirby_run(run, kirby, delta);
  }

  /* Render */
  renderer.setAnimationLoop(draw);
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

/* 레이캐스팅때 실행 */
function checkIntersects() {
  // raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(meshes);

  for (const item of intersects) {
    console.log(item.object.name);

    if (item.object.name === "floor") {
      destinationPoint.x = item.point.x;
      destinationPoint.y = 0.3;
      destinationPoint.z = item.point.z;
      //
      player.modelMesh.lookAt(destinationPoint);
      player.moving = true;
      //
      pointerMesh.position.x = destinationPoint.x;
      pointerMesh.position.z = destinationPoint.z;

      if (!run) {
        kirby.modelMesh.lookAt(destinationPoint.x, 20, destinationPoint.z);
      } else {
      }
    }

    //piano 클릭시 유튜브 창 띄우기
    if (item.object.name.includes("piano_")) {
      if (confirm("음악을 들으러 가시겠어요?")) {
        window.open("https://www.youtube.com/watch?v=_CzSCWpF7TM");
      } else {
        return;
      }
    }

    /** 동전 줍기 이벤트 실행 */
    // if (item.object.name.includes("moneybox_")) {
    //   catching = true;
    // }
    if (item.object.name.includes("kirby")) {
      if (confirm("커비와 달리기 경주를 시작합니다!")) {
        run = true;
      } else {
        run = false;
        return;
      }
      catching = true;
    }

    if (item.object.cannonBody && fallingCoins) {
      item.object.cannonBody.applyForce(
        new CANNON.Vec3(0, 0, 100),
        new CANNON.Vec3(0, 0, 0)
      );
      break;
    }
    break;
  }
}

function setSize() {
  camera.left = -(window.innerWidth / window.innerHeight);
  camera.right = window.innerWidth / window.innerHeight;
  camera.top = 1;
  camera.bottom = -1;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);

  // renderer.render(scene, camera);
  // labelRenderer.render(scene, camera);
}

// 이벤트_______________________________________________________
window.addEventListener("resize", setSize);

// 마우스 좌표를 three.js에 맞게 변환
function calculateMousePosition(e) {
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
}

// 변환된 마우스 좌표를 이용해 래이캐스팅
function raycasting() {
  raycaster.setFromCamera(mouse, camera);
  checkIntersects();
}
// 마우스 이벤트
canvas.addEventListener("mousedown", (e) => {
  isPressed = true;
  calculateMousePosition(e);
});
canvas.addEventListener("mouseup", () => {
  isPressed = false;
});
canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    calculateMousePosition(e);
  }
});

// 터치 이벤트
canvas.addEventListener("touchstart", (e) => {
  isPressed = true;
  calculateMousePosition(e.touches[0]);
});
canvas.addEventListener("touchend", () => {
  isPressed = false;
});
canvas.addEventListener("touchmove", (e) => {
  if (isPressed) {
    calculateMousePosition(e.touches[0]);
  }
});

draw();
