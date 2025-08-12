import { useState } from "react";
import { Input } from "./input";

interface MaxLengthInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  length: number;
  onChange: (value: string) => void;
  onLimitReached: (hasReachedLimit: boolean) => void;
}

export function MaxLengthInput({
  id,
  name,
  placeholder,
  className,
  length,
  onChange,
  onLimitReached,
}: MaxLengthInputProps) {
  const inputLimit = length;
  const [caracters, setCaracters] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const updateInput = (inputContent: string): void => {
    let inputLength: number = inputContent.length;

    if (inputLength >= inputLimit) {
      setHasReachedLimit(true);
    } else {
      setHasReachedLimit(false);
    }

    setCaracters(inputLength);
  };

  const getCaractersColor = (): string => {
    if (caracters == 0) {
      return "text-red-300";
    } else if (
      caracters >= inputLimit - inputLimit * 0.2 &&
      caracters < inputLimit - inputLimit * 0.1
    ) {
      return "text-red-400";
    } else if (
      caracters >= inputLimit - inputLimit * 0.1 &&
      caracters <= inputLimit
    ) {
      return "text-red-500";
    } else if (caracters > inputLimit) {
      return "text-red-600";
    }

    return "text-slate-300";
  };

  return (
    <div>
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(e) => {
          updateInput(e.target.value);
          onChange(e.target.value);
          onLimitReached(hasReachedLimit);
        }}
        className={
          className ||
          "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
        }
      />
      <div className="flex justify-end">
        <p className="text-sm text-slate-300">
          {" "}
          <span className={`${getCaractersColor()}`}>{caracters}</span> /
          {inputLimit}
        </p>
      </div>
    </div>
  );
}
