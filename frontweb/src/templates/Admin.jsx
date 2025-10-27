import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Admin(){
  // The detailed Users UI was moved to Settings.jsx per the user's request.
  return <Navigate to="/settings" replace />;
}
