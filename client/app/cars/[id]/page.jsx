'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { carService } from '../../../services/carService';
import { chatService } from '../../../services/chatService';
import { useAuth } from '../../../context/AuthContext';
import { useWishlist } from '../../../context/WishlistContext';
import {
  Heart,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Check,
  User,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [contactModal, setContactModal] = useState(false);
  const [messageText, setMessageText] = useState('Hi, I am interested in this vehicle. Is it still available?');
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    if (id) {
      carService.getCarById(id)
        .then(res => {
          if (res.success) setCar(res.car);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setSendingMsg(true);
    try {
      const res = await chatService.sendMessage({
        receiverId: car.sellerId,
        carId: car.id,
        message: messageText
      });
      if (res.success) {
        setContactModal(false);
        router.push('/messages');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Vehicle Not Found</h2>
        <Link href="/cars" className="text-sky-600 font-semibold hover:underline">
          Return to vehicle catalog
        </Link>
      </div>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';
  const images = car.images && car.images.length > 0 
    ? car.images.map(img => `http://localhost:5001${img}`)
    : [fallbackImage];

  const wishlisted = isInWishlist(car.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link href="/cars" className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-sky-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Gallery */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="relative h-96 sm:h-[480px] w-full bg-slate-100">
              <img
                src={images[selectedImg] || fallbackImage}
                alt={car.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = fallbackImage; }}
              />
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold">
                {car.status || 'Available'}
              </span>
            </div>

            {images.length > 1 && (
              <div className="p-4 flex space-x-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`h-20 w-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                      selectedImg === idx ? 'border-sky-600' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specifications Grid */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Vehicle Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Calendar className="w-5 h-5 text-sky-600 mb-1" />
                <p className="text-xs text-gray-400 font-medium">Year</p>
                <p className="font-bold text-gray-900">{car.year}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Gauge className="w-5 h-5 text-sky-600 mb-1" />
                <p className="text-xs text-gray-400 font-medium">Mileage</p>
                <p className="font-bold text-gray-900">{car.mileage?.toLocaleString()} km</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Fuel className="w-5 h-5 text-sky-600 mb-1" />
                <p className="text-xs text-gray-400 font-medium">Fuel Type</p>
                <p className="font-bold text-gray-900">{car.fuelType}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Settings className="w-5 h-5 text-sky-600 mb-1" />
                <p className="text-xs text-gray-400 font-medium">Transmission</p>
                <p className="font-bold text-gray-900">{car.transmission}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Seller Description</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {car.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing, Seller & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                <span>{car.location || 'Sri Lanka'}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">{car.title}</h1>
              <p className="text-3xl font-extrabold text-sky-600 mt-2">
                LKR {car.price?.toLocaleString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setContactModal(true)}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl transition flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Seller</span>
              </button>

              <button
                onClick={() => toggleWishlist(car.id)}
                className={`w-full py-3 rounded-2xl font-semibold border transition flex items-center justify-center space-x-2 ${
                  wishlisted
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Seller Information Card */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Seller Details</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <p className="font-bold text-gray-900">{car.seller?.name || 'Private Seller'}</p>
                    {car.seller?.verifiedSeller && (
                      <ShieldCheck className="w-4 h-4 text-sky-600" title="Verified Seller" />
                    )}
                  </div>
                  {car.seller?.phone && (
                    <p className="text-xs text-gray-500 mt-0.5">{car.seller.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      {contactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Message {car.seller?.name || 'Seller'}</h3>
            <p className="text-xs text-gray-500">Regarding: {car.title}</p>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <textarea
                rows={4}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-sky-500 focus:bg-white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setContactModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="px-5 py-2 text-sm bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl"
                >
                  {sendingMsg ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
