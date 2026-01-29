import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import TutorLayout from '@/components/tutor/TutorLayout';

export default function ManageCourseContent() {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/courses/${id}`, { withCredentials: true })
        .then(res => setCourse(res.data.data.course));
    }
  }, [id]);

  const handleAddModule = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/courses/${id}/modules`, 
        { title: newModuleTitle }, { withCredentials: true });
      setCourse({ ...course, modules: res.data.data });
      setNewModuleTitle('');
    } catch (err) {
      alert("Error adding module");
    }
  };

  if (!course) return <div className="p-8">Loading Content Manager...</div>;

  return (
    <TutorLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-500 mb-8">Manage modules and upload your video lectures.</p>

        {/* Module Creator */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex gap-4">
          <input 
            className="flex-1 p-3 border rounded-lg" 
            placeholder="New Module Title (e.g. Introduction)" 
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
          />
          <button onClick={handleAddModule} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold">
            Add Module
          </button>
        </div>

        {/* Modules List */}
        <div className="space-y-6">
          {course.modules?.map((module, index) => (
            <div key={index} className="bg-white border rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-4 font-bold border-b flex justify-between">
                <span>Module {index + 1}: {module.title}</span>
                <button className="text-purple-600 text-sm">+ Add Lecture</button>
              </div>
              <div className="p-4">
                {/* List of lectures belonging to this moduleId would go here */}
                <p className="text-gray-400 text-sm italic">No lectures uploaded in this module yet.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TutorLayout>
  );
}