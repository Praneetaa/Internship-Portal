const EmptyState = ({ title, description, action }) => {
   return (
      <div className="rounded-2xl border border-outline bg-white/80 p-8 text-center">
         <h4 className="text-lg font-semibold text-primary">{title}</h4>
         <p className="mt-2 text-sm text-label">{description}</p>
         {action && <div className="mt-4 flex justify-center">{action}</div>}
      </div>
   );
};

export default EmptyState;
