const TextArea = ({
   label,
   name,
   value,
   onChange,
   placeholder,
   rows = 4,
   error,
}) => {
   return (
      <label className="block space-y-1.5 text-sm text-label">
         <span className="font-medium text-text">{label}</span>
         <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-text placeholder:text-icon outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 ${
               error ? "border-error" : "border-outline"
            }`}
         />
         {error && <span className="text-xs text-error">{error}</span>}
      </label>
   );
};

export default TextArea;
