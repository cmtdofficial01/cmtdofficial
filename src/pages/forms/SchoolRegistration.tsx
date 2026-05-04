import React from 'react';
import FormLayout, { InputField } from '../../components/forms/FormLayout';
import { firebaseService } from '../../services/firebaseService';

export default function SchoolRegistration() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await firebaseService.submitForm('schoolRegistrations', {
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
      title="School Registration" 
      subtitle="Institutional Application for Schools without NCC Unit"
      onSubmit={handleSubmit}
      isLoading={loading}
      isSuccess={success}
    >
      <InputField label="School Name" name="schoolName" />
      <InputField label="Location" name="location" />
      <InputField label="Principal Name" name="principalName" />
      <InputField label="ANO / CTO Name" name="anoCtoName" />
      <InputField label="Contact Number" name="contactNumber" type="tel" />
      <InputField label="ANO/CTO Number" name="anoNumber" />
      <InputField label="Total Students" name="totalStudents" type="number" />
      <InputField label="Wing Selection" name="wingSelection" type="select" options={["Army", "Navy", "Air"]} />
      <InputField label="Nearest Railway Station" name="station" />
      <InputField label="Police Station" name="policeStation" />
      <InputField label="Email Address" name="email" type="email" />
      <InputField label="Pin Code" name="pinCode" />
      <div className="md:col-span-2">
        <InputField label="Full Address" name="address" />
      </div>
    </FormLayout>
  );
}
