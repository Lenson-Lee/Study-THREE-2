function kirby_random(kirby, delta, dirX, dirZ, speed) {
  if (kirby.mixer) kirby.mixer.update(delta);

  if (kirby.modelMesh) {
    const position_X = Math.sin((delta % 2) * speed);
    const position_Z = Math.sin((delta % 2) * speed) * 0.5;

    // kirby.modelMesh?.lookAt(1, 100, 0);

    if (dirZ) {
      kirby.modelMesh.position.z += position_Z;
    } else {
      kirby.modelMesh.position.z -= position_Z;
    }

    if (dirX) {
      kirby.modelMesh.position.x += position_X;
    } else {
      kirby.modelMesh.position.x -= position_X;
    }
  }
}

function kirby_run(run, kirby, delta, finish) {
  if (run) {
    if (kirby.modelMesh.position.x >= 4) {
      kirby.modelMesh.position.x -= 1.5 * delta;
      if (kirby.modelMesh.position.z <= 6) {
        kirby.modelMesh.position.z += 0.5 * delta;
      }
      kirby.actions[0].stop();
      kirby.actions[1].play();
    } else {
      kirby.actions[1].stop();
      kirby.actions[0].play();
    }
    // kirby.modelMesh?.lookAt(1, 100, 0);

    // if (dirZ) {
    //   kirby.modelMesh.position.z += position_Z;
    // } else {
    //   kirby.modelMesh.position.z -= position_Z;
    // }

    // if (dirX) {
    //   kirby.modelMesh.position.x += position_X;
    // } else {
    //   kirby.modelMesh.position.x -= position_X;
    // }
  }
}
// export default kirby_ani;
export { kirby_random, kirby_run };
