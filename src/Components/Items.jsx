import React from 'react'
import { Link } from 'react-router-dom'

function Items({ addeditem }) {
  return (
    <>
      <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listadded/${addeditem._id}`}>
          <img
            src={
              addeditem.imageurls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
          />
          <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='truncate text-lg font-semibold text-slate-700'>{addeditem.name}</p>
            <div className='flex items-center gap-1'>
              <p className='text-sm text-gray-600 truncate w-full'>{addeditem.address} </p>
            </div>
            <p className='text-sm text-gray-600 line-clamp-2'> {addeditem.description}</p>
            <p className='text-slate-500 mt-2 font-semibold '>
            ₹ {addeditem.offer ? addeditem.tPrice.toLocaleString() : addeditem.Price.toLocaleString()} {addeditem.type === 'rent' && ' / month'}
            </p>
            <div className='text-slate-700 flex gap-4'>
              <div className='font-bold text-xs'>
                {addeditem.bedrooms > 1 ? `${addeditem.bedrooms} beds ` : `${addeditem.bedrooms} bed `}
              </div>
              <div className='font-bold text-xs'>
                {addeditem.bathrooms > 1 ? `${addeditem.bathrooms} baths ` : `${addeditem.bathrooms} bath `}
              </div>
            </div>
          </div>
        </Link>
      </div>

    </>
  )
}

export default Items