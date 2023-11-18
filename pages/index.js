import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../ABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const SEPOLIA_CHAIN_ID = process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID;
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export default function Home() {
  const [totalSupply, setTotalSupply] = useState(0);
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    } else {
      setProvider(new ethers.JsonRpcProvider(SEPOLIA_RPC_URL));
    }
  }, []);

  useEffect(() => {
    calculateTotalSupply();
  }, [provider]);

  const initializeContract = (address, ABI, signer) => {
    return new ethers.Contract(address, ABI, signer || provider);
  };

  const handleTransaction = async (transactionType) => {
    setIsLoading(true);
    try {
      if (!amount > 0) {
        return alert("Amount should be greater than zero");
      }
      const network = await provider.getNetwork();
      if (network.chainId.toString() !== SEPOLIA_CHAIN_ID) {
        return alert("Please connect to the Sepolia network.");
      }
      const signer = await provider.getSigner(0);
      if (!signer) {
        return alert("Signer not found. Please connect to MetaMask.");
      }

      const amountInWei = ethers.parseUnits(amount.toString(), "wei");

      if (signer) {
        const contractWithSigner = initializeContract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );

        if (transactionType === "deposit") {
          const tx = await contractWithSigner.depositETH({
            value: amountInWei,
          });
          await tx.wait();
        } else if (transactionType === "redeem") {
          const tx = await contractWithSigner.redeemETH(amountInWei);
          await tx.wait();
        }
      }

      await calculateTotalSupply();
    } catch (error) {
      return alert("An error occurred while connecting to MetaMask. Please make sure MetaMask is installed and you are logged in.");   
    } finally {
      setIsLoading(false);
    }
  };

  async function calculateTotalSupply() {
    if (provider) {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        provider
      );

      try {
        const _totalSupply = await contract.getTotalnUSDSupply();
        setTotalSupply(
          _totalSupply ? Number(_totalSupply / (BigInt(10) ** BigInt(18))) : 0
        );
      } catch (error) {
        console.error("Error fetching total supply:", error);
        setTotalSupply(0);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-4 rounded-md shadow-md">
        <h1 className="text-center text-2xl font-bold mb-4">
          nUSD Stable coin
        </h1>
        {isLoading && (
          <span className="inline-block ml-4">
            <div className="loader w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </span>
        )}
        <div>
          <h2 className="text-lg mb-0">Total Supply : {totalSupply} nUSD</h2>
        </div>

        <div className="mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4 flex gap-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-md w-full"
            onClick={() => handleTransaction("deposit")}
          >
            Deposit
          </button>

          <button
            className="bg-purple-500 text-white p-2 rounded-md w-full"
            onClick={() => handleTransaction("redeem")}
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
}
