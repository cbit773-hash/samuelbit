import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Shield, Copy, Check, Loader2, Eye, EyeOff, CircleCheck } from 'lucide-react';

import { useAuthStore } from '../../../auth/store/auth.store';

import { CLIENT_PATHS } from '../../../../shared/routing/paths';

import { PERU_REGISTRO_POST } from '../../../../shared/copy/peru';

import { validatePasswordPolicy } from '../../../../shared/utils/password';

import {
  captacionInputClass,
  captacionLabelClass,
  registroCardClass,
  registroCtaClass,
} from './captacion-styles';



interface GeneratedPasswordRevealProps {

  password: string;

  email: string;

  firstName: string;

}



export function GeneratedPasswordReveal({ password, email, firstName }: GeneratedPasswordRevealProps) {

  const navigate = useNavigate();

  const updatePassword = useAuthStore((s) => s.updatePassword);

  const copy = PERU_REGISTRO_POST;



  const [copied, setCopied] = useState(false);

  const [passwordSaved, setPasswordSaved] = useState(false);

  const [showPassword, setShowPassword] = useState(true);

  const [showChangeForm, setShowChangeForm] = useState(false);

  const [newPassword, setNewPassword] = useState('');

  const [confirmNew, setConfirmNew] = useState('');

  const [changeLoading, setChangeLoading] = useState(false);

  const [changeError, setChangeError] = useState<string | null>(null);

  const [changeSuccess, setChangeSuccess] = useState(false);



  const handleCopy = async () => {

    try {

      await navigator.clipboard.writeText(password);

      setCopied(true);

      setPasswordSaved(true);

      setTimeout(() => setCopied(false), 2000);

    } catch {

      setChangeError('No se pudo copiar. Selecciona y copia manualmente.');

    }

  };



  const goToPanel = () => {

    navigate(CLIENT_PATHS.accountTab('resumen'), { replace: true });

  };



  const goToDeposit = () => {

    navigate(CLIENT_PATHS.accountTab('depositar'), { replace: true });

  };



  const handleChangePassword = async (e: React.FormEvent) => {

    e.preventDefault();

    setChangeError(null);

    const policyError = validatePasswordPolicy(newPassword);

    if (policyError) {

      setChangeError(policyError);

      return;

    }

    if (newPassword !== confirmNew) {

      setChangeError('Las contraseñas no coinciden.');

      return;

    }

    setChangeLoading(true);

    try {

      await updatePassword(newPassword);

      setChangeSuccess(true);

      setShowChangeForm(false);

      setPasswordSaved(true);

    } catch (err) {

      setChangeError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña.');

    } finally {

      setChangeLoading(false);

    }

  };



  const checklistDone = [true, passwordSaved || changeSuccess, false];



  return (

    <div className={`${registroCardClass} w-full max-w-md animate-fade-in`}>

        <div className="flex flex-col items-center text-center mb-6">

          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">

            <Shield className="text-primary" size={32} />

          </div>

          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{copy.title}</h1>

          <p className="text-muted text-sm mt-2 leading-relaxed">{copy.greeting(firstName, email)}</p>

        </div>



        <ul className="mb-6 space-y-2" aria-label="Progreso de activación">

          {copy.checklist.map((label, i) => (

            <li

              key={label}

              className={`flex items-center gap-2 text-sm ${

                checklistDone[i] ? 'text-emerald-600' : 'text-muted'

              }`}

            >

              <CircleCheck

                size={18}

                className={checklistDone[i] ? 'text-emerald-600 shrink-0' : 'text-border shrink-0'}

              />

              <span>{label}</span>

            </li>

          ))}

        </ul>



        {changeSuccess && (

          <p className="text-emerald-600 text-sm text-center mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2 px-3">

            Contraseña actualizada correctamente.

          </p>

        )}



        {changeError && !showChangeForm && (

          <p

            role="alert"

            className="text-rose-600 text-sm text-center mb-4 bg-rose-500/10 border border-rose-500/20 rounded-lg py-2 px-3"

          >

            {changeError}

          </p>

        )}



        <div className="mb-2">

          <label className={captacionLabelClass}>{copy.passwordLabel}</label>

          <div className="flex gap-2">

            <div className="relative flex-1">

              <input

                type={showPassword ? 'text' : 'password'}

                readOnly

                value={password}

                className={`${captacionInputClass} font-mono text-lg tracking-wide pr-10`}

                aria-label="Contraseña generada"

              />

              <button

                type="button"

                onClick={() => setShowPassword((v) => !v)}

                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"

                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}

              >

                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}

              </button>

            </div>

            <button

              type="button"

              onClick={handleCopy}

              className="shrink-0 min-h-[48px] px-4 rounded-lg border border-border bg-surface-inset hover:bg-surface text-foreground font-semibold text-sm flex items-center gap-2"

            >

              {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}

              {copied ? copy.copied : copy.copy}

            </button>

          </div>

        </div>



        <p className="text-[10px] text-muted mb-6 text-center">{copy.antiPhishing}</p>



        {showChangeForm ? (

          <form onSubmit={handleChangePassword} className="space-y-3 mb-4 border-t border-border pt-4">

            <p className="text-sm font-semibold text-foreground">{copy.changePassword}</p>

            {changeError && (

              <p role="alert" className="text-rose-600 text-xs bg-rose-500/10 rounded py-1.5 px-2">

                {changeError}

              </p>

            )}

            <div>

              <label htmlFor="new-password" className={captacionLabelClass}>

                {copy.newPassword}

              </label>

              <input

                id="new-password"

                type="password"

                autoComplete="new-password"

                minLength={8}

                value={newPassword}

                onChange={(e) => setNewPassword(e.target.value)}

                className={captacionInputClass}

                required

              />

            </div>

            <div>

              <label htmlFor="confirm-new-password" className={captacionLabelClass}>

                {copy.confirmPassword}

              </label>

              <input

                id="confirm-new-password"

                type="password"

                autoComplete="new-password"

                minLength={8}

                value={confirmNew}

                onChange={(e) => setConfirmNew(e.target.value)}

                className={captacionInputClass}

                required

              />

            </div>

            <div className="flex gap-2">

              <button

                type="button"

                onClick={() => {

                  setShowChangeForm(false);

                  setChangeError(null);

                }}

                className="flex-1 min-h-[44px] border border-border text-muted rounded-lg text-sm font-semibold"

              >

                {copy.cancel}

              </button>

              <button

                type="submit"

                disabled={changeLoading}

                className="flex-1 min-h-[44px] bg-primary hover:bg-primary-hover text-polar-white rounded-lg text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"

              >

                {changeLoading ? <Loader2 size={16} className="animate-spin" /> : copy.save}

              </button>

            </div>

          </form>

        ) : (

          <button

            type="button"

            onClick={() => {

              setShowChangeForm(true);

              setChangeError(null);

              setChangeSuccess(false);

            }}

            className="w-full text-center text-sm text-primary hover:text-primary/80 font-semibold mb-4"

          >

            {copy.changePassword}

          </button>

        )}



        <button type="button" onClick={goToPanel} className={`${registroCtaClass} mb-3`}>

          {copy.continuePanel}

        </button>

        <button

          type="button"

          onClick={goToDeposit}

          className="w-full min-h-[48px] border border-[#d8dcd6] text-[#0e0f0c] font-semibold rounded-[10px] hover:bg-[#f5f6f4] text-sm transition-colors"

        >

          {copy.firstDeposit}

        </button>

    </div>

  );

}


