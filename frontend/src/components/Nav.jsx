import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";

function Nav() {
    return (
        <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible'>
            <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>Vingo</h1>
            
            <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex'>
                {/* Location Section */}
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                    <FaLocationDot size={25} className="text-[#ff4d2d]"/>
                    <div className='w-[80%] truncate text-gray-600'>jhansi</div>
                </div>

                {/* Search Section */}
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className='text-[#ff4d2d]' />
                    <input 
                        type="text" 
                        placeholder='search delicious food...' 
                        className='px-10 text-gray-700 outline-0 w-full'
                    />
                </div>
            </div>
        </div>
    )
}

export default Nav