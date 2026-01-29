import { useEffect, useState } from 'react';
import axios from 'axios';
import TutorLayout from '@/components/tutor/TutorLayout';

export default function TutorLearners() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/enrollments/tutor/my-students', { 
          withCredentials: true 
        });
        setEnrollments(res.data.data.enrollments);
      } catch (err) {
        console.error("Error fetching learners");
      }
    };
    fetchLearners();
  }, []);

  return (
    <TutorLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">Enrolled Learners</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-400 text-sm">
                <th className="pb-4 font-medium">Student Name</th>
                <th className="pb-4 font-medium">Course</th>
                <th className="pb-4 font-medium">Enrollment Date</th>
                <th className="pb-4 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrollments.map((enr) => (
                <tr key={enr._id} className="hover:bg-gray-50">
                  <td className="py-4">
                    <p className="font-semibold text-gray-800">{enr.student.name}</p>
                    <p className="text-xs text-gray-500">{enr.student.email}</p>
                  </td>
                  <td className="py-4 text-gray-600">{enr.course.title}</td>
                  <td className="py-4 text-gray-600">
                    {new Date(enr.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${enr.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{enr.completionPercentage}% complete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TutorLayout>
  );
}