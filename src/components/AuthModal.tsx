'use client';

import React, { useState } from 'react';
import { X, User, Lock, Mail, Building, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isLoggedIn ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                {isRegister ? 'Account Created!' : 'Welcome Back!'}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Contractor pricing and saved delivery addresses are now active on your session.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#B32318] flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  {isRegister ? 'Create Contractor Account' : 'Sign In To Your Account'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Access commercial tax-exempt status, saved carts, and order history.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Company / Contractor Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Apex Electric LLC"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="contractor@business.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B32318]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B32318] hover:bg-[#991b11] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md mt-2"
                >
                  {isRegister ? 'Register Account' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-500">
                {isRegister ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(false)}
                      className="text-[#B32318] font-bold hover:underline"
                    >
                      Sign In here
                    </button>
                  </p>
                ) : (
                  <p>
                    Don&apos;t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(true)}
                      className="text-[#B32318] font-bold hover:underline"
                    >
                      Register as Contractor
                    </button>
                  </p>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
