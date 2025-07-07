import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import IdeaCard from './IdeaCard';
import { Idea, IdeasResponse } from '../types';
import { ideasApi } from '../services/api';
import './IdeasGrid.css';

interface IdeasGridProps {
  searchTerm?: string;
  selectedCategory?: string;
  sortBy?: string;
  sortOrder?: string;
}

const IdeasGrid: React.FC<IdeasGridProps> = ({ 
  searchTerm, 
  selectedCategory, 
  sortBy = 'createdAt',
  sortOrder = 'desc'
}) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const loadIdeas = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: pageNum,
        limit: 20,
        sortBy,
        sortOrder,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const response: IdeasResponse = await ideasApi.getIdeas(params);
      
      if (append) {
        setIdeas(prev => [...prev, ...response.ideas]);
      } else {
        setIdeas(response.ideas);
      }

      setTotalCount(response.total);
      setHasMore(pageNum < response.totalPages);
    } catch (err) {
      setError('Failed to load ideas. Please try again.');
      console.error('Error loading ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadIdeas(1, false);
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadIdeas(nextPage, true);
    }
  };

  const handleVote = (ideaId: string, newVoteCount: number) => {
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, votes: newVoteCount }
          : idea
      )
    );
  };

  if (loading && ideas.length === 0) {
    return (
      <div className="ideas-grid-container">
        <div className="loading-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="idea-card-skeleton">
              <div className="skeleton-header">
                <div className="skeleton-badge"></div>
                <div className="skeleton-votes"></div>
              </div>
              <div className="skeleton-title"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-tags"></div>
              <div className="skeleton-footer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ideas-grid-container">
        <div className="error-state">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => loadIdeas(1, false)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="ideas-grid-container">
        <div className="empty-state">
          <h3>No ideas found</h3>
          <p>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Be the first to share an amazing idea!'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ideas-grid-container">
      <div className="ideas-grid-header">
        <h2>
          {totalCount.toLocaleString()} Amazing Ideas
          {selectedCategory && selectedCategory !== 'all' && (
            <span className="category-filter"> in {selectedCategory}</span>
          )}
        </h2>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="ideas-masonry-grid"
        columnClassName="ideas-masonry-grid-column"
      >
        {ideas.map((idea) => (
          <IdeaCard 
            key={idea.id} 
            idea={idea}
            onVote={handleVote}
          />
        ))}
      </Masonry>

      {hasMore && (
        <div className="load-more-container">
          <button 
            className={`load-more-btn ${loading ? 'loading' : ''}`}
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Ideas'}
          </button>
        </div>
      )}

      {!hasMore && ideas.length > 0 && (
        <div className="end-message">
          <p>You've seen all the amazing ideas! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default IdeasGrid;