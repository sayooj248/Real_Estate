import { useState } from 'react';
import { app } from '../FireBase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useSelector ,} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddProperty() {
  const { currentUser } = useSelector((state) => state.user)
  const [files, setFiles] = useState([])
  const [error,setError]=useState(false)
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()
  const [formData, setFormData] = useState({ imageurls: [],
    name:'', description:'', address:'', Price:500, bathrooms:1, bedrooms:1 , furnished:false, parking:false, type:'rent'

   });


  console.log(formData);


  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length < 7) {
      const promises = []
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]))
      }
      Promise.all(promises).then((urls) => {
        setFormData({ ...formData, imageurls: formData.imageurls.concat(urls) })
      });
    }
  };

  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      );
    })
  }
   const handleDeleteImage=(index)=>{
    setFormData({
    ...formData,imageurls:formData.imageurls.filter((_,i)=> i !== index),
  })
   }

   const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id })
    }

    if ( e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'price') {
      setFormData({ ...formData, [e.target.id]: e.target.checked })
    }

    if ( e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({...formData, [e.target.id]: e.target.value })
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.imageurls.length < 1)
        return setError('You must upload at least one image')
      setLoading(true)
      setError(false);
      const res = await fetch('/api/add/additem', { method: 'POST', headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef:currentUser._id })
      });
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        setError(data.message)
        toast.warning("property adding error")
      }
      navigate(`/listadded/${data._id}`);
      toast.success("property add successfully")
    } catch (error) {
      setError(error.message);
      setLoading(false)
      
    }
  }

  return (
    <>

<div className='bg-slate-700' style={{height:"120vh"}}>
      <main className='p-3  max-w-4xl mx-auto '>
      <div className='border bg-white my-5 p-5 rounded-lg  bg-blend-saturation'>
        <h1 className='text-3xl font-bold text-center my-4'> ADD PROPERTY </h1>
        <form className='flex flex-col sm:flex-row  gap-4 p-2' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 flex-1'>
            <input type='text' placeholder='Name' className='border p-3 rounded-lg boder border-blue-500  ' id='name' maxLength='62' minLength='' required onChange={handleChange} value={formData.name}/>
            <textarea type='text' placeholder='Description' className='border p-3 rounded-lg boder border-blue-500 ' id='description'  required onChange={handleChange} value={formData.description} />
            <input type='text' placeholder='Address' className='border p-3 rounded-lg boder border-blue-500 ' id='address' required onChange={handleChange} value={formData.address} />

            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
                <input type='checkbox' id='sale' className='w-5 border border-blue-500'   onChange={handleChange} checked={formData.type=='sale'} /> <span>Sell</span>
              </div>

              <div className='flex gap-2'>
                <input type='checkbox' id='rent' className='w-5 border border-blue-500'onChange={handleChange} checked={formData.type=='rent'}  /> <span>Rent</span>
              </div>

              <div className='flex gap-2'>
                <input type='checkbox' id='parking' className='w-5 border border-blue-500' onChange={handleChange} checked={formData.parking} /> <span>Parking spot</span>
              </div>

              <div className='flex gap-2'>
                <input type='checkbox' id='furnished' className='w-5 border border-blue-500' onChange={handleChange} checked={formData.furnished}  /> <span>Furnished</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                <input type='number' id='bedrooms' max='10' min='1' className='p-3 border border-blue-500 rounded-lg' onChange={handleChange} value={formData.bedrooms}  />
                <p>Beds</p>
              </div>

              <div className='flex items-center gap-2'>
                <input type='number' id='bathrooms' max='10' min='1' className='p-3 border  border-blue-500 rounded-lg'onChange={handleChange} value={formData.bathrooms}  />
                <p>Baths</p>
              </div>

              <div className='flex items-center gap-2'>
                <input type='number' id='Price' max='100000' min='500' className='p-3 border border-blue-500 rounded-lg' onChange={handleChange} value={formData.Price}   />
                <div className='flex flex-col items-center'>
                  <p>price</p><span className='text-xs'>(₹ / month)</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
              <span className='font-normal text-yellow-600 ml-2'>The first image will be the cover (max 4)</span>
            </p>

            <div className='flex gap-4'>
              <input className='p-3 border border-blue-500  rounded w-full' type='file' id='images' accept='image/*' multiple onChange={(e) => setFiles(e.target.files)} />
              <button onClick={handleImageUpload}  type='button' className=' p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' >
                Add image
              </button>
            </div>
          {
           formData.imageurls.length > 0 && formData.imageurls.map((url,index)=>(
              <div key={url} className='flex items-center justify-between'>
                <img src={url} alt="img"  className='w-20 h-20 object-contain rounded-lg'/>
                <button className='bg-red-500 text-white rounded-lg p-1' onClick={()=>handleDeleteImage(index)} >DELETE</button>
              </div>
           ))

           }
          
            {/* <div className='flex justify-between p-3 border items-center rounded-lg  border-blue-500' >
                          <img alt='listing image' className='w-20 h-20 object-contain rounded-lg border border-blue-500' />
                          <div>
                            <button type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75 border border-red-500'>
                              Delete
                            </button>
                          </div>
                        </div> */}
            <button className='p-3 bg-green-600 rounded-lg hover:opacity-90'>add </button>
          </div>
        </form>
        </div>
      </main>
      </div>

    </>
  )
}

export default AddProperty