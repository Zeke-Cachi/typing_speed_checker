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
        "bg-accent_steel text-primary_ivory w-20 h-12 rounded-md font-bold text-lg mx-auto hover:bg-accent_sky disabled:bg-gray-300 disabled:text-accent_sky",
        className
      )}
    >
      {title}
    </button>
  );
};

export default Button;
