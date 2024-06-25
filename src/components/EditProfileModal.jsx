

import React, { useState ,useEffect,useRef} from 'react';
import { useForm } from 'react-hook-form';
import { useEdit } from '../hooks/auth-hook';
import { Toaster, toast } from "sonner";
import ImagePreview from "./ImagePreview";
import { uploadFile } from "../utils/index";
import useStore from '../store';


const EditProfileModal = ({ onClose }) => {
  const { user } = useStore((state) => state);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.user?.name,
    //   email: user.email,
    //   password: '',
    }
  });
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState(user.profileImage);
//   const [passValue, setPassValue] = useState('');
  const fileInputRef = useRef(null);
  const { mutate } = useEdit(user?.token,toast);


  const onSubmit = (values) => {
    // const strength = 100; // Assuming strength is calculated elsewhere
    // if (strength < 90) return;

    mutate({
      ...values,
    //   password: passValue,
      image: fileURL,

    });

    onClose();
  };
  const handleRemoveImage = () => {
    setFile("");
    setFileURL("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the input value
    }
  };
  useEffect(() => {
    file && uploadFile(setFileURL, file);
  }, [file]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#2f2d30] p-6 rounded-lg shadow-2xl w-80">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="w-full flex gap-2">
            <div className="w-full">
              <label className="block text-sm dark:text-white">name</label>
              <input
                type="text"
                placeholder="Name"
                {...register('Name', { required: true })}
                className="mt-1 p-2 w-full border rounded dark:bg-[#3c3c3c] dark:text-white"
              />
              {errors.name && <span className="text-red-500"> name is required</span>}
            </div>
          </div>
          {/* <div className="w-full">
            <label className="block text-sm dark:text-white">Email</label>
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: true })}
              className="mt-1 p-2 w-full border rounded dark:bg-[#3c3c3c] dark:text-white"
            />
            {errors.email && <span className="text-red-500">Email is required</span>}
          </div>
          <div className="w-full">
            <label className="block text-sm dark:text-white">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={passValue}
              onChange={(e) => setPassValue(e.target.value)}
              className="mt-1 p-2 w-full border rounded dark:bg-[#3c3c3c] dark:text-white"
            />
          </div> */}
          <div className="w-full">
            <label className="block text-sm dark:text-white">Profile Image</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={e=> setFile(e.target.files[0])}
              className="mt-1 p-2 w-full border rounded dark:bg-[#3c3c3c] dark:text-white"
            />
               {fileURL && <ImagePreview imageUrl={fileURL} onRemove={handleRemoveImage} theme="true" />}
          </div>
          <div className="flex justify-end space-x-2">
        
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
