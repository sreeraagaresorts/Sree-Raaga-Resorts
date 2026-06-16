import { useEffect, useState } from "react";
import axiosReal from "axios";
import { User, Mail, Phone, Calendar, ShieldCheck, RefreshCw } from "lucide-react";
import { useToast } from "../../components/Toast";
import { API_URL } from "../../../config/api";

const UserProfile = () => {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axiosReal.get(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/60 justify-center py-24">
        <RefreshCw className="animate-spin w-6 h-6 text-yellow-500" />
        <span className="font-light tracking-wider">Loading profile information...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-none text-center max-w-md mx-auto mt-12 text-sm">
        Failed to load profile details. Please login again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      <h1 className="text-3xl font-serif font-light mb-6 text-white border-b border-yellow-500/10 pb-3">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PROFILE AVATAR CARD */}
        <div className="bg-zinc-950 border border-yellow-500/20 p-8 rounded-none flex flex-col items-center text-center shadow-2xl justify-center">
          <div className="w-24 h-24 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-3xl shadow-lg mb-4">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-serif font-light text-white truncate max-w-full">{user.full_name}</h2>
          <p className="text-yellow-500 text-[10px] uppercase tracking-widest mt-2 font-medium">
            {user.role === "admin" ? "Resort Admin" : "Gold Guest Member"}
          </p>
          <div className="w-full border-t border-yellow-500/10 mt-6 pt-4 text-[10px] text-gray-400 flex justify-center gap-1.5 items-center uppercase tracking-wider font-light">
            <ShieldCheck size={14} className="text-yellow-500" />
            <span>Account Verified</span>
          </div>
        </div>

        {/* DETAILS LIST CARD */}
        <div className="md:col-span-2 bg-zinc-950 border border-yellow-500/20 p-6 rounded-none shadow-2xl space-y-6">
          <h3 className="text-lg font-serif font-light text-white border-b border-yellow-500/10 pb-2">Profile Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* FULL NAME */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-zinc-900 rounded-none text-yellow-500 border border-yellow-500/15">
                <User size={16} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Full Name</p>
                <p className="text-white font-medium mt-0.5">{user.full_name}</p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-zinc-900 rounded-none text-yellow-500 border border-yellow-500/15">
                <Mail size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Email Address</p>
                <p className="text-white font-medium mt-0.5 truncate">{user.email}</p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-zinc-900 rounded-none text-yellow-500 border border-yellow-500/15">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Phone Number</p>
                <p className="text-white font-medium mt-0.5">{user.phone || "Not Provided"}</p>
              </div>
            </div>

            {/* JOIN DATE */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-zinc-900 rounded-none text-yellow-500 border border-yellow-500/15">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Member Since</p>
                <p className="text-white font-medium mt-0.5">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

          </div>

          <div className="border-t border-yellow-500/10 pt-4 flex justify-end">
            <button 
              onClick={() => toast.info("Profile updates will be integrated in general settings.")}
              className="bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-4 py-2 rounded-none text-xs font-semibold uppercase tracking-widest transition cursor-pointer"
            >
              Request Profile Update
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;