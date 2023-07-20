/**
 * <기본 파라미터>
 * scene : 생성한 scene
 * gltfLoader : Loader
 * root : 파일경로(string)
 * name : 모델명(string)
 * scale : 크기(number)
 * position : 위치 {x: number, y: number, z: number}
 *
 * <라벨링을 위한 파라미터>
 * meshes : raycaster를 위해 배열에 저장 | NULL
 * CSS2DObject : CSS2DObject(변수)를 위해 통째로 넘김 | NULL
 * container : new THREE.Object3D()를 넘김 | NULL
 * name_label : 라벨명(string)
 */
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

      this.modelMesh.layers.enableAll();

      // Name Label _____________________________________________
      if (info?.CSS2DObject) {
        const container = info.container;
        this.modelMesh.position.set(0, 0, 0); //컨테이너와 포지션이 중복되어서 0으로 변경

        if (info?.name_label) {
          console.log("이름라벨 : ", info.name);

          const div = document.createElement("div");
          div.className = "label";
          div.innerText = info.name_label;

          const label = new info.CSS2DObject(div);
          label.position.set(0, -1, 0);
          label.layers.set(0);
          container.add(label);
          // this.modelMesh.add(label);
        }
        // container.add(label); -> 이게 맞는데 태그가 안따라가서 임시로 메쉬에 적용
        container.add(this.modelMesh);
        container.position.set(this.x, this.y, this.z);

        this.scene.add(container);
        return;
      }

      this.scene.add(this.modelMesh);
    });
  }
}
