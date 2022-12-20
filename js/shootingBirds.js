function getName() {
	url = new URL(location.href);
	let name = url.searchParams.get("username");
	return name;
}

//To get Random POsitions
function random(dimension = window.innerHeight) {
	return Math.floor(Math.random() * Math.ceil(dimension));
}

//Bird Flying Iteration
function flyRight(obj, value) {
	let posX = parseInt(obj.style.left);
	if (posX + value + obj.width > window.innerWidth) {
		posX = window.innerWidth - obj.width;
	} else {
		posX += value;
	}
	obj.style.left = posX + "px";
}

let smallBirdObj = {
	src: "../images/black.gif",
	score: 10,
};

let mediumBirdObj = {
	src: "../images/cyan.gif",
	score: 5,
};

let bigBirdObj = {
	src: "../images/white.gif",
	score: -10,
};

class Bird {
	#bird;
	static score = 0;
	static birdsKilled = 0;
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
			Bird.birdsKilled++;
			this.#bird.remove();
			document.getElementById("score").innerHTML = `Score:${Bird.score}`;
			document.getElementById("birdsKilled").innerHTML = `Birds Killed:${Bird.birdsKilled}`;
		};
		document.body.append(this.#bird);
	}

	//Get Bird Img
	get birdImg() {
		return this.#bird;
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

//Bomb Dropping Iteration
function dropBomb(obj, value) {
	let posY = parseInt(obj.style.top);
	if (posY + value + obj.height > window.innerHeight) {
		posY = window.innerHeight - obj.height;
	} else {
		posY += value;
	}
	obj.style.top = posY + "px";
}

let bombObject = {
	src: "../images/bomb.gif",
};

class Bomb {
	#bomb;
	constructor() {
		this.#bomb = document.createElement("img");
		this.#bomb.src = bombObject["src"];
		this.#bomb.width = 150;
		this.#bomb.height = 150;
		this.#bomb.style.zIndex = 999;
		this.#bomb.style.position = "absolute";
		this.#bomb.style.left = random(window.innerWidth - this.#bomb.width) + "px";
		this.#bomb.style.top = "0px";
		this.#bomb.onclick = () => {
			this.#bomb.src = "../images/boom.gif";
			setTimeout(() => {
				this.#bomb.remove();
			}, 500);

			let birds = document.querySelectorAll("img.bird");
			for (let bird of birds) {
				//Idea Refernce: https://www.youtube.com/watch?v=_MyPLZSGS3s
				if (
					parseInt(bird.style.left) + bird.width >= parseInt(this.#bomb.style.left) &&
					parseInt(bird.style.left) <= parseInt(this.#bomb.style.left) + this.#bomb.width + 150 &&
					parseInt(bird.style.top) + bird.height >= parseInt(this.#bomb.style.top) &&
					parseInt(bird.style.top) <= parseInt(this.#bomb.style.top) + this.#bomb.height + 150
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
	let timer = 59;
	let birdsArray = [smallBirdObj, mediumBirdObj, bigBirdObj];
	let randomBird;

	document.getElementById("name").innerHTML = `Username:${getName()}`;

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
                        Congats <font color="yellow"> ${getName()}</font> </br>
                        You Won </br>
                       `;
			} else {
				document.querySelector("#resultText").innerHTML = `
                        Sorry <font color="yellow"> ${getName()}</font> </br>
                        You Lost
                       `;
			}
			document.querySelector("#playAgain").addEventListener("click", function () {
				location.reload();
			});
		}
	}, 1000);
});
