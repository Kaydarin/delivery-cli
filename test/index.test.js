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
	];

	it.each(successDataSet)("Runs successfully", async (inputOne, inputTwo) => {
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

		await waitForText(initialQuestion); // wait for question
		await writeText(inputText); // answer the question above
		await pressKey("enter"); // confirm with Enter
		await waitForFinish(); // wait for program to finish

		kill(); // would kill the program if we didn't wait for finish above

		expect(getStdout()).toStrictEqual([initialQuestion, quitMessage]);
		expect(getExitCode()).toBe(0);

		await cleanup(); // cleanup after test
	});

	it.each(failureDataSet)(
		"Failed with first input: %s and second input: %s",
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
