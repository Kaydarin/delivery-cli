const Offer = require("./Offer");

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

		// Search offer if code exist
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

module.exports = Package;
