import React from "react";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { TCandidatewithPosition } from "@/types";

type Props = {
    candidate: TCandidatewithPosition;
    isChosen?: boolean;

    onSelect: (candidate: TCandidatewithPosition) => void;
    onRemove: (candidate: TCandidatewithPosition) => void;
};

const CandidateCard = ({ candidate, isChosen, onSelect, onRemove }: Props) => {
    const { firstName, lastName, picture } = candidate;

    const handleClick = () =>
        !isChosen ? onSelect(candidate) : onRemove(candidate);

    return (
        <div className={cn("p-4 w-1/4 space-y-4 relative selection:")} onClick={handleClick}>
            <div className="relative">
                <div
                    className={cn(
                        "border-secondary rounded-2xl relative ease-out duration-300 overflow-clip border-4 hover:border-green-400",
                        isChosen && "border-green-400",
                    )}
                >
                    <img
                        className="h-[200px] pointer-events-none w-[300px] rounded-none object-cover"
                        src={picture ?? "/images/default-avatar.png"}
                    />
                </div>
                <div className="w-full pointer-events-none absolute -bottom-3 left-0 flex justify-center rounded-full ">
                    <div
                        className={cn(
                            "p-2 rounded-full hidden order-2 bg-green-400 border-secondary text-foreground",
                            isChosen && "block",
                        )}
                    >
                        <Check className="size-5" />
                    </div>
                </div>
            </div>
            <p className="text-xl font-medium">{`${firstName} ${lastName}`}</p>
        </div>
    );
};

export default CandidateCard;
