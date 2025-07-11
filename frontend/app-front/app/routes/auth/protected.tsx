import React from 'react';
import { Outlet } from 'react-router-dom';
import type { Route } from './+types/protected';

export async function loader({ request }: Route.LoaderArgs) {
  const { getSession } = await import('../../session/sessions.server');
  const { redirect } = await import('react-router');

  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('accessToken')) {
    return redirect('/login');
  }

  return null;
}

export default function ProtectedLayout() {
  return <Outlet />;
}


