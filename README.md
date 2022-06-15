# anjiswap

Repository for the Anji Ecosystem app.

## Branding

https://www.dropbox.com/sh/28v9u7y8kmevrng/AACceBQaWadDL0j3BFN2s1h5a?dl=0

## Hex Colours

```
Black: #171717
Green: #79f6d7
Grey Dark : #212a31
Grey Mid: #2c353a
Grey Light: #353e43
White: #ffffff
````

## Contracts

- ABI's inside `src/contracts`
- SafePanda (SPND) : 0x75e3CF3DC6748ff6c92FE77646bE7d2fdFdFA623
- Bamboo (BMBO) : 0x4510e3ac69574f3dfdb43139e97773b542c386e1

## Dependencies

- Node
- NPM

## Getting Started

Install package dependencies

```
npm install
```

Run locally

```
npm start
```

Run linting and tests

```
npm run lint
npm test
```

Build for prod

```
npm run build
```

## Add New Token

- Icon: Add logo to src/assets/tokens folder
- Token info: src/constants/tokens.js
- Add token to Wallet: src/pages/Wallet/index.js
- Get pair address (BNB Address 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c):
    - V1 PCS: https://bscscan.com/address/0xBCfCcbde45cE874adCB698cC183deBcF17952812#readContract
    - V2 PCS: https://bscscan.com/address/0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73#readContract
    - Use the getPair function in BSC Scan above depending on V1 / V2 using the BNB address and then the token address
