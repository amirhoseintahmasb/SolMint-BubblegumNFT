import { loadOrGenerateKeypair, loadPublicKeysFromFile, savePublicKeyToFile } from "../utils/helpers";
import { Connection, Keypair } from "@solana/web3.js";
import { mintCompressedNFT } from "./compression";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import { createCollection, createTree } from "./compression";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from "@coral-xyz/anchor";
import { decode, mapProof } from "../utils/utils";
import { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID } from "@solana/spl-account-compression";
import { getAsset, getAssetProof } from "../utils/readAPI";
import { CompressedNft } from "../../target/types/compressed_nft";
import { NFTMetadata } from "../utils/dtos";
import 'dotenv/config'

require('dotenv').config()


export async function CreateTree() {
    const connection = new Connection(process.env.RPC_URL, "confirmed")

    const payer = loadOrGenerateKeypair("payer");
    console.log("Payer address:", payer.publicKey.toBase58());

    const maxDepthSizePair: ValidDepthSizePair = {
        maxDepth: 14,
        maxBufferSize: 64,
    };
    const canopyDepth = maxDepthSizePair.maxDepth - 4;
    const tree = await createTree(connection, payer, Keypair.generate(), maxDepthSizePair, canopyDepth);

    savePublicKeyToFile("treeAddress", tree.treeAddress);
}

export async function CreateCollection(metadataArgs: CreateMetadataAccountArgsV3) {
    const connection = new Connection(process.env.RPC_URL, "confirmed")

    const payer = loadOrGenerateKeypair("payer");
    console.log("Payer address:", payer.publicKey.toBase58());

    metadataArgs.data.creators.push(
        {
            address: payer.publicKey,
            verified: false,
            share: 100,
        }
    )

    console.log("Creating collection with name:", metadataArgs.data.name);
    // create a full token mint and initialize the collection (with the `payer` as the authority)
    const collection = await createCollection(connection, payer, metadataArgs);

    // locally save the addresses for the demo
    savePublicKeyToFile("collectionMint", collection.mint);
}

export async function MintNFT(metadata: NFTMetadata) {
    const connection = new Connection(process.env.RPC_URL, "confirmed")

    const payer = loadOrGenerateKeypair("payer");
    console.log("Payer address:", payer.publicKey.toBase58());

    const receiver = loadOrGenerateKeypair("receiver")
    console.log("Receiver address:", receiver.publicKey.toBase58());

    const { collectionMint, treeAddress } = loadPublicKeysFromFile()

    await mintCompressedNFT(
        metadata,
        connection,
        payer,
        receiver,
        treeAddress,
        collectionMint,
    )
}

export async function VerifyNFT(assetId: string) {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.CompressedNFT as anchor.Program<CompressedNft>;

    // cNFT receiver
    const receiver = loadOrGenerateKeypair("receiver")

    const { treeAddress } = loadPublicKeysFromFile()

    const asset = await getAsset(assetId);
    const proof = await getAssetProof(assetId);
    const proofPathAsAccounts = mapProof(proof);
    const root = decode(proof.root);
    const dataHash = decode(asset.compression.data_hash);
    const creatorHash = decode(asset.compression.creator_hash);
    const nonce = new anchor.BN(asset.compression.leaf_id);
    const index = asset.compression.leaf_id;

    const tx = await program.methods
        .verify({
            root, dataHash, creatorHash, nonce, index
        })
        .accounts({
            leafOwner: receiver.publicKey,
            leafDelegate: receiver.publicKey,
            merkleTree: treeAddress,
            compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        })
        .remainingAccounts(proofPathAsAccounts)
        .transaction();

    const sx = await program.provider.sendAndConfirm(tx, [receiver], { skipPreflight: true });
    console.log(`Tx Signature: ${sx}`);
}

