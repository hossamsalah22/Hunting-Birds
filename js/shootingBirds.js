let params = new URL(location.href);
let userName = params.searchParams.get("username");
let birdsSound = new Audio("../sounds/bgmusic.mp3");
let gun = new Audio("../sounds/kill.mp3");

// Prevent Dragable
document.addEventListener("dragstart", function (e) {
	if (e.target.matches("img")) {
		e.preventDefault();
	}
});

document.addEventListener("click", function () {
	gun.play();
});

//Random Postion
function random(dimension = window.innerHeight) {
	return Math.floor(Math.random() * Math.ceil(dimension));
}

//Start Flying
function flyRight(obj, value) {
	let posX = parseInt(obj.style.left);
	if (posX + value + obj.width > window.innerWidth) {
		posX = window.innerWidth - obj.width;
	} else {
		posX += value;
	}
	obj.style.left = posX + "px";
}

let blackBird = {
	src: "../images/black.gif",
	score: 10,
};

let cyanBird = {
	src: "../images/cyan.gif",
	score: 5,
};

let whiteBird = {
	src: "../images/white.gif",
	score: -10,
};

class Bird {
	#bird;
	static score = 0;
	static kills = 0;
	constructor(object) {
		this.score = object["score"];
		this.#bird = document.createElement("img");
		this.#bird.className = "bird";
		this.#bird.src = object["src"];
		this.#bird.width = 100;
		this.#bird.height = 100;
		this.#bird.style.position = "absolute";
		this.#bird.style.top = random(window.innerHeight - this.#bird.height) + "px";
		this.#bird.style.left = "0px";
		this.#bird.onclick = () => {
			Bird.score += this.score;
			Bird.kills++;
			document.getElementById("score").innerHTML = `Score:${Bird.score}`;
			document.getElementById("kills").innerHTML = `Birds Killed:${Bird.kills}`;
			this.#bird.src = "../images/dead.png";
			setTimeout(() => {
				this.#bird.remove();
			}, 500);
		};
		document.body.append(this.#bird);
	}

	//Flying Function
	fly() {
		let id = setInterval(() => {
			let posX = parseInt(this.#bird.style.left);
			flyRight(this.#bird, 15);
			if (posX >= window.innerWidth - this.#bird.width) {
				clearInterval(id);
				this.#bird.remove();
			}
		}, 100);
	}
}

//Bomb
function dropBomb(obj, value) {
	let posY = parseInt(obj.style.top);
	if (posY + value + obj.height > window.innerHeight) {
		posY = window.innerHeight - obj.height;
	} else {
		posY += value;
	}
	obj.style.top = posY + "px";
}

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
			this.#bomb.src = "../images/boom.gif";
			setTimeout(() => {
				this.#bomb.remove();
			}, 500);

			let birds = document.querySelectorAll("img.bird");
			for (let bird of birds) {
				if (
					parseInt(bird.style.left) + bird.width >= parseInt(this.#bomb.style.left) + 100 &&
					parseInt(bird.style.left) <= parseInt(this.#bomb.style.left) + this.#bomb.width + 100 &&
					parseInt(bird.style.top) + bird.height >= parseInt(this.#bomb.style.top) + 100 &&
					parseInt(bird.style.top) <= parseInt(this.#bomb.style.top) + this.#bomb.height + 100
				) {
					bird.click();
				}
			}
		};
		document.body.append(this.#bomb);
	}

	drop() {
		let id = setInterval(() => {
			let posY = parseInt(this.#bomb.style.top);
			dropBomb(this.#bomb, 10);
			if (posY >= window.innerHeight - this.#bomb.height) {
				clearInterval(id);
				this.#bomb.remove();
			}
		}, 100);
	}
}

window.addEventListener("load", function () {
	// birdsSound.play();
	let timer = 59;
	let birdsArray = [blackBird, cyanBird, whiteBird];
	let randomBird;

	document.getElementById("name").innerHTML = `Username:${userName}`;

	let id = this.setInterval(function () {
		randomBird = birdsArray[Math.floor(Math.random() * birdsArray.length)];
		let bird = new Bird(randomBird);
		bird.fly();

		//BOMB Creation
		if (timer % 10 == 0) {
			let bomb = new Bomb();
			bomb.drop();
		}

		timer--;
		document.getElementById("timer").innerHTML = `Timer 00:${timer}`;
		if (timer == 0) {
			clearInterval(id);
			document.querySelector("#result").style.display = "block";

			if (Bird.score >= 50) {
				document.querySelector("#resultText").innerHTML = `
                        Congats <font color="yellow"> ${userName}</font> </br>
                        You Won </br>
                       `;
			} else {
				document.querySelector("#resultText").innerHTML = `
                        Sorry <font color="yellow"> ${userName}</font> </br>
                        You Lost
                       `;
			}
			document.querySelector("#playAgain").addEventListener("click", function () {
				location.reload();
			});
		}
	}, 1000);
});

let score = function () {
	let parsing = JSON.parse(localStorage.getItem(userName));
	$("h1 span:first").text(userName);
	if (parsing.name == userName) {
		$(".score h2:last span").text(parsing.score);
	}
};
