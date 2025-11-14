'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Footer from '../components/footer';
import AdminTopBar from '../components/adminTopBar';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    category: 'News',
    title: '',
    author: '',
    date: '',
    article: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const baseUrl = process.env.NEXT_PUBLIC_BE_BASE_URL || 'http://13.201.131.134:5010';

  // ✅ Fetch all news
  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/news/categories`);
      const list = res.data.categories || [];
      setCategories(list);
      // Set default category if available
      if (list.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: list[0] }));
      }
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    }
  };


   const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/api/news/addCategory`, {
        category: newCategory.trim(),
      });

      toast.success(res.data.message || '✅ Category added successfully');
      setNewCategory('');
      fetchCategories(); // refresh list
    } catch (error) {
      console.error('❌ Error adding category:', error);
      toast.error(error?.response?.data?.error || 'Error adding category');
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/news/all`);
      setArticles(res.data.news || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch articles');
    }
  };


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('date', formData.date);
      data.append('article', formData.article);
      if (selectedFile) data.append('image', selectedFile);

      const url = editId
        ? `${baseUrl}/api/news/edit/${editId}`
        : `${baseUrl}/api/news/create`;

      const method = editId ? 'put' : 'post';
      await axios[method](url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(editId ? 'Article updated successfully!' : 'Article added!');
      resetForm();
      fetchNews();
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error?.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ category: 'News', title: '', author: '', date: '', article: '' });
    setSelectedFile(null);
    setPreview(null);
    setEditId(null);
  };

  const handleEdit = (article) => {
    setFormData({
      category: article.category,
      title: article.title,
      author: article.author,
      date: article.date ? article.date.split('T')[0] : '',
      article: article.article,
    });
    setPreview(article.imageUrl || null);
    setEditId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const openDeleteModal = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  try {
    await axios.delete(`${baseUrl}/api/news/delete/${deleteId}`);
    toast.success("🗑️ Article deleted successfully!");
    fetchNews();
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to delete article");
  } finally {
    setShowDeleteModal(false);
    setDeleteId(null);
  }
};

const cancelDelete = () => {
  setShowDeleteModal(false);
  setDeleteId(null);
};



  return (
    <div className="min-h-screen flex flex-col">
      <AdminTopBar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-10">
          Dashboard
        </h1>

        {/* ====== ADD / EDIT FORM ====== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-6"
        >
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-6 border-b border-blue-200 dark:border-blue-700 pb-3">
            {editId ? '✏️ Edit Article' : '📰 Add New Article'}
          </h2>

          {/* Category Section */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Category
            </label>
            <div className="flex gap-2 items-center">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-1 border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Add New Category */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                ➕ Add
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              className="w-full border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Author & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Author
              </label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Article */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Article Content
            </label>
            <textarea
              name="article"
              value={formData.article}
              onChange={handleChange}
              rows="6"
              placeholder="Write full article..."
              className="w-full border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 border border-blue-400 dark:border-blue-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-100 dark:file:bg-blue-800 file:text-blue-700 dark:file:text-blue-100 hover:file:bg-blue-200 dark:hover:file:bg-blue-700"
            />
            {preview && (
              <div className="mt-4 p-2 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg max-h-60 object-cover w-full border border-blue-300 dark:border-blue-800"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.article}
            className={`mt-4 w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold text-lg uppercase transition-all duration-300 transform flex items-center justify-center gap-2 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-105'
            }`}
          >
            {loading ? 'Saving...' : editId ? 'Update Article' : 'Submit Article'}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 w-full sm:w-auto px-8 py-3 rounded-xl text-white bg-red-500 font-bold text-lg uppercase transition-all duration-300 transform flex items-center justify-center gap-2 hover:scale-105"
            >
              Cancel Editing
            </button>
          )}
        </form>

        {/* Manage Articles */}

<div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mt-10">
  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-300 mb-4 border-b border-blue-200 dark:border-blue-700 pb-2">
    🛠 Manage Articles
  </h3>

  {articles.filter(a => a.uploadedImage && a.uploadedImage.trim() !== "").length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400 text-sm">No articles with images found.</p>
  ) : (
<ul className="divide-y divide-gray-200 dark:divide-gray-700">
  {articles
    .filter(a => a.uploadedImage && a.uploadedImage.trim() !== "")
    .map((a) => (
      <li key={a.id} className="py-4 flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{a.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {a.category} • {a.author} • {new Date(a.date).toLocaleDateString()}
          </p>
        </div>

        {/* Edit + Delete Group */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleEdit(a)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            ✏️ Edit
          </button>

          <button onClick={() => openDeleteModal(a.id)} className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
  🗑️ Delete
</button>
        </div>
      </li>
    ))}
</ul>


  )}
</div>

      </main>

      {showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-80 p-6 text-center">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        Confirm Delete
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to delete this article?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={cancelDelete}
          className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      <Footer />
    </div>
  );
}