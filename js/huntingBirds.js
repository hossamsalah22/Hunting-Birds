let windowWidth = window.innerWidth;
let params = new URL(location.href);
let userName = params.searchParams.get("username");
let level = params.searchParams.get("level");
let bgSound = new Audio("../sounds/bgmusic.mp3");
let killSound = new Audio("../sounds/kill.mp3");
let bombSound = new Audio("../sounds/bomb.mp3");
let resultText = document.querySelector("#resultText");
let currentScore = document.getElementById("score");
let killCounter = document.getElementById("kills");
let currentUser = document.getElementById("name");
let currentLevel = document.getElementById("level");
let timeLeft = document.getElementById("timer");
let resultPop = document.querySelector("#result");
let playagainBtn = document.querySelector("#playAgain");
let cancelBtn = document.querySelector("#cancel");
let blackBird = {
	src: "../images/black.gif",
	score: 10,
}; // Black Bird SRC with Score

let cyanBird = {
	src: "../images/cyan.gif",
	score: 5,
}; // Cyan Bird SRC with Score

let whiteBird = {
	src: "../images/white.gif",
	score: -10,
}; // White Bird SRC with Score

document.addEventListener("dragstart", function (event) {
	if (event.target.matches("img")) {
		event.preventDefault();
	}
}); // Prevent Dragable

document.addEventListener("click", function () {
	killSound.play();
}); // killing sound

function random(windowWidth) {
	return Math.floor(Math.random() * Math.ceil(windowWidth));
} //Create Random Position

function startFlying(bird, value) {
	let positionX = parseInt(bird.style.left);
	if (positionX + value + bird.width > window.innerWidth) {
		positionX = window.innerWidth - bird.width;
	} else {
		positionX += value;
	}
	bird.style.left = positionX + "px";
} //Start Flying

class Bird {
	#newBird;
	static score = 0;
	static kills = 0;
	constructor(bird) {
		this.#newBird = document.createElement("img");
		this.#newBird.className = "bird";
		this.#newBird.src = bird["src"];
		this.#newBird.width = 100;
		this.#newBird.height = 100;
		this.#newBird.style.position = "absolute";
		this.#newBird.style.left = "0px";
		this.#newBird.style.top = random(window.innerHeight - this.#newBird.height) + "px";
		this.score = bird["score"];
		this.#newBird.onclick = () => {
			Bird.score += this.score;
			Bird.kills++;
			currentScore.textContent = `Score:${Bird.score}`;
			killCounter.textContent = `Birds Killed:${Bird.kills}`;
			this.#newBird.src = "../images/dead.png";
			setTimeout(() => {
				this.#newBird.remove();
			}, 500);
		};
		document.body.append(this.#newBird);
	}

	//Flying Function
	fly() {
		let flying = setInterval(() => {
			let positionX = parseInt(this.#newBird.style.left);
			if (level == 1) {
				startFlying(this.#newBird, 10);
			} else if (level == 2) {
				startFlying(this.#newBird, 20);
			} else if (level == 3) {
				startFlying(this.#newBird, 40);
			}
			if (positionX >= window.innerWidth - this.#newBird.width) {
				clearInterval(flying);
				this.#newBird.remove();
			}
		}, 100);
	}
} // Bird Class

class Bomb {
	#bomb;
	constructor() {
		this.#bomb = document.createElement("img");
		this.#bomb.src = "../images/bomb.gif";
		this.#bomb.width = 200;
		this.#bomb.height = 200;
		this.#bomb.style.position = "absolute";
		this.#bomb.style.zIndex = 1;
		this.#bomb.style.left = random(window.innerWidth - this.#bomb.width) + "px";
		this.#bomb.style.top = "0px";
		this.#bomb.onclick = () => {
			bombSound.play();
			this.#bomb.src = "../images/boom.gif";
			setTimeout(() => {
				this.#bomb.remove();
			}, 500);

			let birds = document.querySelectorAll("img.bird");
			for (let bird of birds) {
				if (
					parseInt(bird.style.left) + bird.width >= parseInt(this.#bomb.style.left) &&
					parseInt(bird.style.left) <= parseInt(this.#bomb.style.left) + this.#bomb.width &&
					parseInt(bird.style.top) + bird.height >= parseInt(this.#bomb.style.top) &&
					parseInt(bird.style.top) <= parseInt(this.#bomb.style.top) + this.#bomb.height
				) {
					bird.click();
				}
			}
		};
		document.body.append(this.#bomb);
	}

	drop() {
		let id = setInterval(() => {
			let positionY = parseInt(this.#bomb.style.top);
			if (level == 1) {
				dropBomb(this.#bomb, 10);
			} else if (level == 2) {
				dropBomb(this.#bomb, 20);
			} else if (level == 3) {
				dropBomb(this.#bomb, 35);
			}
			if (positionY >= window.innerHeight - this.#bomb.height) {
				clearInterval(id);
				this.#bomb.remove();
			}
		}, 100);
	}
} //Bomb Class

function dropBomb(bird, value) {
	let positionY = parseInt(bird.style.top);
	if (positionY + value + bird.height > window.innerHeight) {
		positionY = window.innerHeight - bird.height;
	} else {
		positionY += value;
	}
	bird.style.top = positionY + "px";
} // Drop Bomb

function randomBirds(birdsArray) {
	let bird = new Bird(birdsArray[Math.floor(Math.random() * birdsArray.length)]);
	bird.fly();
} // create Random Bird

window.addEventListener("load", function () {
	// bgSound.play();
	let timer = 60;
	let birdsArray = [blackBird, cyanBird, whiteBird];

	currentUser.textContent = `Username:${userName}`;
	currentLevel.textContent = `Level:${level}`;

	let birdsInterval = this.setInterval(function () {
		for (let i = 0; i < 4; i++) {
			randomBirds(birdsArray);
		} // create birds

		//BOMB Creation
		if (timer % 7 == 0) {
			let bomb = new Bomb();
			bomb.drop();
		}

		timer--;

		timeLeft.textContent = `Timer 00:${timer}`;
		if (timer == 0) {
			clearInterval(birdsInterval);
			resultPop.style.display = "block";
			bgSound.pause();
			if (Bird.score >= 50) {
				resultText.innerHTML = `
                        Congratulations ${userName} </br>
                        You Won </br>
                       `;
			} else {
				resultText.innerHTML = `
                        Sorry ${userName} </br>
                        You Lost
                       `;
			}
			playagainBtn.addEventListener("click", function () {
				location.reload(); // reload current page
			});
			cancelBtn.addEventListener("click", function () {
				location.replace("index.html"); // Go Back to login page
			});
		}
	}, 1000);
});
