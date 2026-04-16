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
      <div className="flex h-full flex-col justify-between rounded-3xl border border-outline bg-white/90 p-6 shadow-sm">
         <div>
            <div className="flex items-center gap-3">
               <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral">
                  {Icon && <Icon className="h-5 w-5 text-primary" />}
               </span>
               <h3 className="text-xl font-semibold text-primary">{title}</h3>
            </div>
            <p className="mt-4 text-sm text-paragraph leading-relaxed">
               {description}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-label">
               {bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                     <span className="h-2 w-2 rounded-full bg-accent" />
                     <span>{item}</span>
                  </li>
               ))}
            </ul>
         </div>
         <Link
            to={actionTo}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
         >
            {actionLabel}
         </Link>
      </div>
   );
};

export default RoleCard;
