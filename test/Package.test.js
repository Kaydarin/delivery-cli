const Package = require("../bin/Package");

describe("Package Class Test", () => {
	beforeAll((done) => {
		done();
	});

	const packageInstanceDataSet = [
		["PKG1", 50, 30, "OFR001", 100],
		["PKG2", 75, 125, "OFR002", 200],
		["PKG3", 175, 100, "OFR003", 10],
		["PKG4", "text", 100, "OFR003", undefined],
		["PKG5", 175, "text", "OFR002", null],
		["PKG6", 175, undefined, "OFR001", -1],
		["PKG7", undefined, 100, "OFR002", -20],
		["PKG8", undefined, undefined, "OFR003", "text"],
		["PKG9", 175, null, "OFR004", 500],
		["PKG10", null, 100, "OFR005", 10],
		["PKG11", null, null, "OFR004", undefined],
		[123, 175, 100, "OFR003", -500],
		[undefined, 175, 100, "OFR002", undefined],
		[null, 175, 100, "OFR001", null],
		["PKG12", 175, 100, 123, "text"],
		["PKG13", 175, 100, undefined, 100],
		["PKG14", 175, 100, null, 200],
		["PKG15", -1, 100, "OFR002", 123],
		["PKG16", 175, -10, "OFR003", -123],
		["PKG16", -20, -20, "OFR003", 1],
		[undefined, undefined, undefined, undefined, undefined],
		[null, null, null, null, undefined],
	];

	it.each(packageInstanceDataSet)(
		"Run new Package(%s, %s, %s, %s, %s).getTotalCostAndDiscounted()",
		async (
			packageId,
			packageWeight,
			packageDistance,
			discountCode,
			baseCost
		) => {
			let err = undefined;

			try {
				const pkg = new Package(
					packageId,
					packageWeight,
					packageDistance,
					discountCode,
					baseCost
				);

				testTotalCostAndDiscounted = () => {
					const deliveryCost =
						baseCost + packageWeight * 10 + packageDistance * 5;
					let totalCost = deliveryCost;
					let discountedAmount = 0;
					let offerFound = null;

					if (discountCode) {
						offerFound = pkg.offers.find(
							(ofr) => ofr.name === discountCode.toUpperCase()
						);
					}

					// console.log("minDist", packageDistance >= offerFound.minDist);
					// console.log("maxDist", packageDistance <= offerFound.maxDist);
					// console.log("minWeight", packageWeight >= offerFound.minWeight);
					// console.log("maxWeight", packageWeight <= offerFound.maxWeight);

					if (offerFound) {
						if (
							packageDistance >= offerFound.minDist &&
							packageDistance <= offerFound.maxDist &&
							packageWeight >= offerFound.minWeight &&
							packageWeight <= offerFound.maxWeight
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

				const pkgCosting = pkg.getTotalCostAndDiscounted();

				expect(pkgCosting).toBe(testTotalCostAndDiscounted());
			} catch (e) {
				err = e;
			}

			if (err) {
				if (typeof packageId == undefined || typeof packageId == null) {
					expect(err).toBe("Package ID is required");
				} else if (isNaN(packageWeight)) {
					expect(err).toBe("Package weight is required and must be a number");
				} else if (packageWeight < 0) {
					expect(err).toBe("Package weight cannot be less than 0");
				} else if (isNaN(packageDistance)) {
					expect(err).toBe("Package distance is required and must be a number");
				} else if (packageDistance < 0) {
					expect(err).toBe("Package distance cannot be less than 0");
				} else if (isNaN(baseCost)) {
					expect(err).toBe(
						"Package base cost is required and must be a number"
					);
				} else if (baseCost < 0) {
					expect(err).toBe("Package base cost cannot be less than 0");
				}
			}
		}
	);

	afterAll((done) => {
		done();
	});
});
