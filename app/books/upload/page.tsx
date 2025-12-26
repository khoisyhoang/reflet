"use client";

import { useRef } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, ConfigProvider, theme, App } from 'antd';
import ePub from 'epubjs';

const { Dragger } = Upload;

export default function UploadPage() {

  const viewerRef = useRef<HTMLDivElement>(null);

  const props: UploadProps = {
    name: 'file',
    accept: '.epub', // Accept only .epub files
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      // Since no action URL, treat selection as success for local processing
      if (info.fileList.length > 0 && info.file.name.endsWith('.epub')) {
        const file = info.file.originFileObj;
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const epubBook = ePub(arrayBuffer);
            if (viewerRef.current) {
              epubBook.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
              }).display();
            }
            message.success(`${info.file.name} file loaded and ready for reading.`);
          };
          reader.readAsArrayBuffer(file);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <App>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorText: '#ffffff',
            colorTextSecondary: '#aaaaaa',
          },
        }}
      >
        <div className="max-w-3xl mx-auto mb-8">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single .epub file upload. Strictly prohibited from uploading company data or other banned files.
            </p>
          </Dragger>
        </div>
        <div id="viewer" ref={viewerRef} className="max-w-3xl mx-auto" style={{ height: '600px', border: '1px solid #ccc' }}></div>
      </ConfigProvider>
    </App>
  );
}