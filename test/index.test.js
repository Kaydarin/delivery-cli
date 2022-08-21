const { App } = require("../bin/index");
const { prepareEnvironment } = require("@gmrchk/cli-testing-library");

describe("Delivery CLI Test", () => {
	beforeAll((done) => {
		done();
	});

	const initialQuestion = `What is your base delivery cost & how many packages? Example: BASE_COST <SPACE> NO_OF_PACKAGES :`;
	const baseCostInputError =
		"ERROR: Base cost input must exist and should be number";
	const packagesCountInputError =
		"ERROR: No. of packages input must exist and should be number";
	const baseCostInputNegativeError =
		"ERROR: Base cost input cannot be less than 0";
	const packagesCountInputNegativeError =
		"ERROR: No. of packages input cannot be less than 0";
	const nextQuestionDesc =
		"Insert package input. Example: PKG_ID <SPACE> PKG_WEIGHT <SPACE> PKG_DISTANCE <SPACE> OFFER_CODE";
	const quitMessage = "BYE BYE !!!";

	const successDataSet = [
		[100, 3],
		[0, 10],
		[1, 1],
		[20, 0],
	];

	const failureDataSet = [
		[undefined, 10, baseCostInputError],
		[100, undefined, packagesCountInputError],
		["text", 0, baseCostInputError],
		[10, "text", packagesCountInputError],
		[-1, 10, baseCostInputNegativeError],
		[10, -1, packagesCountInputNegativeError],
	];

	it.each(successDataSet)(
		"Runs successfully with input 1: (%s) and input 2: (%s)",
		async (inputOne, inputTwo) => {
			const { spawn, cleanup } = await prepareEnvironment();
			const {
				waitForText,
				waitForFinish,
				writeText,
				getStdout,
				getExitCode,
				kill,
				debug,
				pressKey,
			} = await spawn("node", "./bin/index.js");

			debug(); // enables logging to console from the tested program

			const inputText = `${inputOne} ${inputTwo}`;
			const expected = [initialQuestion, nextQuestionDesc, quitMessage];
			let nextQuestion;

			if (inputTwo > 0) {
				nextQuestion = `Package input no 1? :`;
				expected.splice(2, 0, nextQuestion);
			} else {
				nextQuestion = `Result as follow: Example: PKG_ID <SPACE> DISCOUNTED_AMOUNT <SPACE> TOTAL_COST`;
				expected.splice(2, 0, nextQuestion);
			}

			await waitForText(initialQuestion); // wait for question
			await writeText(inputText); // answer the question above
			await pressKey("enter"); // confirm with Enter
			waitForText(nextQuestionDesc);

			if (inputTwo > 0) {
				waitForText(nextQuestion);
			} else {
				waitForText(nextQuestion);
			}

			await waitForFinish(); // wait for program to finish

			kill(); // would kill the program if we didn't wait for finish above

			expect(getStdout()).toStrictEqual(expected);
			expect(getExitCode()).toBe(0);

			await cleanup(); // cleanup after test
		}
	);

	it.each(failureDataSet)(
		"Failed with input one: (%s) and input two: (%s)",
		async (inputOne, inputTwo, expectedMessage) => {
			const { spawn, cleanup } = await prepareEnvironment();
			const {
				waitForText,
				waitForFinish,
				writeText,
				getStdout,
				getExitCode,
				kill,
				debug,
				pressKey,
			} = await spawn("node", "./bin/index.js");

			debug();

			const inputText = `${inputOne} ${inputTwo}`;

			await waitForText(initialQuestion);
			if (!isNaN(inputOne)) {
				await writeText(inputText);
			}
			await pressKey("enter");
			await waitForFinish();

			kill();

			expect(getStdout()).toStrictEqual([
				initialQuestion,
				expectedMessage,
				quitMessage,
			]);
			expect(getExitCode()).toBe(0);

			await cleanup();
		}
	);

	afterAll((done) => {
		done();
	});
});

describe("App Class Test", () => {
	beforeAll((done) => {
		done();
	});

	const app = new App();

	const inputPackageMethodDataSet = [
		["PKG1", 50, 30, "OFR001"],
		["PKG2", 75, 125, "OFR002"],
		["PKG3", 175, 100, "OFR003"],
		["PKG4", "text", 100, "OFR003"],
		["PKG5", 175, "text", "OFR002"],
		["PKG6", 175, undefined, "OFR001"],
		["PKG7", undefined, 100, "OFR002"],
		["PKG8", undefined, undefined, "OFR003"],
		["PKG9", 175, null, "OFR004"],
		["PKG10", null, 100, "OFR005"],
		["PKG11", null, null, "OFR004"],
		[123, 175, 100, "OFR003"],
		[undefined, 175, 100, "OFR002"],
		[null, 175, 100, "OFR001"],
		["PKG12", 175, 100, 123],
		["PKG13", 175, 100, undefined],
		["PKG14", 175, 100, null],
		["PKG15", -1, 100, "OFR002"],
		["PKG16", 175, -10, "OFR003"],
		["PKG16", -20, -20, "OFR003"],
		[undefined, undefined, undefined, undefined],
		[null, null, null, null],
	];

	it.each(inputPackageMethodDataSet)(
		"Run App.inputPackage(%s, %s, %s, %s)",
		async (packageId, packageWeight, packageDistance, discountCode) => {
			let err = undefined;
			const input = `${packageId} ${packageWeight} ${packageDistance} ${discountCode}`;
			try {
				const inputs = await new Promise((resolve, reject) => {
					app.inputPackage(input, resolve, reject);
				});

				expect(inputs).toBe({
					id: packageId,
					weight: packageWeight,
					distance: packageDistance,
					code: discountCode,
				});
			} catch (e) {
				err = e;
			}

			if (err) {
				if (typeof packageId == undefined || typeof packageId == null) {
					expect(err).toBe("Must have package ID.");
				} else if (isNaN(packageWeight)) {
					expect(err).toBe("Weight input must exist and should be number.");
				} else if (isNaN(packageDistance)) {
					expect(err).toBe("Distance input must exist and should be number.");
				} else if (packageWeight < 0) {
					expect(err).toBe("Weight input cannot be less than 0.");
				} else if (packageDistance < 0) {
					expect(err).toBe("Distance input cannot be less than 0.");
				}
			}
		}
	);

	afterAll((done) => {
		done();
	});
});
