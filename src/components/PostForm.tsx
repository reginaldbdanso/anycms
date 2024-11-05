// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { ImagePlus } from 'lucide-react';

// const PostForm: React.FC = () => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [author, setAuthor] = useState('');
//   const [coverImage, setCoverImage] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const quillRef = useRef<ReactQuill>(null);
//   const navigate = useNavigate();

//   const modules = {
//     toolbar: {
//       container: [
//         [{ 'header': [1, 2, false] }],
//         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//         [{'list': 'ordered'}, {'list': 'bullet'}],
//         ['link', 'image'],
//         ['clean']
//       ],
//       handlers: {
//         image: imageHandler
//       }
//     }
//   };

//   const formats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike', 'blockquote',
//     'list', 'bullet',
//     'link', 'image'
//   ];

//   async function imageHandler() {
//     const input = document.createElement('input');
//     input.setAttribute('type', 'file');
//     input.setAttribute('accept', 'image/*');
//     input.click();

//     input.onchange = async () => {
//       if (input.files) {
//         const file = input.files[0];
//         const formData = new FormData();
//         formData.append('image', file);

//         try {
//           const response = await fetch(import.meta.env.VITE_API_UPLOAD_URL, {
//             method: 'POST',
//             body: formData,
//           });

//           if (!response.ok) throw new Error('Upload failed');

//           const data = await response.json();
//           const quill = quillRef.current?.getEditor();
//           const range = quill?.getSelection();
//           if (quill && range && range.index !== null && range.index !== undefined) {
//             const length = quill.getLength();
//             if (range.index <= length) {
//               quill.insertEmbed(range.index, 'image', data.url);
//             }
//           }
//         } catch (error) {
//           console.error('Error uploading image:', error);
//           setError('Failed to upload image');
//         }
//       }
//     };
//   }

//   const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const formData = new FormData();
//       formData.append('image', file);

//       try {
//         const response = await fetch(import.meta.env.VITE_API_UPLOAD_URL, {
//           method: 'POST',
//           body: formData,
//         });

//         if (!response.ok) throw new Error('Upload failed');

//         const data = await response.json();
//         setCoverImage(data.url);
//       } catch (error) {
//         console.error('Error uploading cover image:', error);
//         setError('Failed to upload cover image');
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const response = await fetch(import.meta.env.VITE_API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           title, 
//           content, 
//           author,
//           coverImage 
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create post');
//       }

//       navigate('/');
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('An unexpected error occurred');
//       }
//       console.error('Error creating post:', error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Cover Image
//           </label>
//           <div className="flex items-center space-x-4">
//             <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               <ImagePlus className="w-5 h-5 inline-block mr-2" />
//               Choose Image
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleCoverImageUpload}
//               />
//             </label>
//             {coverImage && (
//               <img
//                 src={coverImage}
//                 alt="Cover preview"
//                 className="h-20 w-auto object-cover rounded"
//               />
//             )}
//           </div>
//         </div>

//         <div>
//           <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
//           <ReactQuill
//             ref={quillRef}
//             theme="snow"
//             value={content}
//             onChange={setContent}
//             modules={modules}
//             formats={formats}
//             className="bg-white"
//           />
//         </div>

//         <div>
//           <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
//           <input
//             type="text"
//             id="author"
//             value={author}
//             onChange={(e) => setAuthor(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//         >
//           Create Post
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PostForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [authorImage, setAuthorImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author, category, excerpt, coverImage, authorImage }),
        
      });

      // console.log(category);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Title */}
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          {/* Cover Image */}
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
        type="text"
        id="coverImage"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        // required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          {/* Content */}
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          {/* Author */}
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
        type="text"
        id="author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        
       
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Select a category</option>
            <option value="Code">Code</option>
            <option value="Technology">Technology</option>
            <option value="Software">Software</option>
            <option value="AI">AI</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;