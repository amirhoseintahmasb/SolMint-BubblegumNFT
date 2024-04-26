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
npx ts-node ./app/index.ts 
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
│   │   └── handlers.ts       # NFT metadata and all the logical functions for NFT transactions
│   ├── utils/                # all the logics for NFT transactions
│   │   └── utils.ts          # utilities for NFT proofs
│   │   └── readAPI.ts        # Implements the Digital Asset Standard Read API
│   │   └── helpers.ts        # Helper functions and utilities
│   │   └── dtos.ts           # Data transfer objects for NFT metadata
├   └── index.ts/             # Simplify the organization of code. It serves as an entry point for importing and exporting modules in project
│
│
├── programs/compressed-nft   # Solana smart contract implementation
│   └── src/                  # Source files for the smart contract
│       ├── actions           # Defines actions like mint and verify
│       ├── state             # State management for the smart contract
│       └── lib.rs            # Main library entry, includes program logic
│       └── Cargo.toml           
│       └── Xargo.toml
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

## Sample Terminal Outputs

The following section provides examples of terminal outputs during various operations such as creating a Merkle tree, minting NFTs, and transaction confirmations. These outputs help in understanding the functionality and responses of the system during execution.

### Example Output: Creating a Merkle Tree and Minting NFT

```plaintext
➜✗ npx ts-node ./app/index.ts
Payer address: 2FgnzUAv2s3681xqRJsxMwQQBsG2M6b9wmj1guSo23k2
Creating a new Merkle tree...
treeAddress: BxD8JgwBg5yE7jRg1vr4e4YAGtHseUkQYtYVTjDsdVoc
treeAuthority: FafneKDfrZyBEX24dSfGo89qRJ2vBx8mtFNWSKMJe12e
Transaction confirmed: {
  context: { apiVersion: '1.18.11', slot: 294773148 },
  value: {
    confirmationStatus: 'confirmed',
    confirmations: 3,
    err: null,
    slot: 294773145,
    status: { Ok: null }
  }
}

Merkle tree created successfully!
https://explorer.solana.com/tx/3Dm39AGgbeDuZnRGm5beGSfARHxmcJG9YP41YKUNNdofoXM317Wk9y68nyPGmiwVnXXYH4fSPY3UEiMhAzeEHxmc?cluster=devnet
```

### Example Output: Creating a Collection and Minting Tokens

```plaintext
Payer address: 2FgnzUAv2s3681xqRJsxMwQQBsG2M6b9wmj1guSo23k2
Creating collection with name: Super Sweet NFT Collection
Creating the collection's mint...
Mint address: CzbmXyYLgbuYHP2T2jrgfj9qsUMSXUTD3ZFHdswdLzVi
Creating a token account...
Token account: EwtmUPCXPMk2gXQBVh7jAHba4paSUSisg1eYSJJsCAYS
Minting 1 token for the collection...
Metadata account: CnexiCSRaXRLqgZp1EAj7DkU3p9Gt5d9Wdb7WoRWbHyW
Master edition account: 7sbyGojGwxTh95tVv8zhuhVKDXfrH5PQSXkW9CLpGKXJ

Collection successfully created!
https://explorer.solana.com/tx/5BkdXUwM1dVjTau8eJUz6nBiyk4uoNWwcqEkDbhnJZM1TBswZcdDpgGAtuzXpaovyA54gi51cTxkqh2d9fZMm9de?cluster=devnet
```

### Example Output: Successfully Minted a Compressed NFT

```plaintext
Payer address: 2FgnzUAv2s3681xqRJsxMwQQBsG2M6b9wmj1guSo23k2
Receiver address: 4JmK4dkQ5cz1cUQcozkPapiff2HSeXkVM9t6nhun8qxi
Successfully minted the compressed NFT!
https://explorer.solana.com/tx/5seaGCKb5kGv9j3mntoeAA389Koi2XvUU47YRyZZvbCVKxg8odUhoHcNEWyPySw8fGBCnTgJHmHj12prkCX2HQvw?cluster=devnet
```

## Conclusion

This project showcases the integration of advanced blockchain technologies to create a scalable and cost-efficient NFT minting platform on the Solana network.
These terminal outputs exemplify the typical interactions and responses during the operation of the SolMint-BubblegumNFT project. They illustrate how the system processes and confirms transactions related to the creation of Merkle trees, minting of NFTs, and the handling of blockchain interactions, providing a practical view into the application's functionality.

---

For further exploration and real-time updates, follow the transaction history and progress on the Solana Explorer through provided links after transactions. Ensure your environment variables and dependencies are correctly set as per the installation guide for optimal performance.
