import React from 'react';
import { useParams } from 'react-router-dom';
import { StudentProfileView } from './StudentProfileView';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Student id missing</div>;
  return <StudentProfileView studentId={id} />;
};
