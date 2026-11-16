import { Inbox } from "lucide-react";

const EmptyState = ({ title, description, action, icon = Inbox }) => {
   const Icon = icon;
   return (
      <div className="rounded-xl border border-dashed border-outline bg-white px-6 py-12 text-center">
         <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-neutral">
            <Icon className="h-5 w-5 text-icon" />
         </div>
         <h4 className="mt-4 text-base font-semibold text-text">{title}</h4>
         {description && (
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-label">
               {description}
            </p>
         )}
         {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
   );
};

export default EmptyState;
