import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, orderBy, deleteField } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [propheticFocus, setPropheticFocus] = useState({ title: '', text: '' });
  const [contactInfo, setContactInfo] = useState({ paymentMethods: [{ name: '', code: '' }] });
  const [users, setUsers] = useState<any[]>([]);
  
  const [events, setEvents] = useState<any[]>([]);
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
      fetchUsers();
      fetchData('events', setEvents);
      fetchData('testimonies', setTestimonies);
      fetchData('gallery', setGallery);
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    const focusRef = doc(db, 'settings', 'propheticFocus');
    const focusSnap = await getDoc(focusRef);
    if (focusSnap.exists()) {
      setPropheticFocus(focusSnap.data() as any);
    }

    const contactRef = doc(db, 'settings', 'contactInfo');
    const contactSnap = await getDoc(contactRef);
    if (contactSnap.exists()) {
      setContactInfo(contactSnap.data() as any);
    }
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
  };

  const fetchData = async (collectionName: string, setter: any) => {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setter(data);
  };

  const handleSaveFocus = async () => {
    if (!propheticFocus.title || !propheticFocus.text) {
      toast.error('Please fill in both title and description.');
      return;
    }
    await setDoc(doc(db, 'settings', 'propheticFocus'), {
      title: propheticFocus.title,
      text: propheticFocus.text,
      updatedAt: new Date().toISOString()
    });
    toast.success('Prophetic Focus saved successfully!');
  };

  const handleSaveContact = async () => {
    const validMethods = contactInfo.paymentMethods.filter(m => m.name && m.code);
    if (validMethods.length === 0 && contactInfo.paymentMethods.length > 0) {
      toast.error('Please provide at least one valid payment method with both name and code.');
      return;
    }
    await setDoc(doc(db, 'settings', 'contactInfo'), {
      paymentMethods: validMethods.map(m => ({ name: m.name, code: m.code })),
      updatedAt: new Date().toISOString()
    });
    toast.success('Contact Info saved successfully!');
  };

  const handlePromoteUser = async (userId: string) => {
    const userToPromote = users.find(u => u.id === userId);
    if (!userToPromote) return;
    
    await updateDoc(doc(db, 'users', userId), { role: 'admin' });
    fetchUsers();
    toast.success('User promoted to admin successfully!');
  };

  const handleDemoteUser = async (userId: string) => {
    const userToDemote = users.find(u => u.id === userId);
    if (!userToDemote) return;
    
    if (user?.uid === userId) {
      toast.error('You cannot demote yourself.');
      return;
    }
    
    await updateDoc(doc(db, 'users', userId), { role: 'user' });
    fetchUsers();
    toast.success('Admin demoted to user successfully!');
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleAddNew = () => {
    setEditingItem({ isNew: true });
    if (activeTab === 'events') setFormData({ date: '', text: '', img: '' });
    if (activeTab === 'testimonies') setFormData({ title: '', name: '', text: '', img: '' });
    if (activeTab === 'gallery') setFormData({ type: 'image', url: '', description: '' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      try {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formDataObj,
        });

        const data = await response.json();
        if (data.secure_url) {
          setFormData({ ...formData, [fieldName]: data.secure_url });
          toast.success('Image uploaded successfully!');
        } else {
          throw new Error(data.error?.message || 'Upload failed');
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary: ", error);
        toast.error('Error uploading image. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      // Fallback to Base64
      if (file.size > 800 * 1024) {
        toast.error('Image is too large. Please configure Cloudinary for larger images, or use an image smaller than 800KB.');
        setUploading(false);
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormData({ ...formData, [fieldName]: base64String });
          toast.success('Image processed successfully!');
          setUploading(false);
        };
        reader.onerror = () => {
          toast.error('Error reading file. Please try again.');
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image: ", error);
        toast.error('Error processing image. Please try again.');
        setUploading(false);
      }
    }
  };

  const handleSaveItem = async () => {
    try {
      const collectionName = activeTab;
      let dataToSave: any = {};
      
      // Client-side validation and strict payload construction
      if (activeTab === 'events') {
        if (!formData.text || !formData.date) {
          toast.error('Please fill in all required fields (Date and Description).');
          return;
        }
        dataToSave = {
          text: formData.text,
          date: formData.date,
          createdAt: formData.createdAt || editingItem.createdAt || new Date().toISOString()
        };
        if (formData.img) dataToSave.img = formData.img;
      }
      else if (activeTab === 'testimonies') {
        if (!formData.title || !formData.name || !formData.text) {
          toast.error('Please fill in all required fields (Title, Name, and Text).');
          return;
        }
        dataToSave = {
          title: formData.title,
          name: formData.name,
          text: formData.text,
          createdAt: formData.createdAt || editingItem.createdAt || new Date().toISOString()
        };
        if (formData.img) dataToSave.img = formData.img;
      }
      else if (activeTab === 'gallery') {
        if (!formData.url) {
          toast.error('Please provide a media URL.');
          return;
        }
        dataToSave = {
          type: formData.type || 'image',
          url: formData.url,
          description: formData.description || '',
          createdAt: formData.createdAt || editingItem.createdAt || new Date().toISOString()
        };
      }
      
      if (editingItem.isNew) {
        await addDoc(collection(db, collectionName), dataToSave);
        toast.success(`${collectionName.slice(0, -1)} added successfully!`);
      } else {
        // Use setDoc to completely overwrite the document, removing any old extraneous fields
        await setDoc(doc(db, collectionName, editingItem.id), dataToSave);
        toast.success(`${collectionName.slice(0, -1)} updated successfully!`);
      }
      
      handleCancelEdit();
      if (activeTab === 'events') fetchData('events', setEvents);
      if (activeTab === 'testimonies') fetchData('testimonies', setTestimonies);
      if (activeTab === 'gallery') fetchData('gallery', setGallery);
    } catch (error) {
      console.error("Error saving item: ", error);
      toast.error('Error saving item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string, collectionName: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success(`${collectionName.slice(0, -1)} deleted successfully!`);
      if (collectionName === 'events') fetchData('events', setEvents);
      if (collectionName === 'testimonies') fetchData('testimonies', setTestimonies);
      if (collectionName === 'gallery') fetchData('gallery', setGallery);
    } catch (error) {
      console.error("Error deleting item: ", error);
      toast.error('Error deleting item. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading || !isAdmin) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 max-w-6xl">
      <h1 className="font-serif text-5xl mb-12 text-stone-900">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-12 border-b border-stone-200 pb-4">
        {['events', 'testimonies', 'gallery', 'settings', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); handleCancelEdit(); }}
            className={`px-6 py-2 rounded-full font-medium tracking-wide uppercase text-sm transition-colors ${activeTab === tab ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-stone-100">
        {activeTab === 'settings' && (
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-3xl mb-6 text-stone-800">Prophetic Focus</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={propheticFocus.title}
                  onChange={e => setPropheticFocus({ ...propheticFocus, title: e.target.value })}
                  placeholder="Title (e.g., 2025 is my new era year)"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none"
                />
                <textarea
                  value={propheticFocus.text}
                  onChange={e => setPropheticFocus({ ...propheticFocus, text: e.target.value })}
                  placeholder="Description"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none resize-none"
                />
                <button onClick={handleSaveFocus} className="px-6 py-3 bg-nobel-gold text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Save Prophetic Focus
                </button>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-12">
              <h2 className="font-serif text-3xl mb-6 text-stone-800">Offerings Payment Methods</h2>
              <div className="space-y-4">
                {contactInfo.paymentMethods.map((method, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={method.name}
                      onChange={e => {
                        const newMethods = [...contactInfo.paymentMethods];
                        newMethods[index].name = e.target.value;
                        setContactInfo({ ...contactInfo, paymentMethods: newMethods });
                      }}
                      placeholder="Name (e.g., Orange Money)"
                      className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none"
                    />
                    <input
                      type="text"
                      value={method.code}
                      onChange={e => {
                        const newMethods = [...contactInfo.paymentMethods];
                        newMethods[index].code = e.target.value;
                        setContactInfo({ ...contactInfo, paymentMethods: newMethods });
                      }}
                      placeholder="Code (e.g., *150*...)"
                      className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none"
                    />
                    <button
                      onClick={() => {
                        const newMethods = contactInfo.paymentMethods.filter((_, i) => i !== index);
                        setContactInfo({ ...contactInfo, paymentMethods: newMethods });
                      }}
                      className="w-full sm:w-auto px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setContactInfo({ ...contactInfo, paymentMethods: [...contactInfo.paymentMethods, { name: '', code: '' }] })}
                  className="px-6 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-medium"
                >
                  Add Method
                </button>
                <div className="mt-4">
                  <button onClick={handleSaveContact} className="px-6 py-3 bg-nobel-gold text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Save Payment Methods
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="font-serif text-3xl mb-6 text-stone-800">Manage Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="py-4 px-6 font-medium text-stone-500 uppercase tracking-wider text-sm">Email</th>
                    <th className="py-4 px-6 font-medium text-stone-500 uppercase tracking-wider text-sm">Role</th>
                    <th className="py-4 px-6 font-medium text-stone-500 uppercase tracking-wider text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-4 px-6 text-stone-800">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-nobel-gold/20 text-nobel-gold' : 'bg-stone-200 text-stone-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {u.role !== 'admin' ? (
                          <button onClick={() => handlePromoteUser(u.id)} className="text-sm text-nobel-gold hover:underline font-medium">
                            Promote to Admin
                          </button>
                        ) : (
                          user?.uid !== u.id && (
                            <button onClick={() => handleDemoteUser(u.id)} className="text-sm text-red-600 hover:underline font-medium">
                              Demote to User
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {['events', 'testimonies', 'gallery'].includes(activeTab) && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-3xl text-stone-800 capitalize">Manage {activeTab}</h2>
              {!editingItem && (
                <button onClick={handleAddNew} className="px-6 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors font-medium tracking-wide text-sm">
                  Add New
                </button>
              )}
            </div>

            {editingItem ? (
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 mb-8">
                <h3 className="font-serif text-2xl mb-4 text-stone-800">{editingItem.isNew ? 'Add New' : 'Edit'} Item</h3>
                <div className="space-y-4">
                  {activeTab === 'events' && (
                    <>
                      <input type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none" />
                      <textarea value={formData.text || ''} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="Event Description" rows={4} className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none resize-none" />
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <input type="text" value={formData.img || ''} onChange={e => setFormData({...formData, img: e.target.value})} placeholder="Image URL (optional)" className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none" />
                        <span className="text-stone-500 hidden sm:inline">OR</span>
                        <label className="cursor-pointer text-center px-4 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-medium whitespace-nowrap w-full sm:w-auto">
                          {uploading ? 'Uploading...' : 'Upload Image'}
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'img')} disabled={uploading} />
                        </label>
                      </div>
                      {formData.img && <img src={formData.img} alt="Preview" className="h-32 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />}
                    </>
                  )}
                  {activeTab === 'testimonies' && (
                    <>
                      <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Testimony Title" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none" />
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Person's Name" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none" />
                      <textarea value={formData.text || ''} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="Testimony Text" rows={4} className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none resize-none" />
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <input type="text" value={formData.img || ''} onChange={e => setFormData({...formData, img: e.target.value})} placeholder="Image URL (optional)" className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none" />
                        <span className="text-stone-500 hidden sm:inline">OR</span>
                        <label className="cursor-pointer text-center px-4 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-medium whitespace-nowrap w-full sm:w-auto">
                          {uploading ? 'Uploading...' : 'Upload Image'}
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'img')} disabled={uploading} />
                        </label>
                      </div>
                      {formData.img && <img src={formData.img} alt="Preview" className="h-32 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />}
                    </>
                  )}
                  {activeTab === 'gallery' && (
                    <>
                      <select value={formData.type || 'image'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none bg-white">
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <input type="text" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="Media URL" className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none" />
                        {formData.type === 'image' && (
                          <>
                            <span className="text-stone-500 hidden sm:inline">OR</span>
                            <label className="cursor-pointer text-center px-4 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-medium whitespace-nowrap w-full sm:w-auto">
                              {uploading ? 'Uploading...' : 'Upload Image'}
                              <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'url')} disabled={uploading} />
                            </label>
                          </>
                        )}
                      </div>
                      {formData.url && formData.type === 'image' && <img src={formData.url} alt="Preview" className="h-32 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />}
                      {formData.url && formData.type === 'video' && getYouTubeId(formData.url) && (
                        <iframe src={`https://www.youtube.com/embed/${getYouTubeId(formData.url)}`} className="h-32 rounded-lg border border-stone-200" allowFullScreen></iframe>
                      )}
                      {formData.url && formData.type === 'video' && !getYouTubeId(formData.url) && (
                        <video src={formData.url} controls className="h-32 rounded-lg border border-stone-200" />
                      )}
                      <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold outline-none" />
                    </>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <button onClick={handleSaveItem} className="px-6 py-2 bg-nobel-gold text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Save</button>
                    <button onClick={handleCancelEdit} className="px-6 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors font-medium">Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="py-4 px-6 font-medium text-stone-500 uppercase tracking-wider text-sm">Details</th>
                      <th className="py-4 px-6 font-medium text-stone-500 uppercase tracking-wider text-sm w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'events' ? events : activeTab === 'testimonies' ? testimonies : gallery).map(item => (
                      <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="py-4 px-6 text-stone-800">
                          {activeTab === 'events' && (
                            <div>
                              <div className="font-bold">{item.date}</div>
                              <div className="text-sm text-stone-600 truncate max-w-md">{item.text}</div>
                            </div>
                          )}
                          {activeTab === 'testimonies' && (
                            <div>
                              <div className="font-bold">{item.title}</div>
                              <div className="text-xs text-stone-500 mb-1">By {item.name}</div>
                              <div className="text-sm text-stone-600 truncate max-w-md">{item.text}</div>
                            </div>
                          )}
                          {activeTab === 'gallery' && (
                            <div>
                              <div className="font-bold capitalize">{item.type}</div>
                              <div className="text-sm text-stone-600 truncate max-w-md">{item.description || item.url}</div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {deletingId === item.id ? (
                            <div className="flex gap-3 items-center">
                              <span className="text-xs text-stone-500 font-medium">Sure?</span>
                              <button onClick={() => handleDeleteItem(item.id, activeTab)} className="text-sm text-red-600 hover:underline font-bold">Yes</button>
                              <button onClick={() => setDeletingId(null)} className="text-sm text-stone-600 hover:underline">No</button>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <button onClick={() => handleEdit(item)} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
                              <button onClick={() => setDeletingId(item.id)} className="text-sm text-red-600 hover:underline font-medium">Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(activeTab === 'events' ? events : activeTab === 'testimonies' ? testimonies : gallery).length === 0 && (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-stone-500">No items found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
