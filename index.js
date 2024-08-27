const cardsDisplay = document.getElementById("cards-display");
const totalDisplay = document.getElementById("total-display");
const moneyDisplay = document.getElementById("money-display");
const inGameMsg = document.getElementById("message-display");
const startGameBtn = document.getElementById("start-btn");
const newCardBtn = document.getElementById("new-card-btn");
const standBtn = document.getElementById("stand-btn");
const betTen = document.getElementById("bet-ten");
const betTwenty = document.getElementById("bet-twenty");
const betFifty = document.getElementById("bet-fifty");

let message = "";
let cards = [];
let total = 0;
let dealerCards = [];
let dealersTotal = 0;
let hasBlackjack = false;
let isAlive = false;

let playerMoney = 200;
let playerBet = 0;

updateMoney();

function placeBet(amount) {
  if (amount > playerMoney) {
    message = "No tienes suficiente dinero!";
    inGameMsg.textContent = message;
    playerBet = 0;
    betTen.disabled = true;
    betTwenty.disabled = true;
    betFifty.disabled = true;
    newCardBtn.disabled = true;
  } else {
    playerBet = amount;
    playerMoney -= amount;
  }
  updateMoney();
  startGame();
}

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

  dealerCards = [getRandomCard(), getRandomCard()];
  dealersTotal = dealerCards[0] + dealerCards[1];
  isAlive = true;
  hasBlackjack = false;
  standBtn.disabled = false;
  message = "";
  renderGame();
}

function updateMoney() {
  moneyDisplay.textContent = "Dinero: $" + playerMoney;
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
  });

  const dealersHandContainer = document.getElementById("dealer-display");
  dealersHandContainer.innerHTML = "";

  dealerCards.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.style.backgroundImage = `url('images/cards/${getCardImage(card)}')`;
    dealersHandContainer.appendChild(cardDiv);
  });

  if (total < 21) {
    message = "¿Te gustaría otra carta?";
    newCardBtn.disabled = false;
  } else if (total === 21 && cards.length === 2) {
    message = "Blackjack!";
    hasBlackjack = true;
    isAlive = false;
    playerMoney += playerBet * 2;
    updateMoney();
    newCardBtn.disabled = true;
    standBtn.disabled = true;
  } else {
    message = "Te pasaste!";
    isAlive = false;
    newCardBtn.disabled = true;
    standBtn.disabled = true;
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

function iStand() {
  if (isAlive || !hasBlackjack) {
    newCardBtn.disabled = true;
    dealersTurn();
  }
}

function dealersTurn() {
  while (dealersTotal < 17) {
    const dealersNewCard = getRandomCard();
    dealerCards.push(dealersNewCard);
    dealersTotal += dealersNewCard;
  }
  renderGame();
  checkWinner();
}

function checkWinner() {
  if (total > 21) {
    message = "Te pasaste! Gano la casa!";
    playerBet = 0;
  } else if (dealersTotal > 21) {
    message = "Repartidor se paso! Tu Ganas!";
    playerMoney += playerBet * 2;
  } else if (total > dealersTotal) {
    message = "Ganaste";
    playerMoney += playerBet * 2;
  } else if (total === dealersTotal) {
    message = "Es un empate!";
    playerMoney += playerBet;
  } else if (total === 21) {
    message = "Blackjack!";
    playerMoney += playerBet * 2;
  } else {
    message = "Gano la casa!";
    playerBet = 0;
  }
  updateMoney();
  playerBet = 0;
  inGameMsg.textContent = message;
  startOrReset();
}

function startOrReset() {
  if (playerMoney <= 0) {
    playerMoney = 200;
    playerBet = 0;
    updateMoney();
    cards = [];
    total = 0;
    dealerCards = [];
    dealersTotal = 0;
    betTen.disabled = false;
    betTwenty.disabled = false;
    betFifty.disabled = false;
    newCardBtn.disabled = true;
    standBtn.disabled = true;
  } else if (hasBlackjack || !isAlive) {
    message = "Quieres jugar una ronda? Haz una apuesta!";
    inGameMsg.textContent = message;
    isAlive = false;
    hasBlackjack = false;
  } else if (playerBet > 0) {
    handContainer.innerHTML = "";
    dealersHandContainer.innerHTML = "";
    startGame();
  }
  standBtn.disabled = true;
}

startOrReset();
