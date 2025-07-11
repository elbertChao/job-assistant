import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { fetchWithToken } from "../services/api";
const UserProfileForm = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const handleSubmit = async (e) => {
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
        }
        catch (err) {
            console.error("Error creating user:", err.message);
            alert("Failed to create profile.");
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-xl shadow-md", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Create User Profile" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "Full Name", className: "w-full p-2 border border-gray-300 rounded", value: fullName, onChange: (e) => setFullName(e.target.value), autoComplete: "name" }), _jsx("input", { type: "email", placeholder: "Email", className: "w-full p-2 border border-gray-300 rounded", value: email, onChange: (e) => setEmail(e.target.value) }), _jsxs("select", { className: "w-full p-2 border border-gray-300 rounded", value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "recruiter", children: "Recruiter" })] }), _jsx("button", { type: "submit", className: "w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700", children: "Save Profile" })] })] }));
};
export default UserProfileForm;
