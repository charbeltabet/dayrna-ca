import { faComments, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FooterSection() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <div>
        <img
          src="/logo.png"
          style={{
            height: '60px',
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <p>Monastère et Paroisse St. Antoine - Outremont</p>
          <p>1520 Avenue Ducharme, Outremont, QC, H2V 1G1</p>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px'
          }}>
            <p>(514) 271-2000</p>
            <p>|</p>
            <p>info@dayrna.ca</p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
        }}>
          <button className="btn btn-primary">
            Contact Us
            <FontAwesomeIcon icon={faComments} />
          </button>
          <button className="btn btn-info">
            Donate
            <FontAwesomeIcon icon={faHandHoldingDollar} />
          </button>
        </div>
      </div>
      <nav>
        <h6 className="footer-title">Services</h6>
        <a className="link link-hover">Branding</a>
        <a className="link link-hover">Design</a>
        <a className="link link-hover">Marketing</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      {/* <nav>
        <h6 className="footer-title">Messes</h6>
        <p>Lundi - Samedi: 19h00</p>
        <p>Dimanche: 10h00, 11h30, 19h00</p>
      </nav> */}
    </footer>
  )
}
