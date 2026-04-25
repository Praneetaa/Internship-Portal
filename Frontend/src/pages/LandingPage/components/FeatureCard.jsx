const FeatureCard = ({ icon: Icon, title, description }) => {
   return (
      <div className="card-lift group flex flex-col gap-4 rounded-2xl border border-outline/60 bg-white p-6 shadow-sm">
         <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
         </span>
         <div>
            <h3 className="text-base font-bold text-text">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-paragraph">
               {description}
            </p>
         </div>
      </div>
   );
};

export default FeatureCard;
