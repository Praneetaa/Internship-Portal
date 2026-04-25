const TextInput = ({
   label,
   name,
   value,
   onChange,
   placeholder,
   type = "text",
   error,
}) => {
   return (
      <div className="flex flex-col gap-1.5">
         {label && (
            <label
               htmlFor={name}
               className="text-xs font-semibold uppercase tracking-wide text-label"
            >
               {label}
            </label>
         )}
         <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-paragraph outline-none transition-all placeholder:text-icon focus:border-accent focus:ring-2 focus:ring-accent/20 ${
               error
                  ? "border-error/60 focus:border-error focus:ring-error/20"
                  : "border-outline hover:border-muted"
            }`}
         />
         {error && (
            <span className="flex items-center gap-1 text-xs font-medium text-error">
               {error}
            </span>
         )}
      </div>
   );
};

export default TextInput;
