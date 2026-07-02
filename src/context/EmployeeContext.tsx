import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
  joinDate: string;
  salary: number;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  budget: number;
}

interface EmployeeContextType {
  employees: Employee[];
  departments: Department[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  deleteDepartment: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const initialEmployees: Employee[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex.rivera@company.com', role: 'Lead Architect', department: 'Engineering', status: 'Active', joinDate: '2023-01-15', salary: 115000 },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Senior UX Designer', department: 'Design', status: 'Active', joinDate: '2023-06-10', salary: 98000 },
  { id: '3', name: 'Marcus Johnson', email: 'marcus.j@company.com', role: 'Product Manager', department: 'Product', status: 'Active', joinDate: '2022-11-01', salary: 105000 },
  { id: '4', name: 'Elena Rostova', email: 'elena.r@company.com', role: 'DevOps Engineer', department: 'Engineering', status: 'Active', joinDate: '2024-02-18', salary: 95000 },
  { id: '5', name: 'David Kim', email: 'david.kim@company.com', role: 'HR Manager', department: 'HR', status: 'Active', joinDate: '2021-08-24', salary: 85000 },
  { id: '6', name: 'Emily Watson', email: 'emily.w@company.com', role: 'Marketing Specialist', department: 'Marketing', status: 'On Leave', joinDate: '2023-09-05', salary: 72000 },
  { id: '7', name: 'James Carter', email: 'james.c@company.com', role: 'QA Lead', department: 'Engineering', status: 'Active', joinDate: '2022-04-12', salary: 88000 },
  { id: '8', name: 'Sophia Martinez', email: 'sophia.m@company.com', role: 'Financial Analyst', department: 'Finance', status: 'Active', joinDate: '2023-11-20', salary: 92000 }
];

const initialDepartments: Department[] = [
  { id: 'd1', name: 'Engineering', manager: 'Alex Rivera', budget: 1200000 },
  { id: 'd2', name: 'Design', manager: 'Sarah Chen', budget: 450000 },
  { id: 'd3', name: 'Product', manager: 'Marcus Johnson', budget: 500000 },
  { id: 'd4', name: 'HR', manager: 'David Kim', budget: 200000 },
  { id: 'd5', name: 'Marketing', manager: 'Emma Stone', budget: 350000 },
  { id: 'd6', name: 'Finance', manager: 'Sophia Martinez', budget: 300000 }
];

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const localData = localStorage.getItem('ems_employees');
    return localData ? JSON.parse(localData) : initialEmployees;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const localData = localStorage.getItem('ems_departments');
    return localData ? JSON.parse(localData) : initialDepartments;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const localTheme = localStorage.getItem('ems_theme');
    return (localTheme as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('ems_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('ems_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('ems_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...emp,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedFields } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...dept,
      id: Math.random().toString(36).substr(2, 9)
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        departments,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDepartment,
        deleteDepartment,
        theme,
        toggleTheme
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};
