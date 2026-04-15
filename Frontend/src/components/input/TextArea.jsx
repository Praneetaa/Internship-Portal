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
      <label className="block space-y-2 text-sm text-label">
         <span className="font-medium text-primary">{label}</span>
         <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-paragraph outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 ${
               error ? "border-error" : "border-outline"
            }`}
         />
         {error && <span className="text-xs text-error">{error}</span>}
      </label>
   );
};

export default TextArea;
