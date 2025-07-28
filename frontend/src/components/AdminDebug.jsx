// src/components/AdminDebug.js

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminDebug = () => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            minHeight: '100vh',
            fontFamily: 'monospace'
        }}>
            <h1 style={{ color: '#dc3545', marginBottom: '30px' }}>
                🔧 ADMIN DEBUG PANEL
            </h1>
            
            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #dee2e6'
            }}>
                <h3 style={{ color: '#495057' }}>📊 Auth Context State</h3>
                <div style={{ marginLeft: '20px' }}>
                    <p><strong>Loading:</strong> {loading ? '✅ TRUE' : '❌ FALSE'}</p>
                    <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ TRUE' : '❌ FALSE'}</p>
                    <p><strong>User exists:</strong> {user ? '✅ TRUE' : '❌ FALSE'}</p>
                    {user && (
                        <div>
                            <p><strong>User Role:</strong> {user.role}</p>
                            <p><strong>User Email:</strong> {user.email}</p>
                            <p><strong>User ID:</strong> {user.id}</p>
                            <p><strong>Role Type:</strong> {typeof user.role}</p>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #dee2e6'
            }}>
                <h3 style={{ color: '#495057' }}>🧭 Navigation Info</h3>
                <div style={{ marginLeft: '20px' }}>
                    <p><strong>Current Path:</strong> {location.pathname}</p>
                    <p><strong>Current Search:</strong> {location.search}</p>
                    <p><strong>Location State:</strong> {JSON.stringify(location.state)}</p>
                </div>
            </div>

            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #dee2e6'
            }}>
                <h3 style={{ color: '#495057' }}>🧪 Quick Tests</h3>
                <div style={{ marginLeft: '20px' }}>
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        style={{ 
                            margin: '5px', 
                            padding: '10px 15px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Navigate to /admin/dashboard
                    </button>
                    <button 
                        onClick={() => navigate('/test-admin-simple')}
                        style={{ 
                            margin: '5px', 
                            padding: '10px 15px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Test Simple Route
                    </button>
                    <button 
                        onClick={() => navigate('/test-admin-protected')}
                        style={{ 
                            margin: '5px', 
                            padding: '10px 15px',
                            backgroundColor: '#ffc107',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Test Protected Route
                    </button>
                </div>
            </div>

            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h3 style={{ color: '#495057' }}>📋 Full User Object</h3>
                <pre style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px'
                }}>
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default AdminDebug;