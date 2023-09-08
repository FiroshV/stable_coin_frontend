import { useState, useEffect, useRef } from "react";
const { ethers } = require("ethers");
import contractABI from "../ABI.json";
import ERC20_ABI from "../ERC20_ABI.json";

const contractAddress = "0x8699d52C6c82B588Bc12B46aDA750dC0EB298818";
const TOKEN_ADDRESS = "0x5b96E18Cff249Cf70F35F034E7606E850D5CDa6C";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(null);

  const [protocolAPR, setAPR] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("0s");

  const timerIntervalRef = useRef(null);

  const elapsedSecondsRef = useRef(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  useEffect(() => {
    calculateAPR();
  }, [provider]);

  const formatElapsedTime = (totalSeconds) => {
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.floor(totalSeconds / 86400);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const startTimer = () => {
    elapsedSecondsRef.current = 0;
    setElapsedTime(formatElapsedTime(0));

    timerIntervalRef.current = setInterval(() => {
      elapsedSecondsRef.current += 1;
      setElapsedTime(formatElapsedTime(elapsedSecondsRef.current));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      elapsedSecondsRef.current = 0; 
      setElapsedTime(formatElapsedTime(0));
    }
  };

  const initializeContract = (address, ABI, signer) => {
    return new ethers.Contract(address, ABI, signer || provider);
  };

  async function handleApprove(signer, amountToStake) {
    try {
      const tokenContract = initializeContract(
        TOKEN_ADDRESS,
        ERC20_ABI,
        signer
      );

      const tx = await tokenContract.approve(contractAddress, amountToStake);
      await tx.wait();

      return true;
    } catch (error) {
      console.error("Error approving:", error);
      return false;
    }
  }

  const handleTransaction = async (transactionType) => {
    setIsLoading(true);
    try {
      const signer = await provider.getSigner(0);
      const amountInWei = ethers.parseUnits(amount.toString(), "wei");

      if (signer) {
        const contractWithSigner = initializeContract(
          contractAddress,
          contractABI,
          signer
        );

        if (transactionType === "stake") {
          const approved = await handleApprove(signer, amountInWei);
          if (approved) {
            const tx = await contractWithSigner.deposit(amountInWei);
            await tx.wait();
            startTimer();
            alert("Staked successfully!");
          }
        } else if (transactionType === "unstake") {
          const tx = await contractWithSigner.withdraw(amountInWei);
          await tx.wait();
          stopTimer();
          alert("Unstaked successfully!");
        }
      }
    } catch (error) {
      console.error(`Error ${transactionType}ing:`, error);
      alert(
        `${
          transactionType.charAt(0).toUpperCase() + transactionType.slice(1)
        }ing failed!`
      );
    } finally {
      setIsLoading(false); 
    }
  };

  async function getBlockTime() {
    try {
      const blockNumber = await provider.getBlockNumber();

      const block = await provider.getBlock(blockNumber);
      const previousBlock = await provider.getBlock(blockNumber - 1);

      const blockTime = block.timestamp - previousBlock.timestamp;

      return blockTime;
    } catch (error) {
      console.error("Error fetching block time:", error);
      return null;
    }
  }

  const blocksPerYearCalc = (blockTimeSeconds) => {
    const SECONDS_IN_YEAR = 365 * 24 * 60 * 60; 

    return SECONDS_IN_YEAR / blockTimeSeconds;
  };

  async function calculateAPR() {
    if (provider) {
      const signer = await provider.getSigner(0);

      if (signer) {
        const contractWithSigner = initializeContract(
          contractAddress,
          contractABI,
          signer
        );

        const rewardPerBlock = await contractWithSigner.rewardPerBlock();
        const totalStakedToken = await contractWithSigner.totalStakedToken();
        const blockTimeSeconds = await getBlockTime();
        const blocksPerYear = BigInt(blocksPerYearCalc(blockTimeSeconds));
        let calculatedAPR = Number(
          (blocksPerYear * rewardPerBlock) / totalStakedToken
        );
        setAPR(calculatedAPR);
      }
    }
  }

  const APRComponent = () => {
    return (
      <>
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl mb-0 font-bold">APR: {protocolAPR}%</h2>
          <button
            onClick={calculateAPR}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Refresh APR
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">Staking App</h1>
        {isLoading && (
          <span className="inline-block ml-4">
            <div className="loader w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </span>
        )}
        <div>
          <APRComponent />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amount (Wei)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-md w-full mb-2"
            onClick={() => handleTransaction("stake")}
          >
            Stake
          </button>

          <button
            className="bg-red-500 text-white p-2 rounded-md w-full"
            onClick={() => handleTransaction("unstake")}
          >
            Unstake
          </button>
        </div>

        <div>
          <h2 className="text-xl mb-2">Staked For: {elapsedTime}</h2>
        </div>
      </div>
    </div>
  );
}
