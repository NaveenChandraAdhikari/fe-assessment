let words = [123, 4214, 1421, 4, 42, 41];

function getRandomWords(words, count) {
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

console.log(getRandomWords(words, 1));
