import { KeyboardEvent, useState } from "react";

export default function App() {
  const [word] = useState(
    "hello from the gutter. Im a very sophisticated person which likes to fancy around in big cars and do stuff".split(
      ""
    )
  );
  const [wordArray, setWordArray] = useState<string[]>([]);
  const [fontColor, setFontColor] = useState<string[]>([]);

  const handleTyping = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      setWordArray((prev) => prev.slice(0, -1));
      setFontColor((prev) => prev.slice(0, -1));
      return;
    } else if (e.key === "Shift") return;
    const temporalWordArr = [...wordArray, e.key];
    setWordArray((oldValue) => [...oldValue, e.key]);
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

  return (
    <main className="lg:p-24 mx-auto text-center grid lg:gap-12">
      <h1>Typing Speed Checker</h1>
      <div
        onKeyDown={(e) => handleTyping(e)}
        tabIndex={0}
        className="focus:outline-none"
      >
        {word.map((element, i) => (
          <span key={i} className={`font-bold ${fontColor[i]}`}>
            {element}
          </span>
        ))}
      </div>
      <button className="bg-blue-500 text-white w-20 h-12 rounded-md font-bold text-lg mx-auto">
        Start
      </button>
    </main>
  );
}
