# SolMint-BubblegumNFT
This project involves the development of a smart contract (Solana Program) using the Metaplex Bubblegum standard to mint NFTs as part of a collection. The contract is written in Rust and incorporates a TypeScript codebase for transaction handling, ensuring robust transaction execution despite potential delays or failures in blockchain or RPC.

## Project Overview
This project involves the development of a smart contract (Solana Program) using the Metaplex Bubblegum standard to mint NFTs as part of a collection. The contract is written in Rust and incorporates a TypeScript codebase for transaction handling, ensuring robust transaction execution despite potential delays or failures in blockchain or RPC.

## Features
- **Smart Contract for NFT Minting**: Utilizes Metaplex Bubblegum standards for minting NFTs efficiently.
- **Transaction Propagation System**: TypeScript implementation ensures transactions are handled efficiently, accounting for network delays and failures.
- **Cost-efficient and Scalable**: Leverages state compression techniques to reduce transaction costs significantly.

## System Requirements
- Rust toolchain (rustc, cargo, rustup)
- Node.js and npm (via nvm)
- Yarn package manager
- Anchor framework for Solana
- Solana CLI

## Installation Guide

### Installing Dependencies
Execute the following commands in your terminal to set up the necessary environment:

```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Node Version Manager and Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install node
nvm use node

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn

# Install Anchor and AVM
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev
avm install 0.26.0
avm use 0.26.0
```
### Building the Project
To compile the smart contract and install node dependencies, use:

```bash
yarn
anchor build
```

### Configuring Solana CLI
Set the Solana CLI to use the devnet cluster for deployment and testing:

```bash
solana config set --url https://api.devnet.solana.com

solana airdrop 1 2FgnzUAv2s3681x**********************3k2 --url https://api.devnet.solana.com
```

### Deploying the Smart Contract
Deploy your Solana program using Anchor:

```bash
anchor deploy
```

## Running Tests
Initialize the testing environment and run tests using:

```bash
npx ts-node -r ./tests/setup.ts
anchor test --skip-build --skip-deploy --skip-local-validator
```

## Project Structure and Code Overview

The SolMint-BubblegumNFT project is structured to efficiently handle operations related to the minting and verification of compressed NFTs using the Solana blockchain and Metaplex Bubblegum standards. Below is an outline of the repository structure and key components:

### Repository Structure

```
SolMint-BubblegumNFT/
│
├── app/                      # Application code for handling business logic
│   ├── compression/          # Compression logic for NFTs
│   │   └── compression.ts    # Implementation of compression functionality
│   │   └── dto.ts            # Data transfer objects for NFT metadata
│   ├── verification/         # Verification tests for NFT transactions
│   │   └── verify.ts         # Verification logic for NFT proofs
│   └── routes.ts             # API routes for external integration
│   └── server.ts             # Server setup and API call handling
│
├── utils/                    # Helper functions and utilities
│   └── readAPI.ts            # Implements the Digital Asset Standard Read API
│
├── programs/                 # Solana smart contract implementation
│   └── src/                  # Source files for the smart contract
│       ├── actions.rs        # Defines actions like mint and verify
│       ├── state.rs          # State management for the smart contract
│       └── lib.rs            # Main library entry, includes program logic
│
├── .local_keys/              # Local storage for keys and wallet information
├── .env                      # Environment variables for local setup
└── anchor.toml               # Configuration file for Anchor framework
```

### Key Components

#### App Layer
- **Compression Logic**: Handles the compression of NFT data to optimize storage and transaction costs on the blockchain.
- **DTO (Data Transfer Object)**: Facilitates the interaction with compressed NFT metadata, ensuring structured and type-safe data handling.
- **Verification Logic**: Provides robust verification mechanisms to confirm the authenticity of NFT transactions.
- **API Server**: Manages API calls for integration with external applications, enabling functionalities like minting and transferring NFTs through HTTP requests.

#### Utilities
- **Read API**: Utilizes the Read API to fetch NFT metadata from the blockchain. Supports both compressed and uncompressed NFTs, allowing developers to retrieve metadata through standardized RPC calls.

#### Smart Contract (Programs)
- **Smart Contract in Rust**: Implements minting and verification functions using the Anchor framework. Ensures that operations adhere to the constraints and standards required for secure and reliable NFT transactions.

### Installation and Configuration

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/SolMint-BubblegumNFT.git
   cd SolMint-BubblegumNFT
   ```

2. **Install Dependencies**:
   Follow the installation commands provided in the main README to set up Rust, Node.js, Yarn, and Anchor.

3. **Environment Setup**:
   Rename `example.env` to `.env` and update the variables to match your configuration needs:
   ```plaintext
   RPC_URL="https://api.devnet.solana.com"
   READAPI_RPC_URL="https://devnet.helius-rpc.com/?api-key=your-api-key"
   ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"
   ANCHOR_WALLET="./.local_keys/payer.json"
   ```


## Challenges Encountered
- **Anchor Version Compatibility**: Initial compatibility issues with Anchor v0.30.0 due to changes in the IDL, necessitated the use of v0.26.0.
- **Blockchain Delays**: Developed robust handling for transaction propagation to manage intermittent delays and failures in the blockchain network.
- **Deployment on Devnet**: Adjustments required for deploying and testing on Solana's devnet to ensure functionality.

## Additional Resources
For more detailed usage and advanced configurations, refer to the project's extensive documentation and inline comments throughout the codebase. These guides offer insights into handling payer balance, maximum size calculations, and specific configurations for minting and transferring NFTs.

## Conclusion
This project showcases the integration of advanced blockchain technologies to create a scalable and cost-efficient NFT minting platform on the Solana network. Through meticulous planning and robust coding practices, we have overcome significant challenges to provide a reliable system for NFT creation.

---

For further exploration and real-time updates, follow the transaction history and progress on the Solana Explorer through provided links after transactions. Ensure your environment variables and dependencies are correctly set as per the installation guide for optimal performance.
