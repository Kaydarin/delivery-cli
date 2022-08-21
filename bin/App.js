const IO = require("./IO");
const Package = require("./Package");

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

			/**
			 * Input validation
			 */
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

			/**
			 * Ask for each package info
			 */
			for (let i = 0; i < packageCount; i++) {
				const inputs = await new Promise((resolve, reject) => {
					this.rl.question(`Package input no ${i + 1}? : `, (input) =>
						// Process each package input
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

				// Create Package instance
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

			/**
			 * Calculate and display each package total cost and discounted amount
			 */
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

		/**
		 * Input validation
		 */
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

module.exports = App;
