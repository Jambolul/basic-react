import {useState} from 'react';
import {useForm} from '../hooks/formHooks';
// Import your hooks accordingly
import {useFile, useMedia} from '../hooks/graphQLHooks';
import {useNavigate} from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const {postFile} = useFile();
  const {postMedia} = useMedia();
  const navigate = useNavigate();

  const initValues = {
    title: '',
    description: '',
    rating: "0",
  };

  const doUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !file) {
        return;
      }
      const fileResult = await postFile(file, token);
      console.log(fileResult);
      const mediaResult = await postMedia(fileResult, inputs, token);
      console.log("TESTI" + inputs);
      console.log(mediaResult);

      alert("Media uploaded");
      navigate('/');
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(doUpload, initValues);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-900 font-bold mb-2" htmlFor="title">Title</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
            placeholder="Enter a title for your upload"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold mb-2" htmlFor="description">Description</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
            placeholder="Describe your upload (Optional)"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 font-bold mb-2" htmlFor="file">File</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="flex w-full justify-center my-4">
          <img
            className="max-w-xs"
            src={file ? URL.createObjectURL(file) : 'https://via.placeholder.com/200?text=Choose+image'}
            alt="preview"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={!file || inputs.title.length === 0} // Ensure a file is selected and the title is not empty
          >
            Upload
          </button>
        </div>
      </form>
    </>
  );
};

export default Upload;
