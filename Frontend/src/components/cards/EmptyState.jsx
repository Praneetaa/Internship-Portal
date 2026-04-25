import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
   return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline bg-white/60 px-6 py-14 text-center">
         <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 text-primary">
            <Icon className="h-7 w-7" />
         </span>
         <h4 className="text-base font-semibold text-text">{title}</h4>
         <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-label">
            {description}
         </p>
         {action && <div className="mt-5">{action}</div>}
      </div>
   );
};

export default EmptyState;
