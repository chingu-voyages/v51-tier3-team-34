import {useContext} from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom';

const ProtectedLink = ({ to, children }) => {
  const { currentUser } = useContext(UserContext)

  return (
    <Link
      to={currentUser ? to : "#"}
      className={currentUser ? "" : "disabled-link"}
      onClick={(e) => {
        if (!currentUser) {
        e.preventDefault();
        alert("Please log in first!");
      }
    }}
    >
    {children}
    </Link>
  );
};

export default ProtectedLink
