import { useState, useRef } from 'react';
import { Upload, Loader2, Link2, ImageIcon } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (data: { type: 'url' | 'file'; value: string | File }) => void;
  loading: boolean;
  loadingMessage: string;
}

export default function InputSection({ onAnalyze, loading, loadingMessage }: InputSectionProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'url' && url) {
      onAnalyze({ type: 'url', value: url });
    } else if (activeTab === 'upload' && selectedFile) {
      onAnalyze({ type: 'file', value: selectedFile });
    }
  };

  const isValid = activeTab === 'url' ? url.trim() !== '' : selectedFile !== null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-lg overflow-hidden neon-border">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'url'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
          >
            <Link2 className="w-5 h-5" />
            <span>URL</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'upload'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Upload</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'url' ? (
            <div>
              <label className="block text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
                Landing Page URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourlandingpage.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                disabled={loading}
              />
              <p className="mt-2 text-xs text-gray-500">
                <span className="text-purple-400">AUTO CAPTURE</span> We'll screenshot and analyze your hero section
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-pink-400 uppercase tracking-wider mb-3">
                Upload Screenshot
              </label>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-gray-700 hover:border-pink-500/50'
                } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />

                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg border border-gray-700" />
                    <div className="space-y-1">
                      <p className="text-gray-300 font-medium">{selectedFile?.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                      className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400">
                      <span className="font-medium text-pink-400">Click to Upload</span> or drag & drop
                    </p>
                    <p className="text-sm text-gray-600">PNG or JPG (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      <button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50 uppercase tracking-wider neon-border"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">{loadingMessage}</span>
          </>
        ) : (
          <span>Roast Me</span>
        )}
      </button>
    </div>
  );
}
