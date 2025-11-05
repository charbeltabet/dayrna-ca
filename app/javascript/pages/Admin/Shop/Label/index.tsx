import { QRCodeCanvas } from 'qrcode.react';
import logo from './st-charbel.svg'

const LabelPrinter = () => {
  return (
    <>
      <style>{`
        @page {
          size: 29mm 90mm;
          margin: 0;
          padding: 0 !important;
        }
      `}</style>
      <div style={{
        backgroundColor: 'white',
        height: '90mm',
        width: '29mm',
        padding: '2mm',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: 'black'
      }}>
        <div style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '10pt',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
        }}>
          <div>
            DAYRNA.CA
          </div>
          <img src={logo} alt="Logo" style={{ width: '12px' }} />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
          <div style={{
            writingMode: 'vertical-rl',
            fontFamily: 'monospace',
            fontSize: '7pt',
            fontWeight: 'bold',
          }}>
            BOU-VIT-GRA-1
          </div>
          <QRCodeCanvas
            value={"https://picturesofpeoplescanningqrcodes.tumblr.com/"}
            title={"Title for my QR Code"}
            size={70}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
          />
        </div>
        <div style={{
          writingMode: 'vertical-rl',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1mm',
          gap: '1mm',
        }}>
          <div style={{
            fontSize: '8pt',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderLeft: '1px solid black',
          }}>
            <div>CAD</div>
            <div>12</div>
          </div>
          <div style={{
            fontSize: '12.1pt',
            fontWeight: 'bold',
            lineHeight: '1.0',
          }}>
            Ste-Vierge Miraculeuse 60cm here another it is good
          </div>
          <div style={{
            fontSize: '9pt',
            lineHeight: '1.0',
          }}>Ensemble Souvenir - Sur bois avec bougie</div>
        </div>
      </div>
    </>
  );
};

export default LabelPrinter;