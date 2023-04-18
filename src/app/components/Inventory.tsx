import { useState, useEffect } from "react";
import { useContracts } from "../hooks/useContracts";
import { useWriteContract } from "../hooks/useWriteContract";
import {
  useAccount,
  useWaitForTransaction,
  useTransactionManager,
  useTransactions,
} from "@starknet-react/core";
import { Button } from "./Button";
import { useQuery } from "@apollo/client";
import {
  getItemsByAdventurer,
  getItemsByOwner,
  getAdventurersByOwner,
} from "../hooks/graphql/queries";

const Inventory: React.FC = () => {
  const { account } = useAccount();
  const formatAddress = account ? account.address : "0x0";

  const { writeAsync, addToCalls, calls } = useWriteContract();
  const { adventurerContract } = useContracts();
  const [hash, setHash] = useState<string | undefined>(undefined);
  const { hashes, addTransaction } = useTransactionManager();
  const transactions = useTransactions({ hashes });

  const { data, isLoading, error } = useWaitForTransaction({
    hash,
    watch: true,
  });

  useEffect(() => {
    if (adventurerContract && formatAddress) {
      const mintDailyItems = {
        contractAddress: adventurerContract?.address,
        selector: "mint_daily_items",
        calldata: [formatAddress],
      };
      addToCalls(mintDailyItems);
      console.log(calls);
    }
  }, [adventurerContract, formatAddress, addToCalls, calls]);

  return (
    <div className="flex flex-row items-center mx-2 text-lg">
      <div className="flex p-1 flex-col">
        <>
          {hash && <div className="flex flex-col">Hash: {hash}</div>}
          {isLoading && hash && (
            <div className="loading-ellipsis">Loading...</div>
          )}
          {error && <div>Error: {JSON.stringify(error)}</div>}
          {data && <div>Status: {data.status}</div>}
        </>
      </div>
    </div>
  );
};

export default Inventory;
