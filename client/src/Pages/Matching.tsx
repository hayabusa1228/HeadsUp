import React from 'react'
import { Link } from "react-router-dom";
import Header from '../Components/Header.tsx';

const Matching: React.FC = () => {
  return (
<div className='bg-home-bg-img h-screen bg-cover bg-opacity-10'>
<Header/>
<div className='flex items-center justify-center text-4xl bg-gray-900 text-white border-4 border-white border-double p-3'>対戦相手を探しています</div>
</div>
  )
}

export default Matching