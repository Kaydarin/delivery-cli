const App = require("../bin/App");

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
