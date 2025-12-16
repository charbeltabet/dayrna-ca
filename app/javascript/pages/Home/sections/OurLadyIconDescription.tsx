import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LabeledImage } from '../../../components/LabeledImage';
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons';
import { HomeSectionLayout } from '../../../components/HomeSectionLayout';

export default function OurLadyIconDescription() {
  const pdfUrl = "https://dayrnadevassets.tabet.tech/attachments/98/MD_DIASPORA_CERTIFICATE.pdf"
  const pdfWidth = 500;
  const pdfHeight = 650;
  const iconUrl = "https://dayrnadevassets.tabet.tech/attachments/97/our_lady_of_the_diaspora.png";

  const handleDownloadWallpaper = () => {
    const link = document.createElement('a');
    link.href = iconUrl
    link.download = 'notre_dame_du_diaspora_wallpaper.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareWallpaper = async () => {
    try {
      // Fetch the image as a blob
      const response = await fetch(iconUrl);
      const blob = await response.blob();
      const file = new File([blob], 'notre_dame_du_diaspora.png', { type: 'image/png' });

      // Check if the Web Share API is supported and can share files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Notre Dame Du Diaspora',
          text: 'Check out this beautiful icon of Notre Dame Du Diaspora',
        });
      } else {
        // Fallback: copy link or show message
        alert('Sharing is not supported on this browser. Please use the download button instead.');
      }
    } catch (error) {
      // User cancelled the share or an error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <HomeSectionLayout.Container>
      <HomeSectionLayout.Header>Notre Dame Du Diaspora</HomeSectionLayout.Header>
      <HomeSectionLayout.Content>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px'
        }}>
          <div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <div style={{
                minWidth: '350px',
                maxWidth: '350px',
                border: '1px solid var(--color-base-300)',
              }}>
                <LabeledImage
                  src={iconUrl}
                  labels={[
                    {
                      text: "Visage de la Vierge Marie",
                      coordinates: [{ x: 451, y: 100 }, { x: 796, y: 317 }]
                    },
                    {
                      text: "Visage de l'Enfant Jésus",
                      coordinates: [{ x: 799, y: 505 }, { x: 973, y: 587 }]
                    },
                    {
                      text: "Symbole du livre de la Genèse",
                      coordinates: [{ x: 900, y: 896 }, { x: 1122, y: 1085 }]
                    },
                    {
                      text: "Main de la Vierge",
                      coordinates: [{ x: 369, y: 1020 }, { x: 704, y: 1228 }]
                    },
                    {
                      text: "Étoile et symboles maronites",
                      coordinates: [{ x: 926, y: 1130 }, { x: 1198, y: 1386 }]
                    },
                    {
                      text: "Symbole de l'arbre de vie",
                      coordinates: [{ x: 35, y: 1442 }, { x: 240, y: 1645 }]
                    },
                    {
                      text: "Croix maronite",
                      coordinates: [{ x: 957, y: 1468 }, { x: 1193, y: 1676 }]
                    },
                    {
                      text: "Étoile du matin",
                      coordinates: [{ x: 1004, y: 18 }, { x: 1162, y: 229 }]
                    },
                    {
                      text: "Symbole de sainteté",
                      coordinates: [{ x: 49, y: 49 }, { x: 240, y: 212 }]
                    }
                  ]}
                />
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '5px'
              }}>
                <button className="btn btn-primary btn-sm" onClick={handleDownloadWallpaper}>
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleShareWallpaper}>
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              textAlign: 'justify',
            }}>
              Écrite par Roula Hereiki selon la technique byzantine (détrempe à l'œuf et or fin), cette icône de type Hodigitria représente Marie guidant vers l'Enfant Jésus. Elle intègre les quatre saints maronites et des inscriptions en syriaque. Alliant tradition et spiritualité, cette œuvre en bois de tilleul utilise des pigments précieux comme le lapis-lazuli.
            </p>
            {/* PDF viewer */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
              Certificat d'authenticité
              <object
                data={pdfUrl}
                type="application/pdf"
                width={pdfWidth}
                height={pdfHeight}
                style={{
                  border: '1px solid var(--color-base-300)',
                }}
              >
                {/* Fallback for browsers that don't support embedded PDFs */}
                <embed
                  src={pdfUrl}
                  type="application/pdf"
                  width={pdfWidth}
                  height={pdfHeight}
                />

                {/* Final fallback: download link if neither object nor embed works */}
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-base-200)',
                  borderRadius: '0.5rem',
                }}>
                  <p style={{ marginBottom: '20px' }}>Your browser cannot display PDFs natively.</p>
                  <a
                    href={pdfUrl}
                    download
                    style={{
                      color: 'var(--color-primary)',
                      textDecoration: 'underline',
                      fontWeight: 'bold',
                    }}
                  >
                    Click here to download the PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      </HomeSectionLayout.Content>
    </HomeSectionLayout.Container>
  )
} 
