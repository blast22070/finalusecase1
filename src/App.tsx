import React, { useState } from 'react';
import { useEmployee } from './context/EmployeeContext';
import type { Employee } from './context/EmployeeContext';
import { 
  Users, 
  LayoutDashboard, 
  Briefcase, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Sun, 
  Moon, 
  DollarSign, 
  UserCheck, 
  UserMinus,
  X,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning';
}

export const App: React.FC = () => {
  const { 
    employees, 
    departments, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    addDepartment,
    deleteDepartment,
    theme, 
    toggleTheme 
  } = useEmployee();

  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'departments'>('dashboard');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  // Form State - Employee
  const [empForm, setEmpForm] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    status: 'Active' as Employee['status'],
    joinDate: new Date().toISOString().split('T')[0],
    salary: 60000
  });

  // Form State - Department
  const [deptForm, setDeptForm] = useState({
    name: '',
    manager: '',
    budget: 100000
  });

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Open Add Employee Modal
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setEmpForm({
      name: '',
      email: '',
      role: '',
      department: departments[0]?.name || 'Engineering',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      salary: 60000
    });
    setIsEmployeeModalOpen(true);
  };

  // Open Edit Employee Modal
  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmpForm({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      status: emp.status,
      joinDate: emp.joinDate,
      salary: emp.salary
    });
    setIsEmployeeModalOpen(true);
  };

  // Submit Employee Form
  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.email || !empForm.role) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, empForm);
      showToast(`Employee "${empForm.name}" updated successfully`, 'success');
    } else {
      addEmployee(empForm);
      showToast(`Employee "${empForm.name}" added successfully`, 'success');
    }
    setIsEmployeeModalOpen(false);
  };

  // Delete Employee
  const handleDeleteEmployee = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteEmployee(id);
      showToast(`Employee "${name}" has been deleted`, 'danger');
    }
  };

  // Submit Department Form
  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.manager) {
      showToast('Please fill out all department fields', 'warning');
      return;
    }

    addDepartment(deptForm);
    showToast(`Department "${deptForm.name}" created`, 'success');
    setIsDeptModalOpen(false);
    setDeptForm({ name: '', manager: '', budget: 150000 });
  };

  // Delete Department
  const handleDeleteDept = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the ${name} department?`)) {
      deleteDepartment(id);
      showToast(`Department "${name}" deleted`, 'danger');
    }
  };

  // Calculations for Stats
  const totalEmployeesCount = employees.length;
  const activeEmployeesCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const averageSalary = totalEmployeesCount > 0 
    ? Math.round(employees.reduce((acc, curr) => acc + curr.salary, 0) / totalEmployeesCount)
    : 0;

  // Filtered employees list
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === '' || emp.department === deptFilter;
    const matchesStatus = statusFilter === '' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate salary per department for pure CSS chart
  const deptSalaryStats = departments.map(d => {
    const deptEmps = employees.filter(e => e.department === d.name);
    const totalSalary = deptEmps.reduce((acc, curr) => acc + curr.salary, 0);
    const avgSalary = deptEmps.length > 0 ? Math.round(totalSalary / deptEmps.length) : 0;
    return {
      name: d.name,
      avg: avgSalary,
      count: deptEmps.length
    };
  });

  const maxAvgSalary = Math.max(...deptSalaryStats.map(s => s.avg), 1);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Briefcase size={24} />
          <span>TalentFlow EMS</span>
        </div>
        <ul className="sidebar-menu">
          <li>
            <div 
              className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </li>
          <li>
            <div 
              className={`sidebar-item ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              <Users size={20} />
              <span>Employees</span>
            </div>
          </li>
          <li>
            <div 
              className={`sidebar-item ${activeTab === 'departments' ? 'active' : ''}`}
              onClick={() => setActiveTab('departments')}
            >
              <Briefcase size={20} />
              <span>Departments</span>
            </div>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Info size={14} />
            <span>v1.0.0 (AKS Ready)</span>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="main-content">
        {/* Header Section */}
        <header className="header-bar">
          <div className="header-title">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'employees' && 'Employee Directory'}
              {activeTab === 'departments' && 'Departments'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Real-time corporate insights & analytics.'}
              {activeTab === 'employees' && `Managing ${filteredEmployees.length} of ${totalEmployeesCount} members.`}
              {activeTab === 'departments' && `Managing ${departments.length} enterprise departments.`}
            </p>
          </div>
          <div className="header-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {activeTab === 'employees' && (
              <button className="btn btn-primary" onClick={handleOpenAddModal}>
                <Plus size={16} /> Add Employee
              </button>
            )}
            {activeTab === 'departments' && (
              <button className="btn btn-primary" onClick={() => setIsDeptModalOpen(true)}>
                <Plus size={16} /> New Department
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <h3>{totalEmployeesCount}</h3>
                  <p>Total Employees</p>
                </div>
                <div className="stat-icon blue">
                  <Users size={24} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>{activeEmployeesCount}</h3>
                  <p>Active Staff</p>
                </div>
                <div className="stat-icon green">
                  <UserCheck size={24} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>{onLeaveCount}</h3>
                  <p>On Leave</p>
                </div>
                <div className="stat-icon orange">
                  <UserMinus size={24} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>${averageSalary.toLocaleString()}</h3>
                  <p>Average Salary</p>
                </div>
                <div className="stat-icon red">
                  <DollarSign size={24} />
                </div>
              </div>
            </div>

            {/* Dashboard Visualizations */}
            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Average Salary by Department</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USD / Year</span>
                </div>
                <div className="chart-container">
                  {deptSalaryStats.map((stat, index) => {
                    const heightPercent = (stat.avg / maxAvgSalary) * 100;
                    return (
                      <div key={index} className="chart-bar-wrapper">
                        <div 
                          className="chart-bar" 
                          style={{ height: `${heightPercent || 5}%` }}
                          data-value={`$${stat.avg.toLocaleString()}`}
                        />
                        <span className="chart-label">{stat.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Staff Breakdown</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {departments.map((dept, index) => {
                    const count = employees.filter(e => e.department === dept.name).length;
                    const percentage = totalEmployeesCount > 0 ? (count / totalEmployeesCount) * 100 : 0;
                    return (
                      <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 500 }}>{dept.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{count} ({Math.round(percentage)}%)</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percentage}%`, background: 'var(--accent-gradient)', borderRadius: '4px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Employees Table snippet */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Joiners</h2>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => setActiveTab('employees')}>
                  View All
                </button>
              </div>
              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="ems-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Join Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.slice(0, 3).map((emp) => (
                        <tr key={emp.id}>
                          <td>
                            <div className="employee-profile">
                              <div className="employee-avatar">
                                {emp.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="employee-details">
                                <span className="employee-name">{emp.name}</span>
                                <span className="employee-email">{emp.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>{emp.role}</td>
                          <td>{emp.department}</td>
                          <td>{emp.joinDate}</td>
                          <td>
                            <span className={`badge ${
                              emp.status === 'Active' ? 'badge-success' : 
                              emp.status === 'On Leave' ? 'badge-warning' : 
                              emp.status === 'Suspended' ? 'badge-danger' : 'badge-info'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Employees Directory Tab */}
        {activeTab === 'employees' && (
          <>
            {/* Filter controls */}
            <div className="filters-bar">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search name, email, role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                className="filter-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            {/* Employee Table */}
            <div className="table-wrapper">
              <div className="table-responsive">
                <table className="ems-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Salary</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => (
                        <tr key={emp.id}>
                          <td>
                            <div className="employee-profile">
                              <div className="employee-avatar">
                                {emp.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="employee-details">
                                <span className="employee-name">{emp.name}</span>
                                <span className="employee-email">{emp.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>{emp.role}</td>
                          <td>{emp.department}</td>
                          <td>${emp.salary.toLocaleString()}</td>
                          <td>{emp.joinDate}</td>
                          <td>
                            <span className={`badge ${
                              emp.status === 'Active' ? 'badge-success' : 
                              emp.status === 'On Leave' ? 'badge-warning' : 
                              emp.status === 'Suspended' ? 'badge-danger' : 'badge-info'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="action-btn edit" 
                                title="Edit employee"
                                onClick={() => handleOpenEditModal(emp)}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                className="action-btn delete" 
                                title="Delete employee"
                                onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          No employees match the specified filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Departments Tab */}
        {activeTab === 'departments' && (
          <div className="dept-grid">
            {departments.map((dept) => {
              const deptEmps = employees.filter(e => e.department === dept.name);
              const deptBudgetUsed = deptEmps.reduce((acc, curr) => acc + curr.salary, 0);
              const budgetUsagePercent = dept.budget > 0 ? (deptBudgetUsed / dept.budget) * 100 : 0;
              
              return (
                <div key={dept.id} className="dept-card">
                  <div className="dept-header">
                    <h3 className="dept-title">{dept.name}</h3>
                    <button 
                      className="action-btn delete" 
                      title="Delete department"
                      onClick={() => handleDeleteDept(dept.id, dept.name)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Manager:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dept.manager}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Headcount:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{deptEmps.length} members</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Budget Usage:</span>
                      <span>${deptBudgetUsed.toLocaleString()} / ${dept.budget.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${Math.min(budgetUsagePercent, 100)}%`, 
                          backgroundColor: budgetUsagePercent > 100 ? 'var(--danger)' : 'var(--success)', 
                          borderRadius: '3px' 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Employee Add/Edit Modal */}
      {isEmployeeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingEmployee ? 'Edit Employee Profile' : 'Register New Employee'}
              </h2>
              <button 
                className="action-btn" 
                onClick={() => setIsEmployeeModalOpen(false)}
                style={{ width: '32px', height: '32px' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEmployeeSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. John Doe"
                    required
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="e.g. john.doe@company.com"
                    required
                    value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                  />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Frontend Architect"
                      required
                      value={empForm.role}
                      onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Salary (USD/year) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required
                      value={empForm.salary}
                      onChange={(e) => setEmpForm({ ...empForm, salary: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Department</label>
                    <select 
                      className="form-control"
                      value={empForm.department}
                      onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      className="form-control"
                      value={empForm.status}
                      onChange={(e) => setEmpForm({ ...empForm, status: e.target.value as Employee['status'] })}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Join Date</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={empForm.joinDate}
                    onChange={(e) => setEmpForm({ ...empForm, joinDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEmployeeModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Save Changes' : 'Register Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Add Modal */}
      {isDeptModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create Department</h2>
              <button 
                className="action-btn" 
                onClick={() => setIsDeptModalOpen(false)}
                style={{ width: '32px', height: '32px' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleDeptSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Department Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sales, Marketing"
                    required
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Department Manager *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sarah Chen"
                    required
                    value={deptForm.manager}
                    onChange={(e) => setDeptForm({ ...deptForm, manager: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Annual Budget (USD) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    required
                    value={deptForm.budget}
                    onChange={(e) => setDeptForm({ ...deptForm, budget: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsDeptModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
            {toast.type === 'warning' && <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />}
            {toast.type === 'danger' && <X size={18} style={{ color: 'var(--danger)' }} />}
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
