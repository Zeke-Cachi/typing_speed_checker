import { KeyboardEvent, useState, useRef, useEffect } from "react";
import paragraphs from "../paragraphs.json";

type Language = "english" | "spanish" | null;

export default function App() {
  const paragraphRef = useRef<HTMLDivElement>(null);
  const spanishAccentRef = useRef<string>("");

  //--------------------------------------------------------------------------------------------------------------------------

  const [word, setWord] = useState<string[]>([]);
  const [wordArray, setWordArray] = useState<string[]>([]);
  const [fontColor, setFontColor] = useState<string[]>([]);
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>(null);
  const [timer, setTimer] = useState<{ seconds: number; miliseconds: number }>({
    seconds: 0,
    miliseconds: 0,
  });

  //-------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const randomIndex: number = Math.floor(
      Math.random() *
        (language === "english"
          ? paragraphs.english.length
          : paragraphs.spanish.length)
    );
    if (language) {
      return language === "english"
        ? setWord(paragraphs.english[randomIndex].split(""))
        : setWord(paragraphs.spanish[randomIndex].split(""));
    }
  }, [language]);

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
    if (!startTyping || e.key === "Shift") return;
    if (e.key === "Dead") {
      spanishAccentRef.current = "Dead";
      return;
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      setWordArray((prev) => prev.slice(0, -1));
      setFontColor((prev) => prev.slice(0, -1));
      return;
    }
    let accentedLetter: string = "";
    if (
      spanishAccentRef.current === "Dead" &&
      ["a", "e", "i", "o", "u"].includes(e.key)
    ) {
      switch (e.key) {
        case "a":
          accentedLetter = "á";
          break;
        case "e":
          accentedLetter = "é";
          break;
        case "i":
          accentedLetter = "í";
          break;
        case "o":
          accentedLetter = "ó";
          break;
        case "u":
          accentedLetter = "ú";
          break;
      }
    }
    const temporalWordArr = [
      ...wordArray,
      spanishAccentRef.current === "Dead"
        ? accentedLetter === ""
          ? e.key
          : accentedLetter
        : e.code === "Minus"
        ? "’"
        : e.key,
    ];
    setWordArray((oldValue) => [
      ...oldValue,
      spanishAccentRef.current === "Dead"
        ? accentedLetter === ""
          ? e.key
          : accentedLetter
        : e.code === "Minus"
        ? "’"
        : e.key,
    ]);
    spanishAccentRef.current = "";
    if (temporalWordArr.length === word!.length) {
      setStartTyping(false);
    }
    return temporalWordArr[temporalWordArr.length - 1] ===
      word![temporalWordArr.length - 1]
      ? setFontColor((prev) => [...prev, "text-green-500"])
      : setFontColor((prev) => [
          ...prev,
          word![temporalWordArr.length - 1].trim().length === 0
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
      {!showResults && language === null && (
        <div className="grid gap-12">
          <h2>Choose your language</h2>
          <div className="mx-auto w-1/2 flex gap-12">
            <button
              className="bg-blue-500 text-white w-20 h-12 rounded-md font-bold text-lg mx-auto hover:bg-blue-400 disabled:bg-gray-300 disabled:text-gray-800"
              onClick={() => setLanguage("spanish")}
            >
              Español
            </button>
            <button
              className="bg-blue-500 text-white w-20 h-12 rounded-md font-bold text-lg mx-auto hover:bg-blue-400 disabled:bg-gray-300 disabled:text-gray-800"
              onClick={() => setLanguage("english")}
            >
              English
            </button>
          </div>
        </div>
      )}
      {!showResults && language !== null && (
        <div
          onKeyDown={(e) => handleTyping(e)}
          tabIndex={0}
          className="focus:outline-none"
          ref={paragraphRef}
        >
          {word!.length > 0 &&
            word!.map((element, i) => (
              <span key={i} className={`font-bold ${fontColor[i]}`}>
                {element}
              </span>
            ))}
        </div>
      )}
      {showResults && (
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
