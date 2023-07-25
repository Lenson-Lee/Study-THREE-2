export function PianoEvent({
  piano,
  piano_spotMesh,
  pianoLabel,
  grasses,
  player,
  gsap,
  camera,
}) {
  if (
    Math.abs(piano_spotMesh.position.x - player.modelMesh.position.x) < 0.5 &&
    Math.abs(piano_spotMesh.position.z - player.modelMesh.position.z) < 0.5
  ) {
    if (!piano.visible) {
      console.log("들어왔어요");
      piano.visible = true;
      pianoLabel.visible = true;

      piano_spotMesh.material.color.set("seagreen");
      gsap.to(piano.modelMesh.position, {
        duration: 1,
        y: 2,
      });

      grasses.forEach((e, index) => {
        gsap.to(e.modelMesh.position, {
          duration: 1,
          y: 0,
        });
      });
      gsap.to(camera.position, {
        duration: 1,
        y: 3,
      });
    }
  } else if (piano.visible) {
    console.log("나갔어요");
    piano.visible = false;

    pianoLabel.visible = false;

    piano_spotMesh.material.color.set("yellow");
    gsap.to(piano.modelMesh.position, {
      duration: 0.5,
      y: -2,
    });
    grasses.forEach((e, index) => {
      gsap.to(e.modelMesh.position, {
        duration: 1,
        y: -3,
      });
    });
    gsap.to(camera.position, {
      duration: 1,
      y: 5,
    });
  }
}

export default PianoEvent;
