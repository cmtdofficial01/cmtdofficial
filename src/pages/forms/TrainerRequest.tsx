import React from 'react';
import FormLayout, { InputField } from '../../components/forms/FormLayout';
import { firebaseService } from '../../services/firebaseService';

export default function TrainerRequest() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await firebaseService.submitForm('trainerRequests', {
        ...data,
        totalStudents: Number(data.totalStudents)
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout 
      title="Trainer Request" 
      subtitle="Request Professional Trainers for your Institution"
      onSubmit={handleSubmit}
      isLoading={loading}
      isSuccess={success}
    >
      <InputField label="School Name" name="schoolName" />
      <InputField label="Total Students" name="totalStudents" type="number" />
      <InputField label="ANO / CTO Name" name="anoCtoName" />
      <InputField label="Principal Name" name="principalName" />
      <InputField label="Contact Number" name="contactNumber" type="tel" />
      <InputField label="Location" name="location" />
      <InputField label="Pin Code" name="pinCode" />
      <InputField label="Police Station" name="policeStation" />
      <InputField label="Nearest Station" name="nearestStation" />
      <InputField label="Wing Type" name="wingType" type="select" options={["Army", "Navy", "Air"]} />
      <InputField label="Email" name="email" type="email" />
    </FormLayout>
  );
}
