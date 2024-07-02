import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Items from '../Components/Items';

function ShowItems() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    sort: 'created_at',
    order: 'desc'
  });

  const [loading, setLoading] = useState(false);
  const [additem, setAdditem] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log(additem);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl || typeFromUrl || sortFromUrl || orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '', type: typeFromUrl || 'all', sort: sortFromUrl || 'created_at', order: orderFromUrl || 'desc',
      });
    }
    console.log(sidebardata);
    const fetchAdditems = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/add/gets?${searchQuery}`)
      const data = await res.json();
      if (data.length > 10) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setAdditem(data);
      setLoading(false);
    };

    fetchAdditems();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }


    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/ShowItems?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfAddeditem = additem.length;
    const startIndex = numberOfAddeditem;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/add/gets?${searchQuery}`);
    const data = await res.json();
    if (data.length < 6) {
      setShowMore(false);
    }
    setAdditem([...additem, ...data]);
  };


  return (
    <>
      <div className='flex flex-col md:flex-row'>
        <div className='bg-slate-300'>
          <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
              <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>
                  Search Term:
                </label>
                <input type='text' id='searchTerm' placeholder='Search...' className='border rounded-lg p-3 w-full  border-blue-700' value={sidebardata.searchTerm} onChange={handleChange} />
              </div>

              <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                  <input type='checkbox' id='all' className='w-5' onChange={handleChange} checked={sidebardata.type === 'all'} />
                  <span>Rent & Sale</span>
                </div>

                <div className='flex gap-2'>
                  <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sidebardata.type === 'rent'} />
                  <span>Rent</span>
                </div>

                <div className='flex gap-2'>
                  <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={sidebardata.type === 'sale'} />
                  <span>Sale</span>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <label className='font-semibold'>Sort:</label>
                <select onChange={handleChange} defaultValue={'created_at_desc'} id='sort_order' className='border rounded-lg p-3 border-blue-800' >
                  <option value='Price_desc'>Price high to low</option>
                  <option value='Price_asc'>Price low to hight</option>
                  <option value='createdAt_desc'>Latest</option>
                  <option value='createdAt_asc'>Oldest</option>
                </select>
              </div>
              <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                Search
              </button>
            </form>
          </div>
        </div>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold border-b p-3 text-black-700 mt-5 text-center'>
            Property results:
          </h1>
          <div className='bg-blue-100'>
          <div className='p-7 flex flex-wrap gap-4'>
           
            {!loading && additem.length === 0 && (
              <p className='text-xl text-slate-700'>No listing found!</p>
            )}
            {loading && (
              <p className='text-xl text-slate-700 text-center w-full'>
                Loading...
              </p>
            )}

            {!loading && additem &&
              additem?.map((addeditem) => (
                <Items key={addeditem._id} addeditem={addeditem} />
              ))}

            {/* {showMore && (
            <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full' >
              Show more
            </button>
          )} */}
          </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default ShowItems