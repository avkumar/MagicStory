import { useState } from 'react';
import ImageDisplay from './ImageDisplay';
import { Analytics } from '@vercel/analytics/react';
// import logo from './floz.png';
const logoUrl = "https://i0.wp.com/flozdesign.com/wp-content/uploads/2023/03/cropped-flozlogo2white-03.png?fit=656%2C294&ssl=1";

function Home() {
  const [inputValue, setInputValue] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  function subtractOne(number) {
    return number - 1;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const text_response = await fetch('/api/openai', {
      method: 'POST',
      body: JSON.stringify({ prompt: `Generate the opening of a bedtime story for a 3 year old kids about ${inputValue}. 
      Fewer than 200 characters.` }),
    });

    if (text_response.ok) {
      const output = await text_response.json();
      setTextOutput(output.choices[0].message.content);
      console.log(output.choices[0].message.content);
    } else {
      console.error('Error:', text_response.statusText);
    }

    const img_response = await fetch('/api/stablediffusion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: `Cute ${inputValue},unreal engine, artstation, detailed, 
      digital painting,cinematic,character design by mark ryden and pixar and hayao miyazaki, 
      unreal 5, daz, hyperrealistic, octane render`}),
    });

    if (img_response.ok) {
      const data = await img_response.json();
      setImageUrl(data[0]);
      console.log(data[0]);
    } else {
      console.error('Error:', img_response.statusText);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-5 py-3 text-gray-700 bg-gray-200 rounded"
                placeholder="I want a story about..."
              />
              <button type="submit" className="w-full px-3 py-4 text-white bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 rounded-md focus:outline-none" disabled={loading}>
              Submit
            </button>
          </form>
        {/* <MBTIForm inputValue={inputValue} setInputValue={setInputValue} handleSubmit={handleSubmit} loading={loading} /> */}
        </div>
      </div>
      {loading && (
        <div className="mt-12 flex justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}
      <div className="mt-12 flex justify-center">
        {!loading && inputValue && (
          <div className="max-w-md mx-auto">
          <p><strong>Story Time</strong> <br /> {textOutput}</p>
          </div>
        )}
      </div>
      <ImageDisplay imageUrl={imageUrl} loading={loading} />
      <div className="mt-12 flex justify-center">
        <a href="https://flodesigners.com/" target="_blank" rel="noopener noreferrer">
          <img src={logoUrl} alt="Logo" />
        </a>
      </div>
      <Analytics />
      <style jsx>{`
        .loader {
          animation: spin 1s linear infinite;
          border-top-color: #3498db;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;