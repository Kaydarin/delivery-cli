#!/usr/bin/env node

const readline = require("readline");

function hello() {
	// console.log("hello world!");

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question("Hello", (input) => {
		console.log(input);
		rl.close();
	});

	rl.on("close", function () {
		console.log("\nBYE BYE !!!");
		process.exit(0);
	});
}

hello();
