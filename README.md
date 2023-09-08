# Staking App

This is a simple staking application that allows users to stake their tokens and track their staked duration. The application is built using React and the ethers.js library to interact with the Ethereum blockchain. The application is set up to work with the Fantom testnet.

## Features

- Display the APR (Annual Percentage Rate) for staking.
- Allow users to stake and unstake tokens.
- Display the elapsed time since the user staked their tokens.
- Dynamically calculate and refresh the APR.
  
## Prerequisites

- Node.js and npm installed.
- MetaMask or a similar Ethereum wallet browser extension for interacting with the app.

## Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/FiroshV/fantom-stake-portal.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd fantom-stake-portal
   ```

3. **Install the required dependencies**:

   ```bash
   npm install
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open a web browser** and navigate to `http://localhost:3000` to access the Staking App.

## Minting Staking Tokens

Before staking tokens, you may need to mint or acquire the staking tokens used in this application. You can interact with the token contract and mint tokens using the following link:

[https://testnet.ftmscan.com/address/0x5b96e18cff249cf70f35f034e7606e850d5cda6c](https://testnet.ftmscan.com/address/0x5b96e18cff249cf70f35f034e7606e850d5cda6c)

## Contract Details

The staking contract used in this application is available for review and interaction on the Fantom testnet. You can access the contract and its code using the following link:

[https://testnet.ftmscan.com/address/0x8699d52c6c82b588bc12b46ada750dc0eb298818](https://testnet.ftmscan.com/address/0x8699d52c6c82b588bc12b46ada750dc0eb298818)

## Code Structure

The main code resides in the `Home` component. The component sets up the connection with the Ethereum blockchain, allows users to stake and unstake their tokens, and calculates/display the APR.

## Errors and Logging

Make sure to monitor the browser console for any errors or logs during the staking/unstaking processes. The application provides appropriate error messages and logs for better debugging.
