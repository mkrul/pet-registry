import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatPhoneNumber } from '../../utils/phoneUtils';

const LostPetFlyer = React.forwardRef(({ pet, report, user, rewardAmount, customDescription, phoneNumber }, ref) => {
  const data = report || pet;

  const description = customDescription || data?.description || `Please help us find our beloved ${data.species}!`;

  const reportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/reports/${data.id}`
    : `https://lostpetsregistry.com/reports/${data.id}`;

  const getSubtitle = () => {
    const parts = [];

    if (data.gender) {
      parts.push(data.gender);
    }

    const breed = data.breed1 + (data.breed2 ? ` / ${data.breed2}` : '');
    parts.push(breed);

    if (data.gender && data.isAltered === true) {
      const alteredText = data.gender.toLowerCase() === 'male' ? 'neutered' : 'spayed';
      parts.push(`(${alteredText})`);
    }

    return parts.join(' ');
  };

  const getContactInfo = () => {
    const parts = [];
    if (user?.email) parts.push(user.email);
    if (phoneNumber) parts.push(formatPhoneNumber(phoneNumber));
    return parts.join(' | ');
  };

  const colors = [data.color1, data.color2, data.color3].filter(Boolean);

  return (
    <div ref={ref} className="print-flyer">
      <style>
        {`
          @media print {
            @page {
              size: letter;
              margin: 0.5in;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .print-flyer {
              page-break-after: avoid;
              page-break-inside: avoid;
            }
          }
          .print-flyer {
            width: 8.5in;
            height: 11in;
            max-height: 11in;
            background: white;
            padding: 0.3in;
            font-family: Arial, sans-serif;
            color: #000;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .print-flyer * {
            box-sizing: border-box;
          }
        `}
      </style>

      <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
        <h1 style={{
          fontSize: '130px',
          fontWeight: 'bold',
          marginTop: '-30px',
          marginBottom: '-20px',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          color: '#DC2626'
        }}>
          LOST {data.species}
        </h1>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'normal',
          textAlign: 'center',
          margin: '0 0 20px 0',
          color: '#333'
        }}>
          {getSubtitle()}
        </h2>
        <h5 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0',
          textTransform: 'uppercase'
        }}>
          If Found, Please Contact:
        </h5>
        <div style={{
          fontSize: '20px',
          textAlign: 'center',
          lineHeight: '1.8',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>
            {getContactInfo() || 'Contact information not available'}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '10px', flex: '0 0 auto' }}>
        {data.image?.url ? (
          <img
            src={data.image.url}
            alt={data.name}
            style={{
              width: '400px',
              height: '400px',
              objectFit: 'cover',
              border: '3px solid #000',
              display: 'block',
              margin: '0 auto 30px auto'
            }}
          />
        ) : (
          <div style={{
            width: '400px',
            height: '400px',
            border: '3px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            fontSize: '24px',
            color: '#666',
            margin: '0 auto 30px auto'
          }}>
          </div>
        )}
      </div>

      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {description && (
          <div style={{
            padding: '15px',
            background: '#f9f9f9',
            border: '2px solid #000',
            marginBottom: '15px',
            flex: '0 1 auto',
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              fontSize: '16px',
              lineHeight: '1.6',
              margin: '0',
              flex: '1'
            }}>
              <p style={{ margin: '0' }}>
                {description}
              </p>
            </div>
            <div style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <QRCodeSVG
                value={reportUrl}
                size={120}
                level="H"
                includeMargin={false}
              />
              <p style={{
                fontSize: '10px',
                margin: '0',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Scan for details
              </p>
            </div>
          </div>
        )}

        {rewardAmount && (
          <div style={{
            textAlign: 'center',
            padding: '10px',
            color: 'BLACK',
            flex: '0 0 auto',
            marginTop: 'auto'
          }}>
            <p style={{
              fontSize: '66px',
              fontWeight: 'bold',
              margin: '0'
            }}>
              REWARD: {rewardAmount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

LostPetFlyer.displayName = 'LostPetFlyer';

export default LostPetFlyer;

