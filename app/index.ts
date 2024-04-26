import { CreateCollection, CreateTree, MintNFT } from "./compression/handlers";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import { NFTMetadata } from "./utils/dtos";


async function RunApp() {
    await CreateTree()

    const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
        data: {
            name: "plexgum NFT Collection",
            symbol: "PNFC",
            uri: "https://arweave.org/newCollection.json",
            sellerFeeBasisPoints: 100,
            creators: [],
            collection: null,
            uses: null,
        },
        isMutable: false,
        collectionDetails: null,
    };

    await CreateCollection(collectionMetadataV3)

    const metadata: NFTMetadata = {
        name: "new coin",
        symbol: "apc",
        uri: "https://supersweetcollection.notarealurl/test.json",
        sellerFeeBasisPoints: 10
    }
    await MintNFT(metadata)

}

RunApp()
