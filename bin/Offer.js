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

module.exports = Offer;
