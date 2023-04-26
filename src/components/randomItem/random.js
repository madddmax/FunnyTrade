// get random number
export function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

// перемешать
export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}