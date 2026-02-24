import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMsg } from '@/utils/helpers';

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const from        = location.state?.from?.pathname || '/dashboard';

  const [showPw, setShowPw] = useState(false);
  const [apiErr, setApiErr] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (data) => {
    setApiErr('');
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setApiErr(getErrorMsg(err));
    }
  };

  return (
    <div className="w-full max-w-sm animate-fade-in">
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-8 lg:hidden">
        <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center">
          <span className="font-display font-black text-amber-400 text-sm">MNI</span>
        </div>
        <span className="font-display font-bold text-navy-900 text-base">Admin Panel</span>
      </div>

      <h1 className="text-2xl font-display font-bold text-navy-900 mb-1">Selamat datang</h1>
      <p className="text-sm text-obsidian-400 mb-7">Masuk untuk mengelola konten MNI.</p>

      {apiErr && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-crimson-50 border border-crimson-200 text-sm text-crimson-600 flex items-center gap-2">
          <Lock size={14} className="shrink-0" />
          {apiErr}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400" />
            <input
              type="email"
              placeholder="admin@mitraniagaindonesia.co.id"
              className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
              {...register('email', {
                required: 'Email wajib diisi',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
              })}
            />
          </div>
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Min. 6 karakter' } })}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-obsidian-600"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-navy w-full mt-1 justify-center"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><LogIn size={16} /> Masuk</>
          )}
        </button>
      </form>

      <p className="text-xs text-obsidian-400 text-center mt-6">
        Akses terbatas untuk Super Admin MNI.
      </p>
    </div>
  );
}
