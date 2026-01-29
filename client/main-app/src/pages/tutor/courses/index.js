import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import TutorLayout from '@/components/tutor/TutorLayout';
import { getTutorCourses, togglePublishCourse } from '@/services/apiService';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getTutorCourses();
        setCourses(res.data.data.courses);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchCourses();
  }, []);

  const togglePublish = async (id) => {
    try {
      await togglePublishCourse(id);
      // Refresh list after update
      setCourses(courses.map(c => c._id === id ? { ...c, isPublished: !c.isPublished } : c));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <TutorLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          + Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-500 text-sm mb-4">{course.category}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-xs ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
              <button 
                onClick={() => togglePublish(course._id)}
                className="text-sm text-purple-600 hover:underline"
              >
                Change Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </TutorLayout>
  );
}