export function CarEvent({ car, car_spotMesh, player, gsap, camera }) {
  if (
    Math.abs(car_spotMesh.position.x - player.modelMesh.position.x) < 0.5 &&
    Math.abs(car_spotMesh.position.z - player.modelMesh.position.z) < 0.5
  ) {
    if (!car.visible) {
      car.visible = true;
      car_spotMesh.material.color.set("seagreen");

      //플레이어 이동
      player.modelMesh.visible = false;
      gsap.to(player.modelMesh.position, {
        delay: 1,
        duration: 3,
        x: 20,
      });
      gsap.to(car.modelMesh.position, {
        delay: 1,
        duration: 3,
        x: 20,
      });
      gsap.to(camera.position, {
        duration: 1,
        x: 20,
      });

      //이동 후 플레이어 등장 + 자동차 퇴장
      setTimeout(() => {
        player.modelMesh.visible = true;
        gsap.to(car.modelMesh.position, {
          delay: 0.5,
          duration: 3,
          x: 40,
        });
      }, 4000);
    }
  } else if (car.visible) {
    console.log("나갔어요");
    car.visible = false;

    car_spotMesh.material.color.set("yellow");
  }
}

export default CarEvent;
