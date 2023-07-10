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

function kirby_run(run, kirby, delta) {
  if (run) {
    if (kirby.mixer) kirby.mixer.update(delta);

    if (kirby.modelMesh) {
      kirby.modelMesh.position.x += 1.5 * delta;
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
}
// export default kirby_ani;
export { kirby_random, kirby_run };
