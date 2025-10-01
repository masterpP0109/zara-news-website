

import { Calendar } from "lucide-react";
import React from 'react';

interface DateDisplayProps {
  date: string | Date;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center text-[10px] font-semibold gap-2 text-gray-700" >
      <Calendar size={18} />
      <span>{formattedDate}</span>
    </div>
  );
};

export default DateDisplay;
