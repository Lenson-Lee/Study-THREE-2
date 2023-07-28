import { AnimationMixer } from "three";
import { Body, Box, Vec3 } from "cannon-es";

export class Kirby {
  constructor(info) {
    this.moving = false;

    this.x = info.position.x || 0;
    this.y = info.position.y || 0.5;
    this.z = info.position.z || 0;

    info.gltfLoader.load(info.modelSrc, (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;

          child.name = "kirby_" + child.name;
        }
      });
      this.modelMesh = glb.scene.children[0];

      // this.modelMesh.layers.enableALL();

      this.modelMesh.name = "kirby";
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.modelMesh.scale.set(info.scale, info.scale, info.scale);
      this.modelMesh.layers.enableAll();

      /** Label Name */
      const div = document.createElement("div");
      div.className = "label";
      div.innerText = info.name_label;

      const label = new info.CSS2DObject(div);
      label.position.set(0, -2, 0);
      label.layers.set(0);

      this.modelMesh.add(label);

      // info.scene.add(container);
      info.scene.add(this.modelMesh);
      info.meshes.push(this.modelMesh);

      // this.modelMesh.add(info.container);

      this.actions = [];

      this.mixer = new AnimationMixer(this.modelMesh);

      //[0] : stop / [1] : walk / [2] : run
      this.actions[0] = this.mixer.clipAction(glb.animations[0]);
      this.actions[1] = this.mixer.clipAction(glb.animations[1]);
      this.actions[2] = this.mixer.clipAction(glb.animations[2]);
    });
  }
}
