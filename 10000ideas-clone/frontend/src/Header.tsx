import React, { useState, useEffect } from 'react';
import { ideasApi } from '../services/api';
import './Header.css';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  searchTerm: string;
  selectedCategory: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onCategoryChange,
  onSortChange,
  searchTerm,
  selectedCategory,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await ideasApi.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    onSortChange(sortBy, sortOrder);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Title */}
        <div className="header-brand">
          <h1 className="header-title">
            <span className="title-gradient">10,000 Ideas</span>
            <span className="title-subtitle">Where Innovation Begins</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg 
                className="search-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                type="text"
                placeholder="Search amazing ideas..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters-container">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="filter-select category-select"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              onChange={handleSortChange}
              className="filter-select sort-select"
              defaultValue="createdAt:desc"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="votes:desc">Most Voted</option>
              <option value="votes:asc">Least Voted</option>
              <option value="title:asc">A-Z</option>
              <option value="title:desc">Z-A</option>
            </select>
          </div>

          <button className="add-idea-btn">
            <svg 
              className="add-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Idea
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            className="menu-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <div className="search-input-wrapper">
              <svg 
                className="search-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                type="text"
                placeholder="Search amazing ideas..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>

          <div className="mobile-filters">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="filter-select category-select"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              onChange={handleSortChange}
              className="filter-select sort-select"
              defaultValue="createdAt:desc"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="votes:desc">Most Voted</option>
              <option value="votes:asc">Least Voted</option>
              <option value="title:asc">A-Z</option>
              <option value="title:desc">Z-A</option>
            </select>
          </div>

          <button className="add-idea-btn mobile-add-btn">
            <svg 
              className="add-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add New Idea
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;