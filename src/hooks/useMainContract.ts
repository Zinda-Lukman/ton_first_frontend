import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();
  const [balance, setbalance] = useState<number | null>(0);
  const { sender } = useTonConnect();
  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("kQDvAkrxMs3U3kuV_TD2V3C-K0L65pjSH3NiuD3WN_Is53-J")
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      const { number } = await mainContract.getBalance();
      setbalance(number);
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contractAddress: mainContract?.address.toString(),
    ...contractData,
    balance,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);
    },
  };
}
