interface StatCardProps {
  title: string;
  value: number;
  change: string;
}

const StatCard = ({ title, value, change }: StatCardProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:shadow-[12px_12px_24px_rgba(163,177,198,0.7),-12px_-12px_24px_rgba(255,255,255,0.9)] transition-all duration-300">
      <div className="text-center">
        <p className="text-gray-600 text-sm font-medium mb-4">{title}</p>
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/90 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{value.toLocaleString()}</span>
        </div>
        <p className="text-rose-500 text-sm font-medium">{change}</p>
      </div>
    </div>
  );
};

export default StatCard;