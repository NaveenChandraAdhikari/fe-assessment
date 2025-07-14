const loader = document.getElementById("loading");
const dictionaryContainer = document.querySelector(".dictionary-container");

async function fetchWords() {
  try {
    const response = await fetch(
      "https://todofirebase-426fc-default-rtdb.firebaseio.com/data.json"
    );
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching words:", error);
    return [];
  }
}

function getRandomWords(words, count) {
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function createWordCard(word) {
  const card = document.createElement("a");
  card.className = "word-card";
  card.href = `detail.html?word=${encodeURIComponent(word.word)}`;
  card.innerHTML = `
        <div class="word-content">
            <h4 class="word-title">${word.word}</h4>
            <p class="word-phonetic">${word.phonetic || "N/A"}</p>
            <p class="word-description">${word.origin || "N/A"}</p>
            <span class="word-link">Learn More →</span>
        </div>
    `;
  card.addEventListener("click", () => {
    localStorage.setItem("selectedWord", word.word);
  });
  return card;
}

async function displayWords() {
  //spinner
  loader.style.display = "flex";
  dictionaryContainer.innerHTML = ""; //clearing the old content
  try {
    const words = await fetchWords();
    if (words.length === 0) throw new Error("No words fetched.");

    const randomWords = getRandomWords(words, 6);
    randomWords.forEach((word) => {
      const card = createWordCard(word);
      dictionaryContainer.appendChild(card);
    });
  } catch (error) {
    dictionaryContainer.innerHTML = "<p>Error loading words.</p>";
    console.error(error);
  } finally {
    // hide the spinnner
    loader.style.display = "none";
  }
}

displayWords();
