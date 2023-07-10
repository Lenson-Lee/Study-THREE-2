import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { Body, Box, Vec3 } from "cannon-es";
import { EffectSound } from "../Sound";

export class Coin {
  constructor(info) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;

    this.index = info.index;

    this.width = 1;
    this.height = 1;
    this.depth = 1;

    this.x = info.position.x || 0;
    this.y = info.position.y || 0.5;
    this.z = info.position.z || 0;

    this.rotationY = info.rotationY || 0;

    info.gltfLoader.load("/models/coin/scene.gltf", (glb) => {
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.name = `coin-${info.index}`;
      this.modelMesh.castShadow = true;
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.modelMesh.scale.set(0.5, 0.5, 0.5);
      this.scene.add(this.modelMesh);

      this.setCannonBody();
    });
  }

  setCannonBody() {
    const shape = new Box(
      new Vec3(this.width / 2, this.height / 2, this.depth)
    );
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape,
    });

    this.cannonBody.quaternion.setFromAxisAngle(
      new Vec3(1, 1, 1), // y축
      this.rotationY
    );

    const box_sound = new Audio("/sounds/mario.mp3");
    let sound = false;

    function collide(e) {
      const velocity = e.contact.getImpactVelocityAlongNormal();

      if (velocity > 3 && sound == false) {
        sound = true;
        box_sound.currentTime = 0;
        box_sound.play();
      }
    }

    this.modelMesh.cannonBody = this.cannonBody;
    this.cannonBody.addEventListener("collide", collide);

    this.cannonWorld.addBody(this.cannonBody);
  }
}
