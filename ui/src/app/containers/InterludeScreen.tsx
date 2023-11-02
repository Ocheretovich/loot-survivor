import { useState, useEffect } from "react";
import { EntropyCountDown } from "@/app/components/CountDown";
import Hints from "@/app/components/interlude/Hints";
import { fetchAverageBlockTime } from "@/app/lib/utils";
import useAdventurerStore from "@/app/hooks/useAdventurerStore";

interface InterludeScreenProps {
  currentBlockNumber: number;
}

export default function InterludeScreen({
  currentBlockNumber,
}: InterludeScreenProps) {
  const { adventurer } = useAdventurerStore();
  const [fetchedAverageBlockTime, setFetchedAverageBlockTime] = useState(false);
  const [averageBlockTime, setAverageBlockTime] = useState(0);
  const [nextEntropyTime, setNextEntropyTime] = useState<number | null>(null);
  const [countDownExpired, setCountDownExpired] = useState(false);

  const fetchData = async () => {
    const result = await fetchAverageBlockTime(currentBlockNumber, 20);
    setAverageBlockTime(result!);
    setFetchedAverageBlockTime(true);
  };

  const getNextEntropyTime = () => {
    const nextBlockHashBlock = adventurer?.revealBlock!;
    const adventurerStartBlock = adventurer?.startBlock!;
    const blockDifference = nextBlockHashBlock - adventurerStartBlock;
    const secondsUntilNextEntropy = blockDifference * averageBlockTime;
    const adventurerCreatedTime = new Date(adventurer?.createdTime!).getTime();
    const nextEntropyTime =
      adventurerCreatedTime + secondsUntilNextEntropy * 1000;
    setNextEntropyTime(nextEntropyTime);
  };

  useEffect(() => {
    if (fetchedAverageBlockTime) {
      getNextEntropyTime();
    } else if (currentBlockNumber > 0) {
      fetchData();
    }
  }, [fetchedAverageBlockTime, currentBlockNumber]);

  return (
    <>
      {!countDownExpired && (
        <>
          <div className="fixed inset-0 left-0 right-0 bottom-0 opacity-80 bg-terminal-black z-40 sm:m-2 w-full h-full" />
          <div className="fixed inset-0 z-40 w-full h-full py-5 sm:py-8 2xl:py-20">
            <EntropyCountDown
              targetTime={nextEntropyTime}
              countDownExpired={() => setCountDownExpired(true)}
            />
            <div className="flex justify-center items-center h-3/4">
              <Hints />
            </div>
          </div>
        </>
      )}
    </>
  );
}
