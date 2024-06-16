import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Card = ({
  id = '',
  imageSrc = '',
  name = '',
}) => {
  const router = useRouter();

  return (
    <div className="w-full h-[300px] bg-lime-50 rounded-lg">
      <div className="w-full flex justify-center items-center bg-white h-[150px] rounded-t-lg">
        <Image src={imageSrc} width={100} height={100} alt="pokemon image" />
      </div>
      <div className="p-8">
        <p className="text-black text-[14px] font-semibold mb-8">{name}</p>
        <button type="button"className="text-[12px] text-[blue] border-none" onClick={() => router.push(`/pokemon/${id}`)}>Details -&gt;</button>
      </div>
    </div>
  )
}

export default Card;
