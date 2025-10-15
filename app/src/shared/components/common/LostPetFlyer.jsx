import React from 'react';

const LostPetFlyer = React.forwardRef(({ pet, report, user, rewardAmount, additionalNotes }, ref) => {
  const data = report || pet;
  const lastSeenLocation = report
    ? [report.area, report.state, report.country].filter(Boolean).join(', ')
    : 'Location unknown';

  const description = report?.description || `Please help us find our beloved ${data.species}!`;

  const getSpayNeuterText = () => {
    if (data.isAltered === true) return 'Spayed/Neutered: Yes';
    if (data.isAltered === false) return 'Spayed/Neutered: No';
    return 'Spayed/Neutered: Unknown';
  };

  const contactInfo = [];
  if (user?.phoneNumber) contactInfo.push(`${user.phoneNumber}`);
  if (user?.email) contactInfo.push(`${user.email}`);

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
          }
          .print-flyer {
            width: 8.5in;
            min-height: 11in;
            background: white;
            padding: 0.5in;
            font-family: Arial, sans-serif;
            color: #000;
            page-break-after: always;
          }
          .print-flyer * {
            box-sizing: border-box;
          }
        `}
      </style>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '130px',
          fontWeight: 'bold',
          marginBottom: '-20px',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          color: '#DC2626'
        }}>
          {data.status === 'missing' ? 'LOST' : 'FOUND'} {data.species}
        </h1>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0',
          textTransform: 'uppercase'
        }}>
          If Found, Please Contact:
        </h3>
        <div style={{
          fontSize: '20px',
          textAlign: 'center',
          lineHeight: '1.8',
          marginBottom: '20px'
        }}>
          {contactInfo.map((info, index) => (
            <p key={index} style={{ margin: '0', fontWeight: 'bold' }}>
              {info}
            </p>
          ))}
          {contactInfo.length === 0 && (
            <p style={{ margin: '0', fontWeight: 'bold' }}>
              Contact information not available
            </p>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        {data.image?.url ? (
          <img
            src={data.image.url}
            alt={data.name}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              width: 'auto',
              height: 'auto',
              border: '3px solid #000',
              display: 'block',
              margin: '0 auto'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '400px',
            border: '3px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            fontSize: '24px',
            color: '#666'
          }}>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{
          fontSize: '18px',
          lineHeight: '1.8',
          marginBottom: '15px'
        }}>
          <div style={{
            display: 'flex',
            gap: '40px',
            marginTop: '10px'
          }}>
            <div style={{ flex: '1' }}>
              <p style={{ margin: '8px 0' }}>
                <strong>Breed:</strong> {data.breed1}{data.breed2 ? ` / ${data.breed2}` : ''}
              </p>
              {colors.length > 0 && (
                <p style={{ margin: '8px 0' }}>
                  <strong>Color(s):</strong> {colors.join(', ')}
                </p>
              )}
            </div>

            <div style={{ flex: '1' }}>
              {data.gender && (
                <p style={{ margin: '8px 0' }}>
                  <strong>Gender:</strong> {data.gender}
                </p>
              )}
              <p style={{ margin: '8px 0' }}>
                <strong>{getSpayNeuterText()}</strong>
              </p>
            </div>
          </div>

          {report && (
            <p style={{ margin: '8px 0', marginTop: '10px' }}>
              <strong>Last Seen:</strong> {lastSeenLocation}
            </p>
          )}
        </div>

        {description && (
          <div style={{
            padding: '15px',
            background: '#f9f9f9',
            border: '2px solid #000',
            marginBottom: '15px'
          }}>
            <div style={{
              fontSize: '16px',
              lineHeight: '1.6',
              margin: '0'
            }}>
              <p style={{ margin: '0 0 10px 0' }}>
                {description}
              </p>
              { additionalNotes && (
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  {additionalNotes}
                </p>
              )}
            </div>
          </div>
        )}

        {rewardAmount && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#DC2626',
            color: 'white',
            marginBottom: '20px',
            border: '3px solid #000'
          }}>
            <p style={{
              fontSize: '36px',
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

