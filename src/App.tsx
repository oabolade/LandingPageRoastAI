import { useState } from 'react';
import axios from 'axios';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import PartialRoast from './components/PartialRoast';
import EmailModal from './components/EmailModal';
import FullRoast from './components/FullRoast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface RoastData {
  roastId: string;
  grade: string;
  partialRoast: string;
  screenshotUrl: string;
  fullRoast?: any;
}

type AppState = 'input' | 'partial' | 'full';

const LOADING_MESSAGES = [
  'Analyzing your bad design decisions...',
  'Counting conversion-killing mistakes...',
  'Preparing brutal honesty...',
  'Loading roast cannons...',
  'GPT-4o is judging you...',
];

function App() {
  const [state, setState] = useState<AppState>('input');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: { type: 'url' | 'file'; value: string | File }) => {
    setLoading(true);
    setError(null);

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 2000);

    try {
      let response;

      if (data.type === 'url') {
        response = await axios.post(`${API_BASE_URL}/analyze-url`, {
          url: data.value,
        });
      } else {
        const formData = new FormData();
        formData.append('screenshot', data.value as File);
        response = await axios.post(`${API_BASE_URL}/analyze-screenshot`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setRoastData(response.data);
      setState('partial');
    } catch (err: any) {
      console.error('Error analyzing:', err);
      setError(err.response?.data?.error || 'Failed to analyze. Please try again.');
    } finally {
      clearInterval(messageInterval);
      setLoading(false);
    }
  };

  const handleGetFullRoast = () => {
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (email: string) => {
    if (!roastData) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/capture-email`, {
        email,
        roastId: roastData.roastId,
      });

      setRoastData({
        ...roastData,
        fullRoast: response.data.fullRoast,
      });
      setShowEmailModal(false);
      setState('full');
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to capture email');
    }
  };

  const handleRoastAnother = () => {
    setState('input');
    setRoastData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {state === 'input' && (
          <>
            <Hero />
            <InputSection onAnalyze={handleAnalyze} loading={loading} loadingMessage={loadingMessage} />
            {error && (
              <div className="max-w-3xl mx-auto mt-6">
                <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4 text-red-300">
                  <span className="font-bold font-mono">ERROR</span> {error}
                </div>
              </div>
            )}
          </>
        )}

        {state === 'partial' && roastData && (
          <PartialRoast
            grade={roastData.grade}
            partialRoast={roastData.partialRoast}
            screenshotUrl={roastData.screenshotUrl}
            onGetFullRoast={handleGetFullRoast}
          />
        )}

        {state === 'full' && roastData && roastData.fullRoast && (
          <FullRoast
            fullRoast={roastData.fullRoast}
            grade={roastData.grade}
            screenshotUrl={roastData.screenshotUrl}
            onRoastAnother={handleRoastAnother}
            onClose={handleRoastAnother}
          />
        )}

        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
        />
      </div>

      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
        <p className="font-mono">
          <span className="text-purple-400">POWERED BY</span> GPT-4o Vision + Express + React + Brutal Honesty
        </p>
      </footer>
    </div>
  );
}

export default App;
