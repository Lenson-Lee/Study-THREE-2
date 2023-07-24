import * as THREE from "three";
import { MeshBasicMaterial, DoubleSide, Mesh } from "three";

/* 이벤트 스팟 포인터 ____________________________________________*/
export const Spot = (props) => {
  const spot = new THREE.Mesh(
    new THREE.PlaneGeometry(props.size.x, props.size.y),
    new THREE.MeshStandardMaterial({
      color: "yellow",
      transparent: true,
      opacity: 0.5,
    })
  );
  spot.position.set(props.position.x, props.position.y, props.position.z);
  spot.rotation.x = -Math.PI / 2;
  spot.receiveShadow = true;

  return spot;
};

/* 포인터 */
export class Pointer {
  constructor(info) {
    const texture = new THREE.TextureLoader().load(info.source);
    const geometry = new THREE.PlaneGeometry(info.size.x, info.size.y);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      map: texture,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(info.position.x, info.position.y, info.position.z);
    plane.rotation.x = -Math.PI / 2;
    plane.rotation.z = info.rotationZ ? info.rotationZ : 0;
    info.scene.add(plane);
  }
}

/* 안내 텍스트 */
export class Text {
  constructor(info) {
    const canvasTexture = new THREE.CanvasTexture(info.textCanvas);
    const geometry = new THREE.PlaneGeometry(3, 3);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      map: canvasTexture,
    });
    const text = new THREE.Mesh(geometry, material);
    // text.rotation.x = -Math.PI / 2;
    text.position.set(info.position.x, info.position.y, info.position.z);

    //캔버스텍스쳐에 그리기
    info.textContext.font = "bold 36px sans-serif";
    info.textContext.fillText(info.text, 200, 200);
    // __________________________________________

    info.scene.add(text);
  }
}
