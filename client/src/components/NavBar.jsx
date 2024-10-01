import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/nav-bar.css";

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);
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
            </ul>
          </nav>
          <button className="auth-btn"><Link to="/login">LogIn</Link></button>
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
          </ul>
        </nav>
        <button className="auth-btn">Login</button>
      </div>
      {navOpen && (
        <div className="overlay" onClick={() => setNavOpen(false)}></div>
      )}
    </>
  );
};

export default NavBar;
