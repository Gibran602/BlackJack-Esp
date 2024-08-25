const cardsDisplay = document.getElementById("cards-display");
const totalDisplay = document.getElementById("total-display");
const inGameMsg = document.getElementById("message-display");
const startGameBtn = document.getElementById("start-btn");
const newCardBtn = document.getElementById("new-card-btn");
let message = "";
let cards = [];
let total = 0;
let hasBlackjack = false;
let isAlive = false;

function getRandomCard() {
  const randomCard = Math.floor(Math.random() * 13) + 1;
  if (randomCard === 1) {
    return 11; // Ace
  } else if (randomCard > 10) {
    return 10; //Queen, King, Jack
  } else {
    return randomCard;
  }
}

function startGame() {
  cards = [getRandomCard(), getRandomCard()];
  total = cards[0] + cards[1];
  totalDisplay.textContent = "Total: " + total;
  isAlive = true;
  hasBlackjack = false;
  message = "";
  renderGame();
}

function startOrReset() {
  startGame();
}

function renderGame() {
  cardsDisplay.textContent = "Cartas: " + cards.join(", ");
  totalDisplay.textContent = "Total: " + total;

  const handContainer = document.getElementById("my-hand");
  handContainer.innerHTML = "";

  cards.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.style.backgroundImage = `url('images/cards/${getCardImage(card)}')`;
    handContainer.appendChild(cardDiv);

    if (index === cards.length - 1) {
      setTimeout(() => cardDiv.classList.add("flip"), 100);
    }
  });

  if (total < 21) {
    message = "¿Te gustaría otra carta?";
    newCardBtn.disabled = false;
  } else if (total === 21) {
    message = "Eso es Blackjack!";
    hasBlackjack = true;
    isAlive = false;
    newCardBtn.disabled = true;
  } else {
    message = "Te pasaste!";
    isAlive = false;
    newCardBtn.disabled = true;
  }
  inGameMsg.textContent = message;
}

function getCardImage(card) {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const suit = suits[Math.floor(Math.random() * suits.length)];

  let cardName;
  switch (card) {
    case 11:
      cardName = "ace";
      break;
    case 10:
      cardName = ["jack", "queen", "king"][Math.floor(Math.random() * 3)];
      break;
    default:
      cardName = card;
  }
  return `${cardName}_of_${suit}.png`;
}

function hitMe() {
  if (isAlive === true && hasBlackjack === false) {
    const newCard = getRandomCard();
    cards.push(newCard);
    total += newCard;
    renderGame();
  }
}
startGame();
