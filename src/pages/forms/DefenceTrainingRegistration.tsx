import React from 'react';
import FormLayout, { InputField } from '../../components/forms/FormLayout';
import { firebaseService } from '../../services/firebaseService';

export default function DefenceTrainingRegistration() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await firebaseService.submitForm('defenceTrainingRegistrations', data);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout 
      title="Defence Training Registration" 
      subtitle="Career Prep for Army, Navy, and Air Force"
      onSubmit={handleSubmit}
      isLoading={loading}
      isSuccess={success}
    >
      <InputField label="Candidate Name" name="name" />
      <InputField label="NCC Status" name="nccStatus" type="select" options={["Active Cadet", "Ex-Cadet", "Non-NCC"]} />
      <InputField label="Certificate Type" name="certType" placeholder="e.g. B or C Certificate" />
      <InputField label="School/College" name="institution" />
      <InputField label="Education Level" name="education" />
      <InputField label="Date of Birth" name="dob" type="date" />
      <InputField label="Mobile Number" name="mobile" type="tel" />
      <InputField label="Email Address" name="email" type="email" />
      <InputField label="Force Selection" name="force" type="select" options={["Army", "Navy", "Air Force"]} />
      <InputField label="Police Station" name="policeStation" />
      <InputField label="Pin Code" name="pinCode" />
      <div className="md:col-span-2">
        <InputField label="Full Address" name="address" />
      </div>
    </FormLayout>
  );
}
