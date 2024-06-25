const Button = ({ label, styles, icon, type, onClick ,isSubmitting}) => {
    return (
      <button
        onClick={onClick}
        disabled = {isSubmitting}
        type={type || "button"}
        className={`flex items-center justify-center text-base outline-nones ${styles}`}
      >
        {isSubmitting ? "Loading..."  : label}
  
        {icon && <div className='ml-2'>{icon}</div>}
      </button>
    );
  };
  
  export default Button;