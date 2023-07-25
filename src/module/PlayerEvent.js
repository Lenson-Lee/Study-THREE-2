export function PlayerEvent({
  player,
  playerLabel,
  delta,
  camera,
  destinationPoint,
  isPressed,
  angle,
}) {
  // console.log("🐸 모듈 속 : ", player);

  player.modelMesh?.add(playerLabel);
  if (player.mixer) player.mixer.update(delta);
  if (player.modelMesh) {
    camera.lookAt(player.modelMesh.position);
  }

  if (player.modelMesh) {
    if (isPressed) {
      raycasting();
    }

    if (player.moving) {
      // 걸어가는 상태
      angle = Math.atan2(
        destinationPoint.z - player.modelMesh.position.z,
        destinationPoint.x - player.modelMesh.position.x
      );
      player.modelMesh.position.x += Math.cos(angle) * 0.05;
      player.modelMesh.position.z += Math.sin(angle) * 0.05;

      camera.position.x = cameraPosition.x + player.modelMesh.position.x;
      camera.position.z = cameraPosition.z + player.modelMesh.position.z;

      player.actions[0].stop();
      player.actions[1].play();

      /* 목적지와 플레이어 거리를 보고 정지 */
      if (
        Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.03 &&
        Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.03
      ) {
        player.moving = false;
        console.log("멈춤");
      }

      // /* Car Event */
      // if (
      //   Math.abs(car_spotMesh.position.x - player.modelMesh.position.x) < 0.5 &&
      //   Math.abs(car_spotMesh.position.z - player.modelMesh.position.z) < 0.5
      // ) {
      //   if (!car.visible) {
      //     car.visible = true;
      //     car_spotMesh.material.color.set("seagreen");

      //     //플레이어 이동
      //     player.modelMesh.visible = false;
      //     gsap.to(player.modelMesh.position, {
      //       delay: 1,
      //       duration: 3,
      //       x: 20,
      //     });
      //     gsap.to(car.modelMesh.position, {
      //       delay: 1,
      //       duration: 3,
      //       x: 20,
      //     });
      //     gsap.to(camera.position, {
      //       duration: 1,
      //       x: 20,
      //     });

      //     //이동 후 플레이어 등장 + 자동차 퇴장
      //     setTimeout(() => {
      //       player.modelMesh.visible = true;
      //       gsap.to(car.modelMesh.position, {
      //         delay: 0.5,
      //         duration: 3,
      //         x: 40,
      //       });
      //     }, 4000);
      //   }
      // } else if (car.visible) {
      //   console.log("나갔어요");
      //   car.visible = false;

      //   car_spotMesh.material.color.set("yellow");
      // }

      // /* Piano Event */
      // if (
      //   Math.abs(piano_spotMesh.position.x - player.modelMesh.position.x) <
      //     0.5 &&
      //   Math.abs(piano_spotMesh.position.z - player.modelMesh.position.z) < 0.5
      // ) {
      //   if (!piano.visible) {
      //     console.log("들어왔어요");
      //     piano.visible = true;
      //     pianoLabel.visible = true;
      //     console.log("피아노라벨 ON : ", pianoLabel.visible);
      //     /**
      //      *
      //      *
      //      *
      //      *
      //      *
      //      *
      //      *
      //      *
      //      */
      //     piano_spotMesh.material.color.set("seagreen");
      //     gsap.to(piano.modelMesh.position, {
      //       duration: 1,
      //       y: 2,
      //     });

      //     grasses.forEach((e, index) => {
      //       gsap.to(e.modelMesh.position, {
      //         duration: 1,
      //         y: 0,
      //       });
      //     });
      //     gsap.to(camera.position, {
      //       duration: 1,
      //       y: 3,
      //     });
      //   }
      // } else if (piano.visible) {
      //   console.log("나갔어요");
      //   piano.visible = false;

      //   pianoLabel.visible = false;

      //   piano_spotMesh.material.color.set("yellow");
      //   gsap.to(piano.modelMesh.position, {
      //     duration: 0.5,
      //     y: -2,
      //   });
      //   grasses.forEach((e, index) => {
      //     gsap.to(e.modelMesh.position, {
      //       duration: 1,
      //       y: -3,
      //     });
      //   });
      //   gsap.to(camera.position, {
      //     duration: 1,
      //     y: 5,
      //   });
      // }

      // /* coin spot event */
      // if (
      //   Math.abs(coin_spotMesh.position.x - player.modelMesh.position.x) <
      //     0.5 &&
      //   Math.abs(coin_spotMesh.position.z - player.modelMesh.position.z) < 0.5
      // ) {
      //   if (fallingCoins == false) {
      //     fallingCoins = true;

      //     coinEvent(true);
      //     gsap.to(camera.position, {
      //       duration: 1,
      //       y: 3,
      //     });
      //   }
      //   coin_spotMesh.material.color.set("seagreen");
      // } else {
      //   coin_spotMesh.material.color.set("yellow");
      //   // fallingCoins = false;
      //   gsap.to(camera.position, {
      //     duration: 1,
      //     y: 5,
      //   });
      // }

      // /* catch coin event */
      // if (fallingCoins && catching) {
      //   let targetName;

      //   coins.forEach((coin) => {
      //     if (
      //       Math.abs(coin.modelMesh?.position.x - player.modelMesh.position.x) <
      //         0.5 &&
      //       Math.abs(coin.modelMesh?.position.z - player.modelMesh.position.z) <
      //         0.5
      //     ) {
      //       catchCoin.push(coin.modelMesh.name);
      //       catchList = Array.from(new Set(catchCoin));

      //       targetName = scene.getObjectByName(coin.modelMesh.name);

      //       scene.remove(targetName);
      //     }
      //   });
      // }

      // /** kirby spot running event */
      // if (
      //   Math.abs(kirby_spotMesh.position.x - player.modelMesh.position.x) <
      //     0.5 &&
      //   Math.abs(kirby_spotMesh.position.z - player.modelMesh.position.z) < 0.5
      // ) {
      //   kirby_spotMesh.material.color.set("seagreen");
      // } else {
      //   kirby_spotMesh.material.color.set("yellow");
      // }
      //
    } else {
      // 서 있는 상태
      player.actions[1].stop();
      player.actions[0].play();
    }
  }
}

export default PlayerEvent;
