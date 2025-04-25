import React, { useState } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';
import './CommentSection.css';

const CommentSection = ({ comments, stajId }) => {
  const [newComment, setNewComment] = useState('');
  const [allComments, setAllComments] = useState(comments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'You',
        date: new Date().toISOString(),
        text: newComment
      };
      setAllComments([...allComments, comment]);
      setNewComment('');
      // API call to save comment would go here
    }
  };

  return (
    <div className="comment-section">
      <h3>Yorumlar ({allComments.length})</h3>
      
      <div className="comment-list">
        {allComments.length > 0 ? (
          allComments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <FiUser className="user-icon" />
                  <span>{comment.author}</span>
                </div>
                <div className="comment-date">
                  {new Date(comment.date).toLocaleDateString()}
                </div>
              </div>
              <div className="comment-text">
                {comment.text}
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">
            Henüz yorum yapılmamış. İlk yorumu siz yapın!
          </div>
        )}
      </div>
      
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Yorumunuzu buraya yazın..."
        />
        <button onClick={handleAddComment} className="send-button">
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default CommentSection;