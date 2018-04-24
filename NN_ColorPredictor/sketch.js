let r, g, b;
let brain;
let interations = 0;

let width;

let which = 'black';
let blackOutput;
let whiteOutput;

let isTraining;
let humanTraining;
let trainingRate;

const { log } = console;

function pickColor() {
	r = random(255);
	g = random(255);
	b = random(255);
	redraw();
}

function setup() {
	noLoop();
	width = window.innerWidth;
	createCanvas(width, 300);
	trainingRate = createSlider(1, 100, 25);
	isTraining = createCheckbox("Train ColorPredictors's brain");
	humanTraining = createCheckbox("Train ColorPredictors's with users inputs");
	// Number of inputs, number of neurons in hidden layer, number of outputs
	brain = new NeuralNetwork(3, 3, 2);
	pickColor();
}

function trainColorPredictor() {
	console.log(
		'Training color predictor with rate ' +
			trainingRate.value() +
			', interation ' +
			interations
	);
	for (let i = 0; i < trainingRate.value(); i++) {
		interations++;
		let r = random(255);
		let g = random(255);
		let b = random(255);
		let targets = trainColor(r, g, b);
		let inputs = [r / 255, g / 255, b / 255];
		brain.train(inputs, targets);
	}
}

function trainWithHumanInput() {
	let targets;
	if (mouseX > width / 2) {
		targets = [0, 1];
	} else {
		targets = [1, 0];
	}
	let inputs = [r / 255, g / 255, b / 255];

	brain.train(inputs, targets);
	log('I captured your input');
}

function mousePressed() {
	if (mouseX > width || mouseY > height) {
		return;
	}

	if (humanTraining.checked()) {
		trainWithHumanInput();
	}
	pickColor();
}

function colorPredictor(r, g, b) {
	let inputs = [r / 255, g / 255, b / 255];
	let outputs = brain.predict(inputs);
	blackOutput = outputs[0];
	whiteOutput = outputs[1];
	if (blackOutput > whiteOutput) {
		return 'black';
	} else {
		return 'white';
	}

	// if (r + g + b > * 3 / 2) {
	//   return "black";
	// } else {
	//   return "white";
	// }
}

function trainColor(r, g, b) {
	if (r + g + b > 255 * 3 / 2) {
		return [1, 0];
	} else {
		return [0, 1];
	}
}

function windowResized() {
	width = window.innerWidth;
	resizeCanvas(width, 300);
}

function setupCanvas() {
	background(r, g, b);
	strokeWeight(4);
	stroke(0);
	line(width / 2, 0, width / 2, height);
	textSize(64);
	noStroke();
	fill(0);
	textAlign(CENTER, CENTER);
	text('black', width / 4, 100);
	fill(255);
	text('white', width / (1 + 1 / 3), 100);
}

function draw() {
	isTraining.changed(() => {
		if (isTraining.checked()) {
			loop();
		} else {
			noLoop();
		}
	});
	setupCanvas();
	if (isTraining.checked()) {
		trainColorPredictor();
	} else {
		let which = colorPredictor(r, g, b);
		if (which === 'black') {
			fill(0);
			log(
				`I am ${Math.floor(blackOutput * 100)}% sure this is the correct choice`
			);
			ellipse(width / 4, 200, 60);
		} else {
			fill(255);
			log(
				`I am ${Math.floor(whiteOutput * 100)}% sure this is the correct choice`
			);
			ellipse(width / (1 + 1 / 3), 200, 60);
		}
	}
}
