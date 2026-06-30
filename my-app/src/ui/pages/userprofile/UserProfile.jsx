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
      <div className="flex items-center gap-2 text-[#0d2b4e]/60 justify-center py-24">
        <RefreshCw className="animate-spin w-6 h-6 text-[#c8a64d]" />
        <span className="font-light tracking-wider">Loading profile information...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-none text-center max-w-md mx-auto mt-12 text-sm">
        Failed to load profile details. Please login again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#0d2b4e]">
      <h1 className="text-3xl  font-light mb-6 text-[#0d2b4e] border-b border-gray-200/50 pb-3">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PROFILE AVATAR CARD */}
        <div className="bg-white border border-gray-200/50 p-8 rounded-none flex flex-col items-center text-center shadow-sm justify-center">
          <div className="w-24 h-24 rounded-full bg-[#c8a64d] text-white flex items-center justify-center font-bold text-3xl shadow-md mb-4">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl  font-medium text-[#0d2b4e] truncate max-w-full">{user.full_name}</h2>
          <p className="text-[#c8a64d] text-[10px] uppercase tracking-widest mt-2 font-medium">
            {user.role === "admin" ? "Resort Admin" : "Gold Guest Member"}
          </p>
          <div className="w-full border-t border-gray-200/50 mt-6 pt-4 text-[11px] text-gray-500 flex justify-center gap-1.5 items-center uppercase tracking-wider font-medium">
            <ShieldCheck size={14} className="text-[#c8a64d]" />
            <span>Account Verified</span>
          </div>
        </div>

        {/* DETAILS LIST CARD */}
        <div className="lg:col-span-2 bg-white border border-gray-200/50 p-6 rounded-none shadow-sm space-y-6">
          <h3 className="text-lg  font-light text-[#0d2b4e] border-b border-gray-200/50 pb-2">Profile Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* FULL NAME */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-[#fdfeff] rounded-none text-[#c8a64d] border border-gray-200/30">
                <User size={16} />
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Full Name</p>
                <p className="text-[#0d2b4e] font-medium mt-0.5">{user.full_name}</p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-[#fdfeff] rounded-none text-[#c8a64d] border border-gray-200/30">
                <Mail size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Email Address</p>
                <p className="text-[#0d2b4e] font-medium mt-0.5 truncate">{user.email}</p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-[#fdfeff] rounded-none text-[#c8a64d] border border-gray-200/30">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Phone Number</p>
                <p className="text-[#0d2b4e] font-medium mt-0.5">{user.phone || "Not Provided"}</p>
              </div>
            </div>

            {/* JOIN DATE */}
            <div className="flex gap-4 items-start">
              <div className="p-2.5 bg-[#fdfeff] rounded-none text-[#c8a64d] border border-gray-200/30">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Member Since</p>
                <p className="text-[#0d2b4e] font-medium mt-0.5">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

          </div>

          <div className="border-t border-gray-200/50 pt-4 flex justify-end">
            <button 
              onClick={() => toast.info("Profile updates will be integrated in general settings.")}
              className="bg-transparent border border-[#c8a64d] text-[#c8a64d] hover:bg-[#c8a64d] hover:text-white px-4 py-2 rounded-none text-xs font-semibold uppercase tracking-widest transition cursor-pointer"
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