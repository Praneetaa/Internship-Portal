const FeatureCard = ({ icon: Icon, title, description }) => {
   return (
      <div className="h-full rounded-2xl border border-outline bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
         <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral">
            {Icon && <Icon className="h-6 w-6 text-accent" />}
         </div>
         <h3 className="text-lg font-semibold text-primary">{title}</h3>
         <p className="mt-2 text-sm text-paragraph leading-relaxed">
            {description}
         </p>
      </div>
   );
};

export default FeatureCard;
