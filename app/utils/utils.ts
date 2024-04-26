import { AccountMeta, PublicKey, SystemProgram } from "@solana/web3.js";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata/dist/src/generated";
import * as bs58 from "bs58";
import { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, SPL_NOOP_PROGRAM_ID } from "@solana/spl-account-compression";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";

export function decode(stuff: string) {
  return bufferToArray(bs58.decode(stuff))
}

export function bufferToArray(buffer: Buffer): number[] {
  const nums: number[] = [];
  for (const element of buffer) {
    nums.push(element);
  }
  return nums;
}

export const mapProof = (assetProof: { proof: string[] }): AccountMeta[] => {
  if (!assetProof.proof || assetProof.proof.length === 0) {
    throw new Error("Proof is empty");
  }
  return assetProof.proof.map((node) => ({
    pubkey: new PublicKey(node),
    isSigner: false,
    isWritable: false,
  }));
}

export function getAccounts(collectionMint: PublicKey, tree: PublicKey) {
  const [treeAuthority] = PublicKey.findProgramAddressSync(
      [tree.toBuffer()],
      BUBBLEGUM_PROGRAM_ID
  );

  const [bubblegumSigner] = PublicKey.findProgramAddressSync(
      [Buffer.from("collection_cpi", "utf8")],
      BUBBLEGUM_PROGRAM_ID
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

  return {
    treeAuthority,
    collectionMint,
    collectionMetadata: metadataAccount,
    editionAccount: masterEditionAccount,
    merkleTree: tree,

    bubblegumSigner,
    logWrapper: SPL_NOOP_PROGRAM_ID,
    compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  };
}