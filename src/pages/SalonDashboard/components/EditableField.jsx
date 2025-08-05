// import React, { useState, useEffect } from 'react';

// const EditableField = ({ value, onSave, disabled }) => {
//   const [editing, setEditing] = useState(false);
//   const [tempValue, setTempValue] = useState(value);
//   const [isChanged, setIsChanged] = useState(false);

//   useEffect(() => {
//     setTempValue(value);
//     setIsChanged(false);
//   }, [value]);

//   const handleSave = () => {
//     setEditing(false);
//     if (isChanged && typeof onSave === 'function') {
//       onSave(tempValue);
//     }
//   };

//   if (disabled) {
//     return (
//       <div className="px-2 py-1">
//         {value || 'Not provided'}
//       </div>
//     );
//   }

//   return (
//     <div>
//       {editing ? (
//         <div className="flex flex-col gap-2">
//           <input
//             type="text"
//             className="w-full border rounded px-2 py-1"
//             value={tempValue}
//             onChange={(e) => {
//               setTempValue(e.target.value);
//               setIsChanged(e.target.value !== value);
//             }}
//             onBlur={handleSave}
//             onKeyDown={(e) => e.key === 'Enter' && handleSave()}
//             autoFocus
//           />
//         </div>
//       ) : (
//         <div
//           className="cursor-pointer px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
//           onClick={() => setEditing(true)}
//         >
//           {value || 'Click to edit'}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditableField;


import React, { useState, useEffect } from 'react';

const EditableField = ({ value, onSave, disabled }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setTempValue(value);
    setIsChanged(false);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (isChanged && typeof onSave === 'function') {
      onSave(tempValue);
    }
  };

  if (disabled) {
    return (
      <div className="px-2 py-1 text-gray-700">
        {value || 'Not provided'}
      </div>
    );
  }

  return (
    <div>
      {editing ? (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={tempValue}
          onChange={(e) => {
            setTempValue(e.target.value);
            setIsChanged(e.target.value !== value);
          }}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
      ) : (
        <div
          className="cursor-pointer px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
          onClick={() => setEditing(true)}
        >
          {value || 'Click to edit'}
        </div>
      )}
    </div>
  );
};

export default EditableField;
