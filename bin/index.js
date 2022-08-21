#!/usr/bin/env node

const readline = require("readline");

class Offer {
	constructor() {
		this.offers = [
			{
				name: "OFR001",
				discount: 10,
				minDist: 0,
				maxDist: 200,
				minWeight: 70,
				maxWeight: 200,
			},
			{
				name: "OFR002",
				discount: 7,
				minDist: 50,
				maxDist: 150,
				minWeight: 100,
				maxWeight: 250,
			},
			{
				name: "OFR003",
				discount: 5,
				minDist: 50,
				maxDist: 250,
				minWeight: 10,
				maxWeight: 150,
			},
		];
	}
}

class Package extends Offer {
	constructor(id, weight, distance, code, baseCost) {
		super();

		try {
			this.#validate(id, weight, distance, baseCost);
			this.id = id;
			this.weight = weight;
			this.distance = distance;
			this.code = code;
			this.baseCost = baseCost;
		} finally {
		}
	}

	#validate(id, weight, distance, baseCost) {
		if (typeof id == undefined) {
			throw "Package ID is required";
		} else if (isNaN(weight)) {
			throw "Package weight is required and must be a number";
		} else if (weight < 0) {
			throw "Package weight cannot be less than 0";
		} else if (isNaN(distance)) {
			throw "Package distance is required and must be a number";
		} else if (distance < 0) {
			throw "Package distance cannot be less than 0";
		} else if (isNaN(baseCost)) {
			throw "Package base cost is required and must be a number";
		} else if (baseCost < 0) {
			throw "Package base cost cannot be less than 0";
		}
	}

	getTotalCostAndDiscounted = () => {
		const deliveryCost = this.baseCost + this.weight * 10 + this.distance * 5;
		let totalCost = deliveryCost;
		let discountedAmount = 0;
		let offerFound = null;

		if (this.code) {
			offerFound = this.offers.find(
				(ofr) => ofr.name === this.code.toUpperCase()
			);
		}

		if (offerFound) {
			if (
				this.distance >= offerFound.minDist &&
				this.distance <= offerFound.maxDist &&
				this.weight >= offerFound.minWeight &&
				this.weight <= offerFound.maxWeight
			) {
				const discount = offerFound.discount;

				discountedAmount = (deliveryCost * discount) / 100;
				totalCost = deliveryCost - discountedAmount;
			}
		}

		return {
			totalCost,
			discountedAmount,
		};
	};
}

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

			if (baseCost < 0) {
				throw "Base cost input cannot be less than 0";
			}

			if (packageCount < 0) {
				throw "No. of packages input cannot be less than 0";
			}

			console.log(
				"\nInsert package input. Example: PKG_ID <SPACE> PKG_WEIGHT <SPACE> PKG_DISTANCE <SPACE> OFFER_CODE\n"
			);

			const resultList = [];

			for (let i = 0; i < packageCount; i++) {
				const inputs = await new Promise((resolve, reject) => {
					this.rl.question(`Package input no ${i + 1}? : `, (input) =>
						this.inputPackage(input, resolve, reject)
					);
				});

				console.log(
					`\nYour package input no. ${i + 1} is:\nPackage ID: ${
						inputs.id
					}\nPackage Weight: ${inputs.weight}kg\nDelivery Distance: ${
						inputs.distance
					}km\nPromo Code: ${inputs.code ? inputs.code : "Not set"}\n`
				);

				const pkg = new Package(
					inputs.id,
					inputs.weight,
					inputs.distance,
					inputs.code,
					baseCost
				);

				resultList.push(pkg);
			}

			const resultListCount = resultList.length;

			console.log(
				"Result as follow: Example: PKG_ID <SPACE> DISCOUNTED_AMOUNT <SPACE> TOTAL_COST\n"
			);

			for (let i = 0; i < resultListCount; i++) {
				const pkgObj = resultList[i];
				const pkgCosting = pkgObj.getTotalCostAndDiscounted();

				console.log(
					pkgObj.id,
					pkgCosting.discountedAmount,
					pkgCosting.totalCost
				);
			}

			this.rl.close();
		} catch (e) {
			console.log("\nERROR:", e);
			this.rl.close();
		}
	};

	inputPackage = (input, resolve, reject) => {
		const pkg = input.split(" ");

		const id = pkg[0];
		const weight = Number(pkg[1]);
		const distance = Number(pkg[2]);
		let code = pkg[3];

		if (typeof id == "undefined") {
			reject("Must have package ID.");
		}

		if (!this.isNumExist(weight)) {
			reject("Weight input must exist and should be number.");
		}

		if (!this.isNumExist(distance)) {
			reject("Distance input must exist and should be number.");
		}

		if (weight < 0) {
			reject("Weight input cannot be less than 0.");
		}

		if (distance < 0) {
			reject("Distance input cannot be less than 0.");
		}

		if (typeof code == "undefined") {
			code = null;
		}

		resolve({
			id,
			weight,
			distance,
			code,
		});
	};
}

const app = new App();
app.start();

module.exports = { App, Package };
