#!/usr/bin/env node

const readline = require("readline");

class IO {
	constructor() {
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

class App extends IO {
	constructor() {
		super();
	}

	start = () => {
		this.rl.question(
			"What is your base delivery cost & how many packages? Example: BASE_COST <SPACE> NO_OF_PACKAGES : ",
			this.inputBaseCostAndPackagesNo
		);
	};

	inputBaseCostAndPackagesNo = async (input) => {
		try {
			const words = input.split(" ");

			const baseCost = parseInt(words[0]);
			const packageCount = parseInt(words[1]);

			if (!this.isNumExist(baseCost)) {
				throw "Base cost input must exist and should be number";
			}

			if (!this.isNumExist(packageCount)) {
				throw "No. of packages input must exist and should be number";
			}

			console.log(
				"\nInsert package input. Example: PKG_ID <SPACE> PKG_WEIGHT <SPACE> PKG_DISTANCE <SPACE> OFFER_CODE\n"
			);

			for (let i = 0; i < packageCount; i++) {
				const inputs = await new Promise((resolve, reject) => {
					this.rl.question(`Package input no ${i + 1}? : `, (input) => {
						const pkg = input.split(" ");

						const id = pkg[0];
						const weight = Number(pkg[1]);
						const distance = Number(pkg[2]);
						const code = pkg[3];

						// TODO: Return sanitized input

						resolve();
					});
				});

				// TODO: Calculate delivery cost
			}

			this.rl.close();
		} catch (e) {
			console.log("\nERROR:", e);
			this.rl.close();
		}
	};
}

const app = new App();
app.start();
