
import React, { useState } from 'react';
import BlackButton from './componants/blackbutton';
import './Signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.contact.trim()) newErrors.contact = 'Contact number is required';
    else if (!/^\d{10}$/.test(form.contact)) newErrors.contact = 'Enter a valid 10-digit number';

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email format is invalid';

    if (!form.password)
      newErrors.password = 'Password is required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(form.password))
      newErrors.password = 'Password must contain upper, lower case letters and a number (min 6 chars)';

    if (!form.confirmPassword)
      newErrors.confirmPassword = 'Please confirm password';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', form);
      // Add actual signup logic here
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Contact Number</label>
        <input type="text" name="contact" value={form.contact} onChange={handleChange} />
        {errors.contact && <span className="error">{errors.contact}</span>}

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

        <BlackButton type="submit">Sign Up</BlackButton>

        <p className="redirect-text">Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
};

export default Signup;
