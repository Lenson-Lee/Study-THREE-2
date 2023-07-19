import { AnimationMixer } from "three";

export class Player {
  constructor(info) {
    this.moving = false;

    //cannon : 물리엔진
    this.cannonWorld = info.cannonWorld;

    info.gltfLoader.load(info.modelSrc, (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      this.modelMesh = glb.scene.children[0];
      this.modelMesh.position.set(0, 0.3, 0);

      this.modelMesh.name = "ilbuni";

      this.modelMesh.layers.enableAll();

      info.scene.add(this.modelMesh);
      info.meshes.push(this.modelMesh); //레이캐스팅을 위해 메쉬에 담음

      this.actions = [];

      this.mixer = new AnimationMixer(this.modelMesh);
      this.actions[0] = this.mixer.clipAction(glb.animations[0]);
      this.actions[1] = this.mixer.clipAction(glb.animations[1]);
      this.actions[0].play();

      // Check if the label exists in the container
      // const hasLabel = container.children.some(
      //   (child) => child instanceof CSS2DObject
      // );

      // if (hasLabel) {
      //   console.log("🌊라벨 있어요");
      // } else {
      //   console.log("👀라벨 왜 또 없어요?");
      // }
    });
  }
}
