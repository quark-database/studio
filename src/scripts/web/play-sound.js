export function playSound(soundName) {
    new Audio("/sounds/" + soundName + ".mp3").play().then(() => {});
}