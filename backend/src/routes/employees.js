const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Get all employees
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch employees',
      code: error.code
    });
  }
});

// Get employees by department
router.get('/department/:dept', async (req, res) => {
  try {
    const { dept } = req.params;
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('department', dept)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(`Error fetching employees for department ${req.params.dept}:`, error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch department employees',
      code: error.code
    });
  }
});

// Add new employee
router.post('/', async (req, res) => {
  try {
    const { name, employeeId, salary, department } = req.body;
    
    console.log('Adding employee:', { name, employeeId, salary, department });
    
    const { data, error } = await supabase
      .from('employees')
      .insert([
        { 
          name: name.trim(),
          employee_id: employeeId.trim(),
          salary: parseFloat(salary) || 0,
          department: department.toLowerCase()
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.error('No data returned from insert');
      return res.status(500).json({ error: 'No data returned from insert' });
    }
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Unexpected error in POST /api/employees:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, employeeId, salary, department } = req.body;
    
    const { data, error } = await supabase
      .from('employees')
      .update({
        name: name?.trim(),
        employee_id: employeeId?.trim(),
        salary: parseFloat(salary) || 0,
        department: department?.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(`Error updating employee ${req.params.id}:`, error);
    res.status(500).json({ 
      error: error.message || 'Failed to update employee',
      code: error.code
    });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting employee ${req.params.id}:`, error);
    res.status(500).json({ 
      error: error.message || 'Failed to delete employee',
      code: error.code
    });
  }
});

module.exports = router;
