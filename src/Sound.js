export function Sound(root, state) {
  let sound = new Audio(root);

  if (sound) {
    if (state) {
      sound.currentTime = 0;
      sound.play();
    } else if (state == false) {
      sound.pause();
    }
  } else {
    console.log("사운드가 없어요");
  }
}

export function EffectSound(root, state) {
  let sound = new Audio(root);

  if (sound) {
    if (state) {
      sound.currentTime = 0;
      sound.play();
    } else if (state == false) {
      sound.pause();
    }
  } else {
    console.log("사운드가 없어요");
  }
}
