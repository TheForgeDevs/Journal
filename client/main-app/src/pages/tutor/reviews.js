import { useEffect, useState } from 'react';
import axios from 'axios';
import TutorLayout from '@/components/tutor/TutorLayout';

export default function TutorReviews() {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/reviews/tutor', { withCredentials: true })
      .then(res => setReviews(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const handleReply = async (reviewId) => {
    try {
      await axios.patch(`http://localhost:5000/api/reviews/${reviewId}/reply`, 
        { reply: replyText[reviewId] }, 
        { withCredentials: true }
      );
      alert("Reply sent!");
      // Refresh logic here or update local state
      window.location.reload();
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  return (
    <TutorLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Student Reviews</h1>
        
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                  {review.student?.name?.[0] || 'S'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{review.student?.name}</h4>
                  <p className="text-xs text-gray-500">{review.course?.title}</p>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                ))}
              </div>
            </div>

            <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">"{review.comment}"</p>

            {review.tutorReply ? (
              <div className="ml-8 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                <p className="text-xs font-bold text-purple-700 mb-1">Your Reply:</p>
                <p className="text-sm text-gray-700">{review.tutorReply}</p>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Write a reply..." 
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  onChange={(e) => setReplyText({...replyText, [review._id]: e.target.value})}
                />
                <button 
                  onClick={() => handleReply(review._id)}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </TutorLayout>
  );
}