'use client';

import { useActionState } from 'react';
import {useFormStatus} from 'react-dom';
import { authenticate } from '@/lib/actions';
import { Button } from './catalyst/button';
import { ArrowRight, Loader2, MessageCircleWarningIcon } from 'lucide-react';
import { Input } from './catalyst/input';
import { Subheading } from './catalyst/heading';
import { Text } from './catalyst/text';
import { Link } from './catalyst/link';
import AudlaLogo from './logo';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending} type="submit">
      {pending ? (
        <>
          Connexion en cours <Loader2 className="ml-auto h-5 w-5 animate-spin text-gray-50" />
        </>
      ) : (
        <>
          Se connecter <ArrowRight className="ml-auto h-5 w-5 text-gray-50" />
        </>
      )}
    </Button>
  );
}

export default function LoginForm() {
  const [errorMessage, action, isPending] = useActionState(authenticate, undefined);

  return (
    <main className="space-y-3 border border-gray-400/20 bg-gray-300/20 backdrop-blur-md shadow-xl dark:bg-gray-900 px-8 py-8 flex flex-col gap-5 rounded-xl max-w-[90vw] lg:max-w-lg min-w-[450px] p-6 mx-auto my-auto">
      <form action={action} className="">
        <div className="flex-1 flex flex-col gap-1 rounded-lg">
          <AudlaLogo className="h-8 my-10 self-center justify-self-center mx-auto" />
          <div />
          <div>
            <h1 className="mb-3 text-xl font-bold">Connexion vers le portail Audla</h1>
            <Text className="sr-only">Connection par courriel</Text>
          </div>

          <div className="space-y-1 flex flex-col">
            <Subheading>Email</Subheading>
            <Input aria-label="Email" name="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-1 flex flex-col">
            <div className="flex justify-between">
              <Subheading>Password</Subheading>
              <Link href="/forgot-password" className="text-sm">
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              aria-label="Password"
              name="password"
              minLength={6}
              type="password"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton />
          {errorMessage && (
            <div
              className="flex pt-5 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              <MessageCircleWarningIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
        </div>
      </form>
    </main>
  );
}

