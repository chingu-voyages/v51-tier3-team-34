import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/nav-bar.css";

const NavBar = () => {
  const { currentUser, logout } = useContext(UserContext)
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () =>{
    logout();
    navigate("/")
  }

  return (
    <>
      <header>
        <div>
          <div className="logo">
            <img src={logo} alt="GeoDash World Logo" />
          </div>
          <button
            id="nav-toggle"
            aria-label="Toggle Navigation Menu"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/quiz">Quiz Challenge</Link>
              </li>
              <li>
                <Link to="/scavenger-hunt">Scavenger Hunt</Link>
              </li>
              <li>
                <Link to="/achievements">Achievements</Link>
              </li>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              {currentUser &&
                <li>
                  <Link to="/profile">Profile Settings</Link>
                </li>
              }
            </ul>
          </nav>
          <button className="auth-btn">
            {currentUser ? <div onClick={handleLogout}>Logout</div> : <Link to="/login">Login</Link>}
          </button>
        </div>
      </header>
      <div className={`side-nav ${navOpen ? "show" : ""}`}>
        <nav>
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/quiz">Quiz Challenge</Link>
            </li>
            <li>
              <Link to="/scavenger-hunt">Scavenger Hunt</Link>
            </li>
            <li>
              <Link to="/achievements">Achievements</Link>
            </li>
            <li>
              <Link to="/leaderboard">Leaderboard</Link>
            </li>
            {currentUser &&
              <li>
                <Link to="/profile">Profile Settings</Link>
              </li>
            }
          </ul>
        </nav>
        {currentUser ? <div onClick={handleLogout}>Logout</div> : <Link to="/login">Login</Link>}
      </div>
      {navOpen && (
        <div className="overlay" onClick={() => setNavOpen(false)}></div>
      )}
    </>
  );
};

export default NavBar;
