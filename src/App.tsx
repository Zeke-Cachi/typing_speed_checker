import { KeyboardEvent, useState, useRef, useEffect } from "react";

export default function App() {
  const paragraphRef = useRef<HTMLDivElement>(null);

  //--------------------------------------------------------------------------------------------------------------------------

  const [word] = useState(
    "hello from the gutter. Im a very sophisticated person which likes to fancy around in big cars and do stuff".split(
      ""
    )
  );
  const [wordArray, setWordArray] = useState<string[]>([]);
  const [fontColor, setFontColor] = useState<string[]>([]);
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [timer, setTimer] = useState<{ seconds: number; miliseconds: number }>({
    seconds: 0,
    miliseconds: 0,
  });

  //-------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (paragraphRef.current) paragraphRef.current.focus();
    let interval: number;
    if (startTyping === true) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newMilliseconds = prev.miliseconds + 1;
          if (newMilliseconds === 100) {
            if (prev.seconds === 59) {
              clearInterval(interval);
              setStartTyping(false);
              setShowResults(true);
              return { ...prev, miliseconds: 0, seconds: 0 };
            }
            return { seconds: prev.seconds + 1, miliseconds: 0 };
          } else {
            return { ...prev, miliseconds: newMilliseconds };
          }
        });
      }, 10);
    }
    return () => clearInterval(interval);
  }, [startTyping]);

  //--------------------------------------------------------------------------------------------------------------------------
  const handleTyping = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!startTyping) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      setWordArray((prev) => prev.slice(0, -1));
      setFontColor((prev) => prev.slice(0, -1));
      return;
    } else if (e.key === "Shift") return;
    const temporalWordArr = [...wordArray, e.key];
    setWordArray((oldValue) => [...oldValue, e.key]);
    if (temporalWordArr.length === word.length) {
      setStartTyping(false);
    }
    return temporalWordArr[temporalWordArr.length - 1] ===
      word[temporalWordArr.length - 1]
      ? setFontColor((prev) => [...prev, "text-green-500"])
      : setFontColor((prev) => [
          ...prev,
          word[temporalWordArr.length - 1].trim().length === 0
            ? "bg-red-500"
            : "text-red-500",
        ]);
  };

  //--------------------------------------------------------------------------------------------------------------------------
  const handleClick = () => {
    setStartTyping(true);
    if (showResults) {
      resetTurn();
    }
  };

  //--------------------------------------------------------------------------------------------------------------------------
  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  //--------------------------------------------------------------------------------------------------------------------------
  const resetTurn = () => {
    setShowResults(false);
    setWordArray([]);
    setFontColor([]);
  };

  //--------------------------------------------------------------------------------------------------------------------------
  return (
    <main className="lg:p-24 mx-auto text-center grid lg:gap-12">
      <h1>Typing Speed Checker</h1>
      {!showResults ? (
        <div
          onKeyDown={(e) => handleTyping(e)}
          tabIndex={0}
          className="focus:outline-none"
          ref={paragraphRef}
        >
          {word.map((element, i) => (
            <span key={i} className={`font-bold ${fontColor[i]}`}>
              {element}
            </span>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          You wrote{" "}
          <span>
            {wordArray
              .join("")
              .split(" ")
              .reduce((acc, element) => (element ? acc + 1 : acc), 0)}
          </span>{" "}
          words
          <p>
            You had:{" "}
            <span>
              {fontColor.reduce(
                (acc, element) =>
                  element === "text-red-500" || element === "bg-red-500"
                    ? acc + 1
                    : acc,
                0
              )}
            </span>{" "}
            errors
          </p>
        </div>
      )}
      <p className="text-2xl">
        <span>{formatNumber(timer.seconds)}</span>:
        <span>{formatNumber(timer.miliseconds)}</span>
      </p>
      <button
        className="bg-blue-500 text-white w-20 h-12 rounded-md font-bold text-lg mx-auto hover:bg-blue-400 disabled:bg-gray-300 disabled:text-gray-800"
        onClick={() => handleClick()}
        disabled={startTyping}
      >
        Start
      </button>
    </main>
  );
}
