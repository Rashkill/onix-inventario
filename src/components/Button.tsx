const Button: React.FC<
  { text?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ text, ...props }) => {
  return (
    <button
      className={`onix-button${props.disabled ? " disabled" : ""}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
