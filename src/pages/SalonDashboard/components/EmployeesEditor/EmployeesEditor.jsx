import React, { useState } from 'react';
import { FaRegEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { assets } from '../../../../assets/assets'; 
import EditableField from '../../../../components/EditableField/EditableField';
import './EmployeesEditor.css';

const EmployeesEditor = () => {
  const [employees, setEmployees] = useState([
    { name: 'Ruwan', contact_no: '0777777777', profilePic: assets.noProfilepic },
    { name: 'Ruwan', contact_no: '0777777777', profilePic: assets.noProfilepic },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', contact_no: '', profilePic: assets.noProfilepic });
  const [editingIndex, setEditingIndex] = useState(-1);

  const handleDelete = (index) => {
    const updated = [...employees];
    updated.splice(index, 1);
    setEmployees(updated);
  };

  const addNewEmployee = () => {
    setIsAdding(true);
    setNewEmployee({ name: '', contact_no: '', profilePic: assets.noProfilepic });
  };

  const handleSaveNewEmployee = () => {
    if (newEmployee.name && newEmployee.contact_no) {
      setEmployees([...employees, {
        name: newEmployee.name,
        contact_no: newEmployee.contact_no,
        profilePic: newEmployee.profilePic
      }]);
      setIsAdding(false);
      setNewEmployee({ name: '', contact_no: '', profilePic: assets.noProfilepic });
    }
  };

  const handleCancelNewEmployee = () => {
    setIsAdding(false);
    setNewEmployee({ name: '', contact_no: '', profilePic: assets.noProfilepic });
  };

  const handleNewEmployeeChange = (field, value) => {
    setNewEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePicChange = (event, isNew = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isNew) {
          setNewEmployee(prev => ({ ...prev, profilePic: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditEmployee = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEmployee = (index, field, value) => {
    const updated = [...employees];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEmployees(updated);
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
  };

  return (
    <div className="employees-container">
      <h3>Employees</h3>

      <table className="employees-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="add-employee-row">
            <td colSpan={4}>
              <button 
                className="add-employee-btn" 
                onClick={addNewEmployee}
                disabled={isAdding}
              >
                + Add Employee
              </button>
            </td>
          </tr>
          
          {isAdding && (
            <tr className="new-employee-row">
              <td className="profile-cell">
                <div className="profile-upload">
                  <img src={newEmployee.profilePic} alt="Profile" className="employee-avatar" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProfilePicChange(e, true)}
                    className="profile-input"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="profile-edit-btn">
                    📷
                  </label>
                </div>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Employee name"
                  value={newEmployee.name}
                  onChange={(e) => handleNewEmployeeChange('name', e.target.value)}
                  className="employee-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={newEmployee.contact_no}
                  onChange={(e) => handleNewEmployeeChange('contact_no', e.target.value)}
                  className="employee-input"
                />
              </td>
              <td className="action-buttons-employee">
                <button className="save-btn" onClick={handleSaveNewEmployee}>
                  <FaCheck />
                </button>
                <button className="cancel-btn" onClick={handleCancelNewEmployee}>
                  <FaTimes />
                </button>
              </td>
            </tr>
          )}
          
          {employees.map((employee, index) => (
            <tr key={index} className={editingIndex === index ? 'editing-row' : 'employee-row'}>
              <td className="profile-cell">
                <img src={employee.profilePic} alt="Profile" className="employee-avatar" />
              </td>
              <td className="name-cell">
                <EditableField
                  value={employee.name}
                  onSave={(value) => handleSaveEmployee(index, 'name', value)}
                  className={`table-editable ${editingIndex === index ? 'editing-enabled' : 'editing-disabled'}`}
                />
              </td>
              <td className="contact-cell">
                <EditableField
                  value={employee.contact_no}
                  onSave={(value) => handleSaveEmployee(index, 'contact_no', value)}
                  className={`table-editable ${editingIndex === index ? 'editing-enabled' : 'editing-disabled'}`}
                />
              </td>
              <td className="action-buttons-employee">
                {editingIndex === index ? (
                  <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                    <FaTimes />
                  </button>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEditEmployee(index)}>
                      <FaRegEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="save-update-btn" onClick={() => {console.log("Employees saved")}}>Save and Update</button>
    </div>
  );
};

export default EmployeesEditor;