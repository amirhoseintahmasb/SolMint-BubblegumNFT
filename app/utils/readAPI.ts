import axios from "axios";
import 'dotenv/config'

require('dotenv').config()

const RPC_PATH = process.env.READAPI_RPC_URL;

export async function getAsset(assetId: any, rpcUrl = RPC_PATH): Promise<any> {
  try {
    const axiosInstance = axios.create({
      baseURL: rpcUrl,
    });
    const response = await axiosInstance.post(rpcUrl, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {
        id: assetId
      },
    });
    return response.data.result;
  } catch (error) {
    console.error(error);
  }
}

export async function getAssetProof(assetId: any, rpcUrl = RPC_PATH): Promise<any> {
  try {

    const axiosInstance = axios.create({
      baseURL: rpcUrl,
    });
    const response = await axiosInstance.post(rpcUrl, {
      jsonrpc: "2.0",
      method: "getAssetProof",
      id: "rpd-op-123",
      params: {
        id: assetId
      },
    });
    return response.data.result;
  } catch (error) {
    console.error(error);
  }
}