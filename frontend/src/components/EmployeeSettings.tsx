import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiFolder, 
  FiUsers, 
  FiSettings, 
  FiHelpCircle, 
  FiMenu, 
  FiChevronDown, 
  FiPlus, 
  FiTrash2, 
  FiSave,
  FiEdit2
} from 'react-icons/fi';
import { api, type Employee } from '../lib/supabase';
import './Dashboard.css';
import './EmployeeSettings.css';

// Using the Employee interface from supabase.ts

const EmployeeSettings: React.FC = () => {
  const navigate = useNavigate();
  const [showDepartmentPopup, setShowDepartmentPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    employee_id: string;
    salary: number;
    department: 'grading' | 'cutting';
  }>({ 
    name: '', 
    employee_id: '',
    salary: 0,
    department: 'grading' 
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState<{show: boolean; department: 'grading' | 'cutting'}>({show: false, department: 'grading'});

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowDepartmentPopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const data = await api.employees.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Using _ to indicate the parameter is intentionally unused
  const handleDepartmentSelect = (_department: string) => {
    setShowDepartmentPopup(false);
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.employee_id.trim()) {
      setApiError('Name and Employee ID are required');
      return;
    }

    try {
      setApiError(null);
      
      // Prepare the employee data based on department
      const employeeData = showAddPopup.department === 'grading'
        ? {
            name: newEmployee.name.trim(),
            employeeId: newEmployee.employee_id.trim(),
            salary: Number(newEmployee.salary) || 0,
            department: 'grading' as const
          }
        : {
            name: newEmployee.name.trim(),
            employeeId: newEmployee.employee_id.trim(),
            department: 'cutting' as const,
            salary: 0 // Default value that will be ignored by the backend for cutting department
          };

      // Create the employee and wait for the response
      const response = await api.employees.create({
        ...employeeData,
        // Ensure we always send a number for salary to match the API type
        salary: employeeData.salary || 0
      });
      
      // Update the local state with the response from the server
      // This ensures we have all the correct data including any server-generated fields
      setEmployees(prevEmployees => [response, ...prevEmployees]);
      
      // Reset the form
      setNewEmployee({ 
        name: '', 
        employee_id: '', 
        salary: 0, 
        department: showAddPopup.department 
      });
      
      // Close the popup
      setShowAddPopup(prev => ({...prev, show: false}));
      
      // Refresh the employee list to ensure we have the most up-to-date data
      // This is a fallback in case the response doesn't match our expectations
      await fetchEmployees();
      
    } catch (error) {
      console.error('Error adding employee:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to add employee');
    }
  };

  const openAddPopup = (department: 'grading' | 'cutting') => {
    setNewEmployee({ 
      name: '', 
      employee_id: '', 
      salary: 0, 
      department 
    });
    setShowAddPopup({show: true, department});
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    
    try {
      setApiError(null);
      await api.employees.delete(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to delete employee');
    }
  };

  const startEditing = (employee: Employee) => {
    setEditingId(employee.id);
  };

  const handleUpdateEmployee = async (id: string, field: 'name' | 'employee_id' | 'salary', value: string | number) => {
    try {
      const employeeToUpdate = employees.find(emp => emp.id === id);
      if (!employeeToUpdate) return;

      const updatedEmployee = { 
        ...employeeToUpdate, 
        [field]: field === 'salary' ? Number(value) || 0 : value 
      };
      
      // Don't send update if nothing changed
      if (JSON.stringify(employeeToUpdate) === JSON.stringify(updatedEmployee)) {
        return;
      }

      setApiError(null);
      const updated = await api.employees.update(id, {
        name: updatedEmployee.name.trim(),
        employeeId: updatedEmployee.employee_id.trim(),
        salary: Number(updatedEmployee.salary) || 0,
        department: updatedEmployee.department as 'grading' | 'cutting'
      });
      
      setEmployees(employees.map(emp => 
        emp.id === id ? { ...updated, isEditing: false } : emp
      ));
    } catch (error) {
      console.error('Error updating employee:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to update employee');
      // Revert the change in UI on error
      fetchEmployees();
    }
  };

  const saveChanges = () => {
    setEditingId(null);
  };

  const filteredEmployees = (department: 'grading' | 'cutting') => {
    if (loading) return [];
    return employees.filter(emp => emp.department === department);
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <FiMenu className="menu-icon" />
          <h2>Logo</h2>
        </div>
        <nav className="nav-menu">
          <ul>
            <li onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              <FiHome className="icon" />
              <span>Dashboard</span>
            </li>
            <li 
              className={`nav-item ${showDepartmentPopup ? 'active' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                setShowDepartmentPopup(!showDepartmentPopup);
              }}
            >
              <FiUsers className="icon" />
              <span>Daily Work Logs</span>
              <FiChevronDown className="chevron-icon" />
              {showDepartmentPopup && (
                <div className="department-popup" ref={popupRef}>
                  <div className="popup-arrow"></div>
                  <div 
                    className="popup-item" 
                    onClick={() => handleDepartmentSelect('cutting')}
                  >
                    Cutting
                  </div>
                  <div 
                    className="popup-item" 
                    onClick={() => handleDepartmentSelect('grading')}
                  >
                    Grading
                  </div>
                </div>
              )}
            </li>
            <li className="active" onClick={() => navigate('/employee-settings')} style={{ cursor: 'pointer' }}>
              <FiFolder className="icon" />
              <span>Employee Settings</span>
            </li>
            <li>
              <FiSettings className="icon" />
              <span>Settings</span>
            </li>
            <li className="help">
              <FiHelpCircle className="icon" />
              <span>Help</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="sections-container">
          {/* Grading Section */}
          <section className="department-section">
            <div className="section-header">
              <h2>Grading Section</h2>
            </div>
            <div className="section-content">
              <div className="add-employee-button-container">
                <button 
                  className="add-button"
                  onClick={() => openAddPopup('grading')}
                >
                  <FiPlus /> Add Employee
                </button>
              </div>
              
              <div className="employee-table-container">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Employee ID</th>
                      <th>Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees('grading').length > 0 ? (
                      filteredEmployees('grading').map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            {editingId === employee.id ? (
                              <input
                                type="text"
                                value={employee.name}
                                onChange={(e) => handleUpdateEmployee(employee.id, 'name', e.target.value)}
                              />
                            ) : (
                              employee.name
                            )}
                          </td>
                          <td>
                            {editingId === employee.id ? (
                              <input
                                type="text"
                                value={employee.employee_id}
                                onChange={(e) => handleUpdateEmployee(employee.id, 'employee_id', e.target.value)}
                              />
                            ) : (
                              employee.employee_id
                            )}
                          </td>
                          <td>
                            {editingId === employee.id ? (
                              <input
                                type="number"
                                value={employee.salary}
                                onChange={(e) => handleUpdateEmployee(employee.id, 'salary', parseFloat(e.target.value) || 0)}
                              />
                            ) : (
                              employee.salary.toFixed(2)
                            )}
                          </td>
                          <td className="actions">
                            {editingId === employee.id ? (
                              <button onClick={saveChanges} className="icon-button">
                                <FiSave />
                              </button>
                            ) : (
                              <button onClick={() => startEditing(employee)} className="icon-button">
                                <FiEdit2 />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="icon-button delete"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="no-data">No employees added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Cutting Section */}
          <section className="department-section">
            <div className="section-header">
              <h2>Cutting Section</h2>
            </div>
            <div className="section-content">
              <div className="add-employee-button-container">
                <button 
                  className="add-button"
                  onClick={() => openAddPopup('cutting')}
                >
                  <FiPlus /> Add Employee
                </button>
              </div>
              
              <div className="employee-table-container">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Employee ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees('cutting').length > 0 ? (
                      filteredEmployees('cutting').map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            {editingId === employee.id ? (
                              <input
                                type="text"
                                value={employee.name}
                                onChange={(e) => handleUpdateEmployee(employee.id, 'name', e.target.value)}
                              />
                            ) : (
                              employee.name
                            )}
                          </td>
                          <td>
                            {editingId === employee.id ? (
                              <input
                                type="text"
                                value={employee.employee_id}
                                onChange={(e) => handleUpdateEmployee(employee.id, 'employee_id', e.target.value)}
                              />
                            ) : (
                              employee.employee_id
                            )}
                          </td>
                          <td className="actions">
                            {editingId === employee.id ? (
                              <button onClick={saveChanges} className="icon-button">
                                <FiSave />
                              </button>
                            ) : (
                              <button onClick={() => startEditing(employee)} className="icon-button">
                                <FiEdit2 />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="icon-button delete"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="no-data">No employees added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Add Employee Popup */}
      {showAddPopup.show && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add New Employee ({showAddPopup.department})</h3>
            <div className="employee-form">
              <input
                type="text"
                placeholder="Employee Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                autoFocus
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={newEmployee.employee_id}
                onChange={(e) => setNewEmployee({...newEmployee, employee_id: e.target.value})}
              />
              {showAddPopup.department === 'grading' && (
                <input
                  type="number"
                  placeholder="Salary"
                  value={newEmployee.salary || ''}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: parseFloat(e.target.value) || 0})}
                />
              )}
              <div className="popup-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => setShowAddPopup({...showAddPopup, show: false})}
                >
                  Cancel
                </button>
                <button 
                  className="add-button"
                  onClick={handleAddEmployee}
                  disabled={!newEmployee.name.trim() || !newEmployee.employee_id.trim()}
                >
                  <FiPlus /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSettings;
