'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface UploadModalProps {
  onClose: () => void;
  onFileSelected: (file: File) => Promise<{ code: 'success' | 'error'; message: string; data: { url: string | null } }>;
}

export default function UploadModal({ onClose, onFileSelected }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.epub')) {
      setSelectedFile(file);
      setStatus('');
    } else {
      setStatus('Please select a valid .epub file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/epub+zip': ['.epub'] },
    maxFiles: 1,
    multiple: false,
  });

  const modal = (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-600/20 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Read this book</h2>
            <p className="text-xs text-gray-400">Upload your EPUB file to start reading</p>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-green-500 bg-green-500/10'
              : selectedFile
              ? 'border-green-600/50 bg-green-900/10'
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-green-600/20 p-3 rounded-full">
                <FileText className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-medium text-sm">{selectedFile.name}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <p className="text-xs text-gray-500">Click or drop to replace</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-green-400" />
              <p className="text-green-400 font-medium">Drop the EPUB file here...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-gray-500" />
              <div>
                <p className="text-white font-medium mb-1">Drag & drop an EPUB file</p>
                <p className="text-gray-500 text-sm">or click to browse</p>
              </div>
              <p className="text-xs text-gray-600 bg-gray-800 px-3 py-1 rounded-full">
                Only .epub files are supported
              </p>
            </div>
          )}
        </div>

        {status && (
          <p className="mt-3 text-center text-sm text-red-400">{status}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (selectedFile) {
                const result = await onFileSelected(selectedFile);
                if (result.code === 'success') {
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
                onClose();
              }
            }}
            disabled={!selectedFile}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-colors text-sm font-semibold"
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
