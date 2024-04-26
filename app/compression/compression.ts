import {
    Keypair,
    PublicKey,
    Connection,
    Transaction,
    sendAndConfirmTransaction,
    TransactionExpiredBlockheightExceededError
} from "@solana/web3.js";
import { createAccount, createMint, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    createAllocTreeIx,
    ValidDepthSizePair,
    SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
    PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
    MetadataArgs,
    TokenProgramVersion,
    TokenStandard,
    createCreateTreeInstruction,
    createMintToCollectionV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
    CreateMetadataAccountArgsV3,
    createCreateMetadataAccountV3Instruction,
    createCreateMasterEditionV3Instruction,
    createSetCollectionSizeInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { explorerURL, extractSignatureFromFailedTransaction } from "../utils/helpers";
import { NFTMetadata } from "../utils/dtos";


export async function createTree(
    connection: Connection,
    payer: Keypair,
    treeKeypair: Keypair,
    maxDepthSizePair: ValidDepthSizePair,
    canopyDepth: number = 0,
) {
    console.log("Creating a new Merkle tree...");
    console.log("treeAddress:", treeKeypair.publicKey.toBase58());

    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
        [treeKeypair.publicKey.toBuffer()],
        BUBBLEGUM_PROGRAM_ID,
    );
    console.log("treeAuthority:", treeAuthority.toBase58());

    const allocTreeIx = await createAllocTreeIx(
        connection,
        treeKeypair.publicKey,
        payer.publicKey,
        maxDepthSizePair,
        canopyDepth,
    );

    const createTreeIx = createCreateTreeInstruction(
        {
            payer: payer.publicKey,
            treeCreator: payer.publicKey,
            treeAuthority,
            merkleTree: treeKeypair.publicKey,
            compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
            logWrapper: SPL_NOOP_PROGRAM_ID,
        },
        {
            maxBufferSize: maxDepthSizePair.maxBufferSize,
            maxDepth: maxDepthSizePair.maxDepth,
            public: false,
        },
        BUBBLEGUM_PROGRAM_ID,
    );

    try {
        const { blockhash } = await getRecentBlockhash(connection);

        const tx = new Transaction().add(allocTreeIx).add(createTreeIx);
        tx.feePayer = payer.publicKey;
        tx.recentBlockhash = blockhash

        const txSignature = await safeSendAndConfirmTransaction(connection, tx, [treeKeypair, payer]);

        console.log("\nMerkle tree created successfully!");
        console.log(explorerURL({ txSignature }));

        return { treeAuthority, treeAddress: treeKeypair.publicKey };
    } catch (err: any) {
        console.error("\nFailed to create merkle tree:", err);
        await extractSignatureFromFailedTransaction(connection, err);

        throw err;
    }
}

export async function createCollection(
    connection: Connection,
    payer: Keypair,
    metadataV3: CreateMetadataAccountArgsV3,
) {
    console.log("Creating the collection's mint...");
    const mint = await createMint(connection, payer, payer.publicKey, payer.publicKey, 0,);

    console.log("Mint address:", mint.toBase58());

    console.log("Creating a token account...");
    const tokenAccount = await createAccount(connection, payer, mint, payer.publicKey);
    console.log("Token account:", tokenAccount.toBase58());

    console.log("Minting 1 token for the collection...");
    const mintSig = await mintTo(
        connection,
        payer,
        mint,
        tokenAccount,
        payer,
        1,
        [],
        undefined,
        TOKEN_PROGRAM_ID,
    );
    console.log(explorerURL({ txSignature: mintSig }));

    const [metadataAccount, _bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID,
    );
    console.log("Metadata account:", metadataAccount.toBase58());

    const createMetadataIx = createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataAccount,
            mint: mint,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
        },
        {
            createMetadataAccountArgsV3: metadataV3,
        },
    );

    const [masterEditionAccount, _bump2] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata", "utf8"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition", "utf8"),
        ],
        TOKEN_METADATA_PROGRAM_ID,
    );
    console.log("Master edition account:", masterEditionAccount.toBase58());

    const createMasterEditionIx = createCreateMasterEditionV3Instruction(
        {
            edition: masterEditionAccount,
            mint: mint,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
            metadata: metadataAccount,
        },
        {
            createMasterEditionArgs: {
                maxSupply: 0,
            },
        },
    );

    const collectionSizeIX = createSetCollectionSizeInstruction(
        {
            collectionMetadata: metadataAccount,
            collectionAuthority: payer.publicKey,
            collectionMint: mint,
        },
        {
            setCollectionSizeArgs: { size: 50 },
        },
    );

    try {
        const tx = new Transaction()
            .add(createMetadataIx)
            .add(createMasterEditionIx)
            .add(collectionSizeIX);
        tx.feePayer = payer.publicKey;

        const txSignature = await sendAndConfirmTransaction(connection, tx, [payer], {
            commitment: "confirmed",
            skipPreflight: true,
        });

        console.log("\nCollection successfully created!");
        console.log(explorerURL({ txSignature }));
    } catch (err) {
        console.error("\nFailed to create collection:", err);
        await extractSignatureFromFailedTransaction(connection, err);

        throw err;
    }
    return { mint, tokenAccount, metadataAccount, masterEditionAccount };
}

export async function mintCompressedNFT(
    metadata: NFTMetadata,
    connection: Connection,
    payer: Keypair,
    receiver: Keypair,
    treeAddress: PublicKey,
    collectionMint: PublicKey,
) {

    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
        [treeAddress.toBuffer()],
        BUBBLEGUM_PROGRAM_ID,
    );

    const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
        [Buffer.from("collection_cpi", "utf8")],
        BUBBLEGUM_PROGRAM_ID,
    );

    const [metadataAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata", "utf8"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), collectionMint.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID
    );

    const [masterEditionAccount] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata", "utf8"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            collectionMint.toBuffer(),
            Buffer.from("edition", "utf8"),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );

    const compressedNFTMetadata: MetadataArgs = {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        creators: [{
            address: payer.publicKey,
            share: 100,
            verified: false
        }],
        editionNonce: 0,
        uses: null,
        collection: null,
        primarySaleHappened: false,
        sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
        isMutable: false,
        tokenProgramVersion: TokenProgramVersion.Original,
        tokenStandard: TokenStandard.NonFungible,
    };


    const compressedMintIx = createMintToCollectionV1Instruction(
        {
            treeAuthority,
            leafOwner: receiver.publicKey,
            leafDelegate: payer.publicKey,
            merkleTree: treeAddress,
            payer: payer.publicKey,
            treeDelegate: payer.publicKey,
            collectionAuthority: payer.publicKey,
            collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
            collectionMint,
            collectionMetadata: metadataAccount,
            editionAccount: masterEditionAccount,
            bubblegumSigner: bubblegumSigner,
            logWrapper: SPL_NOOP_PROGRAM_ID,
            compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        },
        {
            metadataArgs: Object.assign(compressedNFTMetadata, {
                collection: { key: collectionMint, verified: false },
            })
        },
    )

    try {
        const tx = new Transaction().add(compressedMintIx);
        tx.feePayer = payer.publicKey;

        const txSignature = await sendAndConfirmTransaction(connection, tx, [payer], {
            commitment: "confirmed",
            skipPreflight: true,
        });

        console.log("\nSuccessfully minted the compressed NFT!");
        console.log(explorerURL({ txSignature }));

        return txSignature;
    } catch (err) {
        console.error("\nFailed to mint compressed NFT:", err);

        await extractSignatureFromFailedTransaction(connection, err);

        throw err;
    }
}

export async function safeSendAndConfirmTransaction(connection, transaction, signers, attempts = 3) {
    for (let i = 0; i < attempts; i++) {
        try {
            const signature = await connection.sendTransaction(transaction, signers, { preflightCommitment: "confirmed" });

            const confirmation = await connection.confirmTransaction(signature, {
                commitment: "confirmed",
                maxRetries: 5000
            });
            console.log('Transaction confirmed:', confirmation);
            return signature;

        } catch (err) {
            if (err instanceof TransactionExpiredBlockheightExceededError) {
                console.log(`Attempt ${i + 1}: Transaction expired, retrying...`);
                continue;
            } else {
                throw err;
            }
        }
    }
    throw new Error('Failed to confirm transaction after maximum retries');
}

export async function getRecentBlockhash(connection) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    return { blockhash, lastValidBlockHeight };
}
