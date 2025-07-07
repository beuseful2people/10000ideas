import React, { useState } from 'react';
import Header from './Header';
import IdeasGrid from './IdeasGrid';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="App">
      <Header
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />
      <main className="main-content">
        <IdeasGrid
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </main>
    </div>
  );
}

export default App;
