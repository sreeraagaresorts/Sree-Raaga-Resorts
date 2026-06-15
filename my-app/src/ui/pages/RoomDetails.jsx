import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, Star } from "lucide-react";

const rooms = [
  {
    id: 1,
    name: "Luxury Suite",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
    area: "600 SQ FT",
    beds: "KING BED",
    bathrooms: "1 BATHROOM",
    description:
      "Experience premium comfort with stunning views and luxury amenities.",
    features: [
      "Free WiFi",
      "Swimming Pool",
      "Breakfast Included",
      "Room Service",
      "Smart TV",
      "Private Balcony",
    ],
  },
  {
    id: 2,
    name: "Royal Villa",
    price: 12999,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200",
    area: "900 SQ FT",
    beds: "2 KING BEDS",
    bathrooms: "2 BATHROOMS",
    description:
      "An elegant villa designed for families and luxury travelers.",
    features: [
      "Private Garden",
      "Free WiFi",
      "Luxury Bathroom",
      "Mini Bar",
      "Private Dining",
      "Room Service",
    ],
  },
];

const RoomDetails = () => {
  const { id } = useParams();

  const room =
    rooms.find((r) => r.id === Number(id)) || rooms[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const calculateTotal = () => {
    if (!checkIn || !checkOut)
      return { nights: 0, total: room.price };

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start)
      return { nights: 0, total: room.price };

    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    return {
      nights,
      total: nights * room.price,
    };
  };

  const totals = calculateTotal();

  return (
    <div className="bg-black text-white">

      {/* Hero */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${room.image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-light mb-4">
            {room.name}
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Home / Room Details
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left Side */}
          <div className="lg:col-span-2">

            <img
              src={room.image}
              alt={room.name}
              className="w-full h-[500px] object-cover mb-10"
            />

            <div className="flex justify-between items-center border-b border-yellow-500/20 pb-8 mb-8">
              <div>
                <h2 className="text-4xl mb-4">
                  {room.name}
                </h2>

                <div className="flex flex-wrap gap-3 text-yellow-500 text-xs uppercase">
                  <span>{room.area}</span>
                  <span>•</span>
                  <span>{room.beds}</span>
                  <span>•</span>
                  <span>{room.bathrooms}</span>
                </div>
              </div>

              <div className="border border-yellow-500/30 px-6 py-3">
                <p className="text-xs text-gray-400 mb-1">
                  Price
                </p>

                <p className="text-2xl text-yellow-500">
                  ₹{room.price}
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-6">
              {room.description}
            </p>

            <p className="text-gray-400 leading-relaxed mb-10">
              Enjoy world-class hospitality, premium amenities,
              and unforgettable luxury experiences at our resort.
            </p>

            {/* Features */}
            <h3 className="text-3xl mb-8">
              Extra Services
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {room.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <Check
                    size={18}
                    className="text-yellow-500"
                  />

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Review */}
            <div className="border border-yellow-500/20 p-8 bg-zinc-950 flex justify-between items-center">
              <div className="flex gap-5 items-center">
                <span className="text-6xl text-yellow-500">
                  5.0
                </span>

                <div>
                  <div className="flex gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm">
                    5 Reviews
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Booking Sidebar */}
          <div>

            <div className="bg-zinc-950 border border-yellow-500/20 p-8 sticky top-28">

              <h3 className="text-3xl mb-8">
                Booking Now
              </h3>

              <div className="space-y-5">

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Check In
                  </label>

                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) =>
                      setCheckIn(e.target.value)
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Check Out
                  </label>

                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) =>
                      setCheckOut(e.target.value)
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Adults
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={adults}
                    onChange={(e) =>
                      setAdults(Number(e.target.value))
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-500 text-xs mb-2 uppercase">
                    Children
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={children}
                    onChange={(e) =>
                      setChildren(Number(e.target.value))
                    }
                    className="w-full bg-transparent border-b border-gray-600 py-2 outline-none"
                  />
                </div>

                <div className="border-t border-yellow-500/20 pt-6 text-center">

                  <p className="text-gray-400 mb-2">
                    Total Price
                  </p>

                  <p className="text-4xl text-yellow-500 mb-2">
                    ₹{totals.total.toLocaleString()}
                  </p>

                  {totals.nights > 0 && (
                    <p className="text-gray-500 text-sm mb-6">
                      {totals.nights} Nights
                    </p>
                  )}

                  <button
                    className="w-full py-4 bg-yellow-500 text-black hover:bg-yellow-400 transition"
                    onClick={() =>
                      alert(
                        "Booking integration will be added later."
                      )
                    }
                  >
                    Book Now
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Similar Rooms */}
        <div className="mt-24">

          <h2 className="text-4xl text-center mb-12">
            Similar Rooms
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {rooms.map((item) => (
              <Link
                key={item.id}
                to={`/rooms/${item.id}`}
                className="group"
              >
                <div className="overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>

                <h3 className="text-2xl group-hover:text-yellow-500">
                  {item.name}
                </h3>
              </Link>
            ))}

          </div>

        </div>

      </section>
    </div>
  );
};

export default RoomDetails;