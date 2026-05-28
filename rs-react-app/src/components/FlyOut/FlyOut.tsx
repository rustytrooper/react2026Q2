import { useEffect, useState } from 'react';
import useDisneyStore from '../../store/useDownloadData';
import { downloadAsCsv } from '../../helpers/converToCsv';

const SelectionFlyout = () => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedCount = useDisneyStore((state) => state.getSelectedCount());
  const clearSelection = useDisneyStore((state) => state.clearSelection);
  const getSelectedCharacters = useDisneyStore(
    (state) => state.getSelectedCharacters
  );

  useEffect(() => {
    setIsVisible(selectedCount > 0);
  }, [selectedCount]);

  const handleDownload = async () => {
    const selectedCharacters = getSelectedCharacters();
    if (selectedCharacters.length === 0) return;
    downloadAsCsv(selectedCharacters, selectedCount);
  };

  const handleUnselectAll = () => {
    clearSelection();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-purple-500 rounded-lg shadow-xl p-4 min-w-[240px] dark:bg-purple-950 transition-all duration-300">
        <div className="text-white mb-3 text-center">
          <span className="font-semibold">Amount of chosen characters:</span>
          <span className="ml-2 text-lg font-bold">{selectedCount}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="
              flex-1
              bg-white 
              text-purple-600 
              font-semibold 
              py-2 
              px-3 
              rounded-md 
              hover:bg-gray-100 
              transition-all 
              duration-200
              transform
              hover:scale-105
              active:scale-95
              shadow-md
              cursor-pointer
            "
          >
            Download
          </button>

          <button
            onClick={handleUnselectAll}
            className="
              flex-1
              bg-purple-700 
              text-white 
              font-semibold 
              py-2 
              px-3 
              rounded-md 
              hover:bg-purple-800 
              transition-all 
              duration-200
              transform
              hover:scale-105
              active:scale-95
              cursor-pointer
            "
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionFlyout;
