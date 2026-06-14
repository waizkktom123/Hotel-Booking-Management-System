import React, { useState } from "react";
import { Room } from "../types";
import { PlusCircle, Sliders, DollarSign, Calendar, Eye, CheckCircle2, AlertTriangle, Hammer, Edit3, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface HotelManagerPortalProps {
  rooms: Room[];
  onAddRoom: (roomData: any) => void;
  onUpdateRoom: (roomId: string, updateData: any) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const HotelManagerPortal: React.FC<HotelManagerPortalProps> = ({
  rooms,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom
}) => {
  // New room configurations
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("Deluxe Room");
  const [newRoomPrice, setNewRoomPrice] = useState(250);
  const [newRoomFloor, setNewRoomFloor] = useState(1);
  const [newRoomAmenities, setNewRoomAmenities] = useState("Ocean View, King Bed, Mini-bar");
  const [newRoomImage, setNewRoomImage] = useState("https://images.unsplash.com/photo-1590490360182-c33d57733427");

  // Price adjustment helpers
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const handleAddNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) return;

    const payload = {
      number: newRoomNumber,
      type: newRoomType,
      price: Number(newRoomPrice),
      floor: Number(newRoomFloor),
      amenities: newRoomAmenities.split(",").map(a => a.trim()),
      image: newRoomImage
    };

    onAddRoom(payload);
    // Reset Form
    setNewRoomNumber("");
    setShowAddForm(false);
  };

  const handlePriceUpdate = (roomId: string) => {
    onUpdateRoom(roomId, { price: tempPrice });
    setEditingRoomId(null);
  };

  const handleStatusToggle = (roomId: string, currentStatus: string) => {
    let nextStatus: "Available" | "Occupied" | "Cleaning" | "Maintenance" = "Available";
    if (currentStatus === "Available") nextStatus = "Occupied";
    else if (currentStatus === "Occupied") nextStatus = "Cleaning";
    else if (currentStatus === "Cleaning") nextStatus = "Maintenance";
    else nextStatus = "Available";

    onUpdateRoom(roomId, { status: nextStatus });
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Resort Suites</span>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{rooms.length} Suites</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Normalized SQL Rooms Catalog</p>
          </div>
          <Calendar className="text-blue-500 w-8 h-8 opacity-20" />
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rooms in Cleaning</span>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
              {rooms.filter(r => r.status === "Cleaning").length} Rooms
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Autoscheduled after Check-out</p>
          </div>
          <Sliders className="text-amber-500 w-8 h-8 opacity-20" />
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance Holds</span>
            <h3 className="text-2xl font-extrabold text-rose-500 mt-1">
              {rooms.filter(r => r.status === "Maintenance").length} Rooms
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Scheduled Repair Services</p>
          </div>
          <Sliders className="text-rose-500 w-8 h-8 opacity-20" />
        </div>
      </div>

      {/* Primary Section Layout */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-base font-bold">Resort Asset Inventory & Status Control</h2>
            <p className="text-xs text-slate-300 mt-0.5">Managers toggle statuses (Available - Occupied - Cleaning - Maintenance) and perform live price updates.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle size={15} />
            <span>Add Luxury Suite</span>
          </button>
        </div>

        {/* Add Room Modal / Slider Form */}
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="p-6 border-b border-slate-150 bg-slate-50/50"
          >
            <form onSubmit={handleAddNewRoom} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs select-none">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">Room Number</label>
                <input
                  type="text"
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="e.g. 104"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">Room Category Type</label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                  <option value="Deluxe Room">Deluxe Room</option>
                  <option value="Suite Room">Suite Room (Jacuzzi)</option>
                  <option value="Family Room">Family Room (Double)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">Base Price Limit ($)</label>
                <input
                  type="number"
                  required
                  value={newRoomPrice}
                  onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                  placeholder="250"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">Floor Level</label>
                <input
                  type="number"
                  required
                  value={newRoomFloor}
                  onChange={(e) => setNewRoomFloor(Number(e.target.value))}
                  placeholder="1"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-600">Suite Custom Amenities (comma separated)</label>
                <input
                  type="text"
                  value={newRoomAmenities}
                  onChange={(e) => setNewRoomAmenities(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-600">Unsplash Luxury Image Link</label>
                <input
                  type="text"
                  value={newRoomImage}
                  onChange={(e) => setNewRoomImage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-[10px] font-mono"
                />
              </div>

              <div className="md:col-span-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  Validate & Push Room To server
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Rooms Listing Layout */}
        <div className="overflow-x-auto select-none">
          <table className="w-full text-xs text-left text-slate-500">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-widest font-mono text-[9px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Suite Identity</th>
                <th className="px-6 py-3">Room Type Category</th>
                <th className="px-6 py-3">Floor Level</th>
                <th className="px-6 py-3">Nightly price</th>
                <th className="px-6 py-3">Status Schedule</th>
                <th className="px-6 py-3">Actions & Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {rooms.map(room => {
                const isEditingPrice = editingRoomId === room.id;
                
                return (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={room.image}
                          alt={room.type}
                          className="w-12 h-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-slate-900">Room {room.number}</span>
                          <span className="text-[10px] text-slate-400 font-mono block uppercase">{room.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-800">{room.type}</td>
                    <td className="px-6 py-3 font-mono">Floor {room.floor}</td>
                    <td className="px-6 py-3">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-16 p-1 bg-white border border-slate-300 rounded text-center text-xs text-slate-800 font-bold"
                          />
                          <button
                            onClick={() => handlePriceUpdate(room.id)}
                            className="bg-emerald-500 text-white p-1 rounded hover:bg-emerald-600 text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">${room.price}</span>
                          <button
                            onClick={() => {
                              setEditingRoomId(room.id);
                              setTempPrice(room.price);
                            }}
                            className="text-slate-400 hover:text-blue-600 p-0.5 rounded"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleStatusToggle(room.id, room.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold border cursor-pointer hover:shadow-sm transition ${
                          room.status === "Available" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          room.status === "Occupied" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          room.status === "Cleaning" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {room.status === "Available" && <CheckCircle2 size={11} />}
                        {room.status === "Occupied" && <Eye size={11} />}
                        {room.status === "Cleaning" && <Hammer size={11} />}
                        {room.status === "Maintenance" && <AlertTriangle size={11} />}
                        <span>{room.status}</span>
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => onDeleteRoom(room.id)}
                        className="p-1.5 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition text-[10px] font-bold flex items-center gap-1"
                      >
                        <Trash2 size={11} />
                        Delete Suite
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
