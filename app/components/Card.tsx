interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <h3 className="font-semibold text-xl text-[var(--color-primary)]">{title}</h3>
      <p className="mt-2 text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}
