import { useState, useEffect } from 'react';
import './App.css';

// Reusable Custom Floating Outlined Input Component
function FloatingInput({ label, type = 'text', value, onChange, required, error }) {
  const [focused, setFocused] = useState(false);
  const inputId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div className={`floating-input-group ${(focused || value) ? 'active' : ''}`}>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
      />
      <label htmlFor={inputId}>
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'login' | 'register' | 'profile'
  
  // Registration States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regIsAgency, setRegIsAgency] = useState('no'); // 'yes' | 'no'
  
  // Validation Errors
  const [errors, setErrors] = useState({});

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Logged-in User State
  const [currentUser, setCurrentUser] = useState(null);

  // Check if session exists in localStorage on startup
  useEffect(() => {
    const session = localStorage.getItem('popx_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
      setScreen('profile');
    }
  }, []);

  // Default Avatar Base64 or Placeholder
  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`;

  // Handle Sign-Up form submission
  const handleSignUp = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!regName.trim()) newErrors.name = 'Full Name is required';
    if (!regPhone.trim()) newErrors.phone = 'Phone number is required';
    
    // Email Validation
    if (!regEmail.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(regEmail)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password Validation
    if (!regPassword) {
      newErrors.password = 'Password is required';
    } else if (regPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem('popx_users') || '[]');
    
    // Check if user already exists
    if (existingUsers.some(u => u.email.toLowerCase() === regEmail.toLowerCase())) {
      setErrors({ email: 'This email is already registered' });
      return;
    }

    // Create new user object
    const newUser = {
      name: regName,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
      company: regCompany,
      isAgency: regIsAgency,
      avatar: defaultAvatar
    };

    existingUsers.push(newUser);
    localStorage.setItem('popx_users', JSON.stringify(existingUsers));
    
    // Set current active session
    localStorage.setItem('popx_session', JSON.stringify(newUser));
    setCurrentUser(newUser);
    
    // Reset inputs
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegPassword('');
    setRegCompany('');
    setRegIsAgency('no');
    setErrors({});
    
    // Navigate to profile
    setScreen('profile');
  };

  // Handle Login submission
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('popx_users') || '[]');
    const user = existingUsers.find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
    );

    if (user) {
      localStorage.setItem('popx_session', JSON.stringify(user));
      setCurrentUser(user);
      setLoginEmail('');
      setLoginPassword('');
      setScreen('profile');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('popx_session');
    setCurrentUser(null);
    setScreen('landing');
  };

  // Profile Picture Upload Handler
  const 
  handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...currentUser, avatar: reader.result };
        
        // Update Session
        localStorage.setItem('popx_session', JSON.stringify(updatedUser));
        
        // Update user in users list
        const existingUsers = JSON.parse(localStorage.getItem('popx_users') || '[]');
        const updatedUsersList = existingUsers.map(u => 
          u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u
        );
        localStorage.setItem('popx_users', JSON.stringify(updatedUsersList));
        
        setCurrentUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render individual screens inside the mobile wrapper
  return (
    <div className="phone-simulator">
      
      {/* LANDING SCREEN */}
      {screen === 'landing' && (
        <div className="app-screen">
          <div className="screen-content landing-content">
            <div className="landing-text-group">
              <h1 className="screen-title">Welcome to PopX</h1>
              <p className="screen-desc">
                Create an account or login to personalize your profile and manage settings.
              </p>
            </div>
            
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setScreen('register')}
            >
              Create Account
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setScreen('login')}
            >
              Already Registered? Login
            </button>
          </div>
        </div>
      )}

      {/* LOGIN SCREEN */}
      {screen === 'login' && (
        <div className="app-screen">
          <div className="screen-content">
            <h1 className="screen-title">Signin to your account</h1>
            <p className="screen-desc">
              Enter your email address and password to log in.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <FloatingInput
                label="Email Address"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <FloatingInput
                label="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              {loginError && <div className="error-msg" style={{ marginBottom: '15px' }}>{loginError}</div>}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!loginEmail || !loginPassword}
                style={{ marginTop: 'auto' }}
              >
                Login
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setLoginEmail('');
                  setLoginPassword('');
                  setLoginError('');
                  setScreen('landing');
                }}
              >
                Back to Home
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER/SIGNUP SCREEN */}
      {screen === 'register' && (
        <div className="app-screen">
          <div className="screen-content">
            <h1 className="screen-title">Create your account</h1>
            <p className="screen-desc" style={{ marginBottom: '25px' }}>
              Fill in the details below to register your account.
            </p>

            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <FloatingInput
                label="Full Name"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                error={errors.name}
              />

              <FloatingInput
                label="Phone number"
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
                error={errors.phone}
              />

              <FloatingInput
                label="Email address"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                error={errors.email}
              />

              <FloatingInput
                label="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                error={errors.password}
              />

              <FloatingInput
                label="Company name"
                type="text"
                value={regCompany}
                onChange={(e) => setRegCompany(e.target.value)}
              />

              <div className="agency-selection-label">
                Are you an agency?<span className="required-star"> *</span>
              </div>
              
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="isAgency"
                    value="yes"
                    checked={regIsAgency === 'yes'}
                    onChange={() => setRegIsAgency('yes')}
                  />
                  Yes
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="isAgency"
                    value="no"
                    checked={regIsAgency === 'no'}
                    onChange={() => setRegIsAgency('no')}
                  />
                  No
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ marginTop: 'auto' }}
              >
                Create Account
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setRegName('');
                  setRegPhone('');
                  setRegEmail('');
                  setRegPassword('');
                  setRegCompany('');
                  setRegIsAgency('no');
                  setErrors({});
                  setScreen('landing');
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE SCREEN */}
      {screen === 'profile' && currentUser && (
        <div className="app-screen">
          <div className="profile-header">
            <h2>Account Settings</h2>
          </div>

          <div className="screen-content" style={{ padding: 0 }}>
            <div className="profile-details-card">
              <div className="avatar-container">
                <img 
                  className="profile-avatar" 
                  src={currentUser.avatar || defaultAvatar} 
                  alt="Profile Avatar"
                />
                <label className="camera-badge" htmlFor="avatar-file-input">
                  <svg className="camera-icon" viewBox="0 0 24 24">
                    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </label>
                <input 
                  type="file" 
                  id="avatar-file-input" 
                  className="hidden-file-input" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="profile-info">
                <div className="profile-name">{currentUser.name}</div>
                <div className="profile-email">{currentUser.email}</div>
              </div>
            </div>

            <p className="profile-bio">
              Welcome to your PopX profile. You can upload a new profile photo by clicking the camera icon above or log out using the button below.
            </p>

            <hr className="profile-divider" />

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{ margin: 'auto 20px 20px 20px', width: 'auto' }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

