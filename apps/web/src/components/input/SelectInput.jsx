const SelectInput = ({
   label,
   name,
   value,
   onChange,
   options,
   error,
}) => {
   return (
      <label className="block space-y-2 text-sm text-label">
         <span className="font-medium text-primary">{label}</span>
         <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-paragraph outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 ${
               error ? "border-error" : "border-outline"
            }`}
         >
            {options.map((option) => (
               <option key={option.value} value={option.value}>
                  {option.label}
               </option>
            ))}
         </select>
         {error && <span className="text-xs text-error">{error}</span>}
      </label>
   );
};

export default SelectInput;
