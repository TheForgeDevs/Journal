import { useState } from 'react';
import axios from 'axios';
import TutorLayout from '@/components/tutor/TutorLayout';

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'programming',
    level: 'beginner',
    price: 0,
    thumbnail: 'https://placeholder.com/thumbnail.png' // Production note: Use a file upload component here
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', formData, { withCredentials: true });
      alert("Course created as Draft!");
      window.location.href = '/tutor/courses';
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    }
  };

  return (
    <TutorLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-3 border rounded-lg" 
            placeholder="Course Title" 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
          <textarea 
            className="w-full p-3 border rounded-lg h-32" 
            placeholder="Detailed Description" 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <select className="p-3 border rounded-lg" onChange={(e) => setFormData({...formData, level: e.target.value})}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input 
              type="number" 
              className="p-3 border rounded-lg" 
              placeholder="Price (₹)" 
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold">
            Create Course
          </button>
        </form>
      </div>
    </TutorLayout>
  );
}