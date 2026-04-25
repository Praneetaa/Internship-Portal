import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const RoleCard = ({
   title,
   description,
   bullets = [],
   actionLabel,
   actionTo,
   icon: Icon,
}) => {
   return (
      <div className="card-lift flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-outline/60 bg-white shadow-sm">
         <div className="p-7">
            <div className="flex items-center gap-3">
               <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                  {Icon && <Icon className="h-5 w-5 text-primary" />}
               </span>
               <h3 className="text-xl font-bold text-text">{title}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-paragraph">
               {description}
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
               {bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                     <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" />
                     <span className="text-label">{item}</span>
                  </li>
               ))}
            </ul>
         </div>
         <div className="border-t border-outline/60 px-7 py-4">
            <Link
               to={actionTo}
               className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3 hover:text-secondary"
            >
               {actionLabel}
               <ArrowRight className="h-4 w-4" />
            </Link>
         </div>
      </div>
   );
};

export default RoleCard;
