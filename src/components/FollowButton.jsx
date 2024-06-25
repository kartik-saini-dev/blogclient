import { useState } from 'react';
import { Toaster, toast } from "sonner";

const FollowButton = ({ label, styles, icon, type, onClick,isLoggedIn }) => {

  const [showLoginToast, setShowLoginToast] = useState(false); // State to track if login toast should be shown


  const handleFollowClick = () => {
    if (!isLoggedIn) {
    
      setShowLoginToast(true);
    } else {
  
      onClick();
    }
  };// here i have to create seperate follow and simple button have to copy fron the video button {isLoggedin && onclick or isLoggedIn? onclick: onclik }


  return (
    <>
    <button
      onClick={handleFollowClick}
      type={type || "button"}
      className={`flex items-center justify-center text-base outline-nones ${styles}`}
    >
      {label}

      {icon && <div className='ml-2'>{icon}</div>}
    </button>
    {showLoginToast && (
      // Show the login toast if user is not logged in
      toast.error('Please log in first.') // also have to show toaster somwhere to show 
    )}
  </>
  );
};

export default FollowButton;
