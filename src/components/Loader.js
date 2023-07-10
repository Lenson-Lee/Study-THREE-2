export class Loader {
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

    info.gltfLoader.load(info.root, (glb) => {
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.name = info.name;
      this.modelMesh.castShadow = true;
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.modelMesh.scale.set(info.scale, info.scale, info.scale);

      if (info?.rotation?.x) {
        this.modelMesh.rotation.x = info?.rotation?.x;
      } else if (info?.rotation?.y) {
        this.modelMesh.rotation.y = info?.rotation?.y;
      } else if (info?.rotation?.z) {
        this.modelMesh.rotation.z = info?.rotation?.z;
      }

      // 자식요소 이름 설정 : 본체_요소이름
      glb.scene.traverse(function (child) {
        if (child.isMesh) {
          child.name = info.name + "_" + child.name;
        }
      });

      if (info?.meshes) {
        info.meshes.push(this.modelMesh);
      }
      if (info?.text) {
        this.scene.add(this.modelMesh, info.text);
      }

      if (info?.sourceImage) {
      }

      // scene.add
      this.scene.add(this.modelMesh);
    });
  }
}
