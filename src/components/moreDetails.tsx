import React from "react";
import Image from "next/image";

interface CardProps {
  image: string;
  title: string;
  style?: React.CSSProperties;
}

const MoreDetails = ({image, title, style} : CardProps ) => {
  return (
    <div className="flex w-full h-[60px] relative  items-center " style={style}>
      <Image
         src={image}
         alt={title}
         className="object-cover"
         fill
         priority
      />
    </div>
  );
};

export default MoreDetails;
