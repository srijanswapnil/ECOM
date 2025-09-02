import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import toast from 'react-hot-toast'

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [auth, setAuth] = useAuth()

  // Get user data
  useEffect(() => {
    if (auth?.user) {
      const { email, name, phone, address } = auth.user
      setFormData(prev => ({
        ...prev,
        name: name || "",
        email: email || "",
        phone: phone || "",
        address: address || ""
      }))
    }
  }, [auth?.user])

  // Handle input changes
  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }, [])

  // Form submission function
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return
    }

    setIsLoading(true)
    
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`, 
        formData
      )
      
      if (data?.success) {
        // Update auth context
        setAuth(prevAuth => ({ 
          ...prevAuth, 
          user: data.updatedUser 
        }))
        
        // Update localStorage
        const storedAuth = JSON.parse(localStorage.getItem("auth") || "{}")
        storedAuth.user = data.updatedUser
        localStorage.setItem("auth", JSON.stringify(storedAuth))
        
        toast.success("Profile Updated Successfully")
        
        // Clear password field after successful update
        setFormData(prev => ({ ...prev, password: "" }))
      } else {
        toast.error(data.message || "Update failed")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      const errorMessage = error.response?.data?.message || "Something went wrong"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    borderRadius: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease'
  }

  const buttonStyle = {
    letterSpacing: '3px',
    borderRadius: '2px',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  }

  return (
    <Layout title="Your Profile">
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="d-flex justify-content-center">
              <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body p-4">
                  <h2 
                    className="text-center mb-4 font-weight-bold text-uppercase" 
                    style={{ letterSpacing: '2px', color: '#333' }}
                  >
                    USER PROFILE
                  </h2>
                  
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        placeholder="Enter Your Name"
                        className="form-control border-0 border-bottom bg-light"
                        style={inputStyle}
                        required
                        disabled={isLoading}
                        maxLength={50}
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        placeholder="Enter Your Email"
                        className="form-control border-0 border-bottom bg-light"
                        style={inputStyle}
                        required
                        disabled
                        title="Email cannot be changed"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        placeholder="Enter New Password (leave blank to keep current)"
                        className="form-control border-0 border-bottom bg-light"
                        style={inputStyle}
                        disabled={isLoading}
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        placeholder="Enter Your Phone"
                        className="form-control border-0 border-bottom bg-light"
                        style={inputStyle}
                        disabled={isLoading}
                        pattern="[0-9+\-\s]+"
                        maxLength={15}
                      />
                    </div>

                    <div className="mb-4">
                      <textarea
                        value={formData.address}
                        onChange={handleInputChange('address')}
                        placeholder="Enter Your Address"
                        className="form-control border-0 border-bottom bg-light"
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                        disabled={isLoading}
                        maxLength={200}
                        rows={3}
                      />
                    </div>

                    <button
                      type="submit"
                      className={`btn btn-dark w-100 py-3 font-weight-bold text-uppercase ${isLoading ? 'disabled' : ''}`}
                      style={buttonStyle}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          UPDATING...
                        </>
                      ) : (
                        'UPDATE'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile