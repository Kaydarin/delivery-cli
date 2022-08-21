const { prepareEnvironment } = require("@gmrchk/cli-testing-library");

describe("Delivery CLI Test", () => {
	beforeAll((done) => {
		done();
	});

	it("Runs successfully", async () => {
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

		const inputText = "world";

		await waitForText("Hello"); // wait for question
		await writeText(inputText); // answer the question above
		await pressKey("enter"); // confirm with Enter
		await waitForFinish(); // wait for program to finish

		kill(); // would kill the program if we didn't wait for finish above

		expect(getStdout()).toStrictEqual(["Hello", inputText, "BYE BYE !!!"]);
		expect(getExitCode()).toBe(0);

		await cleanup(); // cleanup after test
	});

	afterAll((done) => {
		done();
	});
});
