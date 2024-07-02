import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { useSelector } from 'react-redux'
import { Navigation } from 'swiper/modules'
import Contact from '../Components/Contact'
import 'swiper/css/bundle'
function Listadded() {
  SwiperCore.use([Navigation]);
  const [addeditem, setaddeditem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const [contact,setContact]=useState(false)
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAdditem = async () => {

      try {
        setLoading(true);
        const res = await fetch(`/api/Add/get/${params.addeditemId}`)
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setaddeditem(data);
        setLoading(false)
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchAdditem();
  }, [params.addeditemId]);
  return (
    <>
      <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && (
          <p className='text-center my-7 text-2xl'>Something went wrong!</p>
        )}
        {addeditem && !loading && !error && (
          <div>
            <Swiper navigation> {addeditem.imageurls.map((url) => ( <SwiperSlide key={url}>
                  <div className='h-[400px]' style={{   background: `url(${url}) center no-repeat`,  backgroundSize: 'cover', }} > 
          </div>
               </SwiperSlide>
              ))}
            </Swiper>
            <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
              <p className='text-2xl font-semibold'>
                {addeditem.name} - ₹{' '} {addeditem.Price} {addeditem.type === 'rent' && ' / month'}
              </p>

              <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                <i className="fa-solid fa-location-dot fa-bounce fa-2xl" style={{color:'#c40303'}}></i>
                {addeditem.address}
              </p>

              <div className='flex gap-4'>
                  <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  {addeditem.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
              </div>

              <p className='text-slate-800'>
                <span className='font-bold text-black'>Description - </span>
                {addeditem.description}
              </p>

              <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <i className="fa-solid fa-bed fa-2xl"></i>
                  {addeditem.bedrooms > 1 ? `${addeditem.bedrooms} beds ` : `${addeditem.bedrooms} bed `}
                </li>

                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <i className="fa-solid fa-bath fa-2xl " style={{color:'#63E6BE'}}></i>
                  {addeditem.bathrooms > 1 ? `${addeditem.bathrooms} baths ` : `${addeditem.bathrooms} bath `}
                </li>

                <li className='flex items-center gap-1 whitespace-nowrap '>
                <i class="fa-solid fa-car-side fa-2xl"></i>
                  {addeditem.parking ? 'Parking spot' : 'No Parking'}
                </li>

                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <i className="fa-solid fa-house-chimney fa-2xl" style={{color:'#29af0e'}}></i>
                  {addeditem.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>
              {currentUser && addeditem.userRef !== currentUser._id &&  !contact &&(
                <button className='bg-green-400 text-white rounded-lg p-2 my-4' onClick={()=>setContact(true)}>Contact Landlord</button>
              )}
              {contact && <Contact addeditem={addeditem} />}
             
            </div>
          </div>
        )}
      </main>

    </>
  )
}

export default Listadded