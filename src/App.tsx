import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;