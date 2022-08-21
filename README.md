# Delivery CLI

A **NodeJS** based CLI that calculates package delivery cost with offers.

## Setup
1. Pull / clone from this repository.
2. Run `npm install`.

## Run
1. Open terminal and run `node .`

## Run Test
1. Open terminal and run `npm test`

## Background
Kiki, a first-time entrepreneur from the city of Koriko has decided to open **a small distance courier service to deliver packages**, with her friend Tombo and cat Joji.

Kiki has invested in `N` no. of vehicles and have driver partners to drive each vehicle & deliver packages.

### Problem

Since it’s a new business, the team has decided to pass coupons around the town which will help them attract more customers.

#### Offer Criterias
| Offer Code | Distance (km) | Weight | Discount |
| ---------- | ------------- | ------ | -------- |
| OFR001 | < 200 | 70 - 200 | 10% Discount |
| OFR002 | 50 - 150 | 100 - 250 | 7% Discount |
| OFR003 | 50 - 250 | 10 - 150 | 5% Discount |

#### Rules
- Only **one** offer code can be applied for any given package.
- Package should meet the required mentioned **Offer Criterias**.
- If offer code not **valid/found**, discounted amount will be equal to 0.

```
Delivery Cost [Output] = Base Delivery Cost [Input] + (Package Total Weight [Input] X 10) + (Distance to Destination [Input] X 5)
```

### Challenge
Build a command line application to estimate the total delivery cost of each package with an offer code (if applicable).