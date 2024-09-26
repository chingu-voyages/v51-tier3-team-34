import chinguLogo from "../assets/chingu-logo.png";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer>
      <div>
        <div className="footer-chingu">
          <img src={chinguLogo} alt="Chingu Logo" />
          <div>
            <b>Website:</b>
            <a href="https://www.chingu.io/">www.chingu.io</a>
          </div>
        </div>
        <div className="footer-contact">
          <h3>Contact GeoDash World:</h3>
          <div>
            <b>Phone: </b>
            <p>+1-800-555-1234</p>
          </div>
          <div>
            <b>Email: </b>
            <p>support@geodashworld.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
