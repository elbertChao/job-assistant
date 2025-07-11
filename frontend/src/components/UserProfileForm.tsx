import { useState } from "react";
import { fetchWithToken } from "../services/api";

const UserProfileForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetchWithToken(`${import.meta.env.VITE_API_URL}/generate/answer`, {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          role,
        }),
      });

      console.log("User created:", response);
      alert("Profile created successfully!");
    } catch (err: any) {
      console.error("Error creating user:", err.message);
      alert("Failed to create profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border border-gray-300 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
