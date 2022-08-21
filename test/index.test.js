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
