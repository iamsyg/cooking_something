// agent/components/ProgressSteps.tsx

import React from 'react'

type ProgressStepsProps = {
    step: 1 | 2 | 3 | 4;
};

const ProgressSteps = ({ step }: ProgressStepsProps) => (
    <div className="mb-8">
        <div className="flex items-center justify-center">
            <div className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    1
                </div>
                <div className={`h-1 w-16 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                </div>
                <div className={`h-1 w-16 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    3
                </div>
                <div className={`h-1 w-16 ${step >= 4 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step === 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    4
                </div>
            </div>
        </div>
        <div className="mt-4 flex justify-center text-sm gap-4">
            <div className="w-24 text-center">
                <div className="font-medium">Basic Info</div>
            </div>
            <div className="w-24 text-center">
                <div className="font-medium">Inventory</div>
            </div>
            <div className="w-24 text-center">
                <div className="font-medium">Microsite</div>
            </div>
            <div className="w-24 text-center">
                <div className="font-medium">Review</div>
            </div>
        </div>
    </div>
);

export default ProgressSteps