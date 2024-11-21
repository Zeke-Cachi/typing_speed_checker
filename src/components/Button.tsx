import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

const Button = ({ title, ...props }: ButtonProps) => {
  const { className } = props;

  return (
    <button
      {...props}
      className={twMerge(
        "bg-blue-500 text-white w-20 h-12 rounded-md font-bold text-lg mx-auto hover:bg-blue-400 disabled:bg-gray-300 disabled:text-gray-800",
        className
      )}
    >
      {title}
    </button>
  );
};

export default Button;
