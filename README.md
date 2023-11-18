
# nUSDStablecoin Frontend (Next.js)

## Introduction

This is the frontend application for the `nUSDStablecoin` project, built using Next.js. It provides a user interface for interacting with the nUSDStablecoin smart contract on the Ethereum blockchain.

## Features

- User-friendly interface to interact with the nUSDStablecoin contract.
- Integration with Ethereum blockchain using Web3 technologies.
- Responsive design for various devices and screen sizes.

## Prerequisites

- Node.js and npm/yarn installed.
- A modern web browser with JavaScript enabled.
- Metamask or other Ethereum wallet browser extension for blockchain interactions.

## Environment Setup

Create a `.env.local` file in the root directory and add the following:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=<Your Contract Address>
NEXT_PUBLIC_SEPOLIA_RPC_URL=<Your Sepolia RPC URL>
NEXT_PUBLIC_SEPOLIA_CHAIN_ID=<Your Sepolia Chain ID>
```

Replace the placeholders with the actual contract address and Sepolia network details.

## Installation

1. Clone the frontend repository.
2. Install dependencies:

   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Running the Application

To run the application in development mode:

```bash
npm run dev
```
or
```bash
yarn dev
```

Visit `http://localhost:3000` in your browser to view the application.

## Building for Production

To build the application for production, run:

```bash
npm run build
```
or
```bash
yarn build
```

