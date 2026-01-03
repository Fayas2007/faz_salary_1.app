import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://syhaehnetprrmosoaorr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aGFlaG5ldHBycm1vc29hb3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MTk4MDEsImV4cCI6MjA4Mjk5NTgwMX0.KWWcSnYbISikVpIh_D8bnGMgFLTdq2_8OXdvwDr0ZfE';

export const supabase = createClient(supabaseUrl, supabaseKey);

// API base URL
const API_URL = 'http://localhost:5000/api';

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong');
    Object.assign(error, { response, data });
    throw error;
  }
  return data;
}

export const api = {
  // Employee CRUD operations
  employees: {
    getAll: async (): Promise<Employee[]> => {
      const response = await fetch(`${API_URL}/employees`);
      return handleResponse(response);
    },
    getByDepartment: async (department: string): Promise<Employee[]> => {
      const response = await fetch(`${API_URL}/employees/department/${department}`);
      return handleResponse(response);
    },
    create: async (employee: { 
      name: string; 
      employeeId: string; 
      salary: number; 
      department: string 
    }): Promise<Employee> => {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...employee,
          salary: Number(employee.salary) || 0,
        }),
      });
      return handleResponse(response);
    },
    update: async (id: string, employee: { 
      name: string; 
      employeeId: string; 
      salary: number; 
      department: string 
    }): Promise<Employee> => {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...employee,
          salary: Number(employee.salary) || 0,
        }),
      });
      return handleResponse(response);
    },
    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        await handleResponse(response);
      }
    },
  },
};

// Add TypeScript interface for Employee
export interface Employee {
  id: string;
  name: string;
  employee_id: string;
  salary: number;
  department: string;
  created_at?: string;
  updated_at?: string;
}
