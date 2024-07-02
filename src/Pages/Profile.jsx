
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../FireBase';
import { updateUserStart, updateUserFailure, updateUserSuccess } from '../Redux/UserSlice';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../Redux/UserSlice';
import { logOutUserStart,logOutUserFailure,logOutUserSuccess } from '../Redux/UserSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState("")
  console.log(file);
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})
  const [filePerc, setFilePerc] = useState(0)
  const dispatch = useDispatch()
  const [update, setUptate] = useState(false)
  const [useradditems,setuserAddItems]=useState([])
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }

  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    console.log(file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
      (error) => {
        setFileError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }))
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        toast.warning("User update Error")
        return
      }

      dispatch(updateUserSuccess(data))
      toast.success("User update successfully")
      setUptate(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.warning("Delete Error")
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Delete successfully")
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
     
    }
  }


  const handleLogout = async () => {
    try {
      dispatch(logOutUserStart())
      const res = await fetch('/api/auth/logout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(logOutUserFailure(data.message))
        return;
      }
      dispatch(logOutUserSuccess(data))
      toast.success("Logout successfully")
    } catch (error) {
      dispatch(logOutUserFailure(error.message))
    }
  };
 const handleShowItems=async()=>{
  const res =await fetch(`/api/user/addeditems/${currentUser._id}`);
  const data =await res.json()
  setuserAddItems(data);
  
 }

 const handleDeleteItem = async (addeditemId) => {
  try {
    const res = await fetch(`/api/add/delete/${addeditemId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success === false) {
      console.log(data.message);
      toast.warning("Delete Error")
      return;
    }

    setuserAddItems((prev) =>
      prev.filter((addeditem) =>addeditem._id !== addeditemId)
    );
    toast.success("Delete successfully")
  } catch (error) {
    console.log(error.message);
  }
};




  return (
    <>
      <div className='bg-slate-600 w-full h-full' style={{height:'190vh'}}>
        <div className=' p-2 max-w-lg mx-auto w-600 gap-4 borser '>
        <div className='border bg-white my-3 p-3 rounded-lg  bg-blend-saturation'>
          <h1 className=' text-3xl font-bold text-center my-2'>Profile</h1>

          <form onSubmit={handleUpdateUser} className=' flex  flex-col gap-2' >
            <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
            <img className=' rounded-full h-24 w-24 object-cover self-center mt-2 border  border-blue-500' onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" />
            <p className='text-sm self-center'>
              {fileError ? (
                <span className='text-red-700'>
                  Error Image upload (image must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-green-700'>Image successfully uploaded!</span>
              ) : (
                ''
              )}
            </p>
            <input className=' border  border-blue-500 rounded-lg p-4' type="text" placeholder='username' defaultValue={currentUser.username} id='username' onChange={handleChange} />
            <input className=' border  border-blue-500 rounded-lg p-4' type="text" placeholder='email' defaultValue={currentUser.email} id='email' onChange={handleChange} />
            <input className=' border  border-blue-500 rounded-lg p-4' type="text" placeholder='password' id='password' onChange={handleChange} />
            <button className='bg-green-600 text-white rounded-lg hover:opacity-50 p-3'>Update</button>
            <Link to={'/addproperty'} className='bg-slate-500 text-white rounded-lg p-3 text-center' >ADD ITEMS</Link>
          </form>
          <div className='flex justify-between mt-5'>
            <button className=' bg-red-600 text-white rounded-lg p-3' onClick={handleDelete} >Delete Account</button>
            <button className=' bg-red-600 text-white rounded-lg p-3' onClick={handleLogout} >Log Out</button>
          </div>
          <div>
            <button className='text-green-500 w-full' onClick={handleShowItems}>show added items</button>
            {useradditems&& useradditems.length > 0 && (
         <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {useradditems.map((addeditems) => (
            <div key={addeditems._id} className='border rounded-lg borser border-blue-500 p-3 flex justify-between items-center gap-4' >
              <Link to={`/addeditems/${addeditems._id}`}>
                <img src={addeditems.imageurls[0]} alt='listing cover'  className='h-16 w-16 object-contain' />
              </Link>
              <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1'  to={`/addeditems/${addeditems._id}`} >
                <p>{addeditems.name}</p>
              </Link>
              <div className='flex flex-col item-center gap-2'>
                 <button  onClick={()=>handleDeleteItem(addeditems._id)} className='text-white bg-red-700 rounded-lg p-1 uppercase'>
                  Delete
                </button> 
                <Link to={`/update/${addeditems._id}`}>
                <button  className='text-white bg-green-700 p-1 rounded-lg'>Update  </button> 
                </Link>

              </div>
            </div>
          ))}
          </div>
         )}
          </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile