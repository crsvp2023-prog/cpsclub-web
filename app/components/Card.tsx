interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
