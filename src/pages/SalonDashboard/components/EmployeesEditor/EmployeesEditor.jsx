// import React, { useState } from 'react';
// import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
// import { assets } from '../../../../assets/assets'; 
// import EditableField from '../../../../components/EditableField/EditableField';
// import EditEmployeePopup from '../EditEmployeePopup/EditEmployeePopup'; 
// import AddEmployeePopup from '../AddEmployeePopup/AddEmployeePopup';  
// import './EmployeesEditor.css';

// const EmployeesEditor = () => {
//   const [employees, setEmployees] = useState([
//     { name: 'Ruwan', contact_no: '0777777777', profilePic: assets.noProfilepic },
//     { name: 'Sunil', contact_no: '0777123123', profilePic: assets.noProfilepic },
//   ]);

//   const [popupIndex, setPopupIndex] = useState(-1);  // for Edit popup
//   const [showAddPopup, setShowAddPopup] = useState(false);  // for Add popup

//   const handleDelete = (index) => {
//     const updated = [...employees];
//     updated.splice(index, 1);
//     setEmployees(updated);
//   };

//   const addNewEmployee = () => {
//     setShowAddPopup(true);
//   };

//   const handleAddNewEmployee = (data) => {
//     setEmployees([...employees, data]);
//     setShowAddPopup(false);
//   };

//   const handleEditEmployee = (index) => {
//     setPopupIndex(index);
//   };

//   const handleSaveEmployee = (index, updatedData) => {
//     const updated = [...employees];
//     updated[index] = {
//       ...updated[index],
//       ...updatedData,
//     };
//     setEmployees(updated);
//     setPopupIndex(-1);
//   };

//   const handleCancelEdit = () => {
//     setPopupIndex(-1);
//   };

//   return (
//     <div className="employees-container">
//       <h3>Employees</h3>

//       <table className="employees-table">
//         <tbody>
//           <tr className="add-employee-row">
//             <td colSpan={4}>
//               <button 
//                 className="add-employee-btn" 
//                 onClick={addNewEmployee}
//               >
//                 + Add Employee
//               </button>
//             </td>
//           </tr>

//           {employees.map((employee, index) => (
//             <tr key={index} className="employee-row">
//               <td className="profile-cell">
//                 <img src={employee.profilePic} alt="Profile" className="employee-avatar" />
//               </td>
//               <td className="name-cell">
//                <span className="employee-name-display">{employee.name}</span>
//               </td>
//               <td className="action-buttons-employee">
//                 <button className="edit-btn" onClick={() => handleEditEmployee(index)}>
//                   <FaRegEdit />
//                 </button>
//                 <button className="delete-btn" onClick={() => handleDelete(index)}>
//                   <FaTrashAlt />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button className="save-update-btn" onClick={() => console.log("Employees saved")}>
//         Save and Update
//       </button>

//       {/* Edit Popup */}
//       {popupIndex !== -1 && (
//         <EditEmployeePopup
//           employee={employees[popupIndex]}
//           onClose={handleCancelEdit}
//           onSave={(data) => handleSaveEmployee(popupIndex, data)}
//         />
//       )}

//       {/* Add Popup */}
//       {showAddPopup && (
//         <AddEmployeePopup
//           onSave={handleAddNewEmployee}
//           onClose={() => setShowAddPopup(false)}
//           defaultPic={assets.noProfilepic}
//         />
//       )}
//     </div>
//   );
// };

// export default EmployeesEditor;
