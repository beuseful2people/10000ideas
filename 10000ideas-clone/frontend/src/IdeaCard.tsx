import React, { useState } from 'react';
import { Idea } from '../types';
import { ideasApi } from '../services/api';
import './IdeaCard.css';

interface IdeaCardProps {
  idea: Idea;
  onVote?: (id: string, newVoteCount: number) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onVote }) => {
  const [votes, setVotes] = useState(idea.votes);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (direction: 'up' | 'down') => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const updatedIdea = await ideasApi.voteOnIdea(idea.id, direction);
      setVotes(updatedIdea.votes);
      onVote?.(idea.id, updatedIdea.votes);
    } catch (error) {
      console.error('Error voting on idea:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': '#3b82f6',
      'Entertainment': '#8b5cf6',
      'Food & Dining': '#10b981',
      'Environment': '#059669',
      'Transportation': '#f59e0b',
      'Health': '#ef4444',
      'Education': '#6366f1',
      'Business': '#0ea5e9',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="idea-card">
      <div className="idea-card-header">
        <span 
          className="category-badge" 
          style={{ backgroundColor: getCategoryColor(idea.category) }}
        >
          {idea.category}
        </span>
        <div className="vote-section">
          <button
            className={`vote-btn vote-up ${isVoting ? 'disabled' : ''}`}
            onClick={() => handleVote('up')}
            disabled={isVoting}
            title="Upvote"
          >
            ▲
          </button>
          <span className="vote-count">{votes}</span>
          <button
            className={`vote-btn vote-down ${isVoting ? 'disabled' : ''}`}
            onClick={() => handleVote('down')}
            disabled={isVoting}
            title="Downvote"
          >
            ▼
          </button>
        </div>
      </div>
      
      <h3 className="idea-title">{idea.title}</h3>
      <p className="idea-description">{idea.description}</p>
      
      <div className="idea-tags">
        {idea.tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="idea-footer">
        <span className="author">by {idea.author}</span>
        <span className="date">{formatDate(idea.createdAt)}</span>
      </div>
    </div>
  );
};

export default IdeaCard;