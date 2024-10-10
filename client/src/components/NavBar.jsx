import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import ProtectedLink from "./ProtectedLink";
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
                <ProtectedLink to={"/"} children={"Home"}/>
              </li>
              <li>
                <ProtectedLink to={"/quiz"} children={"Quiz Challenge"}/>
              </li>
              <li>
                <ProtectedLink to={"/scavenger-hunt"} children={"Scavenger Hunt"}/>
              </li>
              <li>
                <ProtectedLink to={"/achievements"} children={"Achievements"}/>
              </li>
              <li>
                <ProtectedLink to={"/leaderboard"} children={"Leaderboard"}/>
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
              <ProtectedLink to={"/"} children={"Home"}/>
            </li>
            <li>
              <ProtectedLink to={"/quiz"} children={"Quiz Challenge"}/>
            </li>
            <li>
              <ProtectedLink to={"/scavenger-hunt"} children={"Scavenger Hunt"}/>
            </li>
            <li>
              <ProtectedLink to={"/achievements"} children={"Achievements"}/>
            </li>
            <li>
              <ProtectedLink to={"/leaderboard"} children={"Leaderboard"}/>
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
