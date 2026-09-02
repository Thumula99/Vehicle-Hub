'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { carService } from '../../../services/carService';
import { useRouter } from 'next/navigation';
import { Car, Image as ImageIcon, ArrowRight, ArrowLeft, Check, Upload, X } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    make: 'Toyota',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Used',
    location: '',
    description: ''
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 8) {
      alert('You can upload a maximum of 8 images.');
      return;
    }

    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });

      images.forEach(img => {
        data.append('images', img);
      });

      const res = await carService.createCar(data);
      if (res.success) {
        router.push('/seller/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post vehicle listing.');
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post a Vehicle Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Step {step} of 5 — Fill in the details to publish your listing</p>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {['Basic Info', 'Specs', 'Pricing', 'Photos', 'Review'].map((label, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`h-2 rounded-full transition ${idx + 1 <= step ? 'bg-sky-600' : 'bg-gray-200'}`} />
              <p className="text-[11px] font-medium text-gray-500 hidden sm:block">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Step 1: Basic Information</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Listing Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Toyota Aqua S Grade 2018"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Make</label>
                  <select
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500"
                  >
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="BMW">BMW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    required
                    placeholder="e.g. Aqua, Vezel, Prius"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500"
                  >
                    <option value="Used">Used</option>
                    <option value="Brand New">Brand New</option>
                    <option value="Reconditioned">Reconditioned</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specs */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Step 2: Technical Specifications</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Mileage (km)</label>
                <input
                  type="number"
                  name="mileage"
                  placeholder="e.g. 65000"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Location */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Step 3: Pricing & Details</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Price (LKR)</label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="e.g. 6250000"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Colombo 03, Kandy, Gampaha"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Mention vehicle history, options, service records..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Step 4: Upload Vehicle Images</h2>
              <label className="border-2 border-dashed border-gray-300 hover:border-sky-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50/50">
                <Upload className="w-8 h-8 text-sky-600 mb-2" />
                <p className="text-sm font-semibold text-gray-700">Click or Drag & Drop Photos Here</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 5MB each (Max 8 photos)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative h-24 rounded-2xl overflow-hidden border border-gray-200 group">
                      <img src={src} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Step 5: Review & Publish</h2>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-sm">
                <p><strong className="text-gray-600">Title:</strong> {formData.title}</p>
                <p><strong className="text-gray-600">Make / Model / Year:</strong> {formData.make} {formData.model} ({formData.year})</p>
                <p><strong className="text-gray-600">Price:</strong> LKR {Number(formData.price).toLocaleString()}</p>
                <p><strong className="text-gray-600">Mileage:</strong> {formData.mileage} km</p>
                <p><strong className="text-gray-600">Fuel & Transmission:</strong> {formData.fuelType} / {formData.transmission}</p>
                <p><strong className="text-gray-600">Location:</strong> {formData.location}</p>
                <p><strong className="text-gray-600">Photos:</strong> {images.length} images attached</p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!formData.title || !formData.model)) {
                    alert('Please fill in required fields');
                    return;
                  }
                  if (step === 3 && !formData.price) {
                    alert('Please enter a vehicle price');
                    return;
                  }
                  setStep(prev => prev + 1);
                }}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>{submitting ? 'Publishing...' : 'Publish Listing'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
