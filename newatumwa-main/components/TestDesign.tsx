import React from 'react';
import { Button } from './ui/Button';

export const TestDesign: React.FC = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-heading-xl text-stone-900 mb-6">Design System Test</h1>

      <div className="card p-6">
        <h2 className="text-heading-md text-stone-900 mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-heading-md text-stone-900 mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="text-display-sm">Display Small</p>
          <p className="text-heading-xl">Heading XL</p>
          <p className="text-heading-lg">Heading LG</p>
          <p className="text-body-lg">Body Large</p>
          <p className="text-body-md">Body Medium</p>
          <p className="text-caption">Caption</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-heading-md text-stone-900 mb-4">Colors</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-brand p-4 rounded-lg text-white text-center">Brand</div>
          <div className="bg-stone-100 p-4 rounded-lg text-stone-900 text-center">Stone 100</div>
          <div className="bg-stone-200 p-4 rounded-lg text-stone-900 text-center">Stone 200</div>
          <div className="bg-stone-500 p-4 rounded-lg text-white text-center">Stone 500</div>
          <div className="bg-stone-900 p-4 rounded-lg text-white text-center">Stone 900</div>
        </div>
      </div>
    </div>
  );
};
