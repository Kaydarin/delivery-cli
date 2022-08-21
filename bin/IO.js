const readline = require("readline");

class IO {
	constructor() {
		// Initialize NodeJS IO process
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		this.rl.on("close", function () {
			console.log("\nBYE BYE !!!");
			process.exit(0);
		});
	}

	isNumExist = (val) => {
		if (isNaN(val) || typeof val == "undefined") {
			return false;
		} else {
			return true;
		}
	};
}

module.exports = IO;
