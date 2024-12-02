import { KeyboardEvent, useState, useRef, useEffect } from "react";
import paragraphs from "../paragraphs.json";
import Button from "./components/Button";
import ClipLoader from "react-spinners/ClipLoader";

type Language = "english" | "spanish" | null;

export default function App() {
  const paragraphRef = useRef<HTMLDivElement>(null);
  const spanishAccentRef = useRef<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //--------------------------------------------------------------------------------------------------------------------------

  const [word, setWord] = useState<string[]>([]);
  const [wordArray, setWordArray] = useState<string[]>([]);
  const [fontColor, setFontColor] = useState<string[]>([]);
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>(null);
  const [countdown, setCountdown] = useState<number>(4);
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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current!.play();
    }
    if (!startTyping || e.key === "Shift" || e.key === "Control") return;
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
            ? "bg-red-500 w-1 rounded-full"
            : "text-red-500",
        ]);
  };

  //--------------------------------------------------------------------------------------------------------------------------
  const handleCountdown = () => {
    setCountdown((prev) => prev - 1);
    let currentCountdown = countdown - 1;
    const interval = setInterval(() => {
      if (currentCountdown > 1) {
        setCountdown((prev) => prev - 1);
        currentCountdown--;
      } else {
        clearInterval(interval);
        setStartTyping(true);
        setCountdown(4);
      }
    }, 1000);
  };

  //--------------------------------------------------------------------------------------------------------------------------
  const handleClick = () => {
    handleCountdown();
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
    setWord([]);
    setLanguage(null);
  };

  //--------------------------------------------------------------------------------------------------------------------------
  const reduceFontColor = () => {
    return fontColor.reduce(
      (acc, element) =>
        element === "text-red-500" || element === "bg-red-500" ? acc + 1 : acc,
      0
    );
  };

  //--------------------------------------------------------------------------------------------------------------------------
  const reduceWordArray = () => {
    return wordArray
      .join("")
      .split(" ")
      .reduce((acc, element) => (element ? acc + 1 : acc), 0);
  };

  //--------------------------------------------------------------------------------------------------------------------------
  const resultingMessage = () => {
    if (reduceWordArray() <= 30) {
      return (
        <p className="text-red-500 text-xl 2xl:text-3xl font-bold font-nunito">
          You're just getting started, keep going!
        </p>
      );
    } else if (reduceWordArray() > 30 && reduceWordArray() <= 60) {
      return (
        <p className="text-orange-500 text-xl 2xl:text-3xl font-bold font-nunito">
          Nice progress, you're finding your rhythm!
        </p>
      );
    } else if (reduceWordArray() > 60 && reduceWordArray() <= 90) {
      return (
        <p className="text-green-400 text-xl 2xl:text-3xl font-bold font-nunito">
          You're a speedster, your fingers are on fire!
        </p>
      );
    } else if (reduceWordArray() > 90) {
      return (
        <p className="text-green-700 text-xl 2xl:text-3xl font-bold font-nunito">
          You're a legend! Keep blazing that keyboard!
        </p>
      );
    }
  };

  //--------------------------------------------------------------------------------------------------------------------------
  return (
    <main className="md:pt-12 md:px-8 2xl:p-12 mx-auto text-center flex flex-col justify-between 2xl:gap-12 relative h-screen bg-primary_ivory bg-blend-lighten bg-[url(../public/semi_transparent_overlay.png)] bg-cover">
      <audio ref={audioRef}>
        <source src="../public/typewriter_sound.mp3" type="audio/mp3" />
      </audio>
      <div className="flex flex-col justify-evenly min-h-[50%] gap-4 2xl:gap-12 2xl:mt-12">
        <div
          className={`absolute inset-0 bg-black opacity-40 place-items-center ${
            countdown === 4 ? "hidden" : "grid"
          }`}
        >
          <p className="text-[18rem] text-primary_ivory font-bold animate-pulse">
            {countdown}
          </p>
        </div>
        <h1 className="text-5xl 2xl:text-6xl text-primary_charcoal font-nunito">
          Typing Speed Checker
        </h1>
        {!showResults && language === null && (
          <div className="grid gap-12 2xl:mt-12">
            <h2 className="text-xl 2xl:text-2xl text-primary_charcoal font-nunito">
              Choose your language
            </h2>
            <div className="mx-auto w-1/2 flex gap-12">
              <Button
                title="Español"
                onClick={() => setLanguage("spanish")}
                className="h-28 w-48 2xl:h-40 2xl:w-80 text-3xl 2xl:text-5xl"
              ></Button>
              <Button
                title="English"
                onClick={() => setLanguage("english")}
                className="h-28 w-48 2xl:h-40 2xl:w-80 text-3xl 2xl:text-5xl"
              ></Button>
            </div>
          </div>
        )}
        {!showResults && language && (
          <div
            onKeyDown={(e) => handleTyping(e)}
            tabIndex={0}
            className="focus:outline-none px-8 2xl:px-20"
            ref={paragraphRef}
          >
            {word!.length > 0 ? (
              word!.map((element, i) => (
                <span
                  key={i}
                  className={`font-semibold ${fontColor[i]}  text-sm/4 2xl:text-lg 2xl:mt-12 font-geist`}
                >
                  {element}
                </span>
              ))
            ) : (
              <ClipLoader size={70} />
            )}
          </div>
        )}
        {showResults && (
          <div className="2xl:mt-20 grid gap-12 2xl:gap-6">
            <span className=" text-3xl 2xl:text-4xl font-nunito">
              You wrote{" "}
            </span>
            <span className="text-5xl 2xl:text-6xl font-nunito">
              {reduceWordArray()} words
            </span>{" "}
            <p className="text-2xl font-nunito">
              You had: <span>{reduceFontColor()}</span> errors
            </p>
            {resultingMessage()}
            <Button
              title="Go back"
              onClick={() => {
                resetTurn();
              }}
              className="2xl:h-20 2xl:w-32 2xl:text-2xl 2xl:mt-20"
            ></Button>
          </div>
        )}
        {language && !showResults && (
          <>
            <p className="text-xl 2xl:text-4xl 2xl:p-4 outline outline-accent_steel w-16 text-center 2xl:w-32 rounded-md mx-auto">
              <span>{formatNumber(timer.seconds)}</span>:
              <span>{formatNumber(timer.miliseconds)}</span>
            </p>
            <Button
              title="Start"
              onClick={() => handleClick()}
              disabled={startTyping}
              className="2xl:h-20 2xl:w-32 2xl:text-3xl"
            ></Button>
          </>
        )}
      </div>
      <div className="text-sm mb-4 2xl:mb-0 2xl:text-lg font-bold text-nunito">
        Do you like this page? you can donate{" "}
        <span className="underline text-accent_steel font-geist">here</span>
      </div>
    </main>
  );
}
