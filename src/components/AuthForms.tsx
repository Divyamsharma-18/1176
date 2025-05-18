import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface AuthFormsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}



const AuthForms: React.FC<AuthFormsProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { login, register, isLoading } = useAuth();

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};
    if (!loginForm.email) errors.email = 'Email is required';
    if (!loginForm.password) errors.password = 'Password is required';
    return errors;
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};
    if (!registerForm.username) errors.username = 'Username is required';
    if (!registerForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) errors.email = 'Invalid email';
    if (!registerForm.password) errors.password = 'Password is required';
    else if (registerForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (registerForm.password !== registerForm.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
    return errors;
  };


 const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const errors = validateLoginForm();
  setFormErrors(errors);
  setServerError(null);

  if (Object.keys(errors).length === 0) {
    try {
      await login({
        email: loginForm.email,
        password: loginForm.password,
      });

      onClose(); // Close modal only after successful login
    } catch (error: any) {
      console.error('Login error:', error);
      setServerError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  }
};



  
  

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegisterForm();
    setFormErrors(errors);
    setServerError(null);

    if (Object.keys(errors).length === 0) {
      try {
        await register({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        });
        onClose();
      } catch (error: any) {
        setServerError(error.response?.data?.message || 'Registration failed. Try a different email.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0a1128] border border-blue-900/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-blue-300">Welcome Trainer!</DialogTitle>
          <DialogDescription className="text-blue-100/70">
            Join Hyathi's Pokémon Adoption Center to adopt and care for Pokémon.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 bg-blue-900/30">
            <TabsTrigger value="login" className="data-[state=active]:bg-blue-800/50">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-blue-800/50">Register</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4">
              <InputWithLabel
                id="login-email"
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(val) => setLoginForm({ ...loginForm, email: val })}
                error={formErrors.email}
              />
              <InputWithLabel
                id="login-password"
                label="Password"
                type="password"
                value={loginForm.password}
                onChange={(val) => setLoginForm({ ...loginForm, password: val })}
                error={formErrors.password}
              />
              {serverError && <p className="text-red-400 text-sm text-center">{serverError}</p>}
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <SwitchTabMessage message="Don't have an account?" switchTo="register" setTab={setActiveTab} />
            </form>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
              <InputWithLabel
                id="register-username"
                label="Username"
                value={registerForm.username}
                onChange={(val) => setRegisterForm({ ...registerForm, username: val })}
                error={formErrors.username}
              />
              <InputWithLabel
                id="register-email"
                label="Email"
                type="email"
                value={registerForm.email}
                onChange={(val) => setRegisterForm({ ...registerForm, email: val })}
                error={formErrors.email}
              />
              <InputWithLabel
                id="register-password"
                label="Password"
                type="password"
                value={registerForm.password}
                onChange={(val) => setRegisterForm({ ...registerForm, password: val })}
                error={formErrors.password}
              />
              <InputWithLabel
                id="register-confirm-password"
                label="Confirm Password"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(val) => setRegisterForm({ ...registerForm, confirmPassword: val })}
                error={formErrors.confirmPassword}
              />
              {serverError && <p className="text-red-400 text-sm text-center">{serverError}</p>}
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
              <SwitchTabMessage message="Already have an account?" switchTo="login" setTab={setActiveTab} />
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const InputWithLabel = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-blue-200">{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-blue-900/30 border-blue-800 text-white"
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const SwitchTabMessage = ({
  message,
  switchTo,
  setTab,
}: {
  message: string;
  switchTo: 'login' | 'register';
  setTab: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
}) => (
  <p className="text-center text-sm text-blue-200/70">
    {message}{' '}
    <button
      type="button"
      onClick={() => setTab(switchTo)}
      className="text-pokemon-yellow hover:underline"
    >
      {switchTo === 'login' ? 'Login' : 'Register'}
    </button>
  </p>
);

export default AuthForms;
